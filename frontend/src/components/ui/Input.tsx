/**
 * Input Component - Cozy Growth Design System
 * Text input with cozy styling and large touch targets (ADHD-friendly)
 */
import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-sage-800 font-display"
        >
          {label}
          {props.required && <span className="text-coral ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-4 py-3.5 rounded-cozy border-2 transition-all duration-200',
            'bg-cream text-sage-800 placeholder:text-sage-400',
            'font-sans text-base',
            'min-h-[52px]', // ADHD-friendly large touch target
            'focus:outline-none focus:ring-3 focus:ring-gold/40',
            icon && 'pl-12',
            error
              ? 'border-coral focus:border-coral'
              : 'border-sage-300 hover:border-sage-400 focus:border-sage-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-sage-50',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
      </div>

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-coral font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-sage-600">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

/**
 * Textarea Component - Multi-line text input
 */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  resize?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  resize = true,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${label?.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-sage-800 font-display"
        >
          {label}
          {props.required && <span className="text-coral ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Textarea field */}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={clsx(
          'w-full px-4 py-3.5 rounded-cozy border-2 transition-all duration-200',
          'bg-cream text-sage-800 placeholder:text-sage-400',
          'font-sans text-base leading-relaxed',
          'focus:outline-none focus:ring-3 focus:ring-gold/40',
          error
            ? 'border-coral focus:border-coral'
            : 'border-sage-300 hover:border-sage-400 focus:border-sage-500',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-sage-50',
          !resize && 'resize-none',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />

      {/* Error message */}
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-coral font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="text-sm text-sage-600">
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input
