import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import 'firebase/auth';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { AuthState, LoginData, User } from '../types';
import { handleThunkError } from './expensesSlice';
export const register = createAsyncThunk<User, LoginData>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = {
        email: response?.user.email,
        uid: response?.user.uid,
      };
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk<User, LoginData>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user: User = {
        email: response?.user.email,
        uid: response?.user.uid,
      };
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log({
          email: currentUser.email,
          uid: currentUser.uid,
        });

        return {
          email: currentUser.email,
          uid: currentUser.uid,
        };
      } else {
        return null;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (
    {
      newPassword,
      currentPassword,
    }: { newPassword: string; currentPassword: string },
    { rejectWithValue }
  ) => {
    const user = auth.currentUser;
    if (!user || !user.email) return rejectWithValue('No user logged in');
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      await user.reload();
      Alert.alert('Password successfully changed');

      return true;
    } catch (error: any) {
      let errorMessage = 'Failed to change password. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'The current password is incorrect.';
      }
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = () => {
  return signOut(auth);
};

const initialState: AuthState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = handleThunkError(action.payload);
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = handleThunkError(action.payload);
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = handleThunkError(action.payload);
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = handleThunkError(action.payload);
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(changePassword.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = handleThunkError(action.payload);
      });
  },
});

export default authSlice.reducer;
export const { clearErrors } = authSlice.actions;
