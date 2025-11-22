/**
 * Home - Main Daily Bloom screen
 * The primary interface for daily task cultivation
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useUserStore,
  useTaskFlowStore,
  useGoalsStore,
  useStreaksStore,
} from '../store/useStore';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import {
  Flame,
  Sparkles,
  Battery,
  BatteryMedium,
  BatteryLow,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Menu,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { EnergyLevel, TaskDuration } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { currentStreak, longestStreak, bloomPoints } = user || {};
  const { currentEnergy, currentDuration, setEnergy, setDuration, todayStats } =
    useTaskFlowStore();
  const goals = useGoalsStore((state) => state.goals);

  const [showWins, setShowWins] = useState(false);

  const activeGoals = goals.filter((g) => g.status === 'active');
  const dailyProgress = user
    ? Math.min((todayStats.minutesCompleted / user.dailyGoalMinutes) * 100, 100)
    : 0;

  const energyOptions: Array<{ level: EnergyLevel; icon: any; label: string; color: string }> = [
    { level: 'low', icon: BatteryLow, label: 'Low', color: 'text-amber-500' },
    { level: 'medium', icon: BatteryMedium, label: 'Medium', color: 'text-emerald-500' },
    { level: 'high', icon: Battery, label: 'High', color: 'text-teal-500' },
  ];

  const durationOptions: TaskDuration[] = [3, 5, 10, 15];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStartTask = () => {
    navigate('/task/suggestion');
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />
          </button>
        </div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
            {getGreeting()}, {user?.name || 'Friend'}
          </h1>
          <div className="flex items-center gap-4">
            {/* Streak badge */}
            <button
              onClick={() => navigate('/streak')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Flame className="w-5 h-5" fill="currentColor" />
              <span>{currentStreak || 0} day streak</span>
            </button>
            {/* Bloom points */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/10 rounded-full text-emerald-700 dark:text-emerald-300 font-semibold">
              <Sparkles className="w-5 h-5 text-amber-400" fill="currentColor" />
              <span>{bloomPoints || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Daily Bloom Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                Daily Bloom
              </h2>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {todayStats.minutesCompleted} / {user?.dailyGoalMinutes || 20} min
              </span>
            </div>

            {/* Progress bar with vine */}
            <div className="relative h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              />
              {/* Flower icons along the vine */}
              {dailyProgress >= 25 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center text-white text-xs">
                    🌸
                  </div>
                </motion.div>
              )}
              {dailyProgress >= 50 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs">
                    🌺
                  </div>
                </motion.div>
              )}
              {dailyProgress >= 75 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs">
                    🌻
                  </div>
                </motion.div>
              )}
              {dailyProgress >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 bg-rose-400 rounded-full flex items-center justify-center text-white text-xs">
                    🌹
                  </div>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Energy Reserve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
              Energy Reserve
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {energyOptions.map(({ level, icon: Icon, label, color }) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEnergy(level)}
                  className={clsx(
                    'py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200',
                    currentEnergy === level
                      ? 'bg-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20'
                  )}
                >
                  <Icon className={clsx('w-6 h-6', currentEnergy === level ? 'text-white' : color)} />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Duration Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
              Duration
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {durationOptions.map((duration) => (
                <motion.button
                  key={duration}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(duration)}
                  className={clsx(
                    'py-3 px-4 rounded-xl flex flex-col items-center gap-1 transition-all duration-200',
                    currentDuration === duration
                      ? 'bg-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-white/50 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 hover:bg-white/70 dark:hover:bg-white/20'
                  )}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold">{duration}m</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Button
            onClick={handleStartTask}
            variant="primary"
            size="lg"
            className="w-full text-xl py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl"
          >
            <Sparkles className="w-6 h-6" />
            Cultivate One Tiny Step
          </Button>
        </motion.div>

        {/* Today's Wins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <button
              onClick={() => setShowWins(!showWins)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Today's Wins
                </h3>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  ({todayStats.tasksCompleted})
                </span>
              </div>
              {showWins ? (
                <ChevronUp className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              )}
            </button>

            <AnimatePresence>
              {showWins && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-2"
                >
                  {todayStats.tasksCompleted > 0 ? (
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">
                      <p>✓ {todayStats.tasksCompleted} tasks completed</p>
                      <p>✓ {todayStats.minutesCompleted} minutes of focused work</p>
                      <p>✓ {todayStats.bloomPointsEarned} bloom points earned</p>
                      {todayStats.chainCount > 0 && (
                        <p>✓ {todayStats.chainCount} chain{todayStats.chainCount > 1 ? 's' : ''} completed</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 italic">
                      No wins yet today. Start with one tiny step!
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Navigation (placeholder) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-emerald-200 dark:border-emerald-800 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
          <button className="p-2 text-emerald-600 dark:text-emerald-400">
            <div className="text-2xl">🏡</div>
          </button>
          <button
            onClick={() => navigate('/goals')}
            className="p-2 text-emerald-600 dark:text-emerald-400"
          >
            <div className="text-2xl">🌱</div>
          </button>
          <button
            onClick={() => navigate('/journal')}
            className="p-2 text-emerald-600 dark:text-emerald-400"
          >
            <div className="text-2xl">📔</div>
          </button>
          <button
            onClick={() => navigate('/garden')}
            className="p-2 text-emerald-600 dark:text-emerald-400"
          >
            <div className="text-2xl">🌺</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
