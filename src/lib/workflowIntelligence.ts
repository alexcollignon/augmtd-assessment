import { AssessmentResponse } from '@/types'

export interface WorkflowInsights {
  automationPotential: number
  roiProjections: ROIMetric[]
  processInefficiencies: ProcessBottleneck[]
  toolRecommendations: ToolRecommendation[]
  workflowOpportunities: WorkflowOpportunity[]
}

export interface ROIMetric {
  process: string
  department: string
  timeSavingsPercentage: number
  hoursPerWeek: number
  costSavingsAnnual: number
  implementationEffort: 'low' | 'medium' | 'high'
  feasibility: 'low' | 'medium' | 'high'
}

export interface ProcessBottleneck {
  type: string
  impact: 'high' | 'medium' | 'low'
  frequency: number
  automationPotential: number
  affectedProcesses: string[]
}

export interface ToolRecommendation {
  tool: string
  process: string
  suitability: number
  expectedImpact: number
  requiredSkillLevel: 'basic' | 'intermediate' | 'advanced'
}

export interface WorkflowOpportunity {
  name: string
  process: string
  department: string
  automationPotential: number
  roiScore: number
  implementationComplexity: 'low' | 'medium' | 'high'
  prerequisites: string[]
}

// Department to process mapping
const DEPARTMENT_PROCESSES = {
  'Customer Support & Success': [
    'customer_onboarding', 'customer_support', 'feedback_analysis'
  ],
  'Finance, Legal & Risk': [
    'invoice_processing', 'contract_management', 'compliance_monitoring'
  ],
  'HR, Learning & Culture': [
    'recruitment', 'employee_onboarding', 'performance_management'
  ],
  'Marketing, Sales & Customer': [
    'content_creation', 'sales_process', 'lead_qualification'
  ],
  'Operations & Delivery': [
    'project_management', 'maintenance_operations', 'quality_assurance'
  ],
  'Data, AI & Digital': [
    'data_analysis', 'system_integration', 'ai_implementation'
  ]
}

// Tool capabilities matrix
const TOOL_CAPABILITIES = {
  'ChatGPT': {
    communication: 0.8,
    content_creation: 0.9,
    data_analysis: 0.6,
    document_processing: 0.7,
    customer_support: 0.7
  },
  'Claude': {
    communication: 0.9,
    content_creation: 0.8,
    data_analysis: 0.7,
    document_processing: 0.8,
    analysis: 0.8
  },
  'Microsoft Copilot': {
    document_processing: 0.9,
    communication: 0.7,
    excel_automation: 0.9,
    presentation: 0.8,
    office_integration: 0.9
  },
  'Perplexity': {
    research: 0.9,
    data_analysis: 0.7,
    fact_checking: 0.8
  }
}

// Process automation potential and complexity
const PROCESS_AUTOMATION_PROFILES = {
  customer_onboarding: {
    baseAutomationPotential: 0.65,
    complexity: 'medium',
    roiMultiplier: 1.2,
    primaryActivity: 'document_processing'
  },
  invoice_processing: {
    baseAutomationPotential: 0.85,
    complexity: 'low',
    roiMultiplier: 1.5,
    primaryActivity: 'data_processing'
  },
  customer_support: {
    baseAutomationPotential: 0.55,
    complexity: 'medium',
    roiMultiplier: 1.1,
    primaryActivity: 'communication'
  },
  content_creation: {
    baseAutomationPotential: 0.70,
    complexity: 'low',
    roiMultiplier: 1.3,
    primaryActivity: 'content_creation'
  },
  recruitment: {
    baseAutomationPotential: 0.60,
    complexity: 'medium',
    roiMultiplier: 1.4,
    primaryActivity: 'document_processing'
  },
  data_analysis: {
    baseAutomationPotential: 0.75,
    complexity: 'medium',
    roiMultiplier: 1.6,
    primaryActivity: 'data_analysis'
  }
}

export class WorkflowIntelligenceEngine {
  private responses: Map<string, AssessmentResponse>

  constructor() {
    this.responses = new Map()
  }

