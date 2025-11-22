/**
 * TaskComplete - Celebration screen with Chain of Action prompt
 * Shows celebration and asks if user wants to continue with another task
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
import { Sparkles, TrendingUp, Home, ArrowRight } from 'lucide-react';

export const TaskComplete = () => {
  const navigate = useNavigate();
  const {
    chainState,
    incrementChain,
    endChain,
    updateTodayStats,
    todayStats,
    resetTimer,
  } = useTaskFlowStore();
  const { completeTask, goals } = useGoalsStore();
  const { user, addBloomPoints, incrementStreak } = useUserStore();

  const [celebrationComplete, setCelebrationComplete] = useState(false);

  const currentTask = chainState.currentTask;
  const currentGoal = currentTask
    ? goals.find((g) => g.id === currentTask.goalId)
    : null;

  // Calculate bloom points
  const basePoints = 10;
  const chainBonus = chainState.count > 1 ? chainState.count * 5 : 0;
  const totalPoints = basePoints + chainBonus;

  useEffect(() => {
    if (currentTask) {
      // Mark task as complete
      completeTask(currentTask.id);

      // Update daily stats
      updateTodayStats({
        minutesCompleted: todayStats.minutesCompleted + currentTask.durationMinutes,
        tasksCompleted: todayStats.tasksCompleted + 1,
        bloomPointsEarned: todayStats.bloomPointsEarned + totalPoints,
        chainCount: chainState.isActive ? todayStats.chainCount : todayStats.chainCount + 1,
        goalsWorkedOn: Array.from(new Set([...todayStats.goalsWorkedOn, currentTask.goalId])),
      });

      // Add bloom points
      addBloomPoints(totalPoints);

      // Update streak (if first task of the day)
      if (todayStats.tasksCompleted === 0) {
        incrementStreak();
      }

      // Reset timer
      resetTimer();
    }

    // Celebration animation duration
    const timer = setTimeout(() => {
      setCelebrationComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentTask, completeTask, addBloomPoints, updateTodayStats, incrementStreak, resetTimer]);

  const handleContinue = () => {
    incrementChain();
    navigate('/task/suggestion');
  };

  const handleFinish = () => {
    endChain();
    navigate('/home');
  };

  if (!currentTask || !currentGoal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 overflow-hidden">
      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 1,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            }}
            className="absolute"
          >
            <Sparkles
              className="text-amber-400"
              fill="currentColor"
              style={{
                width: `${Math.random() * 20 + 20}px`,
                height: `${Math.random() * 20 + 20}px`,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
        {/* Celebration message */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="mb-8"
        >
          <div className="text-8xl text-center">🎉</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-8 md:p-12 text-center">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-4"
            >
              Amazing Work!
            </motion.h1>

            {/* Task completed */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-emerald-700 dark:text-emerald-300 mb-6"
            >
              You completed: <strong>{currentTask.title}</strong>
            </motion.p>

            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-8">
                {/* Bloom points */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-amber-400" fill="currentColor" />
                    <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                      +{totalPoints}
                    </span>
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    Bloom Points
                  </div>
                </div>

                {/* Chain count */}
                {chainState.isActive && chainState.count > 1 && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-6 h-6 text-teal-400" />
                      <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                        {chainState.count}
                      </span>
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">
                      Chain Streak
                    </div>
                  </div>
                )}
              </div>

              {chainBonus > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 mt-4"
                >
                  Chain Bonus: +{chainBonus} points!
                </motion.p>
              )}
            </motion.div>

            {/* Goal progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                <span>{currentGoal.title}</span>
                <span>
                  {currentGoal.completedSteps} / {currentGoal.totalSteps} steps
                </span>
              </div>
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentGoal.completedSteps / currentGoal.totalSteps) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
            </motion.div>

            {/* Chain of Action prompt */}
            {celebrationComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                  Keep the momentum going?
                </h3>
                <Button
                  onClick={handleContinue}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <ArrowRight className="w-5 h-5" />
                  Yes! Another Tiny Step
                </Button>
                <Button
                  onClick={handleFinish}
                  variant="ghost"
                  size="lg"
                  className="w-full"
                >
                  <Home className="w-5 h-5" />
                  I'm Done for Now
                </Button>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Encouraging message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="text-center text-emerald-600 dark:text-emerald-400 mt-6 italic"
        >
          Every step forward is growth. You're doing great!
        </motion.p>
      </div>
    </div>
  );
};

export default TaskComplete;
