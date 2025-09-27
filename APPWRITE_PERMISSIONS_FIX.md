# Appwrite Database Permissions Configuration

## Problem
Getting 401 Unauthorized errors when trying to create documents in the database collections.

## Solution
You need to configure proper permissions for each collection in your Appwrite Console.

### Steps to Fix:

1. **Login to Appwrite Console**
   - Go to https://cloud.appwrite.io/
   - Navigate to your project

2. **Configure Collection Permissions**

   For each collection (users, transactions, categories, budgets), set the following permissions:

   ### Users Collection
   - Navigate to: Databases → Your Database → users collection → Settings → Permissions
   - Add these permissions:
     - **Create**: Users
     - **Read**: User (Document Security - Owner only)
     - **Update**: User (Document Security - Owner only)
     - **Delete**: User (Document Security - Owner only)

   ### Transactions Collection
   - Navigate to: Databases → Your Database → transactions collection → Settings → Permissions
   - Add these permissions:
     - **Create**: Users
     - **Read**: User (Document Security - Owner only)
     - **Update**: User (Document Security - Owner only)
     - **Delete**: User (Document Security - Owner only)

   ### Categories Collection
   - Navigate to: Databases → Your Database → categories collection → Settings → Permissions
   - Add these permissions:
     - **Create**: Users
     - **Read**: User (Document Security - Owner only)
     - **Update**: User (Document Security - Owner only)
     - **Delete**: User (Document Security - Owner only)

   ### Budgets Collection
   - Navigate to: Databases → Your Database → budgets collection → Settings → Permissions
   - Add these permissions:
     - **Create**: Users
     - **Read**: User (Document Security - Owner only)
     - **Update**: User (Document Security - Owner only)
     - **Delete**: User (Document Security - Owner only)

3. **Document Security (Important!)**

   For each collection, you should also set up Document Security to ensure users can only access their own data:

   - In each collection settings, go to "Document Security"
   - Enable "Document Security"
   - This will use the `user_id` field to automatically restrict access to document owners

## Permission Types Explained:

- **Users**: Any authenticated user
- **User**: The specific user who owns the document
- **Guests**: Non-authenticated users (not recommended for this app)
- **Any**: All users including guests (not recommended for this app)

## Testing After Configuration:

1. Try signing up a new user
2. Check if the user document is created in the database
3. Try creating a transaction or category
4. Verify that users can only see their own data

## Alternative: API Key Approach (Not Recommended for Frontend)

If you're testing and need quick access, you can use an API key, but this should NEVER be used in production frontend code:
- Create an API key in Settings → API Keys
- Add the key to your requests
- This bypasses user permissions (security risk in frontend!)

## Current Code Status:

The code has been updated to handle permission errors gracefully:
- Signup will succeed even if database write fails
- Users can still authenticate without profile data in database
- The app will use fallback data from the auth account