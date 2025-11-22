/**
 * Calendar Page - Streak Tracking
 * Monthly calendar view with activity tracking and streak visualization
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Calendar as CalendarIcon,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { GlassCard, Button } from '@/components/ui'
import { useUserStore, useStreaksStore } from '@/store/useStore'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  differenceInDays,
} from 'date-fns'

export const Calendar = () => {
  const { user } = useUserStore()
  const { streakLogs, getStreakForDate } = useStreaksStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const getActivityLevel = (date: Date): number => {
    const dateString = format(date, 'yyyy-MM-dd')
    const log = getStreakForDate(dateString)
    if (!log || !log.didShowUp) return 0
    // Activity level based on minutes: 0 (none), 1 (low), 2 (medium), 3 (high)
    if (log.totalMinutes === 0) return 0
    if (log.totalMinutes < 15) return 1
    if (log.totalMinutes < 30) return 2
    return 3
  }

  const selectedLog = selectedDate
    ? getStreakForDate(format(selectedDate, 'yyyy-MM-dd'))
    : null

  const currentStreak = user?.currentStreak || 0
  const longestStreak = user?.longestStreak || 0
  const totalDays = user?.totalDaysShowedUp || 0
  const graceBlooms = user?.graceBlooms || 0

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Your Growth Calendar
        </h1>
        <p className="text-gray-400 text-lg">
          Track your consistency and celebrate your progress
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Current Streak</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{currentStreak}</span>
            <span className="text-gray-400">days</span>
          </div>
          {currentStreak > 0 && (
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: Math.min(currentStreak, 7) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-2 h-8 bg-gradient-to-t from-primary-500 to-primary-400 rounded-full"
                  style={{ height: `${20 + i * 4}px` }}
                />
              ))}
              {currentStreak > 7 && (
                <span className="text-xs text-gray-400 ml-2">+{currentStreak - 7}</span>
              )}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-warning-500/20 text-warning-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Longest Streak</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{longestStreak}</span>
            <span className="text-gray-400">days</span>
          </div>
          {longestStreak > currentStreak && (
            <p className="text-xs text-gray-500 mt-3">
              You can beat this! Keep going!
            </p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success-500/20 text-success-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Days Showed Up</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-success-400">{totalDays}</span>
            <span className="text-gray-400">total</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Every day counts!
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-400">Grace Blooms</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-pink-400">{graceBlooms}</span>
            <span className="text-gray-400">available</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Protection for missed days
          </p>
        </GlassCard>
      </div>

      {/* Calendar */}
      <GlassCard className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrevMonth}
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
            />
            <Button
              onClick={() => setCurrentMonth(new Date())}
              variant="ghost"
              size="sm"
            >
              Today
            </Button>
            <Button
              onClick={handleNextMonth}
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const activityLevel = getActivityLevel(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)

            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative aspect-square rounded-lg p-2 text-sm font-medium
                  transition-all cursor-pointer
                  ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                  ${isSelected ? 'ring-2 ring-primary-400' : ''}
                  ${isTodayDate ? 'ring-2 ring-warning-400' : ''}
                  ${activityLevel === 0 ? 'bg-white/5 hover:bg-white/10' : ''}
                  ${activityLevel === 1 ? 'bg-success-500/20 hover:bg-success-500/30' : ''}
                  ${activityLevel === 2 ? 'bg-success-500/40 hover:bg-success-500/50' : ''}
                  ${activityLevel === 3 ? 'bg-success-500/60 hover:bg-success-500/70' : ''}
                `}
              >
                <span className={isTodayDate ? 'text-warning-400' : 'text-white'}>
                  {format(day, 'd')}
                </span>
                {activityLevel > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-success-400 rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Activity Legend */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Activity Level:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Less</span>
              <div className="w-4 h-4 rounded bg-white/5" />
              <div className="w-4 h-4 rounded bg-success-500/20" />
              <div className="w-4 h-4 rounded bg-success-500/40" />
              <div className="w-4 h-4 rounded bg-success-500/60" />
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Selected Day Details */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                {isToday(selectedDate) && (
                  <span className="px-3 py-1 rounded-full bg-warning-500/20 text-warning-400 text-sm font-medium">
                    Today
                  </span>
                )}
              </div>

              {selectedLog && selectedLog.didShowUp ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-400">
                        {selectedLog.tasksCompleted}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Tasks Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-400">
                        {selectedLog.totalMinutes}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Minutes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl">🌸</div>
                      <p className="text-sm text-gray-400 mt-1">Productive Day</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-success-500/10 border border-success-500/20">
                    <Flame className="w-5 h-5 text-success-400" />
                    <p className="text-sm text-success-400 font-medium">
                      You showed up on this day!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌱</div>
                  <p className="text-gray-400">
                    {differenceInDays(new Date(), selectedDate) > 0
                      ? 'No activity recorded for this day'
                      : 'Start your journey today!'}
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vine Visualization for Current Streak */}
      {currentStreak >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-success-400" />
              Your Growth Vine
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {Array.from({ length: currentStreak }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="flex-shrink-0"
                >
                  {i % 3 === 2 ? (
                    <div className="text-3xl">🌸</div>
                  ) : (
                    <div className="text-2xl">🌿</div>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">
              {currentStreak} days of consistent growth!
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

export default Calendar
