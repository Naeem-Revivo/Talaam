const User = require('../../models/user');
const Subscription = require('../../models/subscription');
const Plan = require('../../models/plan');
const StudentAnswer = require('../../models/studentAnswer');
const Subject = require('../../models/subject');
const crypto = require('crypto');

/**
 * Generate a random password
 */
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  return password;
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  return await User.findByEmail(email.toLowerCase().trim());
};

/**
 * Find user by email excluding a specific user ID
 */
const findUserByEmailExcludingId = async (email, excludeUserId) => {
  const { prisma } = require('../../config/db/prisma');
  return await prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      id: { not: excludeUserId },
    },
  });
};

/**
 * Create admin user
 */
const createAdminUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Get all admin users with filtering and pagination
 */
const getAllAdmins = async (filters = {}, pagination = {}) => {
  const { status, adminRole, search } = filters;
  const { page = 1, limit = 5 } = pagination;

  const { prisma } = require('../../config/db/prisma');

  // Build where clause
  const where = { role: 'admin' };

  // Filter by status
  if (status && ['active', 'suspended'].includes(status)) {
    where.status = status;
  }

  // Filter by adminRole (workflow role)
  if (adminRole && ['gatherer', 'creator', 'explainer', 'processor'].includes(adminRole)) {
    where.adminRole = adminRole;
  }

  // Search by name or email
  if (search && search.trim()) {
    const searchTerm = search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { fullName: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  // Calculate skip
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalItems = await prisma.user.count({ where });

  // Get paginated results
  const admins = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      fullName: true,
      role: true,
      adminRole: true,
      status: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    admins,
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
      adminRole: adminRole || null,
      search: search || null,
    },
  };
};

/**
 * Find user by ID
 */
const findUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Update user status
 */
const updateUserStatus = async (user, status) => {
  return await User.update(user.id, { status });
};

/**
 * Update admin core fields
 */
const updateAdminDetails = async (user, updates) => {
  const updateData = {};
  
  if (updates.name !== undefined) {
    updateData.name = updates.name;
    updateData.fullName = updates.name;
  }
  if (updates.email !== undefined) {
    updateData.email = updates.email;
  }
  if (updates.status !== undefined) {
    updateData.status = updates.status;
  }
  if (updates.adminRole !== undefined) {
    updateData.adminRole = updates.adminRole;
  }

  return await User.update(user.id, updateData);
};

/**
 * Delete admin user
 */
const deleteAdminUser = async (userId) => {
  return await User.delete(userId);
};

/**
 * Get monthly user growth data for the last 12 months
 * Returns array of objects with month, new user count, and cumulative count
 */
const getUserGrowthData = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Calculate date range for last 12 months
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 12);
    twelveMonthsAgo.setDate(1); // Start of the month
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get total users before the 12-month period (for cumulative calculation)
    const totalUsersBefore = await prisma.user.count({
      where: {
        createdAt: { lt: twelveMonthsAgo },
        role: 'student',
      },
    });

    // Get all users created in the last 12 months
    const users = await prisma.user.findMany({
      where: {
        createdAt: { gte: twelveMonthsAgo },
        role: 'student',
      },
      select: {
        createdAt: true,
      },
    });

    // Group by month
    const monthlyMap = new Map();
    users.forEach((user) => {
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    });

    // Create a map of all months in the last 12 months with default count 0
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthData = [];
    let cumulativeCount = totalUsersBefore;

    // Fill in the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthNames[month];
      const key = `${year}-${month}`;

      const count = monthlyMap.get(key) || 0;
      cumulativeCount += count;

      growthData.push({
        month: monthName,
        year: year,
        monthNumber: month + 1,
        count: count, // New users in this month
        cumulativeCount: cumulativeCount, // Total users up to this month
      });
    }

    return growthData;
  } catch (error) {
    console.error('Error getting user growth data:', error);
    throw error;
  }
};

/**
 * Get latest signups (most recent 3 users)
 * Returns array of objects with user name, email, and signup time
 */
