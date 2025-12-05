const Question = require('../../../models/question');
const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');
const Classification = require('../../../models/classification');

/**
 * Create question by Gatherer
 */
const createQuestion = async (questionData, userId) => {
  // Validate exam exists
  const exam = await Exam.findById(questionData.exam);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate subject exists
  const subject = await Subject.findById(questionData.subject);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Validate topic exists and belongs to subject
  const topics = await Topic.findMany({
    where: {
      id: questionData.topic,
      parentSubject: questionData.subject,
    },
  });
  const topic = topics[0];
  if (!topic) {
    throw new Error('Topic not found or does not belong to the selected subject');
  }

  // Validate processor (required)
  if (!questionData.assignedProcessor) {
    throw new Error('Processor assignment is required');
  }

  const { prisma } = require('../../../config/db/prisma');
  const processor = await prisma.user.findUnique({
    where: { id: questionData.assignedProcessor },
    select: { id: true, adminRole: true, status: true }
  });
  
  if (!processor) {
    throw new Error('Assigned processor not found');
  }
  
  if (processor.adminRole !== 'processor') {
    throw new Error('Assigned user is not a processor');
  }
  
  if (processor.status !== 'active') {
    throw new Error('Assigned processor is not active');
  }

  // Create or update classification
  await Classification.findOneAndUpdate(
    {
      exam: questionData.exam,
      subject: questionData.subject,
      topic: questionData.topic,
    },
    {
      exam: questionData.exam,
      subject: questionData.subject,
      topic: questionData.topic,
      status: 'active',
    },
    {
      upsert: true,
      new: true,
    }
  );

  // Create question
  const question = await Question.create({
    ...questionData,
    createdBy: userId,
    status: 'pending_processor',
    history: [
      {
        action: 'created',
        performedBy: userId,
        role: 'gatherer',
        timestamp: new Date(),
        notes: 'Question created by gatherer',
      },
    ],
  });

  // Return the question with populated relations (already included by Prisma)
  return await Question.findById(question.id);
};

/**
 * Get questions by status and role
 */
const getQuestionsByStatus = async (status, userId, role) => {
  const where = { status };

  // Gatherer can only see their own questions
  if (role === 'gatherer') {
    where.createdById = userId;
  }

  return await Question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      exam: { select: { name: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } },
      createdBy: { select: { name: true, email: true } },
      lastModifiedBy: { select: { name: true, email: true } },
      assignedProcessor: { select: { name: true, fullName: true, email: true } }
    }
  });
};

/**
 * Create question variant by Creator
 * Creates a new question based on an existing question
 */
const createQuestionVariant = async (originalQuestionId, variantData, userId) => {
  // Find the original question
  const originalQuestion = await Question.findById(originalQuestionId);
  
  if (!originalQuestion) {
    throw new Error('Original question not found');
  }

  // Validate exam if provided, otherwise use original question's exam
  const examId = variantData.exam || originalQuestion.examId || (originalQuestion.exam?.id);
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate subject if provided, otherwise use original question's subject
  const subjectId = variantData.subject || originalQuestion.subjectId || (originalQuestion.subject?.id);
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Validate topic if provided, otherwise use original question's topic
  const topicId = variantData.topic || originalQuestion.topicId || (originalQuestion.topic?.id);
  const topics = await Topic.findMany({
    where: {
      id: topicId,
      parentSubject: subjectId,
    },
  });
  const topic = topics[0];
  if (!topic) {
    throw new Error('Topic not found or does not belong to the selected subject');
  }

  // Create or update classification
  await Classification.findOneAndUpdate(
    {
      exam: examId,
      subject: subjectId,
      topic: topicId,
    },
    {
      exam: examId,
      subject: subjectId,
      topic: topicId,
      status: 'active',
    },
    {
      upsert: true,
      new: true,
    }
  );

  // Determine question type (use variant data or original)
  const questionType = variantData.questionType || originalQuestion.questionType;

  // Validate MCQ requirements if it's an MCQ
  if (questionType === 'MCQ') {
    const options = variantData.options || originalQuestion.options;
    if (!options || !options.A || !options.B || !options.C || !options.D) {
      throw new Error('All four options (A, B, C, D) are required for MCQ questions');
    }
    if (!variantData.correctAnswer && !originalQuestion.correctAnswer) {
      throw new Error('Correct answer is required for MCQ questions');
    }
  }

  // Create the variant question
  const variantQuestion = await Question.create({
    exam: examId,
    subject: subjectId,
    topic: topicId,
    questionText: variantData.questionText || originalQuestion.questionText,
    questionType: questionType,
    options: variantData.options || originalQuestion.options,
    correctAnswer: variantData.correctAnswer || originalQuestion.correctAnswer,
    explanation: variantData.explanation || originalQuestion.explanation || '',
    originalQuestionId: originalQuestionId,
    isVariant: true,
    createdBy: userId,
    status: 'pending_processor',
    history: [
      {
        action: 'variant_created',
        performedBy: userId,
        role: 'creator',
        timestamp: new Date(),
        notes: `Variant created from question ${originalQuestionId}`,
      },
    ],
  });

  // Add history entry to original question using Prisma
  await Question.addHistory(originalQuestionId, {
    action: 'variant_created',
    performedById: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: `Variant question ${variantQuestion.id} created from this question`,
  });

  return await Question.findById(variantQuestion.id);
};

