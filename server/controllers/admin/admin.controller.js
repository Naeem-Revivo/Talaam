const adminService = require('../../services/admin');
const subjectService = require('../../services/admin/subject');
const topicService = require('../../services/admin/topic');

/**
 * Create admin user
 * Only superadmin can create admin users
 */
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, status, adminRole } = req.body;

    console.log('[ADMIN] POST /admin/create → requested', {
      name,
      email,
      status,
      adminRole,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create admin users
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create admin users',
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'name',
            message: 'Name is required',
          },
        ],
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'email',
            message: 'Email is required',
          },
        ],
      });
    }

    // Validate status
    if (status && !['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'status',
            message: 'Status must be either active or suspended',
          },
        ],
      });
    }

    // Validate adminRole (workflow role)
    if (!adminRole) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'adminRole',
            message: 'Workflow role is required',
          },
        ],
      });
    }

    const validAdminRoles = ['gatherer', 'creator', 'explainer', 'processor'];
    if (!validAdminRoles.includes(adminRole)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'adminRole',
            message: 'Workflow role must be one of: gatherer, creator, explainer, processor',
          },
        ],
      });
    }

    // Check if user already exists
    const existingUser = await adminService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Generate password if not provided
    const userPassword = password || adminService.generatePassword();

    // Create admin user
    const userData = {
      name: name.trim(),
      fullName: name.trim(),
      email: email.toLowerCase().trim(),
      password: userPassword,
      role: 'admin',
      adminRole: adminRole,
      status: status || 'active',
      isEmailVerified: false,
    };

    const user = await adminService.createAdminUser(userData);

    const response = {
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
        },
        // Include generated password only if it was auto-generated
        ...(password ? {} : { generatedPassword: userPassword }),
      },
    };

    console.log('[ADMIN] POST /admin/create → 201 (created)', { userId: user._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[ADMIN] POST /admin/create → error', error);
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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }
    next(error);
  }
};

/**
 * Update user status
 * Only superadmin can update user status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    console.log('[ADMIN] PUT /admin/status/:userId → requested', {
      userId,
      status,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update user status
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update user status',
      });
    }

    // Validate status
    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'status',
            message: 'Status must be either active or suspended',
          },
        ],
      });
    }

    // Find the user
    const user = await adminService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update status
    await adminService.updateUserStatus(user, status);

    const response = {
      success: true,
      message: `User status updated to ${status} successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          status: user.status,
        },
      },
    };

    console.log('[ADMIN] PUT /admin/status/:userId → 200 (updated)', { userId: user._id, status });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] PUT /admin/status/:userId → error', error);
    next(error);
  }
};

/**
 * Get all admin users with filtering and pagination
 * Only superadmin can access this
 */
