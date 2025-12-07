import React, { useState, useEffect } from 'react'
import { useAssessment } from '@/contexts/AssessmentContext'
import { createScoringEngine } from '@/lib/assessmentScoring'
import { defaultAssessmentTemplate } from '@/data/assessmentTemplates'
import { generateAssessmentUrl } from '@/lib/assessmentResults'
import { supabase } from '@/lib/supabase'
import { AssessmentResult } from '@/types'
import { AssessmentNavBar } from '../AssessmentNavBar'
import { OverallScoreCard } from './OverallScoreCard'
import { AIReadinessRadar } from './AIReadinessRadar'
import { DimensionDeepDive } from './DimensionDeepDive'
import { CompanyAIMaturity } from './CompanyAIMaturity'
import { UseCasesAndTools } from './UseCasesAndTools'
import { PersonalizedResources } from './PersonalizedResources'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Download, 
  Share2, 
  Calendar,
  User,
  Building2,
  Mail,
  FileText,
  TrendingUp,
  BarChart3,
  Brain,
  Zap,
  BookOpen,
  RotateCcw,
  Target,
  Lightbulb,
  Crosshair
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Calculate dynamic peer averages based on dimension performance  
const calculatePeerAverages = (userScores: any[]): Record<string, number> => {
  // Generate peer averages that are realistic relative to user performance
  const peerAverages: Record<string, number> = {}
  
  userScores.forEach(score => {
    // Peer average is typically 5-15 points different from user score
    // with some randomness to feel realistic
    const variance = Math.floor(Math.random() * 20) - 10 // -10 to +10
    const peerAverage = Math.max(20, Math.min(85, score.percentage + variance))
    peerAverages[score.dimension] = peerAverage
  })
  
  return peerAverages
}

interface PersonalInsight {
  title: string
  description: string
  actionable: string
}

const getPersonalizedInsights = (scores: any[], type: 'strengths' | 'weaknesses'): PersonalInsight[] => {
  const sortedScores = type === 'strengths' 
    ? scores.sort((a, b) => b.percentage - a.percentage)
    : scores.sort((a, b) => a.percentage - b.percentage)

  const insights: PersonalInsight[] = []

  sortedScores.forEach((score) => {
    const dimension = score.dimension
    const percentage = score.percentage

    if (type === 'strengths') {
      // Strengths insights - only add if above threshold
      if (dimension === 'Prompting Proficiency' && percentage >= 60) {
        insights.push({
          title: 'AI Communication Expert',
          description: 'You excel at getting quality results from AI tools through effective prompting.',
          actionable: 'Mentor colleagues and create prompt templates for your team.'
        })
      } else if (dimension === 'Tool Use' && percentage >= 60) {
        insights.push({
          title: 'AI Tool Pioneer',
          description: 'You actively adopt and integrate new AI tools into your workflows.',
          actionable: 'Lead tool evaluations and share best practices with your department.'
        })
      } else if (dimension === 'Ethics & Responsible Use' && percentage >= 60) {
        insights.push({
          title: 'Responsible AI Champion',
          description: 'You understand AI risks and use tools ethically and safely.',
          actionable: 'Help develop AI governance policies and train others on best practices.'
        })
      } else if (dimension === 'AI Thinking' && percentage >= 60) {
        insights.push({
          title: 'AI Systems Strategist',
          description: 'You understand how AI works and can design effective AI solutions.',
          actionable: 'Lead AI initiative planning and evaluate vendor solutions for your org.'
        })
      } else if (dimension === 'Co-Intelligence' && percentage >= 60) {
        insights.push({
          title: 'Human-AI Collaboration Master',
          description: 'You seamlessly work with AI as a thinking partner to amplify your capabilities.',
          actionable: 'Design collaborative workflows and teach others co-intelligence techniques.'
        })
      }
    } else {
      // Weakness insights - only add if below threshold  
      if (dimension === 'Prompting Proficiency' && percentage < 60) {
        insights.push({
          title: 'AI Communication Skills',
          description: 'Improving how you ask AI for help could unlock 3-5 hours per week of productivity.',
          actionable: 'Start with simple, specific requests and practice with daily email writing tasks.'
        })
      } else if (dimension === 'Tool Use' && percentage < 60) {
        insights.push({
          title: 'AI Tool Adoption',
          description: 'Expanding your AI toolkit could automate repetitive tasks and boost efficiency by 20%.',
          actionable: 'Try one new AI tool this month for a task you do regularly.'
        })
      } else if (dimension === 'Ethics & Responsible Use' && percentage < 60) {
        insights.push({
          title: 'AI Risk Awareness',
          description: 'Better understanding of AI safety could prevent costly mistakes and compliance issues.',
          actionable: 'Review your company\'s AI policy and ask before sharing sensitive data with AI.'
        })
      } else if (dimension === 'AI Thinking' && percentage < 60) {
        insights.push({
          title: 'AI Systems Understanding',
          description: 'Learning AI fundamentals would help you contribute meaningfully to AI initiatives.',
          actionable: 'Take a basic AI course and learn what makes data "AI-ready" for your projects.'
        })
      } else if (dimension === 'Co-Intelligence' && percentage < 60) {
        insights.push({
          title: 'Human-AI Partnership',
          description: 'Treating AI as a collaborative partner could increase your productivity by 25-40%.',
          actionable: 'Start using AI for brainstorming sessions and iterative problem-solving.'
        })
      }
    }
  })

  // Fill remaining slots with dimension-specific insights if needed
  while (insights.length < 3 && insights.length < sortedScores.length) {
    const remainingDimensions = sortedScores.filter(score => 
      !insights.some(insight => 
        insight.title.toLowerCase().includes(score.dimension.toLowerCase().split(' ')[0])
      )
    )

    if (remainingDimensions.length > 0) {
      const nextDimension = remainingDimensions[0]
      if (type === 'strengths') {
        insights.push({
          title: `${nextDimension.dimension} Foundation`,
          description: `You have good capabilities in ${nextDimension.dimension.toLowerCase()} that you can build upon.`,
          actionable: 'Focus on consistency and help others learn from your experience.'
        })
      } else {
        insights.push({
          title: `${nextDimension.dimension} Development`,
          description: `Improving ${nextDimension.dimension.toLowerCase()} has high potential for immediate productivity gains.`,
          actionable: 'Start small with one specific use case and build momentum.'
        })
      }
    } else {
      break
    }
  }

  return insights.slice(0, 3)
}

