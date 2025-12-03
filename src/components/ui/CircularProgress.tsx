import React from 'react'
import { cn, getScoreColor } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  thickness?: number
  showValue?: boolean
  className?: string
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  thickness = 8, 
  showValue = true, 
  className 
}: CircularProgressProps) {
  const sizes = {
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160,
  }

  const dimension = sizes[size]
  const radius = (dimension - thickness) / 2
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
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', getScoreColor(value), textSizes[size])}>
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
}