import { openaiService } from './openaiService'

export interface ProcessData {
  processName: string
  department: string
  userCount: number
  totalTimeSpent: number
  painPoints: string[]
  departments: string[]
}

export interface CompanySettings {
  aiTools: Array<{
    name: string
    category: string
    status: 'approved' | 'restricted' | 'monitoring'
    usage_count?: number
  }>
  departments: string[]
  companyName?: string
}

export interface AnalyzedProcess {
  id: number
  process: string
  department: string
  employees: number
  timePerWeek: number
  totalSteps: number
  automatableSteps: number
  automationPercentage: number
  currentMethod: string
  automationOpportunity: string
  feasibility: 'High' | 'Medium' | 'Low'
  productivityGain: string
  availableTools: string[]
  recommendedTool: string
  automatableStepsList: string[]
  manualStepsList: string[]
  businessValue: string
  roiTimeframe: string
  implementationComplexity: string
}

export class ProcessAnalysisAgent {
  private systemPrompt = `You are an expert enterprise transformation consultant specializing in organizational process analysis and AI-driven automation strategy. Your role is to analyze business processes and provide executive-level insights for organizational augmentation.

CONTEXT: You're analyzing business processes from employee assessment data for the AUGMTD Intelligence Platform, which helps executives transform their organizations into "augmented organizations" through strategic AI adoption.

EXPERTISE: 
- Business process optimization and automation
- AI/ML implementation in enterprise environments
- ROI modeling and transformation strategy
- Industry best practices for digital transformation
- Executive-level strategic recommendations

OUTPUT FORMAT: Always respond with valid JSON only, no additional text or explanations outside the JSON structure.

ANALYSIS APPROACH:
1. Assess automation potential based on process complexity, standardization, and data availability
2. Provide realistic ROI estimates based on industry benchmarks
3. Consider implementation feasibility including technical complexity and organizational readiness
4. Recommend specific tools and implementation strategies
5. Identify business value and transformation impact

Focus on providing actionable, executive-level insights that support strategic decision-making for organizational transformation.`

  async analyzeProcesses(processData: ProcessData[], companySettings?: CompanySettings): Promise<AnalyzedProcess[]> {
    try {
      // Prepare company context for AI agent
      const companyContext = companySettings ? `
COMPANY CONTEXT:
Company Name: ${companySettings.companyName || 'Organization'}
Approved AI Tools: ${JSON.stringify(companySettings.aiTools.filter(t => t.status === 'approved'), null, 2)}
Departments: ${companySettings.departments.join(', ')}
Tool Restrictions: ${companySettings.aiTools.filter(t => t.status === 'restricted').map(t => t.name).join(', ') || 'None specified'}

IMPORTANT: Base all tool recommendations ONLY on the approved AI tools listed above. Do not suggest tools that are not in the approved list.
` : ''

      const analysisPrompt = `Analyze the following business processes for automation potential and transformation strategy:

PROCESS DATA:
${JSON.stringify(processData, null, 2)}
${companyContext}
ANALYSIS REQUIREMENTS:
For each process, provide comprehensive analysis including:

1. AUTOMATION ASSESSMENT:
   - Automation percentage (realistic 30-85% range based on actual process complexity)
   - Number of total steps and automatable steps
   - Feasibility rating (High/Medium/Low)

2. BUSINESS IMPACT:
   - Time savings and productivity gains
   - ROI timeframe and business value
   - Implementation complexity assessment

3. TECHNICAL STRATEGY:
   - Specific automation opportunities using ONLY approved AI tools
   - Recommended tool combinations from approved list
   - Automatable vs manual step breakdown
   - Implementation feasibility based on existing tool stack

4. EXECUTIVE INSIGHTS:
   - Strategic priority and sequencing
   - Resource requirements
   - Transformation impact

RESPONSE FORMAT:
{
  "processes": [
    {
      "id": 1,
      "process": "string",
      "department": "string", 
      "employees": number,
      "timePerWeek": number,
      "totalSteps": number,
      "automatableSteps": number,
      "automationPercentage": number,
      "currentMethod": "string",
      "automationOpportunity": "string", 
      "feasibility": "High|Medium|Low",
      "productivityGain": "string",
      "availableTools": ["string (from approved company tools only)"],
      "recommendedTool": "string (must be from approved company tools)",
      "automatableStepsList": ["string"],
      "manualStepsList": ["string"],
      "businessValue": "string",
      "roiTimeframe": "string",
      "implementationComplexity": "string"
    }
  ]
}

CRITICAL: 
- All tool recommendations must come from the approved AI tools list provided
- Consider tool usage restrictions and company policies
- Provide realistic implementation timelines based on existing tool familiarity
- Ensure automation percentages are realistic and based on actual process characteristics

If no approved tools are provided, use general categories but emphasize the need for tool approval.`

      const response = await openaiService.analyzeText(analysisPrompt, this.systemPrompt, 'gpt-4o-mini')
      
      try {
        const parsed = JSON.parse(response)
        return parsed.processes.map((process: any, index: number) => ({
          ...process,
          id: index + 1
        }))
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        console.error('Raw response:', response)
        throw new Error('AI agent returned invalid JSON response')
      }

    } catch (error) {
      console.error('Process analysis failed:', error)
      
      // Fallback to basic analysis if AI fails
      return this.generateFallbackAnalysis(processData, companySettings)
    }
  }

