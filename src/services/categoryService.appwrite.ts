import { databases, account, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite.config';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  user_id: string;
}

export const categoryService = {
  getCategories: async () => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [
          Query.equal('user_id', user.$id),
          Query.orderAsc('name')
        ]
      );

      const categories = response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        type: doc.type as 'income' | 'expense',
        icon: doc.icon,
        color: doc.color,
        user_id: doc.user_id
      }));

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategoriesByType: async (type: 'income' | 'expense') => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [
          Query.equal('user_id', user.$id),
          Query.equal('type', type),
          Query.orderAsc('name')
        ]
      );

      const categories = response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        type: doc.type as 'income' | 'expense',
        icon: doc.icon,
        color: doc.color,
        user_id: doc.user_id
      }));

      return categories;
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw error;
    }
  },

  createCategory: async (category: Omit<Category, 'id' | 'user_id'>) => {
    try {
      const user = await account.get();

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        ID.unique(),
        {
          user_id: user.$id,
          name: category.name,
          type: category.type,
          icon: category.icon || null,
          color: category.color || null
        }
      );

      return {
        id: document.$id,
        name: document.name,
        type: document.type,
        icon: document.icon,
        color: document.color,
        user_id: document.user_id
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (categoryId: string, updates: Partial<Category>) => {
    try {
      const updateData: any = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.color !== undefined) updateData.color = updates.color;

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        categoryId,
        updateData
      );

      return {
        id: document.$id,
        name: document.name,
        type: document.type,
        icon: document.icon,
        color: document.color,
        user_id: document.user_id
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        categoryId
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  getCategoryById: async (categoryId: string) => {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        categoryId
      );

      return {
        id: document.$id,
        name: document.name,
        type: document.type,
        icon: document.icon,
        color: document.color,
        user_id: document.user_id
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
};