import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AssessmentTemplate, AssessmentResponse } from '@/types'
import { supabase } from '@/lib/supabase'
import { createScoringEngine } from '@/lib/assessmentScoring'
import { defaultAssessmentTemplate } from '@/data/assessmentTemplates'

interface AssessmentSession {
  email: string
  accessCode: string
  cohortId: string
  companyId: string
  templateId: string
  lastActivity: string
  role?: string
  department?: string
  id?: string
  assessmentStatus?: 'not_started' | 'in_progress' | 'completed'
  completionPercentage?: number
}

interface AssessmentContextType {
  participant: AssessmentSession | null
  assessmentTemplate: AssessmentTemplate | null
  responses: Map<string, AssessmentResponse>
  isAuthenticated: boolean
  isLoading: boolean
  accessAssessment: (email: string, accessCode: string) => Promise<boolean>
  updateProgress: (percentage: number) => Promise<void>
  completeAssessment: () => Promise<void>
  saveResponse: (sectionId: string, questionId: string, value: string | string[] | number) => Promise<void>
  getResponse: (sectionId: string, questionId: string) => AssessmentResponse | undefined
  getCurrentSection: () => string
  setCurrentSection: (section: string) => void
  logout: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider')
  }
  return context
}

interface AssessmentProviderProps {
  children: ReactNode
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
  const [participant, setParticipant] = useState<AssessmentSession | null>(null)
  const [assessmentTemplate, setAssessmentTemplate] = useState<AssessmentTemplate | null>(null)
  const [responses, setResponses] = useState<Map<string, AssessmentResponse>>(new Map())
  const [currentSection, setCurrentSectionState] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    try {
      // Check if we're in unique assessment view mode (only when URL starts with /a/)
      const isUniqueAssessmentUrl = window.location.pathname.startsWith('/a/')
      const uniqueSession = localStorage.getItem('unique_assessment_session')
      const uniqueTemplate = localStorage.getItem('unique_assessment_template')
      const uniqueResponses = localStorage.getItem('unique_assessment_responses')
      
      if (isUniqueAssessmentUrl && uniqueSession && uniqueTemplate && uniqueResponses) {
        // Load data for unique assessment view
        const sessionData = JSON.parse(uniqueSession)
        const templateData = JSON.parse(uniqueTemplate)
        const responsesData = JSON.parse(uniqueResponses)
        
        setParticipant(sessionData)
        setAssessmentTemplate(templateData)
        setCurrentSectionState('completed')
        
        // Convert responses object to Map format
        const responsesMap = new Map()
        Object.entries(responsesData).forEach(([key, value]) => {
          const [sectionId, questionId] = key.split('-')
          responsesMap.set(key, {
            participantId: sessionData.email,
            assessmentId: sessionData.cohortId,
            sectionId,
            questionId,
            value,
            timestamp: new Date()
          })
        })
        setResponses(responsesMap)
        
        setIsLoading(false)
        return
      }

      // Clear any unique assessment data that might be lingering
      localStorage.removeItem('unique_assessment_session')
      localStorage.removeItem('unique_assessment_template')
      localStorage.removeItem('unique_assessment_responses')

      // Regular assessment session loading
      const storedSession = localStorage.getItem('air_assessment_session')
      const storedTemplate = localStorage.getItem('air_assessment_template')
      
      if (storedSession && storedTemplate) {
        const sessionData = JSON.parse(storedSession)
        const templateData = JSON.parse(storedTemplate)
        
        setParticipant(sessionData)
        setAssessmentTemplate(templateData)
        
        // Always start from the beginning for fresh assessment
        // Since responses are only stored locally until completion,
        // resuming from middle section without saved responses creates inconsistent state
        setCurrentSectionState('profile')
        localStorage.setItem('air_current_section', 'profile')
        
        // Clear any existing local responses for fresh start
        setResponses(new Map())
        
        // Each assessment is always fresh - no need to check existing submissions
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Session load failed:', error)
      logout()
      setIsLoading(false)
    }
  }


