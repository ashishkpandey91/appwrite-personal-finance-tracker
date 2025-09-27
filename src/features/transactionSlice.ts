import { Transaction } from "@/types/finance";
import { financeService } from "@/services/financeService.appwrite";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TransactionState = {
  entities: Transaction[];
  loading: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: TransactionState = {
  entities: [],
  loading: "idle",
};

export const fetchTransactions = createAsyncThunk(
  "transactions/get",
  async () => {
    try {
      const result = await financeService.getTransactions();
      return result.transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }
);

export const addNewTransaction = createAsyncThunk(
  "transactions/add",
  async (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const transaction = await financeService.addTransaction(newTransaction);
      return transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }
);

// Then, handle actions in your reducers:
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.entities = action.payload;
    });

    builder.addCase(fetchTransactions.rejected, (state) => {
      state.loading = "failed";
    });
    builder.addCase(addNewTransaction.fulfilled, (state, action) => {
      // Add new transaction at the beginning (most recent)
      state.entities = [action.payload, ...state.entities];
    });
  },
});

export const transactionReducer = transactionSlice.reducer;
