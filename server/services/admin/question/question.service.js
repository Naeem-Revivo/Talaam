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
  const topic = await Topic.findOne({
    _id: questionData.topic,
    parentSubject: questionData.subject,
  });
  if (!topic) {
    throw new Error('Topic not found or does not belong to the selected subject');
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

  return await Question.findById(question._id)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name email');
};

/**
 * Get questions by status and role
 */
const getQuestionsByStatus = async (status, userId, role) => {
  const query = { status };

  // Gatherer can only see their own questions
  if (role === 'gatherer') {
    query.createdBy = userId;
  }

  return await Question.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email')
    .sort({ createdAt: -1 });
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
  const examId = variantData.exam || originalQuestion.exam;
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate subject if provided, otherwise use original question's subject
  const subjectId = variantData.subject || originalQuestion.subject;
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Validate topic if provided, otherwise use original question's topic
  const topicId = variantData.topic || originalQuestion.topic;
  const topic = await Topic.findOne({
    _id: topicId,
    parentSubject: subjectId,
  });
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
    originalQuestion: originalQuestionId,
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

  // Add history entry to original question
  originalQuestion.history.push({
    action: 'variant_created',
    performedBy: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: `Variant question ${variantQuestion._id} created from this question`,
  });
  await originalQuestion.save();

  return await Question.findById(variantQuestion._id)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name email')
    .populate('originalQuestion', 'questionText questionType');
};

/**
 * Get question by ID
 */
const getQuestionById = async (questionId, userId, role) => {
  const question = await Question.findById(questionId)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name fullName email')
    .populate('lastModifiedBy', 'name fullName email')
    .populate('approvedBy', 'name fullName email')
    .populate('rejectedBy', 'name fullName email')
    .populate('comments.commentedBy', 'name fullName email');

  if (!question) {
    throw new Error('Question not found');
  }

  // Gatherer can only access their own questions
  if (role === 'gatherer' && question.createdBy._id.toString() !== userId.toString()) {
    throw new Error('Access denied');
  }

  return question;
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
    const topic = await Topic.findOne({
      _id: updateData.topic,
      parentSubject: subjectId,
    });
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

  // Determine next status based on current workflow
  let nextStatus;
  const lastAction = question.history[question.history.length - 1];
  
  if (lastAction && lastAction.role === 'gatherer') {
    // After gatherer submission, move to creator
    nextStatus = 'pending_creator';
  } else if (lastAction && lastAction.role === 'creator') {
    // After creator submission, move to explainer
    nextStatus = 'pending_explainer';
  } else if (lastAction && lastAction.role === 'explainer') {
    // After explainer submission, mark as completed
    nextStatus = 'completed';
  } else {
    // Default fallback
    nextStatus = 'pending_creator';
  }

  question.status = nextStatus;
  question.approvedBy = userId;
  question.rejectedBy = undefined;
  question.rejectionReason = undefined;

  // Add history entry
  question.history.push({
    action: 'approved',
    performedBy: userId,
    role: 'processor',
    timestamp: new Date(),
    notes: `Question approved, moved to ${nextStatus}`,
  });

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

  return await Topic.find({ parentSubject: subjectId }).sort({ name: 1 });
};

/**
 * Build a base query with optional search term
 */
const buildSearchQuery = (baseFilters = {}, searchTerm = '') => {
  const query = { ...baseFilters };

  if (searchTerm && searchTerm.trim()) {
    const regex = new RegExp(searchTerm.trim(), 'i');
    query.$or = [
      { questionText: regex },
      { explanation: regex },
      { status: regex },
      { 'history.notes': regex },
    ];
  }

  return query;
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

  return await Question.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('rejectedBy', 'name email')
    .sort({ createdAt: -1 });
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
        baseFilters.status = { $in: ['pending_processor', 'pending_creator', 'pending_explainer'] };
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
  const totalItems = await Question.countDocuments(query);

  // Get paginated questions
  const questions = await Question.find(query)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

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

  // Add comment
  question.comments.push({
    comment: comment.trim(),
    commentedBy: userId,
    createdAt: new Date(),
  });

  await question.save();

  // Return question with populated comment data
  return await Question.findById(questionId)
    .populate('comments.commentedBy', 'name fullName email');
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
};

