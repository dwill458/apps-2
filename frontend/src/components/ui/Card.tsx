/**
 * Card Component - Cozy Growth Design System
 * Rounded cards with cozy shadows and optional glow effect
 */
import { ReactNode, HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'glow'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
}

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) => {
  const variantClasses = {
    default: 'bg-cream shadow-cozy',
    elevated: 'bg-cream shadow-cozy-lg',
    glow: 'bg-cream shadow-glow',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const CardComponent = hover ? motion.div : 'div'
  const motionProps = hover
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.2, ease: 'easeOut' },
      }
    : {}

  return (
    <CardComponent
      className={clsx(
        'rounded-cozy transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...(motionProps as any)}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card
