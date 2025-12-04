import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DimensionScore } from '@/types'
import { 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Wrench,
  Clock,
  Star,
  ExternalLink,
  Target,
  TrendingUp,
  Lightbulb,
  Code,
  MessageSquare,
  Zap,
  Award,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  Building2,
  Rocket,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PersonalizedResourcesProps {
  dimensionScores: DimensionScore[]
  userRole?: string
  userDepartment?: string
  userIndustry?: string
  userExperience?: string
  userTechnicalBackground?: string
  userCurrentUse?: string
  userGoals?: string
  overallScore: number
}

interface LearningResource {
  title: string
  description: string
  type: 'course' | 'article' | 'video' | 'tool' | 'community' | 'template'
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  provider: string
  relevantFor: string[]
  businessOutcome: string
  icon: React.ComponentType<any>
  url?: string
  cost: 'free' | 'paid' | 'freemium'
  priority: number
}

interface LearningPath {
  name: string
  description: string
  duration: string
  resources: LearningResource[]
  outcomes: string[]
}

export function PersonalizedResources({ 
  dimensionScores, 
  userRole, 
  userDepartment, 
  userIndustry,
  userExperience,
  userTechnicalBackground,
  userCurrentUse,
  userGoals,
  overallScore 
}: PersonalizedResourcesProps) {

  const allResources: LearningResource[] = [
    {
      title: 'Prompt Engineering for Business Professionals',
      description: 'Master the art of communicating effectively with AI to get better results',
      type: 'course',
      duration: '2-3 hours',
      difficulty: 'beginner',
      provider: 'LinkedIn Learning',
      relevantFor: ['Prompting Proficiency'],
      businessOutcome: '3x better AI outputs, 50% time savings',
      icon: MessageSquare,
      cost: 'paid',
      priority: 1
    },
    {
      title: 'AI Tools for Your Industry',
      description: `Curated AI tools and use cases specifically for ${userIndustry || 'your industry'}`,
      type: 'article',
      duration: '30 minutes',
      difficulty: 'beginner',
      provider: 'Industry AI Hub',
      relevantFor: ['Tool Use'],
      businessOutcome: 'Discover 5-10 relevant AI tools',
      icon: Wrench,
      cost: 'free',
      priority: 2
    },
    {
      title: 'Responsible AI in the Workplace',
      description: 'Understanding ethical AI use, bias, and data privacy considerations',
      type: 'course',
      duration: '90 minutes',
      difficulty: 'intermediate',
      provider: 'Coursera',
      relevantFor: ['Ethics & Responsible Use'],
      businessOutcome: 'Reduce AI-related risks and compliance issues',
      icon: Target,
      cost: 'freemium',
      priority: 3
    },
    {
      title: 'Data Fundamentals for AI Success',
      description: 'Learn what makes data AI-ready and how to prepare quality datasets',
      type: 'course',
      duration: '3 hours',
      difficulty: 'intermediate',
      provider: 'edX',
      relevantFor: ['AI Thinking'],
      businessOutcome: 'Enable successful AI initiatives in your team',
      icon: Code,
      cost: 'freemium',
      priority: 4
    },
    {
      title: 'Human-AI Collaboration Masterclass',
      description: 'Advanced techniques for working with AI as a thinking partner',
      type: 'video',
      duration: '45 minutes',
      difficulty: 'advanced',
      provider: 'YouTube - AI Workplace',
      relevantFor: ['Co-Intelligence'],
      businessOutcome: '25% productivity boost through better collaboration',
      icon: Users,
      cost: 'free',
      priority: 5
    },
    {
      title: 'ChatGPT for Managers',
      description: 'Practical templates and workflows for management tasks',
      type: 'template',
      duration: '1 hour',
      difficulty: 'beginner',
      provider: 'AI Template Library',
      relevantFor: ['Prompting Proficiency', 'Tool Use'],
      businessOutcome: 'Ready-to-use prompts for common management tasks',
      icon: FileText,
      cost: 'free',
      priority: 6
    },
    {
      title: 'AI Implementation Community',
      description: 'Connect with peers implementing AI in similar roles and industries',
      type: 'community',
      duration: 'Ongoing',
      difficulty: 'beginner',
      provider: 'LinkedIn AI Professionals',
      relevantFor: ['All dimensions'],
      businessOutcome: 'Peer learning and best practice sharing',
      icon: Users,
      cost: 'free',
      priority: 7
    }
  ]

  // Generate personalized learning paths based on user profile
  const generateLearningPaths = (): LearningPath[] => {
    const paths: LearningPath[] = []

    // Path 1: Quick Wins (for all users)
    paths.push({
      name: '30-Day Quick Wins',
      description: 'Fast, practical improvements you can implement immediately',
      duration: '2-4 hours total',
      resources: getResourcesByScore(overallScore).slice(0, 3),
      outcomes: [
        'Immediate productivity improvements',
        'Confidence with basic AI tools',
        'Quick ROI demonstration'
      ]
    })

    // Path 2: Role-specific development
    if (userRole) {
      paths.push({
        name: `${userRole} AI Mastery`,
        description: `Advanced AI skills tailored for ${userRole}s`,
        duration: '6-10 hours',
        resources: getRoleSpecificResources(),
        outcomes: [
          'Role-specific AI expertise',
          'Leadership in AI adoption',
          'Strategic AI decision-making'
        ]
      })
    }

    // Path 3: Technical depth (if user has technical background)
    if (userTechnicalBackground?.includes('Advanced') || userTechnicalBackground?.includes('Expert')) {
      paths.push({
        name: 'Technical AI Leadership',
        description: 'Deep technical skills for AI implementation and architecture',
        duration: '15-20 hours',
        resources: getTechnicalResources(),
        outcomes: [
          'Technical AI architecture knowledge',
          'Ability to evaluate AI solutions',
          'Technical leadership in AI initiatives'
        ]
      })
    }

    return paths
  }

  const getResourcesByScore = (score: number): LearningResource[] => {
    if (score >= 70) {
      return allResources.filter(r => r.difficulty === 'advanced').slice(0, 4)
    } else if (score >= 40) {
      return allResources.filter(r => r.difficulty === 'intermediate').slice(0, 4)
    } else {
      return allResources.filter(r => r.difficulty === 'beginner').slice(0, 4)
    }
  }

  const getRoleSpecificResources = (): LearningResource[] => {
    const roleMap: Record<string, string[]> = {
      'Executive / C-Level Leader': ['course', 'article'],
      'Team or Department Manager': ['course', 'template', 'community'],
      'Technical Expert / Engineer': ['course', 'tool'],
      'Data & AI Specialist': ['course', 'video', 'tool']
    }
    
    const preferredTypes = roleMap[userRole || ''] || ['course', 'article']
    return allResources.filter(r => preferredTypes.includes(r.type)).slice(0, 4)
  }

  const getTechnicalResources = (): LearningResource[] => {
    return allResources.filter(r => 
      r.title.includes('Data') || 
      r.title.includes('Technical') || 
      r.difficulty === 'advanced'
    ).slice(0, 4)
  }

  const getWeakestDimensions = (): DimensionScore[] => {
    return dimensionScores
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 2)
  }

  const getRelevantResources = (): LearningResource[] => {
    const weakDimensions = getWeakestDimensions()
    const relevantResources = allResources.filter(resource =>
      weakDimensions.some(dim => resource.relevantFor.includes(dim.dimension))
    )
    
    // Sort by priority and return top resources
    return relevantResources.sort((a, b) => a.priority - b.priority).slice(0, 6)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'advanced': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800'
      case 'freemium': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen
      case 'video': return Video
      case 'article': return FileText
      case 'tool': return Wrench
      case 'community': return Users
      case 'template': return FileText
      default: return BookOpen
    }
  }

  const learningPaths = generateLearningPaths()
  const relevantResources = getRelevantResources()

  return (
    <div className="space-y-8">

      {/* AI eLearning Platform */}
      <Card 
        className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all cursor-pointer shadow-lg" 
        onClick={() => {
          alert('AI eLearning Platform - Coming Soon!\n\nAccess comprehensive AI training including:\n• Interactive AI use cases library\n• PowerPrompts collection & tools\n• Enterprise training modules\n• Hands-on AI implementation guides\n• Team progress tracking & analytics\n• Personalized learning paths based on your assessment results')
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-900 mb-2">AI eLearning Platform</h3>
              <p className="text-purple-700 mb-3">Access comprehensive AI training, use cases library, and PowerPrompts collection tailored for business professionals</p>
              <div className="flex items-center text-purple-600">
                <span className="font-medium mr-2">Explore Training Resources</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Resources */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Star className="w-5 h-5" />
            <span>Recommended for You</span>
          </CardTitle>
          <p className="text-sm text-blue-700 mt-2">
            Based on your development areas: {getWeakestDimensions().map(d => d.dimension).join(' and ')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantResources.slice(0, 4).map((resource, index) => {
              const IconComponent = getTypeIcon(resource.type)
              return (
                <div key={index} className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3 mb-3">
                    <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                        {resource.difficulty}
                      </Badge>
                      <Badge className={cn("text-xs", getCostColor(resource.cost))}>
                        {resource.cost}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.duration}
                    </div>
                  </div>
                  
                  <div className="text-xs text-green-700 font-medium">
                    🎯 {resource.businessOutcome}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {learningPaths.map((path, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>{path.name}</span>
              </CardTitle>
              <p className="text-sm text-gray-600">{path.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {path.duration}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {path.resources.map((resource, resIndex) => {
                  const IconComponent = getTypeIcon(resource.type)
                  return (
                    <div key={resIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-800 truncate">{resource.title}</span>
                    </div>
                  )
                })}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Learning Outcomes:</h4>
                <ul className="space-y-1">
                  {path.outcomes.map((outcome, outIndex) => (
                    <li key={outIndex} className="flex items-start text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Resources Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>Complete Learning Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allResources.map((resource, index) => {
              const IconComponent = getTypeIcon(resource.type)
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3 mb-3">
                    <IconComponent className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{resource.provider}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{resource.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-xs", getDifficultyColor(resource.difficulty))}>
                        {resource.difficulty}
                      </Badge>
                      <Badge className={cn("text-xs", getCostColor(resource.cost))}>
                        {resource.cost}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.duration}
                      </div>
                      {resource.url && (
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="text-xs text-green-700">
                      📈 {resource.businessOutcome}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Award className="w-5 h-5" />
            <span>Your 90-Day Action Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-green-900 mb-3">Days 1-30: Foundation</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Complete 1-2 beginner courses
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Try 2-3 AI tools daily
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Track time saved
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Days 31-60: Application</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Apply AI to 3-5 work tasks
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Share learnings with team
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Measure productivity gains
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-purple-900 mb-3">Days 61-90: Leadership</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Mentor colleagues
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Lead AI pilot project
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  Retake assessment
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}