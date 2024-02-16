// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { AuthState, ExpensesState } from '../types';
import authReducer from './authSlice';
import expensesReducer from './expensesSlice';

export interface RootState {
  expenses: ExpensesState;
  auth: AuthState;
}

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