/**
 * Get question by ID
 */
const getQuestionById = async (questionId, userId, role) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // Gatherer can only access their own questions
  if (role === 'gatherer' && question.createdById !== userId) {
    throw new Error('Access denied');
  }

  return question;
};

/**
 * Get gatherer-level question statistics
 */
const getGathererQuestionStats = async (gathererId) => {
  const allQuestions = await Question.findMany({
    where: { createdById: gathererId }
  });
  const totalSubmitted = allQuestions.length;
  
  const approvedQuestions = allQuestions.filter(q => 
    ['pending_creator', 'pending_explainer', 'completed'].includes(q.status)
  );
  const totalApproved = approvedQuestions.length;
  
  const rejectedQuestions = allQuestions.filter(q => q.status === 'rejected');
  const totalRejected = rejectedQuestions.length;

  const totalPending = Math.max(
    totalSubmitted - totalApproved - totalRejected,
    0
  );

  const acceptanceRate =
    totalSubmitted > 0
      ? Number(((totalApproved / totalSubmitted) * 100).toFixed(2))
      : 0;
  const rejectionRate =
    totalSubmitted > 0
      ? Number(((totalRejected / totalSubmitted) * 100).toFixed(2))
      : 0;

  return {
    totalSubmitted,
    totalApproved,
    totalRejected,
    totalPending,
    acceptanceRate,
    rejectionRate,
  };
};

/**
 * Get gatherer questions for dashboard table (with pagination and status filter)
 */
