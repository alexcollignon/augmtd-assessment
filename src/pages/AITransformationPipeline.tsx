import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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

export function AITransformationPipeline() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('automation') // 'automation', 'employees', 'time'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Workflow analysis from employee assessments - supports automation percentage claims
  const workflows = [
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
      automatableStepsList: ['Initial inquiry capture', 'Contact info validation', 'Service needs assessment', 'Documentation collection', 'Basic qualification scoring', 'Follow-up email scheduling', 'Internal team notifications', 'Progress tracking updates', 'Appointment scheduling'],
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
      automatableStepsList: ['Invoice receipt scanning', 'Data extraction from PDF', 'Vendor information lookup', 'Line item categorization', 'Tax calculation validation', 'Duplicate invoice detection', 'Basic approval routing'],
      manualStepsList: ['Complex dispute resolution', 'New vendor setup', 'Executive approval review']
    },
    {
      id: 3,
      process: 'Employee Recruitment Process',
      department: 'HR',
      employees: 4,
      timePerWeek: 8.5,
      totalSteps: 15,
      automatableSteps: 12,
      automationPercentage: 80,
      currentMethod: 'Manual resume review, criteria matching, ranking',
      automationOpportunity: 'Resume Screening & Ranking AI with skills extraction',
      feasibility: 'High', 
      productivityGain: '80% screening efficiency',
      availableTools: ['ChatGPT', 'Microsoft 365'],
      recommendedTool: 'ChatGPT + ATS Integration',
      automatableStepsList: ['Resume parsing', 'Skills keyword matching', 'Experience level assessment', 'Education verification', 'Initial qualification scoring', 'Interview scheduling coordination', 'Reference check initiation', 'Candidate communication', 'Application status updates', 'Basic compliance screening', 'Portfolio/work sample review', 'Salary expectation analysis'],
      manualStepsList: ['Final interview conduct', 'Cultural fit assessment', 'Negotiation and offer discussion']
    },
    {
      id: 4,
      process: 'Marketing Campaign Creation',
      department: 'Marketing',
      employees: 12,
      timePerWeek: 5.2,
      totalSteps: 8,
      automatableSteps: 5,
      automationPercentage: 65,
      currentMethod: 'Manual content writing, image sourcing, format optimization',
      automationOpportunity: 'Content Generation Assistant for copy and creative assets',
      feasibility: 'High',
      productivityGain: '65% content creation speed',
      availableTools: ['ChatGPT', 'Canva', 'Adobe Creative'],
      recommendedTool: 'ChatGPT + Canva',
      automatableStepsList: ['Content brief creation', 'Copy generation', 'Image sourcing and editing', 'Social media format optimization', 'A/B test variant creation'],
      manualStepsList: ['Strategic campaign planning', 'Brand voice refinement', 'Final creative approval']
    },
    {
      id: 5,
      process: 'Operations Maintenance Workflow',
      department: 'Operations',
      employees: 15,
      timePerWeek: 6.8,
      totalSteps: 10,
      automatableSteps: 6,
      automationPercentage: 60,
      currentMethod: 'Manual equipment checks, reactive maintenance, manual scheduling',
      automationOpportunity: 'Predictive Equipment Maintenance with IoT and AI analysis',
      feasibility: 'Medium',
      productivityGain: '60% downtime reduction',
      availableTools: ['Microsoft 365', 'Power Platform'],
      recommendedTool: 'Custom IoT + AI Solution',
      automatableStepsList: ['Equipment status monitoring', 'Maintenance schedule generation', 'Parts inventory tracking', 'Performance trend analysis', 'Alert notifications', 'Work order creation'],
      manualStepsList: ['Complex repairs', 'Safety inspections', 'Equipment replacement decisions', 'Vendor coordination']
    },
    {
      id: 6,
      process: 'Customer Support Tickets',
      department: 'Support',
      employees: 18,
      timePerWeek: 12.5,
      totalSteps: 8,
      automatableSteps: 3,
      automationPercentage: 40,
      currentMethod: 'Manual ticket triage, response drafting, escalation decisions',
      automationOpportunity: 'AI chatbot for L1 support and smart ticket routing',
      feasibility: 'High',
      productivityGain: '40% faster resolution',
      availableTools: ['ChatGPT', 'Zendesk', 'Slack'],
      recommendedTool: 'Zendesk AI + ChatGPT',
      automatableStepsList: ['Initial ticket categorization', 'Response template selection', 'FAQ answer matching'],
      manualStepsList: ['Complex technical troubleshooting', 'Escalated customer issues', 'Account-specific negotiations', 'Product feedback analysis', 'Refund/billing disputes']
    },
    {
      id: 7,
      process: 'Financial Reporting',
      department: 'Finance',
      employees: 6,
      timePerWeek: 7.2,
      totalSteps: 12,
      automatableSteps: 8,
      automationPercentage: 67,
      currentMethod: 'Manual data compilation, Excel calculations, report formatting',
      automationOpportunity: 'Automated data aggregation and dynamic report generation',
      feasibility: 'Medium',
      productivityGain: '65% faster reporting',
      availableTools: ['Microsoft 365', 'Power BI'],
      recommendedTool: 'Power BI + Power Automate',
      automatableStepsList: ['Data extraction from systems', 'Financial calculations', 'Report formatting', 'Chart generation', 'Variance analysis', 'Distribution scheduling', 'Archive management', 'Update notifications'],
      manualStepsList: ['Executive summary writing', 'Strategic recommendations', 'Anomaly investigation', 'Stakeholder presentation']
    },
    {
      id: 8,
      process: 'Email Management',
      department: 'All',
      employees: 67,
      timePerWeek: 3.2,
      totalSteps: 6,
      automatableSteps: 2,
      automationPercentage: 25,
      currentMethod: 'Manual sorting, response writing, priority assessment',
      automationOpportunity: 'Smart filtering and response suggestions',
      feasibility: 'Low',
      productivityGain: '25% efficiency gain',
      availableTools: ['Microsoft 365', 'Outlook'],
      recommendedTool: 'Outlook AI Features',
      automatableStepsList: ['Spam filtering', 'Response suggestions'],
      manualStepsList: ['Complex decision-making emails', 'Strategic communications', 'Sensitive negotiations', 'Personal relationship management']
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

      {/* Automation Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{workflows.length}</div>
            <p className="text-sm text-gray-600">Workflows Analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">32%</div>
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

    </div>
  )
}