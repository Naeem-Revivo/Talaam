// src/store/slices/topicsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import topicsAPI from '../../api/topics';

// Async thunk for fetching all topics
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await topicsAPI.getAllTopics(params);
      return data; // { success, data: { topics } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch topics');
    }
  }
);

// Async thunk for fetching a single topic by ID
export const fetchTopicById = createAsyncThunk(
  'topics/fetchTopicById',
  async (topicId, { rejectWithValue }) => {
    try {
      const data = await topicsAPI.getTopicById(topicId);
      return data; // { success, data: { topic } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch topic');
    }
  }
);

// Async thunk for creating a topic
export const createTopic = createAsyncThunk(
  'topics/createTopic',
  async (topicData, { rejectWithValue }) => {
    try {
      const data = await topicsAPI.createTopic(topicData);
      return data; // { success, message, data: { topic } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create topic');
    }
  }
);

// Async thunk for updating a topic
export const updateTopic = createAsyncThunk(
  'topics/updateTopic',
  async ({ topicId, topicData }, { rejectWithValue }) => {
    try {
      const data = await topicsAPI.updateTopic(topicId, topicData);
      return data; // { success, message, data: { topic } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update topic');
    }
  }
);

// Async thunk for deleting a topic
export const deleteTopic = createAsyncThunk(
  'topics/deleteTopic',
  async (topicId, { rejectWithValue }) => {
    try {
      const data = await topicsAPI.deleteTopic(topicId);
      return data; // { success, message, data: { topic } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete topic');
    }
  }
);

// Create the slice
const topicsSlice = createSlice({
  name: 'topics',
  initialState: {
    topics: [],
    currentTopic: null,
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
    // Clear current topic
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch topics cases
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.topics) {
          state.topics = data.topics;
        }
        state.error = null;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch topics';
      })

      // Fetch topic by ID cases
      .addCase(fetchTopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicById.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        if (data?.topic) {
          state.currentTopic = data.topic;
        }
        state.error = null;
      })
      .addCase(fetchTopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch topic';
      })

      // Create topic cases
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.topic) {
          state.topics.unshift(data.topic); // Add to beginning of array
        }
        state.error = null;
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create topic';
      })

      // Update topic cases
      .addCase(updateTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.topic) {
          // Update in topics array
          const index = state.topics.findIndex(topic => topic.id === data.topic.id);
          if (index !== -1) {
            state.topics[index] = data.topic;
          }
          // Update current topic if it's the same
          if (state.currentTopic?.id === data.topic.id) {
            state.currentTopic = data.topic;
          }
        }
        state.error = null;
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to update topic';
      })

      // Delete topic cases
      .addCase(deleteTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.topic?.id) {
          // Remove from topics array
          state.topics = state.topics.filter(topic => topic.id !== data.topic.id);
          // Clear current topic if it's the deleted one
          if (state.currentTopic?.id === data.topic.id) {
            state.currentTopic = null;
          }
        }
        state.error = null;
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to delete topic';
      });
  },
});

// Export actions and reducer
export const { clearError, clearSuccess, clearCurrentTopic } = topicsSlice.actions;
export default topicsSlice.reducer;

