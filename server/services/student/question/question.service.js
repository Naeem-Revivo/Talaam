const Question = require('../../../models/question');
const StudentAnswer = require('../../../models/studentAnswer');
const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');
const Plan = require('../../../models/plan');

/**
 * Get available questions for students (only completed questions)
 * Can filter by exam, subject, topic
 */
const getAvailableQuestions = async (filters = {}) => {
  const query = {
    status: 'completed', // Only show completed questions
  };

  if (filters.exam) {
    query.exam = filters.exam;
  }
  if (filters.subject) {
    query.subject = filters.subject;
  }
  if (filters.topic) {
    query.topic = filters.topic;
  }

  const questions = await Question.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .select('-history -createdBy -lastModifiedBy -approvedBy -rejectedBy -rejectionReason')
    .sort({ createdAt: -1 });

  // Remove correctAnswer from response (students shouldn't see it before answering)
  return questions.map((q) => {
    const questionObj = q.toObject();
    delete questionObj.correctAnswer;
    return questionObj;
  });
};

/**
 * Get question by ID for student (without correct answer)
 */
const getQuestionById = async (questionId) => {
  const question = await Question.findOne({
    _id: questionId,
    status: 'completed',
  })
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .select('-history -createdBy -lastModifiedBy -approvedBy -rejectedBy -rejectionReason');

  if (!question) {
    throw new Error('Question not found or not available');
  }

  const questionObj = question.toObject();
  delete questionObj.correctAnswer;
  return questionObj;
};

/**
 * Study Mode: Submit answer and get immediate feedback
 */