  private generateFallbackAnalysis(processData: ProcessData[], companySettings?: CompanySettings): AnalyzedProcess[] {
    return processData.map((workflow, index) => {
      const avgTimePerWeek = workflow.totalTimeSpent / workflow.userCount
      
      // Basic automation potential based on process characteristics
      let automationPotential = 45 // Base percentage
      if (workflow.userCount >= 10) automationPotential += 10
      if (workflow.painPoints.length >= 3) automationPotential += 10
      
      const processName = workflow.processName.toLowerCase()
      if (processName.includes('document') || processName.includes('report')) automationPotential += 15
      if (processName.includes('email') || processName.includes('communication')) automationPotential += 10
      if (processName.includes('data') || processName.includes('analysis')) automationPotential += 8
      
      automationPotential = Math.min(Math.max(automationPotential, 30), 85)
      
      const totalSteps = 8 + Math.floor(workflow.processName.length % 7)
      
      return {
        id: index + 1,
        process: workflow.processName,
        department: workflow.departments.join(', ') || 'Various',
        employees: workflow.userCount,
        timePerWeek: Math.round(avgTimePerWeek * 10) / 10,
        totalSteps,
        automatableSteps: Math.floor(totalSteps * (automationPotential / 100)),
        automationPercentage: automationPotential,
        currentMethod: `Manual ${workflow.processName.toLowerCase()} process`,
        automationOpportunity: `AI-enhanced ${workflow.processName.toLowerCase()} with intelligent automation`,
        feasibility: workflow.userCount >= 8 ? 'High' : 'Medium',
        productivityGain: `${automationPotential}% automation potential`,
        availableTools: this.getAvailableTools(companySettings),
        recommendedTool: this.getRecommendedTool(workflow.processName, companySettings),
        automatableStepsList: [
          'Data capture and validation',
          'Document processing',
          'Automated notifications',
          'Status tracking'
        ],
        manualStepsList: [
          'Complex decision making',
          'Strategic analysis',
          'Human relationship management'
        ],
        businessValue: `Streamline ${workflow.processName.toLowerCase()} for ${workflow.userCount} employees`,
        roiTimeframe: automationPotential > 60 ? '3-6 months' : '6-12 months',
        implementationComplexity: workflow.userCount >= 10 ? 'Medium' : 'Low'
      }
    })
  }

  private getAvailableTools(companySettings?: CompanySettings): string[] {
    if (companySettings?.aiTools) {
      return companySettings.aiTools
        .filter(tool => tool.status === 'approved')
        .map(tool => tool.name)
    }
    return ['ChatGPT', 'Microsoft 365', 'Power Platform'] // Fallback tools
  }

  private getRecommendedTool(processName: string, companySettings?: CompanySettings): string {
    const approvedTools = companySettings?.aiTools?.filter(tool => tool.status === 'approved') || []
    
    if (approvedTools.length === 0) {
      return 'Tool approval needed - consult IT governance'
    }

    const name = processName.toLowerCase()
    
    // Try to match process type with approved tools
    if (name.includes('customer') || name.includes('service')) {
      const chatTool = approvedTools.find(t => 
        t.name.toLowerCase().includes('chatgpt') || 
        t.name.toLowerCase().includes('chat') ||
        t.category?.toLowerCase().includes('communication')
      )
      if (chatTool) return chatTool.name
    }
    
    if (name.includes('document') || name.includes('report')) {
      const docTool = approvedTools.find(t => 
        t.name.toLowerCase().includes('power') || 
        t.name.toLowerCase().includes('document') ||
        t.category?.toLowerCase().includes('document')
      )
      if (docTool) return docTool.name
    }
    
    if (name.includes('email') || name.includes('communication')) {
      const emailTool = approvedTools.find(t => 
        t.name.toLowerCase().includes('copilot') || 
        t.name.toLowerCase().includes('email') ||
        t.category?.toLowerCase().includes('productivity')
      )
      if (emailTool) return emailTool.name
    }
    
    if (name.includes('data') || name.includes('analysis')) {
      const dataTool = approvedTools.find(t => 
        t.name.toLowerCase().includes('power bi') || 
        t.name.toLowerCase().includes('analytics') ||
        t.category?.toLowerCase().includes('analytics')
      )
      if (dataTool) return dataTool.name
    }
    
    // Return the most used or first approved tool as fallback
    return approvedTools[0]?.name || 'Custom solution needed'
  }
}

export const processAnalysisAgent = new ProcessAnalysisAgent()