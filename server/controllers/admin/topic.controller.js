const topicService = require('../../services/admin');

/**
 * Create topic
 * Only superadmin can create topics
 */
const createTopic = async (req, res, next) => {
  try {
    const { parentSubject, name, description } = req.body;

    console.log('[TOPIC] POST /admin/topics → requested', {
      parentSubject,
      name,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create topics',
      });
    }

    // Validate required fields
    if (!parentSubject || !parentSubject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'parentSubject',
            message: 'Parent subject is required',
          },
        ],
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'name',
            message: 'Topic name is required',
          },
        ],
      });
    }

    // Check if parent subject exists
    const subject = await topicService.findSubjectById(parentSubject);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Parent subject not found',
      });
    }

    // Create topic
    const topicData = {
      parentSubject: parentSubject.trim(),
      name: name.trim(),
      description: description ? description.trim() : '',
    };

    const topic = await topicService.createTopic(topicData);

    const response = {
      success: true,
      message: 'Topic created successfully',
      data: {
        topic: {
          id: topic.id || topic._id,
          parentSubject: topic.subject ? {
            id: topic.subject.id || topic.subject._id,
            name: topic.subject.name,
          } : null,
          name: topic.name,
          description: topic.description,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
      },
    };

    console.log('[TOPIC] POST /admin/topics → 201 (created)', { topicId: topic.id || topic._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[TOPIC] POST /admin/topics → error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    next(error);
  }
};

/**
 * Get all topics
 * All admin roles and students can access this
 */
const getAllTopics = async (req, res, next) => {
  try {
    console.log('[TOPIC] GET /admin/topics → requested', { requestedBy: req.user.id });

    // Optional query parameter for filtering by parent subject
    const { parentSubject } = req.query;
    const filter = {};

    if (parentSubject) {
      filter.parentSubject = parentSubject;
    }

    const topics = await topicService.getAllTopics(filter);

    const response = {
      success: true,
      data: {
        topics: topics.map((topic) => ({
          id: topic.id || topic._id,
          parentSubject: topic.subject ? {
            id: topic.subject.id || topic.subject._id,
            name: topic.subject.name,
          } : null,
          name: topic.name,
          description: topic.description,
          count: topic.questionCount || 0, // Include question count
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        })),
      },
    };

    console.log('[TOPIC] GET /admin/topics → 200 (ok)', { count: topics.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[TOPIC] GET /admin/topics → error', error);
    next(error);
  }
};

/**
 * Get single topic by ID
 * All admin roles and students can access this
 */
const getTopicById = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    console.log('[TOPIC] GET /admin/topics/:topicId → requested', {
      topicId,
      requestedBy: req.user.id,
    });

    const topic = await topicService.findTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    const response = {
      success: true,
      data: {
        topic: {
          id: topic.id || topic._id,
          parentSubject: topic.subject ? {
            id: topic.subject.id || topic.subject._id,
            name: topic.subject.name,
          } : null,
          name: topic.name,
          description: topic.description,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
      },
    };

    console.log('[TOPIC] GET /admin/topics/:topicId → 200 (ok)', { topicId: topic.id || topic._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[TOPIC] GET /admin/topics/:topicId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid topic ID',
      });
    }
    next(error);
  }
};

/**
 * Update topic
 * Only superadmin can update topics
 */
const updateTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const { parentSubject, name, description } = req.body;

    console.log('[TOPIC] PUT /admin/topics/:topicId → requested', {
      topicId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update topics',
      });
    }

    const topic = await topicService.findTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    // Validate parent subject if provided
    if (parentSubject !== undefined) {
      if (!parentSubject.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'parentSubject',
              message: 'Parent subject cannot be empty',
            },
          ],
        });
      }

      // Check if parent subject exists
      const subject = await topicService.findSubjectById(parentSubject);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Parent subject not found',
        });
      }
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'name',
              message: 'Topic name cannot be empty',
            },
          ],
        });
      }
    }

    // Update topic
    const updateData = {};
    if (parentSubject !== undefined) {
      updateData.parentSubject = parentSubject.trim();
    }
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }

    const updatedTopic = await topicService.updateTopic(topic, updateData);

    const response = {
      success: true,
      message: 'Topic updated successfully',
      data: {
        topic: {
          id: updatedTopic.id || updatedTopic._id,
          parentSubject: updatedTopic.subject ? {
            id: updatedTopic.subject.id || updatedTopic.subject._id,
            name: updatedTopic.subject.name,
          } : null,
          name: updatedTopic.name,
          description: updatedTopic.description,
          createdAt: updatedTopic.createdAt,
          updatedAt: updatedTopic.updatedAt,
        },
      },
    };

    console.log('[TOPIC] PUT /admin/topics/:topicId → 200 (updated)', { topicId: updatedTopic.id || updatedTopic._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[TOPIC] PUT /admin/topics/:topicId → error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid topic ID',
      });
    }
    next(error);
  }
};

/**
 * Delete topic
 * Only superadmin can delete topics
 */
const deleteTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    console.log('[TOPIC] DELETE /admin/topics/:topicId → requested', {
      topicId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete topics
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete topics',
      });
    }

    const topic = await topicService.findTopicById(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    await topicService.deleteTopic(topicId);

    const response = {
      success: true,
      message: 'Topic deleted successfully',
      data: {
        topic: {
          id: topic.id,
          name: topic.name,
        },
      },
    };

    console.log('[TOPIC] DELETE /admin/topics/:topicId → 200 (deleted)', { topicId: topic.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[TOPIC] DELETE /admin/topics/:topicId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid topic ID',
      });
    }
    next(error);
  }
};

module.exports = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
};

