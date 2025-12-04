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
      const storedSession = localStorage.getItem('air_assessment_session')
      const storedTemplate = localStorage.getItem('air_assessment_template')
      const storedSection = localStorage.getItem('air_current_section')
      
      if (storedSession && storedTemplate) {
        const sessionData = JSON.parse(storedSession)
        const templateData = JSON.parse(storedTemplate)
        
        setParticipant(sessionData)
        setAssessmentTemplate(templateData)
        
        if (storedSection) {
          setCurrentSectionState(storedSection)
        }
        
        // Load existing responses for this email/cohort
        await loadExistingResponses(sessionData.email, sessionData.cohortId)
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Session load failed:', error)
      logout()
      setIsLoading(false)
    }
  }

  const loadExistingResponses = async (email: string, cohortId: string) => {
    try {
      const { data: responses } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('email', email)
        .eq('cohort_id', cohortId)
      
      if (responses) {
        const responsesMap = new Map()
        responses.forEach(response => {
          const assessmentResponse: AssessmentResponse = {
            participantId: email, // Use email as participant identifier
            assessmentId: response.assessment_id || '',
            sectionId: response.section_id,
            questionId: response.question_id,
            value: response.response_value,
            timestamp: new Date(response.created_at)
          }
          const key = `${response.section_id}-${response.question_id}`
          responsesMap.set(key, assessmentResponse)
        })
        setResponses(responsesMap)
      }
    } catch (error) {
      console.error('Failed to load existing responses:', error)
    }
  }

  const accessAssessment = async (email: string, accessCode: string): Promise<boolean> => {
    // This function is not used anymore since authentication happens in AssessmentAccessPage
    // But keeping it for backwards compatibility
    return false
  }

  const saveResponse = async (sectionId: string, questionId: string, value: string | string[] | number) => {
    if (!participant || !assessmentTemplate) return

    try {
      // Save to database
      const responseData = {
        email: participant.email,
        cohort_id: participant.cohortId,
        assessment_id: assessmentTemplate.id,
        section_id: sectionId,
        question_id: questionId,
        response_value: Array.isArray(value) ? JSON.stringify(value) : String(value),
        created_at: new Date().toISOString()
      }

      // Upsert the response (update if exists, insert if not)
      await supabase
        .from('assessment_responses')
        .upsert(responseData, {
          onConflict: 'email,cohort_id,section_id,question_id',
          ignoreDuplicates: false
        })

      // Update local state
      const key = `${sectionId}-${questionId}`
      const assessmentResponse: AssessmentResponse = {
        participantId: participant.email,
        assessmentId: assessmentTemplate.id,
        sectionId,
        questionId,
        value,
        timestamp: new Date()
      }
      
      const newResponses = new Map(responses)
      newResponses.set(key, assessmentResponse)
      setResponses(newResponses)
    } catch (error) {
      console.error('Failed to save response:', error)
    }
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
      // Mark assessment as completed
      await updateProgress(100)
      
      // Optionally save completion status to assessment_results table
      await supabase
        .from('assessment_results')
        .upsert({
          email: participant.email,
          cohort_id: participant.cohortId,
          completion_status: 'completed',
          completed_at: new Date().toISOString(),
          total_responses: responses.size
        }, {
          onConflict: 'email,cohort_id'
        })
    } catch (error) {
      console.error('Failed to complete assessment:', error)
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