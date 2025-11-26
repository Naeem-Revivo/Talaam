const Question = require('../../../models/question');
const StudentAnswer = require('../../../models/studentAnswer');
const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');

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

module.exports = {
  getAvailableQuestions,
  getQuestionById,
  submitStudyAnswer,
  startTest,
  submitTestAnswers,
  getTestHistory,
  getStudyHistory,
  getTestResultById,
};


