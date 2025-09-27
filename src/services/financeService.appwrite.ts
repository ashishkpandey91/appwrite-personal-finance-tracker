import { databases, account, DATABASE_ID, COLLECTIONS, ID, Query } from './appwrite.config';
import { Transaction } from '@/types/finance';

export const financeService = {
  getTransactions: async (limit = 100, offset = 0) => {
    try {
      const user = await account.get();

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('date'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      // Transform Appwrite documents to match frontend Transaction type
      const transactions = response.documents.map(doc => ({
        id: doc.$id,
        amount: doc.amount,
        type: doc.type as 'income' | 'expense',
        category: doc.category_id,
        description: doc.description,
        date: doc.date,
        timestamp: doc.$createdAt
      }));

      return {
        transactions,
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  addTransaction: async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const user = await account.get();

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        ID.unique(),
        {
          user_id: user.$id,
          amount: transaction.amount,
          type: transaction.type,
          category_id: transaction.category,
          description: transaction.description || '',
          date: transaction.date || new Date().toISOString()
        }
      );

      return {
        id: document.$id,
        amount: document.amount,
        type: document.type,
        category: document.category_id,
        description: document.description,
        date: document.date,
        timestamp: document.$createdAt
      };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  updateTransaction: async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      const updateData: any = {};

      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.category !== undefined) updateData.category_id = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = updates.date;

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        transactionId,
        updateData
      );

      return {
        id: document.$id,
        amount: document.amount,
        type: document.type,
        category: document.category_id,
        description: document.description,
        date: document.date,
        timestamp: document.$createdAt
      };
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (transactionId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        transactionId
      );

      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  getFinancialSummary: async (period?: string) => {
    try {
      const user = await account.get();

      // Get all transactions for the user
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        [
          Query.equal('user_id', user.$id),
          Query.orderDesc('date')
        ]
      );

      const transactions = response.documents;

      // Calculate summary
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          totalIncome += transaction.amount;
        } else {
          totalExpense += transaction.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      // Get category-wise breakdown
      const categoryBreakdown: Record<string, number> = {};

      transactions.forEach(transaction => {
        const categoryId = transaction.category_id;
        if (!categoryBreakdown[categoryId]) {
          categoryBreakdown[categoryId] = 0;
        }
        if (transaction.type === 'expense') {
          categoryBreakdown[categoryId] += transaction.amount;
        }
      });

      return {
        totalIncome,
        totalExpense,
        balance,
        categoryBreakdown,
        transactionCount: transactions.length,
        period: period || 'all-time'
      };
    } catch (error) {
      console.error('Error getting financial summary:', error);
      throw error;
    }
  },

  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const user = await account.get();

      const queries = [
        Query.equal('user_id', user.$id),
        Query.orderDesc('date')
      ];

      if (startDate) {
        queries.push(Query.greaterThanEqual('date', startDate));
      }

      if (endDate) {
        queries.push(Query.lessThanEqual('date', endDate));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        queries
      );

      const transactions = response.documents;

      // Group by month
      const monthlyData: Record<string, { income: number; expense: number }> = {};

      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
      });

      return {
        monthlyData,
        totalTransactions: transactions.length,
        dateRange: {
          start: startDate || 'all-time',
          end: endDate || 'current'
        }
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};