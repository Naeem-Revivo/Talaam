// src/api/questions.js
import axiosClient from './client';

const questionsAPI = {
  // ============================================
  // COMMON ENDPOINTS
  // ============================================

  // Get topics by subject (accessible by all workflow roles)
  getTopicsBySubject: async (subjectId) => {
    try {
      const response = await axiosClient.get(`/admin/questions/topics/${subjectId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch topics' };
    }
  },

  // ============================================
  // GATHERER ENDPOINTS
  // ============================================

  // Get gatherer statistics
  getGathererStats: async () => {
    try {
      const response = await axiosClient.get('/admin/questions/gatherer/stats');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch gatherer statistics' };
    }
  },

  // Get gatherer questions list (with pagination and status filter)
  getGathererQuestions: async (params = {}) => {
    try {
      const { page = 1, limit = 20, status } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/questions/gatherer/list?${queryParams.toString()}`
        : '/admin/questions/gatherer/list';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch gatherer questions' };
    }
  },

  // Get questions (Gatherer view)
  getGathererQuestionsByStatus: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/questions?${queryParams.toString()}`
        : '/admin/questions';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch questions' };
    }
  },

  // Get question by ID (Gatherer)
  getGathererQuestionById: async (questionId) => {
    try {
      const response = await axiosClient.get(`/admin/questions/${questionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch question' };
    }
  },

  // Create question (Gatherer)
  createQuestion: async (questionData) => {
    try {
      const apiData = {
        exam: questionData.exam,
        subject: questionData.subject,
        topic: questionData.topic,
        questionText: questionData.questionText?.trim(),
        questionType: questionData.questionType,
        explanation: questionData.explanation?.trim() || '',
      };

      // Add processor assignment if provided
      if (questionData.assignedProcessor) {
        apiData.assignedProcessor = questionData.assignedProcessor;
      }

      // Add MCQ-specific fields
      if (questionData.questionType === 'MCQ') {
        apiData.options = {
          A: questionData.options?.A?.trim(),
          B: questionData.options?.B?.trim(),
          C: questionData.options?.C?.trim(),
          D: questionData.options?.D?.trim(),
        };
        apiData.correctAnswer = questionData.correctAnswer;
      }

      console.log('API Request Data:', apiData);
      const response = await axiosClient.post('/admin/questions', apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create question' };
    }
  },

  // ============================================
  // PROCESSOR ENDPOINTS
  // ============================================

  // Get questions (Processor view)
  getProcessorQuestions: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/questions/processor?${queryParams.toString()}`
        : '/admin/questions/processor';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch questions' };
    }
  },

  // Get question by ID (Processor)
  getProcessorQuestionById: async (questionId) => {
    try {
      const response = await axiosClient.get(`/admin/questions/processor/${questionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch question' };
    }
  },

  // Approve question (Processor)
  approveQuestion: async (questionId, body = {}) => {
    try {
      const apiData = {
        status: body.status || 'approve',
      };

      const response = await axiosClient.post(`/admin/questions/processor/${questionId}/approve`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to approve question' };
    }
  },

  // Reject question (Processor)
  rejectQuestion: async (questionId, rejectionReason) => {
    try {
      const apiData = {
        status: 'reject',
        rejectionReason: rejectionReason?.trim(),
      };

      const response = await axiosClient.post(`/admin/questions/processor/${questionId}/reject`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to reject question' };
    }
  },

  // Review Creator flag (Processor)
  reviewCreatorFlag: async (questionId, decision, rejectionReason = null) => {
    try {
      const apiData = {
        decision: decision, // 'approve' or 'reject'
      };

      if (decision === 'reject' && rejectionReason) {
        apiData.rejectionReason = rejectionReason.trim();
      }

      const response = await axiosClient.post(`/admin/questions/processor/${questionId}/flag/review`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to review creator flag' };
    }
  },

  // Review Explainer flag (Processor)
  reviewExplainerFlag: async (questionId, decision, rejectionReason = null) => {
    try {
      const apiData = {
        decision: decision, // 'approve' or 'reject'
      };

      if (decision === 'reject' && rejectionReason) {
        apiData.rejectionReason = rejectionReason.trim();
      }

      const response = await axiosClient.post(`/admin/questions/processor/${questionId}/variant-flag/review`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to review explainer flag' };
    }
  },

  // ============================================
  // CREATOR ENDPOINTS
  // ============================================

  // Get questions (Creator view)
  getCreatorQuestions: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/questions/creator?${queryParams.toString()}`
        : '/admin/questions/creator';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch questions' };
    }
  },

  // Get question by ID (Creator)
  getCreatorQuestionById: async (questionId) => {
    try {
      const response = await axiosClient.get(`/admin/questions/creator/${questionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch question' };
    }
  },

  // Update question (Creator)
  updateQuestion: async (questionId, questionData) => {
    try {
      const apiData = {};

      if (questionData.exam !== undefined) apiData.exam = questionData.exam;
      if (questionData.subject !== undefined) apiData.subject = questionData.subject;
      if (questionData.topic !== undefined) apiData.topic = questionData.topic;
      if (questionData.questionText !== undefined) apiData.questionText = questionData.questionText?.trim();
      if (questionData.questionType !== undefined) apiData.questionType = questionData.questionType;

      if (questionData.options !== undefined) {
        apiData.options = {
          A: questionData.options.A?.trim(),
          B: questionData.options.B?.trim(),
          C: questionData.options.C?.trim(),
          D: questionData.options.D?.trim(),
        };
      }

      if (questionData.correctAnswer !== undefined) apiData.correctAnswer = questionData.correctAnswer;

      const response = await axiosClient.put(`/admin/questions/creator/${questionId}`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update question' };
    }
  },

  // Flag question (Creator)
  flagQuestion: async (questionId, flagReason) => {
    try {
      const apiData = {
        flagReason: flagReason?.trim(),
      };

      const response = await axiosClient.post(`/admin/questions/creator/${questionId}/flag`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to flag question' };
    }
  },

  // Create question variant (Creator)
  createQuestionVariant: async (questionId, variantData) => {
    try {
      const apiData = {};

      if (variantData.exam !== undefined) apiData.exam = variantData.exam;
      if (variantData.subject !== undefined) apiData.subject = variantData.subject;
      if (variantData.topic !== undefined) apiData.topic = variantData.topic;
      if (variantData.questionText !== undefined) apiData.questionText = variantData.questionText?.trim();
      if (variantData.questionType !== undefined) apiData.questionType = variantData.questionType;
      if (variantData.explanation !== undefined) apiData.explanation = variantData.explanation?.trim();

      if (variantData.options !== undefined) {
        apiData.options = {
          A: variantData.options.A?.trim(),
          B: variantData.options.B?.trim(),
          C: variantData.options.C?.trim(),
          D: variantData.options.D?.trim(),
        };
      }

      if (variantData.correctAnswer !== undefined) apiData.correctAnswer = variantData.correctAnswer;

      const response = await axiosClient.post(`/admin/questions/creator/${questionId}/variant`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to create question variant' };
    }
  },

  // ============================================
  // EXPLAINER ENDPOINTS
  // ============================================

  // Get questions (Explainer view)
  getExplainerQuestions: async (params = {}) => {
    try {
      const { status } = params;
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const url = queryParams.toString()
        ? `/admin/questions/explainer?${queryParams.toString()}`
        : '/admin/questions/explainer';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch questions' };
    }
  },

  // Get question by ID (Explainer)
  getExplainerQuestionById: async (questionId) => {
    try {
      const response = await axiosClient.get(`/admin/questions/explainer/${questionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch question' };
    }
  },

  // Update explanation (Explainer)
  updateExplanation: async (questionId, explanation) => {
    try {
      const apiData = {
        explanation: explanation?.trim(),
      };

      const response = await axiosClient.put(`/admin/questions/explainer/${questionId}/explanation`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to update explanation' };
    }
  },

  // Flag question or variant (Explainer)
  flagQuestionByExplainer: async (questionId, flagReason) => {
    try {
      const apiData = {
        flagReason: flagReason?.trim(),
      };

      const response = await axiosClient.post(`/admin/questions/explainer/${questionId}/flag`, apiData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to flag question' };
    }
  },
};

export default questionsAPI;

