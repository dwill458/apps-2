/**
 * SplashScreen - Entry screen with logo and animation
 * Shows for 2-3 seconds before redirecting to Onboarding or Home
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore, useOnboardingStore } from '../store/useStore';
import { Sprout } from 'lucide-react';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const onboardingCompleted = useOnboardingStore((state) => state.completed);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user has completed onboarding
      if (user && (user.onboardingCompleted || onboardingCompleted)) {
        navigate('/home');
      } else {
        navigate('/onboarding/welcome');
      }
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigate, user, onboardingCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 flex items-center justify-center overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo with plant icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <Sprout className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-emerald-400/40 rounded-3xl blur-xl -z-10"
            />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4"
        >
          Cozy Growth
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-emerald-700 dark:text-emerald-300 font-medium"
        >
          Cultivate tiny steps, bloom into your best self
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>

      {/* Fade out animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.2, duration: 0.3 }}
        exit={{ opacity: 1 }}
        className="absolute inset-0 bg-white dark:bg-gray-900 pointer-events-none"
      />
    </div>
  );
};

export default SplashScreen;
