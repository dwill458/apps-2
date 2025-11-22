/**
 * EnergySelector Component - Cozy Growth Design System
 * Three circular buttons for Low/Medium/High energy selection with plant icons
 */
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export type EnergyLevel = 'low' | 'medium' | 'high'

interface EnergySelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: EnergyLevel
  onChange: (level: EnergyLevel) => void
  disabled?: boolean
}

const energyOptions = [
  {
    level: 'low' as EnergyLevel,
    label: 'Low',
    icon: '🌱',
    description: 'Gentle tasks',
    color: 'sage-400',
    bgColor: 'sage-100',
    ringColor: 'sage-500',
  },
  {
    level: 'medium' as EnergyLevel,
    label: 'Medium',
    icon: '🌿',
    description: 'Moderate effort',
    color: 'sage-600',
    bgColor: 'sage-200',
    ringColor: 'sage-600',
  },
  {
    level: 'high' as EnergyLevel,
    label: 'High',
    icon: '🌳',
    description: 'Full energy',
    color: 'moss-600',
    bgColor: 'moss-200',
    ringColor: 'moss-600',
  },
]

export const EnergySelector = ({
  value,
  onChange,
  disabled = false,
  className,
  ...props
}: EnergySelectorProps) => {
  return (
    <div
      className={clsx('flex items-center justify-center gap-6', className)}
      role="radiogroup"
      aria-label="Energy level selector"
      {...props}
    >
      {energyOptions.map((option) => {
        const isSelected = value === option.level
        return (
          <motion.button
            key={option.level}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${option.label} energy: ${option.description}`}
            disabled={disabled}
            onClick={() => onChange(option.level)}
            whileHover={{ scale: disabled ? 1 : 1.08 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              'flex flex-col items-center gap-2 p-4 rounded-full',
              'min-w-[80px] min-h-[80px] sm:min-w-[100px] sm:min-h-[100px]',
              'focus:outline-none transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? `bg-${option.bgColor} ring-4 ring-${option.ringColor}/40 shadow-cozy-lg`
                : `bg-cream hover:bg-${option.bgColor} border-2 border-${option.color}/30 shadow-cozy`
            )}
          >
            <span
              className={clsx(
                'text-4xl sm:text-5xl transition-transform duration-200',
                isSelected && 'animate-bounce'
              )}
              aria-hidden="true"
            >
              {option.icon}
            </span>
            <div className="text-center">
              <div
                className={clsx(
                  'font-semibold text-sm sm:text-base',
                  isSelected ? `text-${option.color}` : 'text-sage-600'
                )}
              >
                {option.label}
              </div>
              <div className="text-xs text-sage-500 hidden sm:block">{option.description}</div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export default EnergySelector
