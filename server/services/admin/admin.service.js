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
  return await User.findByIdAndDelete(userId);
};

/**
 * Get monthly user growth data for the last 12 months
 * Returns array of objects with month, new user count, and cumulative count
 */
const getUserGrowthData = async () => {
  try {
    // Calculate date range for last 12 months
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 12);
    twelveMonthsAgo.setDate(1); // Start of the month
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get total users before the 12-month period (for cumulative calculation)
    const totalUsersBefore = await User.countDocuments({
      createdAt: { $lt: twelveMonthsAgo },
    });

    // Aggregate users by month for the last 12 months
    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Create a map of all months in the last 12 months with default count 0
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthData = [];
    let cumulativeCount = totalUsersBefore;

    // Fill in the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthName = monthNames[date.getMonth()];

      // Find matching data from aggregation
      const monthData = monthlyData.find(
        (item) => item._id.year === year && item._id.month === month
      );

      const count = monthData ? monthData.count : 0;
      cumulativeCount += count;

      growthData.push({
        month: monthName,
        year: year,
        monthNumber: month,
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
    const latestUsers = await User.find()
      .select('name fullName email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);

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
        id: user._id,
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
 * Get dashboard statistics for superadmin
 * Returns total students, verified email students, active subscriptions, total revenue, user growth data, and latest signups
 */
const getDashboardStatistics = async () => {
  try {
    // Get total students count
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get verified email students count
    const verifiedEmailStudents = await User.countDocuments({
      role: 'student',
      isEmailVerified: true,
    });

    // Get active subscriptions count
    const activeSubscriptions = await Subscription.countDocuments({
      isActive: true,
    });

    // Calculate total revenue from paid subscriptions using aggregation
    const revenueResult = await Subscription.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
        },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $unwind: {
          path: '$plan',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$plan.price',
          },
        },
      },
    ]);

    // Extract total revenue from aggregation result
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get user growth data
    const userGrowthData = await getUserGrowthData();

    // Get latest signups
    const latestSignups = await getLatestSignups(3);

    return {
      totalStudents,
      verifiedEmailStudents,
      activeSubscriptions,
      totalRevenue,
      userGrowthData,
      latestSignups,
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
    // Count users by adminRole
    const totalGatherer = await User.countDocuments({
      role: 'admin',
      adminRole: 'gatherer',
    });

    const totalCreator = await User.countDocuments({
      role: 'admin',
      adminRole: 'creator',
    });

    const totalProcessor = await User.countDocuments({
      role: 'admin',
      adminRole: 'processor',
    });

    const totalExplainer = await User.countDocuments({
      role: 'admin',
      adminRole: 'explainer',
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
  const { planId, status, search } = filters;
  const { page = 1, limit = 10 } = pagination;

  // Build filter query
  const filter = {};

  // Filter by plan
  if (planId) {
    filter.planId = planId;
  }

  // Filter by status (Active, Expire, Pending)
  if (status) {
    if (status === 'Active') {
      filter.isActive = true;
      filter.expiryDate = { $gte: new Date() };
      filter.paymentStatus = 'Paid';
    } else if (status === 'Expire') {
      filter.$or = [
        { isActive: false },
        { expiryDate: { $lt: new Date() } },
      ];
    } else if (status === 'Pending') {
      filter.paymentStatus = 'Pending';
    }
  }

  // Search by user name or email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    const userIds = users.map((u) => u._id);
    if (userIds.length > 0) {
      filter.userId = { $in: userIds };
    } else {
      // If no users found, return empty result
      filter.userId = { $in: [] };
    }
  }

  // Get total count
  const totalItems = await Subscription.countDocuments(filter);

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  // Get subscriptions with pagination
  const subscriptions = await Subscription.find(filter)
    .populate('userId', 'name fullName email')
    .populate('planId', 'name price duration')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    subscriptions,
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
  // Get subscription with populated data
  const subscription = await Subscription.findById(subscriptionId)
    .populate('userId', 'name fullName email')
    .populate('planId', 'name price duration description status')
    .lean();

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  return subscription;
};

/**
 * Get payment history with filtering and pagination
 */
const getPaymentHistory = async (filters = {}, pagination = {}) => {
  const { planId, paymentStatus, startDate, endDate, search } = filters;
  const { page = 1, limit = 10 } = pagination;

  // Build filter query - only show paid subscriptions
  const filter = {
    paymentStatus: 'Paid',
  };

  // Filter by plan
  if (planId) {
    filter.planId = planId;
  }

  // Filter by payment status (for paid subscriptions, we can filter by active/expire/pending)
  if (paymentStatus) {
    if (paymentStatus === 'Active') {
      filter.isActive = true;
      filter.expiryDate = { $gte: new Date() };
    } else if (paymentStatus === 'Expire') {
      filter.$or = [
        { isActive: false },
        { expiryDate: { $lt: new Date() } },
      ];
    } else if (paymentStatus === 'Pending') {
      // Override paymentStatus filter for pending
      filter.paymentStatus = 'Pending';
    }
  }

  // Filter by date range
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  // Search by user name or email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    const userIds = users.map((u) => u._id);
    if (userIds.length > 0) {
      filter.userId = { $in: userIds };
    } else {
      // If no users found, return empty result
      filter.userId = { $in: [] };
    }
  }

  // Get total count
  const totalItems = await Subscription.countDocuments(filter);

  // Calculate pagination
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  // Get subscriptions with pagination
  const subscriptions = await Subscription.find(filter)
    .populate('userId', 'name fullName email')
    .populate('planId', 'name price duration')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    subscriptions,
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
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // 1. New Sign-ups (current month)
  const newSignUpsCurrent = await User.countDocuments({
    role: 'student',
    createdAt: { $gte: currentMonthStart },
  });

  const newSignUpsLast = await User.countDocuments({
    role: 'student',
    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
  });

  const signUpsChange = newSignUpsLast > 0
    ? Math.round(((newSignUpsCurrent - newSignUpsLast) / newSignUpsLast) * 100)
    : 0;

  // 2. Active Users (users who answered questions in current month)
  const activeUsersCurrent = await StudentAnswer.distinct('student', {
    createdAt: { $gte: currentMonthStart },
  });

  const activeUsersLast = await StudentAnswer.distinct('student', {
    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
  });

  const activeUsersCount = activeUsersCurrent.length;
  const activeUsersLastCount = activeUsersLast.length;
  const activeUsersChange = activeUsersLastCount > 0
    ? Math.round(((activeUsersCount - activeUsersLastCount) / activeUsersLastCount) * 100)
    : 0;

  // 3. Most Attempted Subject
  const subjectAttempts = await StudentAnswer.aggregate([
    {
      $match: {
        subject: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  let mostAttemptedSubject = 'N/A';
  if (subjectAttempts.length > 0) {
    const subject = await Subject.findById(subjectAttempts[0]._id);
    if (subject) {
      mostAttemptedSubject = subject.name;
    }
  }

  // 4. Average Time/Question (using default 45s as shown in image, or calculate from timestamps)
  // Since we don't have time tracking, we'll use a calculated average based on test completion times
  const testAnswers = await StudentAnswer.find({
    mode: 'test',
    totalQuestions: { $gt: 0 },
  })
    .select('createdAt updatedAt totalQuestions')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  let averageTimePerQuestion = 45; // Default fallback
  if (testAnswers.length > 0) {
    const totalTime = testAnswers.reduce((sum, test) => {
      const timeDiff = (test.updatedAt - test.createdAt) / 1000; // seconds
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
};

/**
 * Get overall user growth chart data (last 30 days by weeks)
 */
const getUserGrowthChart = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all new users in last 30 days
  const newUsers = await User.find({
    role: 'student',
    createdAt: { $gte: thirtyDaysAgo },
  })
    .select('createdAt')
    .sort({ createdAt: 1 })
    .lean();

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
};

/**
 * Get top performance users table
 */
const getTopPerformanceUsers = async (pagination = {}) => {
  const { page = 1, limit = 5 } = pagination;

  // Aggregate user performance data
  const userPerformance = await StudentAnswer.aggregate([
    {
      $match: {
        student: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: '$student',
        totalAttempts: {
          $sum: {
            $cond: [
              { $eq: ['$mode', 'test'] },
              { $size: { $ifNull: ['$answers', []] } },
              1,
            ],
          },
        },
        correctAnswers: {
          $sum: {
            $cond: [
              { $eq: ['$mode', 'test'] },
              '$correctAnswers',
              { $cond: ['$isCorrect', 1, 0] },
            ],
          },
        },
        totalQuestions: {
          $sum: {
            $cond: [
              { $eq: ['$mode', 'test'] },
              '$totalQuestions',
              1,
            ],
          },
        },
        lastActive: { $max: '$createdAt' },
      },
    },
    {
      $project: {
        student: '$_id',
        attempts: '$totalAttempts',
        accuracy: {
          $cond: [
            { $gt: ['$totalQuestions', 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$correctAnswers', '$totalQuestions'] },
                    100,
                  ],
                },
                0,
              ],
            },
            0,
          ],
        },
        averageTimePerQuestion: 45, // Default value since we don't track time
        lastActive: 1,
      },
    },
    {
      $sort: { attempts: -1, accuracy: -1 },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  // Get total count for pagination
  const totalCount = await StudentAnswer.distinct('student').then((students) => students.length);

  // Populate user details
  const userIds = userPerformance.map((up) => up.student);
  const users = await User.find({ _id: { $in: userIds } })
    .select('name fullName email')
    .lean();

  const userMap = new Map();
  users.forEach((user) => {
    userMap.set(user._id.toString(), user);
  });

  // Format response
  const now = new Date();
  const formattedUsers = userPerformance.map((up, index) => {
    const user = userMap.get(up.student.toString());
    const lastActiveDate = new Date(up.lastActive);
    const daysAgo = Math.floor((now - lastActiveDate) / (1000 * 60 * 60 * 24));

    return {
      rank: (page - 1) * limit + index + 1,
      user: {
        id: up.student,
        name: user ? (user.fullName || user.name || 'N/A') : 'N/A',
        email: user ? user.email : 'N/A',
      },
      attempts: up.attempts,
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
};

/**
 * Get subscription trend metrics
 */
const getSubscriptionTrendMetrics = async () => {
  // Total Subscribers
  const totalSubscribers = await Subscription.countDocuments();

  // Total Revenue (sum of all paid subscriptions)
  const revenueData = await Subscription.aggregate([
    {
      $match: {
        paymentStatus: 'Paid',
      },
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: '$plan',
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$plan.price' },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // Active and Expired subscriptions
  const now = new Date();
  const activeSubscriptions = await Subscription.countDocuments({
    isActive: true,
    expiryDate: { $gte: now },
    paymentStatus: 'Paid',
  });

  const expiredSubscriptions = await Subscription.countDocuments({
    $or: [
      { isActive: false },
      { expiryDate: { $lt: now } },
    ],
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
};

/**
 * Get revenue trend chart data
 */
const getRevenueTrendChart = async () => {
  // Get revenue data grouped by month for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueData = await Subscription.aggregate([
    {
      $match: {
        paymentStatus: 'Paid',
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: '$plan',
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$plan.price' },
        date: { $min: '$createdAt' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  // Format response
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const formattedData = revenueData.map((item) => ({
    month: months[item._id.month - 1],
    year: item._id.year,
    revenue: item.revenue,
    date: item.date.toISOString().split('T')[0],
  }));

  return {
    title: 'Revenue Trend',
    data: formattedData,
  };
};

/**
 * Get plan-wise breakdown table
 */
const getPlanWiseBreakdown = async (pagination = {}) => {
  const { page = 1, limit = 3 } = pagination;

  const now = new Date();

  // Get all plans
  const plans = await Plan.find({ status: 'active' })
    .select('name price duration')
    .lean();

  // Get subscription statistics for each plan
  const planBreakdown = await Promise.all(
    plans.map(async (plan) => {
      const totalSubscribers = await Subscription.countDocuments({
        planId: plan._id,
      });

      const activeSubscriptions = await Subscription.countDocuments({
        planId: plan._id,
        isActive: true,
        expiryDate: { $gte: now },
        paymentStatus: 'Paid',
      });

      const expiredSubscriptions = await Subscription.countDocuments({
        planId: plan._id,
        $or: [
          { isActive: false },
          { expiryDate: { $lt: now } },
        ],
      });

      // Calculate revenue for this plan
      const revenueData = await Subscription.aggregate([
        {
          $match: {
            planId: plan._id,
            paymentStatus: 'Paid',
          },
        },
        {
          $lookup: {
            from: 'plans',
            localField: 'planId',
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $unwind: '$plan',
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$plan.price' },
          },
        },
      ]);

      const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

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
};

