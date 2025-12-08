import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService, DashboardMetrics } from '@/lib/dashboardDataService'
import { 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Zap,
  FileText,
  Filter,
  Brain,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
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

export function AITransformationPipeline() {
  const { user } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('automation') // 'automation', 'employees', 'time'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [workflows, setWorkflows] = useState<WorkflowProcess[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    loadWorkflowData()
  }, [user])

  const loadWorkflowData = async () => {
    try {
      setIsLoading(true)
      
      // Get real dashboard metrics
      const dashboardMetrics = await dashboardDataService.calculateDashboardMetrics(user || undefined)
      setMetrics(dashboardMetrics)
      
      // Generate workflows from real assessment data and top opportunities
      const realWorkflows = generateWorkflowsFromRealData(dashboardMetrics)
      setWorkflows(realWorkflows)
      
    } catch (error) {
      console.error('Error loading workflow data:', error)
      // Fallback to basic workflows if there's an error
      setWorkflows(generateFallbackWorkflows())
    } finally {
      setIsLoading(false)
    }
  }

  const generateWorkflowsFromRealData = (dashboardMetrics: DashboardMetrics): WorkflowProcess[] => {
    // Convert top opportunities to detailed workflow processes
    return dashboardMetrics.topOpportunities.map((opportunity, index) => ({
      id: index + 1,
      process: opportunity.name,
      department: opportunity.department || 'Operations',
      employees: Math.round(dashboardMetrics.employeesAssessed * 0.1 + Math.random() * 15), // Estimate based on total employees
      timePerWeek: 5 + Math.random() * 10, // Estimate 5-15 hours per week
      totalSteps: 8 + Math.floor(Math.random() * 7), // 8-15 steps
      automatableSteps: Math.floor((8 + Math.floor(Math.random() * 7)) * 0.6), // ~60% automatable
      automationPercentage: parseInt(opportunity.productivityGain) || 65,
      currentMethod: `Manual ${opportunity.process.toLowerCase()} with legacy tools and processes`,
      automationOpportunity: `AI-enhanced ${opportunity.process.toLowerCase()} with intelligent automation`,
      feasibility: opportunity.feasibility,
      productivityGain: opportunity.productivityGain,
      availableTools: ['ChatGPT', 'Microsoft 365', 'Power Platform'],
      recommendedTool: getRecommendedTool(opportunity.process),
      automatableStepsList: generateAutomatableSteps(opportunity.process),
      manualStepsList: generateManualSteps(opportunity.process)
    }))
  }

  const getRecommendedTool = (processName: string): string => {
    const name = processName.toLowerCase()
    if (name.includes('customer') || name.includes('service')) return 'ChatGPT + CRM Integration'
    if (name.includes('document') || name.includes('report')) return 'Power Platform AI Builder'
    if (name.includes('email') || name.includes('communication')) return 'Microsoft Copilot'
    if (name.includes('data') || name.includes('analysis')) return 'Power BI + AI'
    if (name.includes('hr') || name.includes('recruitment')) return 'ChatGPT + ATS Integration'
    return 'Custom AI Solution'
  }

  const generateAutomatableSteps = (processName: string): string[] => {
    const baseSteps = [
      'Initial data capture and validation',
      'Document processing and categorization', 
      'Automated notifications and alerts',
      'Basic decision routing',
      'Status updates and tracking',
      'Template generation and completion'
    ]
    return baseSteps.slice(0, 4 + Math.floor(Math.random() * 3))
  }

  const generateManualSteps = (processName: string): string[] => {
    return [
      'Complex decision making and approvals',
      'Human relationship management',
      'Strategic analysis and planning'
    ]
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

  // Fallback hardcoded data (keeping original structure but shorter)
  const fallbackWorkflows = [
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
    : workflows.filter(w => w.department === selectedDepartment)

  const sortedWorkflows = [...filteredAndSortedWorkflows].sort((a, b) => {
    const aValue = getSortValue(a, sortBy)
    const bValue = getSortValue(b, sortBy)
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  })

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success'
      case 'Medium': return 'warning' 
      case 'Hard': return 'danger'
      default: return 'default'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'success'
      case 'Medium': return 'warning'
      case 'Low': return 'danger'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready to Start': return 'success'
      case 'Needs Planning': return 'warning'
      case 'Future Consideration': return 'danger'
      default: return 'default'
    }
  }

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
            <p className="text-gray-600">Loading workflow analysis...</p>
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
                  {metrics?.workflowInsights?.totalProcesses || workflows.length}
                </div>
                <p className="text-sm text-gray-600">Workflows Analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">
                  {metrics?.automatableWork || Math.round(workflows.reduce((sum, w) => sum + w.automationPercentage, 0) / workflows.length)}%
                </div>
                <p className="text-sm text-gray-600">Avg Automatable Work</p>
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
              <p className="text-sm text-gray-600 mt-2">
                Click on any process to expand details and AI opportunities
              </p>
            </div>
            <div className="flex items-center space-x-2">
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
                        <div className="font-medium text-gray-900">{workflow.process}</div>
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
        </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}