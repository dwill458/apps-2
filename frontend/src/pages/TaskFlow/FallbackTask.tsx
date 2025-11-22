/**
 * FallbackTask - 1-minute alternative task
 * Offers a simple, low-friction alternative when the suggested task feels too big
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTaskFlowStore, useGoalsStore } from '../../store/useStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Clock,
  Heart,
  Sparkles,
  ChevronRight,
  Home,
} from 'lucide-react';

const fallbackTasks = [
  {
    id: 'organize',
    title: 'Organize one small thing',
    description: 'Pick one item and put it where it belongs',
    icon: '📦',
  },
  {
    id: 'breathe',
    title: 'Take 3 deep breaths',
    description: 'Pause and center yourself with intentional breathing',
    icon: '🌬️',
  },
  {
    id: 'hydrate',
    title: 'Drink a glass of water',
    description: 'Take care of yourself with some hydration',
    icon: '💧',
  },
  {
    id: 'stretch',
    title: 'Do a quick stretch',
    description: 'Move your body for 1 minute',
    icon: '🧘',
  },
  {
    id: 'note',
    title: 'Write one thought down',
    description: 'Capture what\'s on your mind right now',
    icon: '📝',
  },
];

export const FallbackTask = () => {
  const navigate = useNavigate();
  const { chainState, startChain } = useTaskFlowStore();
  const goals = useGoalsStore((state) => state.goals);

  const currentTask = chainState.currentTask;
  const currentGoal = currentTask
    ? goals.find((g) => g.id === currentTask.goalId)
    : null;

  const [selectedFallback, setSelectedFallback] = useState(fallbackTasks[0]);
  const [completed, setCompleted] = useState(false);

  const handleBack = () => {
    navigate('/task/suggestion');
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleSkipToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
      {/* Background */}
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

        {!completed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Main card */}
            <GlassCard className="p-8 md:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart className="w-16 h-16 text-pink-400" fill="currentColor" />
                </motion.div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                  Let's Start Super Small
                </h2>
                <p className="text-lg text-emerald-700 dark:text-emerald-300">
                  Sometimes just showing up is enough. Pick a 1-minute win:
                </p>
              </div>

              {/* Fallback task options */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {fallbackTasks.map((task) => (
                  <motion.button
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFallback(task)}
                    className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-200 text-left ${
                      selectedFallback.id === task.id
                        ? 'bg-emerald-500 text-white shadow-lg scale-105'
                        : 'bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl flex-shrink-0">{task.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{task.title}</div>
                      <div
                        className={`text-sm ${
                          selectedFallback.id === task.id
                            ? 'text-white/90'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {task.description}
                      </div>
                    </div>
                    <Clock
                      className={`w-5 h-5 flex-shrink-0 ${
                        selectedFallback.id === task.id
                          ? 'text-white'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Selected task highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-6 mb-6"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{selectedFallback.icon}</div>
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    {selectedFallback.title}
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    {selectedFallback.description}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Just 1 minute</span>
                </div>
              </motion.div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleComplete}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <ChevronRight className="w-5 h-5" />
                  I Did It!
                </Button>
                <Button
                  onClick={handleSkipToHome}
                  variant="ghost"
                  size="md"
                  className="w-full"
                >
                  <Home className="w-4 h-4" />
                  Maybe Later
                </Button>
              </div>

              {/* Encouraging message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-sm text-emerald-600 dark:text-emerald-400 mt-6 italic"
              >
                Every tiny step counts. You're showing up, and that's what matters.
              </motion.p>
            </GlassCard>
          </motion.div>
        ) : (
          /* Completion celebration */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[60vh] flex items-center justify-center"
          >
            <GlassCard className="p-8 md:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="mb-6"
              >
                <div className="text-7xl mb-4">🎉</div>
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto" fill="currentColor" />
              </motion.div>

              <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                You Showed Up!
              </h2>
              <p className="text-lg text-emerald-700 dark:text-emerald-300 mb-6">
                That's a win. Small steps add up to big growth.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" fill="currentColor" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                    +5 Bloom Points
                  </span>
                </div>
              </div>

              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-6 italic">
                Redirecting to home...
              </p>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FallbackTask;
