// Utility functions for managing session state in localStorage

const SESSION_PREFIX = 'question_session_';

/**
 * Generate a unique session ID based on filters and mode
 */
export const generateSessionId = (mode, filters) => {
  const filterString = JSON.stringify({
    mode,
    ...filters,
    timestamp: Date.now(),
  });
  // Create a hash-like ID from the filter string
  return `${mode}_${btoa(filterString).slice(0, 20)}_${Date.now()}`;
};

/**
 * Get session key for localStorage
 */
const getSessionKey = (sessionId) => {
  return `${SESSION_PREFIX}${sessionId}`;
};

/**
 * Save session state to localStorage
 */
export const saveSessionState = (sessionId, state) => {
  try {
    const sessionData = {
      ...state,
      lastSaved: Date.now(),
    };
    localStorage.setItem(getSessionKey(sessionId), JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session state:', error);
  }
};

/**
 * Load session state from localStorage
 */
export const loadSessionState = (sessionId) => {
  try {
    const sessionData = localStorage.getItem(getSessionKey(sessionId));
    if (sessionData) {
      return JSON.parse(sessionData);
    }
  } catch (error) {
    console.error('Error loading session state:', error);
  }
  return null;
};

/**
 * Find existing session by matching filters
 */
export const findExistingSession = (mode, filters) => {
  try {
    const sessionKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(SESSION_PREFIX)
    );

    for (const key of sessionKeys) {
      const sessionData = JSON.parse(localStorage.getItem(key));
      if (
        sessionData &&
        sessionData.mode === mode &&
        JSON.stringify(sessionData.filters) === JSON.stringify(filters)
      ) {
        // Check if session is recent (within last 24 hours)
        const sessionAge = Date.now() - (sessionData.lastSaved || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (sessionAge < maxAge) {
          // Extract sessionId from key
          const sessionId = key.replace(SESSION_PREFIX, '');
          return { sessionId, state: sessionData };
        }
      }
    }
  } catch (error) {
    console.error('Error finding existing session:', error);
  }
  return null;
};

/**
 * Clear session from localStorage
 */
export const clearSession = (sessionId) => {
  try {
    localStorage.removeItem(getSessionKey(sessionId));
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Clear all expired sessions (older than 24 hours)
 */
export const clearExpiredSessions = () => {
  try {
    const sessionKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(SESSION_PREFIX)
    );
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    sessionKeys.forEach((key) => {
      const sessionData = JSON.parse(localStorage.getItem(key));
      if (sessionData) {
        const sessionAge = Date.now() - (sessionData.lastSaved || 0);
        if (sessionAge >= maxAge) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired sessions:', error);
  }
};
