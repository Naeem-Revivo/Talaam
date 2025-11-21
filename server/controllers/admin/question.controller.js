const questionService = require('../../services/admin/question.service');

/**
 * Get all questions for superadmin with optional search
 * GET /admin/questions/all?search=...&status=...
 */
const getAllQuestionsForSuperadmin = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view all questions',
      });
    }

    const filters = {};
    if (status) {
      filters.status = status;
    }

    const [questions, counts] = await Promise.all([
      questionService.getAllQuestionsForSuperadmin(filters, search),
      questionService.getQuestionCounts({}, '', false),
    ]);

    const response = {
      success: true,
      data: {
        summary: counts,
        questions: questions.map((q) => ({
          id: q._id,
          exam: q.exam,
          subject: q.subject,
          topic: q.topic,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          status: q.status,
          createdBy: q.createdBy,
          lastModifiedBy: q.lastModifiedBy,
          approvedBy: q.approvedBy,
          rejectedBy: q.rejectedBy,
          rejectionReason: q.rejectionReason,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        })),
      },
    };

    console.log('[QUESTION] GET /admin/questions/all → 200 (ok)', {
      count: questions.length,
      summary: counts,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/all → error', error);
    next(error);
  }
};

/**
 * Get classification of questions by exam type (tahsely/qudrat) for any authenticated user
 * GET /admin/questions/classification?type=tahsely
 */
const getQuestionClassificationByExamType = async (req, res, next) => {
  try {
    const { type } = req.query;

    if (!type || typeof type !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "type" is required and must be tahsely or qudrat',
      });
    }

    const normalizedType = type.trim().toLowerCase();
    if (!['tahsely', 'qudrat'].includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "type" must be either tahsely or qudrat',
      });
    }

    const classification = await questionService.getQuestionClassificationByExamType(normalizedType);

    const response = {
      success: true,
      data: classification,
    };

    console.log('[QUESTION] GET /admin/questions/classification → 200 (ok)', {
      type: normalizedType,
      examsCount: classification.exams.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/classification → error', error);
    next(error);
  }
};

/**
 * Get single question details for superadmin
 * GET /admin/questions/all/:questionId
 */
