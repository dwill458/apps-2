/**
 * Cozy Growth - Main App Component
 * ADHD-friendly productivity app with nature-based gamification
 */
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useUserStore, useOnboardingStore } from './store/useStore';
import { sampleUser } from './data/sampleData';

// Auth
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard, GuestOnly } from './contexts/AuthGuard';

// Pages
import LoginPage from './pages/LoginPage';
import SplashScreen from './pages/SplashScreen';
import OnboardingLayout from './pages/Onboarding/OnboardingLayout';
import Step1Welcome from './pages/Onboarding/Step1Welcome';
import Step2Avatar from './pages/Onboarding/Step2Avatar';
import Step3Goal from './pages/Onboarding/Step3Goal';
import Step4Preview from './pages/Onboarding/Step4Preview';
import Step5Setup from './pages/Onboarding/Step5Setup';
import Home from './pages/Home';
import TaskSuggestion from './pages/TaskFlow/TaskSuggestion';
import TaskTimer from './pages/TaskFlow/TaskTimer';
import TaskComplete from './pages/TaskFlow/TaskComplete';
import DebugLoop from './pages/TaskFlow/DebugLoop';
import FallbackTask from './pages/TaskFlow/FallbackTask';
import Garden from './pages/Garden';
import GardenPath from './pages/GardenPath';
import Journal from './pages/Journal';
import Calendar from './pages/Calendar';
import CozySettings from './pages/CozySettings';

// Protected route wrapper (legacy - keeping for onboarding check)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const { completed } = useOnboardingStore();

  if (!user || !completed) {
    return <Navigate to="/onboarding/welcome" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, setUser } = useUserStore();
  const { completed } = useOnboardingStore();

  useEffect(() => {
    // Initialize with sample user for demo purposes
    // In production, this would check authentication
    if (!user && !completed) {
      // First-time user - will go through onboarding
      console.log('New user - starting onboarding');
    } else if (!user && completed) {
      // Returning user - load from backend/localStorage
      setUser(sampleUser);
    }
  }, [user, completed, setUser]);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-cream font-sans">
          {/* Toast notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#2C5F4F',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#4A8C76',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E57373',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SplashScreen />} />

            {/* Login Route - Redirect if already authenticated */}
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <LoginPage />
                </GuestOnly>
              }
            />

            {/* Onboarding Flow - Requires authentication */}
            <Route
              path="/onboarding"
              element={
                <AuthGuard>
                  <OnboardingLayout />
                </AuthGuard>
              }
            >
              <Route path="welcome" element={<Step1Welcome />} />
              <Route path="avatar" element={<Step2Avatar />} />
              <Route path="goal" element={<Step3Goal />} />
              <Route path="preview" element={<Step4Preview />} />
              <Route path="setup" element={<Step5Setup />} />
            </Route>

            {/* Main App (Protected) */}
            <Route
              path="/home"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />

            {/* Task Flow (Protected) */}
            <Route
              path="/task/suggest"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <TaskSuggestion />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/task/timer"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <TaskTimer />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/task/complete"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <TaskComplete />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/task/debug"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <DebugLoop />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/task/fallback"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <FallbackTask />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />

            {/* Other Pages (Protected) */}
            <Route
              path="/garden"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <Garden />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/garden/:goalId"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <GardenPath />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/journal"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/calendar"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthGuard>
                  <ProtectedRoute>
                    <CozySettings />
                  </ProtectedRoute>
                </AuthGuard>
              }
            />

            {/* Catch all - redirect to home or splash */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
