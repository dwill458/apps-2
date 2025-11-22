/**
 * Step5Setup - Set daily goal and reminder intensity
 * Final step of the onboarding flow
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboardingStore, useUserStore } from '../../store/useStore';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Clock, Bell, BellOff, BellRing, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReminderIntensity } from '../../types';

const dailyGoalOptions = [10, 15, 20, 30, 45, 60];

const reminderOptions: Array<{
  id: ReminderIntensity;
  icon: any;
  label: string;
  description: string;
}> = [
  {
    id: 'rarely',
    icon: BellOff,
    label: 'Rarely',
    description: 'Just a gentle nudge once a day',
  },
  {
    id: 'sometimes',
    icon: Bell,
    label: 'Sometimes',
    description: 'A few friendly reminders',
  },
  {
    id: 'often',
    icon: BellRing,
    label: 'Often',
    description: 'Regular check-ins to keep you on track',
  },
];

export const Step5Setup = () => {
  const navigate = useNavigate();
  const { previousStep, completeOnboarding } = useOnboardingStore();
  const { user, setUser } = useUserStore();

  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 20);
  const [reminderIntensity, setReminderIntensity] = useState<ReminderIntensity>(
    user?.reminderIntensity || 'sometimes'
  );

  const handleBack = () => {
    previousStep();
    navigate('/onboarding/preview');
  };

  const handleComplete = () => {
    if (user) {
      setUser({
        ...user,
        dailyGoalMinutes,
        reminderIntensity,
        onboardingCompleted: true,
      });
    }
    completeOnboarding();
    navigate('/home');
  };

  return (
    <OnboardingLayout onBack={handleBack}>
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
              <Clock className="w-10 h-10 text-white" strokeWidth={2.5} />
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            Set Your Daily Goal
          </h2>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            How much time feels achievable each day?
          </p>
        </motion.div>

        {/* Daily goal selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">
            Daily Goal (minutes)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {dailyGoalOptions.map((minutes) => (
              <motion.button
                key={minutes}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDailyGoalMinutes(minutes)}
                className={clsx(
                  'py-4 px-6 rounded-xl font-semibold transition-all duration-200',
                  dailyGoalMinutes === minutes
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 hover:bg-white/70 dark:hover:bg-white/20'
                )}
              >
                {minutes}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 text-center">
            Don't worry, you can always adjust this later
          </p>
        </motion.div>

        {/* Reminder intensity selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-3">
            Reminder Intensity
          </label>
          <div className="space-y-3">
            {reminderOptions.map(({ id, icon: Icon, label, description }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReminderIntensity(id)}
                className={clsx(
                  'w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 text-left',
                  reminderIntensity === id
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 hover:bg-white/70 dark:hover:bg-white/20'
                )}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{label}</div>
                  <div
                    className={clsx(
                      'text-sm',
                      reminderIntensity === id
                        ? 'text-white/90'
                        : 'text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Complete button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleComplete}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Start Growing!
          </Button>
        </motion.div>

        {/* Encouraging message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-emerald-600 dark:text-emerald-400 mt-6"
        >
          You're all set! Let's start cultivating your first tiny step.
        </motion.p>
      </GlassCard>
    </OnboardingLayout>
  );
};

export default Step5Setup;
