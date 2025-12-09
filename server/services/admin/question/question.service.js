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
  
  // Creator can only see questions assigned to them
  if (role === 'creator') {
    where.assignedCreatorId = userId;
  }
  
  // Explainer can only see questions assigned to them
  if (role === 'explainer') {
    where.assignedExplainerId = userId;
  }

  const questions = await Question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      exam: { select: { name: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } },
      createdBy: { select: { name: true, email: true } },
      lastModifiedBy: { select: { name: true, email: true } },
      assignedProcessor: { select: { name: true, fullName: true, email: true } },
      assignedCreator: { select: { name: true, fullName: true, email: true } },
      assignedExplainer: { select: { name: true, fullName: true, email: true } },
      approvedBy: { select: { name: true, fullName: true, email: true } }
    }
  });

  // Log for debugging
  if (role === 'explainer' && status === 'pending_explainer') {
    console.log(`[EXPLAINER] Found ${questions.length} questions with status ${status}`);
  }

  // For explainer, group questions: parent first, then variants
  if (role === 'explainer' && status === 'pending_explainer') {
    // If no questions, return empty array
    if (!questions || questions.length === 0) {
      return questions;
    }

    try {
      const parentQuestions = [];
      const variantQuestions = [];
      const parentIdSet = new Set();

      // Helper to normalize ID (handle both string and object IDs)
      const normalizeId = (id) => {
        if (!id) return null;
        if (typeof id === 'string') return id;
        if (typeof id === 'object' && id.toString) return id.toString();
        return String(id);
      };

      // Separate parents and variants
      questions.forEach(q => {
        const questionId = normalizeId(q.id);
        // Check isVariant more flexibly
        const isVariant = q.isVariant === true || 
                         q.isVariant === 'true' || 
                         q.isVariant === 1 ||
                         (q.isVariant !== false && q.isVariant !== 'false' && q.isVariant !== 0 && q.originalQuestionId);
        const originalQuestionId = normalizeId(q.originalQuestionId);
        
        if (isVariant && originalQuestionId) {
          variantQuestions.push(q);
          parentIdSet.add(originalQuestionId);
        } else {
          parentQuestions.push(q);
        }
      });

      // Get parent questions that have variants (normalize IDs for comparison)
      const parentsWithVariants = parentQuestions.filter(p => {
        const parentId = normalizeId(p.id);
        return parentIdSet.has(parentId);
      });
      const parentsWithoutVariants = parentQuestions.filter(p => {
        const parentId = normalizeId(p.id);
        return !parentIdSet.has(parentId);
      });

      // Group variants by parent ID
      const variantsByParent = {};
      variantQuestions.forEach(v => {
        const parentId = normalizeId(v.originalQuestionId);
        if (parentId) {
          if (!variantsByParent[parentId]) {
            variantsByParent[parentId] = [];
          }
          variantsByParent[parentId].push(v);
        }
      });

      // Build ordered list: parent with variants first, then their variants, then parents without variants
      const orderedQuestions = [];
      
      // Add parents with variants, followed by their variants
      parentsWithVariants.forEach(parent => {
        orderedQuestions.push(parent);
        const parentId = normalizeId(parent.id);
        if (parentId && variantsByParent[parentId]) {
          orderedQuestions.push(...variantsByParent[parentId]);
        }
      });

      // Add parents without variants
      orderedQuestions.push(...parentsWithoutVariants);

      // Ensure we return at least the original questions if ordering fails
      return orderedQuestions.length > 0 ? orderedQuestions : questions;
    } catch (error) {
      console.error('Error grouping explainer questions:', error);
      // Return original questions if grouping fails
      return questions;
    }
  }

  return questions;
};

/**
 * Get questions by status and filter by submitter role
 * Used by processor to see submissions from specific roles (creator, explainer, gatherer)
 */
