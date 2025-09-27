import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice";
import { transactionReducer } from "@/features/transactionSlice";
import { budgetReducer  } from "@/features/budgetSlice";
import { categoryReducer } from "@/features/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    category: categoryReducer,
    budget: budgetReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
