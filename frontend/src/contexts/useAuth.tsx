/**
 * useAuth Hook - Access authentication context
 *
 * Provides easy access to auth state and methods
 */
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom hook to access authentication context
 *
 * @returns Authentication context with user, session, and methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isLoading, signIn, signOut } = useAuth();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return user ? (
 *     <button onClick={signOut}>Sign Out</button>
 *   ) : (
 *     <button onClick={() => signIn('email@example.com')}>Sign In</button>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuth;
