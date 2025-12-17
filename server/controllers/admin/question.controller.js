const questionService = require('../../services/admin');

/**
 * Get all questions for superadmin with optional search, filters, and pagination
 * GET /admin/questions/all?tab=all&search=...&exam=...&subject=...&topic=...&status=...&page=1&limit=5
 */
const getAllQuestionsForSuperadmin = async (req, res, next) => {
  try {
    const { 
      tab = 'all', 
      search, 
      exam, 
      subject, 
      topic, 
      status, 
      page = 1, 
      limit = 5 
    } = req.query;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view all questions',
      });
    }

    // Validate tab
    const validTabs = ['all', 'approved', 'pending', 'rejected'];
    if (tab && !validTabs.includes(tab)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'tab',
            message: `Tab must be one of: ${validTabs.join(', ')}`,
          },
        ],
      });
    }

    // Validate status if provided
    const validStatuses = [
      'pending_processor',
      'pending_creator',
      'pending_explainer',
      'completed',
      'rejected',
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'status',
            message: `Status must be one of: ${validStatuses.join(', ')}`,
          },
        ],
      });
    }

    // Validate UUIDs for exam, subject, topic (Prisma uses UUIDs, not MongoDB ObjectIds)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const errors = [];
    
    if (exam && exam.trim() !== '' && !uuidRegex.test(exam)) {
      errors.push({
        field: 'exam',
        message: 'Invalid exam ID format',
      });
    }
    
    if (subject && subject.trim() !== '' && !uuidRegex.test(subject)) {
      errors.push({
        field: 'subject',
        message: 'Invalid subject ID format',
      });
    }
    
    if (topic && topic.trim() !== '' && !uuidRegex.test(topic)) {
      errors.push({
        field: 'topic',
        message: 'Invalid topic ID format',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Build filters
    const filters = { tab };
    if (exam) filters.exam = exam;
    if (subject) filters.subject = subject;
    if (topic) filters.topic = topic;
    if (status) filters.status = status;

    // Pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
    };

    // Validate pagination
    if (pagination.page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (pagination.limit < 1 || pagination.limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Get questions with pagination and counts
    const [result, counts] = await Promise.all([
      questionService.getAllQuestionsForSuperadmin(filters, search || '', pagination),
      questionService.getQuestionCounts(filters, search || '', true),
    ]);

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    
    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (tab) queryParams.append('tab', tab);
      if (search) queryParams.append('search', search);
      if (exam) queryParams.append('exam', exam);
      if (subject) queryParams.append('subject', subject);
      if (topic) queryParams.append('topic', topic);
      if (status) queryParams.append('status', status);
      
      // Add pagination
      queryParams.append('page', pageNum);
      queryParams.append('limit', pagination.limit);
      
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pagination.page + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pagination.page - 1) : null,
      current: buildUrl(pagination.page),
    };

    const response = {
      success: true,
      message: 'Questions retrieved successfully',
      data: {
        summary: {
          total: counts.total,
          approved: counts.approved,
          pending: counts.pending,
          rejected: counts.rejected,
        },
        questions: result.questions.map((q) => ({
          id: q._id || q.id,
          question: {
            text: q.questionText,
            type: q.questionType,
          },
          subject: q.subject ? {
            id: q.subject._id || q.subject.id,
            name: q.subject.name,
          } : null,
          topic: q.topic ? {
            id: q.topic._id || q.topic.id,
            name: q.topic.name,
          } : null,
          stage: q.exam ? {
            id: q.exam.id || q.exam._id,
            name: q.exam.name,
          } : null,
          status: q.status,
          isFlagged: q.isFlagged || false,
          flagReason: q.flagReason || null,
          createdBy: q.createdBy ? {
            id: q.createdBy.id || q.createdBy._id,
            name: q.createdBy.name || q.createdBy.fullName || 'N/A',
          } : null,
          lastModifiedBy: q.lastModifiedBy ? {
            id: q.lastModifiedBy.id || q.lastModifiedBy._id,
            name: q.lastModifiedBy.name || q.lastModifiedBy.fullName || 'N/A',
          } : null,
          history: q.history && q.history.length > 0 ? q.history.map((h) => ({
            action: h.action,
            performedBy: h.performedBy ? {
              id: h.performedBy.id || h.performedBy._id,
              name: h.performedBy.name || h.performedBy.fullName || 'N/A',
              role: h.performedBy.adminRole || 'N/A',
            } : null,
            timestamp: h.timestamp || h.createdAt,
            createdAt: h.timestamp || h.createdAt, // Keep for backward compatibility
          })) : [],
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: {
          tab,
          search: search || null,
          exam: exam || null,
          subject: subject || null,
          topic: topic || null,
          status: status || null,
        },
      },
    };

    console.log('[QUESTION] GET /admin/questions/all → 200 (ok)', {
      count: result.questions.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
      summary: counts,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/all → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter parameter',
      });
    }
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

    // Format dates
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Get creation date from history or createdAt
    const creationHistory = question.history.find(h => h.action === 'created');
    const submittedDate = creationHistory ? creationHistory.timestamp : question.createdAt;

    const response = {
      success: true,
      message: 'Question details retrieved successfully',
      data: {
        question: {
          // Question Info
          id: question._id || question.id,
          questionId: `Q-${question.subject?.name?.substring(0, 3).toUpperCase() || 'GEN'}-${String(question._id || question.id).slice(-4).toUpperCase()}`,
          status: question.status,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options || null,
          
          // Correct Answer
          correctAnswer: question.correctAnswer ? {
            option: question.correctAnswer,
            text: question.options?.[question.correctAnswer] || null,
          } : null,
          
          // Explanation
          explanation: question.explanation || null,
          
          // Classification
          classification: {
            exam: question.exam ? {
              id: question.exam.id,
              name: question.exam.name,
            } : null,
            subject: question.subject ? {
              id: question.subject._id || question.subject.id,
              name: question.subject.name,
            } : null,
            topic: question.topic ? {
              id: question.topic._id || question.topic.id,
              name: question.topic.name,
            } : null,
            cognitiveLevel: null, // Not stored in current model
          },
          
          // Workflow Information
          workflow: {
            createdBy: question.createdBy ? {
              id: question.createdBy.id || question.createdBy._id,
              name: question.createdBy.name || question.createdBy.fullName || 'Unknown',
              email: question.createdBy.email,
            } : null,
            submittedOn: formatDate(submittedDate),
            lastModifiedBy: question.lastModifiedBy ? {
              id: question.lastModifiedBy.id || question.lastModifiedBy._id,
              name: question.lastModifiedBy.name || question.lastModifiedBy.fullName || 'Unknown',
              email: question.lastModifiedBy.email,
            } : null,
            lastUpdate: formatDate(question.updatedAt),
            approvedBy: question.approvedBy ? {
              id: question.approvedBy.id || question.approvedBy._id,
              name: question.approvedBy.name || question.approvedBy.fullName || 'Unknown',
              email: question.approvedBy.email,
            } : null,
            rejectedBy: question.rejectedBy ? {
              id: question.rejectedBy.id || question.rejectedBy._id,
              name: question.rejectedBy.name || question.rejectedBy.fullName || 'Unknown',
              email: question.rejectedBy.email,
            } : null,
            rejectionReason: question.rejectionReason || null,
          },
          
          // Comments
          comments: question.comments && question.comments.length > 0 ? question.comments.map((comment) => ({
            id: comment._id || comment.id,
            comment: comment.comment,
            commentedBy: comment.commentedBy ? {
              id: comment.commentedBy.id || comment.commentedBy._id,
              name: comment.commentedBy.name || comment.commentedBy.fullName || 'Unknown',
            } : null,
            createdAt: comment.createdAt,
            formattedDate: formatDate(comment.createdAt),
          })) : [],
          
          // History
          history: question.history || [],
          
          // Timestamps
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
      assignedProcessor,
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
    if (!assignedProcessor) {
      errors.push({ field: 'assignedProcessor', message: 'Processor assignment is required' });
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

    // Validate TRUE_FALSE specific fields
    if (questionType === 'TRUE_FALSE') {
      // Correct answer is required for TRUE_FALSE questions (should be "A" for True or "B" for False)
      if (!correctAnswer || !['A', 'B'].includes(correctAnswer)) {
        errors.push({
          field: 'correctAnswer',
          message: 'Correct answer is required and must be A (True) or B (False) for True/False questions',
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
      assignedProcessor,
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

    if (questionType === 'TRUE_FALSE') {
      // Set default options for True/False if not provided
      questionData.options = options || {
        A: "True",
        B: "False",
      };
      // Correct answer is required for TRUE_FALSE questions (A for True, B for False)
      questionData.correctAnswer = correctAnswer;
    }

    const question = await questionService.createQuestion(questionData, req.user.id);

    const response = {
      success: true,
      message: 'Question created successfully and sent for processor approval',
      data: {
        question: {
          id: question._id || question.id,
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

    console.log('[QUESTION] POST /admin/questions → 201 (created)', { questionId: question._id || question.id });
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
 * GET /admin/questions?status=pending_processor&submittedBy=creator
 * For processor: can filter by submittedBy role (creator, explainer, gatherer)
 */
const getQuestions = async (req, res, next) => {
  try {
    const { status, submittedBy, flagType } = req.query;

    console.log('[QUESTION] GET /admin/questions → requested', {
      status,
      submittedBy,
      flagType,
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

    // If processor is requesting and submittedBy is specified, use role-based filtering
    let questions;
    if (req.user.adminRole === 'processor' && submittedBy) {
      questions = await questionService.getQuestionsByStatusAndRole(
        queryStatus,
        submittedBy,
        req.user.id, // Pass processor ID to filter by assignedProcessorId
        flagType // Pass flagType to allow fetching student-flagged questions
      );
    } else {
      questions = await questionService.getQuestionsByStatus(
        queryStatus,
        req.user.id,
        req.user.adminRole,
        flagType // Pass flagType to allow fetching student-flagged questions
      );
    }

    const response = {
      success: true,
      data: {
        questions: questions.map((q) => ({
          id: q._id || q.id,
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
          assignedProcessor: q.assignedProcessor,
          approvedBy: q.approvedBy,
          isFlagged: q.isFlagged || false,
          flagReason: q.flagReason || null,
          flagType: q.flagType || null,
          flaggedBy: q.flaggedBy || null,
          flagStatus: q.flagStatus || null,
          isVariant: q.isVariant || false,
          originalQuestionId: q.originalQuestionId || null,
          history: q.history || [],
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
 * Get gatherer dashboard statistics
 * GET /admin/questions/gatherer/stats
 */
const getGathererStats = async (req, res, next) => {
  try {
    const gathererId = req.user.id;

    const stats = await questionService.getGathererQuestionStats(gathererId);

    const response = {
      success: true,
      data: stats,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get gatherer questions table data
 * GET /admin/questions/gatherer/list?page=1&limit=20&status=pending_processor
 */
const getGathererQuestions = async (req, res, next) => {
  try {
    const gathererId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    const result = await questionService.getGathererQuestions(gathererId, {
      page,
      limit,
      status: status || undefined, // Only pass status if it's provided
    });

    const response = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
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
          id: question._id || question.id,
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
          originalQuestion: question.originalQuestion,
          isVariant: question.isVariant,
          isFlagged: question.isFlagged || false,
          flagReason: question.flagReason || null,
          flagType: question.flagType || null,
          flagStatus: question.flagStatus || null,
          flaggedBy: question.flaggedBy || null,
          flagRejectionReason: question.flagRejectionReason || null,
          history: question.history,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] GET /admin/questions/:questionId → 200 (ok)', {
      questionId: question._id || question.id,
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
      status,
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
    if (status !== undefined) updateData.status = status;

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
          id: question._id || question.id,
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
      questionId: question._id || question.id,
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
 * Create question variant by Creator
 * POST /admin/questions/creator/:questionId/variant
 */
const createQuestionVariant = async (req, res, next) => {
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
      explanation,
    } = req.body;

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/variant → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Validation will be done in the service layer
    // Basic validation here for immediate feedback
    const errors = [];
    const finalQuestionType = questionType;
    if (finalQuestionType === 'MCQ') {
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

    // Prepare variant data
    const variantData = {};
    if (exam !== undefined) variantData.exam = exam;
    if (subject !== undefined) variantData.subject = subject;
    if (topic !== undefined) variantData.topic = topic;
    if (questionText !== undefined) variantData.questionText = questionText.trim();
    if (questionType !== undefined) variantData.questionType = questionType;
    if (options !== undefined) {
      variantData.options = {
        A: options.A.trim(),
        B: options.B.trim(),
        C: options.C.trim(),
        D: options.D.trim(),
      };
    }
    if (correctAnswer !== undefined) variantData.correctAnswer = correctAnswer;
    if (explanation !== undefined) variantData.explanation = explanation.trim();

    const variantQuestion = await questionService.createQuestionVariant(
      questionId,
      variantData,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Question variant created successfully',
      data: {
        question: {
          id: variantQuestion._id || variantQuestion.id,
          exam: variantQuestion.exam,
          subject: variantQuestion.subject,
          topic: variantQuestion.topic,
          questionText: variantQuestion.questionText,
          questionType: variantQuestion.questionType,
          options: variantQuestion.options,
          correctAnswer: variantQuestion.correctAnswer,
          explanation: variantQuestion.explanation,
          originalQuestion: variantQuestion.originalQuestion,
          isVariant: variantQuestion.isVariant,
          status: variantQuestion.status,
          createdBy: variantQuestion.createdBy,
          createdAt: variantQuestion.createdAt,
          updatedAt: variantQuestion.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/variant → 200 (created)', {
      variantQuestionId: variantQuestion._id || variantQuestion.id,
      originalQuestionId: questionId,
    });
    res.status(201).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/creator/:questionId/variant → error', error);
    if (
      error.message === 'Original question not found' ||
      error.message === 'Exam not found' ||
      error.message === 'Subject not found' ||
      error.message === 'Topic not found or does not belong to the selected subject' ||
      error.message === 'All four options (A, B, C, D) are required for MCQ questions' ||
      error.message === 'Correct answer is required for MCQ questions'
    ) {
      return res.status(400).json({
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
          id: question._id || question.id,
          explanation: question.explanation,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/:questionId/explanation → 200 (updated)', {
      questionId: question._id || question.id,
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
 * Process question by Processor (Approve or Reject)
 * POST /admin/questions/processor/:questionId/approve
 * Body: { status: 'approve' | 'reject', rejectionReason?: string }
 */
const approveQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { status, rejectionReason, assignedUserId } = req.body;

    // Validate status
    if (!status || (status !== 'approve' && status !== 'reject')) {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be either "approve" or "reject"',
      });
    }

    // Validate rejectionReason for reject status
    if (status === 'reject' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when status is "reject"',
      });
    }

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/approve → requested', {
      questionId,
      status,
      assignedUserId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    let question;
    if (status === 'approve') {
      question = await questionService.approveQuestion(questionId, req.user.id, assignedUserId);
    } else {
      question = await questionService.rejectQuestion(
        questionId,
        rejectionReason,
        req.user.id
      );
    }

    const response = {
      success: true,
      message: status === 'approve' ? 'Question approved successfully' : 'Question rejected',
      data: {
        question: {
          id: question._id || question.id,
          status: question.status,
          ...(status === 'approve' 
            ? { approvedBy: question.approvedBy }
            : { 
                rejectedBy: question.rejectedBy,
                rejectionReason: question.rejectionReason 
              }
          ),
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log(`[QUESTION] POST /admin/questions/processor/:questionId/approve → 200 (${status})`, {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/approve → error', error);
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
 * Reject question by Processor (kept for backward compatibility, but now uses body status)
 * POST /admin/questions/processor/:questionId/reject
 * Body: { status: 'reject', rejectionReason: string }
 */
const rejectQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { status = 'reject', rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/reject → requested', {
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
          id: question._id || question.id,
          status: question.status,
          rejectedBy: question.rejectedBy,
          rejectionReason: question.rejectionReason,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/reject → 200 (rejected)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/reject → error', error);
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

    const result = await questionService.getTopicsBySubject(subjectId);
    
    // Handle both array and object return types
    const topics = Array.isArray(result) ? result : (result.topics || []);

    const response = {
      success: true,
      data: {
        topics: topics.map((topic) => ({
          id: topic._id || topic.id,
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

/**
 * Flag question by Creator
 * POST /admin/questions/creator/:questionId/flag
 */
const flagQuestionByCreator = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { flagReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/flag → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!flagReason || !flagReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'flagReason',
            message: 'Flag reason is required',
          },
        ],
      });
    }

    const question = await questionService.flagQuestionByCreator(
      questionId,
      flagReason,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Question flagged successfully and sent to processor for review',
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagReason: question.flagReason,
          flagType: question.flagType,
          flagStatus: question.flagStatus,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/flag → 200 (flagged)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/creator/:questionId/flag → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_creator status' ||
      error.message === 'Flag reason is required'
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
 * Review Creator's flag by Processor
 * POST /admin/questions/processor/:questionId/flag/review
 */
const reviewCreatorFlag = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { decision, rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/flag/review → requested', {
      questionId,
      decision,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!decision || (decision !== 'approve' && decision !== 'reject')) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'decision',
            message: 'Decision is required and must be either "approve" or "reject"',
          },
        ],
      });
    }

    if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required when rejecting a flag',
          },
        ],
      });
    }

    const question = await questionService.reviewCreatorFlag(
      questionId,
      decision,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: decision === 'approve' 
        ? 'Flag approved. Question sent back to gatherer for correction.'
        : 'Flag rejected. Question sent back to creator.',
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log(`[QUESTION] POST /admin/questions/processor/:questionId/flag/review → 200 (${decision})`, {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/flag/review → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not flagged by creator or flag has already been reviewed' ||
      error.message === 'Decision must be either "approve" or "reject"' ||
      error.message === 'Rejection reason is required when rejecting a flag'
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
 * Save draft explanation by Explainer
 * PUT /admin/questions/explainer/:questionId/explanation/draft
 * Saves explanation but keeps status as pending_explainer
 */
const saveDraftExplanation = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { explanation } = req.body;

    console.log('[QUESTION] PUT /admin/questions/explainer/:questionId/explanation/draft → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Allow empty explanation for drafts (user might want to save partial work)
    const question = await questionService.saveDraftExplanationByExplainer(
      questionId,
      explanation || '',
      req.user.id
    );

    const response = {
      success: true,
      message: 'Draft explanation saved successfully',
      data: {
        question: {
          id: question._id || question.id,
          explanation: question.explanation,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/explainer/:questionId/explanation/draft → 200 (saved)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/explainer/:questionId/explanation/draft → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_explainer status'
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
 * Flag question or variant by Explainer
 * POST /admin/questions/explainer/:questionId/flag
 * Can flag both regular questions and question variants
 */
const flagQuestionByExplainer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { flagReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/explainer/:questionId/flag → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!flagReason || !flagReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'flagReason',
            message: 'Flag reason is required',
          },
        ],
      });
    }

    const question = await questionService.flagQuestionByExplainer(
      questionId,
      flagReason,
      req.user.id
    );

    const questionType = question.isVariant ? 'variant' : 'question';
    const response = {
      success: true,
      message: `${questionType === 'variant' ? 'Question variant' : 'Question'} flagged successfully and sent to processor for review`,
      data: {
        question: {
          id: question._id || question.id,
          isVariant: question.isVariant,
          isFlagged: question.isFlagged,
          flagReason: question.flagReason,
          flagType: question.flagType,
          flagStatus: question.flagStatus,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/explainer/:questionId/flag → 200 (flagged)', {
      questionId: question._id || question.id,
      isVariant: question.isVariant,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/explainer/:questionId/flag → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_explainer status' ||
      error.message === 'Flag reason is required'
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
 * Review Explainer's flag by Processor
 * POST /admin/questions/processor/:questionId/variant-flag/review
 */
const reviewExplainerFlag = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { decision, rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/variant-flag/review → requested', {
      questionId,
      decision,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!decision || (decision !== 'approve' && decision !== 'reject')) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'decision',
            message: 'Decision is required and must be either "approve" or "reject"',
          },
        ],
      });
    }

    if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required when rejecting a flag',
          },
        ],
      });
    }

    const question = await questionService.reviewExplainerFlag(
      questionId,
      decision,
      rejectionReason,
      req.user.id
    );

    const questionType = question.isVariant ? 'variant' : 'question';
    let message;
    if (decision === 'approve') {
      message = question.isVariant
        ? 'Flag approved. Question variant sent back to creator for correction.'
        : 'Flag approved. Question sent back to gatherer for correction.';
    } else {
      message = `Flag rejected. ${questionType === 'variant' ? 'Question variant' : 'Question'} sent back to explainer.`;
    }

    const response = {
      success: true,
      message,
      data: {
        question: {
          id: question._id || question.id,
          isVariant: question.isVariant,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log(`[QUESTION] POST /admin/questions/processor/:questionId/variant-flag/review → 200 (${decision})`, {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/variant-flag/review → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not flagged by explainer or flag has already been reviewed' ||
      error.message === 'Decision must be either "approve" or "reject"' ||
      error.message === 'Rejection reason is required when rejecting a flag'
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
 * Review Student's flag by Processor
 * POST /admin/questions/processor/:questionId/student-flag/review
 */
const reviewStudentFlag = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { decision, rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/student-flag/review → requested', {
      questionId,
      decision,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!decision || (decision !== 'approve' && decision !== 'reject')) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'decision',
            message: 'Decision is required and must be either "approve" or "reject"',
          },
        ],
      });
    }

    if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required when rejecting a flag',
          },
        ],
      });
    }

    const question = await questionService.reviewStudentFlag(
      questionId,
      decision,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: decision === 'approve' 
        ? 'Student flag approved. Flag marked as approved.'
        : 'Student flag rejected. Flag cleared.',
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log(`[QUESTION] POST /admin/questions/processor/:questionId/student-flag/review → 200`, {
      questionId: question._id || question.id,
      decision,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/student-flag/review → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not flagged by student' ||
      error.message === 'Access denied. This question is not assigned to you.' ||
      error.message === 'Decision must be either "approve" or "reject"' ||
      error.message === 'Rejection reason is required when rejecting a flag'
    ) {
      return res.status(
        error.message === 'Question not found' || error.message === 'Access denied. This question is not assigned to you.' ? 404 : 400
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
 * Add comment to question
 * POST /admin/questions/all/:questionId/comment
 */
const addCommentToQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { comment } = req.body;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can add comments',
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'comment',
            message: 'Comment is required',
          },
        ],
      });
    }

    const question = await questionService.addCommentToQuestion(
      questionId,
      comment,
      req.user.id
    );

    // Format date helper
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Get the newly added comment (last one)
    const newComment = question.comments[question.comments.length - 1];

    const response = {
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: {
          id: newComment._id || newComment.id,
          comment: newComment.comment,
          commentedBy: newComment.commentedBy ? {
            id: newComment.commentedBy.id || newComment.commentedBy._id,
            name: newComment.commentedBy.name || newComment.commentedBy.fullName || 'Unknown',
          } : null,
          createdAt: newComment.createdAt,
          formattedDate: formatDate(newComment.createdAt),
        },
        question: {
          id: question._id || question.id,
          totalComments: question.comments.length,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/all/:questionId/comment → 201 (created)', {
      questionId: question._id || question.id,
      commentId: newComment._id || newComment.id,
    });
    res.status(201).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/all/:questionId/comment → error', error);
    if (error.message === 'Question not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === 'Comment is required') {
      return res.status(400).json({
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
 * Get approved questions for superadmin (status = 'completed')
 * GET /admin/questions/approved?search=...&exam=...&subject=...&topic=...&page=1&limit=10
 */
const getApprovedQuestions = async (req, res, next) => {
  try {
    const { 
      search, 
      exam, 
      subject, 
      topic, 
      page = 1, 
      limit = 10 
    } = req.query;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view approved questions',
      });
    }

    // Build filters - only approved questions (status = 'completed')
    const filters = { tab: 'approved', status: 'completed' };
    if (exam) filters.exam = exam;
    if (subject) filters.subject = subject;
    if (topic) filters.topic = topic;

    // Pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };

    // Get questions with pagination
    const result = await questionService.getAllQuestionsForSuperadmin(filters, search || '', pagination);

    const response = {
      success: true,
      message: 'Approved questions retrieved successfully',
      data: {
        questions: result.questions.map((q) => ({
          id: q.id || q._id,
          question: q.questionText || q.question?.text || '—',
          subject: q.subject ? (q.subject.name || q.subject) : '—',
          exam: q.exam ? (q.exam.name || q.exam) : '—',
          topic: q.topic ? (q.topic.name || q.topic) : '—',
          status: (q.isVisible !== false && q.isVisible !== null) ? 'Visible' : 'Hidden',
          visibility: q.isVisible !== false && q.isVisible !== null,
          actionType: 'toggle',
        })),
        pagination: result.pagination,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/approved → error', error);
    next(error);
  }
};

/**
 * Update flagged question by Gatherer
 * PUT /admin/questions/gatherer/:questionId
 */
const updateFlaggedQuestionByGatherer = async (req, res, next) => {
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
      explanation,
    } = req.body;

    console.log('[QUESTION] PUT /admin/questions/gatherer/:questionId → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Validation
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
    if (explanation !== undefined) updateData.explanation = explanation.trim();

    const question = await questionService.updateFlaggedQuestionByGatherer(
      questionId,
      updateData,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Question updated successfully and sent for processor review',
      data: {
        question: {
          id: question._id || question.id,
          exam: question.exam,
          subject: question.subject,
          topic: question.topic,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/gatherer/:questionId → 200 (updated)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/gatherer/:questionId → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_gatherer status' ||
      error.message === 'Question was not flagged and approved by processor'
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
 * Toggle question visibility
 * PUT /admin/questions/:questionId/visibility
 */
const toggleQuestionVisibility = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { isVisible } = req.body;

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can toggle question visibility',
      });
    }

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isVisible must be a boolean value',
      });
    }

    const question = await questionService.toggleQuestionVisibility(questionId, isVisible, req.user.id);

    res.status(200).json({
      success: true,
      message: `Question visibility ${isVisible ? 'enabled' : 'disabled'} successfully`,
      data: {
        question: {
          id: question.id,
          isVisible: question.isVisible,
          status: question.isVisible ? 'Visible' : 'Hidden',
        },
      },
    });
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/:questionId/visibility → error', error);
    if (error.message === 'Question not found') {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    next(error);
  }
};

const rejectFlagByGatherer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/gatherer/:questionId/reject-flag → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required',
          },
        ],
      });
    }

    const question = await questionService.rejectFlagByGatherer(
      questionId,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Flag rejected successfully. Question sent back to processor for review.',
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/gatherer/:questionId/reject-flag → 200 (rejected)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/gatherer/:questionId/reject-flag → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not flagged or flag has not been approved by processor' ||
      error.message === 'Rejection reason is required'
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
 * Update flagged variant by Creator
 * PUT /admin/questions/creator/:questionId/update-flagged-variant
 */
const updateFlaggedVariantByCreator = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    console.log('[QUESTION] PUT /admin/questions/creator/:questionId/update-flagged-variant → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    // Validation
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
    if (explanation !== undefined) updateData.explanation = explanation.trim();

    const question = await questionService.updateFlaggedVariantByCreator(
      questionId,
      updateData,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Variant updated successfully and sent for processor review',
      data: {
        question: {
          id: question._id || question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] PUT /admin/questions/creator/:questionId/update-flagged-variant → 200 (updated)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] PUT /admin/questions/creator/:questionId/update-flagged-variant → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not in pending_creator status' ||
      error.message === 'Question variant was not flagged and approved by processor' ||
      error.message === 'This method is for variants only'
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
 * Reject flag by Creator
 * POST /admin/questions/creator/:questionId/reject-flag
 */
const rejectFlagByCreator = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/reject-flag → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required',
          },
        ],
      });
    }

    const question = await questionService.rejectFlagByCreator(
      questionId,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: 'Flag rejected successfully. Question sent back to processor for review.',
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/creator/:questionId/reject-flag → 200 (rejected)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/creator/:questionId/reject-flag → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question is not flagged or flag has not been approved by processor' ||
      error.message === 'Rejection reason is required'
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
 * Reject gatherer's flag rejection by Processor
 * POST /admin/questions/processor/:questionId/reject-gatherer-flag-rejection
 */
const rejectGathererFlagRejection = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { rejectionReason } = req.body;

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/reject-gatherer-flag-rejection → requested', {
      questionId,
      requestedBy: req.user.id,
      requesterRole: req.user.adminRole,
    });

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'rejectionReason',
            message: 'Rejection reason is required',
          },
        ],
      });
    }

    const question = await questionService.rejectGathererFlagRejection(
      questionId,
      rejectionReason,
      req.user.id
    );

    const response = {
      success: true,
      message: "Gatherer's flag rejection rejected. Flag restored and sent back to gatherer.",
      data: {
        question: {
          id: question._id || question.id,
          isFlagged: question.isFlagged,
          flagStatus: question.flagStatus,
          flagRejectionReason: question.flagRejectionReason,
          status: question.status,
          updatedAt: question.updatedAt,
        },
      },
    };

    console.log('[QUESTION] POST /admin/questions/processor/:questionId/reject-gatherer-flag-rejection → 200 (rejected)', {
      questionId: question._id || question.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] POST /admin/questions/processor/:questionId/reject-gatherer-flag-rejection → error', error);
    if (
      error.message === 'Question not found' ||
      error.message === 'Question does not have a gatherer flag rejection' ||
      error.message === 'Question is not in pending_processor status' ||
      error.message === 'Rejection reason is required'
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
 * Get completed explanations by explainer
 * GET /admin/questions/explainer/completed-explanations
 */
const getCompletedExplanations = async (req, res, next) => {
  try {
    const explainerId = req.user.id;

    console.log('[QUESTION] GET /admin/questions/explainer/completed-explanations → requested', {
      requestedBy: explainerId,
      requesterRole: req.user.adminRole,
    });

    const questions = await questionService.getCompletedExplanationsByExplainer(explainerId);

    console.log(`[getCompletedExplanations] Service returned ${questions.length} questions`);
    if (questions.length > 0) {
      console.log(`[getCompletedExplanations] First question sample:`, {
        id: questions[0].id,
        hasQuestionText: !!questions[0].questionText,
        hasExplanation: !!questions[0].explanation,
        explanationLength: questions[0].explanation?.length || 0,
        hasSubject: !!questions[0].subject,
        hasExam: !!questions[0].exam
      });
    }

    const response = {
      success: true,
      data: {
        questions: questions.map((q) => {
          const mapped = {
            id: q.id || q._id, // Prisma returns 'id', not '_id'
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
            assignedProcessor: q.assignedProcessor,
            approvedBy: q.approvedBy,
            isFlagged: q.isFlagged || false,
            flagReason: q.flagReason || null,
            flagType: q.flagType || null,
            flaggedBy: q.flaggedBy || null,
            flagStatus: q.flagStatus || null,
            isVariant: q.isVariant || false,
            originalQuestionId: q.originalQuestionId || null,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt,
            history: q.history || [],
          };
          
          if (!mapped.id) {
            console.error(`[getCompletedExplanations] Question missing ID:`, q);
          }
          
          return mapped;
        }),
      },
    };

    console.log('[QUESTION] GET /admin/questions/explainer/completed-explanations → 200 (ok)', { 
      count: questions.length 
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[QUESTION] GET /admin/questions/explainer/completed-explanations → error', error);
    next(error);
  }
};

/**
 * Get flagged questions for content moderation (superadmin)
 * GET /api/admin/moderation/flagged
 */
const getFlaggedQuestionsForModeration = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const questions = await questionService.getFlaggedQuestionsForModeration(filters);

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
 * Approve student flag (superadmin)
 * POST /api/admin/moderation/:questionId/approve
 */
const approveStudentFlag = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const adminId = req.user.id;

    const question = await questionService.approveStudentFlag(questionId, adminId);

    res.status(200).json({
      success: true,
      data: question,
      message: 'Flag approved. Question sent to processor.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject student flag (superadmin)
 * POST /api/admin/moderation/:questionId/reject
 * Body: { rejectionReason }
 */
const rejectStudentFlag = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user.id;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const question = await questionService.rejectStudentFlag(questionId, rejectionReason, adminId);

    res.status(200).json({
      success: true,
      data: question,
      message: 'Flag rejected. Student will be notified.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestionsForSuperadmin,
  getQuestionDetailForSuperadmin,
  createQuestion,
  getQuestions,
  getGathererStats,
  getGathererQuestions,
  getQuestionById,
  updateQuestion,
  createQuestionVariant,
  updateExplanation,
  saveDraftExplanation,
  approveQuestion,
  rejectQuestion,
  getTopicsBySubject,
  addCommentToQuestion,
  flagQuestionByCreator,
  reviewCreatorFlag,
  flagQuestionByExplainer,
  reviewExplainerFlag,
  reviewStudentFlag,
  getApprovedQuestions,
  toggleQuestionVisibility,
  updateFlaggedQuestionByGatherer,
  rejectFlagByGatherer,
  updateFlaggedVariantByCreator,
  rejectFlagByCreator,
  getCompletedExplanations,
  rejectGathererFlagRejection,
  getFlaggedQuestionsForModeration,
  approveStudentFlag,
  rejectStudentFlag,
};
