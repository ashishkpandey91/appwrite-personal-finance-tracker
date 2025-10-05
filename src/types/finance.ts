import { number } from "zod";

export type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
};

export type newBudget = {
  category: string;
  budget: number;
  month: string;
  year: string;
};

export type Budget = {
  id: number;
  category: string;
  budget: number;
  month: string;
  year: string;
  expense: number;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewTodo = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