const getAllAdmins = async (req, res, next) => {
  try {
    const { page, limit, status, adminRole, search } = req.query;

    console.log('[ADMIN] GET /admin/users → requested', {
      requestedBy: req.user.id,
      page,
      limit,
      status,
      adminRole,
      search,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view all admin users',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Build filters
    const filters = {
      status,
      adminRole,
      search,
    };

    // Build pagination
    const pagination = {
      page: pageNum,
      limit: limitNum,
    };

    // Get paginated admin users
    const result = await adminService.getAllAdmins(filters, pagination);

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    
    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (result.filters.status) queryParams.append('status', result.filters.status);
      if (result.filters.adminRole) queryParams.append('adminRole', result.filters.adminRole);
      if (result.filters.search) queryParams.append('search', result.filters.search);
      
      // Add pagination
      queryParams.append('page', pageNum);
      queryParams.append('limit', limitNum);
      
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pageNum + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pageNum - 1) : null,
      current: buildUrl(pageNum),
    };

    const response = {
      success: true,
      message: 'Admin users retrieved successfully',
      data: {
        admins: result.admins.map((admin) => ({
          id: admin._id,
          username: admin.fullName || admin.name || 'N/A',
          email: admin.email,
          workflowRole: admin.adminRole || null,
          status: admin.status,
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: result.filters,
      },
    };

    console.log('[ADMIN] GET /admin/users → 200 (ok)', {
      count: result.admins.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] GET /admin/users → error', error);
    next(error);
  }
};

/**
 * Get dashboard statistics
 * Only superadmin can access this
 */
const getDashboardStatistics = async (req, res, next) => {
  try {
    console.log('[ADMIN] GET /admin/dashboard/statistics → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access dashboard statistics',
      });
    }

    // Get dashboard statistics
    const statistics = await adminService.getDashboardStatistics();

    const response = {
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        statistics: {
          totalStudents: statistics.totalStudents,
          verifiedEmailStudents: statistics.verifiedEmailStudents,
          activeSubscriptions: statistics.activeSubscriptions,
          totalRevenue: statistics.totalRevenue,
        },
        userGrowthData: statistics.userGrowthData,
        latestSignups: statistics.latestSignups,
      },
    };

    console.log('[ADMIN] GET /admin/dashboard/statistics → 200 (ok)', {
      totalStudents: statistics.totalStudents,
      verifiedEmailStudents: statistics.verifiedEmailStudents,
      activeSubscriptions: statistics.activeSubscriptions,
      totalRevenue: statistics.totalRevenue,
      growthDataPoints: statistics.userGrowthData.length,
      latestSignupsCount: statistics.latestSignups.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] GET /admin/dashboard/statistics → error', error);
    next(error);
  }
};

/**
 * Update admin user details
 * Only superadmin can update admin users
 */
const updateAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, status, adminRole } = req.body;

    console.log('[ADMIN] PUT /admin/:userId → requested', {
      userId,
      name,
      email,
      status,
      adminRole,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update admin users',
      });
    }

    const user = await adminService.findUserById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    if (email && email !== user.email) {
      const existingUser = await adminService.findUserByEmailExcludingId(email, userId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Another user already exists with this email',
        });
      }
    }

    const updatedUser = await adminService.updateAdminDetails(user, {
      name,
      email,
      status,
      adminRole,
    });

    const response = {
      success: true,
      message: 'Admin user updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          adminRole: updatedUser.adminRole,
          status: updatedUser.status,
          isEmailVerified: updatedUser.isEmailVerified,
        },
      },
    };

    console.log('[ADMIN] PUT /admin/:userId → 200 (updated)', { userId: updatedUser._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] PUT /admin/:userId → error', error);
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
 * Get user management statistics
 * Only superadmin can access this
 */
const getUserManagementStatistics = async (req, res, next) => {
  try {
    console.log('[ADMIN] GET /admin/users/management → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access user management statistics',
      });
    }

    // Get user management statistics
    const statistics = await adminService.getUserManagementStatistics();

    const response = {
      success: true,
      message: 'User management statistics retrieved successfully',
      data: {
        statistics: {
          totalGatherer: statistics.totalGatherer,
          totalCreator: statistics.totalCreator,
          totalProcessor: statistics.totalProcessor,
          totalExplainer: statistics.totalExplainer,
        },
      },
    };

    console.log('[ADMIN] GET /admin/users/management → 200 (ok)', {
      totalGatherer: statistics.totalGatherer,
      totalCreator: statistics.totalCreator,
      totalProcessor: statistics.totalProcessor,
      totalExplainer: statistics.totalExplainer,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] GET /admin/users/management → error', error);
    next(error);
  }
};

/**
 * Delete admin user
 * Only superadmin can delete admin users
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    console.log('[ADMIN] DELETE /admin/:userId → requested', {
      userId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete admin users
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete admin users',
      });
    }

    // Find the user
    const user = await adminService.findUserById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    // Prevent superadmin from deleting themselves
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    // Delete the user
    await adminService.deleteAdminUser(userId);

    const response = {
      success: true,
      message: 'Admin user deleted successfully',
      data: {
        deletedUser: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
        },
      },
    };

    console.log('[ADMIN] DELETE /admin/:userId → 200 (deleted)', { userId: user._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] DELETE /admin/:userId → error', error);
    next(error);
  }
};

/**
 * Get classification statistics (total subjects and topics)
 * Only superadmin can access this
 */
const getClassificationStatistics = async (req, res, next) => {
  try {
    console.log('[CLASSIFICATION] GET /admin/classification/statistics → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access classification statistics',
      });
    }

    // Get counts
    const totalSubjects = await subjectService.getSubjectsCount();
    const totalTopics = await topicService.getTopicsCount();

    const response = {
      success: true,
      message: 'Classification statistics retrieved successfully',
      data: {
        statistics: {
          totalSubjects,
          totalTopics,
        },
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/statistics → 200 (ok)', {
      totalSubjects,
      totalTopics,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/statistics → error', error);
    next(error);
  }
};

