const questionService = require('../../services/student').questionService;

/**
 * Get available questions for students
 * GET /api/student/questions?exam=...&subject=...&topic=...
 */
const getAvailableQuestions = async (req, res, next) => {
  try {
    const { exam, subject, topic } = req.query;

    const filters = {};
    if (exam) filters.exam = exam;
    if (subject) filters.subject = subject;
    if (topic) filters.topic = topic;

    const questions = await questionService.getAvailableQuestions(filters);

    res.status(200).json({
      success: true,
      data: {
        questions,
        count: questions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question by ID for student
 * GET /api/student/questions/:questionId
 */
const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await questionService.getQuestionById(questionId);

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Study Mode: Submit answer and get immediate feedback
 * POST /api/student/questions/study
 * Body: { questionId, selectedAnswer }
 */
const submitStudyAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedAnswer } = req.body;
    const studentId = req.user.id;

    if (!questionId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and selected answer are required',
      });
    }

    if (!['A', 'B', 'C', 'D'].includes(selectedAnswer)) {
      return res.status(400).json({
        success: false,
        message: 'Selected answer must be A, B, C, or D',
      });
    }

    const result = await questionService.submitStudyAnswer(
      studentId,
      questionId,
      selectedAnswer
    );

    res.status(200).json({
      success: true,
      data: result,
      message: result.isCorrect ? 'Correct answer! ✓' : 'Incorrect answer ✗',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test Mode: Start a test (get questions without answers)
 * GET /api/student/questions/test/start?exam=...&subject=...&topic=...
 */
const startTest = async (req, res, next) => {
  try {
    const { exam, subject, topic } = req.query;

    if (!exam) {
      return res.status(400).json({
        success: false,
        message: 'Exam ID is required',
      });
    }

    const filters = { exam };
    if (subject) filters.subject = subject;
    if (topic) filters.topic = topic;

    const questions = await questionService.startTest(filters);

    res.status(200).json({
      success: true,
      data: {
        questions,
        count: questions.length,
      },
      message: 'Test started. Answer all questions and submit when done.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test Mode: Submit test answers and get results
 * POST /api/student/questions/test/submit
 * Body: { examId, answers: [{ questionId, selectedAnswer }, ...] }
 */
const submitTestAnswers = async (req, res, next) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user.id;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: 'Exam ID is required',
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required and must not be empty',
      });
    }

    // Validate answers format
    for (const answer of answers) {
      if (!answer.questionId || !answer.selectedAnswer) {
        return res.status(400).json({
          success: false,
          message: 'Each answer must have questionId and selectedAnswer',
        });
      }
      if (!['A', 'B', 'C', 'D'].includes(answer.selectedAnswer)) {
        return res.status(400).json({
          success: false,
          message: 'Selected answer must be A, B, C, or D',
        });
      }
    }

    const result = await questionService.submitTestAnswers(studentId, examId, answers);

    res.status(200).json({
      success: true,
      data: result,
      message: `Test completed! Score: ${result.summary.correctAnswers}/${result.summary.totalQuestions} (${result.summary.percentage}%)`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's test history
 * GET /api/student/questions/test/history?exam=...&limit=...
 */
const getTestHistory = async (req, res, next) => {
  try {
    const { exam, limit } = req.query;
    const studentId = req.user.id;

    const filters = {};
    if (exam) filters.exam = exam;
    if (limit) filters.limit = parseInt(limit, 10);

    const history = await questionService.getTestHistory(studentId, filters);

    res.status(200).json({
      success: true,
      data: {
        history,
        count: history.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed test result by ID
 * GET /api/student/questions/test/:testId
 */
const getTestResultById = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const studentId = req.user.id;

    const result = await questionService.getTestResultById(studentId, testId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's study history
 * GET /api/student/questions/study/history?exam=...&question=...&limit=...
 */
const getStudyHistory = async (req, res, next) => {
  try {
    const { exam, question, limit } = req.query;
    const studentId = req.user.id;

    const filters = {};
    if (exam) filters.exam = exam;
    if (question) filters.question = question;
    if (limit) filters.limit = parseInt(limit, 10);

    const history = await questionService.getStudyHistory(studentId, filters);

    res.status(200).json({
      success: true,
      data: {
        history,
        count: history.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableQuestions,
  getQuestionById,
  submitStudyAnswer,
  startTest,
  submitTestAnswers,
  getTestHistory,
  getTestResultById,
  getStudyHistory,
};


