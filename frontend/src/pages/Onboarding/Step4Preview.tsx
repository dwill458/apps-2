/**
 * Step4Preview - Show generated tasks preview
 * Fourth step of the onboarding flow
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore, useGoalsStore } from '../../store/useStore';
import { OnboardingLayout } from './OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Check, Clock, Zap, Loader2 } from 'lucide-react';
import type { MicroTask } from '../../types';

export const Step4Preview = () => {
  const navigate = useNavigate();
  const { nextStep, previousStep } = useOnboardingStore();
  const { goals, addTasks, updateGoal } = useGoalsStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedTasks, setGeneratedTasks] = useState<MicroTask[]>([]);

  const currentGoal = goals[goals.length - 1]; // Get the most recently added goal

  useEffect(() => {
    // Simulate AI task generation (in production, this would call the backend)
    const generateTasks = () => {
      const sampleTasks: MicroTask[] = [
        {
          id: crypto.randomUUID(),
          goalId: currentGoal?.id || '',
          title: 'Research and gather resources',
          description: 'Spend 5 minutes finding helpful tutorials or guides',
          durationMinutes: 5,
          difficulty: 'easy',
          spicyFlag: false,
          orderIndex: 0,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          goalId: currentGoal?.id || '',
          title: 'Set up your workspace',
          description: 'Prepare everything you need to get started',
          durationMinutes: 10,
          difficulty: 'easy',
          spicyFlag: false,
          orderIndex: 1,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          goalId: currentGoal?.id || '',
          title: 'Complete the first small step',
          description: 'Start with the easiest part to build momentum',
          durationMinutes: 15,
          difficulty: 'medium',
          spicyFlag: false,
          orderIndex: 2,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          goalId: currentGoal?.id || '',
          title: 'Review and adjust your approach',
          description: 'Check your progress and plan next steps',
          durationMinutes: 5,
          difficulty: 'easy',
          spicyFlag: false,
          orderIndex: 3,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];

      setTimeout(() => {
        setGeneratedTasks(sampleTasks);
        addTasks(sampleTasks);
        if (currentGoal) {
          updateGoal(currentGoal.id, {
            totalSteps: sampleTasks.length,
            estimatedHours: sampleTasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60,
          });
        }
        setIsGenerating(false);
      }, 2000);
    };

    generateTasks();
  }, [currentGoal, addTasks, updateGoal]);

  const handleBack = () => {
    previousStep();
    navigate('/onboarding/goal');
  };

  const handleContinue = () => {
    nextStep();
    navigate('/onboarding/setup');
  };

  return (
    <OnboardingLayout onBack={handleBack}>
      <GlassCard className="p-8 md:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
            {isGenerating ? 'Breaking It Down...' : 'Your First Steps'}
          </h2>
          <p className="text-lg text-emerald-700 dark:text-emerald-300">
            {isGenerating
              ? 'Creating tiny, achievable steps for your goal'
              : `Here's how we'll tackle: "${currentGoal?.title}"`}
          </p>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
              <p className="text-emerald-700 dark:text-emerald-300 text-center">
                Analyzing your goal and creating personalized tasks...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 mb-8"
            >
              {/* Task list */}
              {generatedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 dark:bg-white/10 rounded-lg p-4 border-2 border-emerald-200 dark:border-emerald-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {task.difficulty}
                        </span>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                  </div>
                </motion.div>
              ))}

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: generatedTasks.length * 0.1 + 0.2 }}
                className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-4 mt-6"
              >
                <p className="text-sm text-emerald-800 dark:text-emerald-200 text-center">
                  <span className="font-semibold">{generatedTasks.length} steps</span> •{' '}
                  <span className="font-semibold">
                    ~{Math.round(generatedTasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60)} hours
                  </span>{' '}
                  total • We'll take it one tiny step at a time
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleContinue}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Looks Great!
            </Button>
          </motion.div>
        )}
      </GlassCard>
    </OnboardingLayout>
  );
};

export default Step4Preview;
