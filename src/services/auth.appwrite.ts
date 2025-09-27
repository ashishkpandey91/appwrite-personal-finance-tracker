import { account, databases, DATABASE_ID, COLLECTIONS, ID } from './appwrite.config';
import { handleError } from '@/utils/errorHandler';

const authService = {
  signup: async (name: string, email: string, password: string) => {
    try {
      // Create account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Try to create user document in database
      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id,
          {
            email,
            full_name: name
          }
        );
      } catch (dbError: any) {
        console.warn('Could not create user profile in database:', dbError);
        // Continue with signup even if database write fails
        // The user can still authenticate, just without profile data
      }

      // Create session (auto-login after signup)
      await account.createEmailPasswordSession(email, password);

      // Create default categories for new user
      await createDefaultCategories(user.$id);

      return {
        data: {
          user: {
            id: user.$id,
            email: user.email,
            name: user.name
          },
          message: "User created successfully"
        },
        error: null
      };
    } catch (error: unknown) {
      return handleError(error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      // Create session
      const session = await account.createEmailPasswordSession(email, password);

      // Get user details
      const user = await account.get();

      return {
        data: {
          user: {
            id: user.$id,
            email: user.email,
            name: user.name
          },
          sessionId: session.$id,
          message: "Login successful"
        },
        error: null
      };
    } catch (error: unknown) {
      return handleError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const user = await account.get();

      // Try to get user document from database for additional info
      let full_name = user.name;
      try {
        const userDoc = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          user.$id
        );
        full_name = userDoc.full_name || user.name;
      } catch (dbError) {
        console.warn('Could not fetch user profile from database:', dbError);
        // Use the account name as fallback
      }

      return {
        data: {
          id: user.$id,
          email: user.email,
          name: user.name,
          full_name: full_name
        },
        error: null
      };
    } catch (error: unknown) {
      return { data: null, error: "No authenticated user" };
    }
  },

  logout: async () => {
    try {
      // Delete current session
      await account.deleteSession('current');
      return { data: { message: "Logout successful" }, error: null };
    } catch (error: unknown) {
      return handleError(error);
    }
  },

  // Helper function to check if user is logged in
  isAuthenticated: async () => {
    try {
      const user = await account.get();
      return !!user;
    } catch {
      return false;
    }
  }
};

// Helper function to create default categories for new users
async function createDefaultCategories(userId: string) {
  const defaultCategories = [
    { name: 'Groceries', type: 'expense', icon: '🛒', color: '#4CAF50' },
    { name: 'Others', type: 'income', icon: '💵', color: '#9C27B0' }
  ];

  const promises = defaultCategories.map(category =>
    databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CATEGORIES,
      ID.unique(),
      {
        user_id: userId,
        ...category
      }
    )
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error creating default categories:', error);
  }
}

export default authService;