const getQuestionsByStatusAndRole = async (status, submittedByRole) => {
  const { prisma } = require('../../../config/db/prisma');
  
  // Build where clause with status and role filtering
  const where = {
    status: status
  };
  
  // Get user IDs with the specified role (needed for filtering)
  let userIdsWithRole = [];
  if (submittedByRole) {
    const usersWithRole = await prisma.user.findMany({
      where: {
        adminRole: submittedByRole
      },
      select: {
        id: true
      }
    });
    userIdsWithRole = usersWithRole.map(u => u.id);
  }

  // If filtering by submitter role, we need to check history
  if (submittedByRole) {
    // Get question IDs where the specified role has submitted/worked on them
    // Include 'rejected' action for explainer to catch questions rejected after they submitted
    // Include 'flagged' action for creator to catch questions flagged by creator
    const actionsToCheck = submittedByRole === 'explainer' 
      ? ['created', 'updated', 'submitted', 'approved', 'rejected']
      : submittedByRole === 'creator'
      ? ['created', 'updated', 'submitted', 'approved', 'flagged']
      : ['created', 'updated', 'submitted', 'approved'];
    
    const roleHistoryEntries = await prisma.questionHistory.findMany({
      where: {
        role: submittedByRole,
        action: {
          in: actionsToCheck
        }
      },
      select: {
        questionId: true
      }
    });

    const questionIdsFromHistory = roleHistoryEntries.length > 0
      ? [...new Set(roleHistoryEntries.map(h => h.questionId))]
      : [];

    // Build OR condition for role-based filtering
    const roleConditions = [];

    // Add questions from history
    if (questionIdsFromHistory.length > 0) {
      roleConditions.push({
        id: {
          in: questionIdsFromHistory
        }
      });
    }

    // For gatherer: also check createdBy OR flagRejectionReason (gatherer rejected a flag)
    if (submittedByRole === 'gatherer' && userIdsWithRole.length > 0) {
      roleConditions.push({
        createdById: {
          in: userIdsWithRole
        }
      });
      
      // Include questions where gatherer rejected a flag (has flagRejectionReason)
      // These are in pending_processor status and need processor review
      roleConditions.push({
        AND: [
          {
            flagRejectionReason: {
              not: null
            }
          },
          {
            status: 'pending_processor'
          }
        ]
      });
    }

    // For creator: check assignedCreatorId OR lastModifiedBy (creator modifies questions) OR flagged by creator
    if (submittedByRole === 'creator' && userIdsWithRole.length > 0) {
      // First priority: questions assigned to specific creators
      roleConditions.push({
        assignedCreatorId: {
          in: userIdsWithRole
        }
      });
      
      roleConditions.push({
        lastModifiedById: {
          in: userIdsWithRole
        }
      });
      
      // Also include questions flagged by creator (they have status pending_processor but are flagged)
      roleConditions.push({
        AND: [
          {
            isFlagged: true
          },
          {
            flagType: 'creator'
          },
          {
            OR: [
              { flagStatus: 'pending' },
              { flagStatus: null }
            ]
          }
        ]
      });
      
      // Include questions in pending_explainer or completed that have approvedBy
      // These went through creator workflow, then processor approved and sent to explainer
      roleConditions.push({
        AND: [
          {
            status: {
              in: ['pending_explainer', 'completed']
            }
          },
          {
            approvedById: {
              not: null
            }
          }
        ]
      });
    }

    // For explainer: check assignedExplainerId OR lastModifiedBy and explanation exists OR flagged by explainer
    // OR status is pending_explainer (assigned to explainer)
    if (submittedByRole === 'explainer' && userIdsWithRole.length > 0) {
      // First priority: questions assigned to specific explainers
      roleConditions.push({
        assignedExplainerId: {
          in: userIdsWithRole
        }
      });
      
      // Include questions with explanation that were modified by explainer (regardless of status)
      roleConditions.push({
        AND: [
          {
            lastModifiedById: {
              in: userIdsWithRole
            }
          },
          {
            explanation: {
              not: ''
            }
          }
        ]
      });
      
      // Include questions with pending_explainer status (assigned to explainer, may or may not have explanation yet)
      roleConditions.push({
        status: 'pending_explainer'
      });
      
      // Also include questions flagged by explainer (they have status pending_processor but are flagged)
      roleConditions.push({
        AND: [
          {
            isFlagged: true
          },
          {
            flagType: 'explainer'
          },
          {
            OR: [
              { flagStatus: 'pending' },
              { flagStatus: null }
            ]
          }
        ]
      });
    }

    // If we have role conditions, add them to the where clause
    if (roleConditions.length > 0) {
      where.AND = [
        {
          OR: roleConditions
        }
      ];
    } else {
      // If no role conditions found, return empty result
      return [];
    }
  }

  const questions = await Question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      exam: { select: { name: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } },
      createdBy: { select: { name: true, email: true } },
      lastModifiedBy: { select: { name: true, email: true } },
      assignedProcessor: { select: { name: true, fullName: true, email: true } },
      assignedCreator: { select: { name: true, fullName: true, email: true } },
      assignedExplainer: { select: { name: true, fullName: true, email: true } },
      approvedBy: { select: { name: true, fullName: true, email: true } },
      history: {
        include: {
          performedBy: { select: { id: true, adminRole: true } }
        },
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  // Additional filtering: ensure questions actually went through the specified role
  // Show questions that were: created, approved, or flagged by the role
  const filteredQuestions = questions.filter(question => {
    if (!submittedByRole) return true;

    // Check history for the role (created, updated, submitted, approved, flagged)
    const hasRoleHistory = question.history && Array.isArray(question.history) &&
      question.history.some(h => h.role === submittedByRole);

    // Check if role approved the question (history with action='approved' and role)
    const hasRoleApproval = question.history && Array.isArray(question.history) &&
      question.history.some(h => h.role === submittedByRole && h.action === 'approved');

    // Check if role flagged the question
    const isFlaggedByRole = question.isFlagged === true && 
                           question.flagType === submittedByRole &&
                           (question.flagStatus === 'pending' || question.flagStatus === null || question.flagStatus === undefined);

    // For gatherer: check createdBy (gatherer creates questions)
    if (submittedByRole === 'gatherer') {
      const createdByGatherer = question.createdById && userIdsWithRole && userIdsWithRole.includes(question.createdById);
      const createdByRole = question.createdBy?.adminRole === 'gatherer' || 
                           (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'gatherer');
      return hasRoleHistory || hasRoleApproval || isFlaggedByRole || createdByGatherer || createdByRole;
    }

    // For creator: check if question went through creator workflow
    if (submittedByRole === 'creator') {
      // Check if creator modified it (lastModifiedBy is creator)
      const lastModifiedByCreator = question.lastModifiedById && userIdsWithRole && userIdsWithRole.includes(question.lastModifiedById);
      
      // Check if went through creator workflow (approved by processor and sent to creator, then to explainer/completed)
      const wentThroughCreatorWorkflow = question.approvedBy !== null || 
                                        question.status === 'pending_explainer' ||
                                        question.status === 'completed';
      
      return hasRoleHistory || hasRoleApproval || isFlaggedByRole || lastModifiedByCreator || wentThroughCreatorWorkflow;
    }

    // For explainer: check if explainer worked on it
    if (submittedByRole === 'explainer') {
      // Check if explainer modified it (lastModifiedBy is explainer and has explanation)
      const lastModifiedByExplainer = question.lastModifiedById && userIdsWithRole && userIdsWithRole.includes(question.lastModifiedById);
      const hasExplanation = question.explanation && question.explanation.trim() !== '';
      
      return hasRoleHistory || hasRoleApproval || isFlaggedByRole || (lastModifiedByExplainer && hasExplanation);
    }

    return hasRoleHistory || hasRoleApproval || isFlaggedByRole;
  });

  return filteredQuestions;
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

  // Helper function to safely extract ID string from value
  const getStringId = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.id) return String(value.id);
    return null;
  };

  // Get exam ID - prioritize direct examId field, then variant data, then relation
  let examId = originalQuestion.examId || null;
  if (!examId && variantData.exam) {
    examId = getStringId(variantData.exam);
  }
  if (!examId && originalQuestion.exam) {
    examId = getStringId(originalQuestion.exam);
  }
  
  if (!examId || typeof examId !== 'string') {
    throw new Error(`Valid exam ID is required. Received: ${JSON.stringify({ 
      examId, 
      variantDataExam: variantData.exam,
      originalExamId: originalQuestion.examId,
      originalExam: originalQuestion.exam 
    })}`);
  }
  
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Get subject ID - prioritize direct subjectId field, then variant data, then relation
  let subjectId = originalQuestion.subjectId || null;
  if (!subjectId && variantData.subject) {
    subjectId = getStringId(variantData.subject);
  }
  if (!subjectId && originalQuestion.subject) {
    subjectId = getStringId(originalQuestion.subject);
  }
  
  if (!subjectId || typeof subjectId !== 'string') {
    throw new Error(`Valid subject ID is required. Received: ${JSON.stringify({ 
      subjectId, 
      variantDataSubject: variantData.subject,
      originalSubjectId: originalQuestion.subjectId,
      originalSubject: originalQuestion.subject 
    })}`);
  }
  
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Get topic ID - prioritize direct topicId field, then variant data, then relation
  let topicId = originalQuestion.topicId || null;
  if (!topicId && variantData.topic) {
    topicId = getStringId(variantData.topic);
  }
  if (!topicId && originalQuestion.topic) {
    topicId = getStringId(originalQuestion.topic);
  }
  
  if (!topicId || typeof topicId !== 'string') {
    throw new Error(`Valid topic ID is required. Received: ${JSON.stringify({ 
      topicId, 
      variantDataTopic: variantData.topic,
      originalTopicId: originalQuestion.topicId,
      originalTopic: originalQuestion.topic 
    })}`);
  }
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
  // Get assignedProcessorId from original question (required field)
  const assignedProcessorId = originalQuestion.assignedProcessorId || originalQuestion.assignedProcessor?.id || originalQuestion.assignedProcessor;
  
  if (!assignedProcessorId) {
    throw new Error('Original question must have an assigned processor. Cannot create variant without assigned processor.');
  }

  // Get assignedCreatorId and assignedExplainerId from original question
  const assignedCreatorId = originalQuestion.assignedCreatorId || originalQuestion.assignedCreator?.id || originalQuestion.assignedCreator;
  const assignedExplainerId = originalQuestion.assignedExplainerId || originalQuestion.assignedExplainer?.id || originalQuestion.assignedExplainer;

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
    assignedProcessor: assignedProcessorId, // Required field - inherit from original question
    assignedCreator: assignedCreatorId, // Copy from original question
    assignedExplainer: assignedExplainerId, // Copy from original question
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

  // Update original question status to 'pending_processor' after variant creation
  // This sends the question back to processor for review after creator has completed their work
  const updateData = {
    status: 'pending_processor',
  };
  await Question.update(originalQuestionId, updateData);
  
  // Add history entry to indicate creator has approved/submitted the question
  await Question.addHistory(originalQuestionId, {
    action: 'approved',
    performedById: userId,
    role: 'creator',
    timestamp: new Date(),
    notes: 'Question approved by creator and sent to processor for review',
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

  // Access control: Check if user has permission to view this question
  // Gatherer can only access their own questions
  if (role === 'gatherer' && question.createdById !== userId) {
    throw new Error('Access denied');
  }
  
  // Creator can only see questions assigned to them
  if (role === 'creator') {
    if (question.assignedCreatorId && question.assignedCreatorId !== userId) {
      throw new Error('Access denied. This question is not assigned to you.');
    }
  }
  
  // Explainer can only see questions assigned to them
  if (role === 'explainer') {
    if (question.assignedExplainerId && question.assignedExplainerId !== userId) {
      throw new Error('Access denied. This question is not assigned to you.');
    }
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
    // Handle "flagged" as a special status that filters by isFlagged
    if (status === 'flagged') {
      where.isFlagged = true;
    } else {
      where.status = status;
    }
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
      isFlagged: q.isFlagged || false,
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

  // Check if this is a status-only update (just submitting/approving without changing content)
  const isStatusOnlyUpdate = Object.keys(updateData).length === 1 && updateData.status !== undefined;
  
  // If status-only update, just update status and add history, skip all validation
  if (isStatusOnlyUpdate && updateData.status === 'pending_processor') {
    // Use Prisma update method instead of Mongoose save
    return await Question.update(questionId, {
      status: 'pending_processor',
      lastModifiedBy: userId,
      history: [{
        action: 'approved',
        performedBy: userId,
        role: 'creator',
        timestamp: new Date(),
        notes: 'Question approved by creator and sent to processor for review',
      }],
    });
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
  
  // Only validate content if we're actually updating question content
  {
    // Determine final question type (use updated type or existing type)
    const finalQuestionType = updateData.questionType !== undefined 
      ? updateData.questionType 
      : question.questionType;

    // Validate MCQ requirements only when updating question content
    if (finalQuestionType === 'MCQ') {
      // Check if options are provided or already exist
      const finalOptions = updateData.options || question.options;
      if (!finalOptions || !finalOptions.A || !finalOptions.B || 
          !finalOptions.C || !finalOptions.D) {
        throw new Error('All four options (A, B, C, D) are required for MCQ questions');
      }
      
      // Correct answer must be provided when updating MCQ questions
      // Only validate if correctAnswer is being updated, otherwise use existing one
      if (updateData.correctAnswer !== undefined) {
        if (!['A', 'B', 'C', 'D'].includes(updateData.correctAnswer)) {
          throw new Error('Correct answer must be A, B, C, or D for MCQ questions');
        }
      } else {
        // If not updating correctAnswer, ensure existing one is valid
        if (!question.correctAnswer || !['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
          throw new Error('Valid correct answer is required for MCQ questions');
        }
      }
    }
  }

  // Build update data object for Prisma
  const prismaUpdateData = {
    status: 'pending_processor', // Always set status to pending_processor when creator submits
    lastModifiedBy: userId,
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'creator',
      timestamp: new Date(),
      notes: 'Question updated by creator and approved. Sent to processor for review',
    }],
  };

  // Add question content fields if provided
  if (updateData.questionText !== undefined) {
    prismaUpdateData.questionText = updateData.questionText;
  }
  if (updateData.questionType !== undefined) {
    prismaUpdateData.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    prismaUpdateData.options = updateData.options;
  }
  if (updateData.correctAnswer !== undefined) {
    prismaUpdateData.correctAnswer = updateData.correctAnswer;
  }
  
  // Track if classification changed
  let classificationChanged = false;
  let finalExam = question.examId || (question.exam?.id);
  let finalSubject = question.subjectId || (question.subject?.id);
  let finalTopic = question.topicId || (question.topic?.id);

  if (updateData.exam !== undefined) {
    // Extract exam ID if it's an object
    const examId = typeof updateData.exam === 'string' 
      ? updateData.exam 
      : (updateData.exam?.id || updateData.exam);
    prismaUpdateData.exam = examId;
    finalExam = examId;
    classificationChanged = true;
  }
  if (updateData.subject !== undefined) {
    // Extract subject ID if it's an object
    const subjectId = typeof updateData.subject === 'string' 
      ? updateData.subject 
      : (updateData.subject?.id || updateData.subject);
    prismaUpdateData.subject = subjectId;
    finalSubject = subjectId;
    classificationChanged = true;
  }
  if (updateData.topic !== undefined) {
    // Extract topic ID if it's an object
    const topicId = typeof updateData.topic === 'string' 
      ? updateData.topic 
      : (updateData.topic?.id || updateData.topic);
    prismaUpdateData.topic = topicId;
    finalTopic = topicId;
    classificationChanged = true;
  }

  // Update classification if exam, subject, or topic changed
  if (classificationChanged) {
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

  // Use Prisma update method instead of Mongoose save
  return await Question.update(questionId, prismaUpdateData);
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

  // Use Prisma update method instead of Mongoose save
  // Change status to pending_processor so processor can see and process it
  return await Question.update(questionId, {
    explanation: explanation.trim(),
    lastModifiedBy: userId,
    status: 'pending_processor', // Change status so processor can see it
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'explainer',
      timestamp: new Date(),
      notes: 'Explanation added/updated by explainer. Sent to processor for review.',
    }],
  });
};

/**
 * Approve question by Processor
 * @param {string} questionId - Question ID
 * @param {string} userId - Processor user ID
 * @param {string} assignedUserId - Optional: Creator or Explainer user ID to assign
 */
const approveQuestion = async (questionId, userId, assignedUserId = null) => {
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
     question.history.some(h => h.role === 'creator' && h.action === 'updated') ||
     question.history.some(h => h.role === 'explainer' && h.action === 'updated'));

  // Determine next status based on current workflow
  let nextStatus;
  // History is ordered by timestamp desc, so the most recent entry is at index 0
  const lastAction = question.history && question.history.length > 0 
    ? question.history[0] 
    : null;
  
  // PRIORITY 1: If question was updated after flag approval, route based on who flagged it
  // This ensures explainer-flagged questions go back to explainer, not creator
  if (wasUpdatedAfterFlag && question.flagType) {
    if (question.flagType === 'creator') {
      // If creator flagged, send back to creator after update
      nextStatus = 'pending_creator';
    } else if (question.flagType === 'explainer') {
      // If explainer flagged, send back to explainer after update (CRITICAL: don't go to creator)
      nextStatus = 'pending_explainer';
    } else {
      // Default fallback
      nextStatus = 'pending_creator';
    }
  } 
  // PRIORITY 2: Direct flag approval (processor approves flagged question without update)
  else if (question.isFlagged && question.flagType && !wasUpdatedAfterFlag) {
    // Route based on flagType to continue normal workflow
    if (question.flagType === 'creator') {
      // Creator flagged - continue to creator
      nextStatus = 'pending_creator';
    } else if (question.flagType === 'explainer') {
      // Explainer flagged - continue to explainer (CRITICAL: don't go to creator)
      nextStatus = 'pending_explainer';
    } else {
      // Default fallback
      nextStatus = 'pending_creator';
    }
  } 
  // PRIORITY 3: Check if question has flagType even if flag was cleared (for edge cases)
  else if (question.flagType && !question.isFlagged) {
    // Question had a flag that was resolved, route based on original flagType
    if (question.flagType === 'explainer') {
      // Was explainer flag - send back to explainer (CRITICAL: don't go to creator)
      nextStatus = 'pending_explainer';
    } else if (question.flagType === 'creator') {
      nextStatus = 'pending_creator';
    } else {
      // Default fallback
      nextStatus = 'pending_creator';
    }
  }
  // PRIORITY 4: Normal workflow based on last action role
  // BUT: Check flagType first to ensure explainer-flagged questions don't go to creator
  else if (lastAction && lastAction.role === 'gatherer') {
    // After gatherer submission/update
    // CRITICAL: If question was flagged by explainer, route to explainer, not creator
    if (question.flagType === 'explainer') {
      nextStatus = 'pending_explainer';
    } else {
      // Normal flow: move to creator
      nextStatus = 'pending_creator';
    }
  } 
  // PRIORITY 5: Check if question has explanation (regardless of last action role)
  // This ensures that if explainer added explanation, question is marked complete when processor approves
  // This is the FINAL STEP - after explanation is added, approval should mark as completed
  // This check must come BEFORE creator/explainer role checks to ensure completion takes priority
  else if (question.explanation && question.explanation.trim() !== '') {
    // Question has explanation - this is the final step, mark as completed
    nextStatus = 'completed';
  } 
  // PRIORITY 6: Normal workflow based on last action role (only if no explanation exists)
  else if (lastAction && lastAction.role === 'creator') {
    // After creator submission/update, check if it was an accept or flag
    // If creator accepted (status was set to pending_processor), move to explainer
    // If creator flagged, it's already handled above in flag approval logic
    // For normal creator accept flow, move to explainer
    nextStatus = 'pending_explainer';
  } else if (lastAction && lastAction.role === 'explainer') {
    // After explainer action but no explanation exists yet
    // Keep in explainer submission
    nextStatus = 'pending_explainer';
  } else {
    // Default fallback
    nextStatus = 'pending_creator';
  }

  // Validate and assign creator/explainer if provided
  // Only assign if not already assigned (assignment happens only once)
  if (assignedUserId) {
    const { prisma } = require('../../../config/db/prisma');
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedUserId },
      select: { id: true, adminRole: true, status: true }
    });
    
    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }
    
    if (assignedUser.status !== 'active') {
      throw new Error('Assigned user is not active');
    }
    
    // Assign based on next status
    if (nextStatus === 'pending_creator') {
      if (assignedUser.adminRole !== 'creator') {
        throw new Error('Assigned user must be a creator');
      }
      // Only assign if not already assigned
      if (!question.assignedCreatorId) {
        // Will be set in updateData below
      } else {
        // Already assigned, don't change it
        assignedUserId = null;
      }
    } else if (nextStatus === 'pending_explainer') {
      if (assignedUser.adminRole !== 'explainer') {
        throw new Error('Assigned user must be an explainer');
      }
      // Only assign if not already assigned
      if (!question.assignedExplainerId) {
        // Will be set in updateData below
      } else {
        // Already assigned, don't change it
        assignedUserId = null;
      }
    }
  }

  // Prepare update data
  const updateData = {
    status: nextStatus,
    approvedBy: userId,
    rejectedBy: null,
    rejectionReason: null,
  };
  
  // Assign creator or explainer if provided and not already assigned
  if (assignedUserId) {
    if (nextStatus === 'pending_creator' && !question.assignedCreatorId) {
      updateData.assignedCreator = assignedUserId;
    } else if (nextStatus === 'pending_explainer' && !question.assignedExplainerId) {
      updateData.assignedExplainer = assignedUserId;
      
      // Also update all variants of this question to have the same assignedExplainerId
      // This ensures variants are visible to the explainer
      try {
        const variants = await Question.findMany({
          where: {
            originalQuestionId: questionId,
            isVariant: true
          }
        });
        
        // Update each variant with the same assignedExplainerId
        if (variants && variants.length > 0) {
          await Promise.all(
            variants.map(variant => 
              Question.update(variant.id, {
                assignedExplainer: assignedUserId
              })
            )
          );
        }
      } catch (variantError) {
        console.error('Error updating variants with assignedExplainerId:', variantError);
        // Don't fail the main update if variant update fails
      }
    }
  }

  // Always remove flag when processor approves a flagged question
  // Also clear flag-related fields if question was rejected by gatherer (flagRejectionReason exists)
  if (question.isFlagged || question.flagRejectionReason) {
    const flagType = question.flagType || 'unknown'; // 'creator' or 'explainer'
    const wasRejectedByGatherer = question.flagRejectionReason && !question.isFlagged;
    
    updateData.isFlagged = false;
    updateData.flagStatus = null;
    updateData.flaggedBy = null;
    updateData.flagReason = null;
    updateData.flagReviewedBy = null;
    updateData.flagRejectionReason = null; // Clear gatherer's rejection reason when processor approves
    
    // Add history entry with flag type info
    let historyNote;
    if (wasRejectedByGatherer) {
      historyNote = `Question approved after gatherer rejected the flag. Gatherer's reason was accepted. Moved to ${nextStatus}. All flag data cleared.`;
    } else if (wasUpdatedAfterFlag) {
      historyNote = `Question approved after ${flagType} flag correction, moved to ${nextStatus}. Flag removed.`;
    } else {
      historyNote = `Question approved with ${flagType} flag, moved to ${nextStatus}. Flag removed.`;
    }
    
    updateData.history = [{
      action: 'approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: historyNote,
    }];
  } else {
    // Add history entry for non-flagged questions
    updateData.history = [{
      action: 'approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Question approved, moved to ${nextStatus}`,
    }];
  }

  // Use Prisma update instead of save
  return await Question.update(questionId, updateData);
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

  const finalRejectionReason = rejectionReason || 'No reason provided';

  // Prepare update data
  const updateData = {
    status: 'rejected',
    rejectedBy: userId,
    rejectionReason: finalRejectionReason,
    approvedBy: null,
    history: [{
      action: 'rejected',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Question rejected: ${finalRejectionReason}`,
    }]
  };

  // Use Prisma update instead of save
  return await Question.update(questionId, updateData);
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

  // Update question with flag using Prisma update
  const updatedQuestion = await Question.update(questionId, {
    isFlagged: true,
    flaggedById: userId,
    flagReason: flagReason.trim(),
    flagType: 'creator',
    flagStatus: 'pending',
    status: 'pending_processor', // Send back to processor
    history: [{
      action: 'flagged',
      performedById: userId,
      role: 'creator',
      timestamp: new Date(),
      notes: `Question flagged by creator: ${flagReason.trim()}`,
    }]
  });

  return updatedQuestion;
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
    return await Question.update(questionId, {
      flagStatus: 'approved',
      flagReviewedBy: userId,
      status: 'pending_gatherer', // Send back to gatherer for correction
      history: [{
        action: 'flag_approved',
        performedBy: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Creator's flag approved. Reason: ${question.flagReason}. Sent back to gatherer for correction.`,
      }],
    });
  } else {
    // Processor rejects the flag - send back to Creator
    return await Question.update(questionId, {
      flagStatus: 'rejected',
      flagReviewedBy: userId,
      flagRejectionReason: rejectionReason.trim(),
      isFlagged: false, // Remove flag
      flaggedBy: null,
      flagReason: null,
      status: 'pending_creator', // Send back to creator
      history: [{
        action: 'flag_rejected',
        performedBy: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Creator's flag rejected. Processor reason: ${rejectionReason.trim()}. Sent back to creator.`,
      }],
    });
  }
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

  // Update question with flag - note whether it's a variant or regular question
  const questionType = question.isVariant ? 'variant' : 'question';
  
  return await Question.update(questionId, {
    isFlagged: true,
    flaggedBy: userId,
    flagReason: flagReason.trim(),
    flagType: 'explainer',
    flagStatus: 'pending',
    status: 'pending_processor', // Send back to processor
    history: [{
      action: 'flagged',
      performedBy: userId,
      role: 'explainer',
      timestamp: new Date(),
      notes: `${questionType === 'variant' ? 'Question variant' : 'Question'} flagged by explainer: ${flagReason.trim()}`,
    }],
  });
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
    // Determine where to send based on whether it's a variant or regular question
    if (question.isVariant) {
      // Variant: send back to Creator for correction
      return await Question.update(questionId, {
        flagStatus: 'approved',
        flagReviewedBy: userId,
        status: 'pending_creator',
        history: [{
          action: 'flag_approved',
          performedBy: userId,
          role: 'processor',
          timestamp: new Date(),
          notes: `Explainer's flag approved for variant. Reason: ${question.flagReason}. Sent back to creator for correction.`,
        }],
      });
    } else {
      // Regular question: send back to Gatherer for correction
      return await Question.update(questionId, {
        flagStatus: 'approved',
        flagReviewedBy: userId,
        status: 'pending_gatherer',
        history: [{
          action: 'flag_approved',
          performedBy: userId,
          role: 'processor',
          timestamp: new Date(),
          notes: `Explainer's flag approved. Reason: ${question.flagReason}. Sent back to gatherer for correction.`,
        }],
      });
    }
  } else {
    // Processor rejects the flag - send back to Explainer
    const questionType = question.isVariant ? 'variant' : 'question';
    return await Question.update(questionId, {
      flagStatus: 'rejected',
      flagReviewedBy: userId,
      flagRejectionReason: rejectionReason.trim(),
      isFlagged: false, // Remove flag
      flaggedBy: null,
      flagReason: null,
      status: 'pending_explainer', // Send back to explainer
      history: [{
        action: 'flag_rejected',
        performedBy: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Explainer's flag rejected for ${questionType}. Processor reason: ${rejectionReason.trim()}. Sent back to explainer.`,
      }],
    });
  }
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

  // Build update data object for Prisma
  const prismaUpdateData = {
    lastModifiedBy: userId,
    status: 'pending_processor', // Send back to processor for review
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'gatherer',
      timestamp: new Date(),
      notes: 'Question updated by gatherer after creator flag approval',
    }],
  };

  // Update question fields (similar to updateQuestionByCreator logic)
  if (updateData.questionText !== undefined) {
    prismaUpdateData.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    prismaUpdateData.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    prismaUpdateData.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    prismaUpdateData.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.exam !== undefined) {
    prismaUpdateData.exam = updateData.exam;
  }
  if (updateData.subject !== undefined) {
    prismaUpdateData.subject = updateData.subject;
  }
  if (updateData.topic !== undefined) {
    prismaUpdateData.topic = updateData.topic;
  }

  return await Question.update(questionId, prismaUpdateData);
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

  // Build update data object for Prisma
  const prismaUpdateData = {
    lastModifiedBy: userId,
    status: 'pending_processor', // Send back to processor for review
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'creator',
      timestamp: new Date(),
      notes: 'Question variant updated by creator after explainer flag approval',
    }],
  };

  // Update question fields
  if (updateData.questionText !== undefined) {
    prismaUpdateData.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    prismaUpdateData.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    prismaUpdateData.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    prismaUpdateData.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.explanation !== undefined) {
    prismaUpdateData.explanation = updateData.explanation.trim();
  }

  return await Question.update(questionId, prismaUpdateData);
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

  // Build update data object for Prisma
  const prismaUpdateData = {
    lastModifiedBy: userId,
    status: 'pending_processor', // Send back to processor for review
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'gatherer',
      timestamp: new Date(),
      notes: 'Question updated by gatherer after explainer flag approval',
    }],
  };

  // Update question fields (similar to updateQuestionByCreator logic)
  if (updateData.questionText !== undefined) {
    prismaUpdateData.questionText = updateData.questionText.trim();
  }
  if (updateData.questionType !== undefined) {
    prismaUpdateData.questionType = updateData.questionType;
  }
  if (updateData.options !== undefined) {
    prismaUpdateData.options = {
      A: updateData.options.A.trim(),
      B: updateData.options.B.trim(),
      C: updateData.options.C.trim(),
      D: updateData.options.D.trim(),
    };
  }
  if (updateData.correctAnswer !== undefined) {
    prismaUpdateData.correctAnswer = updateData.correctAnswer;
  }
  if (updateData.exam !== undefined) {
    prismaUpdateData.exam = updateData.exam;
  }
  if (updateData.subject !== undefined) {
    prismaUpdateData.subject = updateData.subject;
  }
  if (updateData.topic !== undefined) {
    prismaUpdateData.topic = updateData.topic;
  }

  return await Question.update(questionId, prismaUpdateData);
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

  // Check if question was updated after a flag was approved
  const wasUpdatedAfterFlag = question.isFlagged && 
    question.flagStatus === 'approved' && 
    (question.history.some(h => h.role === 'gatherer' && h.action === 'updated') ||
     question.history.some(h => h.role === 'creator' && h.action === 'updated') ||
     question.history.some(h => h.role === 'explainer' && h.action === 'updated'));

  // Determine next status and remove flag
  let nextStatus;
  // History is ordered by timestamp desc, so the most recent entry is at index 0
  const lastAction = question.history && question.history.length > 0 
    ? question.history[0] 
    : null;
  
  // PRIORITY 1: If question was updated after flag approval, route based on who flagged it
  // This ensures explainer-flagged questions go back to explainer, not creator
  if (wasUpdatedAfterFlag && question.flagType) {
    if (question.flagType === 'creator') {
      // If creator flagged, send back to creator after update
      nextStatus = 'pending_creator';
    } else if (question.flagType === 'explainer') {
      // If explainer flagged, send back to explainer after update (CRITICAL: don't go to creator)
      nextStatus = 'pending_explainer';
    } else {
      // Default fallback
      nextStatus = 'pending_creator';
    }
  } 
  // PRIORITY 2: Check flagType even if flag was cleared (for edge cases)
  else if (question.flagType && !question.isFlagged) {
    // Question had a flag that was resolved, route based on original flagType
    if (question.flagType === 'explainer') {
      // Was explainer flag - send back to explainer (CRITICAL: don't go to creator)
      nextStatus = 'pending_explainer';
    } else if (question.flagType === 'creator') {
      nextStatus = 'pending_creator';
    } else {
      // Default fallback
      nextStatus = 'pending_creator';
    }
  }
  // PRIORITY 3: Normal workflow based on last action role
  // BUT: Check flagType first to ensure explainer-flagged questions don't go to creator
  else if (lastAction && lastAction.role === 'gatherer') {
    // After gatherer update
    // CRITICAL: If question was flagged by explainer, route to explainer, not creator
    if (question.flagType === 'explainer') {
      nextStatus = 'pending_explainer';
    } else {
      // Normal flow: move to creator
      nextStatus = 'pending_creator';
    }
  } else if (lastAction && lastAction.role === 'creator') {
    // After creator update (from explainer flag), move to explainer
    nextStatus = 'pending_explainer';
  } else {
    // Default fallback
    nextStatus = 'pending_creator';
  }

  // Use Prisma update method instead of Mongoose save
  return await Question.update(questionId, {
    // Remove flag since question is now approved
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    flagReason: null,
    flagReviewedBy: null,
    flagRejectionReason: null,
    status: nextStatus,
    approvedBy: userId,
    rejectedBy: null,
    rejectionReason: null,
    history: [{
      action: 'approved',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Question approved after flag correction, moved to ${nextStatus}. Flag removed.`,
    }],
  });
};

/**
 * Update flagged question by Gatherer
 * When gatherer updates a question that was flagged and sent back to them
 */
const updateFlaggedQuestionByGatherer = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // Check if question is flagged and in pending_gatherer status
  if (question.status !== 'pending_gatherer') {
    throw new Error('Question is not in pending_gatherer status');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved') {
    throw new Error('Question was not flagged and approved by processor');
  }

  // Route to appropriate handler based on who flagged it
  if (question.flagType === 'creator') {
    // Creator flagged - use handleGathererUpdateAfterFlag
    return await handleGathererUpdateAfterFlag(questionId, updateData, userId);
  } else if (question.flagType === 'explainer') {
    // Explainer flagged - use handleGathererUpdateAfterExplainerFlag
    return await handleGathererUpdateAfterExplainerFlag(questionId, updateData, userId);
  } else {
    throw new Error('Unknown flag type. Cannot determine update handler.');
  }
};

/**
 * Update flagged variant by Creator
 * When creator updates a variant that was flagged and sent back to them
 */
const updateFlaggedVariantByCreator = async (questionId, updateData, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // Check if question is a variant and is flagged and in pending_creator status
  if (!question.isVariant) {
    throw new Error('This method is for variants only');
  }

  if (question.status !== 'pending_creator') {
    throw new Error('Question is not in pending_creator status');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved') {
    throw new Error('Question variant was not flagged and approved by processor');
  }

  // Route to appropriate handler based on who flagged it
  if (question.flagType === 'explainer') {
    // Explainer flagged variant - use handleCreatorUpdateVariantAfterFlag
    return await handleCreatorUpdateVariantAfterFlag(questionId, updateData, userId);
  } else {
    throw new Error('Unknown flag type. Cannot determine update handler.');
  }
};

/**
 * Reject flag by Creator
 * When creator believes the flag is incorrect
 */
const rejectFlagByCreator = async (questionId, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved') {
    throw new Error('Question is not flagged or flag has not been approved by processor');
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is required');
  }

  // Store the original flag information before clearing it
  const originalFlagType = question.flagType;
  const originalFlagReason = question.flagReason;
  const originalFlaggedBy = question.flaggedBy;

  // Update question to remove flag and send back to processor with rejection reason
  // Keep flagReason and flagType so processor can see original flag info
  return await Question.update(questionId, {
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    // Keep flagReason so processor can see original flag reason
    flagReason: originalFlagReason,
    flagReviewedBy: null,
    flagRejectionReason: rejectionReason.trim(),
    flagType: originalFlagType, // Keep flagType to know who originally flagged it
    status: 'pending_processor', // Send back to processor for review
    history: [{
      action: 'flag_rejected_by_creator',
      performedBy: userId,
      role: 'creator',
      timestamp: new Date(),
      notes: `Creator rejected the flag. Reason: ${rejectionReason.trim()}. Sent back to processor for review.`,
    }],
  });
};

/**
 * Reject flag by Gatherer
 * When gatherer believes the flag is incorrect
 */
const rejectFlagByGatherer = async (questionId, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagStatus !== 'approved') {
    throw new Error('Question is not flagged or flag has not been approved by processor');
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is required');
  }

  // Store the original flag information before clearing it
  const originalFlagType = question.flagType;
  const originalFlagReason = question.flagReason;
  const originalFlaggedBy = question.flaggedBy;

  // Update question to remove flag and send back to processor with rejection reason
  // Keep flagReason and flagType so processor can see original flag info
  return await Question.update(questionId, {
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    // Keep flagReason so processor can see original flag reason
    flagReason: originalFlagReason,
    flagReviewedBy: null,
    flagRejectionReason: rejectionReason.trim(),
    flagType: originalFlagType, // Keep flagType to know who originally flagged it
    status: 'pending_processor', // Send back to processor for review
    history: [{
      action: 'flag_rejected_by_gatherer',
      performedBy: userId,
      role: 'gatherer',
      timestamp: new Date(),
      notes: `Gatherer rejected the flag. Reason: ${rejectionReason.trim()}. Sent back to processor for review.`,
    }],
  });
};

/**
 * Reject gatherer's flag rejection by Processor
 * When processor disagrees with gatherer's rejection and wants to restore the flag
 */
const rejectGathererFlagRejection = async (questionId, rejectionReason, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.flagRejectionReason || question.flagRejectionReason.trim() === '') {
    throw new Error('Question does not have a gatherer flag rejection');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is required');
  }

  // Get original flag information from history
  // Find the most recent flag action before gatherer's rejection
  const flagHistoryEntry = question.history && Array.isArray(question.history) 
    ? question.history.find(h => h.action === 'flagged' && (h.role === 'creator' || h.role === 'explainer'))
    : null;

  // Get the original flagger from history or use flagType to determine
  const originalFlagType = question.flagType || (flagHistoryEntry?.role === 'explainer' ? 'explainer' : 'creator');
  
  // Try to get original flag reason from history notes
  let originalFlagReason = null;
  if (flagHistoryEntry && flagHistoryEntry.notes) {
    // Extract flag reason from notes (format: "Question flagged by creator: <reason>")
    const match = flagHistoryEntry.notes.match(/flagged by (?:creator|explainer):\s*(.+)/i);
    if (match && match[1]) {
      originalFlagReason = match[1].trim();
    }
  }

  // Get original flaggedBy from history
  const originalFlaggedBy = flagHistoryEntry?.performedById || question.history?.find(h => h.action === 'flag_approved')?.performedById;

  // Restore the flag and send back to gatherer
  return await Question.update(questionId, {
    isFlagged: true,
    flagStatus: 'approved', // Flag is approved again
    flagType: originalFlagType,
    flagReason: originalFlagReason || 'Flag restored by processor', // Restore original reason or use default
    flaggedById: originalFlaggedBy || question.history?.find(h => h.action === 'flagged')?.performedById,
    flagRejectionReason: null, // Clear gatherer's rejection reason
    flagReviewedBy: userId, // Processor reviewed the rejection
    status: 'pending_gatherer', // Send back to gatherer
    history: [{
      action: 'gatherer_flag_rejection_rejected',
      performedBy: userId,
      role: 'processor',
      timestamp: new Date(),
      notes: `Processor rejected gatherer's flag rejection. Reason: ${rejectionReason.trim()}. Flag restored and sent back to gatherer.`,
    }],
  });
};

