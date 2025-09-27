import { databases, account, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite.config';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  start_date: string;
  end_date: string;
}

export const budgetService = {
  getBudgets: async () => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );

      const budgets = response.documents.map(doc => ({
        id: doc.$id,
        user_id: doc.user_id,
        category_id: doc.category_id,
        amount: doc.amount,
        period: doc.period as 'monthly' | 'weekly' | 'yearly',
        start_date: doc.start_date,
        end_date: doc.end_date
      }));

      return budgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  createBudget: async (budget: Omit<Budget, 'id' | 'user_id'>) => {
    try {
      const user = await account.get();

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        ID.unique(),
        {
          user_id: user.$id,
          category_id: budget.category_id,
          amount: budget.amount,
          period: budget.period,
          start_date: budget.start_date,
          end_date: budget.end_date
        }
      );

      return {
        id: document.$id,
        user_id: document.user_id,
        category_id: document.category_id,
        amount: document.amount,
        period: document.period,
        start_date: document.start_date,
        end_date: document.end_date
      };
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },

  updateBudget: async (budgetId: string, updates: Partial<Budget>) => {
    try {
      const updateData: any = {};

      if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.period !== undefined) updateData.period = updates.period;
      if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
      if (updates.end_date !== undefined) updateData.end_date = updates.end_date;

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        budgetId,
        updateData
      );

      return {
        id: document.$id,
        user_id: document.user_id,
        category_id: document.category_id,
        amount: document.amount,
        period: document.period,
        start_date: document.start_date,
        end_date: document.end_date
      };
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },

  deleteBudget: async (budgetId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        budgetId
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },

  getBudgetsByCategory: async (categoryId: string) => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        [
          Query.equal('user_id', user.$id),
          Query.equal('category_id', categoryId),
          Query.orderDesc('$createdAt')
        ]
      );

      const budgets = response.documents.map(doc => ({
        id: doc.$id,
        user_id: doc.user_id,
        category_id: doc.category_id,
        amount: doc.amount,
        period: doc.period as 'monthly' | 'weekly' | 'yearly',
        start_date: doc.start_date,
        end_date: doc.end_date
      }));

      return budgets;
    } catch (error) {
      console.error('Error fetching budgets by category:', error);
      throw error;
    }
  },

  getBudgetsByPeriod: async (period: 'monthly' | 'weekly' | 'yearly') => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        [
          Query.equal('user_id', user.$id),
          Query.equal('period', period),
          Query.orderDesc('$createdAt')
        ]
      );

      const budgets = response.documents.map(doc => ({
        id: doc.$id,
        user_id: doc.user_id,
        category_id: doc.category_id,
        amount: doc.amount,
        period: doc.period as 'monthly' | 'weekly' | 'yearly',
        start_date: doc.start_date,
        end_date: doc.end_date
      }));

      return budgets;
    } catch (error) {
      console.error('Error fetching budgets by period:', error);
      throw error;
    }
  },

  getBudgetUtilization: async (budgetId: string) => {
    try {
      // Get the budget
      const budget = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        budgetId
      );

      // Get transactions for this category within the budget period
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        [
          Query.equal('user_id', user.$id),
          Query.equal('category_id', budget.category_id),
          Query.equal('type', 'expense'),
          Query.greaterThanEqual('date', budget.start_date),
          Query.lessThanEqual('date', budget.end_date)
        ]
      );

      const totalSpent = response.documents.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      const utilization = (totalSpent / budget.amount) * 100;

      return {
        budgetId: budget.$id,
        budgetAmount: budget.amount,
        totalSpent,
        remaining: budget.amount - totalSpent,
        utilization: Math.round(utilization * 100) / 100,
        isOverBudget: totalSpent > budget.amount,
        transactionCount: response.documents.length
      };
    } catch (error) {
      console.error('Error getting budget utilization:', error);
      throw error;
    }
  },

  // Helper method for backward compatibility
  setBudget: async (
    category: string,
    budget: number,
    month: string,
    year: number
  ) => {
    // Convert month abbreviation to month index (0-11)
    const monthAbbrs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIndex = monthAbbrs.indexOf(month.toLowerCase());

    if (monthIndex === -1) {
      throw new Error(`Invalid month: ${month}`);
    }

    const startDate = new Date(year, monthIndex, 1).toISOString();
    const endDate = new Date(year, monthIndex + 1, 0).toISOString();

    return budgetService.createBudget({
      category_id: category,
      amount: budget,
      period: 'monthly',
      start_date: startDate,
      end_date: endDate
    });
  }
};