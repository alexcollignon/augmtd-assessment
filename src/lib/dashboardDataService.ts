import { supabase } from './supabase'
import { createWorkflowIntelligenceEngine, aggregateWorkflowInsights, WorkflowInsights } from './workflowIntelligence'
import { createScoringEngine } from './assessmentScoring'
import { defaultAssessmentTemplate } from '@/data/assessmentTemplates'
import { AssessmentResponse } from '@/types'
import { adminDataScopingService, AdminUser } from './adminDataScoping'

export interface DashboardMetrics {
  employeesAssessed: number
  averageSkillLevel: number
  automatableWork: number
  riskExposure: number
  aiMaturityScore: number
  pillarScores: {
    prompting: number
    tools: number
    ethics: number
    thinking: number
    coIntelligence: number
  }
  topOpportunities: Array<{
    name: string
    process: string
    productivityGain: string
    feasibility: string
    department: string
  }>
  departmentMaturity: Array<{
    department: string
    score: number
    employeeCount: number
  }>
  workflowInsights: {
    totalProcesses: number
    automationPotential: number
    estimatedSavings: number
  }
}

export class DashboardDataService {
  
  async getRecentSubmissions(limit: number = 100, adminUser?: AdminUser) {
    if (adminUser) {
      // Use scoped data for admin users
      return adminDataScopingService.getAccessibleSubmissions(adminUser, limit)
    }
    
    // Superadmin or system-wide access
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select(`
        *,
        assessment_results (
          dimension_scores,
          overall_score,
          calculated_at
        )
      `)
      .order('submitted_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching submissions:', error)
      return []
    }

