import { databases, account, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite.config';
import { Todo, NewTodo } from '@/types/finance';

export const todoService = {
  getTodos: async (): Promise<Todo[]> => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TODOS,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );

      const todos = response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description || '',
        completed: doc.completed,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt
      }));

      return todos;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  createTodo: async (todo: NewTodo): Promise<Todo> => {
    try {
      const user = await account.get();

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TODOS,
        ID.unique(),
        {
          user_id: user.$id,
          title: todo.title,
          description: todo.description || '',
          completed: todo.completed
        }
      );

      return {
        id: document.$id,
        title: document.title,
        description: document.description,
        completed: document.completed,
        createdAt: document.$createdAt,
        updatedAt: document.$updatedAt
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodo: async (todoId: string, updates: Partial<NewTodo>): Promise<Todo> => {
    try {
      const updateData: any = {};

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TODOS,
        todoId,
        updateData
      );

      return {
        id: document.$id,
        title: document.title,
        description: document.description,
        completed: document.completed,
        createdAt: document.$createdAt,
        updatedAt: document.$updatedAt
      };
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  deleteTodo: async (todoId: string): Promise<{ success: boolean }> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.TODOS,
        todoId
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  toggleTodoComplete: async (todoId: string, completed: boolean): Promise<Todo> => {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TODOS,
        todoId,
        { completed }
      );

      return {
        id: document.$id,
        title: document.title,
        description: document.description,
        completed: document.completed,
        createdAt: document.$createdAt,
        updatedAt: document.$updatedAt
      };
    } catch (error) {
      console.error('Error toggling todo complete:', error);
      throw error;
    }
  }
};
