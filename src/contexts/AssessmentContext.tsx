import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AssessmentTemplate, AssessmentResponse } from '@/types'
import { supabase } from '@/lib/supabase'

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
      console.log('Calculating assessment results...')
      
      // TODO: Implement actual scoring logic based on responses
      // For now, create placeholder results structure
      
      const dimensionScores = {
        strategy: Math.floor(Math.random() * 40 + 60), // 60-100
        cost: Math.floor(Math.random() * 40 + 60),
        organization: Math.floor(Math.random() * 40 + 60),
        technology: Math.floor(Math.random() * 40 + 60),
        data: Math.floor(Math.random() * 40 + 60),
        security: Math.floor(Math.random() * 40 + 60)
      }
      
      const overallScore = Math.round(
        Object.values(dimensionScores).reduce((sum: number, score: number) => sum + score, 0) / 6
      )
      
      const recommendationReport = {
        summary: "Based on your responses, here are your personalized AI readiness recommendations.",
        strengths: ["Strong strategic vision", "Good technical foundation"],
        improvements: ["Enhance data governance", "Expand AI training programs"],
        actionPlan: [
          { priority: "High", action: "Develop AI governance framework", timeline: "3 months" },
          { priority: "Medium", action: "Implement AI training program", timeline: "6 months" }
        ],
        nextSteps: "Focus on building a comprehensive AI strategy and improving team capabilities."
      }
      
      // Store results (always insert new record for each submission)
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          submission_id: submissionId,
          email,
          cohort_id: cohortId,
          submission_number: submissionNumber,
          dimension_scores: dimensionScores,
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