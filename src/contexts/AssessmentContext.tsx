import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AssessmentParticipant {
  id: string
  email: string
  name: string
  department: string
  role: string
  accessCode: string
  cohortId: string
  assessmentStatus: 'not_started' | 'in_progress' | 'completed'
  completionPercentage: number
  lastActivity?: Date
}

interface AssessmentContextType {
  participant: AssessmentParticipant | null
  isAuthenticated: boolean
  isLoading: boolean
  accessAssessment: (email: string, accessCode: string) => Promise<boolean>
  updateProgress: (percentage: number) => void
  completeAssessment: () => void
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedParticipant = localStorage.getItem('air_assessment_participant')
    if (storedParticipant) {
      setParticipant(JSON.parse(storedParticipant))
    }
    setIsLoading(false)
  }, [])

  const accessAssessment = async (email: string, accessCode: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Demo assessment participants for testing
      const demoParticipants: Record<string, { accessCode: string; participant: AssessmentParticipant }> = {
        'john.smith@company.com': {
          accessCode: 'ASS2024001',
          participant: {
            id: 'emp-001',
            email: 'john.smith@company.com',
            name: 'John Smith',
            department: 'Engineering',
            role: 'Senior Developer',
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
            name: 'Sarah Jones',
            department: 'Marketing',
            role: 'Marketing Manager',
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
            name: 'Mike Wilson',
            department: 'Finance',
            role: 'Financial Analyst',
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
            name: 'Lisa Chen',
            department: 'HR',
            role: 'HR Specialist',
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
        const participantWithActivity = {
          ...participantRecord.participant,
          lastActivity: new Date()
        }
        
        setParticipant(participantWithActivity)
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

  const logout = () => {
    setParticipant(null)
    localStorage.removeItem('air_assessment_participant')
  }

  const value = {
    participant,
    isAuthenticated: !!participant,
    isLoading,
    accessAssessment,
    updateProgress,
    completeAssessment,
    logout
  }

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}