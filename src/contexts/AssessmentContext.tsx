import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AssessmentTemplate, AssessmentResponse } from '@/types'
import { getAssessmentTemplateForAccessCode, getAssessmentConfigByAccessCode } from '@/data/assessmentTemplates'

interface AssessmentParticipant {
  id: string
  email: string
  name?: string
  department?: string
  role?: string
  accessCode: string
  cohortId: string
  assessmentStatus: 'not_started' | 'in_progress' | 'completed'
  completionPercentage: number
  lastActivity?: Date
  companyId?: string
  templateId?: string
}

interface AssessmentContextType {
  participant: AssessmentParticipant | null
  assessmentTemplate: AssessmentTemplate | null
  responses: Map<string, AssessmentResponse>
  isAuthenticated: boolean
  isLoading: boolean
  accessAssessment: (email: string, accessCode: string) => Promise<boolean>
  updateProgress: (percentage: number) => void
  completeAssessment: () => void
  saveResponse: (sectionId: string, questionId: string, value: string | string[] | number) => void
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
  const [participant, setParticipant] = useState<AssessmentParticipant | null>(null)
  const [assessmentTemplate, setAssessmentTemplate] = useState<AssessmentTemplate | null>(null)
  const [responses, setResponses] = useState<Map<string, AssessmentResponse>>(new Map())
  const [currentSection, setCurrentSection] = useState<string>('profile')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedParticipant = localStorage.getItem('air_assessment_participant')
    const storedResponses = localStorage.getItem('air_assessment_responses')
    const storedSection = localStorage.getItem('air_current_section')
    
    if (storedParticipant) {
      const participantData = JSON.parse(storedParticipant)
      setParticipant(participantData)
      
      // Load assessment template based on access code
      if (participantData.accessCode) {
        const template = getAssessmentTemplateForAccessCode(participantData.accessCode)
        const config = getAssessmentConfigByAccessCode(participantData.accessCode)
        
        setAssessmentTemplate(template)
        
        // Update participant with company info
        if (config) {
          const updatedParticipant = {
            ...participantData,
            companyId: config.companyId,
            templateId: config.templateId
          }
          setParticipant(updatedParticipant)
          localStorage.setItem('air_assessment_participant', JSON.stringify(updatedParticipant))
        }
      }
    }
    
    if (storedResponses) {
      const responsesArray: AssessmentResponse[] = JSON.parse(storedResponses)
      const responsesMap = new Map()
      responsesArray.forEach(response => {
        const key = `${response.sectionId}-${response.questionId}`
        responsesMap.set(key, response)
      })
      setResponses(responsesMap)
    }
    
    if (storedSection) {
      setCurrentSection(storedSection)
    }
    
    setIsLoading(false)
  }, [])

  const accessAssessment = async (email: string, accessCode: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Demo assessment participants for testing - only email and access code known initially
      const demoParticipants: Record<string, { accessCode: string; participant: AssessmentParticipant }> = {
        'john.smith@company.com': {
          accessCode: 'ASS2024001',
          participant: {
            id: 'emp-001',
            email: 'john.smith@company.com',
            accessCode: 'ASS2024001',
            cohortId: 'cohort-q1-2024',
            assessmentStatus: 'not_started',
            completionPercentage: 0
          }
        },
        'sarah.jones@company.com': {
          accessCode: 'ASS2024002',
          participant: {
            id: 'emp-002',
            email: 'sarah.jones@company.com',
            accessCode: 'ASS2024002',
            cohortId: 'cohort-q1-2024',
            assessmentStatus: 'in_progress',
            completionPercentage: 45
          }
        },
        'mike.wilson@company.com': {
          accessCode: 'ASS2024003',
          participant: {
            id: 'emp-003',
            email: 'mike.wilson@company.com',
            accessCode: 'ASS2024003',
            cohortId: 'cohort-q1-2024',
            assessmentStatus: 'completed',
            completionPercentage: 100,
            lastActivity: new Date('2024-01-15')
          }
        },
        'lisa.chen@company.com': {
          accessCode: 'ASS2024004',
          participant: {
            id: 'emp-004',
            email: 'lisa.chen@company.com',
            accessCode: 'ASS2024004',
            cohortId: 'cohort-q1-2024',
            assessmentStatus: 'not_started',
            completionPercentage: 0
          }
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const participantRecord = demoParticipants[email.toLowerCase()]
      if (participantRecord && participantRecord.accessCode === accessCode) {
        // Load assessment template and config for this access code
        const template = getAssessmentTemplateForAccessCode(accessCode)
        const config = getAssessmentConfigByAccessCode(accessCode)
        
        const participantWithActivity = {
          ...participantRecord.participant,
          lastActivity: new Date(),
          companyId: config?.companyId,
          templateId: config?.templateId
        }
        
        setParticipant(participantWithActivity)
        setAssessmentTemplate(template)
        localStorage.setItem('air_assessment_participant', JSON.stringify(participantWithActivity))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const updateProgress = (percentage: number) => {
    if (participant) {
      const updatedParticipant = {
        ...participant,
        completionPercentage: percentage,
        assessmentStatus: percentage === 100 ? 'completed' as const : 'in_progress' as const,
        lastActivity: new Date()
      }
      setParticipant(updatedParticipant)
      localStorage.setItem('air_assessment_participant', JSON.stringify(updatedParticipant))
    }
  }

  const completeAssessment = () => {
    if (participant) {
      const completedParticipant = {
        ...participant,
        assessmentStatus: 'completed' as const,
        completionPercentage: 100,
        lastActivity: new Date()
      }
      setParticipant(completedParticipant)
      localStorage.setItem('air_assessment_participant', JSON.stringify(completedParticipant))
    }
  }

  const saveResponse = (sectionId: string, questionId: string, value: string | string[] | number) => {
    if (!participant || !assessmentTemplate) return
    
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
    
    // Save to localStorage
    const responsesArray = Array.from(newResponses.values())
    localStorage.setItem('air_assessment_responses', JSON.stringify(responsesArray))
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
    localStorage.removeItem('air_assessment_responses')
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