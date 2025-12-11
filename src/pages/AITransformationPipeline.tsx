import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService, DashboardMetrics } from '@/lib/dashboardDataService'
import { cachedProcessAnalysisAgent } from '@/lib/cachedProcessAnalysisAgent'
import { ProcessData, CompanySettings } from '@/lib/processAnalysisAgent'
import { settingsService } from '@/lib/settingsService'
import { 
  Users, 
  TrendingUp, 
  FileText,
  Filter,
  Brain,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react'

interface WorkflowProcess {
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
  feasibility: string
  productivityGain: string
  availableTools: string[]
  recommendedTool: string
  automatableStepsList: string[]
  manualStepsList: string[]
}

// Helper function to format raw process names into human-readable format
const formatProcessName = (rawName: string): string => {
  // Common process name mappings for better readability
  const processMap: { [key: string]: string } = {
    'primary_work_processes': 'Primary Work Processes',
    'document_review': 'Document Review & Analysis',
    'email_management': 'Email Management & Communication',
    'data_analysis': 'Data Analysis & Reporting',
    'customer_support': 'Customer Support & Service',
    'project_management': 'Project Management & Coordination',
    'content_creation': 'Content Creation & Marketing',
    'financial_analysis': 'Financial Analysis & Reporting',
    'hr_processes': 'HR Processes & Administration',
    'sales_processes': 'Sales Processes & Lead Management',
    'inventory_management': 'Inventory & Supply Chain Management',
    'quality_assurance': 'Quality Assurance & Testing',
    'research_development': 'Research & Development',
    'compliance_monitoring': 'Compliance & Risk Monitoring',
    'training_development': 'Training & Development Programs'
  }
  
  // Handle common assessment field patterns
  let processName = rawName
  if (processName.includes('-')) {
    // Remove prefixes like 'strategic-', 'profile-', etc.
    processName = processName.split('-').slice(1).join('-')
  }
  
  // Check for exact matches in our mapping
  if (processMap[processName]) {
    return processMap[processName]
  }
  
  // Convert underscores to spaces and apply title case
  return processName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bAi\b/g, 'AI') // Fix AI capitalization
    .replace(/\bIt\b/g, 'IT') // Fix IT capitalization
    .replace(/\bHr\b/g, 'HR') // Fix HR capitalization
    .replace(/\bCrm\b/g, 'CRM') // Fix CRM capitalization
    .replace(/\bErp\b/g, 'ERP') // Fix ERP capitalization
    .replace(/\bApi\b/g, 'API') // Fix API capitalization
    .replace(/\bUi\b/g, 'UI') // Fix UI capitalization
    .replace(/\bUx\b/g, 'UX') // Fix UX capitalization
    .replace(/\bSeo\b/g, 'SEO') // Fix SEO capitalization
    .replace(/\bCeo\b/g, 'CEO') // Fix CEO capitalization
    .replace(/\bCfo\b/g, 'CFO') // Fix CFO capitalization
    .replace(/\bCto\b/g, 'CTO') // Fix CTO capitalization
}

