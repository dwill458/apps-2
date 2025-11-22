/**
 * Button Component - Cozy Growth Design System
 * Reusable button with cozy styling, wood texture, and plant-inspired variants
 */
import { ReactNode, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-wood bg-wood-texture text-cream-50 hover:bg-wood-600 shadow-cozy border-2 border-wood-700/30 font-semibold',
    secondary: 'bg-sage text-cream-50 hover:bg-sage-600 shadow-cozy border-2 border-sage-700/30 font-semibold',
    ghost: 'bg-transparent text-sage-700 hover:bg-sage-100 border-2 border-sage-300',
  }

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm min-h-[40px]',
    md: 'px-6 py-3.5 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={clsx(
        'inline-flex items-center justify-center gap-2.5 rounded-cozy transition-all duration-200',
        'focus:outline-none focus:ring-3 focus:ring-gold/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'font-display tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  )
}

export default Button
