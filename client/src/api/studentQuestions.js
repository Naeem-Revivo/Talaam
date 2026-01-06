// src/api/studentQuestions.js
import axiosClient from './client';

const studentQuestionsAPI = {
  // Get available questions for study mode
  // GET /api/student/questions?exam=...&subject=...&topic=...&topics=...
  getAvailableQuestions: async (params = {}) => {
    try {
      const { exam, subject, topic, topics } = params;
      const queryParams = new URLSearchParams();
      
      if (exam) queryParams.append('exam', exam);
      if (subject) queryParams.append('subject', subject);
      if (topic) queryParams.append('topic', topic);
      if (topics) queryParams.append('topics', topics); // Support multiple topics

      const url = queryParams.toString()
        ? `/student/questions?${queryParams.toString()}`
        : '/student/questions';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch available questions' };
    }
  },

  // Start a test (get questions for test mode)
  // GET /api/student/questions/test/start?exam=...&subject=...&topic=...&topics=...
  startTest: async (params = {}) => {
    try {
      const { exam, subject, topic, topics } = params;
      const queryParams = new URLSearchParams();
      
      if (exam) queryParams.append('exam', exam);
      if (subject) queryParams.append('subject', subject);
      if (topic) queryParams.append('topic', topic);
      if (topics) queryParams.append('topics', topics); // Support multiple topics

      const url = queryParams.toString()
        ? `/student/questions/test/start?${queryParams.toString()}`
        : '/student/questions/test/start';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to start test' };
    }
  },

  // Submit study answer
  // POST /api/student/questions/study
  submitStudyAnswer: async (questionId, selectedAnswer) => {
    try {
      const response = await axiosClient.post('/student/questions/study', {
        questionId,
        selectedAnswer,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to submit answer' };
    }
  },

  // Get question by ID
  // GET /api/student/questions/:questionId
  getQuestionById: async (questionId) => {
    try {
      const response = await axiosClient.get(`/student/questions/${questionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch question' };
    }
  },

  // Save complete study mode session results
  // POST /api/student/questions/study/session
  saveStudySessionResults: async (sessionData) => {
    try {
      const response = await axiosClient.post('/student/questions/study/session', sessionData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to save study session results' };
    }
  },

  // Submit test answers with time taken
  // POST /api/student/questions/test/submit
  submitTestAnswers: async (examId, answers, timeTaken = null) => {
    try {
      const response = await axiosClient.post('/student/questions/test/submit', {
        examId,
        answers,
        timeTaken,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to submit test answers' };
    }
  },

  // Get session history with filters
  // GET /api/student/questions/sessions?mode=all&page=1&limit=10
  getSessionHistory: async (params = {}) => {
    try {
      const { mode = 'all', page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      if (mode) queryParams.append('mode', mode);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const url = `/student/questions/sessions?${queryParams.toString()}`;
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch session history' };
    }
  },

  // Get session detail (all questions)
  // GET /api/student/questions/sessions/:sessionId
  getSessionDetail: async (sessionId) => {
    try {
      const response = await axiosClient.get(`/student/questions/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch session detail' };
    }
  },

  // Get incorrect items for a session
  // GET /api/student/questions/sessions/:sessionId/incorrect
  getSessionIncorrect: async (sessionId) => {
    try {
      const response = await axiosClient.get(`/student/questions/sessions/${sessionId}/incorrect`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch incorrect items' };
    }
  },

  // Get test summary (for dashboard progress and accuracy)
  // GET /api/student/questions/test/summary?exam=...
  getTestSummary: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.exam) queryParams.append('exam', params.exam);

      const url = queryParams.toString()
        ? `/student/questions/test/summary?${queryParams.toString()}`
        : '/student/questions/test/summary';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch test summary' };
    }
  },

  // Get study mode summary (for dashboard progress and accuracy)
  // GET /api/student/questions/study/summary?exam=...
  getStudySummary: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.exam) queryParams.append('exam', params.exam);

      const url = queryParams.toString()
        ? `/student/questions/study/summary?${queryParams.toString()}`
        : '/student/questions/study/summary';

      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch study summary' };
    }
  },

  // Get performance data (last 10 sessions)
  // GET /api/student/questions/performance
  getPerformanceData: async () => {
    try {
      const response = await axiosClient.get('/student/questions/performance');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch performance data' };
    }
  },

  // Get day-wise test mode accuracy trend
  // GET /api/student/questions/test/accuracy-trend?days=30
  getTestModeAccuracyTrend: async (days = 30) => {
    try {
      const response = await axiosClient.get(`/student/questions/test/accuracy-trend?days=${days}`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch test mode accuracy trend' };
    }
  },

  // Flag question by student
  // POST /api/student/questions/:questionId/flag
  flagQuestion: async (questionId, flagReason) => {
    try {
      const response = await axiosClient.post(`/student/questions/${questionId}/flag`, {
        flagReason,
      });
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to flag question' };
    }
  },

  // Get student's flagged questions
  // GET /api/student/questions/flagged
  getStudentFlaggedQuestions: async () => {
    try {
      const response = await axiosClient.get('/student/questions/flagged');
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch flagged questions' };
    }
  },

  // Pause a session (study or test mode)
  // POST /api/student/questions/sessions/pause
  pauseSession: async (sessionData) => {
    try {
      const response = await axiosClient.post('/student/questions/sessions/pause', sessionData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to pause session' };
    }
  },

  // Get paused session for resuming
  // GET /api/student/questions/sessions/:sessionId/resume
  getPausedSession: async (sessionId) => {
    try {
      const response = await axiosClient.get(`/student/questions/sessions/${sessionId}/resume`);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to fetch paused session' };
    }
  },

  // Complete a paused session (update status from paused to completed)
  // PUT /api/student/questions/sessions/:sessionId/complete
  completePausedSession: async (sessionId, sessionData) => {
    try {
      const response = await axiosClient.put(`/student/questions/sessions/${sessionId}/complete`, sessionData);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      throw apiError || { message: 'Failed to complete paused session' };
    }
  },
};

export default studentQuestionsAPI;
