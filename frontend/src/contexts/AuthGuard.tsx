/**
 * AuthGuard - Protected Route Wrapper
 *
 * Redirects unauthenticated users to login
 * Shows loading state while checking auth
 * Passes children through if authenticated
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireOnboarding?: boolean;
}

/**
 * Protected route component
 *
 * @param children - Components to render if authenticated
 * @param redirectTo - Path to redirect if not authenticated (default: /login)
 * @param requireOnboarding - If true, also check if onboarding is completed
 *
 * @example
 * ```tsx
 * <Route
 *   path="/home"
 *   element={
 *     <AuthGuard>
 *       <HomePage />
 *     </AuthGuard>
 *   }
 * />
 * ```
 */
export function AuthGuard({
  children,
  redirectTo = '/login',
  requireOnboarding = false,
}: AuthGuardProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Cozy loading spinner */}
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-sage-light border-t-sage rounded-full animate-spin"></div>
          </div>
          <p className="text-sage-dark font-medium">Loading your cozy space...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to onboarding if required and not completed
  if (requireOnboarding && profile && !profile.onboardingCompleted) {
    return <Navigate to="/onboarding/welcome" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

/**
 * Reverse AuthGuard - Redirects authenticated users away from login/signup
 *
 * @example
 * ```tsx
 * <Route
 *   path="/login"
 *   element={
 *     <GuestOnly>
 *       <LoginPage />
 *     </GuestOnly>
 *   }
 * />
 * ```
 */
export function GuestOnly({
  children,
  redirectTo = '/home',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-sage-light border-t-sage rounded-full animate-spin"></div>
          </div>
          <p className="text-sage-dark font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is not authenticated, show login/signup
  return <>{children}</>;
}

export default AuthGuard;
