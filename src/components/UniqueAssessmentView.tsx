import React, { useState, useEffect } from 'react'
import { getAssessmentIdFromUrl } from '../router'
import { loadAssessmentByResultsId, AssessmentResultsData } from '../lib/assessmentResults'
import { AssessmentResults } from './assessment/AssessmentResults'
import { AssessmentProvider } from '../contexts/AssessmentContext'
import { AssessmentNavBar } from './AssessmentNavBar'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { AlertCircle } from 'lucide-react'

// Create a temporary context with assessment data for the results component
function createMockAssessmentContext(assessmentData: AssessmentResultsData) {
  // Store the assessment data globally for the results component to access
  localStorage.setItem('unique_assessment_session', JSON.stringify({
    email: assessmentData.submission.email,
    accessCode: assessmentData.cohort.access_code,
    cohortId: assessmentData.submission.cohort_id,
    companyId: assessmentData.submission.cohort_id,
    templateId: assessmentData.template.id,
    lastActivity: assessmentData.submission.completed_at,
    role: undefined,
    department: undefined,
    id: assessmentData.submission.id
  }))
  
  localStorage.setItem('unique_assessment_template', JSON.stringify(assessmentData.template))
  localStorage.setItem('unique_assessment_responses', JSON.stringify(assessmentData.submission.responses))
}

export function UniqueAssessmentView() {
  const [assessmentData, setAssessmentData] = useState<AssessmentResultsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAssessment = async () => {
      const resultsId = getAssessmentIdFromUrl()
      
      if (!resultsId) {
        setError('Invalid assessment URL')
        setIsLoading(false)
        return
      }

      try {
        const data = await loadAssessmentByResultsId(resultsId)
        if (data) {
          setAssessmentData(data)
        } else {
          setError('Assessment not found or results not available yet')
        }
      } catch (err) {
        console.error('Failed to load assessment:', err)
        setError('Failed to load assessment results')
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessment()

    // Cleanup function to remove temporary localStorage data when component unmounts
    return () => {
      localStorage.removeItem('unique_assessment_session')
      localStorage.removeItem('unique_assessment_template') 
      localStorage.removeItem('unique_assessment_responses')
    }
  }, [])

  const handleShareUrl = () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('Assessment URL copied to clipboard!')
    }).catch(() => {
      prompt('Copy this assessment URL:', currentUrl)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <AssessmentNavBar 
          subtitle="Loading Assessment Results..."
          showAdminButton={true}
          showBackButton={false}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <AssessmentNavBar 
          subtitle="Assessment Results"
          showAdminButton={true}
          showBackButton={true}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                Assessment Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">This could mean:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>The assessment URL is invalid or expired</li>
                  <li>The assessment results haven't been calculated yet</li>
                  <li>The assessment has been removed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return null
  }

  // Prepare the assessment data and use the full AssessmentResults component
  createMockAssessmentContext(assessmentData)

  return (
    <AssessmentProvider>
      <AssessmentResults />
    </AssessmentProvider>
  )
}