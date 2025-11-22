/**
 * GlassCard Component
 * Beautiful glassmorphism card with optional hover effects
 */
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  animate?: boolean
}

export const GlassCard = ({
  children,
  className,
  hover = false,
  onClick,
  animate = true,
}: GlassCardProps) => {
  const baseClasses = hover ? 'glass-hover' : 'glass'

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(baseClasses, className)}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={clsx(baseClasses, className)} onClick={onClick}>
      {children}
    </div>
  )
}

export default GlassCard
