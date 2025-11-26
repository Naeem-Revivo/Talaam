const express = require('express');
const router = express.Router();

// Student routes
router.use('/questions', require('./question.routes'));

module.exports = router;


