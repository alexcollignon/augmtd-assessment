import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Lightbulb, 
  BookOpen, 
  Target, 
  Zap, 
  Shield, 
  TrendingUp,
  Clock,
  Star,
  ExternalLink
} from 'lucide-react'
import { DimensionScore } from '@/types'
import { cn } from '@/lib/utils'

interface RecommendationsSectionProps {
  recommendations: string[]
  dimensionScores: DimensionScore[]
  overallScore: number
}

interface LearningResource {
  title: string
  description: string
  type: 'course' | 'article' | 'tool' | 'practice'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeEstimate: string
  url?: string
}

export function RecommendationsSection({ 
  recommendations, 
  dimensionScores, 
  overallScore 
}: RecommendationsSectionProps) {
  
  // Get priority learning areas (lowest scoring dimensions)
  const priorityAreas = dimensionScores
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)

  // Get strength areas (highest scoring dimensions)
  const strengthAreas = dimensionScores
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 2)

  // Learning resources based on score level
  const getLearningResources = (): LearningResource[] => {
    if (overallScore >= 70) {
      return [
        {
          title: "AI Strategy Leadership",
          description: "Advanced frameworks for leading AI transformation in organizations",
          type: "course",
          difficulty: "advanced",
          timeEstimate: "4-6 hours"
        },
        {
          title: "AI Ethics in Practice",
          description: "Real-world application of responsible AI principles",
          type: "course",
          difficulty: "intermediate",
          timeEstimate: "2-3 hours"
        },
        {
          title: "Building AI-Ready Organizations",
          description: "Change management for AI adoption",
          type: "article",
          difficulty: "advanced",
          timeEstimate: "30 min"
        }
      ]
    } else if (overallScore >= 40) {
      return [
        {
          title: "Practical AI for Professionals",
          description: "Hands-on experience with ChatGPT, Claude, and productivity tools",
          type: "practice",
          difficulty: "intermediate",
          timeEstimate: "3-4 hours"
        },
        {
          title: "Prompt Engineering Masterclass",
          description: "Advanced techniques for effective AI communication",
          type: "course",
          difficulty: "intermediate",
          timeEstimate: "2 hours"
        },
        {
          title: "AI Tool Integration Guide",
          description: "How to incorporate AI into daily workflows",
          type: "article",
          difficulty: "beginner",
          timeEstimate: "20 min"
        }
      ]
    } else {
      return [
        {
          title: "AI Fundamentals for Business",
          description: "Introduction to AI concepts and business applications",
          type: "course",
          difficulty: "beginner",
          timeEstimate: "2-3 hours"
        },
        {
          title: "Getting Started with ChatGPT",
          description: "Basic prompting and everyday use cases",
          type: "practice",
          difficulty: "beginner",
          timeEstimate: "1 hour"
        },
        {
          title: "AI in Your Industry",
          description: "Industry-specific AI applications and case studies",
          type: "article",
          difficulty: "beginner",
          timeEstimate: "15 min"
        }
      ]
    }
  }

  const learningResources = getLearningResources()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />
      case 'article': return <ExternalLink className="w-4 h-4" />
      case 'tool': return <Zap className="w-4 h-4" />
      case 'practice': return <Target className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'advanced': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Areas & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Priority Development Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{area.dimension}</div>
                    <div className="text-sm text-gray-600">Focus area for improvement</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">{area.percentage}%</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strength Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Your Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengthAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{area.dimension}</div>
                    <div className="text-sm text-gray-600">Well-developed capability</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{area.percentage}%</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Recommended Learning Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningResources.map((resource, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(resource.type)}
                    <span className="text-sm font-medium text-gray-700 capitalize">{resource.type}</span>
                  </div>
                  <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                    {resource.difficulty}
                  </Badge>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{resource.timeEstimate}</span>
                  </div>
                  {resource.url && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Start with your priority development areas and dedicate 30 minutes per week to learning. 
              Small, consistent progress leads to significant improvement over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}