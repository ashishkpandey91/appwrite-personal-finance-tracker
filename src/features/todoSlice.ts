import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Todo, NewTodo } from "@/types/finance";
import { todoService } from "@/services/todoService.appwrite";

type TodoState = {
  entities: Todo[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  createStatus: "idle" | "pending" | "succeeded" | "failed";
  updateStatus: "idle" | "pending" | "succeeded" | "failed";
  deleteStatus: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: TodoState = {
  entities: [],
  loading: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

// Fetch all todos
export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
  try {
    const todos = await todoService.getTodos();
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
});

// Create a new todo
export const createTodo = createAsyncThunk(
  "todos/create",
  async (newTodo: NewTodo) => {
    try {
      const todo = await todoService.createTodo(newTodo);
      return todo;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  }
);

// Update a todo
export const updateTodo = createAsyncThunk(
  "todos/update",
  async ({ id, updates }: { id: string; updates: Partial<NewTodo> }) => {
    try {
      const todo = await todoService.updateTodo(id, updates);
      return todo;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  }
);

// Delete a todo
export const deleteTodo = createAsyncThunk(
  "todos/delete",
  async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
);

// Toggle todo completed status
export const toggleTodoComplete = createAsyncThunk(
  "todos/toggleComplete",
  async ({ id, completed }: { id: string; completed: boolean }) => {
    try {
      const todo = await todoService.toggleTodoComplete(id, completed);
      return todo;
    } catch (error) {
      console.error("Error toggling todo:", error);
      throw error;
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.loading = "failed";
      })

      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.entities = [action.payload, ...state.entities];
      })
      .addCase(createTodo.rejected, (state) => {
        state.createStatus = "failed";
      })

      // Update todo
      .addCase(updateTodo.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.entities.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state) => {
        state.updateStatus = "failed";
      })

      // Delete todo
      .addCase(deleteTodo.pending, (state) => {
        state.deleteStatus = "pending";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.entities = state.entities.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state) => {
        state.deleteStatus = "failed";
      })

      // Toggle complete
      .addCase(toggleTodoComplete.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(toggleTodoComplete.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.entities.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })
      .addCase(toggleTodoComplete.rejected, (state) => {
        state.updateStatus = "failed";
      });
  },
});

export const todoReducer = todoSlice.reducer;