const getQuestionDetailForSuperadmin = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view question details',
      });
    }

    const question = await questionService.getQuestionById(
      questionId,
      req.user.id,
      req.user.role
    );

    const response = {
      success: true,
      data: {
        question: {
          id: question._id,
          exam: question.exam,
          subject: question.subject,
          topic: question.topic,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          createdBy: question.createdBy,
          lastModifiedBy: question.lastModifiedBy,
          approvedBy: question.approvedBy,
          rejectedBy: question.rejectedBy,
          rejectionReason: question.rejectionReason,
          history: question.history,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] GET /admin/questions/all/:questionId → 200 (ok)', { questionId });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/all/:questionId → error', error);
    if (error.message === 'Question not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Create question by Gatherer
 * POST /admin/questions
 */
const createQuestion = async (req, res, next) => {
  try {
    const {
      exam,
      subject,
      topic,
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    console.log('[QUESTION] POST /admin/questions → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Validate required fields
    const errors = [];

    if (!exam) {
      errors.push({ field: 'exam', message: 'Exam is required' });
    }
    if (!subject) {
      errors.push({ field: 'subject', message: 'Subject is required' });
    }
    if (!topic) {
      errors.push({ field: 'topic', message: 'Topic is required' });
    }
    if (!questionText || !questionText.trim()) {
      errors.push({ field: 'questionText', message: 'Question text is required' });
    }
    if (!questionType) {
      errors.push({ field: 'questionType', message: 'Question type is required' });
    }

    // Validate MCQ specific fields
    if (questionType === 'MCQ') {
      if (!options || !options.A || !options.B || !options.C || !options.D) {
        errors.push({
          field: 'options',
          message: 'All four options (A, B, C, D) are required for MCQ questions',
        });
      }
      // Correct answer is required for Gatherer when creating MCQ questions
      if (!correctAnswer || !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        errors.push({
          field: 'correctAnswer',
          message: 'Correct answer is required and must be A, B, C, or D for MCQ questions',
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Create question
    const questionData = {
      exam,
      subject,
      topic,
      questionText: questionText.trim(),
      questionType,
      explanation: explanation ? explanation.trim() : '',
    };

    if (questionType === 'MCQ') {
      questionData.options = {
        A: options.A.trim(),
        B: options.B.trim(),
        C: options.C.trim(),
        D: options.D.trim(),
      };
      // Correct answer is required for MCQ questions
      questionData.correctAnswer = correctAnswer;
    }

    const question = await questionService.createQuestion(questionData, req.user.id);

    const response = {
      success: true,
      message: 'Question created successfully and sent for processor approval',
      data: {
        question: {
          id: question._id,
          exam: question.exam,
          subject: question.subject,
          topic: question.topic,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          createdBy: question.createdBy,
          createdAt: question.createdAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions → 201 (created)', { questionId: question._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions → error', error);
    if (error.message === 'Exam not found' || error.message === 'Subject not found' || error.message === 'Topic not found or does not belong to the selected subject') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

/**
 * Get questions by status
 * GET /admin/questions?status=pending_processor
 */
const getQuestions = async (req, res, next) => {
  try {
    const { status } = req.query;

    console.log('[QUESTION] GET /admin/questions → requested', {
      status,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Determine status based on role
    let queryStatus = status;
    if (!queryStatus) {
      // Default status based on role
      switch (req.user.adminRole) {
        case 'gatherer':
          queryStatus = 'pending_processor'; // Gatherer sees their submitted questions
          break;
        case 'creator':
          queryStatus = 'pending_creator';
          break;
        case 'explainer':
          queryStatus = 'pending_explainer';
          break;
        case 'processor':
          queryStatus = 'pending_processor';
          break;
        default:
          queryStatus = 'pending_processor';
      }
    }

    const questions = await questionService.getQuestionsByStatus(
      queryStatus,
      req.user.id,
      req.user.adminRole
    );

    const response = {
      success: true,
      data: {
        questions: questions.map((q) => ({
          id: q._id,
          exam: q.exam,
          subject: q.subject,
          topic: q.topic,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          status: q.status,
          createdBy: q.createdBy,
          lastModifiedBy: q.lastModifiedBy,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        })),
      },
    };

    console.log('[QUESTION] GET /admin/questions → 200 (ok)', { count: questions.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions → error', error);
    next(error);
  }
};

/**
 * Get single question by ID
 * GET /admin/questions/:questionId
 */
const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    console.log('[QUESTION] GET /admin/questions/:questionId → requested', {
      questionId,
      requestedBy: req.user.id,
    });

    const question = await questionService.getQuestionById(
      questionId,
      req.user.id,
      req.user.adminRole
    );

    const response = {
      success: true,
      data: {
        question: {
          id: question._id,
          exam: question.exam,
          subject: question.subject,
          topic: question.topic,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          createdBy: question.createdBy,
          lastModifiedBy: question.lastModifiedBy,
          approvedBy: question.approvedBy,
          rejectedBy: question.rejectedBy,
          rejectionReason: question.rejectionReason,
          history: question.history,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] GET /admin/questions/:questionId → 200 (ok)', {
      questionId: question._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/:questionId → error', error);
    if (error.message === 'Question not found' || error.message === 'Access denied') {
      return res.status(error.message === 'Question not found' ? 404 : 403).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Update question by Creator
 * PUT /admin/questions/:questionId
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const {
      exam,
      subject,
      topic,
      questionText,
      questionType,
      options,
      correctAnswer,
    } = req.body;

    console.log('[QUESTION] PUT /admin/questions/:questionId → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Validation will be done in the service layer
    // Basic validation here for immediate feedback
    const errors = [];
    if (questionType === 'MCQ') {
      if (options && (!options.A || !options.B || !options.C || !options.D)) {
        errors.push({
          field: 'options',
          message: 'All four options (A, B, C, D) are required for MCQ questions',
        });
      }
      if (correctAnswer && !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        errors.push({
          field: 'correctAnswer',
          message: 'Correct answer must be A, B, C, or D for MCQ questions',
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Prepare update data
    const updateData = {};
    if (exam !== undefined) updateData.exam = exam;
    if (subject !== undefined) updateData.subject = subject;
    if (topic !== undefined) updateData.topic = topic;
    if (questionText !== undefined) updateData.questionText = questionText.trim();
    if (questionType !== undefined) updateData.questionType = questionType;
    if (options !== undefined) {
      updateData.options = {
        A: options.A.trim(),
        B: options.B.trim(),
        C: options.C.trim(),
        D: options.D.trim(),
      };
    }
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;

    const question = await questionService.updateQuestionByCreator(
      questionId,
      updateData,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Question updated successfully and sent for processor approval',
      data: {
        question: {
          id: question._id,
          exam: question.exam,
          subject: question.subject,
          topic: question.topic,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/:questionId → 200 (updated)', {
      questionId: question._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/:questionId → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_creator status' ||
      error.message === 'Exam not found' ||
      error.message === 'Subject not found' ||
      error.message === 'Topic not found or does not belong to the selected subject'
    ) {
      return res.status(
        error.message === 'Question not found' ||
        error.message === 'Exam not found' ||
        error.message === 'Subject not found' ||
        error.message === 'Topic not found or does not belong to the selected subject'
          ? 404
          : 400
      ).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Update explanation by Explainer
 * PUT /admin/questions/:questionId/explanation
 */
const updateExplanation = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { explanation } = req.body;

    console.log('[QUESTION] PUT /admin/questions/:questionId/explanation → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!explanation || !explanation.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'explanation',
            message: 'Explanation is required',
          },
        ],
      });
    }

    const question = await questionService.updateExplanationByExplainer(
      questionId,
      explanation,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Explanation updated successfully and sent for processor approval',
      data: {
        question: {
          id: question._id,
          explanation: question.explanation,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/:questionId/explanation → 200 (updated)', {
      questionId: question._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/:questionId/explanation → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_explainer status' ||
      error.message === 'Explanation is required'
    ) {
      return res.status(
        error.message === 'Question not found' ? 404 : 400
      ).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Approve question by Processor
 * POST /admin/questions/:questionId/approve
 */
const approveQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    console.log('[QUESTION] POST /admin/questions/:questionId/approve → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    const question = await questionService.approveQuestion(questionId, req.user.id);

    const response = {
      success: true,
      message: 'Question approved successfully',
      data: {
        question: {
          id: question._id,
          status: question.status,
          approvedBy: question.approvedBy,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/:questionId/approve → 200 (approved)', {
      questionId: question._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/:questionId/approve → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_processor status'
    ) {
      return res.status(
        error.message === 'Question not found' ? 404 : 400
      ).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Reject question by Processor
 * POST /admin/questions/:questionId/reject
 */
const rejectQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/:questionId/reject → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    const question = await questionService.rejectQuestion(
      questionId,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Question rejected',
      data: {
        question: {
          id: question._id,
          status: question.status,
          rejectedBy: question.rejectedBy,
          rejectionReason: question.rejectionReason,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/:questionId/reject → 200 (rejected)', {
      questionId: question._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/:questionId/reject → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_processor status'
    ) {
      return res.status(
        error.message === 'Question not found' ? 404 : 400
      ).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }
    next(error);
  }
};

/**
 * Get topics by subject
 * GET /admin/questions/topics/:subjectId
 */
const getTopicsBySubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    console.log('[QUESTION] GET /admin/questions/topics/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
    });

    const topics = await questionService.getTopicsBySubject(subjectId);

    const response = {
      success: true,
      data: {
        topics: topics.map((topic) => ({
          id: topic._id,
          name: topic.name,
          description: topic.description,
        })),
      },
    };

    console.log('[QUESTION] GET /admin/questions/topics/:subjectId → 200 (ok)', {
      count: topics.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/topics/:subjectId → error', error);
    if (error.message === 'Subject not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

module.exports = {
  getAllQuestionsForSuperadmin,
  getQuestionClassificationByExamType,
  getQuestionDetailForSuperadmin,
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  updateExplanation,
  approveQuestion,
  rejectQuestion,
  getTopicsBySubject,
};

