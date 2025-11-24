const { body } = require('express-validator');

// Validation middleware for profile
const validateProfile = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('dateOfBirth')
    .optional()
    .custom((value) => {
      if (!value) return true;
      // Check if it's a valid date format (DD/MM/YYYY or ISO date)
      if (typeof value === 'string') {
        const dateParts = value.split('/');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[2], 10);
          if (
            isNaN(day) ||
            isNaN(month) ||
            isNaN(year) ||
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1900 ||
            year > new Date().getFullYear()
          ) {
            throw new Error('Invalid date format. Use DD/MM/YYYY');
          }
        }
      }
      return true;
    }),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  body('timezone').optional().trim().notEmpty().withMessage('Timezone cannot be empty'),
  body('language')
    .optional()
    .isIn(['English', 'العربية'])
    .withMessage('Language must be either English or العربية'),
];

module.exports = {
  validateProfile,
};

