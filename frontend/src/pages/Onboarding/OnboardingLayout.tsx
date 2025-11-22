/**
 * OnboardingLayout - Wrapper component for onboarding flow
 * Displays progress dots and handles navigation between steps
 */
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../store/useStore';
import { ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';

interface OnboardingLayoutProps {
  children: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnboardingLayout = ({
  children,
  onBack,
  showBack = true,
}: OnboardingLayoutProps) => {
  const { currentStep, totalSteps } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-200/20 dark:bg-teal-800/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with back button */}
        <div className="p-6">
          {showBack && currentStep > 0 && onBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'rounded-full transition-all duration-300',
                index === currentStep
                  ? 'w-8 h-3 bg-emerald-500'
                  : index < currentStep
                  ? 'w-3 h-3 bg-emerald-400'
                  : 'w-3 h-3 bg-emerald-200 dark:bg-emerald-800'
              )}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