  const accessAssessment = async (email: string, accessCode: string): Promise<boolean> => {
    // This function is not used anymore since authentication happens in AssessmentAccessPage
    // But keeping it for backwards compatibility
    return false
  }

  const saveResponse = async (sectionId: string, questionId: string, value: string | string[] | number) => {
    if (!participant || !assessmentTemplate) {
      console.error('Cannot save response: missing participant or template')
      return
    }

    console.log('Saving response locally:', { sectionId, questionId, value })

    // For one-shot assessment, just update local state
    // Database save happens only on final submission
    const key = `${sectionId}-${questionId}`
    const assessmentResponse: AssessmentResponse = {
      participantId: participant.email,
      assessmentId: participant.cohortId,
      sectionId,
      questionId,
      value,
      timestamp: new Date()
    }
    
    const newResponses = new Map(responses)
    newResponses.set(key, assessmentResponse)
    setResponses(newResponses)
  }

  const getResponse = (sectionId: string, questionId: string): AssessmentResponse | undefined => {
    const key = `${sectionId}-${questionId}`
    return responses.get(key)
  }

  const updateProgress = async (percentage: number) => {
    // Since we don't have participants table, we can track progress locally
    // or save it as a special response type
    if (participant) {
      localStorage.setItem('air_assessment_progress', JSON.stringify({
        email: participant.email,
        cohortId: participant.cohortId,
        percentage,
        lastUpdated: new Date().toISOString()
      }))
    }
  }

