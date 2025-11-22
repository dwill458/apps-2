/**
 * TaskCard Component - Cozy Growth Design System
 * Task display card with title, description, duration, and difficulty badge
 */
import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export type TaskDifficulty = 'easy' | 'medium' | 'hard'

interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  duration?: number // in minutes
  difficulty?: TaskDifficulty
  icon?: ReactNode
  completed?: boolean
  onComplete?: () => void
  hover?: boolean
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    color: 'sage-400',
    bgColor: 'sage-100',
    icon: '🌱',
  },
  medium: {
    label: 'Medium',
    color: 'sage-600',
    bgColor: 'sage-200',
    icon: '🌿',
  },
  hard: {
    label: 'Hard',
    color: 'moss-600',
    bgColor: 'moss-200',
    icon: '🌳',
  },
}

export const TaskCard = ({
  title,
  description,
  duration,
  difficulty = 'medium',
  icon,
  completed = false,
  onComplete,
  hover = true,
  className,
  onClick,
  ...props
}: TaskCardProps) => {
  const diffConfig = difficultyConfig[difficulty]

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        'bg-cream rounded-cozy-lg p-6 shadow-cozy',
        'border-2 border-transparent transition-all duration-200',
        hover && 'cursor-pointer hover:border-sage-300 hover:shadow-cozy-lg',
        completed && 'opacity-75 bg-sage-50',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <div className="flex items-start gap-4">
        {/* Icon or completion checkbox */}
        <div className="flex-shrink-0">
          {onComplete ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'border-3 transition-all duration-200',
                'focus:outline-none focus:ring-3 focus:ring-gold/40',
                completed
                  ? 'bg-sage-500 border-sage-600 text-cream'
                  : 'bg-cream border-sage-300 hover:border-sage-500'
              )}
              aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {completed ? (
                <motion.svg
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <span className="text-2xl">{icon || diffConfig.icon}</span>
              )}
            </button>
          ) : (
            <div
              className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center',
                `bg-${diffConfig.bgColor}`
              )}
            >
              <span className="text-2xl">{icon || diffConfig.icon}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'font-display font-bold text-lg mb-1',
              completed ? 'line-through text-sage-500' : 'text-sage-800'
            )}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sage-600 text-sm mb-3 line-clamp-2">{description}</p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Difficulty badge */}
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill',
                'text-xs font-semibold',
                `bg-${diffConfig.bgColor} text-${diffConfig.color}`
              )}
            >
              <span>{diffConfig.icon}</span>
              <span>{diffConfig.label}</span>
            </span>

            {/* Duration */}
            {duration && (
              <span className="inline-flex items-center gap-1.5 text-sage-600 text-sm">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{duration} min</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completed overlay indicator */}
      {completed && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sage-400 to-moss-500 rounded-b-cozy-lg"
        />
      )}
    </motion.div>
  )
}

export default TaskCard
