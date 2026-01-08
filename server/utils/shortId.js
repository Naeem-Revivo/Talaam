const crypto = require('crypto');

/**
 * Generate a unique short ID
 * Uses a combination of timestamp and random characters
 * Format: 8 characters (alphanumeric, case-sensitive)
 */
const generateShortId = () => {
  // Use timestamp (base36) + random bytes for uniqueness
  const timestamp = Date.now().toString(36); // Base36 encoding for shorter string
  const randomBytes = crypto.randomBytes(4).toString('hex'); // 8 hex characters
  
  // Combine and take first 8 characters
  const combined = (timestamp + randomBytes).slice(0, 8);
  
  // Ensure it's exactly 8 characters by padding if needed
  return combined.padEnd(8, crypto.randomBytes(1).toString('hex')[0]);
};

/**
 * Generate a unique short ID and check for uniqueness in the database
 * @param {Function} checkUnique - Function that checks if the ID exists (returns true if exists)
 * @param {number} maxAttempts - Maximum number of attempts to generate unique ID (default: 10)
 * @returns {Promise<string>} Unique short ID
 */
const generateUniqueShortId = async (checkUnique, maxAttempts = 10) => {
  let attempts = 0;
  let shortId;
  
  do {
    shortId = generateShortId();
    attempts++;
    
    if (attempts > maxAttempts) {
      // If we can't generate a unique ID after max attempts, use a longer ID
      shortId = generateShortId() + crypto.randomBytes(2).toString('hex');
    }
    
    const exists = await checkUnique(shortId);
    if (!exists) {
      return shortId;
    }
  } while (attempts <= maxAttempts);
  
  return shortId;
};

module.exports = {
  generateShortId,
  generateUniqueShortId,
};