  addResponse(response: AssessmentResponse) {
    const key = `${response.sectionId}-${response.questionId}`
    this.responses.set(key, response)
  }

  addResponses(responses: AssessmentResponse[]) {
    responses.forEach(response => this.addResponse(response))
  }

  private getResponseValue(sectionId: string, questionId: string): any {
    const key = `${sectionId}-${questionId}`
    return this.responses.get(key)?.value
  }

  calculateAutomationPotential(): number {
    const primaryProcesses = this.getResponseValue('strategic', 'primary_work_processes') || []
    const automationReadiness = this.getResponseValue('strategic', 'automation_readiness')
    const currentAutomationLevel = this.getResponseValue('strategic', 'current_automation_level')
    const technicalBackground = this.getResponseValue('profile', 'technical_background')
    const allowedTools = this.getResponseValue('strategic', 'tools_allowed_at_work') || []

    // Base automation potential from self-assessment
    let baseAutomation = 0
    switch (automationReadiness) {
      case 'very_little': baseAutomation = 0.05; break
      case 'some_tasks': baseAutomation = 0.20; break
      case 'significant_portion': baseAutomation = 0.45; break
      case 'majority': baseAutomation = 0.70; break
      default: baseAutomation = 0.30
    }

    // Adjust based on process types
    if (Array.isArray(primaryProcesses)) {
      const processAutomationScores = primaryProcesses.map(process => 
        PROCESS_AUTOMATION_PROFILES[process as keyof typeof PROCESS_AUTOMATION_PROFILES]?.baseAutomationPotential || 0.4
      )
      if (processAutomationScores.length > 0) {
        const avgProcessAutomation = processAutomationScores.reduce((a, b) => a + b, 0) / processAutomationScores.length
        baseAutomation = (baseAutomation + avgProcessAutomation) / 2
      }
    }

    // Technical capability multiplier
    let techMultiplier = 1.0
    switch (technicalBackground) {
      case 'business_user': techMultiplier = 0.8; break
      case 'intermediate': techMultiplier = 1.1; break
      case 'advanced': techMultiplier = 1.3; break
      case 'expert': techMultiplier = 1.5; break
    }

    // Tool availability multiplier
    let toolMultiplier = 0.5
    if (Array.isArray(allowedTools)) {
      if (allowedTools.includes('none_allowed')) {
        toolMultiplier = 0.2
      } else if (allowedTools.includes('any_tool')) {
        toolMultiplier = 1.2
      } else if (allowedTools.length > 2) {
        toolMultiplier = 1.0
      } else if (allowedTools.length > 0) {
        toolMultiplier = 0.8
      }
    }

    // Current automation level boost
    let currentLevelBoost = 1.0
    switch (currentAutomationLevel) {
      case 'fully_manual': currentLevelBoost = 0.7; break
      case 'basic_tools': currentLevelBoost = 0.9; break
      case 'some_automation': currentLevelBoost = 1.1; break
      case 'highly_automated': currentLevelBoost = 1.3; break
    }

    const finalScore = Math.min(0.95, baseAutomation * techMultiplier * toolMultiplier * currentLevelBoost)
    return Math.round(finalScore * 100)
  }