const getLatestSignups = async (limit = 3) => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    const latestUsers = await prisma.user.findMany({
      where: {
        role: 'student',
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const now = new Date();
    
    return latestUsers.map((user) => {
      const createdAt = new Date(user.createdAt);
      const diffMs = now - createdAt;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = '';
      if (diffMins < 1) {
        timeAgo = 'Just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} min ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        // Format as date if older than 7 days
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        timeAgo = `${monthNames[createdAt.getMonth()]} ${createdAt.getDate()}, ${createdAt.getFullYear()}`;
      }

      return {
        id: user.id,
        name: user.fullName || user.name || 'Unknown',
        email: user.email,
        createdAt: user.createdAt,
        timeAgo: timeAgo,
      };
    });
  } catch (error) {
    console.error('Error getting latest signups:', error);
    throw error;
  }
};

/**
 * Get subscription plan breakdown for dashboard
 * Returns percentage distribution of subscription plans
 */
const getSubscriptionPlanBreakdown = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Get all subscriptions with their plans
    const subscriptions = await prisma.subscription.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      include: {
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    // Count subscriptions by plan type
    const planCounts = {};
    const usersWithPaidSubscriptions = new Set();
    
    subscriptions.forEach((sub) => {
      const planName = sub.plan?.name?.toLowerCase() || 'free';
      planCounts[planName] = (planCounts[planName] || 0) + 1;
      usersWithPaidSubscriptions.add(sub.userId);
    });

    // Get total users
    const totalUsers = await prisma.user.count({ where: { role: 'student' } });
    const usersWithPaidCount = usersWithPaidSubscriptions.size;

    // Calculate percentages and map to frontend format
    const breakdown = [];
    
    // Free plan (users without paid subscriptions)
    const freeCount = totalUsers - usersWithPaidCount;
    const freePercentage = totalUsers > 0 ? (freeCount / totalUsers) * 100 : 0;
    
    breakdown.push({
      label: 'Free',
      value: freePercentage,
      color: '#E5E7EB',
      isBase: true,
    });

    // Premium plan
    const premiumCount = planCounts['premium'] || 0;
    const premiumPercentage = totalUsers > 0 ? (premiumCount / totalUsers) * 100 : 0;
    breakdown.push({
      label: 'Premium',
      value: premiumPercentage,
      color: '#ED4122',
      isBase: false,
    });

    // Organization plan
    const orgCount = planCounts['organization'] || planCounts['organisation'] || 0;
    const orgPercentage = totalUsers > 0 ? (orgCount / totalUsers) * 100 : 0;
    breakdown.push({
      label: 'Organization',
      value: orgPercentage,
      color: '#6CA6C1',
      isBase: false,
    });

    return breakdown;
  } catch (error) {
    console.error('Error getting subscription plan breakdown:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics for superadmin
 * Returns total students, verified email students, active subscriptions, total revenue, user growth data, latest signups, and subscription plan breakdown
 */
const getDashboardStatistics = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Get total students count
    const totalStudents = await prisma.user.count({
      where: { role: 'student' },
    });

    // Get verified email students count
    const verifiedEmailStudents = await prisma.user.count({
      where: {
        role: 'student',
        isEmailVerified: true,
      },
    });

    // Get active subscriptions count
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        isActive: true,
      },
    });

    // Calculate total revenue from paid subscriptions
    const paidSubscriptions = await prisma.subscription.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      include: {
        plan: {
          select: {
            price: true,
          },
        },
      },
    });

    // Calculate total revenue
    const totalRevenue = paidSubscriptions.reduce((sum, sub) => {
      return sum + (parseFloat(sub.plan?.price || 0));
    }, 0);

    // Get user growth data
    const userGrowthData = await getUserGrowthData();

    // Get latest signups
    const latestSignups = await getLatestSignups(3);

    // Get subscription plan breakdown
    const subscriptionPlanBreakdown = await getSubscriptionPlanBreakdown();

    return {
      totalStudents,
      verifiedEmailStudents,
      activeSubscriptions,
      totalRevenue,
      userGrowthData,
      latestSignups,
      subscriptionPlanBreakdown,
    };
  } catch (error) {
    console.error('Error getting dashboard statistics:', error);
    throw error;
  }
};

/**
 * Get user management statistics for superadmin
 * Returns total counts of gatherer, creator, processor, and explainer
 */
