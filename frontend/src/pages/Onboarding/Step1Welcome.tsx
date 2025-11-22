/**
 * Step1Welcome - Welcome screen with name input
 * First step of the onboarding flow
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboardingStore, useUserStore } from '../../store/useStore';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GlassCard } from '../../components/ui/GlassCard';
import { Sprout, Sparkles } from 'lucide-react';

export const Step1Welcome = () => {
  const navigate = useNavigate();
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const setUser = useUserStore((state) => state.setUser);
  const existingUser = useUserStore((state) => state.user);

  const [name, setName] = useState(existingUser?.name || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Create or update user with name
    const newUser = existingUser
      ? { ...existingUser, name: name.trim() }
      : {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: '',
          avatarCharacter: 'person' as const,
          avatarColor: 'sage' as const,
          reminderIntensity: 'sometimes' as const,
          dailyGoalMinutes: 20,
          onboardingCompleted: false,
          graceBlooms: 3,
          bloomPoints: 0,
          totalDaysShowedUp: 0,
          longestStreak: 0,
          currentStreak: 0,
          lastActiveDate: null,
          createdAt: new Date().toISOString(),
          settings: {
            quietHoursEnabled: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '08:00',
            notificationSound: true,
            notificationVibration: true,
            appearance: 'auto' as const,
            textSize: 'comfortable' as const,
            dyslexiaFont: false,
            reduceMotion: false,
            highContrast: false,
            defaultEnergyLevel: 'medium' as const,
            preferredDuration: 10 as const,
            taskSuggestionsMode: 'surprise' as const,
            chainIntensity: 'keep_momentum' as const,
            debugPrompts: false,
            learningMode: true,
          },
        };

    setUser(newUser);
    nextStep();
    navigate('/onboarding/avatar');
  };

  return (
    <OnboardingLayout showBack={false}>
      <GlassCard className="p-8 md:p-12">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <Sprout className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-amber-400" fill="currentColor" />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Welcome to Cozy Growth
          </h1>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-lg mx-auto">
            Let's start your journey to achieving your goals, one tiny step at a time.
          </p>
        </motion.div>

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2"
            >
              What should we call you?
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="text-lg"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleContinue();
                }
              }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={handleContinue}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </motion.div>

        {/* Encouraging message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-emerald-600 dark:text-emerald-400 mt-8"
        >
          This will only take a minute. We'll set up your personalized experience.
        </motion.p>
      </GlassCard>
    </OnboardingLayout>
  );
};

export default Step1Welcome;
