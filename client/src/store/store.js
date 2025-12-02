// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import examsReducer from './slices/examsSlice';
import subjectsReducer from './slices/subjectsSlice';
import topicsReducer from './slices/topicsSlice';

// Create a minimal chart reducer for MUI Charts
// MUI Charts v8 uses Redux internally but doesn't export chartReducer
// This provides the state structure that MUI Charts expects
const chartReducer = (state = {}, action) => {
  // Return a minimal state structure for MUI Charts
  // The charts library will manage its own state internally
  return state;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exams: examsReducer,
    subjects: subjectsReducer,
    topics: topicsReducer,
    charts: chartReducer,
  },
});