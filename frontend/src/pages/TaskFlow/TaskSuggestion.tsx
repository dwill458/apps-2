/**
 * TaskSuggestion - Display suggested task with action buttons
 * Shows the suggested task with "Do It", "Easier", and "Skip" options
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useTaskFlowStore,
  useGoalsStore,
  useUserStore,
} from '../../store/useStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Clock,
  Zap,
  ChevronDown,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { MicroTask, Goal } from '../../types';

export const TaskSuggestion = () => {
  const navigate = useNavigate();
  const {
    currentEnergy,
    currentDuration,
    suggestedTask,
    setSuggestedTask,
    startChain,
  } = useTaskFlowStore();
  const { tasks, goals } = useGoalsStore();
  const user = useUserStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState<MicroTask | null>(null);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);

  useEffect(() => {
    // Simulate AI task suggestion (in production, this would call the backend)
    const suggestTask = () => {
      const pendingTasks = tasks.filter(
        (t) =>
          t.status === 'pending' &&
          t.durationMinutes <= currentDuration &&
          (currentEnergy === 'high' ||
            (currentEnergy === 'medium' && t.difficulty !== 'hard') ||
            (currentEnergy === 'low' && t.difficulty === 'easy'))
      );

      if (pendingTasks.length > 0) {
        const selectedTask = pendingTasks[0]; // In production, AI would select the best match
        const goal = goals.find((g) => g.id === selectedTask.goalId);

        setCurrentTask(selectedTask);
        setCurrentGoal(goal || null);
        setSuggestedTask({
          task: selectedTask,
          goal: goal!,
          reasoning: `This task matches your ${currentEnergy} energy level and ${currentDuration}-minute time window.`,
        });
      }

      setTimeout(() => setIsLoading(false), 1500);
    };

    suggestTask();
  }, [currentEnergy, currentDuration, tasks, goals, setSuggestedTask]);

  const handleDoIt = () => {
    if (currentTask) {
      startChain(currentTask);
      navigate('/task/timer');
    }
  };

  const handleEasier = () => {
    // In production, this would request an easier task from the backend
    navigate('/task/fallback');
  };

  const handleSkip = () => {
    navigate('/task/debug');
  };

  const handleBack = () => {
    navigate('/home');
  };

  const difficultyColors = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-amber-600 dark:text-amber-400',
    hard: 'text-red-600 dark:text-red-400',
  };

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
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {isLoading ? (
          /* Loading state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-lg text-emerald-700 dark:text-emerald-300">
              Finding the perfect task for you...
            </p>
          </motion.div>
        ) : currentTask && currentGoal ? (
          /* Task suggestion */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Context info */}
            <div className="mb-6 flex items-center justify-center gap-4 text-sm text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="capitalize">{currentEnergy} energy</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentDuration} minutes</span>
              </div>
            </div>

            {/* Goal context */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 rounded-full">
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Working on:
                </span>
                <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                  {currentGoal.title}
                </span>
              </div>
            </motion.div>

            {/* Task card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-8 mb-8">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="inline-block mb-4"
                  >
                    <Sparkles className="w-12 h-12 text-amber-400" fill="currentColor" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                    {currentTask.title}
                  </h2>
                  {currentTask.description && (
                    <p className="text-lg text-emerald-700 dark:text-emerald-300 max-w-lg mx-auto">
                      {currentTask.description}
                    </p>
                  )}
                </div>

                {/* Task metadata */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{currentTask.durationMinutes} min</span>
                  </div>
                  <div
                    className={clsx(
                      'flex items-center gap-2 font-medium',
                      difficultyColors[currentTask.difficulty]
                    )}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="capitalize">{currentTask.difficulty}</span>
                  </div>
                  {currentTask.spicyFlag && (
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                      <span>🌶️</span>
                      <span>Spicy</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleDoIt}
                    variant="primary"
                    size="lg"
                    className="w-full text-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                    Yes, Let's Do It!
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleEasier}
                      variant="ghost"
                      size="md"
                      className="text-emerald-700 dark:text-emerald-300"
                    >
                      <ChevronDown className="w-4 h-4" />
                      Something Easier
                    </Button>
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      size="md"
                      className="text-emerald-700 dark:text-emerald-300"
                    >
                      Skip for Now
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* AI reasoning (optional) */}
            {suggestedTask?.reasoning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                  "{suggestedTask.reasoning}"
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* No tasks available */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <GlassCard className="p-8 text-center max-w-md">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                No Tasks Available
              </h2>
              <p className="text-emerald-700 dark:text-emerald-300 mb-6">
                You've completed all your tasks! Time to add a new goal or celebrate your progress.
              </p>
              <Button
                onClick={() => navigate('/goals')}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Add New Goal
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskSuggestion;
