const User = require('../../models/user');
const Subscription = require('../../models/subscription');
const StudentAnswer = require('../../models/studentAnswer');
const { prisma } = require('../../config/db/prisma');

/**
 * Get all students with filtering and pagination
 */
const getAllStudents = async (filters = {}, pagination = {}) => {
  const { status, plan, date, search, studentId } = filters;
  const { page = 1, limit = 5 } = pagination;

  // Build where clause
  const where = { role: 'student' };

  // Filter by student shortId (exact match) or id (fallback)
  if (studentId && studentId.trim()) {
    where.OR = [
      { shortId: { equals: studentId.trim() } },
      { id: { equals: studentId.trim() } },
    ];
  }

  // Filter by status
  if (status && ['active', 'suspended'].includes(status.toLowerCase())) {
    where.status = status.toLowerCase();
  }

  // Filter by plan (subscription plan name)
  // Filter students who have active subscriptions with the specified plan name
  if (plan && plan.toLowerCase() !== 'all') {
    // Find plan IDs that match the plan name
    const matchingPlans = await prisma.plan.findMany({
      where: {
        name: { equals: plan, mode: 'insensitive' },
      },
      select: { id: true },
    });
    
    const planIds = matchingPlans.map((p) => p.id);
    
    if (planIds.length > 0) {
      // Filter students who have active subscriptions with matching plan IDs
      where.subscriptions = {
        some: {
          planId: { in: planIds },
          isActive: true,
          expiryDate: { gte: new Date() },
        },
      };
    } else if (plan.toLowerCase() === 'free') {
      // For "Free" plan, filter students who don't have any active subscriptions
      where.subscriptions = {
        none: {
          isActive: true,
          expiryDate: { gte: new Date() },
        },
      };
    } else {
      // If plan name doesn't match any plan and it's not "Free", return empty result
      where.id = { in: [] }; // This will return no results
    }
  }

  // Filter by date (signup date range)
  if (date && date.toLowerCase() !== 'all') {
    const now = new Date();
    let startDate;
    const dateLower = date.toLowerCase();
    
    if (dateLower === 'today') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (dateLower === 'thisweek' || dateLower === 'this week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek; // Get Monday
      startDate = new Date(now);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
    } else if (dateLower === 'thismonth' || dateLower === 'this month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateLower === 'thisyear' || dateLower === 'this year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    if (startDate) {
      where.createdAt = { gte: startDate };
    }
  }

  // Search by name or email or shortId (instead of id)
  if (search && search.trim()) {
    const searchTerm = search.trim();
    const searchConditions = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { fullName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { shortId: { equals: searchTerm } },
      ],
    };
    
    // If studentId filter already exists, combine with AND
    if (where.OR && where.OR.length > 0) {
      where.AND = [
        { OR: where.OR },
        searchConditions,
      ];
      delete where.OR;
    } else {
      where.OR = searchConditions.OR;
    }
  }

  // Calculate skip
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalItems = await prisma.user.count({ where });

  // Get paginated results with subscriptions
  const students = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      fullName: true,
      email: true,
      status: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        where: {
          isActive: true,
          expiryDate: { gte: new Date() },
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
            },
          },
        },
        orderBy: {
          expiryDate: 'desc',
        },
        take: 1, // Get only the most recent active subscription
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Get test counts for each student (test mode only)
  const studentIds = students.map((s) => s.id);
  const testCounts = await prisma.studentAnswer.groupBy({
    by: ['studentId'],
    where: {
      studentId: { in: studentIds },
      mode: 'test',
      status: 'completed',
    },
    _count: {
      id: true,
    },
  });

  // Create a map of studentId to test count
  const testCountMap = {};
  testCounts.forEach((tc) => {
    testCountMap[tc.studentId] = tc._count.id;
  });

  // Format students data
  const formattedStudents = students.map((student) => {
    const activeSubscription = student.subscriptions[0] || null;
    const testCount = testCountMap[student.id] || 0;
    
    // Determine subscription/plan name
    let subscriptionName = 'Free';
    if (activeSubscription && activeSubscription.plan) {
      subscriptionName = activeSubscription.plan.name;
    }

    // Format signup date as DD-MM-YYYY
    const signUpDate = formatDateDDMMYYYY(student.createdAt);

    // Format progress
    const progress = testCount > 0 ? `${testCount} Test${testCount !== 1 ? 's' : ''}` : 'No activity';

    return {
      id: student.id,
      name: student.fullName || student.name || 'N/A',
      email: student.email,
      subscription: subscriptionName,
      progress: progress,
      signUpDate: signUpDate,
      status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
      isEmailVerified: student.isEmailVerified,
    };
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    students: formattedStudents,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    },
    filters: {
      status: status || null,
      plan: plan || null,
      date: date || null,
      search: search || null,
    },
  };
};

/**
 * Get student management statistics
 */
const getStudentManagementStatistics = async () => {
  try {
    // Get total students count
    const totalStudents = await prisma.user.count({
      where: { role: 'student' },
    });

    // Get active students count
    const activeStudents = await prisma.user.count({
      where: {
        role: 'student',
        status: 'active',
      },
    });

    // Get suspended students count
    const suspended = await prisma.user.count({
      where: {
        role: 'student',
        status: 'suspended',
      },
    });

    // Get verified students count
    const verified = await prisma.user.count({
      where: {
        role: 'student',
        isEmailVerified: true,
      },
    });

    // Get unverified students count
    const unverified = await prisma.user.count({
      where: {
        role: 'student',
        isEmailVerified: false,
      },
    });

    return {
      totalStudents,
      activeStudents,
      suspended,
      verified,
      unverified,
    };
  } catch (error) {
    console.error('Error getting student management statistics:', error);
    throw error;
  }
};

