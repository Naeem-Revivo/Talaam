// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../api/auth';

// Load initial state from localStorage
const getAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: !!token,
    };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
};

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authAPI.signup(userData);
      return data; // { success, message, data: { token, user } }
    } catch (error) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authAPI.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk to fetch current user (e.g. on app load)
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.getCurrentUser();
      return data; // { success, data: { user } }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Async thunk to complete profile during signup flow
export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authAPI.completeProfile(profileData);
      return data; // { success, message, data: { profile } }
    } catch (error) {
      return rejectWithValue(error.message || 'Complete profile failed');
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authAPI.verifyOTP(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

// Async thunk for resending OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authAPI.resendOTP(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resend OTP');
    }
  }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authAPI.forgotPassword(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Forgot password failed');
    }
  }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authAPI.resetPassword(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Reset password failed');
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...getAuthFromStorage(),
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    // Login action - sets token and updates auth state
    login: (state, action) => {
      const token = action.payload;
      localStorage.setItem('authToken', token);
      state.token = token;
      state.isAuthenticated = true;
    },
    // Logout action
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
    },
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        const token = data?.token || null;
        const user = data?.user || null;
        
        if (token) {
          localStorage.setItem('authToken', token);
          state.token = token;
          state.isAuthenticated = true;
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          state.user = user;
        }
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Signup failed';
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        const token = data?.token || null;
        const user = data?.user || null;
        
        if (token) {
          localStorage.setItem('authToken', token);
          state.token = token;
          state.isAuthenticated = true;
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          state.user = user;
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Login failed';
      })

      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        if (data?.user) {
          state.user = data.user;
          state.isAuthenticated = true;
        }
      })

      // Complete profile
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const { data } = action.payload || {};
        if (data?.profile) {
          state.user = {
            ...(state.user || {}),
            fullName: data.profile.fullName,
            dateOfBirth: data.profile.dateOfBirth,
            country: data.profile.country,
            timezone: data.profile.timezone,
            language: data.profile.language,
          };
        }
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Complete profile failed';
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload || {};
        const token = data?.token || null;
        const user = data?.user || null;
        
        if (token) {
          localStorage.setItem('authToken', token);
          state.token = token;
          state.isAuthenticated = true;
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          state.user = user;
        }
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'OTP verification failed';
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to resend OTP';
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Forgot password failed';
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Reset password failed';
      });
  },
});

// Export actions and reducer
export const { login: loginAction, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