  const completeAssessment = async () => {
    if (!participant) return
    
    try {
      console.log('Submitting complete assessment to database...')
      
      // Convert local responses to simple object format
      const responsesObject: Record<string, any> = {}
      responses.forEach((response, key) => {
        responsesObject[key] = response.value
      })

      console.log('Final responses:', responsesObject)

      // Calculate submission number for this user/cohort
      const { data: existingSubmissions, error: countError } = await supabase
        .from('assessment_submissions')
        .select('submission_number')
        .eq('email', participant.email)
        .eq('cohort_id', participant.cohortId)
        .order('submission_number', { ascending: false })
        .limit(1)

      const submissionNumber = (existingSubmissions?.[0]?.submission_number || 0) + 1
      console.log(`Creating submission #${submissionNumber} for ${participant.email}`)

      // Submit complete assessment to database (always insert new record)
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('assessment_submissions')
        .insert({
          email: participant.email,
          cohort_id: participant.cohortId,
          responses: responsesObject,
          submission_number: submissionNumber,
          submitted_at: now,
          started_at: now, // For one-shot, started when completed
          completed_at: now
        })
        .select()

      if (error) {
        console.error('Failed to submit assessment:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Successfully submitted assessment:', data)
      
      // Calculate and store results with submission ID and number
      const submissionId = data[0]?.id
      if (submissionId) {
        const resultsId = await calculateAssessmentResults(participant.email, participant.cohortId, responsesObject, submissionId, submissionNumber)
        
        // Store the results ID for navigation
        if (resultsId) {
          localStorage.setItem('air_assessment_results_id', resultsId)
        }
      }
      
    } catch (error) {
      console.error('Failed to complete assessment:', error)
      throw error
    }
  }

  const calculateAssessmentResults = async (email: string, cohortId: string, responses: Record<string, any>, submissionId: string, submissionNumber: number) => {
    try {
      console.log('Calculating assessment results using real scoring engine...')
      
      if (!assessmentTemplate) {
        console.error('Assessment template not available for scoring')
        return null
      }

      // Use the real scoring engine (with fallback if database template incomplete)
      const templateToUse = (assessmentTemplate.dimensions && assessmentTemplate.dimensions.length > 0) 
        ? assessmentTemplate 
        : defaultAssessmentTemplate
        
      console.log('Database template complete?', !!assessmentTemplate.dimensions, 'Using fallback?', templateToUse.id === defaultAssessmentTemplate.id)
      const scoringEngine = createScoringEngine(templateToUse)
      
      // Convert responses object back to AssessmentResponse format
      const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(([key, value]) => {
        const [sectionId, questionId] = key.split('-')
        return {
          participantId: email,
          assessmentId: cohortId,
          sectionId,
          questionId,
          value,
          timestamp: new Date()
        }
      })
      
      // Add responses to scoring engine
      scoringEngine.addResponses(assessmentResponses)
      
      // Calculate real scores
      const result = scoringEngine.calculateResult(email)
      const dimensionScores = result.scores
      const overallScore = result.overallScore
      
      console.log('Real calculated scores:', { dimensionScores, overallScore })
      
      // Convert dimension scores to the database format
      const dimensionScoresObject: Record<string, number> = {}
      dimensionScores.forEach(score => {
        // Map dimension names to database field names
        const dimensionKey = score.dimension.toLowerCase().replace(/[^a-z]/g, '')
        dimensionScoresObject[dimensionKey] = score.percentage
      })
      
      // Generate real recommendation report based on calculated scores
      const recommendations = result.recommendations || []
      const lowScoreDimensions = dimensionScores.filter(d => d.percentage < 60)
      const highScoreDimensions = dimensionScores.filter(d => d.percentage >= 70)
      
      const recommendationReport = {
        summary: `Based on your assessment responses, your overall AI readiness score is ${overallScore}%.`,
        strengths: highScoreDimensions.length > 0 
          ? highScoreDimensions.map(d => `Strong performance in ${d.dimension} (${d.percentage}%)`)
          : ["Consistent performance across all AI dimensions"],
        improvements: lowScoreDimensions.length > 0
          ? lowScoreDimensions.map(d => `Focus on developing ${d.dimension} skills (${d.percentage}%)`)
          : ["Continue strengthening all dimensions for advanced AI readiness"],
        actionPlan: recommendations.slice(0, 3).map((rec, index) => ({
          priority: index === 0 ? "High" : index === 1 ? "Medium" : "Low",
          action: rec,
          timeline: index === 0 ? "1-2 months" : index === 1 ? "3-4 months" : "6 months"
        })),
        nextSteps: recommendations.length > 0 
          ? recommendations[0]
          : "Continue practicing with AI tools and expand your knowledge in weaker areas."
      }
      
      // Store results (always insert new record for each submission)
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          submission_id: submissionId,
          email,
          cohort_id: cohortId,
          submission_number: submissionNumber,
          dimension_scores: dimensionScoresObject,
          overall_score: overallScore,
          recommendation_report: recommendationReport,
          calculated_at: new Date().toISOString(),
          report_generated_at: new Date().toISOString()
        })
        .select()
      
      if (error) {
        console.error('Failed to store results:', error)
        throw error
      }
      
      console.log('Successfully calculated and stored results:', data)
      
      // Return the results ID for unique URL generation
      return data[0]?.id
      
    } catch (error) {
      console.error('Failed to calculate results:', error)
      return null
    }
  }

  const getCurrentSection = () => {
    return currentSection
  }

  const setCurrentSection = (section: string) => {
    setCurrentSectionState(section)
    localStorage.setItem('air_current_section', section)
  }

  const logout = () => {
    localStorage.removeItem('air_assessment_session')
    localStorage.removeItem('air_assessment_template')
    localStorage.removeItem('air_current_section')
    localStorage.removeItem('air_assessment_progress')
    setParticipant(null)
    setAssessmentTemplate(null)
    setResponses(new Map())
    setCurrentSectionState('profile')
  }

  const value = {
    participant,
    assessmentTemplate,
    responses,
    isAuthenticated: !!participant && !!assessmentTemplate,
    isLoading,
    accessAssessment,
    updateProgress,
    completeAssessment,
    saveResponse,
    getResponse,
    getCurrentSection,
    setCurrentSection,
    logout
  }

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}