/**
 * Get paginated subjects with search
 * Only superadmin can access this
 */
const getSubjectsPaginated = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    console.log('[CLASSIFICATION] GET /admin/classification/subjects → requested', {
      requestedBy: req.user.id,
      page,
      limit,
      search,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access subjects',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Build filters
    const filters = {
      search: search || null,
    };

    // Build pagination
    const pagination = {
      page: pageNum,
      limit: limitNum,
    };

    // Get paginated subjects
    const result = await subjectService.getSubjectsPaginated(filters, pagination);

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    
    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (result.filters.search) queryParams.append('search', result.filters.search);
      
      // Add pagination
      queryParams.append('page', pageNum);
      queryParams.append('limit', limitNum);
      
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pageNum + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pageNum - 1) : null,
      current: buildUrl(pageNum),
    };

    const response = {
      success: true,
      message: 'Subjects retrieved successfully',
      data: {
        subjects: result.subjects.map((subject) => ({
          id: subject._id,
          name: subject.name,
          description: subject.description || '',
          date: subject.createdAt.toISOString().split('T')[0],
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: result.filters,
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/subjects → 200 (ok)', {
      count: result.subjects.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/subjects → error', error);
    next(error);
  }
};

/**
 * Get paginated topics with search
 * Only superadmin can access this
 */
const getTopicsPaginated = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    console.log('[CLASSIFICATION] GET /admin/classification/topics → requested', {
      requestedBy: req.user.id,
      page,
      limit,
      search,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access topics',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Build filters
    const filters = {
      search: search || null,
    };

    // Build pagination
    const pagination = {
      page: pageNum,
      limit: limitNum,
    };

    // Get paginated topics
    const result = await topicService.getTopicsPaginated(filters, pagination);

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    
    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (result.filters.search) queryParams.append('search', result.filters.search);
      
      // Add pagination
      queryParams.append('page', pageNum);
      queryParams.append('limit', limitNum);
      
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pageNum + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pageNum - 1) : null,
      current: buildUrl(pageNum),
    };

    const response = {
      success: true,
      message: 'Topics retrieved successfully',
      data: {
        topics: result.topics.map((topic) => ({
          id: topic._id,
          name: topic.name,
          description: topic.description || '',
          subject: topic.parentSubject ? {
            id: topic.parentSubject._id,
            name: topic.parentSubject.name,
          } : null,
          date: topic.createdAt.toISOString().split('T')[0],
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: result.filters,
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/topics → 200 (ok)', {
      count: result.topics.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/topics → error', error);
    next(error);
  }
};

/**
 * Get topics by subject ID with search (for modal)
 * Only superadmin can access this
 */
const getTopicsBySubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { search } = req.query;

    console.log('[CLASSIFICATION] GET /admin/classification/subjects/:subjectId/topics → requested', {
      subjectId,
      search,
      requestedBy: req.user.id,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access topics',
      });
    }

    // Validate subjectId
    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID is required',
      });
    }

    // Check if subject exists
    const subject = await subjectService.findSubjectById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Get topics by subject with optional search
    const topics = await topicService.findTopicsByParentSubject(subjectId, search);

    const response = {
      success: true,
      message: 'Topics retrieved successfully',
      data: {
        subject: {
          id: subject._id,
          name: subject.name,
        },
        topics: topics.map((topic) => ({
          id: topic._id,
          name: topic.name,
          description: topic.description || '',
          date: topic.createdAt.toISOString().split('T')[0],
        })),
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/subjects/:subjectId/topics → 200 (ok)', {
      subjectId: subject._id,
      topicsCount: topics.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/subjects/:subjectId/topics → error', error);
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
 * Create subject
 * Only superadmin can create subjects
 */
const createSubject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    console.log('[CLASSIFICATION] POST /admin/classification/subjects → requested', {
      name,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create subjects',
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'name',
            message: 'Subject name is required',
          },
        ],
      });
    }

    // Create subject
    const subjectData = {
      name: name.trim(),
      description: description ? description.trim() : '',
    };

    const subject = await subjectService.createSubject(subjectData);

    const response = {
      success: true,
      message: 'Subject created successfully',
      data: {
        subject: {
          id: subject._id,
          name: subject.name,
          description: subject.description || '',
          date: subject.createdAt.toISOString().split('T')[0],
        },
      },
    };

    console.log('[CLASSIFICATION] POST /admin/classification/subjects → 201 (created)', { subjectId: subject._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] POST /admin/classification/subjects → error', error);
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
 * Update subject
 * Only superadmin can update subjects
 */
const updateSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name, description } = req.body;

    console.log('[CLASSIFICATION] PUT /admin/classification/subjects/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update subjects',
      });
    }

    const subject = await subjectService.findSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Update subject
    const updateData = {};
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'name',
              message: 'Subject name cannot be empty',
            },
          ],
        });
      }
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }

    const updatedSubject = await subjectService.updateSubject(subject, updateData);

    const response = {
      success: true,
      message: 'Subject updated successfully',
      data: {
        subject: {
          id: updatedSubject._id,
          name: updatedSubject.name,
          description: updatedSubject.description || '',
          date: updatedSubject.createdAt.toISOString().split('T')[0],
        },
      },
    };

    console.log('[CLASSIFICATION] PUT /admin/classification/subjects/:subjectId → 200 (updated)', { subjectId: subject._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] PUT /admin/classification/subjects/:subjectId → error', error);
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
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

/**
 * Delete subject
 * Only superadmin can delete subjects
 */
const deleteSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    console.log('[CLASSIFICATION] DELETE /admin/classification/subjects/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete subjects',
      });
    }

    const subject = await subjectService.findSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    await subjectService.deleteSubject(subjectId);

    const response = {
      success: true,
      message: 'Subject deleted successfully',
      data: {
        subject: {
          id: subject._id,
          name: subject.name,
        },
      },
    };

    console.log('[CLASSIFICATION] DELETE /admin/classification/subjects/:subjectId → 200 (deleted)', { subjectId: subject._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] DELETE /admin/classification/subjects/:subjectId → error', error);
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
 * Create topic
 * Only superadmin can create topics
 */
const createTopic = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name, description } = req.body;

    console.log('[CLASSIFICATION] POST /admin/classification/subjects/:subjectId/topics → requested', {
      subjectId,
      name,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create topics',
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'name',
            message: 'Topic name is required',
          },
        ],
      });
    }

    // Check if parent subject exists
    const subject = await subjectService.findSubjectById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Parent subject not found',
      });
    }

    // Create topic
    const topicData = {
      parentSubject: subjectId,
      name: name.trim(),
      description: description ? description.trim() : '',
    };

    const topic = await topicService.createTopic(topicData);
    await topic.populate('parentSubject', 'name');

    const response = {
      success: true,
      message: 'Topic created successfully',
      data: {
        topic: {
          id: topic._id,
          name: topic.name,
          description: topic.description || '',
          date: topic.createdAt.toISOString().split('T')[0],
        },
      },
    };

    console.log('[CLASSIFICATION] POST /admin/classification/subjects/:subjectId/topics → 201 (created)', { topicId: topic._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] POST /admin/classification/subjects/:subjectId/topics → error', error);
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
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

/**
 * Update topic
 * Only superadmin can update topics
 */
const updateTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { name, description } = req.body;

    console.log('[CLASSIFICATION] PUT /admin/classification/topics/:topicId → requested', {
      topicId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update topics',
      });
    }

    const topic = await topicService.findTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    // Update topic
    const updateData = {};
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'name',
              message: 'Topic name cannot be empty',
            },
          ],
        });
      }
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }

    const updatedTopic = await topicService.updateTopic(topic, updateData);
    await updatedTopic.populate('parentSubject', 'name');

    const response = {
      success: true,
      message: 'Topic updated successfully',
      data: {
        topic: {
          id: updatedTopic._id,
          name: updatedTopic.name,
          description: updatedTopic.description || '',
          date: updatedTopic.createdAt.toISOString().split('T')[0],
        },
      },
    };

    console.log('[CLASSIFICATION] PUT /admin/classification/topics/:topicId → 200 (updated)', { topicId: updatedTopic._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] PUT /admin/classification/topics/:topicId → error', error);
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
        message: 'Invalid topic ID',
      });
    }
    next(error);
  }
};

