// src/store/slices/examsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examsAPI from '../../api/exams';

// Async thunk for fetching all exams
export const fetchExams = createAsyncThunk(
  'exams/fetchExams',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await examsAPI.getAllExams(params);
      return data; // { success, data: { exams } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exams');
    }
  }
);

// Async thunk for fetching a single exam by ID
export const fetchExamById = createAsyncThunk(
  'exams/fetchExamById',
  async (examId, { rejectWithValue }) => {
    try {
      const data = await examsAPI.getExamById(examId);
      return data; // { success, data: { exam } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch exam');
    }
  }
);

// Async thunk for creating an exam
export const createExam = createAsyncThunk(
  'exams/createExam',
  async (examData, { rejectWithValue }) => {
    try {
      const data = await examsAPI.createExam(examData);
      return data; // { success, message, data: { exam } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create exam');
    }
  }
);

// Async thunk for updating an exam
export const updateExam = createAsyncThunk(
  'exams/updateExam',
  async ({ examId, examData }, { rejectWithValue }) => {
    try {
      const data = await examsAPI.updateExam(examId, examData);
      return data; // { success, message, data: { exam } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update exam');
    }
  }
);

// Async thunk for deleting an exam
export const deleteExam = createAsyncThunk(
  'exams/deleteExam',
  async (examId, { rejectWithValue }) => {
    try {
      const data = await examsAPI.deleteExam(examId);
      return data; // { success, message, data: { exam } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete exam');
    }
  }
);

// Create the slice
const examsSlice = createSlice({
  name: 'exams',
  initialState: {
    exams: [],
    currentExam: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    // Clear success state
    clearSuccess: (state) => {
      state.success = false;
    },
    // Clear current exam
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch exams cases
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.exams) {
          state.exams = data.exams;
        }
        state.error = null;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch exams';
      })

      // Fetch exam by ID cases
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.exam) {
          state.currentExam = data.exam;
        }
        state.error = null;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch exam';
      })

      // Create exam cases
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.exam) {
          state.exams.unshift(data.exam); // Add to beginning of array
        }
        state.error = null;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create exam';
      })

      // Update exam cases
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.exam) {
          // Update in exams array
          const index = state.exams.findIndex(exam => exam.id === data.exam.id);
          if (index !== -1) {
            state.exams[index] = data.exam;
          }
          // Update current exam if it's the same
          if (state.currentExam?.id === data.exam.id) {
            state.currentExam = data.exam;
          }
        }
        state.error = null;
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to update exam';
      })

      // Delete exam cases
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.exam?.id) {
          // Remove from exams array
          state.exams = state.exams.filter(exam => exam.id !== data.exam.id);
          // Clear current exam if it's the deleted one
          if (state.currentExam?.id === data.exam.id) {
            state.currentExam = null;
          }
        }
        state.error = null;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to delete exam';
      });
  },
});

// Export actions and reducer
export const { clearError, clearSuccess, clearCurrentExam } = examsSlice.actions;
export default examsSlice.reducer;

