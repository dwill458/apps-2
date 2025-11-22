/**
 * COZY GROWTH - API Service Layer Index
 * Central export point for all API services
 */

export * from './auth';
export * from './goals';
export * from './tasks';
export * from './journal';
export * from './streaks';
export * from './user';

// Re-export API objects for direct use
export { goalsApi } from './goals';
export { tasksApi } from './tasks';
export { journalApi } from './journal';
export { streaksApi } from './streaks';
export { userApi } from './user';