/**
 * Delete topic
 * Only superadmin can delete topics
 */
const deleteTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    console.log('[CLASSIFICATION] DELETE /admin/classification/topics/:topicId → requested', {
      topicId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete topics',
      });
    }

    const topic = await topicService.findTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    await topicService.deleteTopic(topicId);

    const response = {
      success: true,
      message: 'Topic deleted successfully',
      data: {
        topic: {
          id: topic._id,
          name: topic.name,
        },
      },
    };

    console.log('[CLASSIFICATION] DELETE /admin/classification/topics/:topicId → 200 (deleted)', { topicId: topic._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] DELETE /admin/classification/topics/:topicId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid topic ID',
      });
    }
    next(error);
  }
};

/**
 * Get all user subscriptions with filtering and pagination
 * Only superadmin can access this
 */
const getAllUserSubscriptions = async (req, res, next) => {
  try {
    const { page, limit, planId, status, search } = req.query;

    console.log('[SUBSCRIPTION] GET /admin/subscriptions → requested', {
      requestedBy: req.user.id,
      page,
      limit,
      planId,
      status,
      search,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view user subscriptions',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Get subscriptions from service
    const result = await adminService.getAllUserSubscriptions(
      { planId, status, search },
      { page: pageNum, limit: limitNum }
    );

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      if (planId) queryParams.append('planId', planId);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);
      queryParams.append('page', pageNum);
      queryParams.append('limit', limitNum);
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pageNum + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pageNum - 1) : null,
      current: buildUrl(pageNum),
    };

    const response = {
      success: true,
      message: 'User subscriptions retrieved successfully',
      data: {
        subscriptions: result.subscriptions.map((sub) => ({
          id: sub._id,
          user: {
            id: sub.userId._id,
            name: sub.userId.fullName || sub.userId.name || 'N/A',
            email: sub.userId.email,
          },
          plan: {
            id: sub.planId._id,
            name: sub.planName || sub.planId.name,
          },
          startDate: adminService.formatDateDDMMYYYY(sub.startDate),
          expiryDate: adminService.formatDateDDMMYYYY(sub.expiryDate),
          paymentStatus: sub.paymentStatus,
          isActive: sub.isActive,
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: result.filters,
      },
    };

    console.log('[SUBSCRIPTION] GET /admin/subscriptions → 200 (ok)', {
      count: result.subscriptions.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBSCRIPTION] GET /admin/subscriptions → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }
    next(error);
  }
};

/**
 * Get subscription details by ID
 * Only superadmin can access this
 */
const getSubscriptionDetails = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    console.log('[SUBSCRIPTION] GET /admin/subscriptions/:subscriptionId → requested', {
      subscriptionId,
      requestedBy: req.user.id,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view subscription details',
      });
    }

    // Get subscription from service
    const subscription = await adminService.getSubscriptionDetails(subscriptionId);

    // Format dates
    const formatDate = (date) => {
      const d = new Date(date);
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    // Calculate renewal date (same as expiry date for now)
    const renewalDate = formatDate(subscription.expiryDate);

    // Get last payment date (if payment is confirmed)
    let lastPayment = null;
    if (subscription.paymentStatus === 'Paid' && subscription.transactionId) {
      lastPayment = `${formatDate(subscription.startDate)}`;
    }

    const response = {
      success: true,
      message: 'Subscription details retrieved successfully',
      data: {
        subscription: {
          id: subscription._id,
          userInfo: {
            name: subscription.userId.fullName || subscription.userId.name || 'N/A',
            email: subscription.userId.email,
          },
          planInfo: {
            currentPlan: subscription.planName || subscription.planId.name,
            duration: subscription.planId.duration,
            renewalDate: renewalDate,
            status: subscription.isActive && new Date(subscription.expiryDate) >= new Date() ? 'Active' : 'Inactive',
          },
          billingInfo: {
            lastPayment: lastPayment
              ? `$${subscription.planId.price.toFixed(2)} ${lastPayment}`
              : null,
            nextDueDate: renewalDate,
            paymentMethod: subscription.transactionId
              ? `Visa ending in ${subscription.transactionId.slice(-4)}`
              : 'Not set',
          },
          subscriptionDetails: {
            startDate: subscription.startDate.toISOString().split('T')[0],
            expiryDate: subscription.expiryDate.toISOString().split('T')[0],
            paymentStatus: subscription.paymentStatus,
            isActive: subscription.isActive,
            transactionId: subscription.transactionId,
          },
        },
      },
    };

    console.log('[SUBSCRIPTION] GET /admin/subscriptions/:subscriptionId → 200 (ok)', {
      subscriptionId: subscription._id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBSCRIPTION] GET /admin/subscriptions/:subscriptionId → error', error);
    if (error.message === 'Subscription not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID',
      });
    }
    next(error);
  }
};

