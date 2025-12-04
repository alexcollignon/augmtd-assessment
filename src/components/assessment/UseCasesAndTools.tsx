import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Search, 
  Code, 
  Image, 
  Users, 
  Lightbulb,
  TrendingUp,
  Clock,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Briefcase,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UseCasesAndToolsProps {
  userRole?: string
  userDepartment?: string
  userIndustry?: string
  overallScore: number
}

interface UseCase {
  category: string
  title: string
  description: string
  adoption: number
  timesSaved: string
  difficulty: 'easy' | 'medium' | 'hard'
  tools: string[]
  icon: React.ComponentType<any>
  businessValue: string
  exampleTasks: string[]
  roiMetrics: string
}

interface ToolAnalysis {
  name: string
  usage: number
  userRating: number
  category: string
  businessImpact: string
  costLevel: 'free' | 'low' | 'medium' | 'high'
  learningCurve: 'easy' | 'medium' | 'steep'
  recommendedFor: string[]
}

export function UseCasesAndTools({ userRole, userDepartment, userIndustry, overallScore }: UseCasesAndToolsProps) {
  
  // Mock data - in real implementation, this would come from aggregated company responses
  const topUseCases: UseCase[] = [
    {
      category: 'Content Creation',
      title: 'Email & Communication',
      description: 'Draft, refine, and personalize emails, messages, and communications',
      adoption: 78,
      timesSaved: '3-5 hours/week',
      difficulty: 'easy',
      tools: ['ChatGPT', 'Claude', 'Grammarly', 'Microsoft Copilot'],
      icon: MessageSquare,
      businessValue: 'Improved communication quality and speed',
      exampleTasks: ['Customer responses', 'Internal updates', 'Meeting summaries'],
      roiMetrics: '25% faster communication, 40% better clarity'
    },
    {
      category: 'Analysis & Research',
      title: 'Document Analysis & Summarization',
      description: 'Extract insights, summarize documents, and analyze large amounts of text',
      adoption: 65,
      timesSaved: '4-8 hours/week',
      difficulty: 'easy',
      tools: ['ChatGPT', 'Claude', 'Perplexity'],
      icon: FileText,
      businessValue: 'Faster decision-making with better information synthesis',
      exampleTasks: ['Report summaries', 'Market research', 'Policy analysis'],
      roiMetrics: '60% faster information processing'
    },
    {
      category: 'Data & Analytics',
      title: 'Data Analysis & Visualization',
      description: 'Analyze trends, create charts, and derive insights from data',
      adoption: 52,
      timesSaved: '2-6 hours/week',
      difficulty: 'medium',
      tools: ['Excel with AI', 'Tableau', 'Power BI', 'Python with AI'],
      icon: BarChart3,
      businessValue: 'Data-driven insights and faster reporting',
      exampleTasks: ['Sales analysis', 'Performance metrics', 'Trend identification'],
      roiMetrics: '50% faster data analysis, better insights'
    },
    {
      category: 'Research & Learning',
      title: 'Research & Information Gathering',
      description: 'Find, evaluate, and synthesize information from multiple sources',
      adoption: 61,
      timesSaved: '2-4 hours/week',
      difficulty: 'easy',
      tools: ['Perplexity', 'ChatGPT', 'Google Bard'],
      icon: Search,
      businessValue: 'More comprehensive and faster research',
      exampleTasks: ['Competitive analysis', 'Industry trends', 'Technical research'],
      roiMetrics: '3x faster research with better coverage'
    },
    {
      category: 'Creative Work',
      title: 'Creative Content & Design',
      description: 'Generate ideas, create visuals, and develop creative materials',
      adoption: 43,
      timesSaved: '3-7 hours/week',
      difficulty: 'medium',
      tools: ['Midjourney', 'DALL-E', 'Canva AI', 'Adobe Firefly'],
      icon: Image,
      businessValue: 'Faster creative iteration and ideation',
      exampleTasks: ['Marketing materials', 'Presentations', 'Social content'],
      roiMetrics: '40% faster content creation'
    },
    {
      category: 'Strategy & Planning',
      title: 'Strategic Planning & Ideation',
      description: 'Brainstorm ideas, analyze scenarios, and develop strategic plans',
      adoption: 39,
      timesSaved: '2-5 hours/week',
      difficulty: 'medium',
      tools: ['ChatGPT', 'Claude', 'Miro AI'],
      icon: Lightbulb,
      businessValue: 'Enhanced strategic thinking and planning',
      exampleTasks: ['SWOT analysis', 'Scenario planning', 'Innovation workshops'],
      roiMetrics: '30% better strategic outcomes'
    }
  ]

  const popularTools: ToolAnalysis[] = [
    {
      name: 'ChatGPT',
      usage: 82,
      userRating: 4.3,
      category: 'General AI Assistant',
      businessImpact: 'Broad productivity gains across all departments',
      costLevel: 'low',
      learningCurve: 'easy',
      recommendedFor: ['Writing', 'Analysis', 'Problem-solving', 'Learning']
    },
    {
      name: 'Microsoft Copilot',
      usage: 67,
      userRating: 4.1,
      category: 'Office Integration',
      businessImpact: 'Seamless integration with existing Microsoft workflows',
      costLevel: 'medium',
      learningCurve: 'easy',
      recommendedFor: ['Office tasks', 'Enterprise workflows', 'Collaboration']
    },
    {
      name: 'Claude',
      usage: 54,
      userRating: 4.4,
      category: 'Advanced Analysis',
      businessImpact: 'Superior analytical and reasoning capabilities',
      costLevel: 'low',
      learningCurve: 'easy',
      recommendedFor: ['Complex analysis', 'Research', 'Strategic thinking']
    },
    {
      name: 'Perplexity',
      usage: 48,
      userRating: 4.2,
      category: 'Research & Search',
      businessImpact: 'Enhanced research capabilities with source citations',
      costLevel: 'low',
      learningCurve: 'easy',
      recommendedFor: ['Research', 'Fact-checking', 'Current events']
    },
    {
      name: 'Grammarly',
      usage: 71,
      userRating: 4.0,
      category: 'Writing Assistant',
      businessImpact: 'Improved communication quality and professionalism',
      costLevel: 'low',
      learningCurve: 'easy',
      recommendedFor: ['Writing improvement', 'Professional communication']
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'bg-green-100 text-green-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleRelevantUseCases = () => {
    if (!userRole) return topUseCases.slice(0, 3)
    
    const roleMapping: Record<string, string[]> = {
      'Executive / C-Level Leader': ['Strategic Planning & Ideation', 'Document Analysis & Summarization', 'Data Analysis & Visualization'],
      'Team or Department Manager': ['Email & Communication', 'Data Analysis & Visualization', 'Strategic Planning & Ideation'],
      'Technical Expert / Engineer': ['Document Analysis & Summarization', 'Data Analysis & Visualization', 'Research & Information Gathering'],
      'Data & AI Specialist': ['Data Analysis & Visualization', 'Document Analysis & Summarization', 'Research & Information Gathering'],
      'Marketing, Sales & Customer': ['Creative Content & Design', 'Email & Communication', 'Data Analysis & Visualization'],
      'Customer Support & Success': ['Email & Communication', 'Document Analysis & Summarization', 'Research & Information Gathering']
    }
    
    const relevantTitles = roleMapping[userRole] || []
    return topUseCases.filter(useCase => relevantTitles.includes(useCase.title)).slice(0, 3)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Use Cases & Tools in Your Organization</h2>
        <p className="text-gray-600">Discover how your colleagues are using AI and which tools are driving the most value</p>
      </div>

      {/* Top Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Most Popular AI Use Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUseCases.slice(0, 6).map((useCase, index) => {
              const IconComponent = useCase.icon
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{useCase.adoption}%</div>
                      <div className="text-xs text-gray-500">adoption</div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time Saved:</span>
                      <span className="font-medium text-green-600">{useCase.timesSaved}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Difficulty:</span>
                      <Badge className={cn("text-xs", getDifficultyColor(useCase.difficulty))}>
                        {useCase.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Popular Tools:</p>
                    <div className="flex flex-wrap gap-1">
                      {useCase.tools.slice(0, 2).map((tool, toolIndex) => (
                        <span key={toolIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                      {useCase.tools.length > 2 && (
                        <span className="text-xs text-blue-600">+{useCase.tools.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations for Role */}
      {userRole && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Briefcase className="w-5 h-5" />
              <span>Recommended for {userRole}s</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getRoleRelevantUseCases().map((useCase, index) => {
                const IconComponent = useCase.icon
                return (
                  <div key={index} className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{useCase.businessValue}</p>
                    <div className="text-sm">
                      <span className="text-purple-700 font-medium">ROI: </span>
                      <span className="text-gray-700">{useCase.roiMetrics}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Tools Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span>Most Used AI Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularTools.map((tool, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-500">{tool.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-blue-600">{tool.usage}%</span>
                      <span className="text-sm text-gray-500">usage</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-3 h-3 rounded-full",
                            i < Math.floor(tool.userRating) ? "bg-yellow-400" : "bg-gray-200"
                          )}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">{tool.userRating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{tool.businessImpact}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Cost:</span>
                    <Badge className={cn("ml-2 text-xs", getCostColor(tool.costLevel))}>
                      {tool.costLevel}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Learning:</span>
                    <Badge className={cn("ml-2 text-xs", getDifficultyColor(tool.learningCurve))}>
                      {tool.learningCurve}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-gray-500">Best for:</span>
                    <div className="mt-1">
                      {tool.recommendedFor.slice(0, 2).map((rec, i) => (
                        <span key={i} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1 mb-1">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <BookOpen className="w-5 h-5" />
            <span>Getting Started Roadmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Start Simple</h3>
              <p className="text-sm text-green-800">Begin with email writing and document summarization using ChatGPT or Claude</p>
              <div className="mt-3">
                <Badge className="bg-green-100 text-green-800 text-xs">1-2 weeks</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Expand Usage</h3>
              <p className="text-sm text-blue-800">Add research and analysis tasks, explore role-specific tools and workflows</p>
              <div className="mt-3">
                <Badge className="bg-blue-100 text-blue-800 text-xs">1-2 months</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Advanced Integration</h3>
              <p className="text-sm text-purple-800">Create automated workflows, train colleagues, and drive department adoption</p>
              <div className="mt-3">
                <Badge className="bg-purple-100 text-purple-800 text-xs">3-6 months</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}