  calculateROIProjections(): ROIMetric[] {
    const department = this.getResponseValue('profile', 'department') || 'Unknown'
    const primaryProcesses = this.getResponseValue('strategic', 'primary_work_processes') || []
    const workBreakdown = this.getResponseValue('strategic', 'daily_work_breakdown') || {}
    const allowedTools = this.getResponseValue('strategic', 'tools_allowed_at_work') || []

    const roiMetrics: ROIMetric[] = []

    if (Array.isArray(primaryProcesses)) {
      primaryProcesses.forEach((process: string) => {
        const profile = PROCESS_AUTOMATION_PROFILES[process as keyof typeof PROCESS_AUTOMATION_PROFILES]
        if (profile) {
          // Calculate time savings based on process and activity breakdown
          const activityType = profile.primaryActivity
          const activityPercentage = workBreakdown[activityType] || 20
          
          // Estimate hours per week for this process
          const hoursPerWeek = Math.round((activityPercentage / 100) * 40 * 0.6) // 60% of activity time on this process
          
          // Calculate automation potential
          const automationPotential = profile.baseAutomationPotential
          
          // Time savings percentage
          const timeSavingsPercentage = Math.round(automationPotential * 75) // Convert to time savings %
          
          // Annual cost savings (assuming $75/hour average)
          const costSavingsAnnual = Math.round(hoursPerWeek * timeSavingsPercentage / 100 * 52 * 75)
          
          // Determine feasibility based on tools and complexity
          let feasibility: 'low' | 'medium' | 'high' = 'medium'
          if (Array.isArray(allowedTools) && allowedTools.includes('none_allowed')) {
            feasibility = 'low'
          } else if (profile.complexity === 'low' && allowedTools.length > 1) {
            feasibility = 'high'
          }

          roiMetrics.push({
            process: this.formatProcessName(process),
            department,
            timeSavingsPercentage,
            hoursPerWeek,
            costSavingsAnnual,
            implementationEffort: (profile.complexity === 'low' || profile.complexity === 'medium' || profile.complexity === 'high') 
              ? profile.complexity as 'low' | 'medium' | 'high' 
              : 'medium',
            feasibility
          })
        }
      })
    }

    return roiMetrics.sort((a, b) => b.costSavingsAnnual - a.costSavingsAnnual).slice(0, 5)
  }

  identifyProcessBottlenecks(): ProcessBottleneck[] {
    const bottlenecks = this.getResponseValue('strategic', 'process_bottlenecks') || []
    const primaryProcesses = this.getResponseValue('strategic', 'primary_work_processes') || []

    const bottleneckMap: { [key: string]: ProcessBottleneck } = {}

    if (Array.isArray(bottlenecks)) {
      bottlenecks.forEach((bottleneck: string) => {
        let impact: 'high' | 'medium' | 'low' = 'medium'
        let automationPotential = 0.5

        switch (bottleneck) {
          case 'manual_data_entry':
            impact = 'high'
            automationPotential = 0.9
            break
          case 'finding_information':
            impact = 'high'
            automationPotential = 0.8
            break
          case 'repetitive_communication':
            impact = 'medium'
            automationPotential = 0.7
            break
          case 'document_formatting':
            impact = 'medium'
            automationPotential = 0.8
            break
          case 'report_generation':
            impact = 'high'
            automationPotential = 0.9
            break
          case 'waiting_approvals':
            impact = 'medium'
            automationPotential = 0.3
            break
        }

        bottleneckMap[bottleneck] = {
          type: this.formatBottleneckName(bottleneck),
          impact,
          frequency: 1,
          automationPotential,
          affectedProcesses: Array.isArray(primaryProcesses) ? primaryProcesses : []
        }
      })
    }

    return Object.values(bottleneckMap)
  }

  generateWorkflowOpportunities(): WorkflowOpportunity[] {
    const department = this.getResponseValue('profile', 'department') || 'Unknown'
    const primaryProcesses = this.getResponseValue('strategic', 'primary_work_processes') || []
    const bottlenecks = this.identifyProcessBottlenecks()
    const roiProjections = this.calculateROIProjections()

    const opportunities: WorkflowOpportunity[] = []

    // High-impact automation opportunities
    if (Array.isArray(primaryProcesses)) {
      primaryProcesses.forEach((process: string) => {
        const roiData = roiProjections.find(r => r.process.toLowerCase().includes(process.replace('_', ' ')))
        const profile = PROCESS_AUTOMATION_PROFILES[process as keyof typeof PROCESS_AUTOMATION_PROFILES]
        
        if (profile && roiData && roiData.costSavingsAnnual > 10000) {
          opportunities.push({
            name: this.generateOpportunityName(process),
            process: this.formatProcessName(process),
            department,
            automationPotential: Math.round(profile.baseAutomationPotential * 100),
            roiScore: Math.min(100, Math.round(roiData.costSavingsAnnual / 1000)),
            implementationComplexity: (profile.complexity === 'low' || profile.complexity === 'medium' || profile.complexity === 'high') 
              ? profile.complexity as 'low' | 'medium' | 'high' 
              : 'medium',
            prerequisites: this.getPrerequisites(process)
          })
        }
      })
    }

    return opportunities
      .sort((a, b) => (b.roiScore * b.automationPotential) - (a.roiScore * a.automationPotential))
      .slice(0, 5)
  }