/**
 * Helper function to format date as DD-MM-YYYY
 */
const formatDateDDMMYYYY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Get student details by ID
 * Includes test mode statistics, activity trend, progress breakdown, and flagged questions
 */
const getStudentById = async (studentId) => {
  try {
    // Get student basic info
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: 'student' },
      include: {
        subscriptions: {
          where: {
            isActive: true,
            expiryDate: { gte: new Date() },
          },
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true,
              },
            },
          },
          orderBy: {
            expiryDate: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!student) {
      return null;
    }

    // Get test mode statistics (only test mode, status = 'completed')
    const testAnswers = await prisma.studentAnswer.findMany({
      where: {
        studentId: studentId,
        mode: 'test',
        status: 'completed',
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics from test mode only
    const totalTest = testAnswers.length;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalScore = 0;

    testAnswers.forEach((answer) => {
      totalCorrect += answer.correctAnswers;
      totalIncorrect += answer.incorrectAnswers;
      totalScore += answer.percentage;
    });

    const avgScore = totalTest > 0 ? Math.round(totalScore / totalTest) : 0;

    // Get activity trend (last 7 days average scores)
    const now = new Date();
    const activityTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Get all test answers for this day
      const dayAnswers = await prisma.studentAnswer.findMany({
        where: {
          studentId: studentId,
          mode: 'test',
          status: 'completed',
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
        select: {
          percentage: true,
        },
      });

      // Calculate average score for this day
      let avgScore = 0;
      if (dayAnswers.length > 0) {
        const totalScore = dayAnswers.reduce((sum, answer) => sum + answer.percentage, 0);
        avgScore = Math.round(totalScore / dayAnswers.length);
      }

      activityTrend.push(avgScore);
    }

    // Get last active date (from test mode)
    const lastTestAnswer = testAnswers[0];
    const lastActive = lastTestAnswer
      ? formatLastActive(lastTestAnswer.createdAt)
      : 'Never';

    // Determine activity level based on test count
    let activityLevel = 'Low';
    if (totalTest >= 20) {
      activityLevel = 'High';
    } else if (totalTest >= 10) {
      activityLevel = 'Medium';
    }

    // Format progress breakdown (test mode only)
    const progress = testAnswers.map((answer) => {
      const passed = answer.percentage >= 60; // 60% threshold for passing
      return {
        testName: answer.exam?.name || 'Unknown Exam',
        date: formatDateDDMMYYYY(answer.createdAt),
        score: answer.correctAnswers,
        total: answer.totalQuestions,
        percentage: answer.percentage,
        result: passed ? 'Passed' : 'Failed',
      };
    });

    // Get flagged questions by this student
    const flaggedQuestions = await prisma.question.findMany({
      where: {
        flaggedById: studentId,
        flagType: 'student',
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format flagged questions
    const flags = flaggedQuestions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      flagReason: question.flagReason,
      flagStatus: question.flagStatus,
      exam: question.exam?.name || 'Unknown',
      subject: question.subject?.name || 'Unknown',
      topic: question.topic?.name || 'Unknown',
      date: formatDateDDMMYYYY(question.createdAt),
    }));

    // Determine subscription
    const activeSubscription = student.subscriptions[0] || null;
    let subscriptionName = 'Free';
    let subscriptionExpiry = null;
    if (activeSubscription && activeSubscription.plan) {
      subscriptionName = activeSubscription.plan.name;
      subscriptionExpiry = formatDateDDMMYYYY(activeSubscription.expiryDate);
    }

    // Format student ID (use first 6 chars of UUID)
    const studentIdShort = `#${student.id.substring(0, 6).toUpperCase()}`;

    return {
      id: student.id,
      name: student.fullName || student.name || 'N/A',
      studentId: studentIdShort,
      email: student.email,
      subscription: subscriptionName,
      subscriptionExpiry: subscriptionExpiry,
      signupDate: formatDateDDMMYYYY(student.createdAt),
      status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
      profilePicture: student.avatar,
      avgScore,
      totalTest,
      correctAnswers: totalCorrect,
      incorrectAnswers: totalIncorrect,
      lastActive,
      activityLevel,
      activityTrend,
      progress,
      flags,
    };
  } catch (error) {
    console.error('Error getting student details:', error);
    throw error;
  }
};

/**
 * Helper function to format last active time
 */
const formatLastActive = (date) => {
  const now = new Date();
  const lastActiveDate = new Date(date);
  const diffMs = now - lastActiveDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDateDDMMYYYY(lastActiveDate);
  }
};

/**
 * Update student status (suspend/activate)
 */
const updateStudentStatus = async (studentId, status) => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Verify student exists and is a student
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (student.role !== 'student') {
      throw new Error('User is not a student');
    }

    // Validate status
    if (!['active', 'suspended'].includes(status)) {
      throw new Error('Status must be either active or suspended');
    }

    // Update student status
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { status },
    });

    return updatedStudent;
  } catch (error) {
    console.error('Error updating student status:', error);
    throw error;
  }
};

module.exports = {
  getAllStudents,
  getStudentManagementStatistics,
  getStudentById,
  updateStudentStatus,
};

