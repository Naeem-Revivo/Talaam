const classificationService = require('../../../services/admin/classification');

/**
 * Get classification data (exams, subjects, topics)
 * All admin roles and students can access this
 */
const getClassification = async (req, res, next) => {
  try {
    const { subjectId } = req.query;

    console.log('[CLASSIFICATION] GET /admin/classification → requested', {
      subjectId,
      requestedBy: req.user.id,
    });

    // If subjectId is provided, return subject with its topics
    if (subjectId) {
      const { subject, topics } = await classificationService.getTopicsBySubject(subjectId);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found',
        });
      }

      const response = {
        success: true,
        data: {
          subject: {
            id: subject._id || subject.id,
            name: subject.name,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
          },
          topics: topics.map((topic) => ({
            id: topic._id || topic.id,
            name: topic.name,
            description: topic.description,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
          })),
        },
      };

      console.log('[CLASSIFICATION] GET /admin/classification → 200 (ok)', {
        subjectId: subject._id || subject.id,
        topicsCount: topics.length,
      });
      return res.status(200).json(response);
    }

    // Otherwise, return all classification data
    const { exams, subjects, topics } = await classificationService.getClassification();

    // Group topics by subject for easier frontend use
    const topicsBySubject = {};
    topics.forEach((topic) => {
      const subjectId = (topic.parentSubject._id || topic.parentSubject.id).toString();
      if (!topicsBySubject[subjectId]) {
        topicsBySubject[subjectId] = {
          subject: {
            id: topic.parentSubject._id || topic.parentSubject.id,
            name: topic.parentSubject.name,
          },
          topics: [],
        };
      }
      topicsBySubject[subjectId].topics.push({
        id: topic._id || topic.id,
        name: topic.name,
        description: topic.description,
      });
    });

    const response = {
      success: true,
      message: 'Classification data retrieved successfully',
      data: {
        exams: exams.map((exam) => ({
          id: exam.id,
          name: exam.name,
          status: exam.status,
        })),
        subjects: subjects.map((subject) => ({
          id: subject._id || subject.id,
          name: subject.name,
        })),
        topicsBySubject: Object.values(topicsBySubject),
        // Also include flat list of all topics for backward compatibility
        topics: topics.map((topic) => ({
          id: topic._id || topic.id,
          parentSubject: {
            id: topic.parentSubject._id || topic.parentSubject.id,
            name: topic.parentSubject.name,
          },
          name: topic.name,
          description: topic.description,
        })),
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification → 200 (ok)', {
      examsCount: exams.length,
      subjectsCount: subjects.length,
      topicsCount: topics.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

/**
 * Get all exams for filter dropdowns
 * GET /admin/classification/exams
 */
const getExams = async (req, res, next) => {
  try {
    console.log('[CLASSIFICATION] GET /admin/classification/exams → requested', {
      requestedBy: req.user.id,
    });

    const exams = await classificationService.getAllExams();

    const response = {
      success: true,
      message: 'Exams retrieved successfully',
      data: {
        exams: exams.map((exam) => ({
          id: exam.id,
          name: exam.name,
          status: exam.status,
        })),
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/exams → 200 (ok)', {
      count: exams.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/exams → error', error);
    next(error);
  }
};

/**
 * Get all subjects for filter dropdowns
 * GET /admin/classification/subjects
 */
const getSubjects = async (req, res, next) => {
  try {
    console.log('[CLASSIFICATION] GET /admin/classification/subjects → requested', {
      requestedBy: req.user.id,
    });

    const subjects = await classificationService.getAllSubjects();

    const response = {
      success: true,
      message: 'Subjects retrieved successfully',
      data: {
        subjects: subjects.map((subject) => ({
          id: subject._id || subject.id,
          name: subject.name,
        })),
      },
    };

    console.log('[CLASSIFICATION] GET /admin/classification/subjects → 200 (ok)', {
      count: subjects.length,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/subjects → error', error);
    next(error);
  }
};

/**
 * Get topics by subject ID for filter dropdowns
 * GET /admin/classification/topics?subjectId=...
 */
const getTopics = async (req, res, next) => {
  try {
    const { subjectId } = req.query;

    console.log('[CLASSIFICATION] GET /admin/classification/topics → requested', {
      subjectId,
      requestedBy: req.user.id,
    });

    // If subjectId is provided, return topics for that subject
    if (subjectId) {
      const { subject, topics } = await classificationService.getTopicsBySubject(subjectId);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found',
        });
      }

      const response = {
        success: true,
        message: 'Topics retrieved successfully',
        data: {
          subject: {
            id: subject._id || subject.id,
            name: subject.name,
          },
          topics: topics.map((topic) => ({
            id: topic._id || topic.id,
            name: topic.name,
            description: topic.description,
          })),
        },
      };

      console.log('[CLASSIFICATION] GET /admin/classification/topics → 200 (ok)', {
        subjectId: subject._id || subject.id,
        topicsCount: topics.length,
      });
      return res.status(200).json(response);
    }

    // If no subjectId, return error
    return res.status(400).json({
      success: false,
      message: 'Subject ID is required',
      errors: [
        {
          field: 'subjectId',
          message: 'Subject ID query parameter is required',
        },
      ],
    });
  } catch (error) {
    console.error('[CLASSIFICATION] GET /admin/classification/topics → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

module.exports = {
  getClassification,
  getExams,
  getSubjects,
  getTopics,
};

