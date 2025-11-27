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