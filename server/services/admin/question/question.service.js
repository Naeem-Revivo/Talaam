const Question = require('../../../models/question');
const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');
const Classification = require('../../../models/classification');

/**
 * Create question by Gatherer or Admin
 */
const createQuestion = async (questionData, userId, userRole = 'gatherer') => {
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

  // Determine role for history - use 'admin' for both admin and superadmin
  const historyRole = (userRole === 'admin' || userRole === 'superadmin') ? 'admin' : 'gatherer';
  const historyNotes = historyRole === 'admin' 
    ? 'Question created by admin' 
    : 'Question created by gatherer';

  // Create question
  const question = await Question.create({
    ...questionData,
    createdBy: userId,
    status: 'pending_processor',
    history: [
      {
        action: 'created',
        performedBy: userId,
        role: historyRole,
        timestamp: new Date(),
        notes: historyNotes,
      },
    ],
  });

  // Return the question with populated relations (already included by Prisma)
  return await Question.findById(question.id);
};

/**
 * Create question with completed status (for superadmin when assigned to me)
 * Also creates variants if provided
 */
const createQuestionWithCompletedStatus = async (questionData, userId, variants = []) => {
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

  // Determine role for history - use 'admin' for both admin and superadmin
  const historyRole = 'admin';
  const historyNotes = 'Question created by superadmin with completed status';

  // When "Assigned to me" is selected, assign the question to the current user (superadmin)
  // This allows the superadmin to act as the processor
  const assignedProcessorId = userId;

  // Create question with completed status
  const question = await Question.create({
    exam: questionData.exam,
    subject: questionData.subject,
    topic: questionData.topic,
    questionText: questionData.questionText.trim(),
    questionType: questionData.questionType,
    options: questionData.options,
    correctAnswer: questionData.correctAnswer,
    explanation: questionData.explanation?.trim() || '',
    createdBy: userId,
    assignedProcessor: assignedProcessorId, // Assign to current user (superadmin)
    status: 'completed', // Direct completed status
    history: [
      {
        action: 'created',
        performedBy: userId,
        role: historyRole,
        timestamp: new Date(),
        notes: historyNotes,
      },
      {
        action: 'approved',
        performedBy: userId,
        role: historyRole,
        timestamp: new Date(),
        notes: 'Question approved and marked as completed by superadmin',
      },
    ],
  });

  // Create variants if provided
  if (variants && variants.length > 0) {
    for (const variantData of variants) {
      // Validate variant has required fields
      if (!variantData.questionText || !variantData.questionText.trim()) {
        throw new Error('Variant question text is required');
      }
      if (!variantData.questionType) {
        throw new Error('Variant question type is required');
      }
      if (!variantData.correctAnswer) {
        throw new Error('Variant correct answer is required');
      }

      // Create variant question with completed status
      const variantQuestion = await Question.create({
        exam: questionData.exam,
        subject: questionData.subject,
        topic: questionData.topic,
        questionText: variantData.questionText.trim(),
        questionType: variantData.questionType,
        options: variantData.options,
        correctAnswer: variantData.correctAnswer,
        explanation: variantData.explanation?.trim() || '',
        originalQuestionId: question.id, // Use originalQuestionId instead of originalQuestion
        isVariant: true,
        createdBy: userId,
        assignedProcessor: assignedProcessorId, // Assign to current user (superadmin)
        status: 'completed', // Direct completed status
        history: [
          {
            action: 'variant_created',
            performedBy: userId,
            role: historyRole,
            timestamp: new Date(),
            notes: `Variant question created from question ${question.id} with completed status`,
          },
          {
            action: 'approved',
            performedBy: userId,
            role: historyRole,
            timestamp: new Date(),
            notes: 'Variant approved and marked as completed by superadmin',
          },
        ],
      });

      // Add history entry to original question
      await Question.addHistory(question.id, {
        action: 'variant_created',
        performedById: userId,
        role: historyRole,
        timestamp: new Date(),
        notes: `Variant question ${variantQuestion.id} created from this question with completed status`,
      });
    }
  }

  // Return the question with populated relations
  return await Question.findById(question.id);
};

/**
 * Get questions by status and role
 */
