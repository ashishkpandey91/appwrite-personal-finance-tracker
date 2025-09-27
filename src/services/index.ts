// Export Appwrite direct services
export { default as authService } from './auth.appwrite';
export { financeService } from './financeService.appwrite';
export { categoryService } from './categoryService.appwrite';
export { budgetService } from './budgetService.appwrite';
export type { Category } from './categoryService.appwrite';
export type { Budget } from './budgetService.appwrite';

// Export the Appwrite client config for direct use if needed
export * from './appwrite.config';