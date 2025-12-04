export type NavigationCategory = 'overview' | 'capabilities' | 'operations' | 'assessments'

export interface NavigationItem {
  id: string
  label: string
  category: NavigationCategory
}

export interface AIHealthScore {
  overall: number
  maturityLevel: number
  pillars: {
    strategy: number
    cost: number
    organization: number
    technology: number
    data: number
    security: number
  }
}

export interface WorkflowData {
  id: string
  name: string
  department: string
  steps: number
  manualSteps: number
  timeSpent: number
  inefficiencyScore: number
  automationPotential: number
  valueImpact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  employeesImpacted: number
}

export interface DepartmentMaturity {
  department: string
  overall: number
  pillars: {
    strategy: number
    cost: number
    organization: number
    technology: number
    data: number
    security: number
  }
}

export interface SkillData {
  skill: string
  proficiency: number
  gap: number
  priority: 'high' | 'medium' | 'low'
}

export interface RiskItem {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low'
  category: string
  description: string
}

// Assessment System Types

export type QuestionType = 'radio' | 'select' | 'multi_select' | 'slider' | 'text'

export interface QuestionOption {
  id: string
  label: string
  value: string
  score?: number
}

export interface QuestionScoring {
  weight: number
  dimension: string
  valueMapping?: Record<string, number>
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: QuestionType
  options?: QuestionOption[]
  scoring?: QuestionScoring
  tags?: string[]
  allowMultiple?: boolean
  min?: number
  max?: number
  step?: number
  labels?: Record<string, string>
}

export interface AssessmentSection {
  title: string
  questions: AssessmentQuestion[]
}

export interface AssessmentTemplate {
  id: string
  name: string
  description?: string
  companyId?: string
  profile: AssessmentSection
  strategic: AssessmentSection
  competence: AssessmentSection
  dimensions: AssessmentDimension[]
  createdAt?: Date
  updatedAt?: Date
}

export interface AssessmentDimension {
  id: string
  name: string
  description?: string
  maxScore: number
  weight?: number
}

export interface AssessmentResponse {
  participantId: string
  assessmentId: string
  sectionId: string
  questionId: string
  value: string | string[] | number
  timestamp: Date
}

export interface AssessmentResult {
  participantId: string
  assessmentId: string
  scores: DimensionScore[]
  overallScore: number
  completionDate: Date
  recommendations?: string[]
  radarData: RadarChartData[]
}

export interface DimensionScore {
  dimension: string
  score: number
  maxScore: number
  percentage: number
}

export interface RadarChartData {
  dimension: string
  userScore: number
  peerAverage?: number
  maxScore: number
}