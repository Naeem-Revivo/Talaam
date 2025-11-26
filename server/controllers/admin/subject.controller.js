const subjectService = require('../../services/admin');

/**
 * Create subject
 * Only superadmin can create subjects
 */
const createSubject = async (req, res, next) => {
  try {
    const { name } = req.body;

    console.log('[SUBJECT] POST /admin/subjects → requested', {
      name,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create subjects',
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'name',
            message: 'Subject name is required',
          },
        ],
      });
    }

    // Create subject
    const subjectData = {
      name: name.trim(),
      description: req.body.description ? req.body.description.trim() : '',
    };

    const subject = await subjectService.createSubject(subjectData);

    const response = {
      success: true,
      message: 'Subject created successfully',
      data: {
        subject: {
          id: subject._id,
          name: subject.name,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        },
      },
    };

    console.log('[SUBJECT] POST /admin/subjects → 201 (created)', { subjectId: subject._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[SUBJECT] POST /admin/subjects → error', error);
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
 * Get all subjects
 * Both admin and superadmin can access this
 */
const getAllSubjects = async (req, res, next) => {
  try {
    console.log('[SUBJECT] GET /admin/subjects → requested', { requestedBy: req.user.id });

    const subjects = await subjectService.getAllSubjects();

    const response = {
      success: true,
      data: {
        subjects: subjects.map((subject) => ({
          id: subject._id,
          name: subject.name,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        })),
      },
    };

    console.log('[SUBJECT] GET /admin/subjects → 200 (ok)', { count: subjects.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBJECT] GET /admin/subjects → error', error);
    next(error);
  }
};

/**
 * Get single subject by ID
 * Both admin and superadmin can access this
 */
const getSubjectById = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    console.log('[SUBJECT] GET /admin/subjects/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
    });

    const subject = await subjectService.findSubjectById(subjectId);

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
          id: subject._id,
          name: subject.name,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        },
      },
    };

    console.log('[SUBJECT] GET /admin/subjects/:subjectId → 200 (ok)', { subjectId: subject._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBJECT] GET /admin/subjects/:subjectId → error', error);
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
 * Update subject
 * Only superadmin can update subjects
 */
const updateSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name } = req.body;

    console.log('[SUBJECT] PUT /admin/subjects/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update subjects',
      });
    }

    const subject = await subjectService.findSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'name',
              message: 'Subject name cannot be empty',
            },
          ],
        });
      }
    }

    // Update subject
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description.trim();
    }

    const updatedSubject = await subjectService.updateSubject(subject, updateData);

    const response = {
      success: true,
      message: 'Subject updated successfully',
      data: {
        subject: {
          id: updatedSubject._id,
          name: updatedSubject.name,
          createdAt: updatedSubject.createdAt,
          updatedAt: updatedSubject.updatedAt,
        },
      },
    };

    console.log('[SUBJECT] PUT /admin/subjects/:subjectId → 200 (updated)', { subjectId: subject._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBJECT] PUT /admin/subjects/:subjectId → error', error);
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
        message: 'Invalid subject ID',
      });
    }
    next(error);
  }
};

/**
 * Delete subject
 * Only superadmin can delete subjects
 */
const deleteSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    console.log('[SUBJECT] DELETE /admin/subjects/:subjectId → requested', {
      subjectId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete subjects
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete subjects',
      });
    }

    const subject = await subjectService.findSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    await subjectService.deleteSubject(subjectId);

    const response = {
      success: true,
      message: 'Subject deleted successfully',
      data: {
        subject: {
          id: subject._id,
          name: subject.name,
        },
      },
    };

    console.log('[SUBJECT] DELETE /admin/subjects/:subjectId → 200 (deleted)', { subjectId: subject._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[SUBJECT] DELETE /admin/subjects/:subjectId → error', error);
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
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};

