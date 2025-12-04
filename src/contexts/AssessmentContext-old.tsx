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
  const [currentSection, setCurrentSection] = useState<string>('profile')
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
          setCurrentSection(storedSection)
        }
        
        // Load existing responses for this email/cohort
        await loadExistingResponses(sessionData.email, sessionData.cohortId)
          
          if (responses) {
            const responsesMap = new Map()
            responses.forEach(response => {
              const assessmentResponse: AssessmentResponse = {
                participantId: response.participant_id,
                assessmentId: template.id,
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
        } else {
          localStorage.removeItem('air_assessment_participant')
        }
      }
      
      if (storedSection) {
        setCurrentSection(storedSection)
      }
    } catch (error) {
      console.error('Session load failed:', error)
      localStorage.removeItem('air_assessment_participant')
    }
    
    setIsLoading(false)
  }

  const accessAssessment = async (email: string, accessCode: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Query participant from database
      const { data: dbParticipant, error } = await supabase
        .from('participants')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('access_code', accessCode)
        .single()

      if (error || !dbParticipant) {
        setIsLoading(false)
        return false
      }

      // Get cohort and template information separately
      const { data: cohortData, error: cohortError } = await supabase
        .from('cohorts')
        .select(`
          id,
          template_id,
          company_id,
          assessment_templates (
            id,
            name,
            template_data
          )
        `)
        .eq('id', dbParticipant.cohort_id)
        .single()

      if (cohortError || !cohortData) {
        setIsLoading(false)
        return false
      }

      // Update last activity
      await supabase
        .from('participants')
        .update({ 
          last_activity_at: new Date().toISOString(),
          started_at: dbParticipant.started_at || new Date().toISOString()
        })
        .eq('id', dbParticipant.id)

      // Create participant object
      const participant: AssessmentParticipant = {
        id: dbParticipant.id,
        email: dbParticipant.email,
        name: dbParticipant.name,
        department: dbParticipant.department,
        role: dbParticipant.role,
        accessCode: dbParticipant.access_code,
        cohortId: dbParticipant.cohort_id,
        assessmentStatus: dbParticipant.status,
        completionPercentage: dbParticipant.completion_percentage,
        lastActivity: new Date(),
        companyId: cohortData.company_id,
        templateId: cohortData.template_id
      }

      // Create template object
      const templateData = cohortData.assessment_templates.template_data
      const template: AssessmentTemplate = {
        id: cohortData.assessment_templates.id,
        name: cohortData.assessment_templates.name,
        companyId: cohortData.company_id,
        ...templateData
      }

      // Load existing responses
      const { data: responses } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('participant_id', participant.id)

      const responsesMap = new Map()
      if (responses) {
        responses.forEach(response => {
          const assessmentResponse: AssessmentResponse = {
            participantId: response.participant_id,
            assessmentId: template.id,
            sectionId: response.section_id,
            questionId: response.question_id,
            value: response.response_value,
            timestamp: new Date(response.created_at)
          }
          const key = `${response.section_id}-${response.question_id}`
          responsesMap.set(key, assessmentResponse)
        })
      }

      setParticipant(participant)
      setAssessmentTemplate(template)
      setResponses(responsesMap)
      localStorage.setItem('air_assessment_participant', JSON.stringify(participant))
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Assessment access error:', error)
      setIsLoading(false)
      return false
    }
  }

  const updateProgress = async (percentage: number) => {
    if (participant) {
      const status = percentage === 100 ? 'completed' : 'in_progress'
      
      // Update in database
      await supabase
        .from('participants')
        .update({
          completion_percentage: percentage,
          status,
          last_activity_at: new Date().toISOString(),
          ...(percentage === 100 && { completed_at: new Date().toISOString() })
        })
        .eq('id', participant.id)

      const updatedParticipant = {
        ...participant,
        completionPercentage: percentage,
        assessmentStatus: status,
        lastActivity: new Date()
      }
      setParticipant(updatedParticipant)
      localStorage.setItem('air_assessment_participant', JSON.stringify(updatedParticipant))
    }
  }

  const completeAssessment = async () => {
    if (participant) {
      await updateProgress(100)
    }
  }

  const saveResponse = async (sectionId: string, questionId: string, value: string | string[] | number) => {
    if (!participant || !assessmentTemplate) return
    
    // Save to database with upsert (insert or update)
    await supabase
      .from('assessment_responses')
      .upsert({
        participant_id: participant.id,
        section_id: sectionId,
        question_id: questionId,
        response_value: value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'participant_id,section_id,question_id'
      })
    
    const response: AssessmentResponse = {
      participantId: participant.id,
      assessmentId: assessmentTemplate.id,
      sectionId,
      questionId,
      value,
      timestamp: new Date()
    }
    
    const key = `${sectionId}-${questionId}`
    const newResponses = new Map(responses)
    newResponses.set(key, response)
    setResponses(newResponses)
  }
  
  const getResponse = (sectionId: string, questionId: string): AssessmentResponse | undefined => {
    const key = `${sectionId}-${questionId}`
    return responses.get(key)
  }
  
  const getCurrentSection = (): string => {
    return currentSection
  }
  
  const handleSetCurrentSection = (section: string) => {
    setCurrentSection(section)
    localStorage.setItem('air_current_section', section)
  }

  const logout = () => {
    setParticipant(null)
    setAssessmentTemplate(null)
    setResponses(new Map())
    setCurrentSection('profile')
    localStorage.removeItem('air_assessment_participant')
    localStorage.removeItem('air_current_section')
  }

  const value = {
    participant,
    assessmentTemplate,
    responses,
    isAuthenticated: !!participant,
    isLoading,
    accessAssessment,
    updateProgress,
    completeAssessment,
    saveResponse,
    getResponse,
    getCurrentSection,
    setCurrentSection: handleSetCurrentSection,
    logout
  }

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}