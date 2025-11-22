/**
 * LoginPage - Authentication Page for Cozy Growth
 *
 * Features:
 * - Email magic link authentication
 * - Google OAuth sign in
 * - Cozy Growth styling with glassmorphism
 * - Success/error messages
 * - Redirect after successful login
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  /**
   * Handle email magic link sign in
   */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email);

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setMagicLinkSent(true);
        toast.success('Magic link sent! Check your email.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google OAuth sign in
   */
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
        setIsLoading(false);
      }
      // Google OAuth redirects, so we don't need to handle success here
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrorMessage(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light via-cream to-lavender-light flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach/5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sage to-sage-dark rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-sage-dark mb-2">Welcome to Cozy Growth</h1>
            <p className="text-sage/80">Your ADHD-friendly productivity companion</p>
          </div>

          {/* Success Message */}
          {magicLinkSent && (
            <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Magic link sent!</p>
                <p className="text-xs text-green-700 mt-1">
                  Check your email and click the link to sign in. You can close this page.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Authentication error</p>
                <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || magicLinkSent}
            className="w-full mb-6 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 shadow-sm transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-sage">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-dark mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading || magicLinkSent}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || magicLinkSent || !email}
              className="w-full py-3 px-4 bg-gradient-to-r from-sage to-sage-dark hover:from-sage-dark hover:to-sage text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-sage disabled:hover:to-sage-dark"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending magic link...
                </span>
              ) : magicLinkSent ? (
                'Magic link sent!'
              ) : (
                'Send magic link'
              )}
            </button>
          </form>

          {/* Info Text */}
          <p className="mt-6 text-center text-xs text-sage/70">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-sage/80">
          New to Cozy Growth? Just sign in to get started
        </p>
      </div>
    </div>
  );
}