/**
 * Get payment history with filtering and pagination
 * Only superadmin can access this
 */
const getPaymentHistory = async (req, res, next) => {
  try {
    const { page, limit, planId, paymentStatus, startDate, endDate, search } = req.query;

    console.log('[PAYMENT] GET /admin/payments/history → requested', {
      requestedBy: req.user.id,
      page,
      limit,
      planId,
      paymentStatus,
      startDate,
      endDate,
      search,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view payment history',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Get payment history from service
    const result = await adminService.getPaymentHistory(
      { planId, paymentStatus, startDate, endDate, search },
      { page: pageNum, limit: limitNum }
    );

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    // Helper function to build URL with query params
    const buildUrl = (pageNum) => {
      const queryParams = new URLSearchParams();
      if (planId) queryParams.append('planId', planId);
      if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (search) queryParams.append('search', search);
      queryParams.append('page', pageNum);
      queryParams.append('limit', limitNum);
      return `${baseUrl}?${queryParams.toString()}`;
    };

    // Build pagination URLs
    const paginationUrls = {
      first: buildUrl(1),
      last: buildUrl(result.pagination.totalPages),
      next: result.pagination.hasNextPage ? buildUrl(pageNum + 1) : null,
      previous: result.pagination.hasPreviousPage ? buildUrl(pageNum - 1) : null,
      current: buildUrl(pageNum),
    };

    // Generate invoice IDs (format: Inv-XXX)
    const generateInvoiceId = (index, total) => {
      const num = total - (pageNum - 1) * limitNum - index;
      return `Inv-${String(num).padStart(3, '0')}`;
    };

    const response = {
      success: true,
      message: 'Payment history retrieved successfully',
      data: {
        payments: result.subscriptions.map((sub, index) => ({
          invoiceId: generateInvoiceId(index, result.pagination.totalItems),
          user: {
            id: sub.userId._id,
            name: sub.userId.fullName || sub.userId.name || 'N/A',
            email: sub.userId.email,
          },
          plan: {
            id: sub.planId._id,
            name: sub.planName || sub.planId.name,
          },
          amount: sub.planId.price.toFixed(2),
          date: adminService.formatDateDDMMYYYY(sub.createdAt),
          paymentMethod: sub.transactionId ? 'Credit Card' : 'Paypal',
          status: sub.paymentStatus,
        })),
        pagination: {
          ...result.pagination,
          urls: paginationUrls,
        },
        filters: result.filters,
      },
    };

    console.log('[PAYMENT] GET /admin/payments/history → 200 (ok)', {
      count: result.subscriptions.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      totalPages: result.pagination.totalPages,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PAYMENT] GET /admin/payments/history → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID or date format',
      });
    }
    next(error);
  }
};

