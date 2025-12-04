/**
 * Maps backend auth error/success messages to translation keys
 * This ensures consistent messaging and prevents duplicate errors
 */

const AUTH_MESSAGE_MAP = {
  // Signup messages
  'Account created successfully. OTP sent to your email (optional verification).': {
    key: 'createAccount.success',
    default: 'Account created successfully.'
  },
  'User already exists with this email': {
    key: 'createAccount.errors.userExists',
    default: 'An account with this email already exists.'
  },

  // Login messages
  'Login successful': {
    key: 'login.success',
    default: 'Login successful! Welcome back.'
  },
  'Invalid email or password': {
    key: 'login.errors.invalidCredentials',
    default: 'Invalid email or password. Please check your credentials and try again.'
  },
  'Your account has been suspended. Please contact administrator.': {
    key: 'login.errors.accountSuspended',
    default: 'Your account has been suspended. Please contact administrator.'
  },

  // Verify OTP messages
  'Email verified successfully': {
    key: 'verifyEmail.success',
    default: 'Email verified successfully.'
  },
  'User not found': {
    key: 'verifyEmail.errors.userNotFound',
    default: 'User not found. Please try again.'
  },
  'Email is already verified': {
    key: 'verifyEmail.errors.alreadyVerified',
    default: 'Email is already verified.'
  },
  'OTP not found. Please request a new OTP': {
    key: 'verifyEmail.errors.otpNotFound',
    default: 'OTP not found. Please request a new OTP.'
  },
  'OTP has expired. Please request a new OTP': {
    key: 'verifyEmail.errors.otpExpired',
    default: 'OTP has expired. Please request a new OTP.'
  },
  'Invalid OTP': {
    key: 'verifyEmail.errors.invalidOtp',
    default: 'The verification code is invalid or has expired. Please try again.'
  },

  // Resend OTP messages
  'OTP resent to your email': {
    key: 'verifyEmail.resendSuccess',
    default: 'Verification code has been resent to your email.'
  },
  'Failed to send OTP email. Please try again.': {
    key: 'verifyEmail.errors.emailSendFailed',
    default: 'Failed to send OTP email. Please try again.'
  },

  // Forgot Password messages
  'If an account with that email exists, a reset link was sent.': {
    key: 'forgotPassword.success',
    default: 'If an account exists for that email, a reset link has been sent.'
  },
  'Failed to send reset email.': {
    key: 'forgotPassword.errors.emailSendFailed',
    default: 'Failed to send reset email. Please try again.'
  },

  // Reset Password messages
  'Password reset successfully': {
    key: 'setNewPassword.success',
    default: 'Password reset successfully.'
  },
  'Invalid or expired token': {
    key: 'setNewPassword.errors.invalidToken',
    default: 'Reset link is invalid or expired.'
  },

  // Profile messages
  'Profile completed successfully': {
    key: 'profile.success',
    default: 'Profile completed successfully.'
  },

  // OAuth messages
  'Authentication failed': {
    key: 'login.errors.oauthFailed',
    default: 'Authentication failed. Please try again.'
  },
  'Authentication failed - user not found': {
    key: 'login.errors.oauthUserNotFound',
    default: 'Authentication failed - user not found.'
  },
  'Failed to generate authentication token': {
    key: 'login.errors.tokenGenerationFailed',
    default: 'Failed to generate authentication token. Please try again.'
  },
  'Failed to generate Google auth URL': {
    key: 'login.errors.googleUrlFailed',
    default: 'Unable to start Google login. Please try again.'
  },
  'Failed to generate LinkedIn auth URL': {
    key: 'login.errors.linkedinUrlFailed',
    default: 'Unable to start LinkedIn login. Please try again.'
  }
};

/**
 * Get translation key for a backend message
 * @param {string} message - Backend message
 * @returns {object} Translation key and default message
 */
export const getAuthMessageKey = (message) => {
  if (!message) return null;
  
  // Exact match
  if (AUTH_MESSAGE_MAP[message]) {
    return AUTH_MESSAGE_MAP[message];
  }
  
  // Partial match for common patterns
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('user not found')) {
    return { key: 'auth.errors.userNotFound', default: 'User not found. Please try again.' };
  }
  if (messageLower.includes('already exists') || messageLower.includes('already registered')) {
    return { key: 'createAccount.errors.userExists', default: 'An account with this email already exists.' };
  }
  if (messageLower.includes('invalid') && messageLower.includes('password')) {
    return { key: 'login.errors.invalidCredentials', default: 'Invalid email or password. Please check your credentials and try again.' };
  }
  if (messageLower.includes('suspended')) {
    return { key: 'login.errors.accountSuspended', default: 'Your account has been suspended. Please contact administrator.' };
  }
  if (messageLower.includes('expired') && messageLower.includes('otp')) {
    return { key: 'verifyEmail.errors.otpExpired', default: 'OTP has expired. Please request a new OTP.' };
  }
  if (messageLower.includes('invalid') && messageLower.includes('otp')) {
    return { key: 'verifyEmail.errors.invalidOtp', default: 'The verification code is invalid or has expired. Please try again.' };
  }
  
  // Default fallback
  return null;
};

/**
 * Get translated message or default
 * @param {string} message - Backend message
 * @param {function} t - Translation function
 * @param {string} defaultKey - Default translation key if message not found
 * @returns {string} Translated message
 */
export const getTranslatedAuthMessage = (message, t, defaultKey = null) => {
  if (!message) return null;
  
  const messageKey = getAuthMessageKey(message);
  
  if (messageKey) {
    const translated = t(messageKey.key);
    // If translation exists and is different from key, use it
    if (translated && translated !== messageKey.key) {
      return translated;
    }
    return messageKey.default;
  }
  
  // If defaultKey provided, try to use it
  if (defaultKey) {
    const translated = t(defaultKey);
    if (translated && translated !== defaultKey) {
      return translated;
    }
  }
  
  // Return original message as fallback
  return message;
};

export default AUTH_MESSAGE_MAP;