const getGathererQuestions = async (gathererId, { page = 1, limit = 20, status } = {}) => {
  const normalizedPage = Math.max(parseInt(page, 10) || 1, 1);
  const normalizedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (normalizedPage - 1) * normalizedLimit;

  // Build where clause
  const where = { createdById: gathererId };
  if (status) {
    where.status = status;
  }

  const { prisma } = require('../../../config/db/prisma');

  const [questions, stats, totalCount] = await Promise.all([
    Question.findMany({
      where,
      include: {
        exam: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        topic: { select: { id: true, name: true } },
        assignedProcessor: { select: { id: true, name: true, fullName: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: skip,
      take: normalizedLimit
    }),
    getGathererQuestionStats(gathererId),
    // Get total count for pagination (with status filter if applied) using count
    prisma.question.count({ where }),
  ]);

  const rows = questions.map((q) => {
    const processorUser = q.assignedProcessor;
    return {
      id: q.id,
      questionText: q.questionText,
      exam: q.exam ? { id: q.exam.id, name: q.exam.name } : null,
      subject: q.subject ? { id: q.subject.id, name: q.subject.name } : null,
      topic: q.topic ? { id: q.topic.id, name: q.topic.name } : null,
      status: q.status,
      updatedAt: q.updatedAt,
      createdAt: q.createdAt,
      assignedProcessor: processorUser
        ? {
            id: processorUser.id,
            name: processorUser.name || processorUser.fullName || 'Processor',
            fullName: processorUser.fullName,
            email: processorUser.email,
          }
        : null,
    };
  });

  return {
    summary: {
      ...stats,
      totalSubmitted: totalCount,
    },
    questions: rows,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / normalizedLimit),
      hasNextPage: skip + rows.length < totalCount,
      hasPreviousPage: normalizedPage > 1,
    },
  };
};

/**
 * Update question by Creator
 */
const updateQuestionByCreator = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_creator') {
    throw new Error('Question is not in pending_creator status');
  }

  // Validate exam if provided
  if (updateData.exam) {
    const exam = await Exam.findById(updateData.exam);
    if (!exam) {
      throw new Error('Exam not found');
    }
  }

  // Validate subject if provided
  if (updateData.subject) {
    const subject = await Subject.findById(updateData.subject);
    if (!subject) {
      throw new Error('Subject not found');
    }
  }

  // Validate topic if provided
  if (updateData.topic) {
    const subjectId = updateData.subject || question.subject;
    const topics = await Topic.findMany({
      where: {
        id: updateData.topic,
        parentSubject: subjectId,
      },
    });
    const topic = topics[0];
    if (!topic) {
      throw new Error('Topic not found or does not belong to the selected subject');
    }
  }

  // Determine final question type (use updated type or existing type)
  const finalQuestionType = updateData.questionType !== undefined 
    ? updateData.questionType 
    : question.questionType;

  // Validate MCQ requirements
  if (finalQuestionType === 'MCQ') {
    // Check if options are provided or already exist
    const finalOptions = updateData.options || question.options;
    if (!finalOptions || !finalOptions.A || !finalOptions.B || 
        !finalOptions.C || !finalOptions.D) {
      throw new Error('All four options (A, B, C, D) are required for MCQ questions');
    }
    
    // Correct answer must be provided when updating MCQ questions
    if (!updateData.correctAnswer) {
      throw new Error('Correct answer is required for MCQ questions');
    }
    if (!['A', 'B', 'C', 'D'].includes(updateData.correctAnswer)) {
      throw new Error('Correct answer must be A, B, C, or D for MCQ questions');
    }
  }

  // Update question fields
  if (updateData.questionText !== undefined) {
    question.questionText = updateData.questionText;
  }
  if (updateData.questionType !== undefined) {
    question.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    question.options = updateData.options;
  }
  if (updateData.correctAnswer !== undefined) {
    question.correctAnswer = updateData.correctAnswer;
  }
  
  // Track if classification changed
  let classificationChanged = false;
  if (updateData.exam !== undefined) {
    question.exam = updateData.exam;
    classificationChanged = true;
  }
  if (updateData.subject !== undefined) {
    question.subject = updateData.subject;
    classificationChanged = true;
  }
  if (updateData.topic !== undefined) {
    question.topic = updateData.topic;
    classificationChanged = true;
  }

  // Update classification if exam, subject, or topic changed
  if (classificationChanged) {
    const finalExam = updateData.exam !== undefined ? updateData.exam : question.exam;
    const finalSubject = updateData.subject !== undefined ? updateData.subject : question.subject;
    const finalTopic = updateData.topic !== undefined ? updateData.topic : question.topic;

    await Classification.findOneAndUpdate(
      {
        exam: finalExam,
        subject: finalSubject,
        topic: finalTopic,
      },
      {
        exam: finalExam,
        subject: finalSubject,
        topic: finalTopic,
        status: 'active',
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  question.lastModifiedBy = userId;
  question.status = 'pending_processor';

  // Add history entry
  question.history.push({
    action: 'updated',
    performedBy: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: 'Question updated by creator',
  });

  return await question.save();
};

/**
 * Update explanation by Explainer
 */
const updateExplanationByExplainer = async (questionId, explanation, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_explainer') {
    throw new Error('Question is not in pending_explainer status');
  }

  if (!explanation || !explanation.trim()) {
    throw new Error('Explanation is required');
  }

  question.explanation = explanation.trim();
  question.lastModifiedBy = userId;
  question.status = 'pending_processor';

  // Add history entry
  question.history.push({
    action: 'updated',
    performedBy: userId,
    role: 'explainer',
    timestamp: new Date(),
    notes: 'Explanation added/updated by explainer',
  });

  return await question.save();
};

/**
 * Approve question by Processor
 */
const approveQuestion = async (questionId, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  // Check if question was updated after a flag was approved
  const wasUpdatedAfterFlag = question.isFlagged && 
    question.flagStatus === 'approved' && 
    (question.history.some(h => h.role === 'gatherer' && h.action === 'updated') ||
     question.history.some(h => h.role === 'creator' && h.action === 'updated'));

  // Determine next status based on current workflow
  let nextStatus;
  const lastAction = question.history[question.history.length - 1];
  
  if (lastAction && lastAction.role === 'gatherer') {
    // After gatherer submission/update, move to creator
    nextStatus = 'pending_creator';
  } else if (lastAction && lastAction.role === 'creator') {
    // After creator submission/update, move to explainer
    nextStatus = 'pending_explainer';
  } else if (lastAction && lastAction.role === 'explainer') {
    // After explainer submission, mark as completed
    nextStatus = 'completed';
  } else {
    // Default fallback
    nextStatus = 'pending_creator';
  }

  question.status = nextStatus;
  question.approvedById = userId;
  question.rejectedById = null;
  question.rejectionReason = null;

  // If question was updated after flag approval, remove the flag
  if (wasUpdatedAfterFlag) {
    const flagType = question.flagType; // 'creator' or 'explainer'
    question.isFlagged = false;
    question.flagStatus = null;
    question.flaggedById = null;
    question.flagReason = null;
    question.flagReviewedById = null;
    question.flagRejectionReason = null;
    
    // Add history entry with flag type info
    const historyNote = `Question approved after ${flagType} flag correction, moved to ${nextStatus}. Flag removed.`;
    question.history.push({
      action: 'approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: historyNote,
    });
  } else {
    // Add history entry
    question.history.push({
      action: 'approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Question approved, moved to ${nextStatus}`,
    });
  }

  return await question.save();
};

/**
 * Reject question by Processor
 */
const rejectQuestion = async (questionId, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  question.status = 'rejected';
  question.rejectedBy = userId;
  question.rejectionReason = rejectionReason || 'No reason provided';

  // Add history entry
  question.history.push({
    action: 'rejected',
    performedBy: userId,
    role: 'processor',
    timestamp: new Date(),
    notes: `Question rejected: ${question.rejectionReason}`,
  });

  return await question.save();
};

/**
 * Get topics by subject
 */
const getTopicsBySubject = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  return await Topic.findMany({
    where: { parentSubject: subjectId },
    orderBy: { name: 'asc' }
  });
};

