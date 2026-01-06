import { supabase } from './supabase'
import { createWorkflowIntelligenceEngine, aggregateWorkflowInsights, WorkflowInsights } from './workflowIntelligence'
import { createScoringEngine } from './assessmentScoring'
import { defaultAssessmentTemplate } from '@/data/assessmentTemplates'
import { AssessmentResponse } from '@/types'
import { adminDataScopingService, AdminUser } from './adminDataScoping'
import { settingsService } from './settingsService'

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
  private adminDataScoping = adminDataScopingService
  
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
      
      // ONLY use AI analysis - don't fall back to programmatic workflow analysis
      // This ensures we show CTA until user actually generates AI analysis
      let automatableWork = await this.getAutomatableWorkFromAIAnalysis(adminUser)
      
      if (automatableWork === null || automatableWork <= 0) {
        automatableWork = 0 // No AI analysis available - triggers CTA
      }
      
      // Calculate risk exposure based on security awareness
      const riskExposure = this.calculateRiskExposure(submissions)
      
      // Get top opportunities from workflow analysis
      const topOpportunities = this.generateTopOpportunities(submissions)
      
      // Calculate department maturity
      const departmentMaturity = this.calculateDepartmentMaturity(submissions)
      
      // Only calculate workflow insights for estimatedSavings if needed
      const estimatedSavings = automatableWork > 0 
        ? Math.round(automatableWork * submissions.length * 2000) // Simple calculation
        : 0

      return {
        employeesAssessed,
        averageSkillLevel: Math.round((pillarScores.prompting + pillarScores.tools + pillarScores.ethics + pillarScores.thinking + pillarScores.coIntelligence) / 5),
        automatableWork, // Only from AI analysis or 0
        riskExposure,
        aiMaturityScore: averageMaturity,
        pillarScores,
        topOpportunities: topOpportunities.slice(0, 5),
        departmentMaturity,
        workflowInsights: {
          totalProcesses: automatableWork > 0 ? this.countUniqueProcesses(submissions) : 0,
          automationPotential: automatableWork, // Keep consistent
          estimatedSavings
        }
      }
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error)
      return this.getDefaultMetrics()
    }
  }

  // Helper method to get automatable work from AI analysis if available
  private async getAutomatableWorkFromAIAnalysis(adminUser?: AdminUser): Promise<number | null> {
    try {
      // Import here to avoid circular dependencies
      const { aiAnalysisService } = await import('./aiAnalysisService')
      const { settingsService } = await import('./settingsService')
      
      // Get company ID (for demo, use first available company)
      const companies = await settingsService.getCompanies()
      if (companies.length === 0) return null
      
      const companyId = companies[0].id
      
      // Check if we have AI analysis available
      const metadata = await aiAnalysisService.getAnalysisMetadata(companyId)
      
      if (metadata.totalProcesses > 0 && metadata.avgAutomation > 0) {
        console.log('📊 Using AI analysis for automatable work:', metadata.avgAutomation + '%')
        return metadata.avgAutomation
      }
      
      return null // No AI analysis available
    } catch (error) {
      console.error('Error fetching AI analysis for automatable work:', error)
      return null
    }
  }

  private calculatePillarScores(submissions: any[]): DashboardMetrics['pillarScores'] {
    const dimensionTotals = {
      promptingProficiency: [] as number[],
      toolUse: [] as number[],
      ethics: [] as number[],
      aiThinking: [] as number[],
      coIntelligence: [] as number[]
    }

    submissions.forEach(submission => {
      const dimensionScores = submission.assessment_results?.[0]?.dimension_scores
      if (dimensionScores) {
        Object.keys(dimensionTotals).forEach(dimension => {
          const scoreKey = dimension.toLowerCase().replace(/[^a-z]/g, '')
          const score = dimensionScores[scoreKey]
          if (typeof score === 'number') {
            const dimensionArray = dimensionTotals[dimension as keyof typeof dimensionTotals]
            if (Array.isArray(dimensionArray)) {
              dimensionArray.push(score)
            }
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
            value: Array.isArray(value) ? value : (typeof value === 'string' || typeof value === 'number') ? value : String(value || ''),
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
      return { automationPotential: 0, estimatedSavings: 0 } // No analysis available - triggers CTA
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

  private generateTopOpportunities(submissions: any[]): DashboardMetrics['topOpportunities'] {
    try {
      // Generate real workflow opportunities from assessment data
      const allWorkflowInsights: WorkflowInsights[] = []
      
      for (const submission of submissions) {
        if (!submission.responses || !submission.assessment_results?.[0]) continue
        
        try {
          const workflowEngine = createWorkflowIntelligenceEngine()
          const responses: AssessmentResponse[] = []
          
          Object.entries(submission.responses).forEach(([questionId, value]) => {
            const sectionId = questionId.includes('-') ? questionId.split('-')[0] : 'general'
            responses.push({
              participantId: submission.email,
              assessmentId: submission.cohort_id,
              sectionId,
              questionId,
              value: Array.isArray(value) ? value : (typeof value === 'string' || typeof value === 'number') ? value : String(value || ''),
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
        // Comprehensive fallback opportunities based on common AI use cases
        return [
          {
            name: 'Email Processing Automation',
            process: 'Email Management Workflow', 
            productivityGain: '45% time saved',
            feasibility: 'High',
            department: 'Operations'
          },
          {
            name: 'Document Review & Summarization',
            process: 'Document Processing Workflow',
            productivityGain: '65% faster document analysis',
            feasibility: 'High', 
            department: 'Legal'
          },
          {
            name: 'Customer Support Chatbot',
            process: 'Customer Service Workflow',
            productivityGain: '70% response time reduction',
            feasibility: 'Medium',
            department: 'Customer Support'
          },
          {
            name: 'Data Analysis Reports',
            process: 'Reporting Workflow',
            productivityGain: '60% faster insights',
            feasibility: 'Medium', 
            department: 'Analytics'
          },
          {
            name: 'Meeting Notes & Action Items',
            process: 'Meeting Management Workflow',
            productivityGain: '80% documentation time saved',
            feasibility: 'High',
            department: 'All Departments'
          },
          {
            name: 'Invoice Processing Automation',
            process: 'Financial Processing Workflow',
            productivityGain: '75% processing speed increase',
            feasibility: 'Medium',
            department: 'Finance'
          },
          {
            name: 'Content Creation Assistant',
            process: 'Marketing Content Workflow',
            productivityGain: '55% content creation efficiency',
            feasibility: 'High',
            department: 'Marketing'
          },
          {
            name: 'Code Review & Documentation',
            process: 'Software Development Workflow',
            productivityGain: '50% review time reduction',
            feasibility: 'Medium',
            department: 'Engineering'
          }
        ]
      }

      const aggregated = aggregateWorkflowInsights(allWorkflowInsights)
      
      return aggregated.topOpportunities.slice(0, 5).map(opportunity => ({
        name: opportunity.name,
        process: opportunity.process,
        productivityGain: `${opportunity.automationPotential}% automation potential`,
        feasibility: opportunity.implementationComplexity === 'low' ? 'High' : 
                   opportunity.implementationComplexity === 'medium' ? 'Medium' : 'Low',
        department: opportunity.department || 'General'
      }))
      
    } catch (error) {
      console.error('Error generating top opportunities:', error)
      // Return fallback data
      return [
        {
          name: 'Process Automation',
          process: 'General Workflow',
          productivityGain: '35% efficiency gain',
          feasibility: 'Medium',
          department: 'Operations'
        }
      ]
    }
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

  async calculateSecurityHeatmap(adminUser?: AdminUser): Promise<SecurityHeatmap[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      
      if (submissions.length === 0) {
        return [
          { department: 'Engineering', score: 85, level: 'Low Risk', count: 0 },
          { department: 'Marketing', score: 72, level: 'Medium Risk', count: 0 },
          { department: 'Sales', score: 58, level: 'Medium Risk', count: 0 }
        ]
      }

      const departmentRiskData: { [key: string]: { riskScores: number[], count: number } } = {}

      submissions.forEach(submission => {
        const department = submission.responses?.['profile-department']
        const responses = submission.responses || {}
        
        if (department) {
          if (!departmentRiskData[department]) {
            departmentRiskData[department] = { riskScores: [], count: 0 }
          }

          let riskScore = 100 // Start with perfect security score
          
          // Assess security awareness
          const securityAwareness = responses['competence-ai_security_awareness']
          if (securityAwareness === 'never' || securityAwareness === 'rarely') {
            riskScore -= 30
          } else if (securityAwareness === 'sometimes') {
            riskScore -= 15
          }

          // Assess bias awareness
          const biasAwareness = responses['competence-ai_bias_awareness']
          if (biasAwareness === 'trust_completely') {
            riskScore -= 25
          } else if (biasAwareness === 'spot_check') {
            riskScore -= 10
          }

          // Check policy clarity
          const toolsAllowed = responses['strategic-tools_allowed_at_work']
          if (Array.isArray(toolsAllowed) && toolsAllowed.includes('unclear_policy')) {
            riskScore -= 15
          }

          departmentRiskData[department].riskScores.push(Math.max(0, riskScore))
          departmentRiskData[department].count++
        }
      })

      return Object.entries(departmentRiskData).map(([department, data]) => {
        const avgScore = data.riskScores.reduce((a, b) => a + b, 0) / data.riskScores.length
        const score = Math.round(avgScore)
        
        let level: 'Low Risk' | 'Medium Risk' | 'High Risk'
        if (score >= 75) level = 'Low Risk'
        else if (score >= 50) level = 'Medium Risk'
        else level = 'High Risk'

        return {
          department: this.formatDepartmentName(department),
          score,
          level,
          count: data.count
        }
      }).sort((a, b) => a.score - b.score)

    } catch (error) {
      console.error('Error calculating security heatmap:', error)
      return []
    }
  }

  // Helper method to get approved tools from company settings
  private async getApprovedToolsFromSettings(companyId?: string): Promise<string[]> {
    try {
      if (!companyId) {
        console.warn('No company ID provided for approved tools lookup')
        return []
      }

      const companySettings = await settingsService.getCompanySettings(companyId)
      if (!companySettings || !companySettings.ai_tools) {
        return []
      }

      // Get approved tools and convert names to assessment format
      const approvedTools = companySettings.ai_tools
        .filter(tool => tool.approved)
        .map(tool => this.convertSettingsToolNameToAssessmentFormat(tool.tool_name))

      return approvedTools
    } catch (error) {
      console.error('Error fetching approved tools from settings:', error)
      return []
    }
  }

  // Helper method to convert tool names between settings and assessment formats
  private convertSettingsToolNameToAssessmentFormat(settingsName: string): string {
    // Use the same normalization logic as assessment responses
    return this.normalizeToolName(settingsName)
  }

  // Helper method to normalize tool names from assessment responses
  private normalizeToolName(toolName: string): string {
    if (!toolName) return ''
    
    // Clean the tool name
    let cleaned = toolName.toLowerCase().trim()
    
    // Remove common company prefixes
    const companyPrefixes = [
      'microsoft ', 'google ', 'openai ', 'anthropic ', 'meta ', 'facebook ',
      'adobe ', 'salesforce ', 'ibm ', 'amazon ', 'aws ', 'oracle ',
      'github ', 'atlassian ', 'slack ', 'notion ', 'figma ', 'canva '
    ]
    
    companyPrefixes.forEach(prefix => {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length)
      }
    })
    
    // Remove common suffixes
    const suffixes = [' ai', ' artificial intelligence', ' assistant', ' bot', ' chatbot']
    suffixes.forEach(suffix => {
      if (cleaned.endsWith(suffix)) {
        cleaned = cleaned.substring(0, cleaned.length - suffix.length)
      }
    })
    
    // Handle specific tool core names and variations
    const coreToolMappings: { [key: string]: string } = {
      // ChatGPT variations
      'chatgpt': 'chatgpt',
      'chat gpt': 'chatgpt', 
      'gpt': 'chatgpt',
      'openai chatgpt': 'chatgpt',
      'gpt-4': 'chatgpt',
      'gpt-3': 'chatgpt',
      
      // Claude variations
      'claude': 'claude',
      'anthropic claude': 'claude',
      'claude ai': 'claude',
      
      // Copilot variations
      'copilot': 'microsoft_copilot',
      'microsoft copilot': 'microsoft_copilot',
      'github copilot': 'github_copilot',
      'copilot ai': 'microsoft_copilot',
      
      // Gemini variations
      'gemini': 'gemini',
      'google gemini': 'gemini',
      'bard': 'gemini',
      'google bard': 'gemini',
      
      // Image generation tools
      'midjourney': 'midjourney',
      'mid journey': 'midjourney',
      'dalle': 'dalle',
      'dall-e': 'dalle',
      'dall·e': 'dalle',
      'openai dalle': 'dalle',
      
      // Writing tools
      'grammarly': 'grammarly_ai',
      'grammarly ai': 'grammarly_ai',
      'jasper': 'jasper',
      'jasper ai': 'jasper',
      'copy.ai': 'copy_ai',
      'copyai': 'copy_ai',
      
      // Search tools
      'perplexity': 'perplexity',
      'perplexity ai': 'perplexity',
      
      // Productivity tools
      'notion ai': 'notion_ai',
      'notion': 'notion_ai',
      'slack ai': 'slack_ai',
      
      // Design tools
      'canva ai': 'canva_ai',
      'canva': 'canva_ai',
      'figma ai': 'figma_ai',
      
      // Other common tools
      'character.ai': 'character_ai',
      'character ai': 'character_ai',
      'replika': 'replika',
      'stable diffusion': 'stable_diffusion',
      'hugging face': 'hugging_face'
    }
    
    // Check direct mappings first
    if (coreToolMappings[cleaned]) {
      return coreToolMappings[cleaned]
    }
    
    // Try fuzzy matching for partial matches
    for (const [pattern, normalized] of Object.entries(coreToolMappings)) {
      if (cleaned.includes(pattern) || pattern.includes(cleaned)) {
        // Only match if the core word is present
        const coreWords = pattern.split(' ')
        const hasCore = coreWords.some(word => 
          cleaned.includes(word) && word.length > 2 // Avoid matching very short words
        )
        if (hasCore) {
          return normalized
        }
      }
    }
    
    // If no specific mapping found, create a normalized version
    return cleaned
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }

  // Helper method to convert assessment format back to display format
  private convertAssessmentToolNameToDisplayFormat(assessmentName: string): string {
    const toolNameMapping: { [key: string]: string } = {
      // Core AI tools
      'chatgpt': 'ChatGPT',
      'claude': 'Claude',
      'microsoft_copilot': 'Microsoft Copilot',
      'github_copilot': 'GitHub Copilot',
      'gemini': 'Google Gemini',
      'dalle': 'DALL·E',
      'perplexity': 'Perplexity',
      'midjourney': 'Midjourney',
      
      // Writing & content tools
      'grammarly_ai': 'Grammarly AI',
      'jasper': 'Jasper AI',
      'copy_ai': 'Copy.ai',
      'notion_ai': 'Notion AI',
      
      // Design tools
      'canva_ai': 'Canva AI',
      'figma_ai': 'Figma AI',
      
      // Productivity tools
      'slack_ai': 'Slack AI',
      
      // Other tools
      'character_ai': 'Character.AI',
      'replika': 'Replika',
      'stable_diffusion': 'Stable Diffusion',
      'hugging_face': 'Hugging Face'
    }

    // Use mapping if available, otherwise create readable format
    if (toolNameMapping[assessmentName]) {
      return toolNameMapping[assessmentName]
    }

    // Convert underscore-separated names to Title Case
    return assessmentName
      .split('_')
      .map(word => {
        // Handle special cases
        if (word.toLowerCase() === 'ai') return 'AI'
        if (word.toLowerCase() === 'gpt') return 'GPT'
        if (word.toLowerCase() === 'api') return 'API'
        
        // Normal title case
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(' ')
  }

  async getDetectedAITools(adminUser?: AdminUser): Promise<ShadowAITool[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      const toolUsageMap: { [key: string]: { users: Set<string>, approved: boolean } } = {}

      // Get approved tools from company settings instead of hardcoded list
      const companyId = adminUser?.company_id || undefined
      const approvedToolsFromSettings = await this.getApprovedToolsFromSettings(companyId)
      
      console.log('Approved tools from settings:', approvedToolsFromSettings)
      console.log('Processing', submissions.length, 'assessment submissions...')
      
      // If no company settings exist yet, tools will be considered unauthorized by default
      // This encourages proper governance setup in the Settings page

      submissions.forEach((submission, index) => {
        // Debug: Log first few submissions to understand data structure
        if (index < 3) {
          console.log(`Submission ${index + 1} for ${submission.email}:`)
          console.log('Available response keys:', Object.keys(submission.responses || {}))
          console.log('Sample responses:', submission.responses)
        }
        
        // Check both possible question formats for AI tools usage
        const toolsUsedOptions = [
          submission.responses?.['competence-tools_used_recently'],
          submission.responses?.['strategic-ai_tools_used'],
          submission.responses?.['tooluse-tools_used_recently']
        ]
        
        const email = submission.email
        
        // Try each possible format
        toolsUsedOptions.forEach((toolsUsed, optionIndex) => {
          if (Array.isArray(toolsUsed)) {
            if (index < 3) {
              console.log(`Found tools array in option ${optionIndex}:`, toolsUsed)
            }
            toolsUsed.forEach(tool => {
              // Convert tool name to consistent format for comparison
              const normalizedTool = this.normalizeToolName(tool)
              
              if (index < 3) {
                console.log(`Tool: "${tool}" -> normalized: "${normalizedTool}" -> approved: ${approvedToolsFromSettings.includes(normalizedTool)}`)
              }
              
              if (!toolUsageMap[normalizedTool]) {
                toolUsageMap[normalizedTool] = {
                  users: new Set(),
                  approved: approvedToolsFromSettings.includes(normalizedTool)
                }
              }
              toolUsageMap[normalizedTool].users.add(email)
            })
          } else if (typeof toolsUsed === 'string' && toolsUsed !== 'None' && toolsUsed !== '') {
            // Handle single string responses
            const normalizedTool = this.normalizeToolName(toolsUsed)
            
            if (index < 3) {
              console.log(`Found string tool: "${toolsUsed}" -> normalized: "${normalizedTool}"`)
            }
            
            if (!toolUsageMap[normalizedTool]) {
              toolUsageMap[normalizedTool] = {
                users: new Set(),
                approved: approvedToolsFromSettings.includes(normalizedTool)
              }
            }
            toolUsageMap[normalizedTool].users.add(email)
          }
        })
      })

      console.log('Final tool usage map:', Object.keys(toolUsageMap))
      console.log('Tool usage details:', Object.entries(toolUsageMap).map(([tool, data]) => ({
        tool,
        users: data.users.size,
        approved: data.approved
      })))

      const shadowTools = Object.entries(toolUsageMap)
        .map(([tool, data]) => {
          const userCount = data.users.size
          let usage: 'Low' | 'Medium' | 'High'
          if (userCount > 50) usage = 'High'
          else if (userCount > 15) usage = 'Medium'
          else usage = 'Low'

          let risk: 'Low' | 'Medium' | 'High'
          if (data.approved) {
            risk = 'Low'
          } else if (userCount > 30) {
            risk = 'High'
          } else {
            risk = 'Medium'
          }

          return {
            tool: this.convertAssessmentToolNameToDisplayFormat(tool),
            usage,
            risk,
            users: userCount,
            approved: data.approved
          }
        })
        .sort((a, b) => b.users - a.users)

      return shadowTools

    } catch (error) {
      console.error('Error getting detected AI tools:', error)
      return []
    }
  }

  async calculateRiskExposureByDepartment(adminUser?: AdminUser): Promise<DepartmentRisk[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      const departmentData: { [key: string]: { exposures: number[], incidents: number } } = {}

      submissions.forEach(submission => {
        const department = submission.responses?.['profile-department']
        if (!department) return

        if (!departmentData[department]) {
          departmentData[department] = { exposures: [], incidents: 0 }
        }

        let exposureLevel = 0
        const responses = submission.responses || {}

        // Check various risk factors
        if (responses['competence-ai_security_awareness'] === 'never') exposureLevel += 3
        if (responses['competence-ai_bias_awareness'] === 'trust_completely') exposureLevel += 2
        if (Array.isArray(responses['strategic-tools_allowed_at_work']) && 
            responses['strategic-tools_allowed_at_work'].includes('unclear_policy')) exposureLevel += 2

        departmentData[department].exposures.push(exposureLevel)
        if (exposureLevel > 4) departmentData[department].incidents++ // High risk threshold
      })

      return Object.entries(departmentData).map(([department, data]) => {
        const avgExposure = data.exposures.reduce((a, b) => a + b, 0) / data.exposures.length
        const exposurePercentage = Math.round((avgExposure / 7) * 100) // 7 is max possible exposure

        return {
          department: this.formatDepartmentName(department),
          exposureLevel: Math.min(100, exposurePercentage),
          incidents: data.incidents,
          totalEmployees: data.exposures.length
        }
      }).sort((a, b) => b.exposureLevel - a.exposureLevel)

    } catch (error) {
      console.error('Error calculating department risk exposure:', error)
      return []
    }
  }

  async calculateAIMaturityData(adminUser?: AdminUser): Promise<AIMaturityData[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      const pillarScores = this.calculatePillarScores(submissions)

      const maturityPillars = [
        {
          pillar: 'Prompting Proficiency',
          current: pillarScores.prompting,
          target: 85,
          impact: 'Strong foundation with room for refinement in AI communication',
          effort: 'Low (1-2 months)'
        },
        {
          pillar: 'Tool Adoption',
          current: pillarScores.tools,
          target: 90,
          impact: 'Good tool awareness, focus on expanding practical application',
          effort: 'Medium (2-3 months)'
        },
        {
          pillar: 'Responsible Use',
          current: pillarScores.ethics,
          target: 95,
          impact: 'Critical for risk mitigation and compliance',
          effort: 'High (3-4 months)'
        },
        {
          pillar: 'AI Systems Thinking',
          current: pillarScores.thinking,
          target: 80,
          impact: 'Essential for strategic AI implementation',
          effort: 'High (3-6 months)'
        },
        {
          pillar: 'Co-Intelligence',
          current: pillarScores.coIntelligence,
          target: 85,
          impact: 'Key for productivity gains and workflow integration',
          effort: 'Medium (2-4 months)'
        }
      ]

      return maturityPillars.map((pillar, index) => ({
        ...pillar,
        gap: pillar.target - pillar.current,
        priority: index + 1
      }))

    } catch (error) {
      console.error('Error calculating AI maturity data:', error)
      return []
    }
  }

  async calculateDepartmentAIScores(adminUser?: AdminUser): Promise<DepartmentAIScores[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      const departmentData: { [key: string]: { 
        scores: { [key: string]: number[] }, 
        count: number 
      } } = {}

      submissions.forEach(submission => {
        const department = submission.responses?.['profile-department']
        const dimensionScores = submission.assessment_results?.[0]?.dimension_scores
        
        if (department && dimensionScores) {
          if (!departmentData[department]) {
            departmentData[department] = {
              scores: {
                prompting: [],
                tools: [],
                responsibleUse: [],
                aiThinking: [],
                coIntelligence: []
              },
              count: 0
            }
          }

          // Map dimension scores to pillars
          if (dimensionScores.promptingproficiency !== undefined) {
            departmentData[department].scores.prompting.push(dimensionScores.promptingproficiency)
          }
          if (dimensionScores.tooluse !== undefined) {
            departmentData[department].scores.tools.push(dimensionScores.tooluse)
          }
          if (dimensionScores.ethics !== undefined) {
            departmentData[department].scores.responsibleUse.push(dimensionScores.ethics)
          }
          if (dimensionScores.aithinking !== undefined) {
            departmentData[department].scores.aiThinking.push(dimensionScores.aithinking)
          }
          if (dimensionScores.cointelligence !== undefined) {
            departmentData[department].scores.coIntelligence.push(dimensionScores.cointelligence)
          }

          departmentData[department].count++
        }
      })

      return Object.entries(departmentData).map(([department, data]) => {
        const prompting = this.average(data.scores.prompting)
        const tools = this.average(data.scores.tools)
        const responsibleUse = this.average(data.scores.responsibleUse)
        const aiThinking = this.average(data.scores.aiThinking)
        const coIntelligence = this.average(data.scores.coIntelligence)
        const overall = Math.round((prompting + tools + responsibleUse + aiThinking + coIntelligence) / 5)

        return {
          department: this.formatDepartmentName(department),
          prompting,
          tools,
          responsibleUse,
          aiThinking,
          coIntelligence,
          overall,
          employeeCount: data.count
        }
      }).sort((a, b) => b.overall - a.overall)

    } catch (error) {
      console.error('Error calculating department AI scores:', error)
      return []
    }
  }

  async calculateRoleData(adminUser?: AdminUser): Promise<RoleData[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      const roleData: { [key: string]: { scores: number[], count: number } } = {}

      submissions.forEach(submission => {
        const role = submission.responses?.['profile-current_role'] 
        const overallScore = submission.assessment_results?.[0]?.overall_score
        
        if (role && typeof overallScore === 'number') {
          if (!roleData[role]) {
            roleData[role] = { scores: [], count: 0 }
          }
          roleData[role].scores.push(overallScore)
          roleData[role].count++
        }
      })

      return Object.entries(roleData).map(([role, data]) => {
        const avgSkill = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
        const topSkills = this.getTopSkillsForRole(avgSkill)

        return {
          role: this.formatRoleName(role),
          count: data.count,
          avgSkill,
          topSkills
        }
      }).sort((a, b) => b.avgSkill - a.avgSkill)

    } catch (error) {
      console.error('Error calculating role data:', error)
      return []
    }
  }

  async generateSkillsHeatmap(adminUser?: AdminUser): Promise<SkillHeatmapData[]> {
    try {
      const submissions = await this.getRecentSubmissions(200, adminUser) // Limit for performance
      
      return submissions.map(submission => {
        const email = submission.email
        const department = submission.responses?.['profile-department'] || 'Unknown'
        const role = submission.responses?.['profile-current_role'] || 'Unknown'
        const dimensionScores = submission.assessment_results?.[0]?.dimension_scores || {}
        const overallScore = submission.assessment_results?.[0]?.overall_score || 0

        return {
          employee: email.split('@')[0], // Use email prefix for privacy
          department: this.formatDepartmentName(department),
          role: this.formatRoleName(role),
          prompting: dimensionScores.promptingproficiency || 0,
          tools: dimensionScores.tooluse || 0,
          ethicsresponsibleuse: dimensionScores.ethicsresponsibleuse || 0,
          thinking: dimensionScores.aithinking || 0,
          coIntelligence: dimensionScores.cointelligence || 0,
          overall: overallScore
        }
      }).sort((a, b) => b.overall - a.overall)

    } catch (error) {
      console.error('Error generating skills heatmap:', error)
      return []
    }
  }

  async generateEmployeePersonas(adminUser?: AdminUser): Promise<EmployeePersona[]> {
    try {
      const submissions = await this.getRecentSubmissions(500, adminUser)
      
      // Define persona categories based on score patterns
      const personas: { [key: string]: { submissions: any[], description: string, characteristics: string[] } } = {
        'AI Champions': {
          submissions: [],
          description: 'Early adopters leading AI transformation initiatives',
          characteristics: ['High tool usage', 'Strong ethics awareness', 'Mentoring others']
        },
        'Practical Adopters': {
          submissions: [],
          description: 'Steady users applying AI to daily workflows',
          characteristics: ['Consistent usage', 'Task-focused approach', 'Productivity gains']
        },
        'Cautious Learners': {
          submissions: [],
          description: 'Careful approach with focus on responsible use',
          characteristics: ['Ethics-first mindset', 'Gradual adoption', 'Quality over speed']
        },
        'Emerging Users': {
          submissions: [],
          description: 'New to AI with high potential for growth',
          characteristics: ['Learning mindset', 'Basic tool familiarity', 'Growth potential']
        }
      }

      submissions.forEach(submission => {
        const overallScore = submission.assessment_results?.[0]?.overall_score || 0
        const dimensionScores = submission.assessment_results?.[0]?.dimension_scores || {}
        const toolUse = dimensionScores.tooluse || 0
        const ethics = dimensionScores.ethics || 0

        // Categorize based on score patterns
        if (overallScore >= 75 && toolUse >= 70) {
          personas['AI Champions'].submissions.push(submission)
        } else if (overallScore >= 60 && overallScore < 75) {
          personas['Practical Adopters'].submissions.push(submission)
        } else if (ethics >= 70 && overallScore >= 40) {
          personas['Cautious Learners'].submissions.push(submission)
        } else {
          personas['Emerging Users'].submissions.push(submission)
        }
      })

      return Object.entries(personas).map(([name, data]) => {
        if (data.submissions.length === 0) {
          return {
            name,
            description: data.description,
            characteristics: data.characteristics,
            count: 0,
            avgScore: 0,
            topStrengths: [],
            growthAreas: []
          }
        }

        const avgScore = Math.round(
          data.submissions.reduce((sum, sub) => sum + (sub.assessment_results?.[0]?.overall_score || 0), 0) / data.submissions.length
        )

        const { topStrengths, growthAreas } = this.analyzePersonaSkills(data.submissions)

        return {
          name,
          description: data.description,
          characteristics: data.characteristics,
          count: data.submissions.length,
          avgScore,
          topStrengths,
          growthAreas
        }
      }).filter(persona => persona.count > 0)

    } catch (error) {
      console.error('Error generating employee personas:', error)
      return []
    }
  }

  private getTopSkillsForRole(avgSkill: number): string[] {
    // Define top skills based on average skill level
    if (avgSkill >= 80) {
      return ['AI Thinking', 'Tools', 'Co-Intelligence']
    } else if (avgSkill >= 65) {
      return ['Tools', 'Prompting', 'Co-Intelligence']  
    } else if (avgSkill >= 50) {
      return ['Prompting', 'Tools', 'Responsible Use']
    } else {
      return ['Responsible Use', 'Prompting', 'Tools']
    }
  }

  private formatRoleName(role: string): string {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  private analyzePersonaSkills(submissions: any[]): { topStrengths: string[], growthAreas: string[] } {
    const dimensionAverages = {
      prompting: 0,
      tools: 0,
      ethics: 0,
      thinking: 0,
      coIntelligence: 0
    }

    submissions.forEach(submission => {
      const scores = submission.assessment_results?.[0]?.dimension_scores || {}
      dimensionAverages.prompting += scores.promptingproficiency || 0
      dimensionAverages.tools += scores.tooluse || 0
      dimensionAverages.ethics += scores.ethics || 0
      dimensionAverages.thinking += scores.aithinking || 0
      dimensionAverages.coIntelligence += scores.cointelligence || 0
    })

    Object.keys(dimensionAverages).forEach(key => {
      dimensionAverages[key as keyof typeof dimensionAverages] /= submissions.length
    })

    const dimensionNames = {
      prompting: 'Prompting',
      tools: 'Tool Use', 
      ethics: 'Ethics',
      thinking: 'AI Thinking',
      coIntelligence: 'Co-Intelligence'
    }

    const sortedDimensions = Object.entries(dimensionAverages)
      .map(([key, value]) => ({ name: dimensionNames[key as keyof typeof dimensionNames], score: value }))
      .sort((a, b) => b.score - a.score)

    return {
      topStrengths: sortedDimensions.slice(0, 2).map(d => d.name),
      growthAreas: sortedDimensions.slice(-2).map(d => d.name)
    }
  }

  async getAssessmentCohorts(adminUser?: AdminUser): Promise<AssessmentCohort[]> {
    try {
      // Get cohorts based on admin permissions
      const accessibleCohorts = await this.adminDataScoping.getAccessibleCohortsWithDetails(adminUser!)
      
      const cohortsWithData = await Promise.all(
        accessibleCohorts.map(async cohort => {
          // Get submissions for this cohort
          const { data: submissions } = await supabase
            .from('assessment_submissions')
            .select('id, email, submitted_at')
            .eq('cohort_id', cohort.id)

          const completed = submissions?.length || 0
          const totalInvited = Math.max(completed, (cohort as any).target_participants || completed + 10)
          const inProgress = 0 // Would need session tracking for this
          const notStarted = totalInvited - completed - inProgress

          return {
            id: cohort.id,
            name: cohort.name,
            startDate: cohort.start_date,
            endDate: cohort.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default end date
            totalInvited,
            completed,
            inProgress,
            notStarted,
            completionRate: Math.round((completed / totalInvited) * 100),
            departments: ['Multiple'], // Would need department tracking
            accessCode: cohort.access_code
          }
        })
      )

      return cohortsWithData

    } catch (error) {
      console.error('Error getting assessment cohorts:', error)
      return []
    }
  }

  async getFilteredParticipants(
    filters: {
      cohort?: string
      department?: string
      scoreRange?: string
      searchTerm?: string
    },
    adminUser?: AdminUser
  ): Promise<ParticipantData[]> {
    try {
      const submissions = await this.getRecentSubmissions(1000, adminUser)
      
      let filteredSubmissions = submissions

      // Apply filters
      if (filters.cohort && filters.cohort !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(sub => sub.cohort_id === filters.cohort)
      }

      if (filters.department && filters.department !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(sub => 
          sub.responses?.['profile-department'] === filters.department
        )
      }

      if (filters.scoreRange && filters.scoreRange !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(sub => {
          const score = sub.assessment_results?.[0]?.overall_score || 0
          switch (filters.scoreRange) {
            case 'high': return score >= 75
            case 'medium': return score >= 50 && score < 75
            case 'low': return score < 50
            default: return true
          }
        })
      }

      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase()
        filteredSubmissions = filteredSubmissions.filter(sub =>
          sub.email.toLowerCase().includes(search)
        )
      }

      return filteredSubmissions.map(submission => {
        const dimensionScores = submission.assessment_results?.[0]?.dimension_scores || {}
        
        return {
          id: submission.id,
          name: submission.responses?.['profile-name'] || submission.email.split('@')[0],
          email: submission.email,
          department: this.formatDepartmentName(submission.responses?.['profile-department'] || 'Unknown'),
          role: this.formatRoleName(submission.responses?.['profile-current_role'] || 'Unknown'),
          cohort: submission.cohorts?.name || 'Unknown',
          status: 'completed' as const,
          completedDate: new Date(submission.submitted_at).toLocaleDateString(),
          overallScore: submission.assessment_results?.[0]?.overall_score || 0,
          dimensionScores
        }
      })

    } catch (error) {
      console.error('Error getting filtered participants:', error)
      return []
    }
  }

  async getCohortStatistics(adminUser?: AdminUser): Promise<{ cohortId: string, name: string, avgScore: number, participantCount: number }[]> {
    try {
      const cohorts = await this.getAssessmentCohorts(adminUser)
      
      const stats = await Promise.all(
        cohorts.map(async cohort => {
          const submissions = await this.getRecentSubmissions(1000, adminUser)
          const cohortSubmissions = submissions.filter(sub => sub.cohort_id === cohort.id)
          
          const avgScore = cohortSubmissions.length > 0
            ? Math.round(
                cohortSubmissions.reduce((sum, sub) => sum + (sub.assessment_results?.[0]?.overall_score || 0), 0) 
                / cohortSubmissions.length
              )
            : 0

          return {
            cohortId: cohort.id,
            name: cohort.name,
            avgScore,
            participantCount: cohortSubmissions.length
          }
        })
      )

      return stats.sort((a, b) => b.avgScore - a.avgScore)

    } catch (error) {
      console.error('Error getting cohort statistics:', error)
      return []
    }
  }

  private getDefaultMetrics(): DashboardMetrics {
    return {
      employeesAssessed: 0,
      averageSkillLevel: 65,
      automatableWork: 0, // No analysis available - triggers CTA
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

// Additional types for RiskCompliance
export interface SecurityHeatmap {
  department: string
  score: number
  level: 'Low Risk' | 'Medium Risk' | 'High Risk'
  count: number
}

export interface ShadowAITool {
  tool: string
  usage: 'Low' | 'Medium' | 'High'
  risk: 'Low' | 'Medium' | 'High'
  users: number
  approved: boolean
}

export interface DepartmentRisk {
  department: string
  exposureLevel: number
  incidents: number
  totalEmployees: number
}

export interface AIMaturityData {
  pillar: string
  current: number
  target: number
  gap: number
  impact: string
  effort: string
  priority: number
}

export interface DepartmentAIScores {
  department: string
  prompting: number
  tools: number
  responsibleUse: number
  aiThinking: number
  coIntelligence: number
  overall: number
  employeeCount: number
}

export interface RoleData {
  role: string
  count: number
  avgSkill: number
  topSkills: string[]
}

export interface SkillHeatmapData {
  employee: string
  department: string
  role: string
  prompting: number
  tools: number
  ethicsresponsibleuse: number
  thinking: number
  coIntelligence: number
  overall: number
}

export interface EmployeePersona {
  name: string
  description: string
  characteristics: string[]
  count: number
  avgScore: number
  topStrengths: string[]
  growthAreas: string[]
}

export interface AssessmentCohort {
  id: string
  name: string
  startDate: string
  endDate: string
  totalInvited: number
  completed: number
  inProgress: number
  notStarted: number
  completionRate: number
  departments: string[]
  accessCode?: string
}

export interface ParticipantData {
  id: string
  email: string
  name?: string
  department: string
  role: string
  cohort: string
  status: 'completed' | 'in_progress' | 'not_started'
  completedDate?: string
  overallScore?: number
  dimensionScores?: Record<string, number>
}

export const dashboardDataService = new DashboardDataService()