const getUserManagementStatistics = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Count users by adminRole using Prisma
    const totalGatherer = await prisma.user.count({
      where: {
        role: 'admin',
        adminRole: 'gatherer',
      },
    });

    const totalCreator = await prisma.user.count({
      where: {
        role: 'admin',
        adminRole: 'creator',
      },
    });

    const totalProcessor = await prisma.user.count({
      where: {
        role: 'admin',
        adminRole: 'processor',
      },
    });

    const totalExplainer = await prisma.user.count({
      where: {
        role: 'admin',
        adminRole: 'explainer',
      },
    });

    return {
      totalGatherer,
      totalCreator,
      totalProcessor,
      totalExplainer,
    };
  } catch (error) {
    console.error('Error getting user management statistics:', error);
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
 * Get all user subscriptions with filtering and pagination
 */
const getAllUserSubscriptions = async (filters = {}, pagination = {}) => {
  const { prisma } = require('../../config/db/prisma');
  const { planId, status, search } = filters;
  const { page = 1, limit = 10 } = pagination;

  // Build Prisma where clause
  const where = {};

  // Filter by plan
  if (planId) {
    where.planId = planId;
  }

  // Filter by status (Active, Expire, Pending)
  if (status) {
    const now = new Date();
    if (status === 'Active') {
      // Active: Paid subscriptions that are not expired
      where.paymentStatus = 'Paid';
      where.isActive = true;
      where.expiryDate = { gte: now };
    } else if (status === 'Expire') {
      // Expire: Subscriptions that are expired AND unpaid
      where.OR = [
        {
          expiryDate: { lt: now },
          paymentStatus: { not: 'Paid' },
        },
        {
          isActive: false,
          paymentStatus: { not: 'Paid' },
        },
      ];
    } else if (status === 'Pending') {
      // Pending: Unpaid subscriptions that are not expired yet
      where.paymentStatus = { not: 'Paid' };
      where.expiryDate = { gte: now };
    }
  }

  // Search by user name or email
  if (search) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);
    if (userIds.length > 0) {
      where.userId = { in: userIds };
    } else {
      // If no users found, return empty result
      where.userId = { in: [] };
    }
  }

  // Get total count
  const totalItems = await prisma.subscription.count({ where });

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  // Get subscriptions with pagination using Prisma
  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
        },
      },
      plan: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Sync payment status from Moyasar for subscriptions that have moyassarPaymentId but are not Paid
  const moyassarService = require('../payment/moyassar.service');
  const syncPromises = subscriptions
    .filter(sub => sub.moyassarPaymentId && sub.paymentStatus !== 'Paid')
    .map(async (sub) => {
      try {
        await moyassarService.syncPaymentStatus(sub.id);
      } catch (error) {
        console.error(`Error syncing payment status for subscription ${sub.id}:`, error);
        // Don't throw, just log the error
      }
    });
  
  // Wait for all syncs to complete (but don't block if some fail)
  await Promise.allSettled(syncPromises);

  // Re-fetch subscriptions after syncing to get updated payment status
  const updatedSubscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
        },
      },
      plan: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Transform subscriptions to match expected format
  const transformedSubscriptions = updatedSubscriptions.map((sub) => ({
    ...sub,
    userId: sub.user,
    planId: sub.plan,
  }));

  return {
    subscriptions: transformedSubscriptions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters: {
      planId: planId || null,
      status: status || null,
      search: search || null,
    },
  };
};

/**
 * Get subscription details by ID
 */
const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Get subscription with populated data using Prisma
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            fullName: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Transform to match expected format
    return {
      ...subscription,
      userId: subscription.user,
      planId: subscription.plan,
    };
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
};

/**
 * Get payment history with filtering and pagination
 */
