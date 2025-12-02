const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');

/**
 * Get all classification data (exams, subjects, topics)
 */
const getClassification = async () => {
  // Get all active exams using Prisma
  const exams = await Exam.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });
  
  // Get all subjects using Prisma
  const subjects = await Subject.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  // Get all topics with their parent subjects (assuming Topic uses Mongoose - keep as is for now)
  const topics = await Topic.find({}).populate('parentSubject', 'name').sort({ createdAt: -1 });
  
  return {
    exams,
    subjects,
    topics,
  };
};

/**
 * Get topics by subject ID along with subject details
 */
const getTopicsBySubject = async (subjectId) => {
  // Get the subject using Prisma
  const subject = await Subject.findById(subjectId);
  
  if (!subject) {
    return { subject: null, topics: [] };
  }
  
  // Get all topics for this subject (assuming Topic uses Mongoose - keep as is for now)
  const topics = await Topic.find({ parentSubject: subjectId })
    .sort({ createdAt: -1 });
  
  return {
    subject,
    topics,
  };
};

/**
 * Get all exams
 */
const getAllExams = async (filter = {}) => {
  return await Exam.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get all subjects
 */
const getAllSubjects = async () => {
  return await Subject.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  getClassification,
  getTopicsBySubject,
  getAllExams,
  getAllSubjects,
};