/**
 * Build a base query with optional search term
 */
const buildSearchQuery = (baseFilters = {}, searchTerm = '') => {
  const where = { ...baseFilters };

  // Convert Mongoose field names to Prisma field names
  if (where.createdBy) {
    where.createdById = where.createdBy;
    delete where.createdBy;
  }
  if (where.exam) {
    where.examId = where.exam;
    delete where.exam;
  }
  if (where.subject) {
    where.subjectId = where.subject;
    delete where.subject;
  }
  if (where.topic) {
    where.topicId = where.topic;
    delete where.topic;
  }

  // Handle status filter - convert $in to in for Prisma
  if (where.status && typeof where.status === 'object' && where.status.$in) {
    where.status = { in: where.status.$in };
  }
  // Handle status filter - convert in object to Prisma format
  if (where.status && typeof where.status === 'object' && where.status.in) {
    // Already in Prisma format
  }

  if (searchTerm && searchTerm.trim()) {
    const searchConditions = [
      { questionText: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { explanation: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { status: { contains: searchTerm.trim(), mode: 'insensitive' } },
    ];
    
    // Combine existing conditions with search using AND
    const existingConditions = { ...where };
    delete existingConditions.OR;
    
    if (Object.keys(existingConditions).length > 0) {
      where.AND = [
        existingConditions,
        { OR: searchConditions }
      ];
      // Remove individual conditions that are now in AND
      Object.keys(existingConditions).forEach(key => {
        if (key !== 'AND' && key !== 'OR') {
          delete where[key];
        }
      });
    } else {
      where.OR = searchConditions;
    }
  }

  return where;
};

/**
 * Get questions with filters (for advanced queries)
 */
const getQuestionsWithFilters = async (filters = {}, userId = null, role = null, searchTerm = '') => {
  const baseFilters = { ...filters };

  // Gatherer can only see their own questions
  if (role === 'gatherer' && userId) {
    baseFilters.createdBy = userId;
  }

  const query = buildSearchQuery(baseFilters, searchTerm);

  return await Question.findMany({
    where: query,
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get questions by exam
 */
const getQuestionsByExam = async (examId, userId = null, role = null) => {
  return await getQuestionsWithFilters({ exam: examId }, userId, role);
};

/**
 * Get questions by subject ID
 */
const getQuestionsBySubjectId = async (subjectId, userId = null, role = null) => {
  return await getQuestionsWithFilters({ subject: subjectId }, userId, role);
};

/**
 * Get questions by topic
 */
const getQuestionsByTopic = async (topicId, userId = null, role = null) => {
  return await getQuestionsWithFilters({ topic: topicId }, userId, role);
};

/**
 * Get question statistics
 */
const getQuestionStatistics = async (userId = null, role = null) => {
  const query = {};
  
  // Gatherer can only see their own questions
  if (role === 'gatherer' && userId) {
    query.createdBy = userId;
  }

  const stats = await Question.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    pending_processor: 0,
    pending_creator: 0,
    pending_explainer: 0,
    completed: 0,
    rejected: 0,
    total: 0,
  };

  stats.forEach((stat) => {
    if (result.hasOwnProperty(stat._id)) {
      result[stat._id] = stat.count;
    }
    result.total += stat.count;
  });

  return result;
};

/**
 * Get questions count by status
 */
const getQuestionsCountByStatus = async (status, userId = null, role = null) => {
  const query = { status };

  // Gatherer can only see their own questions
  if (role === 'gatherer' && userId) {
    query.createdBy = userId;
  }

  return await Question.countDocuments(query);
};

/**
 * Get all questions for superadmin with optional search and pagination
 */
const getAllQuestionsForSuperadmin = async (filters = {}, searchTerm = '', pagination = { page: 1, limit: 5 }) => {
  const baseFilters = { ...filters };

  // Handle tab filters - only apply if status is not explicitly provided
  if (filters.tab && !filters.status) {
    switch (filters.tab) {
      case 'approved':
        baseFilters.status = 'completed';
        break;
      case 'pending':
        baseFilters.status = { in: ['pending_processor', 'pending_creator', 'pending_explainer'] };
        break;
      case 'rejected':
        baseFilters.status = 'rejected';
        break;
      case 'all':
      default:
        // No status filter for 'all'
        break;
    }
  }
  delete baseFilters.tab; // Remove tab from filters as it's not a DB field

  const query = buildSearchQuery(baseFilters, searchTerm);

  // Pagination
  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 5;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const allQuestions = await Question.findMany({
    where: query
  });
  const totalItems = allQuestions.length;

  // Get paginated questions
  const questions = await Question.findMany({
    where: query,
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: limit
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    questions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Get question counts for tabs (all, approved, pending, rejected)
 * By default respects filters/search, but can be forced to ignore them
 */
const getQuestionCounts = async (filters = {}, searchTerm = '', applyFilters = true) => {
  const baseFilters = applyFilters ? { ...filters } : {};
  const search = applyFilters ? searchTerm : '';

  // Remove tab from filters for count queries
  const countFilters = { ...baseFilters };
  delete countFilters.tab;

  const totalQuery = buildSearchQuery(countFilters, search);

  const approvedFilters = { ...countFilters, status: 'completed' };
  const approvedQuery = buildSearchQuery(approvedFilters, search);

  const pendingStatuses = ['pending_processor', 'pending_creator', 'pending_explainer'];
  const pendingFilters = { ...countFilters, status: { $in: pendingStatuses } };
  const pendingQuery = buildSearchQuery(pendingFilters, search);

  const rejectedFilters = { ...countFilters, status: 'rejected' };
  const rejectedQuery = buildSearchQuery(rejectedFilters, search);

  const [total, approved, pending, rejected] = await Promise.all([
    Question.countDocuments(totalQuery),
    Question.countDocuments(approvedQuery),
    Question.countDocuments(pendingQuery),
    Question.countDocuments(rejectedQuery),
  ]);

  return {
    total,
    approved,
    pending,
    rejected,
  };
};

/**
 * Add comment to question
 */
const addCommentToQuestion = async (questionId, comment, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!comment || !comment.trim()) {
    throw new Error('Comment is required');
  }

  // Add comment using Prisma
  await Question.addComment(questionId, {
    comment: comment.trim(),
    commentedById: userId,
    createdAt: new Date(),
  });

  // Return question with comment data (already included by findById)
  return await Question.findById(questionId);
};

/**
 * Flag question by Creator
 */
const flagQuestionByCreator = async (questionId, flagReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_creator') {
    throw new Error('Question is not in pending_creator status');
  }

  if (!flagReason || !flagReason.trim()) {
    throw new Error('Flag reason is required');
  }

  // Update question with flag
  question.isFlagged = true;
  question.flaggedById = userId;
  question.flagReason = flagReason.trim();
  question.flagType = 'creator';
  question.flagStatus = 'pending';
  question.status = 'pending_processor'; // Send back to processor

  // Add history entry
  question.history.push({
    action: 'flagged',
    performedBy: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: `Question flagged by creator: ${flagReason.trim()}`,
  });

  return await question.save();
};

/**
 * Review Creator's flag by Processor
 */
const reviewCreatorFlag = async (questionId, decision, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagType !== 'creator' || question.flagStatus !== 'pending') {
    throw new Error('Question is not flagged by creator or flag has already been reviewed');
  }

  if (decision !== 'approve' && decision !== 'reject') {
    throw new Error('Decision must be either "approve" or "reject"');
  }

  if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
    throw new Error('Rejection reason is required when rejecting a flag');
  }

  if (decision === 'approve') {
    // Processor approves the flag - send back to Gatherer
    question.flagStatus = 'approved';
    question.flagReviewedById = userId;
    question.status = 'pending_gatherer'; // Send back to gatherer for correction

    // Add history entry
    question.history.push({
      action: 'flag_approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Creator's flag approved. Reason: ${question.flagReason}. Sent back to gatherer for correction.`,
    });
  } else {
    // Processor rejects the flag - send back to Creator
    question.flagStatus = 'rejected';
    question.flagReviewedById = userId;
    question.flagRejectionReason = rejectionReason.trim();
    question.isFlagged = false; // Remove flag
    question.flaggedById = null;
    question.flagReason = null;
    question.status = 'pending_creator'; // Send back to creator

    // Add history entry
    question.history.push({
      action: 'flag_rejected',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Creator's flag rejected. Processor reason: ${rejectionReason.trim()}. Sent back to creator.`,
    });
  }

  return await question.save();
};

/**
 * Flag question or variant by Explainer
 * Can flag both regular questions and question variants
 */
const flagQuestionByExplainer = async (questionId, flagReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_explainer') {
    throw new Error('Question is not in pending_explainer status');
  }

  if (!flagReason || !flagReason.trim()) {
    throw new Error('Flag reason is required');
  }

  // Update question with flag
  question.isFlagged = true;
  question.flaggedById = userId;
  question.flagReason = flagReason.trim();
  question.flagType = 'explainer';
  question.flagStatus = 'pending';
  question.status = 'pending_processor'; // Send back to processor

  // Add history entry - note whether it's a variant or regular question
  const questionType = question.isVariant ? 'variant' : 'question';
  question.history.push({
    action: 'flagged',
    performedBy: userId,
    role: 'explainer',
    timestamp: new Date(),
    notes: `${questionType === 'variant' ? 'Question variant' : 'Question'} flagged by explainer: ${flagReason.trim()}`,
  });

  return await question.save();
};

/**
 * Review Explainer's flag by Processor
 * Handles both regular questions (goes to Gatherer) and variants (goes to Creator)
 */
const reviewExplainerFlag = async (questionId, decision, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagType !== 'explainer' || question.flagStatus !== 'pending') {
    throw new Error('Question is not flagged by explainer or flag has already been reviewed');
  }

  if (decision !== 'approve' && decision !== 'reject') {
    throw new Error('Decision must be either "approve" or "reject"');
  }

  if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
    throw new Error('Rejection reason is required when rejecting a flag');
  }

  if (decision === 'approve') {
    // Processor approves the flag
    question.flagStatus = 'approved';
    question.flagReviewedById = userId;
    
    // Determine where to send based on whether it's a variant or regular question
    if (question.isVariant) {
      // Variant: send back to Creator for correction
      question.status = 'pending_creator';
      question.history.push({
        action: 'flag_approved',
        performedBy: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Explainer's flag approved for variant. Reason: ${question.flagReason}. Sent back to creator for correction.`,
      });
    } else {
      // Regular question: send back to Gatherer for correction
      question.status = 'pending_gatherer';
      question.history.push({
        action: 'flag_approved',
        performedBy: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Explainer's flag approved. Reason: ${question.flagReason}. Sent back to gatherer for correction.`,
      });
    }
  } else {
    // Processor rejects the flag - send back to Explainer
    question.flagStatus = 'rejected';
    question.flagReviewedById = userId;
    question.flagRejectionReason = rejectionReason.trim();
    question.isFlagged = false; // Remove flag
    question.flaggedById = null;
    question.flagReason = null;
    question.status = 'pending_explainer'; // Send back to explainer

    // Add history entry
    const questionType = question.isVariant ? 'variant' : 'question';
    question.history.push({
      action: 'flag_rejected',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Explainer's flag rejected for ${questionType}. Processor reason: ${rejectionReason.trim()}. Sent back to explainer.`,
    });
  }

  return await question.save();
};

