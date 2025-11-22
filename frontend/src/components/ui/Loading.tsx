/**
 * Loading Component - Cozy Growth Design System
 * Gentle loading spinner with plant/leaf animation
 */
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse' | 'grow'
  message?: string
  fullScreen?: boolean
}

export const Loading = ({
  size = 'md',
  variant = 'grow',
  message,
  fullScreen = false,
  className,
  ...props
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
  }

  const Container = fullScreen ? 'div' : 'div'
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-cream/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center'

  return (
    <Container className={clsx(containerClasses, className)} {...props}>
      <div className="flex flex-col items-center gap-4">
        {/* Loading animation */}
        {variant === 'grow' && <GrowingPlant size={size} />}
        {variant === 'spinner' && <LeafSpinner size={size} />}
        {variant === 'dots' && <BouncingDots size={size} />}
        {variant === 'pulse' && <PulsingLeaf size={size} />}

        {/* Message */}
        {message && (
          <p className="text-sage-600 font-medium text-center max-w-xs">{message}</p>
        )}
      </div>
    </Container>
  )
}

/**
 * Growing plant animation - sprout growing up
 */
const GrowingPlant = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }

  const stages = ['🌰', '🌱', '🌿', '🌳']

  return (
    <div className={clsx('relative', sizeClasses[size])}>
      {stages.map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 1.2],
            y: [10, 0, 0, -5],
          }}
          transition={{
            duration: 2,
            delay: index * 0.5,
            repeat: Infinity,
            repeatDelay: (stages.length - index - 1) * 0.5,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Leaf spinner - rotating leaves
 */
const LeafSpinner = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const dimensions = {
    sm: 32,
    md: 64,
    lg: 96,
  }
  const dim = dimensions[size]

  return (
    <div className="relative" style={{ width: dim, height: dim }}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: 'center',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.125,
            }}
          >
            <div
              className="text-sage-500"
              style={{
                fontSize: dim / 4,
                transform: `rotate(${angle}deg) translateY(-${dim / 3}px)`,
              }}
            >
              🍃
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * Bouncing dots - three dots bouncing
 */
const BouncingDots = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={clsx('rounded-full bg-sage-500', dotSizes[size])}
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Pulsing leaf - single pulsing leaf emoji
 */
const PulsingLeaf = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  }

  return (
    <motion.div
      className={sizeClasses[size]}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      🌿
    </motion.div>
  )
}

/**
 * Full-screen loading overlay
 */
interface LoadingScreenProps {
  message?: string
  variant?: 'spinner' | 'dots' | 'pulse' | 'grow'
}

export const LoadingScreen = ({ message = 'Loading...', variant = 'grow' }: LoadingScreenProps) => {
  return <Loading fullScreen size="lg" variant={variant} message={message} />
}

export default Loading
