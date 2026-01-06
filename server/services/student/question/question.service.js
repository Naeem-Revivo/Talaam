const Question = require('../../../models/question');
const StudentAnswer = require('../../../models/studentAnswer');
const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');
const Plan = require('../../../models/plan');
const { prisma } = require('../../../config/db/prisma');

/**
 * Get available questions for students (only completed and visible questions)
 * Can filter by exam, subject, topic
 */
const getAvailableQuestions = async (filters = {}) => {
  const where = {
    status: 'completed', // Only show completed questions
    isVisible: true, // Only show visible questions
  };

  if (filters.exam) {
    where.examId = filters.exam;
  }
  if (filters.subject) {
    where.subjectId = filters.subject;
  }
  // Support multiple topics (comma-separated or array) - takes priority over single topic
  if (filters.topics) {
    const topicIds = Array.isArray(filters.topics) 
      ? filters.topics 
      : filters.topics.split(',').map(id => id.trim()).filter(Boolean);
    if (topicIds.length > 0) {
      where.topicId = { in: topicIds };
    }
  } else if (filters.topic) {
    // Single topic filter (only if topics not provided)
    where.topicId = filters.topic;
  }

  const questions = await prisma.question.findMany({
    where,
    include: {
      exam: {
        select: { id: true, name: true }
      },
      subject: {
        select: { id: true, name: true }
      },
      topic: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Remove correctAnswer from response (students shouldn't see it before answering)
  return questions.map((q) => {
    const questionObj = { ...q };
    delete questionObj.correctAnswer;
    // Map Prisma fields to expected format
    return {
      ...questionObj,
      exam: q.exam ? { id: q.examId, ...q.exam } : null,
      subject: q.subject ? { id: q.subjectId, ...q.subject } : null,
      topic: q.topic ? { id: q.topicId, ...q.topic } : null,
      examId: q.examId, // Include examId directly for easier access
      subjectId: q.subjectId,
      topicId: q.topicId,
      _id: q.id,
    };
  });
};

/**
 * Get question by ID for student (without correct answer)
 * Includes flag information if student has flagged this question
 */
const getQuestionById = async (questionId, studentId = null) => {
  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      status: 'completed',
      isVisible: true, // Only show visible questions
    },
    include: {
      exam: {
        select: { name: true }
      },
      subject: {
        select: { name: true }
      },
      topic: {
        select: { name: true }
      }
    }
  });

  if (!question) {
    throw new Error('Question not found or not available');
  }

  const questionObj = { ...question };
  delete questionObj.correctAnswer;
  
  // Include flag information if student has flagged this question
  // Always include flag info if student flagged it, even if rejected
  let flagInfo = null;
  if (studentId && question.flaggedById === studentId && question.flagType === 'student') {
    flagInfo = {
      isFlagged: question.isFlagged,
      flagStatus: question.flagStatus || 'pending',
      flagReason: question.flagReason,
      flagRejectionReason: question.flagRejectionReason,
    };
  }
  
  // Map Prisma fields to expected format
  return {
    ...questionObj,
    exam: question.exam,
    subject: question.subject,
    topic: question.topic,
    _id: question.id,
    ...flagInfo, // Include flag info if applicable
  };
};

/**
 * Study Mode: Submit answer and get immediate feedback
 */
const submitStudyAnswer = async (studentId, questionId, selectedAnswer) => {
  // Get question with correct answer
  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
    status: 'completed',
      isVisible: true, // Only allow visible questions
    }
  });

  if (!question) {
    throw new Error('Question not found or not available');
  }

  // Check if answer is correct
  const isCorrect = question.correctAnswer === selectedAnswer;

  // Save student answer
  const studentAnswer = await StudentAnswer.create({
    student: studentId,
    mode: 'study',
    exam: question.examId,
    subject: question.subjectId,
    topic: question.topicId,
    question: questionId,
    selectedAnswer,
    isCorrect,
    status: 'completed',
  });

  // Return feedback with explanation
  return {
    questionId: question.id,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    explanation: question.explanation,
    questionText: question.questionText,
    options: question.options,
    questionType: question.questionType,
    submittedAt: studentAnswer.createdAt,
  };
};

/**
 * Test Mode: Start a test (get questions without answers)
 */
const startTest = async (filters = {}) => {
  const questions = await getAvailableQuestions(filters);

  if (questions.length === 0) {
    throw new Error('No questions available for the selected filters');
  }

  return questions;
};

/**
 * Test Mode: Submit test answers and get results
 */
const submitTestAnswers = async (studentId, examId, answers, timeTaken = null) => {
  // Ensure examId is a string (not an object)
  const examIdString = typeof examId === 'string' ? examId : (examId?.id || examId);
  if (!examIdString) {
    throw new Error('Exam ID is required');
  }

  // Validate exam exists (using Prisma)
  const exam = await prisma.exam.findUnique({
    where: { id: examIdString },
  });
  if (!exam) {
    throw new Error('Exam not found');
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new Error('Answers are required');
  }

  // Get all questions with correct answers
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds },
    status: 'completed',
      isVisible: true, // Only allow visible questions
      examId: examIdString,
    }
  });

  if (questions.length !== questionIds.length) {
    throw new Error('Some questions not found or not available');
  }

  // Create a map for quick lookup
  const questionMap = new Map();
  questions.forEach((q) => {
    questionMap.set(q.id.toString(), q);
  });

  // Process answers and calculate results
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  const processedAnswers = [];

  answers.forEach((answer) => {
    const question = questionMap.get(answer.questionId);
    if (!question) {
      throw new Error(`Question ${answer.questionId} not found`);
    }

    // Handle unanswered questions (null, undefined, or empty string)
    const hasAnswer = answer.selectedAnswer !== null && 
                     answer.selectedAnswer !== undefined && 
                     answer.selectedAnswer !== '';
    
    const isCorrect = hasAnswer && question.correctAnswer === answer.selectedAnswer;
    
    if (hasAnswer) {
      if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    }
    // Unanswered questions don't increment either count (they get 0 points)

    processedAnswers.push({
      question: question.id,
      selectedAnswer: answer.selectedAnswer || '', // Empty string for unanswered (not null)
      isCorrect: hasAnswer ? isCorrect : false, // false for unanswered
    });
  });

  const totalQuestions = answers.length;
  const score = correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Get exam, subject, topic from first question
  const firstQuestion = questions[0];

  // Save test results
  const studentAnswer = await StudentAnswer.create({
    student: studentId,
    mode: 'test',
    exam: examIdString,
    subject: firstQuestion.subjectId,
    topic: firstQuestion.topicId,
    answers: processedAnswers,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    timeTaken: timeTaken || null, // Time in milliseconds
    status: 'completed',
  });

  // Prepare detailed results with explanations
  const detailedResults = questions.map((question) => {
    const studentAnswerData = processedAnswers.find(
      (a) => a.question.toString() === question.id.toString()
    );

    return {
      questionId: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: studentAnswerData ? studentAnswerData.selectedAnswer : null,
      isCorrect: studentAnswerData ? studentAnswerData.isCorrect : false,
      explanation: question.explanation,
    };
  });

  return {
    testId: studentAnswer.id,
    exam: {
      id: exam.id,
      name: exam.name,
    },
    summary: {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || null,
    },
    results: detailedResults,
    submittedAt: studentAnswer.createdAt,
  };
};

