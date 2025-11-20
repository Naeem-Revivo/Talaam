const adminService = require('./admin.service');
const examService = require('./exam.service');
const subjectService = require('./subject.service');
const topicService = require('./topic.service');
const questionService = require('./question.service');

module.exports = {
  ...adminService,
  ...examService,
  ...subjectService,
  ...topicService,
  ...questionService,
};

