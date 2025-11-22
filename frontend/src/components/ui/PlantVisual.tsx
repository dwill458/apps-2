/**
 * PlantVisual Component - Cozy Growth Design System
 * Plant visualization showing 5 growth stages with smooth animations
 */
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

export type GrowthStage = 0 | 1 | 2 | 3 | 4 | 5

interface PlantVisualProps extends HTMLAttributes<HTMLDivElement> {
  stage: GrowthStage
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showLabel?: boolean
}

const plantStages = [
  {
    stage: 0,
    label: 'Seed',
    emoji: '🌰',
    description: 'Just starting',
    color: 'wood',
  },
  {
    stage: 1,
    label: 'Sprout',
    emoji: '🌱',
    description: 'First steps',
    color: 'sage-400',
  },
  {
    stage: 2,
    label: 'Seedling',
    emoji: '🌿',
    description: 'Growing strong',
    color: 'sage-500',
  },
  {
    stage: 3,
    label: 'Young Plant',
    emoji: '🪴',
    description: 'Thriving',
    color: 'sage-600',
  },
  {
    stage: 4,
    label: 'Mature Plant',
    emoji: '🌳',
    description: 'Flourishing',
    color: 'moss-600',
  },
  {
    stage: 5,
    label: 'Blooming',
    emoji: '🌸',
    description: 'Full bloom!',
    color: 'gold',
  },
] as const

export const PlantVisual = ({
  stage,
  size = 'md',
  animated = true,
  showLabel = true,
  className,
  ...props
}: PlantVisualProps) => {
  const currentPlant = plantStages[stage]

  const sizeClasses = {
    sm: 'text-6xl',
    md: 'text-8xl',
    lg: 'text-9xl',
    xl: 'text-[12rem]',
  }

  const containerSizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-48 h-48',
  }

  return (
    <div
      className={clsx('flex flex-col items-center gap-4', className)}
      role="img"
      aria-label={`Plant growth stage ${stage}: ${currentPlant.label}`}
      {...props}
    >
      {/* Plant container with animation */}
      <div className={clsx('relative flex items-center justify-center', containerSizes[size])}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={animated ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={animated ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={animated ? { scale: 0.8, opacity: 0 } : false}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              type: 'spring',
              stiffness: 150,
            }}
            className="relative"
          >
            <span className={clsx(sizeClasses[size], 'block animate-float')}>
              {currentPlant.emoji}
            </span>

            {/* Growth sparkles for stage 5 */}
            {stage === 5 && animated && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={`sparkle-${i}`}
                    className="absolute text-2xl"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI) / 3) * 60,
                      y: Math.sin((i * Math.PI) / 3) * 60,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeOut',
                    }}
                  >
                    ✨
                  </motion.span>
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Circular progress indicator */}
        <div className="absolute inset-0 -z-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-sage-200"
              opacity="0.3"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={`text-${currentPlant.color}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage / 5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * stage) / 5}
            />
          </svg>
        </div>
      </div>

      {/* Label and description */}
      {showLabel && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={animated ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h3 className={clsx('font-display font-bold text-lg', `text-${currentPlant.color}`)}>
            {currentPlant.label}
          </h3>
          <p className="text-sm text-sage-600">{currentPlant.description}</p>
        </motion.div>
      )}

      {/* Stage indicator dots */}
      <div className="flex gap-2" role="progressbar" aria-valuenow={stage} aria-valuemax={5}>
        {plantStages.map((_, index) => (
          <motion.div
            key={index}
            className={clsx(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              index <= stage ? 'bg-sage-500 scale-110' : 'bg-sage-200'
            )}
            initial={false}
            animate={{
              scale: index === stage ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: index === stage ? Infinity : 0,
              repeatDelay: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default PlantVisual