/**
 * Get student's test history
 */
const getTestHistory = async (studentId, filters = {}) => {
  const query = {
    student: studentId,
    mode: 'test',
  };

  if (filters.exam) {
    query.exam = filters.exam;
  }

  const testHistory = await StudentAnswer.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50);

  return testHistory.map((test) => ({
    id: test._id,
    exam: test.exam,
    subject: test.subject,
    topic: test.topic,
    totalQuestions: test.totalQuestions,
    correctAnswers: test.correctAnswers,
    incorrectAnswers: test.incorrectAnswers,
    score: test.score,
    percentage: test.percentage,
    submittedAt: test.createdAt,
  }));
};

/**
 * Get student's study history
 */
const getStudyHistory = async (studentId, filters = {}) => {
  const query = {
    student: studentId,
    mode: 'study',
  };

  if (filters.exam) {
    query.exam = filters.exam;
  }
  if (filters.question) {
    query.question = filters.question;
  }

  const studyHistory = await StudentAnswer.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('question', 'questionText questionType')
    .sort({ createdAt: -1 })
    .limit(filters.limit || 100);

  return studyHistory;
};

/**
 * Get detailed test result by ID
 */
const getTestResultById = async (studentId, testId) => {
  const test = await prisma.studentAnswer.findFirst({
    where: {
      id: testId,
      studentId: studentId,
      mode: 'test',
    },
    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      topic: {
        select: {
          id: true,
          name: true,
        },
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              questionText: true,
              questionType: true,
              options: true,
              explanation: true,
              correctAnswer: true,
            },
          },
        },
      },
    },
  });

  if (!test) {
    throw new Error('Test result not found');
  }

  // Map answers to detailed results
  const detailedResults = test.answers.map((answer) => {
    const question = answer.question;
    if (!question) return null;
    return {
      questionId: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      explanation: question.explanation,
    };
  }).filter(Boolean); // Remove null entries

  return {
    id: test.id,
    mode: 'test',
    exam: test.exam ? { id: test.exam.id, name: test.exam.name } : null,
    subject: test.subject ? { id: test.subject.id, name: test.subject.name } : null,
    topic: test.topic ? { id: test.topic.id, name: test.topic.name } : null,
    summary: {
      totalQuestions: test.totalQuestions,
      correctAnswers: test.correctAnswers,
      incorrectAnswers: test.incorrectAnswers,
      score: test.score,
      percentage: test.percentage,
    },
    results: detailedResults,
    submittedAt: test.createdAt,
  };
};

/**
 * Get overall test statistics for a student
 */
