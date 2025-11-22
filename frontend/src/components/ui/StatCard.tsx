/**
 * StatCard Component
 * Display statistics with icon and trend
 */
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import GlassCard from './GlassCard'
import { clsx } from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: number
  trendLabel?: string
  className?: string
}

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) => {
  const isPositiveTrend = trend && trend > 0
  const trendColor = isPositiveTrend ? 'text-success-500' : 'text-danger-500'

  return (
    <GlassCard className={clsx('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {Math.abs(trend)}% {trendLabel || 'vs last month'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary-500/20 text-primary-500">
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export default StatCard
