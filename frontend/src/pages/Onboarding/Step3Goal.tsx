/**
 * Step3Goal - Enter first goal
 * Third step of the onboarding flow
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboardingStore, useUserStore, useGoalsStore } from '../../store/useStore';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GlassCard } from '../../components/ui/GlassCard';
import { Target, Sparkles } from 'lucide-react';

export const Step3Goal = () => {
  const navigate = useNavigate();
  const { nextStep, previousStep } = useOnboardingStore();
  const user = useUserStore((state) => state.user);
  const addGoal = useGoalsStore((state) => state.addGoal);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [error, setError] = useState('');

  const handleBack = () => {
    previousStep();
    navigate('/onboarding/avatar');
  };

  const handleContinue = () => {
    if (!goalTitle.trim()) {
      setError('Please enter a goal');
      return;
    }

    if (goalTitle.trim().length < 3) {
      setError('Goal must be at least 3 characters');
      return;
    }

    // Create the goal (we'll generate tasks in the next step)
    const newGoal = {
      id: crypto.randomUUID(),
      userId: user?.id || '',
      title: goalTitle.trim(),
      description: goalDescription.trim() || undefined,
      plantType: 'sunflower', // Default plant type
      plantStage: 1 as const,
      status: 'active' as const,
      totalSteps: 0, // Will be updated after AI generates tasks
      completedSteps: 0,
      estimatedHours: 0,
      createdAt: new Date().toISOString(),
    };

    addGoal(newGoal);
    nextStep();
    navigate('/onboarding/preview');
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
              <Target className="w-10 h-10 text-white" strokeWidth={2.5} />
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
            What's One Thing You'd Like to Achieve?
          </h2>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            Don't worry, we'll break it down into tiny, doable steps
          </p>
        </motion.div>

        {/* Goal input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2"
            >
              Your Goal
            </label>
            <Input
              id="goal"
              type="text"
              value={goalTitle}
              onChange={(e) => {
                setGoalTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g., Learn Spanish, Build a website, Get organized"
              className="text-lg"
              autoFocus
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

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2"
            >
              More details (optional)
            </label>
            <textarea
              id="description"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="Any specific details about your goal?"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-0 transition-colors text-emerald-900 dark:text-emerald-100 placeholder-emerald-400 dark:placeholder-emerald-600 resize-none"
              rows={3}
            />
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

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"
        >
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
            Examples of great goals:
          </p>
          <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
            <li>• Learn to cook 5 healthy recipes</li>
            <li>• Organize my closet</li>
            <li>• Start a daily journaling habit</li>
            <li>• Build a simple website</li>
          </ul>
        </motion.div>
      </GlassCard>
    </OnboardingLayout>
  );
};

export default Step3Goal;
