const Question = require('../../models/question');
const Exam = require('../../models/exam');
const Subject = require('../../models/subject');
const Topic = require('../../models/topic');

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
 * Get question by ID
 */
const getQuestionById = async (questionId, userId, role) => {
  const question = await Question.findById(questionId)
    .populate('exam', 'name')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('rejectedBy', 'name email');

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
  if (updateData.exam !== undefined) {
    question.exam = updateData.exam;
  }
  if (updateData.subject !== undefined) {
    question.subject = updateData.subject;
  }
  if (updateData.topic !== undefined) {
    question.topic = updateData.topic;
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
 * Get all questions for superadmin with optional search
 */
const getAllQuestionsForSuperadmin = async (filters = {}, searchTerm = '') => {
  return await getQuestionsWithFilters(filters, null, null, searchTerm);
};

/**
 * Get question counts (total, completed, pending)
 * By default respects filters/search, but can be forced to ignore them
 */
const getQuestionCounts = async (filters = {}, searchTerm = '', applyFilters = true) => {
  const baseFilters = applyFilters ? { ...filters } : {};
  const search = applyFilters ? searchTerm : '';

  const totalQuery = buildSearchQuery(baseFilters, search);

  const completedFilters = baseFilters.status
    ? { ...baseFilters }
    : { ...baseFilters, status: 'completed' };
  const completedQuery = buildSearchQuery(completedFilters, search);

  const pendingStatuses = ['pending_processor', 'pending_creator', 'pending_explainer'];
  const pendingFilters = baseFilters.status
    ? { ...baseFilters }
    : { ...baseFilters, status: { $in: pendingStatuses } };
  const pendingQuery = buildSearchQuery(pendingFilters, search);

  const [total, completed, pending] = await Promise.all([
    Question.countDocuments(totalQuery),
    Question.countDocuments(completedQuery),
    Question.countDocuments(pendingQuery),
  ]);

  return {
    total,
    completed,
    pending,
  };
};

/**
 * Get classification (exam -> subjects -> topics) for questions filtered by exam type
 */
const getQuestionClassificationByExamType = async (examType) => {
  if (!['tahsely', 'qudrat'].includes(examType)) {
    throw new Error('Invalid exam type. Must be tahsely or qudrat');
  }

  const exams = await Exam.find({ type: examType }).select('name type status').lean();
  if (exams.length === 0) {
    return {
      type: examType,
      exams: [],
    };
  }

  const examIds = exams.map((exam) => exam._id);

  const questions = await Question.find({ exam: { $in: examIds } })
    .select('exam subject topic')
    .populate('exam', 'name type status')
    .populate('subject', 'name')
    .populate('topic', 'name')
    .lean();

  const classificationMap = new Map();
  const subjectIdsSet = new Set();

  questions.forEach((question) => {
    const exam = question.exam;
    const subject = question.subject;

    if (!exam || exam.type !== examType || !subject) {
      return;
    }

    const examId = exam._id.toString();
    if (!classificationMap.has(examId)) {
      classificationMap.set(examId, {
        id: exam._id,
        name: exam.name,
        type: exam.type,
        status: exam.status,
        subjects: new Map(),
      });
    }

    const examEntry = classificationMap.get(examId);
    const subjectId = subject._id.toString();

    if (!examEntry.subjects.has(subjectId)) {
      examEntry.subjects.set(subjectId, {
        id: subject._id,
        name: subject.name,
      });
      subjectIdsSet.add(subjectId);
    }
  });

  if (classificationMap.size === 0) {
    return {
      type: examType,
      exams: [],
    };
  }

  const subjectIds = Array.from(subjectIdsSet);
  let topicsBySubject = new Map();

  if (subjectIds.length > 0) {
    const topics = await Topic.find({ parentSubject: { $in: subjectIds } })
      .select('name parentSubject')
      .lean();

    topicsBySubject = topics.reduce((map, topic) => {
      const parentId = topic.parentSubject.toString();
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId).push({
        id: topic._id,
        name: topic.name,
      });
      return map;
    }, new Map());
  }

  const examsResult = Array.from(classificationMap.values()).map((examEntry) => ({
    id: examEntry.id,
    name: examEntry.name,
    type: examEntry.type,
    status: examEntry.status,
    subjects: Array.from(examEntry.subjects.values()).map((subjectEntry) => ({
      id: subjectEntry.id,
      name: subjectEntry.name,
      topics: topicsBySubject.get(subjectEntry.id.toString()) || [],
    })),
  }));

  return {
    type: examType,
    exams: examsResult,
  };
};

module.exports = {
  createQuestion,
  getQuestionsByStatus,
  getQuestionById,
  updateQuestionByCreator,
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
  getQuestionClassificationByExamType,
};