const getPaymentHistory = async (filters = {}, pagination = {}) => {
  const { prisma } = require('../../config/db/prisma');
  const { planId, paymentStatus, startDate, endDate, search } = filters;
  const { page = 1, limit = 10 } = pagination;

  // Build Prisma where clause - only show paid subscriptions
  const where = {
    paymentStatus: 'Paid',
  };

  // Filter by plan
  if (planId) {
    where.planId = planId;
  }

  // Filter by payment status (for paid subscriptions, we can filter by active/expire/pending)
  if (paymentStatus) {
    const now = new Date();
    if (paymentStatus === 'Active') {
      // Active: Paid subscriptions that are not expired
      where.paymentStatus = 'Paid';
      where.isActive = true;
      where.expiryDate = { gte: now };
    } else if (paymentStatus === 'Expire') {
      // Expire: Subscriptions that are expired AND unpaid
      where.OR = [
        {
          expiryDate: { lt: now },
          paymentStatus: { not: 'Paid' },
        },
        {
          isActive: false,
          paymentStatus: { not: 'Paid' },
        },
      ];
    } else if (paymentStatus === 'Pending') {
      // Pending: Unpaid subscriptions (regardless of expiry)
      where.paymentStatus = { not: 'Paid' };
    }
  }

  // Filter by date range
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Search by user name or email
  if (search) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);
    if (userIds.length > 0) {
      where.userId = { in: userIds };
    } else {
      // If no users found, return empty result
      where.userId = { in: [] };
    }
  }

  // Get total count
  const totalItems = await prisma.subscription.count({ where });

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  // Get subscriptions with pagination using Prisma
  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
        },
      },
      plan: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Transform subscriptions to match expected format
  const transformedSubscriptions = subscriptions.map((sub) => ({
    ...sub,
    userId: sub.user,
    planId: sub.plan,
  }));

  return {
    payments: transformedSubscriptions,
    subscriptions: transformedSubscriptions, // Keep for backward compatibility
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters: {
      planId: planId || null,
      paymentStatus: paymentStatus || null,
      startDate: startDate || null,
      endDate: endDate || null,
      search: search || null,
    },
  };
};

/**
 * Get user analytics hero page metrics
 */
