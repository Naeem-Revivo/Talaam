const adminService = require('../../services/admin');

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
 * Get all admin users
 * Only superadmin can access this
 */
const getAllAdmins = async (req, res, next) => {
  try {
    console.log('[ADMIN] GET /admin/users → requested', { requestedBy: req.user.id });

    // Get all users with admin role
    const admins = await adminService.getAllAdmins();

    const response = {
      success: true,
      data: {
        admins: admins.map((admin) => ({
          id: admin._id,
          name: admin.name,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          adminRole: admin.adminRole,
          status: admin.status,
          isEmailVerified: admin.isEmailVerified,
          createdAt: admin.createdAt,
        })),
      },
    };

    console.log('[ADMIN] GET /admin/users → 200 (ok)', { count: admins.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] GET /admin/users → error', error);
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

module.exports = {
  createAdmin,
  updateUserStatus,
  getAllAdmins,
  updateAdmin,
};

