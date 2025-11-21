const examService = require('../../services/admin');

/**
 * Create exam
 * Only superadmin can create exams
 */
const createExam = async (req, res, next) => {
  try {
    const { name, status } = req.body;

    console.log('[EXAM] POST /admin/exams → requested', {
      name,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create exams
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create exams',
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
            message: 'Exam name is required',
          },
        ],
      });
    }

    // Validate status if provided
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'status',
            message: 'Status must be either active or inactive',
          },
        ],
      });
    }

    // Create exam
    const examData = {
      name: name.trim(),
      status: status || 'active',
    };

    const exam = await examService.createExam(examData);

    const response = {
      success: true,
      message: 'Exam created successfully',
      data: {
        exam: {
          id: exam._id,
          name: exam.name,
          status: exam.status,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        },
      },
    };

    console.log('[EXAM] POST /admin/exams → 201 (created)', { examId: exam._id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[EXAM] POST /admin/exams → error', error);
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
 * Get all exams
 * Both admin and superadmin can access this
 */
const getAllExams = async (req, res, next) => {
  try {
    console.log('[EXAM] GET /admin/exams → requested', { requestedBy: req.user.id });

    // Optional query parameter for filtering by status
    const { status } = req.query;
    const filter = {};

    if (status) {
      const validStatuses = ['active', 'inactive'];
      if (validStatuses.includes(status.toLowerCase())) {
        filter.status = status.toLowerCase();
      }
    }

    const exams = await examService.getAllExams(filter);

    const response = {
      success: true,
      data: {
        exams: exams.map((exam) => ({
          id: exam._id,
          name: exam.name,
          status: exam.status,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        })),
      },
    };

    console.log('[EXAM] GET /admin/exams → 200 (ok)', { count: exams.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[EXAM] GET /admin/exams → error', error);
    next(error);
  }
};

/**
 * Get single exam by ID
 * Both admin and superadmin can access this
 */
const getExamById = async (req, res, next) => {
  try {
    const { examId } = req.params;

    console.log('[EXAM] GET /admin/exams/:examId → requested', {
      examId,
      requestedBy: req.user.id,
    });

    const exam = await examService.findExamById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    const response = {
      success: true,
      data: {
        exam: {
          id: exam._id,
          name: exam.name,
          status: exam.status,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        },
      },
    };

    console.log('[EXAM] GET /admin/exams/:examId → 200 (ok)', { examId: exam._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[EXAM] GET /admin/exams/:examId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID',
      });
    }
    next(error);
  }
};

/**
 * Update exam
 * Only superadmin can update exams
 */
const updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { name, status } = req.body;

    console.log('[EXAM] PUT /admin/exams/:examId → requested', {
      examId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update exams
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update exams',
      });
    }

    const exam = await examService.findExamById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Validate status if provided
    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'status',
              message: 'Status must be either active or inactive',
            },
          ],
        });
      }
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
              message: 'Exam name cannot be empty',
            },
          ],
        });
      }
    }

    // Update exam
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedExam = await examService.updateExam(exam, updateData);

    const response = {
      success: true,
      message: 'Exam updated successfully',
      data: {
        exam: {
          id: updatedExam._id,
          name: updatedExam.name,
          status: updatedExam.status,
          createdAt: updatedExam.createdAt,
          updatedAt: updatedExam.updatedAt,
        },
      },
    };

    console.log('[EXAM] PUT /admin/exams/:examId → 200 (updated)', { examId: exam._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[EXAM] PUT /admin/exams/:examId → error', error);
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
        message: 'Invalid exam ID',
      });
    }
    next(error);
  }
};

/**
 * Delete exam
 * Only superadmin can delete exams
 */
const deleteExam = async (req, res, next) => {
  try {
    const { examId } = req.params;

    console.log('[EXAM] DELETE /admin/exams/:examId → requested', {
      examId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete exams
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete exams',
      });
    }

    const exam = await examService.findExamById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    await examService.deleteExam(examId);

    const response = {
      success: true,
      message: 'Exam deleted successfully',
      data: {
        exam: {
          id: exam._id,
          name: exam.name,
        },
      },
    };

    console.log('[EXAM] DELETE /admin/exams/:examId → 200 (deleted)', { examId: exam._id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[EXAM] DELETE /admin/exams/:examId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID',
      });
    }
    next(error);
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};