const getTestSummary = async (studentId, filters = {}) => {
  const where = {
    studentId: studentId,
    mode: 'test',
    status: 'completed',
    totalQuestions: { gt: 0 }, // Only count tests with questions
  };

  // Only add examId filter if it's provided and valid
  if (filters.exam && typeof filters.exam === 'string' && filters.exam.trim() !== '') {
    where.examId = filters.exam.trim();
  }

  const tests = await prisma.studentAnswer.findMany({
    where,
    include: {
      answers: {
        include: {
          question: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const questionBankWhere = {
    status: 'completed',
    // Note: isVisible might not exist in database, so we'll filter by status only
    // If isVisible exists, it will be included, otherwise it will be ignored
  };
  // Only add examId filter if it's provided and valid
  if (filters.exam && typeof filters.exam === 'string' && filters.exam.trim() !== '') {
    questionBankWhere.examId = filters.exam.trim();
  }
  const totalQuestionsInBank = await prisma.question.count({
    where: questionBankWhere
  });

  if (tests.length === 0) {
    return {
      totalTests: 0,
      totalQuestionsAttempted: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      accuracy: 0,
      averageScore: 0,
      averagePercentage: 0,
      lastTestDate: null,
      percentOfQuestionBankCovered: 0,
      uniqueQuestionsAttempted: 0,
      uniqueQuestionsCorrect: 0,
      subjectAccuracy: [],
      topicAccuracy: [],
      averageTimePerQuestion: 0,
    };
  }

  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;
  let totalIncorrectAnswers = 0;
  let totalScore = 0;
  let totalPercentage = 0;
  let totalTimeTaken = 0; // Total time in milliseconds
  let lastTestDate = null;
  const answerRecords = [];
  const uniqueQuestionsAttempted = new Set();
  const uniqueQuestionsCorrect = new Set();

  tests.forEach((test) => {
    totalQuestionsAttempted += test.totalQuestions || 0;
    totalCorrectAnswers += test.correctAnswers || 0;
    totalIncorrectAnswers += test.incorrectAnswers || 0;
    totalScore += test.score || 0;
    totalPercentage += test.percentage || 0;
    totalTimeTaken += test.timeTaken || 0; // Add time taken in milliseconds
    if (!lastTestDate || test.createdAt > lastTestDate) {
      lastTestDate = test.createdAt;
    }

    if (Array.isArray(test.answers)) {
      test.answers.forEach((answer) => {
        if (!answer.questionId) return;
        const questionId = answer.questionId.toString();
        uniqueQuestionsAttempted.add(questionId);
        if (answer.isCorrect) {
          uniqueQuestionsCorrect.add(questionId);
        }
        answerRecords.push({
          questionId,
          isCorrect: Boolean(answer.isCorrect),
        });
      });
    }
  });

  const totalTests = tests.length;
  const totalQuestionsAnswered = totalCorrectAnswers + totalIncorrectAnswers;
  const accuracy =
    totalQuestionsAttempted > 0
      ? Number(((totalCorrectAnswers / totalQuestionsAttempted) * 100).toFixed(2))
      : 0;
  const correctAnswerPercentage =
    totalQuestionsAnswered > 0
      ? Number(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2))
      : 0;
  const percentOfQuestionBankCovered =
    totalQuestionsInBank > 0
      ? Number(((uniqueQuestionsCorrect.size / totalQuestionsInBank) * 100).toFixed(2))
      : 0;

  const questionMetadata = {};
  if (uniqueQuestionsAttempted.size > 0) {
    const questionDocs = await prisma.question.findMany({
      where: {
        id: { in: Array.from(uniqueQuestionsAttempted) },
        isVisible: true, // Only show visible questions
      },
      include: {
        subject: {
          select: { id: true, name: true }
        },
        topic: {
          select: { id: true, name: true }
        }
      }
    });

    questionDocs.forEach((doc) => {
      questionMetadata[doc.id.toString()] = {
        subjectId: doc.subject?.id?.toString() || null,
        subjectName: doc.subject?.name || null,
        topicId: doc.topic?.id?.toString() || null,
        topicName: doc.topic?.name || null,
      };
    });
  }

  const subjectAccuracyMap = new Map();
  const topicAccuracyMap = new Map();

  answerRecords.forEach((record) => {
    const meta = questionMetadata[record.questionId];
    if (!meta) return;

    if (meta.subjectId) {
      const subjectStat =
        subjectAccuracyMap.get(meta.subjectId) || {
          subjectId: meta.subjectId,
          subjectName: meta.subjectName,
          attempted: 0,
          correct: 0,
          accuracy: 0,
        };
      subjectStat.attempted += 1;
      if (record.isCorrect) {
        subjectStat.correct += 1;
      }
      subjectAccuracyMap.set(meta.subjectId, subjectStat);
    }

    if (meta.topicId) {
      const topicStat =
        topicAccuracyMap.get(meta.topicId) || {
          topicId: meta.topicId,
          topicName: meta.topicName,
          attempted: 0,
          correct: 0,
          accuracy: 0,
        };
      topicStat.attempted += 1;
      if (record.isCorrect) {
        topicStat.correct += 1;
      }
      topicAccuracyMap.set(meta.topicId, topicStat);
    }
  });

  const subjectAccuracy = Array.from(subjectAccuracyMap.values()).map((stat) => ({
    ...stat,
    accuracy: stat.attempted
      ? Number(((stat.correct / stat.attempted) * 100).toFixed(2))
      : 0,
  }));

  const topicAccuracy = Array.from(topicAccuracyMap.values()).map((stat) => ({
    ...stat,
    accuracy: stat.attempted
      ? Number(((stat.correct / stat.attempted) * 100).toFixed(2))
      : 0,
  }));

  // Calculate average time per question in seconds
  let averageTimePerQuestion = 0;
  if (totalQuestionsAttempted > 0 && totalTimeTaken > 0) {
    // Convert milliseconds to seconds and divide by total questions
    averageTimePerQuestion = Math.round(totalTimeTaken / 1000 / totalQuestionsAttempted);
  }

  return {
    totalTests,
    totalQuestionsAttempted,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    accuracy,
    correctAnswerPercentage,
    averageScore: Number((totalScore / totalTests).toFixed(2)),
    averagePercentage: Number((totalPercentage / totalTests).toFixed(2)),
    lastTestDate,
    percentOfQuestionBankCovered,
    totalQuestionsInBank, // Add this for progress calculation
    uniqueQuestionsAttempted: uniqueQuestionsAttempted.size,
    uniqueQuestionsCorrect: uniqueQuestionsCorrect.size,
    subjectAccuracy,
    topicAccuracy,
    averageTimePerQuestion, // Average time per question in seconds
  };
};

/**
 * Get overall study mode statistics for a student
 */
const getStudySummary = async (studentId, filters = {}) => {
  const where = {
    studentId: studentId,
    mode: 'study',
    status: 'completed',
    answers: {
      some: {}, // Only study sessions with at least one answer
    },
  };

  // Only add examId filter if it's provided and valid
  if (filters.exam && typeof filters.exam === 'string' && filters.exam.trim() !== '') {
    where.examId = filters.exam.trim();
  }

  const studySessions = await prisma.studentAnswer.findMany({
    where,
    include: {
      answers: {
        include: {
          question: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (studySessions.length === 0) {
    return {
      totalSessions: 0,
      totalQuestionsAttempted: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      accuracy: 0,
      averagePercentage: 0,
      lastStudyDate: null,
    };
  }

  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;
  let totalIncorrectAnswers = 0;
  let totalPercentage = 0;
  let lastStudyDate = null;
  const uniqueQuestionsAttempted = new Set();

  studySessions.forEach((session) => {
    const sessionAnswers = session.answers || [];
    const sessionTotalQuestions = sessionAnswers.length;
    const sessionCorrectAnswers = sessionAnswers.filter(a => a.isCorrect).length;
    const sessionIncorrectAnswers = sessionTotalQuestions - sessionCorrectAnswers;

    totalQuestionsAttempted += sessionTotalQuestions;
    totalCorrectAnswers += sessionCorrectAnswers;
    totalIncorrectAnswers += sessionIncorrectAnswers;
    
    if (session.percentage !== null && session.percentage !== undefined) {
      totalPercentage += session.percentage;
    } else if (sessionTotalQuestions > 0) {
      totalPercentage += (sessionCorrectAnswers / sessionTotalQuestions) * 100;
    }

    if (!lastStudyDate || session.createdAt > lastStudyDate) {
      lastStudyDate = session.createdAt;
    }

    // Track unique questions
    sessionAnswers.forEach((answer) => {
      if (answer.questionId) {
        uniqueQuestionsAttempted.add(answer.questionId.toString());
      }
    });
  });

  const totalSessions = studySessions.length;
  const totalQuestionsAnswered = totalCorrectAnswers + totalIncorrectAnswers;
  const accuracy =
    totalQuestionsAttempted > 0
      ? Number(((totalCorrectAnswers / totalQuestionsAttempted) * 100).toFixed(2))
      : 0;
  const averagePercentage = totalSessions > 0
    ? Number((totalPercentage / totalSessions).toFixed(2))
    : 0;

  return {
    totalSessions,
    totalQuestionsAttempted,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    accuracy,
    averagePercentage,
    lastStudyDate,
    uniqueQuestionsAttempted: uniqueQuestionsAttempted.size,
  };
};

/**
 * Get last 10 sessions (test + study) for performance chart
 */
const getPerformanceData = async (studentId) => {
  const where = {
    studentId: studentId,
    status: 'completed',
    OR: [
      {
        mode: 'test',
        totalQuestions: { gt: 0 },
      },
      {
        mode: 'study',
        answers: {
          some: {},
        },
      },
    ],
  };

  const sessions = await prisma.studentAnswer.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    select: {
      id: true,
      mode: true,
      totalQuestions: true,
      correctAnswers: true,
      percentage: true,
      createdAt: true,
      answers: {
        select: {
          isCorrect: true,
        },
      },
    },
  });

  // Calculate accuracy for each session
  // Sessions are ordered by createdAt desc (most recent first)
  const performanceData = sessions.map((session, index) => {
    let accuracy = 0;

    if (session.mode === 'test') {
      // For test mode, use percentage or calculate from correctAnswers/totalQuestions
      if (session.percentage !== null && session.percentage !== undefined) {
        accuracy = Number(session.percentage.toFixed(2));
      } else if (session.totalQuestions > 0) {
        accuracy = Number(
          ((session.correctAnswers / session.totalQuestions) * 100).toFixed(2)
        );
      }
    } else if (session.mode === 'study') {
      // For study mode, calculate from answers array
      if (session.answers && session.answers.length > 0) {
        const correctCount = session.answers.filter((a) => a.isCorrect).length;
        accuracy = Number(((correctCount / session.answers.length) * 100).toFixed(2));
      }
    }

    // Label sessions: most recent (index 0) = S10, oldest (index 9) = S1
    // After reverse: S1 (oldest) to S10 (most recent)
    const sessionNumber = sessions.length - index;

    return {
      session: `S${sessionNumber}`,
      accuracy: Math.round(accuracy), // Round to whole number for display
      mode: session.mode,
    };
  });

  // Reverse to show oldest first (S1 to S10)
  return performanceData.reverse();
};

/**
 * Get day-wise test mode accuracy trend data
 * Groups test sessions by date and calculates average accuracy per day
 */
const getTestModeAccuracyTrend = async (studentId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Get all test mode sessions within the date range
  const sessions = await prisma.studentAnswer.findMany({
    where: {
      studentId: studentId,
      mode: 'test',
      status: 'completed',
      totalQuestions: { gt: 0 },
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      id: true,
      totalQuestions: true,
      correctAnswers: true,
      percentage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group sessions by date (YYYY-MM-DD)
  const sessionsByDate = {};
  
  sessions.forEach((session) => {
    const date = new Date(session.createdAt);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!sessionsByDate[dateKey]) {
      sessionsByDate[dateKey] = {
        date: dateKey,
        sessions: [],
        totalAccuracy: 0,
        sessionCount: 0,
      };
    }
    
    // Calculate accuracy for this session
    let accuracy = 0;
    if (session.percentage !== null && session.percentage !== undefined) {
      accuracy = Number(session.percentage);
    } else if (session.totalQuestions > 0) {
      accuracy = (session.correctAnswers / session.totalQuestions) * 100;
    }
    
    sessionsByDate[dateKey].sessions.push(accuracy);
    sessionsByDate[dateKey].totalAccuracy += accuracy;
    sessionsByDate[dateKey].sessionCount += 1;
  });

  // Calculate average accuracy per day and format dates
  const trendData = Object.values(sessionsByDate)
    .map((dayData) => {
      const avgAccuracy = dayData.totalAccuracy / dayData.sessionCount;
      const date = new Date(dayData.date);
      
      // Format date as "Jan 15", "Jan 17", etc.
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
      
      return {
        date: formattedDate,
        dateKey: dayData.date,
        accuracy: Math.round(avgAccuracy),
        sessionCount: dayData.sessionCount,
      };
    })
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey)); // Sort by date

  return trendData;
};

/**
 * Get combined session history (test + study) with pagination
 */
const getSessionHistory = async (studentId, filters = {}) => {
  const { mode = 'all' } = filters;
  let { page = 1, limit = 10 } = filters;

  const allowedModes = ['all', 'test', 'study'];
  if (!allowedModes.includes(mode)) {
    const error = new Error('Mode must be one of: all, test, study');
    error.statusCode = 400;
    throw error;
  }

  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  // Build Prisma where clause - show completed and paused sessions with actual questions
  const baseWhere = {
    studentId: studentId,
    status: {
      in: ['completed', 'paused'], // Show both completed and paused sessions
    },
  };

  // Build mode-specific where clause
  let where;
  if (mode === 'test') {
    where = {
      ...baseWhere,
      mode: 'test',
      totalQuestions: { gt: 0 }, // Only test sessions with questions
    };
  } else if (mode === 'study') {
    where = {
      ...baseWhere,
      mode: 'study',
      answers: {
        some: {}, // Only study sessions with at least one answer
      },
    };
  } else {
    // For 'all' mode, use OR condition
    where = {
      ...baseWhere,
      OR: [
        {
          mode: 'test',
          totalQuestions: { gt: 0 },
        },
        {
          mode: 'study',
          answers: {
            some: {},
          },
        },
      ],
    };
  }

  // Fetch sessions with Prisma
  const [sessions, total] = await Promise.all([
    prisma.studentAnswer.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      include: {
        exam: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                questionType: true,
              },
            },
          },
        },
      },
    }),
    prisma.studentAnswer.count({
      where,
    }),
  ]);

  // All sessions should already be valid (filtered at DB level), but double-check
  const validSessions = sessions.filter(session => {
    if (session.mode === 'test') {
      return (session.totalQuestions || 0) > 0;
    } else {
      // Study mode: must have answers
      return (session.answers?.length || 0) > 0;
    }
  });

  const formatted = validSessions.map((session, index) => {
    // Calculate total questions and correct answers
    let totalQuestions = 0;
    let correctAnswers = 0;

    if (session.mode === 'test') {
      totalQuestions = session.totalQuestions || 0;
      correctAnswers = session.correctAnswers || 0;
    } else {
      // Study mode: count from answers array
      totalQuestions = session.answers?.length || 0;
      correctAnswers = session.answers?.filter(a => a.isCorrect).length || 0;
    }

    const percentCorrect =
      totalQuestions > 0
        ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
        : 0;

    // Calculate average time per question (in seconds)
    let averageTimeSeconds = null;
    if (session.timeTaken && totalQuestions > 0) {
      averageTimeSeconds = Math.floor(session.timeTaken / 1000 / totalQuestions);
    }

    // Calculate session code based on position in the full list (not just current page)
    // Use the filtered index to maintain correct numbering
    const sessionNumber = skip + index + 1;

    return {
      id: session.id,
      sessionCode: `S${String(sessionNumber).padStart(3, '0')}`,
      mode: session.mode,
      status: session.status, // Include status (completed or paused)
      attemptDate: session.createdAt,
      totalQuestions,
      correctAnswers,
      percentCorrect,
      averageTimeSeconds,
      exam: session.exam
        ? { id: session.exam.id, name: session.exam.name }
        : null,
      subject: session.subject
        ? { id: session.subject.id, name: session.subject.name }
        : null,
      topic: session.topic
        ? { id: session.topic.id, name: session.topic.name }
        : null,
      reviewUrls: {
        detail: `/api/student/questions/sessions/${session.id}`,
        incorrect: `/api/student/questions/sessions/${session.id}/incorrect`,
      },
    };
  });

  // Total is already calculated correctly from the filtered where clause
  const totalWithQuestions = total;

  return {
    sessions: formatted,
    pagination: {
      totalItems: totalWithQuestions, // Use filtered count
      page,
      limit,
      totalPages: Math.ceil(totalWithQuestions / limit),
      hasNextPage: skip + formatted.length < totalWithQuestions,
      hasPreviousPage: page > 1,
    },
    filters: {
      mode,
    },
  };
};

/**
 * Get unified session detail (delegates to test/study handlers)
 */
const getSessionDetail = async (studentId, sessionId) => {
  const session = await prisma.studentAnswer.findFirst({
    where: {
      id: sessionId,
      studentId: studentId,
    },
    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      topic: {
        select: {
          id: true,
          name: true,
        },
      },
      question: {
        select: {
          id: true,
          questionText: true,
          questionType: true,
          options: true,
          explanation: true,
          correctAnswer: true,
        },
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              questionText: true,
              questionType: true,
              options: true,
              explanation: true,
              correctAnswer: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (session.mode === 'test') {
    return getTestResultById(studentId, sessionId);
  }

  // Study mode: Handle both single question (old format) and multiple questions (new format)
  if (session.mode === 'study') {
    // Check if session has multiple questions (new format with answers array)
    if (session.answers && Array.isArray(session.answers) && session.answers.length > 0) {
      const results = session.answers.map((answer) => {
        const question = answer.question;
        if (!question) return null;

        return {
          questionId: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          explanation: question.explanation,
        };
      }).filter(Boolean);

      return {
        id: session.id,
        mode: 'study',
        exam: session.exam ? { id: session.exam.id, name: session.exam.name } : null,
        subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
        topic: session.topic ? { id: session.topic.id, name: session.topic.name } : null,
        results,
        submittedAt: session.createdAt,
      };
    } else if (session.question) {
      // Old format: single question
      return {
        id: session.id,
        mode: 'study',
        exam: session.exam ? { id: session.exam.id, name: session.exam.name } : null,
        subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
        topic: session.topic ? { id: session.topic.id, name: session.topic.name } : null,
        question: {
          id: session.question.id,
          questionText: session.question.questionText,
          questionType: session.question.questionType,
          options: session.question.options,
          explanation: session.question.explanation,
          correctAnswer: session.question.correctAnswer,
        },
        selectedAnswer: session.selectedAnswer,
        isCorrect: session.isCorrect,
        submittedAt: session.createdAt,
      };
    }
  }

  const error = new Error('Study session question not found');
  error.statusCode = 404;
  throw error;
};

/**
 * Get only incorrect items for a session
 */
const getSessionIncorrectItems = async (studentId, sessionId) => {
  const session = await prisma.studentAnswer.findFirst({
    where: {
      id: sessionId,
      studentId: studentId,
    },
    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      topic: {
        select: {
          id: true,
          name: true,
        },
      },
      question: {
        select: {
          id: true,
          questionText: true,
          questionType: true,
          options: true,
          explanation: true,
          correctAnswer: true,
        },
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              questionText: true,
              questionType: true,
              options: true,
              explanation: true,
              correctAnswer: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (session.mode === 'test') {
    const detail = await getTestResultById(studentId, sessionId);
    return {
      id: detail.id,
      mode: 'test',
      exam: detail.exam,
      subject: detail.subject,
      topic: detail.topic,
      incorrect: detail.results.filter((item) => !item.isCorrect),
    };
  }

  // Study mode: Handle both single question (old format) and multiple questions (new format)
  if (session.mode === 'study') {
    // Check if session has multiple questions (new format with answers array)
    if (session.answers && Array.isArray(session.answers) && session.answers.length > 0) {
      // Filter incorrect answers
      const incorrectAnswers = session.answers.filter((a) => !a.isCorrect);
      
      if (incorrectAnswers.length === 0) {
        return {
          id: session.id,
          mode: 'study',
          exam: session.exam ? { id: session.exam.id, name: session.exam.name } : null,
          subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
          topic: session.topic ? { id: session.topic.id, name: session.topic.name } : null,
          incorrect: [],
        };
      }

      const incorrect = incorrectAnswers.map((answer) => {
        const question = answer.question;
        if (!question) return null;

        return {
          questionId: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: answer.selectedAnswer,
          explanation: question.explanation,
        };
      }).filter(Boolean);

      return {
        id: session.id,
        mode: 'study',
        exam: session.exam ? { id: session.exam.id, name: session.exam.name } : null,
        subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
        topic: session.topic ? { id: session.topic.id, name: session.topic.name } : null,
        incorrect,
      };
    } else if (session.question) {
      // Old format: single question
      return {
        id: session.id,
        mode: 'study',
        exam: session.exam ? { id: session.exam.id, name: session.exam.name } : null,
        subject: session.subject ? { id: session.subject.id, name: session.subject.name } : null,
        topic: session.topic ? { id: session.topic.id, name: session.topic.name } : null,
        incorrect: session.isCorrect
          ? []
          : [
              {
                questionId: session.question.id,
                questionText: session.question.questionText,
                questionType: session.question.questionType,
                options: session.question.options,
                correctAnswer: session.question.correctAnswer,
                selectedAnswer: session.selectedAnswer,
                explanation: session.question.explanation,
              },
            ],
      };
    }
  }

  const error = new Error('Study session question not found');
  error.statusCode = 404;
  throw error;
};

/**
 * Get hierarchical structure of subjects → topics → questions for a given plan
 */
const getPlanStructure = async (planId) => {
  if (!planId) {
    const error = new Error('planId is required');
    error.statusCode = 400;
    throw error;
  }

  const plan = await Plan.findById(planId).select('name status');
  if (!plan) {
    const error = new Error('Plan not found');
    error.statusCode = 404;
    throw error;
  }

  const subjects = await Subject.find({ plan: planId })
    .sort({ name: 1 })
    .select('name description plan');

  if (subjects.length === 0) {
    return {
      plan: {
        id: plan._id,
        name: plan.name,
        status: plan.status,
      },
      subjects: [],
    };
  }

  const subjectIds = subjects.map((subject) => subject._id);

  const topics = await Topic.find({
    parentSubject: { $in: subjectIds },
  })
    .sort({ name: 1 })
    .select('name description parentSubject');

  const topicIds = topics.map((topic) => topic._id);

  const questions = await prisma.question.findMany({
    where: {
    status: 'completed',
      isVisible: true, // Only show visible questions
      subjectId: { in: subjectIds },
      ...(topicIds.length ? { topicId: { in: topicIds } } : {}),
    },
    include: {
      subject: {
        select: { name: true }
      },
      topic: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const topicsBySubject = topics.reduce((acc, topic) => {
    const key = topic.parentSubject.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(topic);
    return acc;
  }, {});

  const questionsByTopic = questions.reduce((acc, question) => {
    const key = question.topicId?.toString() || question.topic?.id?.toString();
    if (!key) {
      return acc;
    }
    const collection = acc.get(key) || [];
    const questionObj = { ...question };
    delete questionObj.correctAnswer;
    collection.push({
      id: question.id,
      questionText: questionObj.questionText,
      questionType: questionObj.questionType,
      options: questionObj.options,
      explanation: questionObj.explanation,
    });
    acc.set(key, collection);
    return acc;
  }, new Map());

  const structuredSubjects = subjects.map((subject) => {
    const subjectTopics = topicsBySubject[subject._id.toString()] || [];

    const formattedTopics = subjectTopics.map((topic) => ({
      id: topic._id,
      name: topic.name,
      description: topic.description,
      questions: questionsByTopic.get(topic._id.toString()) || [],
    }));

    return {
      id: subject._id,
      name: subject.name,
      description: subject.description,
      topics: formattedTopics,
    };
  });

  return {
    plan: {
      id: plan._id,
      name: plan.name,
      status: plan.status,
    },
    subjects: structuredSubjects,
  };
};

/**
 * Save complete study mode session results
 */
const saveStudySessionResults = async (studentId, sessionData) => {
  const {
    examId,
    subjectId,
    topicId,
    questions, // Array of { questionId, selectedAnswer, isCorrect }
    timeTaken, // Time in milliseconds
  } = sessionData;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('Questions array is required');
  }

  // Ensure examId is a string (not an object)
  const examIdString = typeof examId === 'string' ? examId : (examId?.id || examId);
  if (!examIdString) {
    throw new Error('Exam ID is required');
  }

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter((q) => q.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Get exam to validate (using Prisma)
  const exam = await prisma.exam.findUnique({
    where: { id: examIdString },
  });
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Process answers for StudentAnswerQuestion records
  const processedAnswers = questions.map((q) => ({
    question: q.questionId,
    selectedAnswer: q.selectedAnswer,
    isCorrect: q.isCorrect || false,
  }));

  // Save study session results
  const studentAnswer = await StudentAnswer.create({
    student: studentId,
    mode: 'study',
    exam: examIdString,
    subject: subjectId || null,
    topic: topicId || null,
    answers: processedAnswers,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    timeTaken: timeTaken || null,
    status: 'completed',
  });

  return {
    sessionId: studentAnswer.id,
    exam: {
      id: exam.id,
      name: exam.name,
    },
    summary: {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || null,
    },
    submittedAt: studentAnswer.createdAt,
  };
};

/**
 * Pause a session (study or test mode)
 * Saves the current session state with status "paused"
 */
const pauseSession = async (studentId, sessionData) => {
  const {
    mode, // 'study' or 'test'
    examId,
    subjectId,
    topicId,
    questions, // Array of { questionId, selectedAnswer, isCorrect? }
    currentIndex,
    timeTaken, // Time in milliseconds
    timerEndTime, // For test mode - when timer should end
  } = sessionData;

  // Ensure examId is a string (not an object)
  const examIdString = typeof examId === 'string' ? examId : (examId?.id || examId);
  if (!examIdString) {
    throw new Error('Exam ID is required');
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error('Questions array is required');
  }

  // Get exam to validate
  const exam = await prisma.exam.findUnique({
    where: { id: examIdString },
  });
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Process answers for StudentAnswerQuestion records
  // Format 1: For StudentAnswer.create() - uses questionId as string
  const processedAnswersForCreate = questions.map((q) => {
    const hasAnswer = q.selectedAnswer !== null && 
                     q.selectedAnswer !== undefined && 
                     q.selectedAnswer !== '';
    
    // For study mode: isCorrect should be null for unanswered questions
    // For test mode: isCorrect can be false for unanswered (they count as incorrect)
    const isCorrect = mode === 'study' 
      ? (hasAnswer ? (q.isCorrect ?? null) : null)
      : (hasAnswer ? (q.isCorrect ?? false) : false);
    
    return {
      question: q.questionId, // StudentAnswer model expects 'question' key that maps to questionId
      selectedAnswer: q.selectedAnswer || '',
      isCorrect: isCorrect,
    };
  });
  
  // Format 2: For nested create in Prisma update - uses connect syntax
  const processedAnswersForUpdate = questions.map((q) => {
    const hasAnswer = q.selectedAnswer !== null && 
                     q.selectedAnswer !== undefined && 
                     q.selectedAnswer !== '';
    
    // For study mode: isCorrect should be null for unanswered questions
    // For test mode: isCorrect can be false for unanswered (they count as incorrect)
    const isCorrect = mode === 'study' 
      ? (hasAnswer ? (q.isCorrect ?? null) : null)
      : (hasAnswer ? (q.isCorrect ?? false) : false);
    
    return {
      question: {
        connect: { id: q.questionId },
      },
      selectedAnswer: q.selectedAnswer || '',
      isCorrect: isCorrect,
    };
  });

  // Calculate statistics from answered questions
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter((q) => {
    const hasAnswer = q.selectedAnswer !== null && 
                     q.selectedAnswer !== undefined && 
                     q.selectedAnswer !== '';
    return hasAnswer;
  });
  
  // For study mode, only count answered questions; for test mode, count all
  const correctAnswers = mode === 'study'
    ? answeredQuestions.filter((q) => q.isCorrect === true).length
    : questions.filter((q) => q.isCorrect === true).length;
  const incorrectAnswers = mode === 'study'
    ? answeredQuestions.filter((q) => q.isCorrect === false).length
    : questions.filter((q) => q.isCorrect === false).length;
  const score = correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Check if a paused session already exists for this exam/mode/subject/topic
  const existingPausedSession = await prisma.studentAnswer.findFirst({
    where: {
      studentId: studentId,
      mode: mode,
      examId: examIdString,
      subjectId: subjectId || null,
      topicId: topicId || null,
      status: 'paused',
    },
    include: {
      answers: true,
    },
  });

  let studentAnswer;
  
  if (existingPausedSession) {
    // Update existing paused session
    // First, delete existing answers
    await prisma.studentAnswerQuestion.deleteMany({
      where: {
        studentAnswerId: existingPausedSession.id,
      },
    });

    // Update the session
    studentAnswer = await prisma.studentAnswer.update({
      where: {
        id: existingPausedSession.id,
      },
      data: {
        answers: {
          create: processedAnswersForUpdate,
        },
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        score,
        percentage,
        timeTaken: timeTaken || null,
        status: 'paused',
        updatedAt: new Date(),
      },
      include: {
        exam: true,
        subject: true,
        topic: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
    });
  } else {
    // Create new paused session
    studentAnswer = await StudentAnswer.create({
      student: studentId,
      mode: mode,
      exam: examIdString,
      subject: subjectId || null,
      topic: topicId || null,
      answers: processedAnswersForCreate,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || null,
      status: 'paused', // Mark as paused
    });
  }

  // Store additional pause metadata in a JSON field if needed
  // For now, we'll use the currentIndex from the questions array structure
  // The paused session can be resumed by fetching the session detail

  // Get exam info (might be included in studentAnswer or need to fetch)
  const examInfo = studentAnswer.exam || exam;

  return {
    sessionId: studentAnswer.id,
    exam: {
      id: examInfo.id,
      name: examInfo.name,
    },
    mode,
    currentIndex: currentIndex || 0,
    timerEndTime: timerEndTime || null,
    summary: {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || null,
    },
    pausedAt: existingPausedSession ? studentAnswer.updatedAt : studentAnswer.createdAt,
    updated: !!existingPausedSession, // Indicate if this was an update
  };
};

/**
 * Complete a paused session (update status from paused to completed)
 */
const completePausedSession = async (studentId, sessionId, sessionData) => {
  const {
    mode, // 'study' or 'test'
    questions, // Array of { questionId, selectedAnswer, isCorrect? }
    timeTaken, // Time in milliseconds
  } = sessionData;

  // Find the paused session
  const pausedSession = await prisma.studentAnswer.findFirst({
    where: {
      id: sessionId,
      studentId: studentId,
      status: 'paused',
    },
    include: {
      answers: true,
    },
  });

  if (!pausedSession) {
    throw new Error('Paused session not found');
  }

  // For test mode, we need to fetch questions to calculate correctness
  // For study mode, we use the isCorrect value from the frontend
  let questionMap = new Map();
  if (mode === 'test') {
    const questionIds = questions.map((q) => q.questionId);
    const questionDetails = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
      },
    });
    questionDetails.forEach((q) => {
      questionMap.set(q.id.toString(), q);
    });
  }

  // Process answers for update
  const processedAnswersForUpdate = questions.map((q) => {
    const hasAnswer = q.selectedAnswer !== null && 
                     q.selectedAnswer !== undefined && 
                     q.selectedAnswer !== '';
    
    let isCorrect;
    if (mode === 'test') {
      // For test mode: calculate correctness by comparing with question's correctAnswer
      const question = questionMap.get(q.questionId);
      if (question) {
        isCorrect = hasAnswer && question.correctAnswer === q.selectedAnswer;
      } else {
        // Question not found, default to false
        isCorrect = false;
      }
    } else {
      // For study mode: use the isCorrect value from frontend (already calculated)
      isCorrect = hasAnswer ? (q.isCorrect ?? null) : null;
    }
    
    return {
      question: {
        connect: { id: q.questionId },
      },
      selectedAnswer: q.selectedAnswer || '',
      isCorrect: isCorrect ?? false,
    };
  });

  // Calculate statistics
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter((q) => {
    const hasAnswer = q.selectedAnswer !== null && 
                     q.selectedAnswer !== undefined && 
                     q.selectedAnswer !== '';
    return hasAnswer;
  });
  
  // Recalculate correctness for statistics if in test mode
  let correctAnswers, incorrectAnswers;
  if (mode === 'test') {
    // For test mode, recalculate based on actual correctness
    correctAnswers = processedAnswersForUpdate.filter((a) => a.isCorrect === true).length;
    incorrectAnswers = processedAnswersForUpdate.filter((a) => a.isCorrect === false && a.selectedAnswer !== '').length;
  } else {
    // For study mode, use the isCorrect values from frontend
    correctAnswers = answeredQuestions.filter((q) => q.isCorrect === true).length;
    incorrectAnswers = answeredQuestions.filter((q) => q.isCorrect === false).length;
  }
  const score = correctAnswers;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Delete existing answers
  await prisma.studentAnswerQuestion.deleteMany({
    where: {
      studentAnswerId: pausedSession.id,
    },
  });

  // Update the session to completed status
  const updatedSession = await prisma.studentAnswer.update({
    where: {
      id: pausedSession.id,
    },
    data: {
      answers: {
        create: processedAnswersForUpdate,
      },
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || pausedSession.timeTaken,
      status: 'completed',
      updatedAt: new Date(),
    },
    include: {
      exam: true,
      subject: true,
      topic: true,
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  // For test mode, calculate detailed results (reuse questionMap from earlier)
  if (mode === 'test') {
    const detailedResults = questions.map((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) return null;

      const hasAnswer = answer.selectedAnswer !== null && 
                       answer.selectedAnswer !== undefined && 
                       answer.selectedAnswer !== '';
      const isCorrect = hasAnswer && question.correctAnswer === answer.selectedAnswer;

      return {
        questionId: question.id,
        questionText: question.questionText,
        selectedAnswer: answer.selectedAnswer || '',
        correctAnswer: question.correctAnswer,
        isCorrect: hasAnswer ? isCorrect : false,
        explanation: question.explanation || '',
      };
    }).filter(Boolean);

    return {
      sessionId: updatedSession.id,
      summary: {
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        score,
        percentage,
        timeTaken: timeTaken || pausedSession.timeTaken,
      },
      results: detailedResults,
    };
  }

  return {
    sessionId: updatedSession.id,
    summary: {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
      timeTaken: timeTaken || pausedSession.timeTaken,
    },
  };
};

/**
 * Get paused session details for resuming
 */
const getPausedSession = async (studentId, sessionId) => {
  const session = await prisma.studentAnswer.findFirst({
    where: {
      id: sessionId,
      studentId: studentId,
      status: 'paused',
    },
    include: {
      exam: true,
      subject: true,
      topic: true,
      answers: {
        include: {
          question: {
            include: {
              exam: {
                select: {
                  id: true,
                  name: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
              topic: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        // Note: Answers are created in order during pause, so order should be preserved
        // No orderBy needed since StudentAnswerQuestion doesn't have createdAt
      },
    },
  });

  if (!session) {
    throw new Error('Paused session not found');
  }

  // Transform to format needed for resuming
  const questions = session.answers.map((answer, index) => {
    const question = answer.question;
    if (!question) return null;

    const optionsObj = question.options || {};
    const options = ['A', 'B', 'C', 'D'].map((key) => ({
      id: key,
      text: optionsObj[key] || '',
    })).filter(opt => opt.text);

    return {
      id: question.id,
      itemNumber: index + 1,
      prompt: question.questionText || '',
      options,
      correctAnswer: question.correctAnswer || null,
      explanation: question.explanation || '',
      questionType: question.questionType || 'MCQ',
      exam: session.exam,
      subject: session.subject,
      topic: session.topic,
    };
  }).filter(Boolean);

  // Build question state from answers
  const questionState = session.answers.map((answer, index) => {
    // Check if question was actually answered (has a non-empty selectedAnswer)
    const hasAnswer = answer.selectedAnswer !== null && 
                     answer.selectedAnswer !== undefined && 
                     answer.selectedAnswer !== '';
    
    // For test mode, don't show feedback until test is completed
    // For study mode, show feedback if answer was submitted and has feedback
    const showFeedback = session.mode === 'study' && 
                         hasAnswer &&
                         answer.isCorrect !== null && 
                         answer.isCorrect !== undefined;
    
    // In test mode, determine status based on selectedAnswer
    // Non-empty = submitted, empty = might be skipped (we'll infer from context)
    const isSubmitted = session.mode === 'test' && hasAnswer;
    
    // For paused sessions, if selectedAnswer is empty, it might have been skipped
    // But we can't be 100% sure, so we'll set status based on isSubmitted
    // The frontend will handle setting status to 'skipped' when appropriate
    const status = session.mode === 'test' 
      ? (isSubmitted ? 'submit' : null) 
      : null;
    
    // For study mode: if question hasn't been answered, isCorrect should be null (not false)
    // false means "answered incorrectly", null means "not answered yet"
    const isCorrect = hasAnswer ? answer.isCorrect : null;
    
    return {
      selectedOption: answer.selectedAnswer || null,
      isCorrect: isCorrect,
      showFeedback: showFeedback,
      showHint: false,
      isSubmitted: isSubmitted,
      status: status,
    };
  });

  // Find the first unanswered question as current index
  let currentIndex = 0;
  for (let i = 0; i < questionState.length; i++) {
    if (!questionState[i].selectedOption || questionState[i].selectedOption === '') {
      currentIndex = i;
      break;
    }
  }
  // If all answered, go to last question
  if (currentIndex === 0 && questionState.every(q => q.selectedOption)) {
    currentIndex = questionState.length - 1;
  }

  return {
    sessionId: session.id,
    mode: session.mode,
    examId: session.examId,
    subjectId: session.subjectId,
    topicId: session.topicId,
    questions,
    questionState,
    currentIndex,
    sessionStartTime: session.createdAt.getTime(),
    timeTaken: session.timeTaken || 0,
    timerEndTime: null, // Will be recalculated when resuming test mode
  };
};

/**
 * Flag question by Student
 * POST /api/student/questions/:questionId/flag
 */
const flagQuestionByStudent = async (questionId, flagReason, studentId) => {
  // Check if question exists and is visible
  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      status: 'completed',
      isVisible: true,
    },
  });

  if (!question) {
    throw new Error('Question not found or not available');
  }

  if (!flagReason || !flagReason.trim()) {
    throw new Error('Flag reason is required');
  }

  // Update question with flag
  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      isFlagged: true,
      flaggedById: studentId,
      flagReason: flagReason.trim(),
      flagType: 'student',
      flagStatus: 'pending',
      updatedAt: new Date(),
    },
  });

  // Create history entry
  await prisma.questionHistory.create({
    data: {
      questionId: questionId,
      action: 'flagged',
      performedById: studentId,
      role: 'student',
      notes: `Question flagged by student: ${flagReason.trim()}`,
    },
  });

  return updatedQuestion;
};

/**
 * Get student's flagged questions with rejection reasons
 */
const getStudentFlaggedQuestions = async (studentId) => {
  const questions = await prisma.question.findMany({
    where: {
      flaggedById: studentId,
      flagType: 'student',
    },
    include: {
      exam: {
        select: { id: true, name: true },
      },
      subject: {
        select: { id: true, name: true },
      },
      topic: {
        select: { id: true, name: true },
      },
      flagReviewedBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return questions.map((q) => ({
    ...q,
    exam: q.exam ? { id: q.examId, ...q.exam } : null,
    subject: q.subject ? { id: q.subjectId, ...q.subject } : null,
    topic: q.topic ? { id: q.topicId, ...q.topic } : null,
  }));
};

module.exports = {
  getAvailableQuestions,
  getQuestionById,
  submitStudyAnswer,
  startTest,
  submitTestAnswers,
  saveStudySessionResults,
  getTestHistory,
  getStudyHistory,
  getTestResultById,
  getTestSummary,
  getStudySummary,
  getPerformanceData,
  getTestModeAccuracyTrend,
  getSessionHistory,
  getSessionDetail,
  getSessionIncorrectItems,
  getPlanStructure,
  pauseSession,
  getPausedSession,
  completePausedSession,
  flagQuestionByStudent,
  getStudentFlaggedQuestions,
};


