import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { get, push, ref, remove, set, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import { ExpenseItem, ExpensesState } from '../types';

export const fetchExpenses = createAsyncThunk<ExpenseItem[]>(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchExistingExpenses();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addExpensesAndFetch = createAsyncThunk(
  'expenses/addExpensesAndFetch',
  async (expenses: ExpenseItem[], { dispatch }) => {
    const result = await dispatch(addMultipleExpenses(expenses));
    if (result.payload !== 'DUPLICATE') {
      await dispatch(fetchExpenses());
    }
  }
);

const fetchExistingExpenses = async () => {
  const userId = getUserId();

  const expensesRef = ref(database, `expenses/${userId}`);
  const snapshot = await get(expensesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    const userExpenses = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    return userExpenses;
  } else {
    return [];
  }
};

export const addExpense = createAsyncThunk<
  ExpenseItem | 'DUPLICATE' | null,
  ExpenseItem
>('expenses/addExpense', async (expenseData, { dispatch, rejectWithValue }) => {
  try {
    const existingExpenses = await fetchExistingExpenses();

    const duplicate = existingExpenses.find(
      (existing) =>
        existing.description === expenseData.description &&
        existing.date === expenseData.date
    );
    if (duplicate) {
      return 'DUPLICATE';
    } else {
      await addExpenseToDB(expenseData);
      await dispatch(fetchExpenses());
      return expenseData;
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateExpense = createAsyncThunk<ExpenseItem, ExpenseItem>(
  'expenses/updateExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const userId = getUserId();

      const expenseRef = ref(database, `expenses/${userId}/${expenseData.id}`);
      await update(expenseRef, expenseData);
      return expenseData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addMultipleExpenses = createAsyncThunk<
  ExpenseItem[] | 'DUPLICATE',
  ExpenseItem[]
>('expenses/addMultipleExpenses', async (expensesData, { rejectWithValue }) => {
  try {
    const existingExpenses = await fetchExistingExpenses();
    const newExpenses = expensesData.filter(
      (expenseData) =>
        !existingExpenses.some((existing) => {
          return (
            existing.description === expenseData.description &&
            existing.date === expenseData.date
          );
        })
    );
    if (newExpenses.length === 0) {
      return 'DUPLICATE';
    } else {
      await Promise.all(
        newExpenses.map((expenseData) => {
          addExpenseToDB(expenseData);
        })
      );
      return newExpenses;
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

const addExpenseToDB = async (expenseData: ExpenseItem) => {
  const userId = getUserId();
  const userExpensesRef = ref(database, `expenses/${userId}`);
  const newExpenseRef = push(userExpensesRef);
  await set(newExpenseRef, expenseData);
};

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (expenseId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      const expenseRef = ref(database, `expenses/${userId}/${expenseId}`);
      await remove(expenseRef);
      return expenseId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearExpenses = createAsyncThunk(
  'expenses/clearExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      const expenseRef = ref(database, `expenses/${userId}`);
      await remove(expenseRef);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
};

export const handleThunkError = (error: unknown): string => {
  if (error instanceof Error) {
    console.log(error.message);
    return error.message;
  }
  return 'An unknown error occurred';
};

const initialState: ExpensesState = {
  items: [] as ExpenseItem[],
  status: 'idle',
  error: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = handleThunkError(action.payload);
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = handleThunkError(action.payload);
        state.status = 'failed';
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = handleThunkError(action.payload);
        state.status = 'failed';
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (expense) => expense.id !== action.payload
        );
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(clearExpenses.pending, (state, action) => {
        state.error = handleThunkError(action.payload);
        state.status = 'loading';
      })
      .addCase(clearExpenses.fulfilled, (state, action) => {
        state.items = [];
        state.status = 'succeeded';
      })
      .addCase(clearExpenses.rejected, (state, action) => {
        state.error = handleThunkError(action.payload);
        state.status = 'failed';
      })
      .addCase(addMultipleExpenses.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(addMultipleExpenses.rejected, (state, action) => {
        state.error = handleThunkError(action.payload);
        state.status = 'failed';
      });
  },
});

export default expensesSlice.reducer;