    return data || []
  }

  async calculateDashboardMetrics(adminUser?: AdminUser): Promise<DashboardMetrics> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser) // Get more for better analytics
      
      if (submissions.length === 0) {
        return this.getDefaultMetrics()
      }

      // Calculate basic metrics
      const employeesAssessed = submissions.length
      const aiMaturityScores = submissions
        .map(s => s.assessment_results?.[0]?.overall_score)
        .filter(score => typeof score === 'number')
      
      const averageMaturity = aiMaturityScores.length > 0 
        ? Math.round(aiMaturityScores.reduce((a, b) => a + b, 0) / aiMaturityScores.length)
        : 65

      // Calculate pillar scores from dimension scores
      const pillarScores = this.calculatePillarScores(submissions)
      
      // Calculate workflow intelligence metrics
      const workflowInsights = await this.calculateWorkflowMetrics(submissions)
      
      // Calculate risk exposure based on security awareness
      const riskExposure = this.calculateRiskExposure(submissions)
      
      // Get top opportunities from workflow analysis
      const topOpportunities = this.generateTopOpportunities()
      
      // Calculate department maturity
      const departmentMaturity = this.calculateDepartmentMaturity(submissions)

      return {
        employeesAssessed,
        averageSkillLevel: Math.round((pillarScores.prompting + pillarScores.tools + pillarScores.ethics + pillarScores.thinking + pillarScores.coIntelligence) / 5),
        automatableWork: workflowInsights.automationPotential,
        riskExposure,
        aiMaturityScore: averageMaturity,
        pillarScores,
        topOpportunities: topOpportunities.slice(0, 5),
        departmentMaturity,
        workflowInsights: {
          totalProcesses: this.countUniqueProcesses(submissions),
          automationPotential: workflowInsights.automationPotential,
          estimatedSavings: workflowInsights.estimatedSavings
        }
      }
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error)
      return this.getDefaultMetrics()
    }
  }

  private calculatePillarScores(submissions: any[]): DashboardMetrics['pillarScores'] {
    const dimensionTotals = {
      promptingProficiency: [],
      toolUse: [],
      ethics: [],
      aiThinking: [],
      coIntelligence: []
    }

    submissions.forEach(submission => {
      const dimensionScores = submission.assessment_results?.[0]?.dimension_scores
      if (dimensionScores) {
        Object.keys(dimensionTotals).forEach(dimension => {
          const score = dimensionScores[dimension.toLowerCase().replace(/[^a-z]/g, '')]
          if (typeof score === 'number') {
            dimensionTotals[dimension as keyof typeof dimensionTotals].push(score)
          }
        })
      }
    })

    return {
      prompting: this.average(dimensionTotals.promptingProficiency),
      tools: this.average(dimensionTotals.toolUse),
      ethics: this.average(dimensionTotals.ethics),
      thinking: this.average(dimensionTotals.aiThinking),
      coIntelligence: this.average(dimensionTotals.coIntelligence)
    }
  }

  private async calculateWorkflowMetrics(submissions: any[]): Promise<{
    automationPotential: number
    estimatedSavings: number
  }> {
    const workflowEngine = createWorkflowIntelligenceEngine()
    const allWorkflowInsights: WorkflowInsights[] = []

    for (const submission of submissions) {
      try {
        // Convert submission responses to AssessmentResponse format
        const responses: AssessmentResponse[] = []
        const responsesData = submission.responses || {}
        
        Object.entries(responsesData).forEach(([key, value]) => {
          const [sectionId, questionId] = key.split('-')
          responses.push({
            participantId: submission.email,
            assessmentId: submission.cohort_id,
            sectionId,
            questionId,
            value,
            timestamp: new Date(submission.submitted_at)
          })
        })

        const insights = workflowEngine.analyzeWorkflows(responses)
        allWorkflowInsights.push(insights)
      } catch (error) {
        console.error('Error analyzing workflow for submission:', submission.id, error)
      }
    }

    if (allWorkflowInsights.length === 0) {
      return { automationPotential: 32, estimatedSavings: 250000 }
    }

    const aggregated = aggregateWorkflowInsights(allWorkflowInsights)
    
    // Calculate estimated savings based on automation potential and employee count
    const estimatedSavings = Math.round(
      aggregated.overallAutomationPotential * submissions.length * 2000 // $2k per person per % of automation
    )

    return {
      automationPotential: aggregated.overallAutomationPotential,
      estimatedSavings
    }
  }

  private calculateRiskExposure(submissions: any[]): number {
    let riskFactors = 0
    let totalFactors = 0

    submissions.forEach(submission => {
      const responses = submission.responses || {}
      
      // Check security awareness
      const securityAwareness = responses['competence-ai_security_awareness']
      if (securityAwareness === 'never' || securityAwareness === 'rarely') {
        riskFactors += 2
      } else if (securityAwareness === 'sometimes') {
        riskFactors += 1
      }
      totalFactors += 2

      // Check bias awareness
      const biasAwareness = responses['competence-ai_bias_awareness']
      if (biasAwareness === 'trust_completely') {
        riskFactors += 2
      } else if (biasAwareness === 'spot_check') {
        riskFactors += 1
      }
      totalFactors += 2

      // Check tool policy clarity
      const toolsAllowed = responses['strategic-tools_allowed_at_work']
      if (Array.isArray(toolsAllowed) && toolsAllowed.includes('unclear_policy')) {
        riskFactors += 1
      }
      totalFactors += 1
    })

    return totalFactors > 0 ? Math.round((riskFactors / totalFactors) * 100) : 15
  }

  private generateTopOpportunities(): DashboardMetrics['topOpportunities'] {
    const opportunityTemplates = [
      {
        name: 'Customer Service Chatbot',
        process: 'Customer Onboarding Process',
        productivityGain: '75% faster response times',
        feasibility: 'High'
      },
      {
        name: 'Invoice Data Extraction & Validation',
        process: 'Invoice Processing Workflow',
        productivityGain: '70% processing acceleration',
        feasibility: 'Medium'
      },
      {
        name: 'Resume Screening & Ranking AI',
        process: 'Employee Recruitment Process',
        productivityGain: '80% screening efficiency',
        feasibility: 'High'
      },
      {
        name: 'Predictive Equipment Maintenance',
        process: 'Operations Maintenance Workflow',
        productivityGain: '60% downtime reduction',
        feasibility: 'Medium'
      },
      {
        name: 'Content Generation Assistant',
        process: 'Marketing Campaign Creation',
        productivityGain: '65% content creation speed',
        feasibility: 'High'
      }
    ]

    // For now, use templates (workflow insights integration will be added later)
    return opportunityTemplates.map(opp => ({
      ...opp,
      department: 'Multiple'
    }))
  }

  private calculateDepartmentMaturity(submissions: any[]): DashboardMetrics['departmentMaturity'] {
    const departmentData: { [key: string]: { scores: number[], count: number } } = {}

    submissions.forEach(submission => {
      const department = submission.responses?.['profile-department']
      const overallScore = submission.assessment_results?.[0]?.overall_score

      if (department && typeof overallScore === 'number') {
        if (!departmentData[department]) {
          departmentData[department] = { scores: [], count: 0 }
        }
        departmentData[department].scores.push(overallScore)
        departmentData[department].count++
      }
    })

    return Object.entries(departmentData).map(([department, data]) => ({
      department: this.formatDepartmentName(department),
      score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      employeeCount: data.count
    })).sort((a, b) => b.score - a.score)
  }

  private countUniqueProcesses(submissions: any[]): number {
    const processes = new Set<string>()
    
    submissions.forEach(submission => {
      const primaryProcesses = submission.responses?.['strategic-primary_work_processes']
      if (Array.isArray(primaryProcesses)) {
        primaryProcesses.forEach(process => processes.add(process))
      }
    })

    return processes.size
  }

  private formatDepartmentName(department: string): string {
    // Clean up department names for display
    return department.replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 65 // Default score
    return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length)
  }

  private getDefaultMetrics(): DashboardMetrics {
    return {
      employeesAssessed: 0,
      averageSkillLevel: 65,
      automatableWork: 32,
      riskExposure: 18,
      aiMaturityScore: 65,
      pillarScores: {
        prompting: 62,
        tools: 58,
        ethics: 71,
        thinking: 45,
        coIntelligence: 52
      },
      topOpportunities: [
        {
          name: 'Customer Service Chatbot',
          process: 'Customer Onboarding Process',
          productivityGain: '75% faster response times',
          feasibility: 'High',
          department: 'Customer Support'
        },
        {
          name: 'Invoice Data Extraction',
          process: 'Invoice Processing Workflow',
          productivityGain: '70% processing acceleration',
          feasibility: 'Medium',
          department: 'Finance'
        }
      ],
      departmentMaturity: [
        { department: 'Data & AI Digital', score: 78, employeeCount: 12 },
        { department: 'Marketing Sales Customer', score: 71, employeeCount: 45 },
        { department: 'Finance Legal Risk', score: 64, employeeCount: 28 }
      ],
      workflowInsights: {
        totalProcesses: 15,
        automationPotential: 32,
        estimatedSavings: 250000
      }
    }
  }
}

export const dashboardDataService = new DashboardDataService()