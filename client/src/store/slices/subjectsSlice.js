// src/store/slices/subjectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectsAPI from '../../api/subjects';

// Async thunk for fetching all subjects
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await subjectsAPI.getAllSubjects(params);
      return data; // { success, data: { subjects } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch subjects');
    }
  }
);

// Async thunk for fetching a single subject by ID
export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchSubjectById',
  async (subjectId, { rejectWithValue }) => {
    try {
      const data = await subjectsAPI.getSubjectById(subjectId);
      return data; // { success, data: { subject } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch subject');
    }
  }
);

// Async thunk for creating a subject
export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const data = await subjectsAPI.createSubject(subjectData);
      return data; // { success, message, data: { subject } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create subject');
    }
  }
);

// Async thunk for updating a subject
export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ subjectId, subjectData }, { rejectWithValue }) => {
    try {
      const data = await subjectsAPI.updateSubject(subjectId, subjectData);
      return data; // { success, message, data: { subject } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update subject');
    }
  }
);

// Async thunk for deleting a subject
export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (subjectId, { rejectWithValue }) => {
    try {
      const data = await subjectsAPI.deleteSubject(subjectId);
      return data; // { success, message, data: { subject } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete subject');
    }
  }
);

// Create the slice
const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    currentSubject: null,
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
    // Clear current subject
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subjects cases
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.subjects) {
          state.subjects = data.subjects;
        }
        state.error = null;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch subjects';
      })

      // Fetch subject by ID cases
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.subject) {
          state.currentSubject = data.subject;
        }
        state.error = null;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch subject';
      })

      // Create subject cases
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.subject) {
          state.subjects.unshift(data.subject); // Add to beginning of array
        }
        state.error = null;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create subject';
      })

      // Update subject cases
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.subject) {
          // Update in subjects array
          const index = state.subjects.findIndex(subject => subject.id === data.subject.id);
          if (index !== -1) {
            state.subjects[index] = data.subject;
          }
          // Update current subject if it's the same
          if (state.currentSubject?.id === data.subject.id) {
            state.currentSubject = data.subject;
          }
        }
        state.error = null;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to update subject';
      })

      // Delete subject cases
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.subject?.id) {
          // Remove from subjects array
          state.subjects = state.subjects.filter(subject => subject.id !== data.subject.id);
          // Clear current subject if it's the deleted one
          if (state.currentSubject?.id === data.subject.id) {
            state.currentSubject = null;
          }
        }
        state.error = null;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to delete subject';
      });
  },
});

// Export actions and reducer
export const { clearError, clearSuccess, clearCurrentSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;

