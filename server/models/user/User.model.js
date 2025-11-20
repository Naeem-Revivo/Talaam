const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [function () { return this.authProvider === 'local'; }, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
    // Profile fields
    fullName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    country: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
      enum: ['English', 'العربية'],
      default: 'English',
    },
    // Role fields
    role: {
      type: String,
      enum: ['superadmin', 'student', 'admin'],
      default: 'student',
    },
    adminRole: {
      type: String,
      default: null,
      validate: {
        validator: function(value) {
          // Allow null/undefined or one of the valid admin roles
          if (value === null || value === undefined) return true;
          return ['gatherer', 'creator', 'explainer', 'processor'].includes(value);
        },
        message: 'adminRole must be one of: gatherer, creator, explainer, processor',
      },
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

