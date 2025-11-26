const Exam = require('../../../models/exam');
const Subject = require('../../../models/subject');
const Topic = require('../../../models/topic');

/**
 * Get all classification data (exams, subjects, topics)
 */
const getClassification = async () => {
  // Get all active exams
  const exams = await Exam.find({ status: 'active' }).sort({ createdAt: -1 });
  
  // Get all subjects
  const subjects = await Subject.find({}).sort({ createdAt: -1 });
  
  // Get all topics with their parent subjects
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
  // Get the subject
  const subject = await Subject.findById(subjectId);
  
  if (!subject) {
    return { subject: null, topics: [] };
  }
  
  // Get all topics for this subject
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
const getAllExams = async () => {
  return await Exam.find({ status: 'active' }).sort({ createdAt: -1 });
};

/**
 * Get all subjects
 */
const getAllSubjects = async () => {
  return await Subject.find({}).sort({ createdAt: -1 });
};

module.exports = {
  getClassification,
  getTopicsBySubject,
  getAllExams,
  getAllSubjects,
};

