import React from 'react'
import { cn, getScoreColor } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  thickness?: number
  strokeWidth?: number
  showValue?: boolean
  className?: string
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  thickness,
  strokeWidth,
  showValue = true, 
  className 
}: CircularProgressProps) {
  const sizes = {
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160,
  }

  const dimension = typeof size === 'number' ? size : sizes[size]
  const strokeThickness = strokeWidth || thickness || 8
  const radius = (dimension - strokeThickness) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  const getStrokeColor = () => {
    if (value >= 80) return '#16a34a' // success-600
    if (value >= 50) return '#d97706' // warning-600
    return '#dc2626' // danger-600
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const getTextSize = () => {
    if (typeof size === 'number') {
      if (size >= 160) return 'text-xl'
      if (size >= 120) return 'text-lg'
      if (size >= 80) return 'text-sm'
      return 'text-xs'
    }
    return textSizes[size]
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        className="transform -rotate-90"
        width={dimension}
        height={dimension}
      >
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeThickness}
          fill="none"
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeThickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', getScoreColor(value), getTextSize())}>
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
}