const getQuestionsByStatus = async (status, userId, role, flagType = null) => {
  const where = { status };

  // Gatherer can only see their own questions
  if (role === 'gatherer') {
    where.createdById = userId;
  }
  
  // Processor can only see questions assigned to them
  if (role === 'processor') {
    where.assignedProcessorId = userId;
  }
  
  // Creator can only see questions assigned to them
  if (role === 'creator') {
    where.assignedCreatorId = userId;
    
    // CRITICAL: Exclude gatherer-updated questions after flags from creator's view
    // These questions have flagType but isFlagged=false and status=pending_processor
    // They should only appear after processor approves them
    // Exclude: questions with flagType (creator/student) that are NOT flagged and in pending_processor
    // This means gatherer updated them and they're waiting for processor approval
    // BUT: Include questions where creator has performed operations (created variants, last modified, etc.)
    if (status === 'pending_processor') {
      // Use OR to include questions where creator performed operations
      // This ensures questions where creator created variants or last modified are NOT excluded
      where.OR = [
        // Always include if creator last modified this question (creator performed operation)
        {
          lastModifiedById: userId
        },
        // Always include if creator created variants for this question
        {
          variants: {
            some: {
              createdById: userId,
              isVariant: true
            }
          }
        },
        // Include questions that don't match the exclusion criteria (not gatherer-updated)
        {
          NOT: {
            AND: [
              {
                flagType: {
                  in: ['creator', 'student']
                }
              },
              {
                isFlagged: false
              },
              {
                lastModifiedById: {
                  not: userId
                }
              },
              {
                variants: {
                  none: {
                    createdById: userId,
                    isVariant: true
                  }
                }
              }
            ]
          }
        }
      ];
    }
  }
  
  // Explainer can only see questions assigned to them
  if (role === 'explainer') {
    where.assignedExplainerId = userId;
  }

  // Handle flagType parameter
  // If flagType='student' is specified, only fetch student-flagged questions
  // Otherwise, exclude student-flagged questions that are NOT accepted/approved
  // Student-flagged questions should only appear in other pages after flag is accepted
  if (flagType === 'student') {
    where.flagType = 'student';
  } else {
    // Exclude questions with flagType='student' that are NOT approved
    // Only show student-flagged questions in other pages if flagStatus='approved'
    // Include: questions with no flagType (null), questions with flagType != 'student', 
    // and student-flagged questions that are approved
    where.OR = [
      {
        flagType: null // Questions with no flag
      },
      {
        flagType: {
          not: 'student' // Questions flagged by creator, explainer, etc.
        }
      },
      {
        AND: [
          { flagType: 'student' },
          { flagStatus: 'approved' }
        ]
      }
    ];
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
      flaggedBy: { select: { name: true, fullName: true, email: true } }
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
 * @param {string} status - Question status
 * @param {string} submittedByRole - Role that submitted the question (gatherer, creator, explainer)
 * @param {string} processorId - ID of the processor (to filter by assignedProcessorId)
 */
const getQuestionsByStatusAndRole = async (status, submittedByRole, processorId = null, flagType = null) => {
  const { prisma } = require('../../../config/db/prisma');
  
  // Build where clause with status and role filtering
  const where = {
    status: status
  };
  
  // CRITICAL: Filter by assignedProcessorId if processorId is provided
  // This ensures processors only see questions assigned to them
  if (processorId) {
    where.assignedProcessorId = processorId;
  }
  
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
    // IMPORTANT: Exclude questions created by superadmin
    if (submittedByRole === 'gatherer' && userIdsWithRole.length > 0) {
      // Get superadmin user IDs to exclude them (check both role and adminRole)
      const superadminUsers = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'superadmin' },
            { adminRole: 'superadmin' }
          ],
          status: 'active'
        },
        select: { id: true }
      });
      
      const superadminUserIds = superadminUsers.map(u => u.id);
      
      // Add condition to include gatherer-created questions, but exclude superadmin-created ones
      if (superadminUserIds.length > 0) {
        roleConditions.push({
          AND: [
            {
              createdById: {
                in: userIdsWithRole
              }
            },
            {
              createdById: {
                notIn: superadminUserIds
              }
            }
          ]
        });
      } else {
        roleConditions.push({
          createdById: {
            in: userIdsWithRole
          }
        });
      }
      
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
    
    // For admin: check createdBy (ONLY superadmin creates questions for admin submission page)
    // Include ONLY questions created by superadmin (not regular admin)
    if (submittedByRole === 'admin') {
      // Get ONLY superadmin users (check both role and adminRole)
      const superadminUsers = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'superadmin' },
            { adminRole: 'superadmin' }
          ],
          status: 'active'
        },
        select: { id: true }
      });
      
      if (superadminUsers.length > 0) {
        const superadminUserIds = superadminUsers.map(u => u.id);
        roleConditions.push({
          createdById: {
            in: superadminUserIds
          }
        });
      }
      
      // Also check history for admin role (only if created by superadmin)
      // Note: When superadmin creates, history role is 'admin', but we verify via createdById
      const adminHistoryEntries = await prisma.questionHistory.findMany({
        where: {
          role: 'admin',
          action: {
            in: ['created', 'updated', 'submitted']
          }
        },
        select: {
          questionId: true,
          performedById: true
        }
      });

      // Filter history entries to only include those performed by superadmin users
      if (superadminUsers.length > 0 && adminHistoryEntries.length > 0) {
        const superadminUserIds = superadminUsers.map(u => u.id);
        const superadminQuestionIdsFromHistory = adminHistoryEntries
          .filter(h => superadminUserIds.includes(h.performedById))
          .map(h => h.questionId);
        
        const uniqueSuperadminQuestionIds = [...new Set(superadminQuestionIdsFromHistory)];

        if (uniqueSuperadminQuestionIds.length > 0) {
          roleConditions.push({
            id: {
              in: uniqueSuperadminQuestionIds
            }
          });
        }
      }
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
      
      // CRITICAL: Include questions in pending_processor that were submitted by creator
      // These are questions where creator approved/created variants and sent back to processor
      // They have: status=pending_processor, approvedBy (from processor), lastModifiedBy=creator
      roleConditions.push({
        AND: [
          {
            status: 'pending_processor'
          },
          {
            approvedById: {
              not: null
            }
          },
          {
            lastModifiedById: {
              in: userIdsWithRole
            }
          }
        ]
      });
      
      // Include variant questions created by creator (they have isVariant=true and createdBy=creator)
      roleConditions.push({
        AND: [
          {
            isVariant: true
          },
          {
            createdById: {
              in: userIdsWithRole
            }
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
      
      // For creator: exclude questions flagged by creator until they're resolved and come back
      if (submittedByRole === 'creator') {
        where.AND.push({
          NOT: {
            AND: [
              { isFlagged: true },
              { flagType: 'creator' }
            ]
          }
        });
      }
    } else {
      // If no role conditions found, return empty result
      return [];
    }
  }

  // Handle flagType parameter
  // If flagType='student' is specified, only fetch student-flagged questions
  // Otherwise, exclude student-flagged questions that are NOT accepted/approved
  // Student-flagged questions should only appear in other pages after flag is accepted
  if (!where.AND) {
    where.AND = [];
  }
  
  // Note: We don't exclude gatherer-updated questions here because this function is used by processor
  // Processor needs to see ALL creator-submitted questions (including gatherer-updated ones) for review
  // The exclusion for creator's own view is handled in getQuestionsByStatus function
  
  if (flagType === 'student') {
    // Only fetch student-flagged questions that are approved by admin
    // Admin submission page should only show approved student flags
    where.AND.push({
      AND: [
        { flagType: 'student' },
        { flagStatus: 'approved' }
      ]
    });
  } else {
    // Exclude questions with flagType='student' that are NOT approved
    // Only show student-flagged questions in other pages if flagStatus='approved'
    where.AND.push({
      OR: [
        { flagType: { not: 'student' } },
        { flagType: null },
        {
          AND: [
            { flagType: 'student' },
            { flagStatus: 'approved' }
          ]
        }
      ]
    });
  }

  const questions = await Question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      exam: { select: { name: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      lastModifiedBy: { select: { name: true, email: true } },
      assignedProcessor: { select: { name: true, fullName: true, email: true } },
      assignedCreator: { select: { name: true, fullName: true, email: true } },
      assignedExplainer: { select: { name: true, fullName: true, email: true } },
      approvedBy: { select: { name: true, fullName: true, email: true } },
      flaggedBy: { select: { name: true, fullName: true, email: true } },
      history: {
        include: {
          performedBy: { select: { id: true, adminRole: true } }
        },
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  // Populate role and adminRole for createdBy by fetching from user table
  // Since these fields are not included in the select, we need to fetch them separately
  const createdByIds = [];
  
  // Collect all createdByIds from questions - check multiple possible locations
  questions.forEach(q => {
    // Priority: createdById (direct field) > createdBy.id (relation) > createdBy (if string)
    if (q.createdById) {
      createdByIds.push(q.createdById);
    } else if (q.createdBy?.id) {
      createdByIds.push(q.createdBy.id);
    } else if (q.createdBy && typeof q.createdBy === 'string') {
      createdByIds.push(q.createdBy);
    }
  });
  
  if (createdByIds.length > 0) {
    const uniqueCreatedByIds = [...new Set(createdByIds.filter(id => id))];
    
    if (uniqueCreatedByIds.length > 0) {
      const users = await prisma.user.findMany({
        where: {
          id: { in: uniqueCreatedByIds }
        },
        select: {
          id: true,
          role: true,
          adminRole: true
        }
      });
      
      const userRoleMap = new Map(users.map(u => [u.id, { role: u.role, adminRole: u.adminRole }]));
      
      // Populate role and adminRole for each question's createdBy
      questions.forEach(question => {
        let createdById = null;
        
        // Try to get the ID from different possible locations (same priority as above)
        if (question.createdById) {
          createdById = question.createdById;
        } else if (question.createdBy?.id) {
          createdById = question.createdBy.id;
        } else if (question.createdBy && typeof question.createdBy === 'string') {
          createdById = question.createdBy;
        }
        
        if (createdById) {
          // Ensure createdBy object exists and is an object (not string)
          if (!question.createdBy || typeof question.createdBy === 'string') {
            question.createdBy = { id: createdById };
          }
          
          // Populate role and adminRole from the map
          const userData = userRoleMap.get(createdById);
          if (userData !== undefined) {
            question.createdBy.role = userData.role;
            question.createdBy.adminRole = userData.adminRole;
          } else {
            // If not found in map, set to null
            question.createdBy.role = null;
            question.createdBy.adminRole = null;
          }
        } else if (question.createdBy && typeof question.createdBy === 'object') {
          // If createdBy exists but we couldn't find the ID, ensure role and adminRole are set
          if (!question.createdBy.hasOwnProperty('role')) {
            question.createdBy.role = null;
          }
          if (!question.createdBy.hasOwnProperty('adminRole')) {
            question.createdBy.adminRole = null;
          }
        }
      });
    }
  } else {
    // If no createdByIds found, ensure all createdBy objects have role and adminRole set to null
    questions.forEach(question => {
      if (question.createdBy && typeof question.createdBy === 'object') {
        if (!question.createdBy.hasOwnProperty('role')) {
          question.createdBy.role = null;
        }
        if (!question.createdBy.hasOwnProperty('adminRole')) {
          question.createdBy.adminRole = null;
        }
      }
    });
  }

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
    // IMPORTANT: Exclude questions created by superadmin
    // Note: We don't exclude creator-submitted questions here - they can appear in gatherer submission
    // The button logic in ProcessorViewQuestion will handle showing correct options
    if (submittedByRole === 'gatherer') {
      // Check if question was created by superadmin - check both role and adminRole
      const isSuperadminCreated = question.createdBy?.role === 'superadmin' || 
                                  question.createdBy?.adminRole === 'superadmin' ||
                                  (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
      
      // Exclude superadmin-created questions
      if (isSuperadminCreated) {
        return false;
      }
      
      const createdByGatherer = question.createdById && userIdsWithRole && userIdsWithRole.includes(question.createdById);
      const createdByRole = question.createdBy?.adminRole === 'gatherer' || 
                           (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'gatherer');
      return hasRoleHistory || hasRoleApproval || isFlaggedByRole || createdByGatherer || createdByRole;
    }
    
    // For admin: check createdBy (ONLY superadmin creates questions for admin submission page)
    // Check both role and adminRole fields, but ONLY for superadmin
    if (submittedByRole === 'admin') {
      // Check if created by superadmin ONLY - check both role and adminRole
      const createdBySuperadmin = question.createdBy?.role === 'superadmin' ||
                                  question.createdBy?.adminRole === 'superadmin' ||
                                  (question.history?.find(h => h.action === 'created')?.performedBy?.role === 'superadmin') ||
                                  (question.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
      // Check history role for 'admin' but verify it was created by superadmin via createdById
      const historyRoleIsAdmin = question.history?.some(h => h.role === 'admin' && h.action === 'created');
      // Only return true if created by superadmin (not regular admin)
      return createdBySuperadmin || (historyRoleIsAdmin && createdBySuperadmin);
    }

    // For creator: check if question went through creator workflow
    if (submittedByRole === 'creator') {
      // Check if creator modified it (lastModifiedBy is creator)
      const lastModifiedByCreator = question.lastModifiedById && userIdsWithRole && userIdsWithRole.includes(question.lastModifiedById);
      
      // Check if it's a variant created by creator
      const isVariant = question.isVariant === true || question.isVariant === 'true';
      const isVariantByCreator = isVariant && question.createdById && userIdsWithRole && userIdsWithRole.includes(question.createdById);
      
      // Check if question has variants created by creator
      const hasVariants = question.variants && Array.isArray(question.variants) && question.variants.length > 0;
      const hasCreatorVariants = hasVariants && question.history && Array.isArray(question.history) &&
        question.history.some(h => h.role === 'creator' && h.action === 'variant_created');
      
      // Check if creator submitted question back to processor (pending_processor with approvedBy and lastModifiedBy=creator)
      const isCreatorSubmitted = question.status === 'pending_processor' && 
        question.approvedById && 
        lastModifiedByCreator;
      
      // Check if went through creator workflow (approved by processor and sent to creator, then to explainer/completed)
      const wentThroughCreatorWorkflow = question.approvedBy !== null || 
                                        question.status === 'pending_explainer' ||
                                        question.status === 'completed';
      
      return hasRoleHistory || hasRoleApproval || isFlaggedByRole || lastModifiedByCreator || 
             isVariantByCreator || hasCreatorVariants || isCreatorSubmitted || wentThroughCreatorWorkflow;
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
    status: 'pending_processor', // Variant approved by creator, now pending processor review
    history: [
      {
        action: 'variant_created',
        performedBy: userId,
        role: 'creator',
        timestamp: new Date(),
        notes: `Variant created from question ${originalQuestionId}`,
      },
      {
        action: 'approved',
        performedBy: userId,
        role: 'creator',
        timestamp: new Date(),
        notes: 'Variant approved by creator',
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
  // SuperAdmin can access all questions - bypass access checks
  if (role !== 'superadmin') {
  // Gatherer can only access their own questions
  if (role === 'gatherer' && question.createdById !== userId) {
    throw new Error('Access denied');
  }
  
  // Processor can only see questions assigned to them
  if (role === 'processor') {
    if (question.assignedProcessorId && question.assignedProcessorId !== userId) {
      throw new Error('Access denied. This question is not assigned to you.');
    }
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
  }

  // Populate role and adminRole for createdBy by fetching from user table
  if (question.createdBy) {
    const { prisma } = require('../../../config/db/prisma');
    const createdById = question.createdBy?.id || question.createdById;
    
    if (createdById) {
      const user = await prisma.user.findUnique({
        where: { id: createdById },
        select: {
          id: true,
          role: true,
          adminRole: true
        }
      });
      
      if (user) {
        // Ensure createdBy is an object
        if (!question.createdBy || typeof question.createdBy === 'string') {
          question.createdBy = { id: createdById };
        }
        question.createdBy.role = user.role;
        question.createdBy.adminRole = user.adminRole;
      } else {
        // If user not found, ensure role fields are set to null
        if (!question.createdBy || typeof question.createdBy === 'string') {
          question.createdBy = { id: createdById };
        }
        question.createdBy.role = null;
        question.createdBy.adminRole = null;
      }
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
      flagStatus: q.flagStatus || null,
      flagReason: q.flagReason || null,
      flagType: q.flagType || null,
      rejectionReason: q.rejectionReason || null,
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

  // Add history entry separately to ensure it's appended
  await Question.addHistory(questionId, {
    action: 'updated',
    performedById: userId,
    role: 'explainer',
    timestamp: new Date(),
    notes: 'Explanation added/updated by explainer',
  });

  return updatedQuestion;
};

/**
 * Save draft explanation by Explainer (keeps status as pending_explainer)
 * @param {string} questionId - Question ID
 * @param {string} explanation - Draft explanation text
 * @param {string} userId - Explainer user ID
 */
const saveDraftExplanationByExplainer = async (questionId, explanation, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_explainer') {
    throw new Error('Question is not in pending_explainer status');
  }

  // Save explanation but keep status as pending_explainer (draft)
  const updatedQuestion = await Question.update(questionId, {
    explanation: explanation ? explanation.trim() : '',
    lastModifiedBy: userId,
    // Keep status as pending_explainer for drafts
  });

  // Add history entry separately to ensure it's appended
  await Question.addHistory(questionId, {
    action: 'updated',
    performedById: userId,
    role: 'explainer',
    timestamp: new Date(),
    notes: 'Draft explanation saved by explainer',
  });

  // Fetch the updated question to return
  return await Question.findById(questionId);
};

/**
 * Approve question by Processor
 * @param {string} questionId - Question ID
 * @param {string} userId - Processor user ID
 * @param {string} assignedUserId - Optional: Creator or Explainer user ID to assign
 * @param {string} role - Optional: User role (for superAdmin bypass)
 */
const approveQuestion = async (questionId, userId, assignedUserId = null, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // The question must be assigned to this processor throughout the workflow
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
  }

  // Determine next status based on current workflow
  let nextStatus;
  // History is ordered by timestamp desc, so the most recent entry is at index 0
  const lastAction = question.history && question.history.length > 0 
    ? question.history[0] 
    : null;
  
  // Check if question was updated after a flag was approved
  // This can happen in two scenarios:
  // 1. Flag is still active (isFlagged && flagStatus === 'approved')
  // 2. Flag was cleared by gatherer/creator/explainer update but flagType still exists
  //    (This happens when gatherer updates after flag approval - flag is cleared but flagType preserved)
  const hasActiveFlag = question.isFlagged && question.flagStatus === 'approved';
  const hasRecentUpdate = question.history.some(h => 
    (h.role === 'gatherer' || h.role === 'creator' || h.role === 'explainer') && 
    (h.action === 'updated' || h.action === 'update')
  );
  // Detect gatherer update after flag: flagType exists, flag is cleared, and last action is gatherer update
  // This is CRITICAL for the workflow: gatherer updates after flag should go to processor first, then creator
  // Check both lastAction and history array to be more robust
  const hasGathererUpdate = question.history && question.history.some(h => 
    h.role === 'gatherer' && (h.action === 'updated' || h.action === 'update')
  );
  const isGathererUpdateAfterFlag = question.flagType && 
    !question.isFlagged && 
    hasGathererUpdate &&
    lastAction && 
    lastAction.role === 'gatherer' && 
    (lastAction.action === 'updated' || lastAction.action === 'update');
  
  const wasUpdatedAfterFlag = (hasActiveFlag && hasRecentUpdate) || isGathererUpdateAfterFlag;
  
  // Debug logging for gatherer update detection
  if (question.flagType && !question.isFlagged) {
    console.log('[APPROVE QUESTION] Checking for gatherer update after flag', {
      questionId,
      flagType: question.flagType,
      isFlagged: question.isFlagged,
      hasGathererUpdate,
      lastAction: lastAction ? {
        role: lastAction.role,
        action: lastAction.action,
        timestamp: lastAction.timestamp
      } : null,
      isGathererUpdateAfterFlag,
      wasUpdatedAfterFlag,
      historyLength: question.history?.length || 0
    });
  }
  
  // PRIORITY 0 (HIGHEST): Check if question has explanation - this is the FINAL STEP
  // If explainer added explanation, question must be marked as completed when processor approves
  // This check must come FIRST to ensure completion takes priority over all other routing logic
  const hasExplanation = question.explanation && question.explanation.trim() !== '';
  
  if (hasExplanation) {
    // Question has explanation - this is the final step, mark as completed
    nextStatus = 'completed';
  }
  // PRIORITY 1: If question was updated after flag approval, route based on who flagged it
  // This ensures explainer-flagged questions go back to explainer, not creator
  // Student-flagged questions follow the same flow as creator-flagged questions after gatherer updates
  // BUT: Skip this if question has explanation (handled by PRIORITY 0)
  else if (wasUpdatedAfterFlag && question.flagType) {
    if (question.flagType === 'student' || question.flagType === 'creator') {
      // Student or creator flagged - after gatherer updates, send to creator
      // Student flags follow the same flow as creator flags after gatherer updates
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
    if (question.flagType === 'student') {
      // Student flagged - route based on whether it's a variant or original question
      if (question.isVariant || question.originalQuestionId) {
        // Variant: send to creator
        nextStatus = 'pending_creator';
      } else {
        // Original question: send to gatherer
        nextStatus = 'pending_gatherer';
      }
    } else if (question.flagType === 'creator') {
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
  // BUT: Exclude gatherer updates after flags (those are handled by PRIORITY 1)
  // This only handles cases where flag was cleared without an update
  else if (question.flagType && !question.isFlagged && !isGathererUpdateAfterFlag) {
    // Question had a flag that was resolved, route based on original flagType
    // This should not catch gatherer updates - those are handled by PRIORITY 1
    if (question.flagType === 'student') {
      // Student flagged - route based on whether it's a variant or original question
      if (question.isVariant || question.originalQuestionId) {
        // Variant: send to creator
        nextStatus = 'pending_creator';
      } else {
        // Original question: send to gatherer
        nextStatus = 'pending_gatherer';
      }
    } else if (question.flagType === 'explainer') {
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
  // BUT: Exclude gatherer updates after flags (those are handled by PRIORITY 1)
  // BUT: Check flagType first to ensure explainer-flagged questions don't go to creator
  // Student-flagged questions follow the same flow as creator-flagged questions
  else if (lastAction && lastAction.role === 'gatherer' && !isGathererUpdateAfterFlag) {
    // After gatherer submission/update (but NOT after flag updates - those go to PRIORITY 1)
    // CRITICAL: If question was flagged by explainer, route to explainer, not creator
    // Student flags follow creator flow (go to creator)
    if (question.flagType === 'explainer') {
      nextStatus = 'pending_explainer';
    } else {
      // Normal flow: move to creator (applies to creator, student, and unflagged questions)
      nextStatus = 'pending_creator';
    }
  } 
  // PRIORITY 6: Normal workflow based on last action role (only if no explanation exists)
  // Note: Explanation check is now PRIORITY 0 (highest) - handled above
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

  // Validate and assign creator/explainer/gatherer if provided
  // Only assign if not already assigned (assignment happens only once)
  // Skip validation if nextStatus is 'completed' (no assignment needed)
  if (assignedUserId && nextStatus !== 'completed') {
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
        // If assigned user is not a creator, ignore the assignment rather than throwing error
        // This handles cases where frontend might pass wrong user ID
        console.warn(`Assigned user ${assignedUserId} is not a creator (role: ${assignedUser.adminRole}), ignoring assignment for nextStatus: ${nextStatus}`);
        assignedUserId = null;
      } else {
        // Only assign if not already assigned
        if (!question.assignedCreatorId) {
          // Will be set in updateData below
        } else {
          // Already assigned, don't change it
          assignedUserId = null;
        }
      }
    } else if (nextStatus === 'pending_explainer') {
      if (assignedUser.adminRole !== 'explainer') {
        // If assigned user is not an explainer, ignore the assignment rather than throwing error
        // This handles cases where frontend might pass wrong user ID
        console.warn(`Assigned user ${assignedUserId} is not an explainer (role: ${assignedUser.adminRole}), ignoring assignment for nextStatus: ${nextStatus}`);
        assignedUserId = null;
      } else {
        // Only assign if not already assigned
        if (!question.assignedExplainerId) {
          // Will be set in updateData below
        } else {
          // Already assigned, don't change it
          assignedUserId = null;
        }
      }
    } else if (nextStatus === 'pending_gatherer') {
      // Note: Gatherer assignment is typically not done here as gatherers work on all questions
      // But if needed, we can add gatherer assignment logic here
      assignedUserId = null; // Don't assign gatherer for now
    }
  } else if (assignedUserId && nextStatus === 'completed') {
    // If nextStatus is completed, ignore assignedUserId (no assignment needed)
    assignedUserId = null;
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
      
      // Also update all variants to have the same assignedExplainerId
      // This ensures variants are visible to the explainer
      try {
        // Check if the question being approved is a variant
        const isVariant = question.isVariant === true || question.isVariant === 'true' || question.isVariant === 1;
        const originalQuestionId = question.originalQuestionId || question.originalQuestion?.id || question.originalQuestion;
        
        // If this is a variant, find all variants of the same original question (including this variant)
        // If this is the original question, find all its variants
        const targetQuestionId = isVariant && originalQuestionId ? originalQuestionId : questionId;
        
        const variants = await Question.findMany({
          where: {
            originalQuestionId: targetQuestionId,
            isVariant: true
          }
        });
        
        // Update each variant with the same assignedExplainerId
        // This includes the variant being approved (if it's a variant) and all sibling variants
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
    const flagType = question.flagType || 'unknown'; // 'student', 'creator', or 'explainer'
    const wasRejectedByGatherer = question.flagRejectionReason && !question.isFlagged;
    
    updateData.isFlagged = false;
    updateData.flagStatus = null;
    updateData.flaggedBy = null;
    updateData.flagReason = null;
    updateData.flagReviewedBy = null;
    updateData.flagRejectionReason = null; // Clear gatherer's rejection reason when processor approves
  }

  // Update question
  const updatedQuestion = await Question.update(questionId, updateData);

  // Add history entry separately with detailed notes
  let historyNote;
  if (question.isFlagged || question.flagRejectionReason) {
    const flagType = question.flagType || 'unknown';
    const wasRejectedByGatherer = question.flagRejectionReason && !question.isFlagged;
    
    if (wasRejectedByGatherer) {
      historyNote = `Question approved after gatherer rejected the flag. Gatherer's reason was accepted. Moved to ${nextStatus}. All flag data cleared.`;
    } else if (wasUpdatedAfterFlag) {
      if (flagType === 'student') {
        const questionType = (question.isVariant || question.originalQuestionId) ? 'variant' : 'question';
        historyNote = `Question approved after student flag correction (${questionType}), moved to ${nextStatus}. Flag removed.`;
      } else {
        historyNote = `Question approved after ${flagType} flag correction, moved to ${nextStatus}. Flag removed.`;
      }
    } else {
      if (flagType === 'student') {
        const questionType = (question.isVariant || question.originalQuestionId) ? 'variant' : 'question';
        historyNote = `Question approved with student flag (${questionType}), moved to ${nextStatus}. Flag removed.`;
      } else {
        historyNote = `Question approved with ${flagType} flag, moved to ${nextStatus}. Flag removed.`;
      }
    }
  } else {
    historyNote = `Question approved, moved to ${nextStatus}`;
  }
  
  await Question.addHistory(questionId, {
    action: 'approved',
    performedById: userId,
    role: 'processor',
    timestamp: new Date(),
    notes: historyNote,
  });

  return updatedQuestion;
};

/**
 * Reject question by Processor
 * @param {string} questionId - Question ID
 * @param {string} rejectionReason - Rejection reason
 * @param {string} userId - Processor user ID
 * @param {string} role - Optional: User role (for superAdmin bypass)
 */
const rejectQuestion = async (questionId, rejectionReason, userId, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_processor') {
    throw new Error('Question is not in pending_processor status');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // The question must be assigned to this processor throughout the workflow
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
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

  // Exclude student-flagged questions that are not approved
  // Only show student-flagged questions if flagStatus is 'approved'
  // This ensures student-flagged questions don't appear until admin approves them
  const studentFlagExclusion = {
    OR: [
      { flagType: null }, // Questions with no flag
      { flagType: { not: 'student' } }, // Questions flagged by creator, explainer, etc.
      {
        AND: [
          { flagType: 'student' },
          { flagStatus: 'approved' } // Only approved student flags
        ]
      }
    ]
  };

  if (searchTerm && searchTerm.trim()) {
    const searchConditions = [
      { questionText: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { explanation: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { status: { contains: searchTerm.trim(), mode: 'insensitive' } },
    ];
    
    // Combine existing conditions with search and student flag exclusion using AND
    const existingConditions = { ...where };
    delete existingConditions.OR;
    delete existingConditions.AND;
    
    const allConditions = [];
    if (Object.keys(existingConditions).length > 0) {
      allConditions.push(existingConditions);
    }
    allConditions.push({ OR: searchConditions });
    allConditions.push(studentFlagExclusion);
    
    where.AND = allConditions;
    
    // Remove individual conditions that are now in AND
    Object.keys(existingConditions).forEach(key => {
      if (key !== 'AND' && key !== 'OR') {
        delete where[key];
      }
    });
  } else {
    // No search term, just add student flag exclusion
    const existingConditions = { ...where };
    delete existingConditions.OR;
    delete existingConditions.AND;
    
    if (Object.keys(existingConditions).length > 0) {
      where.AND = [
        existingConditions,
        studentFlagExclusion
      ];
      // Remove individual conditions that are now in AND
      Object.keys(existingConditions).forEach(key => {
        if (key !== 'AND' && key !== 'OR') {
          delete where[key];
        }
      });
    } else {
      // No other conditions, just apply student flag exclusion
      Object.assign(where, studentFlagExclusion);
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
  const { prisma } = require('../../../config/db/prisma');
  const query = { status };

  // Gatherer can only see their own questions
  if (role === 'gatherer' && userId) {
    query.createdById = userId;
  }

  return await prisma.question.count({ where: query });
};

/**
 * Get all questions for superadmin with optional search and pagination
 */
const getAllQuestionsForSuperadmin = async (filters = {}, searchTerm = '', pagination = { page: 1, limit: 5 }) => {
  const { prisma } = require('../../../config/db/prisma');
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
  const totalItems = await prisma.question.count({
    where: query
  });

  // Get paginated questions with relations
  const questions = await prisma.question.findMany({
    where: query,
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: limit,
    include: {
      exam: true,
      subject: true,
      topic: true,
      createdBy: { select: { id: true, name: true, fullName: true, email: true } },
      lastModifiedBy: { select: { id: true, name: true, fullName: true, email: true } },
      flaggedBy: { select: { id: true, name: true, fullName: true, email: true } },
      history: {
        include: {
          performedBy: { select: { id: true, name: true, fullName: true, adminRole: true } }
        },
        orderBy: { timestamp: 'desc' },
        take: 1, // Get only the most recent history entry
      },
    },
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
  const { prisma } = require('../../../config/db/prisma');
  const baseFilters = applyFilters ? { ...filters } : {};
  const search = applyFilters ? searchTerm : '';

  // Remove tab from filters for count queries
  const countFilters = { ...baseFilters };
  delete countFilters.tab;

  const totalQuery = buildSearchQuery(countFilters, search);

  const approvedFilters = { ...countFilters, status: 'completed' };
  const approvedQuery = buildSearchQuery(approvedFilters, search);

  const pendingStatuses = ['pending_processor', 'pending_creator', 'pending_explainer'];
  const pendingFilters = { ...countFilters, status: { in: pendingStatuses } };
  const pendingQuery = buildSearchQuery(pendingFilters, search);

  const rejectedFilters = { ...countFilters, status: 'rejected' };
  const rejectedQuery = buildSearchQuery(rejectedFilters, search);

  const [total, approved, pending, rejected] = await Promise.all([
    prisma.question.count({ where: totalQuery }),
    prisma.question.count({ where: approvedQuery }),
    prisma.question.count({ where: pendingQuery }),
    prisma.question.count({ where: rejectedQuery }),
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
const reviewCreatorFlag = async (questionId, decision, rejectionReason, userId, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
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
 * Review Student's flag by Processor
 * When processor reviews a student flag, they can approve or reject it
 */
const reviewStudentFlag = async (questionId, decision, rejectionReason, userId, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
  }

  if (!question.isFlagged || question.flagType !== 'student') {
    throw new Error('Question is not flagged by student');
  }

  if (decision !== 'approve' && decision !== 'reject') {
    throw new Error('Decision must be either "approve" or "reject"');
  }

  if (decision === 'reject' && (!rejectionReason || !rejectionReason.trim())) {
    throw new Error('Rejection reason is required when rejecting a flag');
  }

  if (decision === 'approve') {
    // Processor approves the student flag
    // Determine where to send based on whether it's a variant or regular question
    let nextStatus;
    let notes;
    
    if (question.isVariant || question.originalQuestionId) {
      // Variant: send back to Creator for correction
      nextStatus = 'pending_creator';
      notes = `Student flag approved for variant. Reason: ${question.flagReason}. Sent back to creator for correction.`;
    } else {
      // Regular question: send back to Gatherer for correction
      nextStatus = 'pending_gatherer';
      notes = `Student flag approved. Reason: ${question.flagReason}. Sent back to gatherer for correction.`;
    }
    
    return await Question.update(questionId, {
      flagStatus: 'approved',
      flagReviewedById: userId,
      status: nextStatus,
      history: [{
        action: 'flag_approved',
        performedById: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: notes,
      }],
    });
  } else {
    // Processor rejects the student flag - mark as completed
    return await Question.update(questionId, {
      flagStatus: 'rejected',
      flagReviewedById: userId,
      flagRejectionReason: rejectionReason.trim(),
      isFlagged: false, // Remove flag
      flaggedById: null,
      flagReason: null,
      status: 'completed', // Mark as completed when flag is rejected
      history: [{
        action: 'flag_rejected',
        performedById: userId,
        role: 'processor',
        timestamp: new Date(),
        notes: `Student flag rejected by processor. Processor reason: ${rejectionReason.trim()}. Question marked as completed.`,
      }],
    });
  }
};

/**
 * Review Explainer's flag by Processor
 * Handles both regular questions (goes to Gatherer) and variants (goes to Creator)
 */
const reviewExplainerFlag = async (questionId, decision, rejectionReason, userId, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
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

  // Allow updating rejected questions (to resubmit) or flagged questions in pending_gatherer status
  const isRejected = question.status === 'rejected';
  const isFlaggedPendingGatherer = question.status === 'pending_gatherer' && 
                                    question.isFlagged && 
                                    question.flagStatus === 'approved';

  if (!isRejected && !isFlaggedPendingGatherer) {
    throw new Error('Question is not in a state that allows editing (must be rejected or flagged and pending gatherer action)');
  }

  // For flagged questions, validate flag type
  // Accept creator, explainer, and student flags (student flags should follow same flow as creator flags)
  if (isFlaggedPendingGatherer && question.flagType !== 'creator' && question.flagType !== 'explainer' && question.flagType !== 'student') {
    throw new Error('Question was not flagged by creator, explainer, or student and approved by processor');
  }

  // Build history note based on flag type
  let historyNote;
  if (question.flagType === 'student') {
    historyNote = 'Question updated by gatherer after student flag approval. Flag resolved and sent to processor for review.';
  } else if (question.flagType === 'explainer') {
    historyNote = 'Question updated by gatherer after explainer flag approval. Flag resolved and sent to processor for review.';
  } else {
    historyNote = 'Question updated by gatherer after creator flag approval. Flag resolved and sent to processor for review.';
  }

  // Build update data object for Prisma
  const prismaUpdateData = {
    lastModifiedBy: userId,
    status: 'pending_processor', // Send back to processor for review
    // Resolve the flag when gatherer updates the question
    // IMPORTANT: Keep flagType so processor knows who originally flagged it for proper routing
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    flagReason: null,
    flagReviewedBy: null,
    // flagType is preserved (not cleared) so processor can route correctly
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'gatherer',
      timestamp: new Date(),
      notes: historyNote,
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

  // CRITICAL: Ensure status is always set to pending_processor for gatherer updates after flag
  // This ensures the question goes to processor first, not directly to creator
  prismaUpdateData.status = 'pending_processor';

  const updatedQuestion = await Question.update(questionId, prismaUpdateData);
  
  // Verify the status was set correctly
  if (updatedQuestion.status !== 'pending_processor') {
    console.error('[ERROR] Question status was not set to pending_processor after gatherer update', {
      questionId,
      expectedStatus: 'pending_processor',
      actualStatus: updatedQuestion.status
    });
    // Force update the status if it wasn't set correctly
    await Question.update(questionId, { status: 'pending_processor' });
    updatedQuestion.status = 'pending_processor';
  }
  
  return updatedQuestion;
};

/**
 * Handle Creator's updated question variant after flag approval
 * When creator updates a question variant that was flagged by explainer/student and approved by processor
 */
const handleCreatorUpdateVariantAfterFlag = async (questionId, updateData, userId, flagType = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.status !== 'pending_creator') {
    throw new Error('Question is not in pending_creator status');
  }

  // Accept both explainer and student flag types
  const expectedFlagType = flagType || question.flagType;
  if (!question.isFlagged || question.flagStatus !== 'approved' || 
      (expectedFlagType !== 'explainer' && expectedFlagType !== 'student')) {
    throw new Error('Question variant was not flagged by explainer/student and approved by processor');
  }

  // Build update data object for Prisma
  const prismaUpdateData = {
    lastModifiedBy: userId,
    status: 'pending_processor', // Send back to processor for review
    // Resolve the flag when creator updates the variant
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    flagReason: null,
    flagReviewedBy: null,
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'creator',
      timestamp: new Date(),
      notes: `Question variant updated by creator after ${expectedFlagType} flag approval. Flag resolved and sent to processor for review.`,
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
    // Resolve the flag when gatherer updates the question
    isFlagged: false,
    flagStatus: null,
    flaggedBy: null,
    flagReason: null,
    flagReviewedBy: null,
    history: [{
      action: 'updated',
      performedBy: userId,
      role: 'gatherer',
      timestamp: new Date(),
      notes: 'Question updated by gatherer after explainer flag approval. Flag resolved and sent to processor for review.',
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

  // CRITICAL: Ensure status is always set to pending_processor for gatherer updates after flag
  // This ensures the question goes to processor first, not directly to creator/explainer
  prismaUpdateData.status = 'pending_processor';

  const updatedQuestion = await Question.update(questionId, prismaUpdateData);
  
  // Verify the status was set correctly
  if (updatedQuestion.status !== 'pending_processor') {
    console.error('[ERROR] Question status was not set to pending_processor after gatherer update (explainer flag)', {
      questionId,
      expectedStatus: 'pending_processor',
      actualStatus: updatedQuestion.status
    });
    // Force update the status if it wasn't set correctly
    await Question.update(questionId, { status: 'pending_processor' });
    updatedQuestion.status = 'pending_processor';
  }
  
  return updatedQuestion;
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
  // History is ordered by timestamp desc, so the most recent entry is at index 0
  const lastAction = question.history && question.history.length > 0 
    ? question.history[0] 
    : null;

  // Check if question was updated after a flag was approved
  // This can happen in two scenarios:
  // 1. Flag is still active (isFlagged && flagStatus === 'approved')
  // 2. Flag was cleared by gatherer/creator/explainer update but flagType still exists
  //    (This happens when gatherer updates after flag approval - flag is cleared but flagType preserved)
  const hasActiveFlag = question.isFlagged && question.flagStatus === 'approved';
  const hasRecentUpdate = question.history.some(h => 
    (h.role === 'gatherer' || h.role === 'creator' || h.role === 'explainer') && 
    h.action === 'updated'
  );
  // Detect gatherer update after flag: flagType exists, flag is cleared, and last action is gatherer update
  const isGathererUpdateAfterFlag = question.flagType && 
    !question.isFlagged && 
    lastAction && 
    lastAction.role === 'gatherer' && 
    lastAction.action === 'updated';
  
  const wasUpdatedAfterFlag = (hasActiveFlag && hasRecentUpdate) || isGathererUpdateAfterFlag;
  
  // PRIORITY 1: If question was updated after flag approval, route based on who flagged it
  // This ensures explainer-flagged questions go back to explainer, not creator
  // Student-flagged questions follow the same flow as creator-flagged questions
  if (wasUpdatedAfterFlag && question.flagType) {
    if (question.flagType === 'creator' || question.flagType === 'student') {
      // If creator or student flagged, send back to creator after update
      // Student flags follow the same flow as creator flags
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
    } else if (question.flagType === 'creator' || question.flagType === 'student') {
      // Creator or student flag - send to creator (student follows creator flow)
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
    // Student flags follow creator flow (go to creator)
    if (question.flagType === 'explainer') {
      nextStatus = 'pending_explainer';
    } else {
      // Normal flow: move to creator (applies to creator, student, and unflagged questions)
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
 * Toggle question visibility
 */
const toggleQuestionVisibility = async (questionId, isVisible, userId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // Only allow toggling visibility for completed (approved) questions
  if (question.status !== 'completed') {
    throw new Error('Only approved questions can have their visibility toggled');
  }

  // Update visibility
  const updatedQuestion = await Question.update(questionId, {
    isVisible: isVisible,
    lastModifiedById: userId,
  });

  // Add history entry
  await Question.addHistory(questionId, {
    action: isVisible ? 'visibility_enabled' : 'visibility_disabled',
    performedById: userId,
    role: 'superadmin',
    notes: `Question visibility ${isVisible ? 'enabled' : 'disabled'} by superadmin`,
    timestamp: new Date(),
  });

  return updatedQuestion;
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

  // Allow updating rejected questions (to resubmit) or flagged questions in pending_gatherer status
  const isRejected = question.status === 'rejected';
  const isFlaggedPendingGatherer = question.status === 'pending_gatherer' && 
                                    question.isFlagged && 
                                    question.flagStatus === 'approved';

  if (!isRejected && !isFlaggedPendingGatherer) {
    throw new Error('Question is not in a state that allows editing (must be rejected or flagged and pending gatherer action)');
  }

  // Handle rejected questions - update and resubmit to processor
  if (isRejected) {
    // Build update data object for Prisma
    const prismaUpdateData = {
      lastModifiedById: userId,
      status: 'pending_processor', // Resubmit to processor
      rejectionReason: null, // Clear rejection reason
      rejectedById: null, // Clear rejected by
      history: [{
        action: 'updated',
        performedById: userId,
        role: 'gatherer',
        timestamp: new Date(),
        notes: 'Question updated by gatherer after rejection. Resubmitted to processor for review.',
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
    if (updateData.exam !== undefined) {
      prismaUpdateData.exam = updateData.exam;
    }
    if (updateData.subject !== undefined) {
      prismaUpdateData.subject = updateData.subject;
    }
    if (updateData.topic !== undefined) {
      prismaUpdateData.topic = updateData.topic;
    }
    if (updateData.explanation !== undefined) {
      prismaUpdateData.explanation = updateData.explanation.trim();
    }
    if (updateData.assignedProcessor !== undefined) {
      prismaUpdateData.assignedProcessorId = updateData.assignedProcessor;
    }

    return await Question.update(questionId, prismaUpdateData);
  }

  // Handle flagged questions - route to appropriate handler based on who flagged it
  if (question.flagType === 'creator') {
    // Creator flagged - use handleGathererUpdateAfterFlag
    return await handleGathererUpdateAfterFlag(questionId, updateData, userId);
  } else if (question.flagType === 'student') {
    // Student flagged (original question) - use same handler as creator flags
    // This ensures student-flagged questions follow the same flow as creator-flagged questions
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
  if (question.flagType === 'explainer' || question.flagType === 'student') {
    // Explainer or student flagged variant - use handleCreatorUpdateVariantAfterFlag
    // Both follow the same flow: creator updates and sends back to processor
    return await handleCreatorUpdateVariantAfterFlag(questionId, updateData, userId, question.flagType);
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
const rejectGathererFlagRejection = async (questionId, rejectionReason, userId, role = null) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error('Question not found');
  }

  // CRITICAL: Ensure the processor is the assigned processor
  // SuperAdmin can bypass this check
  if (role !== 'superadmin' && question.assignedProcessorId && question.assignedProcessorId !== userId) {
    throw new Error('Access denied. This question is not assigned to you.');
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

/**
 * Get flagged questions for content moderation (superadmin)
 */
const getFlaggedQuestionsForModeration = async (filters = {}) => {
  const { prisma } = require('../../../config/db/prisma');
  
  const where = {
    isFlagged: true,
    flagType: 'student',
  };

  if (filters.status) {
    where.flagStatus = filters.status;
  }

  const questions = await prisma.question.findMany({
    where,
    include: {
      exam: {
        select: { id: true, name: true },
      },
      subject: {
        select: { id: true, name: true },
      },
      topic: {
        select: { id: true, name: true },
      },
      flaggedBy: {
        select: { id: true, name: true, fullName: true, email: true },
      },
      flagReviewedBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return questions.map((q) => {
    // Get submitted by name - try name, fullName, or email as fallback
    let submittedBy = 'Unknown';
    if (q.flaggedBy) {
      submittedBy = q.flaggedBy.name || q.flaggedBy.fullName || q.flaggedBy.email || 'Unknown';
    }

    return {
      id: q.id,
      contentType: 'Question',
      submittedBy: submittedBy,
      flagReason: q.flagReason,
      dateReported: q.createdAt,
      status: q.flagStatus || 'pending',
      question: q.questionText,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      exam: q.exam ? { id: q.examId, ...q.exam } : null,
      subject: q.subject ? { id: q.subjectId, ...q.subject } : null,
      topic: q.topic ? { id: q.topicId, ...q.topic } : null,
      flaggedBy: q.flaggedBy,
      flagReviewedBy: q.flagReviewedBy,
      flagRejectionReason: q.flagRejectionReason,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    };
  });
};

/**
 * Approve student flag (superadmin)
 * When approved, question goes to processor with student reason
 */
const approveStudentFlag = async (questionId, adminId) => {
  const { prisma } = require('../../../config/db/prisma');
  
  const question = await prisma.question.findFirst({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagType !== 'student') {
    throw new Error('Question is not flagged by a student');
  }

  // Update question: approve flag and send to processor
  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      flagStatus: 'approved',
      flagReviewedById: adminId,
      status: 'pending_processor',
      updatedAt: new Date(),
    },
  });

  // Create history entry
  await prisma.questionHistory.create({
    data: {
      questionId: questionId,
      action: 'flag_approved',
      performedById: adminId,
      role: 'superadmin',
      notes: `Student flag approved. Reason: ${question.flagReason}. Question sent to processor.`,
    },
  });

  return updatedQuestion;
};

/**
 * Reject student flag (superadmin)
 * Admin provides rejection reason that will be shown to student
 */
const rejectStudentFlag = async (questionId, rejectionReason, adminId) => {
  const { prisma } = require('../../../config/db/prisma');
  
  const question = await prisma.question.findFirst({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  if (!question.isFlagged || question.flagType !== 'student') {
    throw new Error('Question is not flagged by a student');
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is required');
  }

  // Update question: reject flag and keep status as completed
  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      flagStatus: 'rejected',
      flagReviewedById: adminId,
      flagRejectionReason: rejectionReason.trim(),
      // Keep isFlagged true so student can see rejection reason
      updatedAt: new Date(),
    },
  });

  // Create history entry
  await prisma.questionHistory.create({
    data: {
      questionId: questionId,
      action: 'flag_rejected',
      performedById: adminId,
      role: 'superadmin',
      notes: `Student flag rejected. Admin reason: ${rejectionReason.trim()}`,
    },
  });

  return updatedQuestion;
};

module.exports = {
  createQuestion,
  createQuestionWithCompletedStatus,
  getQuestionsByStatus,
  getQuestionById,
  updateQuestionByCreator,
  createQuestionVariant,
  updateExplanationByExplainer,
  saveDraftExplanationByExplainer,
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
  reviewStudentFlag,
  handleGathererUpdateAfterFlag,
  handleGathererUpdateAfterExplainerFlag,
  handleCreatorUpdateVariantAfterFlag,
  approveUpdatedFlaggedQuestion,
  toggleQuestionVisibility,
  getCompletedExplanationsByExplainer,
  getQuestionsByStatusAndRole,
  rejectGathererFlagRejection,
  getFlaggedQuestionsForModeration,
  approveStudentFlag,
  rejectStudentFlag,
};

