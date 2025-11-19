const User = require('../../models/user');

/**
 * Change admin role for a user
 * Only superadmin can change admin roles
 */
const changeAdminRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { adminRole } = req.body;

    console.log('[ADMIN] PUT /admin/role/:userId → requested', {
      userId,
      adminRole,
      requestedBy: req.user.id,
    });

    // Validate adminRole
    const validAdminRoles = ['gatherer', 'creator', 'explainer', 'processor', 'admin'];
    if (!validAdminRoles.includes(adminRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid adminRole. Must be one of: ${validAdminRoles.join(', ')}`,
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User must have admin role to assign adminRole',
      });
    }

    // Update adminRole
    user.adminRole = adminRole;
    await user.save();

    const response = {
      success: true,
      message: 'Admin role updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
        },
      },
    };

    console.log('[ADMIN] PUT /admin/role/:userId → 200 (updated)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ADMIN] PUT /admin/role/:userId → error', error);
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
    const admins = await User.find({ role: 'admin' }).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');

    const response = {
      success: true,
      data: {
        admins: admins.map((admin) => ({
          id: admin._id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          adminRole: admin.adminRole,
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

module.exports = {
  changeAdminRole,
  getAllAdmins,
};

