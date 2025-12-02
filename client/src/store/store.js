// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import examsReducer from './slices/examsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exams: examsReducer,
  },
});