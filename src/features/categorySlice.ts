import { Category } from "@/types/finance";
import { categoryService } from "@/services/categoryService.appwrite";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserCategories = createAsyncThunk(
  "categories/get",
  async () => {
    try {
      const categories = await categoryService.getCategories();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
);

export const addNewCategory = createAsyncThunk(
  "categories/add",
  async (categoryData: { name: string; type: 'income' | 'expense' }) => {
    try {
      const category = await categoryService.createCategory({
        name: categoryData.name,
        type: categoryData.type,
        icon: '📁',
        color: '#666'
      });
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
);

type CategoryState = {
  entities: Category[];
  loading: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: CategoryState = {
  loading: "idle",
  entities: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserCategories.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(getUserCategories.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.entities = action.payload;
    });

    builder.addCase(addNewCategory.fulfilled, (state, action) => {
      state.entities = [action.payload, ...state.entities];
    });
  },
});

export const categoryReducer = categorySlice.reducer;