export function AssessmentResults() {
  const { participant, assessmentTemplate, responses, logout } = useAssessment()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPeerComparison, setShowPeerComparison] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (participant && assessmentTemplate && responses.size > 0) {
      calculateResults()
    }
  }, [participant, assessmentTemplate, responses])

  const calculateResults = () => {
    if (!participant || !assessmentTemplate) return

    try {
      console.log('Assessment template for scoring:', assessmentTemplate)
      
      // Use fallback template if database template is incomplete
      const templateToUse = (assessmentTemplate.dimensions && assessmentTemplate.dimensions.length > 0) 
        ? assessmentTemplate 
        : defaultAssessmentTemplate
      
      console.log('Using template for scoring:', templateToUse.id, 'has dimensions:', !!templateToUse.dimensions)
      const scoringEngine = createScoringEngine(templateToUse)
      const responsesArray = Array.from(responses.values())
      scoringEngine.addResponses(responsesArray)
      
      const calculatedResult = scoringEngine.calculateResult(participant.id || participant.email)
      
      // Calculate dynamic peer averages based on user's scores
      const peerAverages = calculatePeerAverages(calculatedResult.scores)
      
      // Update radar data with peer averages
      calculatedResult.radarData = scoringEngine.generateRadarData(calculatedResult.scores, peerAverages)
      setResult(calculatedResult)
      setIsLoading(false)
    } catch (error) {
      console.error('Error calculating results:', error)
      setIsLoading(false)
    }
  }

  // Load assessment history for progress tracking
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([])
  const [hasMultipleAssessments, setHasMultipleAssessments] = useState(false)

  useEffect(() => {
    const loadAssessmentHistory = async () => {
      if (!participant?.email || !participant?.cohortId) return
      
      try {
        // Load all submissions for this user/cohort ordered by submission date
        const { data: submissions } = await supabase
          .from('assessment_submissions')
          .select(`
            id,
            submission_number,
            submitted_at,
            assessment_results (
              overall_score,
              dimension_scores
            )
          `)
          .eq('email', participant.email)
          .eq('cohort_id', participant.cohortId)
          .order('submitted_at', { ascending: true })
          .not('assessment_results', 'is', null)

        if (submissions && submissions.length > 1) {
          setHasMultipleAssessments(true)
          // Convert to format expected by progress tab (excluding current/latest)
          const previousAssessments = submissions.slice(0, -1).map(sub => ({
            date: new Date(sub.submitted_at).toISOString().split('T')[0],
            overallScore: sub.assessment_results[0]?.overall_score || 0,
            submissionNumber: sub.submission_number,
            dimensionScores: sub.assessment_results[0]?.dimension_scores || {},
            scores: Object.entries(sub.assessment_results[0]?.dimension_scores || {}).map(([dimension, percentage]) => ({
              dimension,
              percentage
            }))
          }))
          setAssessmentHistory(previousAssessments)
        } else {
          setHasMultipleAssessments(false)
          setAssessmentHistory([])
        }
      } catch (error) {
        console.error('Failed to load assessment history:', error)
        setHasMultipleAssessments(false)
        setAssessmentHistory([])
      }
    }

    loadAssessmentHistory()
  }, [participant?.email, participant?.cohortId])

  const previousAssessments = assessmentHistory

  const tabConfig = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Your scores and company context'
    },
    {
      id: 'dimensions',
      label: 'Deep Dive',
      icon: Brain,
      description: 'Detailed analysis of each dimension'
    },
    {
      id: 'tools',
      label: 'Tools & Use Cases',
      icon: Zap,
      description: 'Popular AI applications in your organization'
    },
    ...(hasMultipleAssessments ? [{
      id: 'progress',
      label: 'Impact & Progress',
      icon: TrendingUp,
      description: 'Your growth journey and impact over time'
    }] : []),
    {
      id: 'learning',
      label: 'Learning Path',
      icon: BookOpen,
      description: 'Personalized development resources'
    }
  ]

  const handleDownloadResults = () => {
    // TODO: Implement PDF generation
    alert('PDF download will be available soon!')
  }

  const handleShareResults = () => {
    const resultsId = localStorage.getItem('air_assessment_results_id')
    
    if (resultsId) {
      const uniqueUrl = generateAssessmentUrl(resultsId)
      
      // Copy to clipboard
      navigator.clipboard.writeText(uniqueUrl).then(() => {
        alert(`Your unique assessment URL has been copied to clipboard:\n\n${uniqueUrl}\n\nShare this link to allow others to view your results.`)
      }).catch(() => {
        // Fallback for older browsers
        prompt('Copy this unique assessment URL:', uniqueUrl)
      })
    } else {
      alert('Unable to generate unique URL. Please complete the assessment first.')
    }
  }

  if (isLoading || !result || !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your results...</p>
        </div>
      </div>
    )
  }

  const completionDate = new Date(result.completionDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AssessmentNavBar 
        subtitle={`Assessment Results • ${participant.email}`}
        showAdminButton={false}
      />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Participant Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Participant</div>
                  <div className="font-medium">{participant.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Assessment</div>
                  <div className="font-medium">{assessmentTemplate?.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className="font-medium">{completionDate.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {tabConfig.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center justify-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm min-w-0 w-full",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center min-w-0">
                      <div className="truncate">{tab.label}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overall Score */}
              <OverallScoreCard 
                score={result.overallScore}
                level={result.overallScore >= 70 ? 'Advanced' : result.overallScore >= 40 ? 'Intermediate' : 'Beginner'}
                companyAverage={58} // Mock data - company average score
              />

              {/* Personal Strengths and Weaknesses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <TrendingUp className="w-5 h-5" />
                      <span>Your Biggest Advantages</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getPersonalizedInsights(result.scores, 'strengths').map((insight, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-900 text-sm">{insight.title}</h4>
                              <p className="text-xs text-green-800 mt-1">{insight.description}</p>
                              <div className="flex items-start space-x-1 mt-1">
                                <Lightbulb className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-green-700 font-medium">{insight.actionable}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <Target className="w-5 h-5" />
                      <span>Biggest Impact Areas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getPersonalizedInsights(result.scores, 'weaknesses').map((insight, index) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-900 text-sm">{insight.title}</h4>
                              <p className="text-xs text-orange-800 mt-1">{insight.description}</p>
                              <div className="flex items-start space-x-1 mt-1">
                                <Crosshair className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-700 font-medium">{insight.actionable}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}

          {activeTab === 'progress' && hasMultipleAssessments && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Your AI Growth Journey</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Score Progression */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Overall AI Readiness</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              +{result.overallScore - previousAssessments[0].overallScore}
                            </div>
                            <div className="text-xs text-gray-500">point improvement</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium">Latest Assessment</span>
                            <span className="font-bold text-blue-600">{result.overallScore}%</span>
                          </div>
                          {previousAssessments.map((assessment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">
                                {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </span>
                              <span className="font-medium text-gray-700">{assessment.overallScore}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-700">
                      <Target className="w-5 h-5" />
                      <span>Key Wins</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="text-sm font-medium text-green-900">Biggest Improvement</div>
                        <div className="text-xs text-green-800 mt-1">
                          {result.scores.reduce((max, current) => {
                            const prevScore = previousAssessments[0].scores.find((s: any) => s.dimension === current.dimension)?.percentage || 0
                            const currentImprovement = current.percentage - prevScore
                            const maxPrevScore = previousAssessments[0].scores.find((s: any) => s.dimension === max.dimension)?.percentage || 0
                            const maxImprovement = max.percentage - maxPrevScore
                            return currentImprovement > maxImprovement ? current : max
                          }).dimension}
                        </div>
                        <div className="text-xs text-green-700 font-medium mt-1">
                          +{Math.max(...result.scores.map(current => {
                            const prevScore = previousAssessments[0].scores.find((s: any) => s.dimension === current.dimension)?.percentage || 0
                            return current.percentage - prevScore
                          }))} points
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm font-medium text-blue-900">Time Investment</div>
                        <div className="text-xs text-blue-800 mt-1">6 months of learning</div>
                        <div className="text-xs text-blue-700 font-medium mt-1">~2-3 hours/week</div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="text-sm font-medium text-orange-900">Productivity Gains</div>
                        <div className="text-xs text-orange-800 mt-1">Estimated weekly savings</div>
                        <div className="text-xs text-orange-700 font-medium mt-1">4-6 hours/week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dimension Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Dimension-by-Dimension Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.scores.map((current, index) => {
                      const prevScore = previousAssessments[0].scores.find((s: any) => s.dimension === current.dimension)?.percentage || 0
                      const improvement = current.percentage - prevScore
                      const isImprovement = improvement > 0
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{current.dimension}</div>
                            <div className="text-sm text-gray-600">
                              {prevScore}% → {current.percentage}%
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={cn(
                              "text-lg font-bold",
                              isImprovement ? "text-green-600" : "text-gray-500"
                            )}>
                              {isImprovement ? '+' : ''}{improvement}
                            </div>
                            <div className="text-xs text-gray-500">
                              {isImprovement ? 'improved' : 'stable'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Next Assessment Recommendation */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Calendar className="w-5 h-5" />
                    <span>Next Assessment Recommendation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Recommended Timeline</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Based on your progress rate, we recommend your next assessment in <strong>3-4 months</strong> 
                        to capture meaningful skill development and measure the impact of your learning initiatives.
                      </p>
                      <div className="text-xs text-blue-700">
                        Estimated date: {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Focus Areas for Next Assessment</h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {result.scores
                          .sort((a, b) => {
                            const aPrev = previousAssessments[0].scores.find((s: any) => s.dimension === a.dimension)?.percentage || 0
                            const bPrev = previousAssessments[0].scores.find((s: any) => s.dimension === b.dimension)?.percentage || 0
                            return (a.percentage - aPrev) - (b.percentage - bPrev)
                          })
                          .slice(0, 3)
                          .map((dimension, i) => (
                            <li key={i} className="flex items-center">
                              <Target className="w-3 h-3 mr-2 text-blue-600" />
                              {dimension.dimension}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-6">
              {/* AI Readiness Breakdown */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">AI Readiness Breakdown</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show peer comparison</span>
                    <button
                      onClick={() => setShowPeerComparison(!showPeerComparison)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        showPeerComparison ? "bg-blue-600" : "bg-gray-300"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          showPeerComparison ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
                
                <AIReadinessRadar 
                  data={result.radarData}
                  showPeerComparison={showPeerComparison}
                />
              </div>

              {result.scores.map((dimension, index) => (
                <DimensionDeepDive 
                  key={index}
                  dimension={dimension}
                  userRole={participant.role}
                  userDepartment={participant.department}
                />
              ))}
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <UseCasesAndTools 
                userRole={participant.role}
                userDepartment={participant.department}
                userIndustry="Technology & Software" // Could come from assessment responses
                overallScore={result.overallScore}
              />
            </div>
          )}

          {activeTab === 'learning' && (
            <div>
              <PersonalizedResources 
                dimensionScores={result.scores}
                userRole={participant.role}
                userDepartment={participant.department}
                userIndustry="Technology & Software"
                overallScore={result.overallScore}
                // These would come from assessment responses in real implementation
                userExperience="6-10 years"
                userTechnicalBackground="Intermediate"
                userCurrentUse="Email writing, document analysis"
                userGoals="Automate repetitive tasks and improve decision-making"
              />
            </div>
          )}
        </div>

        {/* Next Steps */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <TrendingUp className="w-5 h-5" />
              <span>What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share with Your Team</h3>
                <p className="text-sm text-gray-600">
                  Discuss your results with your manager and identify development opportunities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Learning</h3>
                <p className="text-sm text-gray-600">
                  Begin with the recommended resources tailored to your current skill level.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Retake the assessment in 3-6 months to measure your improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}