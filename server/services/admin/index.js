const adminService = require('./admin.service');
const examService = require('./exam');
const subjectService = require('./subject');
const topicService = require('./topic');
const questionService = require('./question');
const classificationService = require('./classification');
const planService = require('./plan');

module.exports = {
  ...adminService,
  ...examService,
  ...subjectService,
  ...topicService,
  ...questionService,
  ...classificationService,
  ...planService,
};

