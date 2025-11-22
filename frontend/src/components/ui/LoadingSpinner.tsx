/**
 * LoadingSpinner Component
 * Animated loading spinner
 */
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-500/30 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  )
}

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-dark-950 flex items-center justify-center">
      <LoadingSpinner size="xl" text="Loading..." />
    </div>
  )
}

export default LoadingSpinner
