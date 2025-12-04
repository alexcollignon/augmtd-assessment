import React from 'react'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { Card, CardContent } from '@/components/ui/Card'
import { Trophy, TrendingUp, Target, Users } from 'lucide-react'
import { cn, getScoreColor } from '@/lib/utils'

interface OverallScoreCardProps {
  score: number
  level: string
  participantCount?: number
  industryAverage?: number
  improvement?: number
}

export function OverallScoreCard({ 
  score, 
  level,
  participantCount,
  industryAverage,
  improvement
}: OverallScoreCardProps) {
  const getScoreLevel = (score: number): { level: string; description: string; color: string } => {
    if (score >= 85) return { 
      level: 'AI Leader', 
      description: 'Exceptional AI readiness with advanced capabilities',
      color: 'text-emerald-600' 
    }
    if (score >= 70) return { 
      level: 'AI Proficient', 
      description: 'Strong AI foundation with good practical skills',
      color: 'text-green-600' 
    }
    if (score >= 55) return { 
      level: 'AI Developing', 
      description: 'Solid progress with room for improvement',
      color: 'text-blue-600' 
    }
    if (score >= 40) return { 
      level: 'AI Beginner', 
      description: 'Basic understanding, significant growth potential',
      color: 'text-orange-600' 
    }
    return { 
      level: 'AI Explorer', 
      description: 'Starting AI journey with foundational learning needed',
      color: 'text-red-600' 
    }
  }

  const scoreInfo = getScoreLevel(score)

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
              <div className={cn("text-xl font-semibold mb-1", scoreInfo.color)}>
                {scoreInfo.level}
              </div>
              <p className="text-gray-600">
                {scoreInfo.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {participantCount && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{participantCount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Participants</div>
                  </div>
                </div>
              )}

              {industryAverage && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{industryAverage}%</div>
                    <div className="text-xs text-gray-500">Industry Avg</div>
                  </div>
                </div>
              )}

              {improvement !== undefined && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <TrendingUp className={cn("w-5 h-5", improvement >= 0 ? "text-green-600" : "text-red-600")} />
                  <div>
                    <div className={cn("text-sm font-medium", improvement >= 0 ? "text-green-900" : "text-red-900")}>
                      {improvement >= 0 ? '+' : ''}{improvement}%
                    </div>
                    <div className="text-xs text-gray-500">vs Last Time</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center shadow-lg",
              score >= 85 ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
              score >= 70 ? "bg-gradient-to-br from-green-400 to-blue-500" :
              score >= 55 ? "bg-gradient-to-br from-blue-400 to-purple-500" :
              score >= 40 ? "bg-gradient-to-br from-orange-400 to-red-500" :
              "bg-gradient-to-br from-gray-400 to-gray-600"
            )}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}