const submitStudyAnswer = async (studentId, questionId, selectedAnswer) => {
  // Get question with correct answer
  const question = await Question.findOne({
    _id: questionId,
    status: 'completed',
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
    exam: question.exam,
    subject: question.subject,
    topic: question.topic,
    question: questionId,
    selectedAnswer,
    isCorrect,
    status: 'completed',
  });

  // Return feedback with explanation
  return {
    questionId: question._id,
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
const submitTestAnswers = async (studentId, examId, answers) => {
  // Validate exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new Error('Answers are required');
  }

  // Get all questions with correct answers
  const questionIds = answers.map((a) => a.questionId);
  const questions = await Question.find({
    _id: { $in: questionIds },
    status: 'completed',
    exam: examId,
  });

  if (questions.length !== questionIds.length) {
    throw new Error('Some questions not found or not available');
  }

  // Create a map for quick lookup
  const questionMap = new Map();
  questions.forEach((q) => {
    questionMap.set(q._id.toString(), q);
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

    const isCorrect = question.correctAnswer === answer.selectedAnswer;
    if (isCorrect) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }

    processedAnswers.push({
      question: question._id,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
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
    exam: examId,
    subject: firstQuestion.subject,
    topic: firstQuestion.topic,
    answers: processedAnswers,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    status: 'completed',
  });

  // Prepare detailed results with explanations
  const detailedResults = questions.map((question) => {
    const studentAnswerData = processedAnswers.find(
      (a) => a.question.toString() === question._id.toString()
    );

    return {
      questionId: question._id,
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
    testId: studentAnswer._id,
    exam: {
      id: exam._id,
      name: exam.name,
    },
    summary: {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      percentage,
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
  const test = await StudentAnswer.findOne({
    _id: testId,
    student: studentId,
    mode: 'test',
  })
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('answers.question');

  if (!test) {
    throw new Error('Test result not found');
  }

  // Get full question details with explanations
  const questionIds = test.answers.map((a) => a.question._id);
  const questions = await Question.find({
    _id: { $in: questionIds },
  });

  const questionMap = new Map();
  questions.forEach((q) => {
    questionMap.set(q._id.toString(), q);
  });

  const detailedResults = test.answers.map((answer) => {
    const question = questionMap.get(answer.question._id.toString());
    return {
      questionId: question._id,
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      explanation: question.explanation,
    };
  });

  return {
    id: test._id,
    exam: test.exam,
    subject: test.subject,
    topic: test.topic,
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
  const query = {
    student: studentId,
    mode: 'test',
  };

  if (filters.exam) {
    query.exam = filters.exam;
  }

  const tests = await StudentAnswer.find(query).select(
    'totalQuestions correctAnswers incorrectAnswers score percentage createdAt answers.question answers.isCorrect'
  );

  const questionBankQuery = {
    status: 'completed',
  };
  if (filters.exam) {
    questionBankQuery.exam = filters.exam;
  }
  const totalQuestionsInBank = await Question.countDocuments(questionBankQuery);

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
    };
  }

  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;
  let totalIncorrectAnswers = 0;
  let totalScore = 0;
  let totalPercentage = 0;
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
    if (!lastTestDate || test.createdAt > lastTestDate) {
      lastTestDate = test.createdAt;
    }

    if (Array.isArray(test.answers)) {
      test.answers.forEach((answer) => {
        if (!answer.question) return;
        const questionId = answer.question.toString();
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
    const questionDocs = await Question.find({
      _id: { $in: Array.from(uniqueQuestionsAttempted) },
    })
      .populate('subject', 'name')
      .populate('topic', 'name')
      .select('_id subject topic');

    questionDocs.forEach((doc) => {
      questionMetadata[doc._id.toString()] = {
        subjectId: doc.subject?._id?.toString() || null,
        subjectName: doc.subject?.name || null,
        topicId: doc.topic?._id?.toString() || null,
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
  uniqueQuestionsAttempted: uniqueQuestionsAttempted.size,
  uniqueQuestionsCorrect: uniqueQuestionsCorrect.size,
  subjectAccuracy,
  topicAccuracy,
  };
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

  const query = { student: studentId };
  if (mode !== 'all') {
    query.mode = mode;
  }

  const [sessions, total] = await Promise.all([
    StudentAnswer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('exam', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name')
      .populate('question', 'questionText questionType')
      .select(
        'mode totalQuestions correctAnswers incorrectAnswers answers isCorrect question createdAt selectedAnswer averageTimeSeconds'
      )
      .lean(),
    StudentAnswer.countDocuments(query),
  ]);

  const formatted = sessions.map((session, index) => {
    const totalQuestions =
      session.mode === 'test'
        ? session.totalQuestions ||
          (Array.isArray(session.answers) ? session.answers.length : 0)
        : 1;
    const correctAnswers =
      session.mode === 'test'
        ? session.correctAnswers || 0
        : session.isCorrect
          ? 1
          : 0;
    const percentCorrect =
      totalQuestions > 0
        ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
        : 0;

    return {
      id: session._id,
      sessionCode: `S${String(skip + index + 1).padStart(3, '0')}`,
      mode: session.mode,
      attemptDate: session.createdAt,
      totalQuestions,
      correctAnswers,
      percentCorrect,
      averageTimeSeconds: session.averageTimeSeconds || null,
      exam: session.exam
        ? { id: session.exam._id, name: session.exam.name }
        : null,
      subject: session.subject
        ? { id: session.subject._id, name: session.subject.name }
        : null,
      topic: session.topic
        ? { id: session.topic._id, name: session.topic.name }
        : null,
      reviewUrls: {
        detail: `/api/student/questions/sessions/${session._id}`,
        incorrect: `/api/student/questions/sessions/${session._id}/incorrect`,
      },
    };
  });

  return {
    sessions: formatted,
    pagination: {
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + formatted.length < total,
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
  const session = await StudentAnswer.findOne({
    _id: sessionId,
    student: studentId,
  })
    .populate('question', 'questionText questionType options explanation correctAnswer')
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name');

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (session.mode === 'test') {
    return getTestResultById(studentId, sessionId);
  }

  if (!session.question) {
    const error = new Error('Study session question not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: session._id,
    mode: 'study',
    exam: session.exam,
    subject: session.subject,
    topic: session.topic,
    question: {
      id: session.question._id,
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
};

/**
 * Get only incorrect items for a session
 */
const getSessionIncorrectItems = async (studentId, sessionId) => {
  const session = await StudentAnswer.findOne({
    _id: sessionId,
    student: studentId,
  })
    .populate('question', 'questionText questionType options explanation correctAnswer')
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name');

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

  if (!session.question) {
    const error = new Error('Study session question not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: session._id,
    mode: 'study',
    exam: session.exam,
    subject: session.subject,
    topic: session.topic,
    incorrect: session.isCorrect
      ? []
      : [
          {
            questionId: session.question._id,
            questionText: session.question.questionText,
            questionType: session.question.questionType,
            options: session.question.options,
            correctAnswer: session.question.correctAnswer,
            selectedAnswer: session.selectedAnswer,
            explanation: session.question.explanation,
          },
        ],
  };
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

  const questions = await Question.find({
    status: 'completed',
    subject: { $in: subjectIds },
    ...(topicIds.length ? { topic: { $in: topicIds } } : {}),
  })
    .sort({ createdAt: -1 })
    .select('questionText questionType options explanation subject topic');

  const topicsBySubject = topics.reduce((acc, topic) => {
    const key = topic.parentSubject.toString();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(topic);
    return acc;
  }, {});

  const questionsByTopic = questions.reduce((acc, question) => {
    const key = question.topic?.toString();
    if (!key) {
      return acc;
    }
    const collection = acc.get(key) || [];
    const questionObj = question.toObject();
    delete questionObj.correctAnswer;
    collection.push({
      id: question._id,
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

module.exports = {
  getAvailableQuestions,
  getQuestionById,
  submitStudyAnswer,
  startTest,
  submitTestAnswers,
  getTestHistory,
  getStudyHistory,
  getTestResultById,
  getTestSummary,
  getSessionHistory,
  getSessionDetail,
  getSessionIncorrectItems,
  getPlanStructure,
};


