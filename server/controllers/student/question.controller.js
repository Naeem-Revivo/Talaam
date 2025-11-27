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
 * Get overall test summary for a student
 * GET /api/student/questions/test/summary?exam=...
 */
const getTestSummary = async (req, res, next) => {
  try {
    const { exam } = req.query;
    const studentId = req.user.id;
    const filters = {};

    if (exam) {
      filters.exam = exam;
    }

    const summary = await questionService.getTestSummary(studentId, filters);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get combined session history (test + study)
 * GET /api/student/questions/sessions?mode=all&page=1&limit=10
 */
const getSessionHistory = async (req, res, next) => {
  try {
    const { mode = 'all', page = 1, limit = 10 } = req.query;
    const studentId = req.user.id;

    const result = await questionService.getSessionHistory(studentId, {
      mode,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get session detail (test or study)
 * GET /api/student/questions/sessions/:sessionId
 */
const getSessionDetail = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const studentId = req.user.id;

    const detail = await questionService.getSessionDetail(studentId, sessionId);

    res.status(200).json({
      success: true,
      data: detail,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get incorrect items for a session
 * GET /api/student/questions/sessions/:sessionId/incorrect
 */
const getSessionIncorrect = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const studentId = req.user.id;

    const detail = await questionService.getSessionIncorrectItems(
      studentId,
      sessionId
    );

    res.status(200).json({
      success: true,
      data: detail,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get plan structure (subjects → topics → questions) for a given plan
 * GET /api/student/questions/plan/structure?planId=...
 */
const getPlanStructure = async (req, res, next) => {
  try {
    const { planId } = req.query;
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'planId query parameter is required',
      });
    }

    const structure = await questionService.getPlanStructure(planId);

    res.status(200).json({
      success: true,
      data: structure,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
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
  getTestSummary,
  getSessionHistory,
  getSessionDetail,
  getSessionIncorrect,
  getPlanStructure,
  getStudyHistory,
};