/**
 * Handle Gatherer's updated question after flag approval
 * When gatherer updates a question that was flagged by creator and approved by processor
 */
const handleGathererUpdateAfterFlag = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_gatherer') {
    throw new Error('Question is not in pending_gatherer status');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved' || question.flagType !== 'creator') {
    throw new Error('Question was not flagged by creator and approved by processor');
  }

  // Update question fields (similar to updateQuestionByCreator logic)
  if (updateData.questionText !== undefined) {
    question.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    question.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    question.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    question.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.exam !== undefined) {
    question.exam = updateData.exam;
  }
  if (updateData.subject !== undefined) {
    question.subject = updateData.subject;
  }
  if (updateData.topic !== undefined) {
    question.topic = updateData.topic;
  }

  question.lastModifiedById = userId;
  question.status = 'pending_processor'; // Send back to processor for review

  // Add history entry
  question.history.push({
    action: 'updated',
    performedBy: userId,
    role: 'gatherer',
    timestamp: new Date(),
    notes: 'Question updated by gatherer after creator flag approval',
  });

  return await question.save();
};

/**
 * Handle Creator's updated question variant after flag approval
 * When creator updates a question variant that was flagged by explainer and approved by processor
 */
const handleCreatorUpdateVariantAfterFlag = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_creator') {
    throw new Error('Question is not in pending_creator status');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved' || question.flagType !== 'explainer') {
    throw new Error('Question variant was not flagged by explainer and approved by processor');
  }

  // Update question fields
  if (updateData.questionText !== undefined) {
    question.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    question.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    question.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    question.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.explanation !== undefined) {
    question.explanation = updateData.explanation.trim();
  }

  question.lastModifiedById = userId;
  question.status = 'pending_processor'; // Send back to processor for review

  // Add history entry
  question.history.push({
    action: 'updated',
    performedBy: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: 'Question variant updated by creator after explainer flag approval',
  });

  return await question.save();
};

