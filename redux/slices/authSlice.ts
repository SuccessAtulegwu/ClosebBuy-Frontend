import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types/publicTypes';
import { Role } from '@/types/publicenums';
import { FirebaseAuthService } from '@/services/firebaseAuth.service';
import { AuthApiService } from '@/apiServices/authService';
import { CreateUserDto } from '@/types/publicDTOTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// Storage keys
const TOKEN_KEY = '@closebuy_token';
const USER_KEY = '@closebuy_user';

/**
 * Sign up with Firebase and create user in backend
 */
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (
    credentials: { email: string; password: string; name: string; estateId?: number },
    { rejectWithValue }
  ) => {
    try {
      // 1. Create user in Firebase
      const firebaseResult = await FirebaseAuthService.signUp(
        credentials.email,
        credentials.password,
        credentials.name
      );

      // 2. Create user in backend using Firebase token
      const userData: CreateUserDto = {
        email: credentials.email,
        name: credentials.name,
        role: Role.RESIDENT,
        estateId: credentials.estateId || 1,
      };

      const backendResult = await AuthApiService.createUser(
        userData,
        firebaseResult.token
      );

      if (!backendResult.success || !backendResult.data) {
        throw new Error(backendResult.error || 'Failed to create user in backend');
      }

      // 3. Store token and user data
      await AsyncStorage.setItem(TOKEN_KEY, firebaseResult.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(backendResult.data));

      return {
        user: backendResult.data,
        token: firebaseResult.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign up');
    }
  }
);

/**
 * Sign in with Firebase and sync with backend
 */
export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 1. Sign in with Firebase
      const firebaseResult = await FirebaseAuthService.signIn(
        credentials.email,
        credentials.password
      );

      // 2. Get user profile from backend
      const backendResult = await AuthApiService.getUserProfile(firebaseResult.token);

      if (!backendResult.success || !backendResult.data) {
        throw new Error(backendResult.error || 'Failed to get user profile');
      }

      // 3. Store token and user data
      await AsyncStorage.setItem(TOKEN_KEY, firebaseResult.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(backendResult.data));

      return {
        user: backendResult.data,
        token: firebaseResult.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign in');
    }
  }
);

/**
 * Sign out user from Firebase and clear local data
 */
export const signOutUser = createAsyncThunk(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Sign out from Firebase
      await FirebaseAuthService.signOut();

      // 2. Clear local storage
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign out');
    }
  }
);

/**
 * Restore session from AsyncStorage
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const [token, userStr] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);

      if (!token[1] || !userStr[1]) {
        return null;
      }

      const user = JSON.parse(userStr[1]) as User;

      // Verify token with backend
      const verifyResult = await AuthApiService.verifyToken(token[1]);

      if (!verifyResult.success) {
        // Token invalid, clear storage
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        return null;
      }

      return {
        user,
        token: token[1],
      };
    } catch (error: any) {
      // Silently fail restore session, don't log to console
      return null;
    }
  }
);

/**
 * Refresh Firebase token
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await FirebaseAuthService.getCurrentToken();

      if (!newToken) {
        throw new Error('Failed to refresh token');
      }

      await AsyncStorage.setItem(TOKEN_KEY, newToken);

      return newToken;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        // Don't set isAuthenticated to true on signup
        // User needs to login after signing up
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Sign Out
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Restore Session
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
      });
  },
});

export const {
  setUser,
  setToken,
  updateUser,
  clearAuth,
  clearError,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;
