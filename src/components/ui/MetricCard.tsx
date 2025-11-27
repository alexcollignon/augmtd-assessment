import React from 'react'
import { Card, CardContent } from './Card'
import { cn, formatNumber, formatPercentage, getScoreColor } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
  variant?: 'default' | 'large'
  valueType?: 'number' | 'percentage' | 'currency'
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  variant = 'default',
  valueType = 'number',
  className 
}: MetricCardProps) {
  const formatValue = () => {
    if (typeof value === 'string') return value
    
    switch (valueType) {
      case 'percentage':
        return formatPercentage(value)
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      default:
        return typeof value === 'number' ? formatNumber(value) : value
    }
  }

  const getValueColor = () => {
    if (valueType === 'percentage' && typeof value === 'number') {
      return getScoreColor(value)
    }
    return 'text-gray-900'
  }

  return (
    <Card className={cn('text-center', className)}>
      <CardContent className={cn('space-y-2', variant === 'large' ? 'py-8' : 'py-6')}>
        {icon && (
          <div className="flex justify-center mb-3">
            {icon}
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={cn('font-bold tracking-tight', getValueColor(), variant === 'large' ? 'text-4xl' : 'text-2xl')}>
            {formatValue()}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {trend && (
          <div className={cn(
            'flex items-center justify-center text-sm',
            trend.direction === 'up' ? 'text-success-600' : 'text-danger-600'
          )}>
            <span className="mr-1">
              {trend.direction === 'up' ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}