/**
 * Handle Gatherer's updated question after explainer flag approval
 * When gatherer updates a regular question that was flagged by explainer and approved by processor
 */
const handleGathererUpdateAfterExplainerFlag = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_gatherer') {
    throw new Error('Question is not in pending_gatherer status');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved' || question.flagType !== 'explainer') {
    throw new Error('Question was not flagged by explainer and approved by processor');
  }

  if (question.isVariant) {
    throw new Error('This method is for regular questions only. Use handleCreatorUpdateVariantAfterFlag for variants.');
  }

  // Update question fields (similar to updateQuestionByCreator logic)
  if (updateData.questionText !== undefined) {
    question.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    question.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    question.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    question.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.exam !== undefined) {
    question.exam = updateData.exam;
  }
  if (updateData.subject !== undefined) {
    question.subject = updateData.subject;
  }
  if (updateData.topic !== undefined) {
    question.topic = updateData.topic;
  }

  question.lastModifiedById = userId;
  question.status = 'pending_processor'; // Send back to processor for review

  // Add history entry
  question.history.push({
    action: 'updated',
    performedBy: userId,
    role: 'gatherer',
    timestamp: new Date(),
    notes: 'Question updated by gatherer after explainer flag approval',
  });

  return await question.save();
};

/**
 * Handle Processor approval after gatherer/creator updates flagged question
 * When processor approves an updated question that was previously flagged
 */