/**
 * Get completed explanations by explainer ID
 * Returns all questions where the explainer has added an explanation, regardless of status
 */
const getCompletedExplanationsByExplainer = async (explainerId) => {
  const { prisma } = require('../../../config/db/prisma');

  // First, get all question IDs where this explainer has added explanation (from history)
  // This includes all actions where explainer worked on the question
  const explainerHistoryEntries = await prisma.questionHistory.findMany({
    where: {
      performedById: explainerId,
      role: 'explainer',
      action: {
        in: ['updated', 'submitted', 'created']
      }
    },
    select: {
      questionId: true
    }
  });

  const questionIdsFromHistory = explainerHistoryEntries.length > 0 
    ? [...new Set(explainerHistoryEntries.map(h => h.questionId))]
    : [];

  console.log(`[getCompletedExplanationsByExplainer] Found ${questionIdsFromHistory.length} question IDs from history for explainer ${explainerId}`);

  // Build where clause - get ALL questions where:
  // 1. Explanation is not empty
  // 2. AND (question ID is in explainer history OR lastModifiedById is explainer)
  // NO STATUS FILTERING - include all statuses (completed, pending_processor, rejected, etc.)
  const whereClause = {
    explanation: {
      not: '',
    },
    OR: []
  };

  // Add question IDs from history
  if (questionIdsFromHistory.length > 0) {
    whereClause.OR.push({
      id: {
        in: questionIdsFromHistory
      }
    });
  }

  // Also check lastModifiedBy
  whereClause.OR.push({
    lastModifiedById: explainerId
  });

  // If no OR conditions, remove OR clause and just check lastModifiedBy
  if (whereClause.OR.length === 0) {
    delete whereClause.OR;
    whereClause.lastModifiedById = explainerId;
  }

  console.log(`[getCompletedExplanationsByExplainer] Query where clause:`, JSON.stringify(whereClause, null, 2));

  // Get questions where explanation is not empty and explainer worked on them
  // NO STATUS FILTER - get all questions regardless of status
  const questions = await Question.findMany({
    where: whereClause,
    include: {
      exam: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      topic: { select: { id: true, name: true } },
      assignedProcessor: { select: { id: true, name: true, fullName: true, email: true } },
      approvedBy: { select: { id: true, name: true, fullName: true, email: true } },
      lastModifiedBy: { select: { id: true, name: true, fullName: true, email: true } },
      history: {
        where: {
          performedById: explainerId,
          role: 'explainer'
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 5
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  console.log(`[getCompletedExplanationsByExplainer] Found ${questions.length} questions with explanations`);

  // Filter to only include questions where this explainer actually added the explanation
  // Check if explainer is in history or if lastModifiedBy is the explainer
  const filteredQuestions = questions.filter(question => {
    // Must have explanation
    const hasExplanation = question.explanation && question.explanation.trim() !== '';
    
    if (!hasExplanation) {
      return false;
    }
    
    // Check if explainer is in history
    const hasExplainerHistory = question.history && Array.isArray(question.history) && question.history.length > 0;
    
    // Check if lastModifiedBy is the explainer
    const isLastModifiedByExplainer = question.lastModifiedById === explainerId;
    
    const shouldInclude = hasExplainerHistory || isLastModifiedByExplainer;
    
    if (shouldInclude) {
      console.log(`[getCompletedExplanationsByExplainer] Including question ${question.id} with status ${question.status}`);
    }
    
    return shouldInclude;
  });

  console.log(`[getCompletedExplanationsByExplainer] Returning ${filteredQuestions.length} questions out of ${questions.length} total`);
  console.log(`[getCompletedExplanationsByExplainer] Status breakdown:`, 
    filteredQuestions.reduce((acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    }, {})
  );
  
  return filteredQuestions;
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
  updateFlaggedQuestionByGatherer,
  rejectFlagByGatherer,
  updateFlaggedVariantByCreator,
  rejectFlagByCreator,
  flagQuestionByCreator,
  reviewCreatorFlag,
  flagQuestionByExplainer,
  reviewExplainerFlag,
  handleGathererUpdateAfterFlag,
  handleGathererUpdateAfterExplainerFlag,
  handleCreatorUpdateVariantAfterFlag,
  approveUpdatedFlaggedQuestion,
  getCompletedExplanationsByExplainer,
  getQuestionsByStatusAndRole,
  rejectGathererFlagRejection,
};