  private formatProcessName(process: string): string {
    return process.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  private formatBottleneckName(bottleneck: string): string {
    const names = {
      'manual_data_entry': 'Manual Data Entry',
      'finding_information': 'Information Retrieval',
      'repetitive_communication': 'Repetitive Communication',
      'document_formatting': 'Document Formatting',
      'report_generation': 'Report Generation',
      'waiting_approvals': 'Approval Workflows'
    }
    return names[bottleneck as keyof typeof names] || bottleneck
  }

  private generateOpportunityName(process: string): string {
    const opportunities = {
      'customer_onboarding': 'Customer Onboarding Automation',
      'invoice_processing': 'AI-Powered Invoice Processing',
      'customer_support': 'Intelligent Support Assistant',
      'content_creation': 'Content Generation Pipeline',
      'recruitment': 'AI Resume Screening System',
      'data_analysis': 'Automated Analytics Dashboard'
    }
    return opportunities[process as keyof typeof opportunities] || `${this.formatProcessName(process)} Optimization`
  }

  private getPrerequisites(process: string): string[] {
    const prerequisites = {
      'customer_onboarding': ['CRM integration', 'Document digitization'],
      'invoice_processing': ['OCR capability', 'ERP integration'],
      'customer_support': ['Knowledge base setup', 'Chat platform'],
      'content_creation': ['Brand guidelines', 'Content templates'],
      'recruitment': ['ATS integration', 'Job criteria definition'],
      'data_analysis': ['Data warehouse', 'BI tools setup']
    }
    return prerequisites[process as keyof typeof prerequisites] || ['System integration', 'Process documentation']
  }

  analyzeWorkflows(responses: AssessmentResponse[]): WorkflowInsights {
    this.responses.clear()
    this.addResponses(responses)

    return {
      automationPotential: this.calculateAutomationPotential(),
      roiProjections: this.calculateROIProjections(),
      processInefficiencies: this.identifyProcessBottlenecks(),
      toolRecommendations: [],
      workflowOpportunities: this.generateWorkflowOpportunities()
    }
  }
}

export function createWorkflowIntelligenceEngine(): WorkflowIntelligenceEngine {
  return new WorkflowIntelligenceEngine()
}

// Helper functions for admin dashboard
export function aggregateWorkflowInsights(allInsights: WorkflowInsights[]): {
  overallAutomationPotential: number
  topOpportunities: WorkflowOpportunity[]
  departmentBreakdown: { [department: string]: number }
} {
  const avgAutomation = allInsights.reduce((sum, insight) => sum + insight.automationPotential, 0) / allInsights.length

  const allOpportunities = allInsights.flatMap(insight => insight.workflowOpportunities)
  const topOpportunities = allOpportunities
    .sort((a, b) => (b.roiScore * b.automationPotential) - (a.roiScore * a.automationPotential))
    .slice(0, 10)

  const departmentBreakdown: { [department: string]: number } = {}
  allInsights.forEach(insight => {
    insight.workflowOpportunities.forEach(opp => {
      if (!departmentBreakdown[opp.department]) {
        departmentBreakdown[opp.department] = 0
      }
      departmentBreakdown[opp.department] += opp.automationPotential
    })
  })

  // Average by count per department
  Object.keys(departmentBreakdown).forEach(dept => {
    const count = allInsights.filter(insight => 
      insight.workflowOpportunities.some(opp => opp.department === dept)
    ).length
    departmentBreakdown[dept] = Math.round(departmentBreakdown[dept] / count)
  })

  return {
    overallAutomationPotential: Math.round(avgAutomation),
    topOpportunities,
    departmentBreakdown
  }
}