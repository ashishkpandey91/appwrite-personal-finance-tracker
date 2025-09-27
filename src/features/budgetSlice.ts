import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { newBudget } from "@/types/finance";
import { budgetService } from "@/services/budgetService.appwrite";

type Budget = {
  id: string;
  category: string;
  budget: number;
  month: string;
  year: string;
  expense: string;
};

type BudgetState = {
  entities: Budget[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  createStatus: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: BudgetState = {
  entities: [],
  loading: "idle",
  createStatus: "idle",
};

export const getBudgets = createAsyncThunk("budgets/get", async (_, { getState }) => {
  try {
    const budgets = await budgetService.getBudgets();
    const state = getState() as any;
    const transactions = state.transaction?.entities || [];

    // Transform to match the expected format
    return budgets.map(b => {
      const budgetMonth = new Date(b.start_date).getMonth();
      const budgetYear = new Date(b.start_date).getFullYear();

      // Calculate actual expenses for this budget's category and period
      const expense = transactions
        .filter((t: any) => {
          if (t.type !== 'expense') return false;
          if (String(t.category) !== String(b.category_id)) return false;

          const transDate = new Date(t.date);
          return transDate.getMonth() === budgetMonth &&
                 transDate.getFullYear() === budgetYear;
        })
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      return {
        id: b.id,
        category: b.category_id,
        budget: b.amount,
        month: new Date(b.start_date).toLocaleString('default', { month: 'short' }).toLowerCase(),
        year: String(budgetYear),
        expense: String(expense)
      };
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
});

export const createBudget = createAsyncThunk(
  "budgets/create",
  async (newBudget: newBudget, { getState }) => {
    console.log("createBudget thunk called with:", newBudget);
    try {
      console.log("Calling budgetService.setBudget...");
      const budget = await budgetService.setBudget(
        newBudget.category,
        Number(newBudget.budget),
        newBudget.month,
        Number(newBudget.year)
      );
      console.log("Budget created successfully:", budget);

      // Calculate existing expenses for this category and month
      const state = getState() as any;
      const transactions = state.transaction?.entities || [];
      const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(newBudget.month.toLowerCase());

      const expense = transactions
        .filter((t: any) => {
          if (t.type !== 'expense') return false;
          if (String(t.category) !== String(newBudget.category)) return false;

          const transDate = new Date(t.date);
          return transDate.getMonth() === monthIndex &&
                 transDate.getFullYear() === Number(newBudget.year);
        })
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      return {
        id: budget.id,
        category: budget.category_id,
        budget: budget.amount,
        month: newBudget.month,
        year: newBudget.year,
        expense: String(expense)
      };
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  }
);
// Update Budget
export const updateBudget = createAsyncThunk(
  "budgets/update",
  async (updatedBudget: Budget, { getState }) => {
    try {
      const budget = await budgetService.updateBudget(updatedBudget.id, {
        amount: updatedBudget.budget,
        category_id: updatedBudget.category,
        period: 'monthly',
        start_date: new Date(Number(updatedBudget.year), ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(updatedBudget.month), 1).toISOString(),
        end_date: new Date(Number(updatedBudget.year), ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(updatedBudget.month) + 1, 0).toISOString()
      });

      // Calculate actual expenses for this budget's category and period
      const state = getState() as any;
      const transactions = state.transaction?.entities || [];
      const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(updatedBudget.month.toLowerCase());

      const expense = transactions
        .filter((t: any) => {
          if (t.type !== 'expense') return false;
          if (String(t.category) !== String(updatedBudget.category)) return false;

          const transDate = new Date(t.date);
          return transDate.getMonth() === monthIndex &&
                 transDate.getFullYear() === Number(updatedBudget.year);
        })
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      return {
        id: budget.id,
        category: budget.category_id,
        budget: budget.amount,
        month: updatedBudget.month,
        year: updatedBudget.year,
        expense: String(expense)
      };
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  }
);

// Delete Budget
export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id: string) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(getBudgets.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload;
      })
      .addCase(getBudgets.rejected, (state) => {
        state.loading = "failed";
      })

      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.entities = [action.payload, ...state.entities];
      })
      .addCase(createBudget.rejected, (state) => {
        state.createStatus = "failed";
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })

      // Delete budget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.entities = state.entities.filter((b) => b.id !== action.payload);
      });
  },
});

export const budgetReducer = budgetSlice.reducer;
