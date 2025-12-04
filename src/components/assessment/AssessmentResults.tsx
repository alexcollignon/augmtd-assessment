import React, { useState, useEffect } from 'react'
import { useAssessment } from '@/contexts/AssessmentContext'
import { createScoringEngine } from '@/lib/assessmentScoring'
import { AssessmentResult } from '@/types'
import { AssessmentNavBar } from '../AssessmentNavBar'
import { OverallScoreCard } from './OverallScoreCard'
import { AIReadinessRadar } from './AIReadinessRadar'
import { RecommendationsSection } from './RecommendationsSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Download, 
  Share2, 
  RotateCcw, 
  Calendar,
  User,
  Building2,
  Mail,
  FileText,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock peer averages for demonstration
const mockPeerAverages = {
  'Prompting Proficiency': 62,
  'Tool Use': 58,
  'Ethics & Responsible Use': 71,
  'AI Thinking': 49,
  'Co-Intelligence': 66
}

export function AssessmentResults() {
  const { participant, assessmentTemplate, responses, logout } = useAssessment()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPeerComparison, setShowPeerComparison] = useState(false)

  useEffect(() => {
    if (participant && assessmentTemplate && responses.size > 0) {
      calculateResults()
    }
  }, [participant, assessmentTemplate, responses])

  const calculateResults = () => {
    if (!participant || !assessmentTemplate) return

    try {
      const scoringEngine = createScoringEngine(assessmentTemplate)
      const responsesArray = Array.from(responses.values())
      scoringEngine.addResponses(responsesArray)
      
      const calculatedResult = scoringEngine.calculateResult(participant.id, mockPeerAverages)
      setResult(calculatedResult)
      setIsLoading(false)
    } catch (error) {
      console.error('Error calculating results:', error)
      setIsLoading(false)
    }
  }

  const handleRetakeAssessment = () => {
    // Clear current session and restart
    logout()
    window.location.reload()
  }

  const handleDownloadResults = () => {
    // TODO: Implement PDF generation
    alert('PDF download will be available soon!')
  }

  const handleShareResults = () => {
    // TODO: Implement sharing functionality
    alert('Results sharing will be available soon!')
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your AI Readiness Results
          </h1>
          <p className="text-gray-600 mb-6">
            Assessment completed on {completionDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleDownloadResults}
              className="flex items-center space-x-2"
              variant="primary"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
            
            <Button 
              onClick={handleShareResults}
              className="flex items-center space-x-2"
              variant="secondary"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </Button>
            
            <Button 
              onClick={handleRetakeAssessment}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </Button>
          </div>
        </div>

        {/* Participant Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Questions</div>
                  <div className="font-medium">{responses.size} answered</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <div className="mb-8">
          <OverallScoreCard 
            score={result.overallScore}
            level={result.overallScore >= 70 ? 'Advanced' : result.overallScore >= 40 ? 'Intermediate' : 'Beginner'}
            participantCount={1247} // Mock data
            industryAverage={61} // Mock data
          />
        </div>

        {/* Radar Chart and Peer Comparison Toggle */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Dimension Breakdown</h2>
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

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Action Plan</h2>
          <RecommendationsSection 
            recommendations={result.recommendations || []}
            dimensionScores={result.scores}
            overallScore={result.overallScore}
          />
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