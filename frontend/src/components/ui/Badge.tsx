/**
 * Badge Component - Cozy Growth Design System
 * Achievement badges and status indicators with icons
 */
import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'achievement' | 'status' | 'difficulty'
  type?: 'success' | 'warning' | 'info' | 'default'
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const Badge = ({
  children,
  variant = 'status',
  type = 'default',
  icon,
  size = 'md',
  animated = false,
  className,
  ...props
}: BadgeProps) => {
  const variantClasses = {
    achievement: {
      success: 'bg-gradient-to-br from-gold to-gold-600 text-cream shadow-glow border-2 border-gold-400',
      warning: 'bg-gradient-to-br from-coral to-coral-600 text-cream shadow-cozy border-2 border-coral-400',
      info: 'bg-gradient-to-br from-sage-400 to-sage-600 text-cream shadow-cozy border-2 border-sage-500',
      default: 'bg-gradient-to-br from-wood to-wood-600 text-cream shadow-cozy border-2 border-wood-500',
    },
    status: {
      success: 'bg-sage-100 text-sage-700 border-2 border-sage-300',
      warning: 'bg-coral-100 text-coral-700 border-2 border-coral-300',
      info: 'bg-moss-100 text-moss-700 border-2 border-moss-300',
      default: 'bg-cream text-sage-700 border-2 border-sage-200',
    },
    difficulty: {
      success: 'bg-sage-100 text-sage-600 border-2 border-sage-300',
      warning: 'bg-moss-100 text-moss-600 border-2 border-moss-300',
      info: 'bg-wood-100 text-wood-700 border-2 border-wood-300',
      default: 'bg-cream text-sage-600 border-2 border-sage-200',
    },
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const BadgeComponent = animated ? motion.div : 'div'
  const motionProps = animated
    ? {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 15,
        },
      }
    : {}

  return (
    <BadgeComponent
      className={clsx(
        'inline-flex items-center justify-center rounded-pill font-semibold',
        'transition-all duration-200',
        variantClasses[variant][type],
        sizeClasses[size],
        className
      )}
      {...(motionProps as any)}
      {...props}
    >
      {icon && <span className={clsx('flex-shrink-0', iconSizes[size])} aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </BadgeComponent>
  )
}

/**
 * AchievementBadge - Special badge for achievements with title and description
 */
interface AchievementBadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode
  title: string
  description: string
  unlocked?: boolean
  animated?: boolean
}

export const AchievementBadge = ({
  icon,
  title,
  description,
  unlocked = false,
  animated = true,
  className,
  ...props
}: AchievementBadgeProps) => {
  return (
    <motion.div
      initial={animated ? { scale: 0.9, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        'flex flex-col items-center gap-3 p-6 rounded-cozy-lg',
        'border-3 transition-all duration-300',
        unlocked
          ? 'bg-gradient-to-br from-gold-50 to-cream border-gold shadow-glow'
          : 'bg-sage-50 border-sage-200 opacity-60 grayscale',
        className
      )}
      {...props}
    >
      {/* Icon */}
      <div
        className={clsx(
          'w-20 h-20 rounded-full flex items-center justify-center',
          'text-4xl transition-transform duration-300',
          unlocked ? 'bg-gold animate-pulse-gentle' : 'bg-sage-200'
        )}
      >
        {unlocked ? (
          <motion.span
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {icon}
          </motion.span>
        ) : (
          <span className="opacity-50">{icon}</span>
        )}
      </div>

      {/* Title and description */}
      <div className="text-center">
        <h4
          className={clsx(
            'font-display font-bold text-lg mb-1',
            unlocked ? 'text-gold-700' : 'text-sage-500'
          )}
        >
          {title}
        </h4>
        <p className={clsx('text-sm', unlocked ? 'text-sage-700' : 'text-sage-500')}>
          {description}
        </p>
      </div>

      {/* Locked/Unlocked indicator */}
      {!unlocked && (
        <div className="text-xs text-sage-500 font-medium px-3 py-1 bg-sage-100 rounded-pill">
          Locked
        </div>
      )}
    </motion.div>
  )
}

export default Badge
