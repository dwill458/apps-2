/**
 * DurationPicker Component - Cozy Growth Design System
 * Four pill-shaped buttons for selecting task duration (3/5/10/15 minutes)
 */
import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export type Duration = 3 | 5 | 10 | 15

interface DurationPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: Duration
  onChange: (duration: Duration) => void
  disabled?: boolean
  layout?: 'horizontal' | 'grid'
}

const durationOptions: Duration[] = [3, 5, 10, 15]

export const DurationPicker = ({
  value,
  onChange,
  disabled = false,
  layout = 'horizontal',
  className,
  ...props
}: DurationPickerProps) => {
  return (
    <div
      className={clsx(
        'flex gap-3',
        layout === 'horizontal'
          ? 'flex-row flex-wrap justify-center'
          : 'grid grid-cols-2 sm:grid-cols-4',
        className
      )}
      role="radiogroup"
      aria-label="Duration picker"
      {...props}
    >
      {durationOptions.map((duration) => {
        const isSelected = value === duration
        return (
          <motion.button
            key={duration}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${duration} minutes`}
            disabled={disabled}
            onClick={() => onChange(duration)}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={clsx(
              'flex items-center justify-center gap-1.5',
              'px-6 py-3.5 rounded-pill min-h-[52px] min-w-[80px]',
              'font-display font-semibold text-base sm:text-lg',
              'focus:outline-none focus:ring-3 focus:ring-gold/40',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'bg-moss text-cream shadow-cozy-lg ring-4 ring-moss-700/30 scale-105'
                : 'bg-sage-100 text-sage-700 hover:bg-sage-200 border-2 border-sage-300/50 shadow-cozy'
            )}
          >
            <span className={clsx(
              'font-bold text-xl sm:text-2xl',
              isSelected ? 'text-gold' : 'text-sage-600'
            )}>
              {duration}
            </span>
            <span className="text-sm">min</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default DurationPicker