const getUserAnalyticsHero = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. New Sign-ups (current month)
    const newSignUpsCurrent = await prisma.user.count({
      where: {
        role: 'student',
        createdAt: { gte: currentMonthStart },
      },
    });

    const newSignUpsLast = await prisma.user.count({
      where: {
        role: 'student',
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    const signUpsChange = newSignUpsLast > 0
      ? Math.round(((newSignUpsCurrent - newSignUpsLast) / newSignUpsLast) * 100)
      : 0;

    // 2. Active Users (users who answered questions in current month)
    const activeUsersCurrentData = await prisma.studentAnswer.findMany({
      where: {
        createdAt: { gte: currentMonthStart },
      },
      select: {
        studentId: true,
      },
      distinct: ['studentId'],
    });

    const activeUsersLastData = await prisma.studentAnswer.findMany({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      select: {
        studentId: true,
      },
      distinct: ['studentId'],
    });

    const activeUsersCount = activeUsersCurrentData.length;
    const activeUsersLastCount = activeUsersLastData.length;
    const activeUsersChange = activeUsersLastCount > 0
      ? Math.round(((activeUsersCount - activeUsersLastCount) / activeUsersLastCount) * 100)
      : 0;

    // 3. Most Attempted Subject
    // Get all student answers and filter for non-null subjectId in JavaScript
    const allAnswers = await prisma.studentAnswer.findMany({
      select: {
        subjectId: true,
      },
    });

    // Filter and group by subjectId manually (excluding nulls)
    const subjectCounts = new Map();
    allAnswers.forEach((answer) => {
      if (answer.subjectId) {
        subjectCounts.set(answer.subjectId, (subjectCounts.get(answer.subjectId) || 0) + 1);
      }
    });

    // Find the most attempted subject
    let mostAttemptedSubject = 'N/A';
    if (subjectCounts.size > 0) {
      const sortedSubjects = Array.from(subjectCounts.entries())
        .sort((a, b) => b[1] - a[1]);
      
      const topSubjectId = sortedSubjects[0][0];
      const subject = await prisma.subject.findUnique({
        where: {
          id: topSubjectId,
        },
        select: {
          name: true,
        },
      });
      if (subject) {
        mostAttemptedSubject = subject.name;
      }
    }

    // 4. Average Time/Question (using default 45s as shown in image, or calculate from timestamps)
    const testAnswers = await prisma.studentAnswer.findMany({
      where: {
        mode: 'test',
        totalQuestions: { gt: 0 },
      },
      select: {
        createdAt: true,
        updatedAt: true,
        totalQuestions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    let averageTimePerQuestion = 45; // Default fallback
    if (testAnswers.length > 0) {
      const totalTime = testAnswers.reduce((sum, test) => {
        const timeDiff = (new Date(test.updatedAt) - new Date(test.createdAt)) / 1000; // seconds
        return sum + (timeDiff / test.totalQuestions);
      }, 0);
      averageTimePerQuestion = Math.round(totalTime / testAnswers.length);
    }

    return {
      newSignUps: {
        value: newSignUpsCurrent,
        change: signUpsChange,
        changeType: signUpsChange >= 0 ? 'increase' : 'decrease',
      },
      activeUsers: {
        value: activeUsersCount,
        change: activeUsersChange,
        changeType: activeUsersChange >= 0 ? 'increase' : 'decrease',
      },
      mostAttemptedSubject: mostAttemptedSubject,
      averageTimePerQuestion: averageTimePerQuestion,
    };
  } catch (error) {
    console.error('Error getting user analytics hero:', error);
    throw error;
  }
};

/**
 * Get overall user growth chart data (last 30 days by weeks)
 */
const getUserGrowthChart = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all new users in last 30 days
    const newUsers = await prisma.user.findMany({
      where: {
        role: 'student',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by weeks (4 weeks)
    const weekData = [];
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(thirtyDaysAgo);
      weekStart.setDate(weekStart.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekUsers = newUsers.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= weekStart && userDate <= weekEnd;
      });

      weekData.push({
        week: week + 1,
        label: `Week ${week + 1}`,
        newUsers: weekUsers.length,
        date: weekStart.toISOString().split('T')[0],
      });
    }

    return {
      title: 'Overall User Growth',
      subtitle: 'New users over the last 30 days',
      weeks: weekData,
    };
  } catch (error) {
    console.error('Error getting user growth chart:', error);
    throw error;
  }
};

/**
 * Get top performance users table
 */
const getTopPerformanceUsers = async (pagination = {}) => {
  try {
    const { prisma } = require('../../config/db/prisma');
    const { page = 1, limit = 5 } = pagination;

    // Get all student answers grouped by student
    // studentId is required, so no need to filter for null
    const allAnswers = await prisma.studentAnswer.findMany({
      select: {
        studentId: true,
        mode: true,
        isCorrect: true,
        correctAnswers: true,
        totalQuestions: true,
        createdAt: true,
        answers: {
          select: {
            id: true,
          },
        },
      },
    });

    // Group by student and calculate metrics
    const userPerformanceMap = new Map();
    
    allAnswers.forEach((answer) => {
      const studentId = answer.studentId;
      if (!userPerformanceMap.has(studentId)) {
        userPerformanceMap.set(studentId, {
          studentId,
          totalAttempts: 0,
          correctAnswers: 0,
          totalQuestions: 0,
          lastActive: answer.createdAt,
        });
      }

      const userPerf = userPerformanceMap.get(studentId);
      
      if (answer.mode === 'test') {
        // For test mode, count answers array size or use totalQuestions
        const answerCount = answer.answers ? answer.answers.length : (answer.totalQuestions || 0);
        userPerf.totalAttempts += answerCount;
        userPerf.correctAnswers += answer.correctAnswers || 0;
        userPerf.totalQuestions += answer.totalQuestions || 0;
      } else {
        // For study mode, count individual answers
        userPerf.totalAttempts += 1;
        if (answer.isCorrect) {
          userPerf.correctAnswers += 1;
        }
        userPerf.totalQuestions += 1;
      }

      // Update last active date
      if (new Date(answer.createdAt) > new Date(userPerf.lastActive)) {
        userPerf.lastActive = answer.createdAt;
      }
    });

    // Convert to array and calculate accuracy
    const userPerformance = Array.from(userPerformanceMap.values())
      .map((up) => ({
        ...up,
        accuracy: up.totalQuestions > 0
          ? Math.round((up.correctAnswers / up.totalQuestions) * 100)
          : 0,
        averageTimePerQuestion: 45, // Default value
      }))
      .sort((a, b) => {
        // Sort by attempts first, then accuracy
        if (b.totalAttempts !== a.totalAttempts) {
          return b.totalAttempts - a.totalAttempts;
        }
        return b.accuracy - a.accuracy;
      });

    // Get total count for pagination
    const totalCount = userPerformance.length;

    // Paginate
    const skip = (page - 1) * limit;
    const paginatedPerformance = userPerformance.slice(skip, skip + limit);

    // Get user details
    const userIds = paginatedPerformance.map((up) => up.studentId);
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        email: true,
      },
    });

    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    // Format response
    const now = new Date();
    const formattedUsers = paginatedPerformance.map((up, index) => {
      const user = userMap.get(up.studentId);
      const lastActiveDate = new Date(up.lastActive);
      const daysAgo = Math.floor((now - lastActiveDate) / (1000 * 60 * 60 * 24));

      return {
        rank: skip + index + 1,
        user: {
          id: up.studentId,
          name: user ? (user.fullName || user.name || 'N/A') : 'N/A',
          email: user ? user.email : 'N/A',
        },
        attempts: up.totalAttempts,
        accuracy: up.accuracy,
        averageTimePerQuestion: up.averageTimePerQuestion,
        lastActive: daysAgo,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error getting top performance users:', error);
    throw error;
  }
};

/**
 * Get subscription trend metrics
 */
const getSubscriptionTrendMetrics = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Total Subscribers
    const totalSubscribers = await prisma.subscription.count();

    // Total Revenue (sum of all paid subscriptions)
    const paidSubscriptions = await prisma.subscription.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      include: {
        plan: {
          select: {
            price: true,
          },
        },
      },
    });

    const totalRevenue = paidSubscriptions.reduce((sum, sub) => {
      return sum + (parseFloat(sub.plan?.price || 0));
    }, 0);

    // Active and Expired subscriptions
    const now = new Date();
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        isActive: true,
        expiryDate: { gte: now },
        paymentStatus: 'Paid',
      },
    });

    const expiredSubscriptions = await prisma.subscription.count({
      where: {
        OR: [
          { isActive: false },
          { expiryDate: { lt: now } },
        ],
      },
    });

    // Renewal Rate (percentage of active subscriptions)
    const renewalRate = totalSubscribers > 0
      ? Math.round((activeSubscriptions / totalSubscribers) * 100)
      : 0;

    // Churn Rate (percentage of expired subscriptions)
    const churnRate = totalSubscribers > 0
      ? Math.round((expiredSubscriptions / totalSubscribers) * 100)
      : 0;

    return {
      totalSubscribers,
      totalRevenue,
      renewalRate,
      churnRate,
    };
  } catch (error) {
    console.error('Error getting subscription trend metrics:', error);
    throw error;
  }
};

