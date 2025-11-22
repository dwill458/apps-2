/**
 * TaskTimer - Simple timer with pause/resume functionality
 * Displays countdown timer during task execution
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskFlowStore, useGoalsStore } from '../../store/useStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Play, Pause, CheckCircle, X } from 'lucide-react';

export const TaskTimer = () => {
  const navigate = useNavigate();
  const {
    chainState,
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTaskFlowStore();
  const goals = useGoalsStore((state) => state.goals);

  const currentTask = chainState.currentTask;
  const currentGoal = currentTask
    ? goals.find((g) => g.id === currentTask.goalId)
    : null;

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);

  useEffect(() => {
    if (currentTask && !timerState.isRunning && !timerState.isPaused) {
      startTimer(currentTask.durationMinutes);
    }
  }, [currentTask, startTimer, timerState.isRunning, timerState.isPaused]);

  useEffect(() => {
    if (!timerState.isRunning || !timerState.startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (timerState.startTime || 0)) / 1000);
      const total = timerState.durationMinutes * 60;
      const remaining = Math.max(0, total - elapsed);

      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        navigate('/task/complete');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime, timerState.durationMinutes, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    if (timerState.isRunning) {
      pauseTimer();
    } else if (timerState.isPaused) {
      resumeTimer();
    }
  };

  const handleComplete = () => {
    stopTimer();
    navigate('/task/complete');
  };

  const handleQuit = () => {
    stopTimer();
    navigate('/home');
  };

  const progress = timerState.durationMinutes
    ? (timeRemaining / (timerState.durationMinutes * 60)) * 100
    : 0;

  if (!currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No task in progress</p>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
        {/* Goal context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 rounded-full">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Working on:
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
              {currentGoal?.title}
            </span>
          </div>
        </motion.div>

        {/* Main timer card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <GlassCard className="p-8 md:p-12">
            {/* Task title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                {currentTask.title}
              </h2>
              {currentTask.description && (
                <p className="text-emerald-700 dark:text-emerald-300">
                  {currentTask.description}
                </p>
              )}
            </div>

            {/* Circular timer */}
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-emerald-200 dark:text-emerald-800"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 120}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{
                      strokeDashoffset: (2 * Math.PI * 120 * (100 - progress)) / 100,
                    }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-emerald-900 dark:text-emerald-100">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                    {timerState.isPaused ? 'Paused' : 'Remaining'}
                  </div>
                </div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handlePauseResume}
                  variant="ghost"
                  size="lg"
                  className="text-emerald-700 dark:text-emerald-300"
                >
                  {timerState.isRunning ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Resume
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleComplete}
                  variant="primary"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Done!
                </Button>
              </div>

              <Button
                onClick={() => setShowConfirmQuit(true)}
                variant="ghost"
                size="md"
                className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4" />
                Quit
              </Button>
            </div>

            {/* Motivational message */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-center mt-8"
            >
              <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                You're doing great! One tiny step at a time.
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Confirm quit modal */}
        <AnimatePresence>
          {showConfirmQuit && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowConfirmQuit(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
              >
                <GlassCard className="p-6 max-w-sm w-full">
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                    Quit Task?
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300 mb-6">
                    Your progress won't be saved. Are you sure you want to quit?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setShowConfirmQuit(false)}
                      variant="ghost"
                      size="md"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleQuit}
                      variant="danger"
                      size="md"
                    >
                      Quit
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskTimer;