export function AITransformationPipeline() {
  const { user } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('automation') // 'automation', 'employees', 'time'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [workflows, setWorkflows] = useState<WorkflowProcess[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [analysisMetadata, setAnalysisMetadata] = useState<{
    fromCache: boolean
    submissionsAnalyzed: number
    lastUpdated: string | null
    needsUpdate: boolean
  } | null>(null)

  useEffect(() => {
    loadWorkflowData(false)
  }, [user])

  const loadWorkflowData = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      
      // Get real dashboard metrics
      const dashboardMetrics = await dashboardDataService.calculateDashboardMetrics(undefined)
      setMetrics(dashboardMetrics)
      
      // Get actual assessment submissions to extract real workflows  
      const submissions = await dashboardDataService.getRecentSubmissions(100, undefined)
      
      // Extract raw process data from submissions
      const processData = extractProcessDataFromSubmissions(submissions)
      
      // Get company settings for tool context
      const companySettings = await getCompanySettings()
      
      // Get company ID for caching (use first available company for demo)
      const companies = await settingsService.getCompanies()
      const companyId = companies.length > 0 ? companies[0].id : 'demo-company'
      
      // Use cached AI agent to analyze processes with persistence
      const analysisResult = await cachedProcessAnalysisAgent.getOrGenerateAnalysis(
        processData, 
        companySettings,
        { companyId, forceRefresh }
      )
      
      setWorkflows(analysisResult.analyses)
      setAnalysisMetadata({
        fromCache: analysisResult.fromCache,
        submissionsAnalyzed: analysisResult.metadata.submissionsAnalyzed,
        lastUpdated: analysisResult.metadata.lastUpdated,
        needsUpdate: analysisResult.metadata.needsUpdate
      })
      
    } catch (error) {
      console.error('Error loading workflow data:', error)
      // Fallback to basic workflows if there's an error
      setWorkflows(generateFallbackWorkflows())
      setAnalysisMetadata({
        fromCache: false,
        submissionsAnalyzed: 0,
        lastUpdated: null,
        needsUpdate: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const extractProcessDataFromSubmissions = (submissions: any[]): ProcessData[] => {
    // Extract raw workflow data for AI agent analysis
    const workflowData: { [key: string]: any } = {}
    
    submissions.forEach(submission => {
      const primaryProcesses = submission.responses?.['strategic-primary_work_processes']
      const department = submission.responses?.['profile-department'] || 'Unknown'
      const timeSpent = submission.responses?.['time_spent_on_processes'] || {}
      const painPoints = submission.responses?.['biggest_process_challenges'] || []
      
      if (Array.isArray(primaryProcesses)) {
        primaryProcesses.forEach((process: string) => {
          if (!workflowData[process]) {
            workflowData[process] = {
              processName: process,
              department,
              userCount: 0,
              totalTimeSpent: 0,
              painPoints: new Set(),
              departments: new Set()
            }
          }
          
          workflowData[process].userCount++
          workflowData[process].totalTimeSpent += timeSpent[process] || 5 // default 5 hours
          workflowData[process].departments.add(department)
          
          if (Array.isArray(painPoints)) {
            painPoints.forEach((pain: string) => workflowData[process].painPoints.add(pain))
          }
        })
      }
    })
    
    // Convert to ProcessData format for AI agent
    return Object.values(workflowData)
      .filter((workflow: any) => workflow.userCount >= 1)
      .map((workflow: any) => ({
        processName: workflow.processName,
        department: workflow.department,
        userCount: workflow.userCount,
        totalTimeSpent: workflow.totalTimeSpent,
        painPoints: Array.from(workflow.painPoints).filter((pain): pain is string => typeof pain === 'string'),
        departments: Array.from(workflow.departments).filter((dept): dept is string => typeof dept === 'string')
      }))
      .sort((a, b) => (b.userCount * b.totalTimeSpent) - (a.userCount * a.totalTimeSpent)) // Sort by impact
  }

  const getCompanySettings = async (): Promise<CompanySettings | undefined> => {
    try {
      // For demo/development, we'll get settings from the first available company
      // In production, this would be based on the user's company
      const companies = await settingsService.getCompanies()
      if (companies.length === 0) return undefined

      const companyId = companies[0].id
      const settings = await settingsService.getCompanySettings(companyId)
      
      if (!settings) return undefined
      
      // Map settings service types to process analysis agent types
      const aiTools = (settings.ai_tools || []).map(tool => ({
        name: tool.tool_name,
        category: tool.category,
        status: tool.approved ? 'approved' as const : 'restricted' as const,
        usage_count: tool.user_count
      }))
      
      const departments = (settings.departments || []).map(dept => dept.name)
      
      return {
        aiTools,
        departments,
        companyName: companies[0].name
      }
    } catch (error) {
      console.error('Error loading company settings:', error)
      return undefined
    }
  }


  const generateFallbackWorkflows = (): WorkflowProcess[] => [
    {
      id: 1,
      process: 'Customer Onboarding Process',
      department: 'Sales',
      employees: 23,
      timePerWeek: 4.5,
      totalSteps: 12,
      automatableSteps: 9,
      automationPercentage: 75,
      currentMethod: 'Manual form entry, email follow-ups, manual approval routing',
      automationOpportunity: 'Customer Service Chatbot for initial screening and data collection',
      feasibility: 'High',
      productivityGain: '75% faster response times',
      availableTools: ['ChatGPT', 'Slack', 'Microsoft 365'],
      recommendedTool: 'ChatGPT + Custom Integration',
      automatableStepsList: ['Initial inquiry capture', 'Contact info validation', 'Service needs assessment', 'Documentation collection', 'Basic qualification scoring'],
      manualStepsList: ['Complex requirement discussion', 'Contract negotiation', 'Final approval sign-off']
    },
    {
      id: 2,
      process: 'Invoice Processing Workflow',
      department: 'Finance',
      employees: 8,
      timePerWeek: 6.2,
      totalSteps: 10,
      automatableSteps: 7,
      automationPercentage: 70,
      currentMethod: 'Manual PDF review, Excel data entry, approval chasing',
      automationOpportunity: 'Invoice Data Extraction & Validation with OCR and AI coding',
      feasibility: 'Medium',
      productivityGain: '70% processing acceleration',
      availableTools: ['Microsoft 365', 'Power Platform'],
      recommendedTool: 'Power Platform AI Builder',
      automatableStepsList: ['Invoice receipt scanning', 'Data extraction from PDF', 'Vendor information lookup', 'Line item categorization'],
      manualStepsList: ['Complex dispute resolution', 'New vendor setup', 'Executive approval review']
    }
  ]

  const departments = ['all', 'Sales', 'Finance', 'HR', 'Marketing', 'Support', 'Operations', 'All']

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getSortValue = (workflow: typeof workflows[0], field: string) => {
    switch (field) {
      case 'automation': return workflow.automationPercentage
      case 'employees': return workflow.employees
      case 'time': return workflow.timePerWeek
      default: return 0
    }
  }

  const filteredAndSortedWorkflows = selectedDepartment === 'all' 
    ? workflows 
    : workflows.filter(w => w.department.includes(selectedDepartment))

  const sortedWorkflows = [...filteredAndSortedWorkflows].sort((a, b) => {
    const aValue = getSortValue(a, sortBy)
    const bValue = getSortValue(b, sortBy)
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  })

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Use Cases</h1>
        <p className="text-gray-600 mt-2">
          Detailed breakdown of work processes showing automation potential identified through employee assessments
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isRefreshing ? 'Refreshing AI analysis...' : 'Mapping business processes...'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {isRefreshing ? 'Generating updated automation recommendations' : 'Generating intelligent automation recommendations'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Automation Analysis Summary - Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="text-center py-6">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">
                  {workflows.length}
                </div>
                <p className="text-sm text-gray-600">Workflows Analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                {workflows.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(workflows.reduce((sum, w) => sum + w.automationPercentage, 0) / workflows.length)}%
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      ✓ AI-Generated Analysis
                    </p>
                    <p className="text-sm text-gray-600">Avg Automatable Work</p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => loadWorkflowData(true)}
                      disabled={isLoading || isRefreshing}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || isRefreshing ? 'Generating...' : 'Generate AI Analysis'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">Analyze your processes for automation potential</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(workflows.reduce((sum, w) => sum + (w.employees * w.timePerWeek), 0))}
                </div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(workflows.reduce((sum, w) => sum + (w.employees * w.timePerWeek * (w.automationPercentage / 100)), 0))}h
                </div>
                <p className="text-sm text-gray-600">Weekly Hours Recoverable</p>
              </CardContent>
            </Card>
          </div>

          {/* Process Table */}
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Business Processes</CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-sm text-gray-600">
                  Click on any process to expand details and AI opportunities
                </p>
                {analysisMetadata && (
                  <div className="flex items-center space-x-2">
                    {analysisMetadata.fromCache ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Cached</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-blue-600">Fresh</span>
                      </div>
                    )}
                    {analysisMetadata.lastUpdated && (
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(analysisMetadata.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                    {analysisMetadata.needsUpdate && (
                      <span className="text-xs text-orange-600 font-medium">
                        Update Available
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsRefreshing(true)
                  loadWorkflowData(true).finally(() => setIsRefreshing(false))
                }}
                disabled={isRefreshing}
                className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Updating...' : 'Update Analysis'}</span>
              </button>
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {workflows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Process</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                    <th 
                      className="text-right py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('employees')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>People Impacted</span>
                        {sortBy === 'employees' && (
                          sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-right py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('time')}
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Time Lost/Week</span>
                        {sortBy === 'time' && (
                          sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                      onClick={() => handleSort('automation')}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>Automatable with AI?</span>
                        {sortBy === 'automation' && (
                          sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWorkflows.map((workflow) => (
                    <React.Fragment key={workflow.id}>
                      <tr
                        onClick={() => setSelectedProcess(selectedProcess === workflow.id ? null : workflow.id)}
                        className={`border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedProcess === workflow.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{formatProcessName(workflow.process)}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{workflow.department}</td>
                        <td className="py-3 px-4 text-right font-medium">{workflow.employees}</td>
                        <td className="py-3 px-4 text-right font-medium">{Math.round(workflow.employees * workflow.timePerWeek)}h</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-bold text-lg">{workflow.automationPercentage}%</span>
                            <div className="flex items-center space-x-1">
                              <Badge 
                                variant={workflow.feasibility === 'High' ? 'success' : workflow.feasibility === 'Medium' ? 'warning' : 'danger'} 
                                size="sm"
                              >
                                {workflow.feasibility}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                via {workflow.recommendedTool}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {selectedProcess === workflow.id && (
                        <tr className="bg-blue-50">
                          <td colSpan={5} className="p-6">
                            <div className="space-y-6">
                              {/* Automation Overview */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="font-medium text-gray-900 mb-3">Current Situation</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Steps:</span>
                                      <span className="font-medium">{workflow.totalSteps}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Weekly Hours:</span>
                                      <span className="font-medium">{Math.round(workflow.employees * workflow.timePerWeek)}h</span>
                                    </div>
                                    <div className="pt-2">
                                      <span className="text-gray-600">Current Method:</span>
                                      <p className="text-gray-700 italic mt-1">{workflow.currentMethod}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                  <h4 className="font-medium text-green-900 mb-3">Automation Potential</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-green-600">Automatable Steps:</span>
                                      <span className="font-medium text-green-800">{workflow.automatableSteps} of {workflow.totalSteps}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-green-600">Expected Gain:</span>
                                      <span className="font-medium text-green-800">{workflow.productivityGain}</span>
                                    </div>
                                    <div className="pt-2">
                                      <span className="text-green-600">AI Solution:</span>
                                      <p className="text-green-800 font-medium mt-1">{workflow.automationOpportunity}</p>
                                    </div>
                                    <div className="pt-2">
                                      <span className="text-green-600">Available Tools:</span>
                                      <p className="text-green-800 text-xs mt-1">{workflow.availableTools.join(', ')}</p>
                                      <span className="text-green-600 text-xs">Recommended:</span>
                                      <span className="text-green-800 font-medium text-xs ml-1">{workflow.recommendedTool}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar and Step Details */}
                              <div className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium text-gray-700">Automation Breakdown</span>
                                  <span className="text-sm text-gray-500">{workflow.automationPercentage}% automatable</span>
                                </div>
                                <div className="bg-gray-200 rounded-full h-3 mb-4">
                                  <div 
                                    className="bg-green-500 h-3 rounded-full" 
                                    style={{ width: `${workflow.automationPercentage}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mb-4 text-xs text-gray-600">
                                  <span>{workflow.automatableSteps} steps automatable</span>
                                  <span>{workflow.totalSteps - workflow.automatableSteps} steps manual</span>
                                </div>
                                
                                {workflow.automatableStepsList && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                                    <div>
                                      <h5 className="text-xs font-medium text-green-700 mb-2">✓ Automatable Steps ({workflow.automatableSteps})</h5>
                                      <ul className="space-y-1">
                                        {workflow.automatableStepsList.map((step, index) => (
                                          <li key={index} className="text-xs text-green-600 flex items-start">
                                            <span className="text-green-500 mr-1">•</span>
                                            <span>{step}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    {workflow.manualStepsList && (
                                      <div>
                                        <h5 className="text-xs font-medium text-gray-700 mb-2">⚡ Manual Steps ({workflow.totalSteps - workflow.automatableSteps})</h5>
                                        <ul className="space-y-1">
                                          {workflow.manualStepsList.map((step, index) => (
                                            <li key={index} className="text-xs text-gray-600 flex items-start">
                                              <span className="text-gray-400 mr-1">•</span>
                                              <span>{step}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Process Analysis Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Generate your first AI-powered analysis to discover automation opportunities in your organization's workflows.
              </p>
              <button
                onClick={() => loadWorkflowData(true)}
                disabled={isLoading || isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{isLoading || isRefreshing ? 'Generating Analysis...' : 'Generate AI Analysis'}</span>
              </button>
            </div>
          )}
        </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}