/**
 * Get revenue trend chart data
 */
const getRevenueTrendChart = async () => {
  // Get revenue data grouped by month for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get paid subscriptions from last 6 months using Prisma
  const { prisma } = require('../../config/db/prisma');
  const paidSubscriptions = await prisma.subscription.findMany({
    where: {
        paymentStatus: 'Paid',
      createdAt: { gte: sixMonthsAgo },
      },
    include: {
      plan: {
        select: {
          price: true,
      },
    },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Group by month/year and calculate revenue
  const revenueMap = new Map();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  paidSubscriptions.forEach((sub) => {
    const date = new Date(sub.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month}`;

    if (!revenueMap.has(key)) {
      revenueMap.set(key, {
        year,
        month,
        revenue: 0,
        date: sub.createdAt,
      });
    }

    const entry = revenueMap.get(key);
    entry.revenue += parseFloat(sub.plan?.price || 0);
    if (new Date(sub.createdAt) < new Date(entry.date)) {
      entry.date = sub.createdAt;
    }
  });

  // Convert to array and format
  const formattedData = Array.from(revenueMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((item) => ({
      month: months[item.month - 1],
      year: item.year,
    revenue: item.revenue,
      date: new Date(item.date).toISOString().split('T')[0],
  }));

  return {
    title: 'Revenue Trend',
    data: formattedData,
  };
};

/**
 * Get practice distribution by subject (for donut chart)
 */
const getPracticeDistribution = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Get all student answers with subjects
    // Filter for non-null subjectId in JavaScript since Prisma doesn't support not: null for nullable fields
    const allStudentAnswers = await prisma.studentAnswer.findMany({
      include: {
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    // Filter out null subjectIds
    const studentAnswers = allStudentAnswers.filter(answer => answer.subjectId !== null);

    // Count by subject
    const subjectCounts = new Map();
    studentAnswers.forEach((answer) => {
      if (answer.subject) {
        const subjectName = answer.subject.name;
        subjectCounts.set(subjectName, (subjectCounts.get(subjectName) || 0) + 1);
      }
    });

    // Calculate total and percentages
    const total = studentAnswers.length || 1;
    const distribution = Array.from(subjectCounts.entries())
      .map(([subject, count]) => ({
        subject,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // Top 5 subjects

    // Assign colors
    const colors = ['#ED4122', '#032746', '#FBBF24', '#9CA3AF', '#60A5FA'];
    return distribution.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error('Error getting practice distribution:', error);
    throw error;
  }
};

/**
 * Get plan distribution for donut chart
 */
const getPlanDistribution = async () => {
  try {
    const { prisma } = require('../../config/db/prisma');
    
    // Get all paid subscriptions with plans
    const subscriptions = await prisma.subscription.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      include: {
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    // Count by plan type
    const planCounts = new Map();
    subscriptions.forEach((sub) => {
      const planName = sub.plan?.name || 'Unknown';
      planCounts.set(planName, (planCounts.get(planName) || 0) + 1);
    });

    // Calculate total and percentages
    const total = subscriptions.length || 1;
    const distribution = Array.from(planCounts.entries())
      .map(([plan, count]) => ({
        plan,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Assign colors - map plan names to colors
    const colorMap = {
      'Basic': '#ED4122',
      'Premium': '#6CA6C1',
      'Enterprise': '#FDF0D5',
      'Organization': '#6CA6C1',
      'Free': '#E5E7EB',
    };

    return distribution.map((item) => ({
      ...item,
      color: colorMap[item.plan] || '#9CA3AF',
    }));
  } catch (error) {
    console.error('Error getting plan distribution:', error);
    throw error;
  }
};

/**
 * Get plan-wise breakdown table
 */
const getPlanWiseBreakdown = async (pagination = {}) => {
  const { page = 1, limit = 3 } = pagination;

  const now = new Date();

  // Get all plans using Prisma
  const { prisma } = require('../../config/db/prisma');
  const plans = await prisma.plan.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  });

  // Get subscription statistics for each plan
  const planBreakdown = await Promise.all(
    plans.map(async (plan) => {
      const totalSubscribers = await prisma.subscription.count({
        where: {
          planId: plan.id,
        },
      });

      const activeSubscriptions = await prisma.subscription.count({
        where: {
          planId: plan.id,
          isActive: true,
          expiryDate: { gte: now },
          paymentStatus: 'Paid',
        },
      });

      const expiredSubscriptions = await prisma.subscription.count({
        where: {
          planId: plan.id,
          OR: [
            { isActive: false },
            { expiryDate: { lt: now } },
          ],
        },
      });

      // Calculate revenue for this plan
      const planSubscriptions = await prisma.subscription.findMany({
        where: {
          planId: plan.id,
            paymentStatus: 'Paid',
          },
        include: {
          plan: {
            select: {
              price: true,
            },
          },
        },
      });

      const revenue = planSubscriptions.reduce((sum, sub) => {
        return sum + (parseFloat(sub.plan?.price || 0));
      }, 0);

      // Calculate average duration (convert duration string to months)
      const durationMap = {
        Monthly: 1,
        Quarterly: 3,
        'Semi-Annual': 6,
        Annual: 12,
      };
      const avgDuration = durationMap[plan.duration] || 1;

      return {
        planType: plan.name,
        subscribers: totalSubscribers,
        active: activeSubscriptions,
        expired: expiredSubscriptions,
        revenue: revenue,
        avgDuration: avgDuration,
      };
    })
  );

  // Sort by subscribers (descending)
  planBreakdown.sort((a, b) => b.subscribers - a.subscribers);

  // Paginate
  const totalItems = planBreakdown.length;
  const skip = (page - 1) * limit;
  const paginatedData = planBreakdown.slice(skip, skip + limit);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    plans: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      showing: {
        from: skip + 1,
        to: Math.min(skip + limit, totalItems),
        total: totalItems,
      },
    },
  };
};

module.exports = {
  generatePassword,
  findUserByEmail,
  findUserByEmailExcludingId,
  createAdminUser,
  getAllAdmins,
  findUserById,
  updateUserStatus,
  updateAdminDetails,
  deleteAdminUser,
  getDashboardStatistics,
  getUserGrowthData,
  getLatestSignups,
  getUserManagementStatistics,
  formatDateDDMMYYYY,
  getAllUserSubscriptions,
  getSubscriptionDetails,
  getPaymentHistory,
  getUserAnalyticsHero,
  getUserGrowthChart,
  getTopPerformanceUsers,
  getSubscriptionTrendMetrics,
  getRevenueTrendChart,
  getPlanWiseBreakdown,
  getPracticeDistribution,
  getPlanDistribution,
};

