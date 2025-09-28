import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import CONF from '@/conf';

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(CONF.get('APPWRITE_URL') || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(CONF.get('APPWRITE_PROJECT_ID'));

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = CONF.get('APPWRITE_DATABASE_ID');
export const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets'
};

// Export utilities
export { ID, Query };

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};