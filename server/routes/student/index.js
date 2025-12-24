const express = require('express');
const router = express.Router();

// Student routes
router.use('/questions', require('./question.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/topics', require('./topic.routes'));

module.exports = router;


