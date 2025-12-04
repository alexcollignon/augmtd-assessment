import React from 'react'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { Card, CardContent } from '@/components/ui/Card'
import { Trophy, TrendingUp, Building2 } from 'lucide-react'
import { cn, getScoreColor } from '@/lib/utils'

interface OverallScoreCardProps {
  score: number
  level: string
  companyAverage?: number
  improvement?: number
}

export function OverallScoreCard({ 
  score, 
  level,
  companyAverage,
  improvement
}: OverallScoreCardProps) {
  const stages = [
    { 
      id: 1,
      name: 'AI Explorer', 
      description: 'Starting AI journey with foundational learning needed',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      range: '0-39'
    },
    { 
      id: 2,
      name: 'AI Developing', 
      description: 'Basic understanding, significant growth potential',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100', 
      borderColor: 'border-orange-300',
      range: '40-59'
    },
    { 
      id: 3,
      name: 'AI Proficient', 
      description: 'Strong AI foundation with good practical skills',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300', 
      range: '60-79'
    },
    { 
      id: 4,
      name: 'AI Leader', 
      description: 'Exceptional AI readiness with advanced capabilities',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-300',
      range: '80-100'
    }
  ]

  const getCurrentStage = (score: number) => {
    if (score <= 39) return stages[0]
    if (score <= 59) return stages[1] 
    if (score <= 79) return stages[2]
    return stages[3]
  }

  const currentStage = getCurrentStage(score)

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Score Circle */}
          <div className="flex-shrink-0">
            <div className="relative">
              <CircularProgress 
                value={score} 
                size={160}
                strokeWidth={8}
                showValue={false}
                className="drop-shadow-lg"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-900">{score}</div>
                <div className="text-sm font-medium text-gray-600">out of 100</div>
              </div>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your AI Readiness Score
              </h2>
              <div className={cn("text-xl font-semibold mb-1", currentStage.color)}>
                {currentStage.name}
              </div>
              <p className="text-gray-600">
                {currentStage.description}
              </p>
            </div>

            {/* AI Readiness Stages */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">AI Readiness Stages</h3>
                {companyAverage && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>Company Avg: {companyAverage}%</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stages.map((stage) => {
                  const isCurrentStage = stage.id === currentStage.id
                  return (
                    <div 
                      key={stage.id}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all",
                        isCurrentStage 
                          ? cn(stage.bgColor, stage.borderColor, "shadow-md scale-105")
                          : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-semibold mb-1",
                        isCurrentStage ? stage.color : "text-gray-500"
                      )}>
                        {stage.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {stage.range}%
                      </div>
                      {isCurrentStage && (
                        <div className="flex items-center mt-2">
                          <div className={cn("w-2 h-2 rounded-full mr-2", stage.color.replace('text-', 'bg-'))} />
                          <span className="text-xs font-medium text-gray-700">You are here</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {improvement !== undefined && (
                <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-white rounded-lg shadow-sm">
                  <TrendingUp className={cn("w-5 h-5", improvement >= 0 ? "text-green-600" : "text-red-600")} />
                  <div className={cn("text-sm font-medium", improvement >= 0 ? "text-green-900" : "text-red-900")}>
                    {improvement >= 0 ? '+' : ''}{improvement}% vs Last Assessment
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center shadow-lg",
              currentStage.id === 4 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
              currentStage.id === 3 ? "bg-gradient-to-br from-green-400 to-blue-500" :
              currentStage.id === 2 ? "bg-gradient-to-br from-blue-400 to-purple-500" :
              "bg-gradient-to-br from-orange-400 to-red-500"
            )}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}