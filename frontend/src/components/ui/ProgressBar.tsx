/**
 * ProgressBar Component - Cozy Growth Design System
 * Vine-like organic progress bars with leaf/flower growth animations
 */
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  variant?: 'vine' | 'simple'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  variant = 'vine',
  size = 'md',
  animated = true,
  className,
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  // Calculate number of leaves/flowers to show based on progress
  const leafCount = Math.floor(percentage / 20) // 0-5 leaves
  const shouldShowFlower = percentage >= 100

  return (
    <div className={clsx('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-sage-700">Progress</span>
          <span className="text-sm font-semibold text-sage-600">{Math.round(percentage)}%</span>
        </div>
      )}

      <div
        className={clsx(
          'relative w-full bg-sage-100 rounded-pill overflow-visible',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Progress fill - vine-like */}
        <motion.div
          className={clsx(
            'absolute left-0 top-0 h-full rounded-pill',
            variant === 'vine'
              ? 'bg-gradient-to-r from-sage-500 via-sage-600 to-moss-500'
              : 'bg-sage-500'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut',
          }}
        />

        {/* Leaf/Flower decorations for vine variant */}
        {variant === 'vine' && (
          <>
            {/* Leaves along the vine */}
            {Array.from({ length: leafCount }).map((_, index) => {
              const position = ((index + 1) * 20) / percentage * 100
              return (
                <motion.div
                  key={`leaf-${index}`}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${Math.min(position, 100)}%` }}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-sage-600"
                  >
                    <path
                      d="M8 2C8 2 5 5 5 8C5 10 6.5 11 8 11C9.5 11 11 10 11 8C11 5 8 2 8 2Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                  </svg>
                </motion.div>
              )
            })}

            {/* Flower at 100% */}
            {shouldShowFlower && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 right-0"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gold animate-pulse-gentle"
                >
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.7" />
                  <circle cx="12" cy="18" r="3" fill="currentColor" opacity="0.7" />
                  <circle cx="6" cy="12" r="3" fill="currentColor" opacity="0.7" />
                  <circle cx="18" cy="12" r="3" fill="currentColor" opacity="0.7" />
                </svg>
              </motion.div>
            )}
          </>
        )}

        {/* Shimmer effect on progress */}
        {animated && percentage > 0 && percentage < 100 && (
          <div
            className="absolute inset-0 rounded-pill"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
              width: `${percentage}%`,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default ProgressBar
