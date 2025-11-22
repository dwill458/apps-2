/**
 * Garden Path Page - Single Goal's Task List
 * Visual representation of goal as organic vine with task cards
 */
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Circle,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  MoreVertical,
  Trash2,
} from 'lucide-react'
import { GlassCard, Button } from '@/components/ui'
import { useGoalsStore } from '@/store/useStore'
import type { MicroTask, TaskDifficulty } from '@/types'
import { useState } from 'react'

export const GardenPath = () => {
  const { goalId } = useParams<{ goalId: string }>()
  const navigate = useNavigate()
  const { goals, getTasksByGoal, updateTask, completeTask, deleteGoal } = useGoalsStore()
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  const goal = goals.find((g) => g.id === goalId)
  const tasks = goalId ? getTasksByGoal(goalId) : []

  if (!goal) {
    return (
      <div className="flex items-center justify-center h-96">
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400">Goal not found</p>
          <Button
            onClick={() => navigate('/garden')}
            variant="secondary"
            className="mt-4"
          >
            Back to Garden
          </Button>
        </GlassCard>
      </div>
    )
  }

  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const pendingTasks = tasks.filter((t) => t.status === 'pending')
  const currentTask = pendingTasks[0]
  const progress = goal.totalSteps > 0
    ? Math.round((goal.completedSteps / goal.totalSteps) * 100)
    : 0

  const handleTaskClick = (task: MicroTask) => {
    if (task.status === 'completed') {
      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
    } else if (task.id === currentTask?.id) {
      // Start task or navigate to task flow
      setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
    }
  }

  const handleDeleteGoal = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      deleteGoal(goal.id)
      navigate('/garden')
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => navigate('/garden')}
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Back to Garden
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">{getPlantEmoji(goal.plantStage)}</span>
              <div>
                <h1 className="text-4xl font-bold text-gradient">
                  {goal.title}
                </h1>
                {goal.description && (
                  <p className="text-gray-400 mt-2">{goal.description}</p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteGoal}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-danger-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Growth Progress</h3>
            <span className="text-2xl font-bold text-success-400">{progress}%</span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-success-500 via-success-400 to-primary-400 rounded-full relative"
            >
              {progress > 0 && (
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full"
                />
              )}
            </motion.div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{completedTasks.length} completed</span>
            <span>{pendingTasks.length} remaining</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Garden Path Visualization */}
      <div className="relative">
        {/* Vine Path */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-success-500/40 via-success-400/40 to-primary-400/40 rounded-full" />

        {/* Tasks along the path */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              isCurrent={task.id === currentTask?.id}
              isExpanded={expandedTaskId === task.id}
              onClick={() => handleTaskClick(task)}
              onComplete={() => completeTask(task.id)}
            />
          ))}

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GlassCard className="p-8 text-center ml-16">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-gray-400">
                  No tasks yet. Add tasks to start growing this goal!
                </p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// Task Card Component
const TaskCard = ({
  task,
  index,
  isCurrent,
  isExpanded,
  onClick,
  onComplete,
}: {
  task: MicroTask
  index: number
  isCurrent: boolean
  isExpanded: boolean
  onClick: () => void
  onComplete: () => void
}) => {
  const isCompleted = task.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-16"
    >
      {/* Node on the vine */}
      <div className="absolute left-[1.6rem] top-6 z-10">
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        ) : isCurrent ? (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-6 h-6 rounded-full bg-primary-400 border-2 border-white"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/40" />
        )}
      </div>

      {/* Task Card */}
      <GlassCard
        className={`p-5 cursor-pointer transition-all ${
          isCurrent
            ? 'ring-2 ring-primary-400 bg-primary-500/10'
            : isCompleted
            ? 'opacity-75 hover:opacity-100'
            : 'hover:bg-white/15'
        }`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`text-lg font-semibold ${
                  isCompleted ? 'line-through text-gray-400' : 'text-white'
                }`}
              >
                {task.title}
              </h3>
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-primary-400" />
                </motion.div>
              )}
            </div>

            {task.description && isExpanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-400 mb-3"
              >
                {task.description}
              </motion.p>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{task.durationMinutes}m</span>
              </div>
              <div className="flex items-center gap-1">
                {getDifficultyBadge(task.difficulty)}
              </div>
              {task.spicyFlag && (
                <div className="flex items-center gap-1 text-warning-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">Spicy</span>
                </div>
              )}
            </div>
          </div>

          {isCurrent && !isCompleted && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              variant="success"
              size="sm"
            >
              Complete
            </Button>
          )}

          {isCompleted && (
            <div className="text-4xl">🌸</div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

// Helper functions
const getPlantEmoji = (stage: number): string => {
  const emojis: Record<number, string> = {
    1: '🌱',
    2: '🌿',
    3: '🪴',
    4: '🌳',
    5: '🌸',
  }
  return emojis[stage] || '🌱'
}

const getDifficultyBadge = (difficulty: TaskDifficulty) => {
  const config = {
    easy: { label: 'Easy', color: 'text-success-400' },
    medium: { label: 'Medium', color: 'text-warning-400' },
    hard: { label: 'Hard', color: 'text-danger-400' },
  }
  const { label, color } = config[difficulty]
  return <span className={`text-xs font-medium ${color}`}>{label}</span>
}

export default GardenPath