const approveUpdatedFlaggedQuestion = async (questionId, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  // Determine next status and remove flag
  let nextStatus;
  const lastAction = question.history[question.history.length - 1];
  
  // Remove flag since question is now approved
  question.isFlagged = false;
  question.flagStatus = null;
  question.flaggedById = null;
  question.flagReason = null;
  question.flagReviewedById = null;
  question.flagRejectionReason = null;

  if (lastAction && lastAction.role === 'gatherer') {
    // After gatherer update (from creator flag), move to creator
    nextStatus = 'pending_creator';
  } else if (lastAction && lastAction.role === 'creator') {
    // After creator update (from explainer flag), move to explainer
    nextStatus = 'pending_explainer';
  } else {
    // Default fallback
    nextStatus = 'pending_creator';
  }

  question.status = nextStatus;
  question.approvedById = userId;
  question.rejectedById = null;
  question.rejectionReason = null;

  // Add history entry
  question.history.push({
    action: 'approved',
    performedBy: userId,
    role: 'processor',
    timestamp: new Date(),
    notes: `Question approved after flag correction, moved to ${nextStatus}. Flag removed.`,
  });

  return await question.save();
};

module.exports = {
  createQuestion,
  getQuestionsByStatus,
  getQuestionById,
  updateQuestionByCreator,
  createQuestionVariant,
  updateExplanationByExplainer,
  approveQuestion,
  rejectQuestion,
  getTopicsBySubject,
  getQuestionsWithFilters,
  getQuestionsByExam,
  getQuestionsBySubjectId,
  getQuestionsByTopic,
  getQuestionStatistics,
  getQuestionsCountByStatus,
  getAllQuestionsForSuperadmin,
  getQuestionCounts,
  addCommentToQuestion,
  getGathererQuestionStats,
  getGathererQuestions,
  flagQuestionByCreator,
  reviewCreatorFlag,
  flagQuestionByExplainer,
  reviewExplainerFlag,
  handleGathererUpdateAfterFlag,
  handleGathererUpdateAfterExplainerFlag,
  handleCreatorUpdateVariantAfterFlag,
  approveUpdatedFlaggedQuestion,
};

