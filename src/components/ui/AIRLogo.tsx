import React from 'react'
import { cn } from '@/lib/utils'

interface AIRLogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon-only'
}

export function AIRLogo({ className, size = 'md', variant = 'full' }: AIRLogoProps) {
  const sizes = {
    xs: { height: 'h-6', width: 'w-auto' },
    sm: { height: 'h-8', width: 'w-auto' },
    md: { height: 'h-12', width: 'w-auto' },
    lg: { height: 'h-16', width: 'w-auto' },
    xl: { height: 'h-20', width: 'w-auto' }
  }

  const { height, width } = sizes[size]

  return (
    <div className={cn('flex items-center', className)}>
      <img 
        src="/air-logo.png" 
        alt="AIR - AI Readiness Platform"
        className={cn(height, width, 'object-contain')}
        onError={(e) => {
          // Fallback if logo doesn't load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      {variant === 'icon-only' && (
        <span className="sr-only">AIR - AI Readiness Platform</span>
      )}
    </div>
  )
}