/**
 * Get user analytics hero page metrics
 * Only superadmin can access this
 */
const getUserAnalyticsHero = async (req, res, next) => {
  try {
    console.log('[ANALYTICS] GET /admin/analytics/user/hero → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access user analytics',
      });
    }

    const analytics = await adminService.getUserAnalyticsHero();

    const response = {
      success: true,
      message: 'User analytics hero metrics retrieved successfully',
      data: {
        newSignUps: analytics.newSignUps,
        activeUsers: analytics.activeUsers,
        mostAttemptedSubject: analytics.mostAttemptedSubject,
        averageTimePerQuestion: `${analytics.averageTimePerQuestion}s`,
      },
    };

    console.log('[ANALYTICS] GET /admin/analytics/user/hero → 200 (ok)');
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/user/hero → error', error);
    next(error);
  }
};

/**
 * Get overall user growth chart data (last 30 days by weeks)
 * Only superadmin can access this
 */
const getUserGrowthChart = async (req, res, next) => {
  try {
    console.log('[ANALYTICS] GET /admin/analytics/user/growth → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access user growth data',
      });
    }

    const growthData = await adminService.getUserGrowthChart();

    const response = {
      success: true,
      message: 'User growth chart data retrieved successfully',
      data: growthData,
    };

    console.log('[ANALYTICS] GET /admin/analytics/user/growth → 200 (ok)', {
      weeks: growthData.weeks.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/user/growth → error', error);
    next(error);
  }
};

/**
 * Get top performance users table
 * Only superadmin can access this
 */
const getTopPerformanceUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    console.log('[ANALYTICS] GET /admin/analytics/user/performance → requested', {
      requestedBy: req.user.id,
      page,
      limit,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access top performance data',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    // Get top performance users from service
    const result = await adminService.getTopPerformanceUsers({ page: pageNum, limit: limitNum });

    // Format lastActive
    const now = new Date();
    const formattedUsers = result.users.map((user) => ({
      ...user,
      accuracy: `${user.accuracy}%`,
      averageTimePerQuestion: `${user.averageTimePerQuestion}`,
      lastActive: user.lastActive === 0 ? 'Today' : `${user.lastActive} day${user.lastActive > 1 ? 's' : ''} ago`,
    }));

    const response = {
      success: true,
      message: 'Top performance users retrieved successfully',
      data: {
        users: formattedUsers,
        pagination: result.pagination,
      },
    };

    console.log('[ANALYTICS] GET /admin/analytics/user/performance → 200 (ok)', {
      count: formattedUsers.length,
      totalItems: totalCount,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/user/performance → error', error);
    next(error);
  }
};

/**
 * Get subscription trend metrics
 * Only superadmin can access this
 */
const getSubscriptionTrendMetrics = async (req, res, next) => {
  try {
    console.log('[ANALYTICS] GET /admin/analytics/subscription/trend → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access subscription analytics',
      });
    }

    const metrics = await adminService.getSubscriptionTrendMetrics();

    const response = {
      success: true,
      message: 'Subscription trend metrics retrieved successfully',
      data: {
        totalSubscribers: metrics.totalSubscribers,
        totalRevenue: metrics.totalRevenue.toFixed(2),
        renewalRate: `${metrics.renewalRate}%`,
        churnRate: `${metrics.churnRate}%`,
      },
    };

    console.log('[ANALYTICS] GET /admin/analytics/subscription/trend → 200 (ok)');
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/subscription/trend → error', error);
    next(error);
  }
};

/**
 * Get revenue trend chart data
 * Only superadmin can access this
 */
const getRevenueTrendChart = async (req, res, next) => {
  try {
    console.log('[ANALYTICS] GET /admin/analytics/subscription/revenue-trend → requested', {
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access revenue trend data',
      });
    }

    const chartData = await adminService.getRevenueTrendChart();

    const formattedData = chartData.data.map((item) => ({
      ...item,
      revenue: item.revenue.toFixed(2),
    }));

    const response = {
      success: true,
      message: 'Revenue trend chart data retrieved successfully',
      data: {
        title: chartData.title,
        data: formattedData,
      },
    };

    console.log('[ANALYTICS] GET /admin/analytics/subscription/revenue-trend → 200 (ok)', {
      dataPoints: formattedData.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/subscription/revenue-trend → error', error);
    next(error);
  }
};

/**
 * Get plan-wise breakdown table
 * Only superadmin can access this
 */
const getPlanWiseBreakdown = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    console.log('[ANALYTICS] GET /admin/analytics/subscription/plan-breakdown → requested', {
      requestedBy: req.user.id,
      page,
      limit,
    });

    // Ensure only superadmin can access this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access plan breakdown data',
      });
    }

    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 3;

    // Validate pagination
    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    const result = await adminService.getPlanWiseBreakdown({ page: pageNum, limit: limitNum });

    // Format revenue and avgDuration
    const formattedPlans = result.plans.map((plan) => ({
      ...plan,
      revenue: plan.revenue.toFixed(2),
      avgDuration: `${plan.avgDuration} month${plan.avgDuration > 1 ? 's' : ''}`,
    }));

    const response = {
      success: true,
      message: 'Plan-wise breakdown retrieved successfully',
      data: {
        plans: formattedPlans,
        pagination: result.pagination,
      },
    };

    console.log('[ANALYTICS] GET /admin/analytics/subscription/plan-breakdown → 200 (ok)', {
      count: formattedPlans.length,
      totalItems: result.pagination.totalItems,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYTICS] GET /admin/analytics/subscription/plan-breakdown → error', error);
    next(error);
  }
};

module.exports = {
  createAdmin,
  updateUserStatus,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getDashboardStatistics,
  getUserManagementStatistics,
  getClassificationStatistics,
  getSubjectsPaginated,
  getTopicsPaginated,
  getTopicsBySubject,
  createSubject,
  updateSubject,
  deleteSubject,
  createTopic,
  updateTopic,
  deleteTopic,
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

