/**
 * Check if a student/user profile is complete
 * Required fields: name or fullName
 * @param {Object} user - User object from Redux state
 * @returns {boolean} - true if profile is complete, false otherwise
 */
export const isProfileComplete = (user) => {
  if (!user) return false;
  
  // Only check for students/users
  const role = user.role === 'student' ? 'user' : user.role;
  if (role !== 'user' && role !== 'student') {
    // For non-students, always return true (no profile completion required)
    return true;
  }
  
  // Check if required fields are present
  const hasName = !!(user.name || user.fullName);
  
  return hasName;
};

