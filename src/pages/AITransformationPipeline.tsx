import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { 
  MessageCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  FileText,
  Workflow,
  Filter,
  DollarSign,
  Star,
  Lightbulb,
  BookOpen,
  Calendar,
  Settings,
  Play,
  Building2,
  Brain
} from 'lucide-react'

export function AITransformationPipeline() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedMaturity, setSelectedMaturity] = useState('all')
  const [activeTab, setActiveTab] = useState<'workflow-audit' | 'pain-points' | 'implementation' | 'prioritization'>('workflow-audit')

  // Employee-reported pain points from assessments
  const processPainPoints = [
    {
      process: 'Customer Onboarding',
      department: 'Sales',
      employeesReporting: 23,
      totalEmployees: 45,
      avgTimeSpent: '4.5 hrs/week',
      topComplaints: [
        'Manual data entry across 5 different systems (18 employees)',
        'Waiting for approvals - process gets stuck (15 employees)',
        'Duplicate information entry in CRM and billing (12 employees)'
      ],
      impactScore: 85,
      manualSteps: 8,
      totalSteps: 12,
      automationPotential: 75,
      potentialProductivityGain: '60% faster processing'
    },
    {
      process: 'Invoice Processing',
      department: 'Finance', 
      employeesReporting: 8,
      totalEmployees: 12,
      avgTimeSpent: '6.2 hrs/week',
      topComplaints: [
        'Manual PDF data extraction takes forever (8 employees)',
        'Chasing approvals via email and Slack (6 employees)',
        'Excel copy-paste errors requiring rework (5 employees)'
      ],
      impactScore: 92,
      manualSteps: 6,
      totalSteps: 8,
      automationPotential: 85,
      potentialProductivityGain: '50% time reduction'
    },
    {
      process: 'Resume Screening',
      department: 'HR',
      employeesReporting: 4,
      totalEmployees: 8,
      avgTimeSpent: '8.5 hrs/week',
      topComplaints: [
        'Reading through hundreds of similar resumes (4 employees)',
        'Manual scoring in spreadsheets is inconsistent (3 employees)',
        'Difficulty identifying qualified candidates quickly (4 employees)'
      ],
      impactScore: 78,
      manualSteps: 11,
      totalSteps: 15,
      automationPotential: 65,
      potentialProductivityGain: '70% process acceleration'
    },
    {
      process: 'IT Support Tickets',
      department: 'IT',
      employeesReporting: 12,
      totalEmployees: 18,
      avgTimeSpent: '3.2 hrs/week',
      topComplaints: [
        'Same questions asked repeatedly via different channels (10 employees)',
        'Manual ticket categorization and routing (8 employees)',
        'Knowledge base search is ineffective (7 employees)'
      ],
      impactScore: 71,
      manualSteps: 4,
      totalSteps: 6,
      automationPotential: 90,
      potentialProductivityGain: '45% efficiency boost'
    }
  ]

  // Workflow audit data - all identified processes
  const workflowAudit = [
    {
      id: 1,
      workflow: 'Customer Onboarding',
      department: 'Sales',
      frequency: 'Daily',
      employeesInvolved: 23,
      avgTimePerTask: '4.5 hours',
      automationPotential: 75,
      aiOpportunity: 'High',
      currentTools: ['CRM', 'Email', 'Manual forms'],
      painLevel: 'High',
      priority: 1
    },
    {
      id: 2,
      workflow: 'Invoice Processing',
      department: 'Finance',
      frequency: 'Daily',
      employeesInvolved: 8,
      avgTimePerTask: '6.2 hours',
      automationPotential: 85,
      aiOpportunity: 'High',
      currentTools: ['Excel', 'PDF readers', 'Email'],
      painLevel: 'High',
      priority: 2
    },
    {
      id: 3,
      workflow: 'Resume Screening',
      department: 'HR',
      frequency: 'Weekly',
      employeesInvolved: 4,
      avgTimePerTask: '8.5 hours',
      automationPotential: 65,
      aiOpportunity: 'Medium',
      currentTools: ['Manual review', 'Spreadsheets'],
      painLevel: 'Medium',
      priority: 3
    },
    {
      id: 4,
      workflow: 'IT Support Tickets',
      department: 'IT',
      frequency: 'Daily',
      employeesInvolved: 12,
      avgTimePerTask: '3.2 hours',
      automationPotential: 90,
      aiOpportunity: 'High',
      currentTools: ['Help desk system', 'Knowledge base'],
      painLevel: 'Medium',
      priority: 4
    },
    {
      id: 5,
      workflow: 'Content Creation',
      department: 'Marketing',
      frequency: 'Weekly',
      employeesInvolved: 15,
      avgTimePerTask: '12 hours',
      automationPotential: 40,
      aiOpportunity: 'Medium',
      currentTools: ['Design tools', 'Writing software'],
      painLevel: 'Low',
      priority: 5
    },
    {
      id: 6,
      workflow: 'Data Entry & Reports',
      department: 'Operations',
      frequency: 'Daily',
      employeesInvolved: 28,
      avgTimePerTask: '5.5 hours',
      automationPotential: 80,
      aiOpportunity: 'High',
      currentTools: ['Excel', 'Database systems'],
      painLevel: 'Medium',
      priority: 6
    }
  ]

  // Enhanced AI use cases with tools and case studies
  const useCaseSolutions = [
    {
      id: 'uc-001',
      name: 'Customer Onboarding Automation',
      painPointAddress: 'Customer Onboarding',
      department: 'Sales',
      category: 'Process Automation',
      maturity: 'Moderate',
      description: 'Automated workflow connecting CRM, billing, and approval systems with AI-powered data validation',
      impact: 'High',
      effort: 'Medium',
      timeSavings: '3.5 hours/week per person',
      productivityGain: '60% faster processing',
      employeesImpacted: 23,
      implementationTime: '4-6 months',
      toolsNeeded: ['Zapier/Microsoft Power Automate', 'CRM API integration', 'DocuSign/HelloSign'],
      specificTools: [
        { name: 'Microsoft Power Automate', role: 'Workflow orchestration', cost: 'Enterprise plan' },
        { name: 'Zapier', role: 'System integrations', cost: '$240/month' },
        { name: 'DocuSign', role: 'Digital approvals', cost: '$25/user/month' }
      ],
      caseStudy: {
        company: 'TechFlow Solutions (SaaS, 250 employees)',
        challenge: 'Customer onboarding took 8-12 days across 6 different systems',
        solution: 'Implemented Power Automate to connect Salesforce, billing, and approval systems',
        results: ['Onboarding time: 8 days → 3 days', 'Manual errors: 15% → 2%', 'Sales team satisfaction: +40%'],
        timeline: '4 months implementation'
      },
      skills: ['Process mapping', 'Workflow configuration', 'Data validation'],
      successMetrics: ['Processing time -60%', 'Data entry errors -80%', 'Approval cycle -50%'],
      implementationSteps: [
        'Map current process across 5 systems',
        'Design unified workflow automation',
        'Implement approval chain automation',
        'Set up data validation rules',
        'Train sales team and deploy'
      ],
      businessValue: 'Eliminates duplicate data entry and approval bottlenecks while reducing onboarding time by 60%'
    },
    {
      id: 'uc-002',
      name: 'Intelligent Invoice Processing',
      painPointAddress: 'Invoice Processing',
      department: 'Finance',
      category: 'Document Processing',
      maturity: 'Quick Win',
      description: 'AI-powered PDF data extraction with automated approval routing and error validation',
      impact: 'High',
      effort: 'Low',
      timeSavings: '5 hours/week per person',
      productivityGain: '70% faster processing',
      employeesImpacted: 8,
      implementationTime: '2-3 months',
      toolsNeeded: ['OCR platform', 'ERP integration', 'Workflow automation'],
      skills: ['Document AI setup', 'Workflow configuration'],
      successMetrics: ['Processing time -70%', 'Error rate -85%', 'Approval cycle -50%'],
      implementationSteps: [
        'Configure OCR for invoice scanning',
        'Set up data validation rules',
        'Create automated approval workflows',
        'Test with sample invoices',
        'Full deployment to finance team'
      ],
      businessValue: 'Eliminates manual PDF processing and Excel errors while accelerating payment processing'
    },
    {
      id: 'uc-003',
      name: 'AI-Powered Resume Screening',
      painPointAddress: 'Resume Screening',
      department: 'HR',
      category: 'Talent Management',
      maturity: 'Advanced',
      description: 'Machine learning-based resume analysis with bias detection and candidate ranking',
      impact: 'High',
      effort: 'High',
      timeSavings: '6 hours/week per recruiter',
      productivityGain: '80% faster screening',
      employeesImpacted: 4,
      implementationTime: '6-9 months',
      toolsNeeded: ['AI screening platform', 'ATS integration', 'Bias detection tools'],
      skills: ['AI model training', 'Bias detection', 'Recruitment analytics'],
      successMetrics: ['Screening time -80%', 'Candidate quality +25%', 'Hiring bias -60%'],
      implementationSteps: [
        'Define job requirement criteria',
        'Train AI model on historical hires',
        'Implement bias detection checks',
        'Integrate with existing ATS',
        'Train recruiters and monitor results'
      ],
      businessValue: 'Accelerates candidate identification while reducing unconscious bias and improving hire quality'
    },
    {
      id: 'uc-004',
      name: 'Intelligent IT Support Assistant',
      painPointAddress: 'IT Support Tickets',
      department: 'IT',
      category: 'Customer Service',
      maturity: 'Quick Win',
      description: 'AI chatbot for common questions with automated ticket routing and knowledge base integration',
      impact: 'Medium',
      effort: 'Low',
      timeSavings: '2.5 hours/week per person',
      productivityGain: '50% faster resolution',
      employeesImpacted: 12,
      implementationTime: '3-4 months',
      toolsNeeded: ['Chatbot platform', 'Knowledge base integration', 'Ticket routing system'],
      skills: ['Chatbot configuration', 'Knowledge management'],
      successMetrics: ['Ticket volume -40%', 'Resolution time -50%', 'Employee satisfaction +30%'],
      implementationSteps: [
        'Analyze common support questions',
        'Set up AI chatbot with knowledge base',
        'Create automated routing rules',
        'Test with pilot group',
        'Deploy to full organization'
      ],
      businessValue: 'Reduces repetitive support requests while improving response time and employee satisfaction'
    }
  ]

  // Additional high-impact use cases from employee suggestions
  const additionalUseCases = [
    {
      id: 'uc-005',
      name: 'Meeting Summary Assistant',
      department: 'All',
      category: 'Productivity',
      maturity: 'Quick Win',
      description: 'Auto-transcribe meetings, generate summaries, and track action items',
      impact: 'Medium',
      effort: 'Low',
      timeSavings: '1.5 hours/week per person',
      productivityGain: '90% less note-taking time',
      employeesImpacted: 156,
      implementationTime: '2-4 weeks',
      suggestedBy: 34,
      employeeQuote: '"Taking notes during meetings means I miss half the conversation"'
    },
    {
      id: 'uc-006',
      name: 'Email Classification System',
      department: 'Sales',
      category: 'Communication',
      maturity: 'Quick Win',
      description: 'Intelligent email sorting and routing for customer inquiries',
      impact: 'High',
      effort: 'Low',
      timeSavings: '2 hours/week per person',
      productivityGain: '75% faster email processing',
      employeesImpacted: 35,
      implementationTime: '4-6 weeks',
      suggestedBy: 28,
      employeeQuote: '"I spend 1+ hour daily just sorting and forwarding emails to the right team"'
    },
    {
      id: 'uc-007',
      name: 'Expense Report Automation',
      department: 'All',
      category: 'Finance',
      maturity: 'Moderate',
      description: 'Photo-to-expense entry with auto-categorization',
      impact: 'Medium',
      effort: 'Medium',
      timeSavings: '2 hours/month per person',
      productivityGain: '85% less manual entry',
      employeesImpacted: 89,
      implementationTime: '6-8 weeks',
      suggestedBy: 19,
      employeeQuote: '"Monthly expense reports take me 2+ hours of tedious data entry"'
    }
  ]

  // Combined prioritization matrix
  const matrixOpportunities = [
    ...useCaseSolutions.map(uc => ({
      id: uc.id,
      name: uc.name,
      department: uc.department,
      value: uc.impact === 'High' ? 85 : uc.impact === 'Medium' ? 70 : 55,
      effort: uc.effort === 'Low' ? 25 : uc.effort === 'Medium' ? 45 : 70,
      employeesImpacted: uc.employeesImpacted,
      timeToImplement: uc.implementationTime,
      productivityGain: uc.productivityGain,
      description: uc.description,
      type: 'pain-point-solution'
    })),
    {
      id: 'uc-005',
      name: 'Meeting Summaries',
      department: 'All',
      value: 75,
      effort: 20,
      employeesImpacted: 156,
      timeToImplement: '2-4 weeks',
      productivityGain: '90% less note-taking time',
      description: 'AI-generated meeting notes and action items',
      type: 'employee-suggestion'
    },
    {
      id: 'uc-006',
      name: 'Email Classification',
      department: 'Sales',
      value: 80,
      effort: 25,
      employeesImpacted: 35,
      timeToImplement: '4-6 weeks',
      productivityGain: '75% faster email processing',
      description: 'Intelligent email sorting and routing',
      type: 'employee-suggestion'
    }
  ]

  // Implementation phases
  const implementationPhases = [
    {
      phase: 'Phase 1: Quick Wins (0-3 months)',
      focus: 'High employee demand, easy implementation',
      totalHoursSaved: 425,
      employeesImpacted: 235,
      totalProductivityGain: '65% avg efficiency boost',
      initiatives: [
        { name: 'Meeting Summary Assistant', timeline: '4 weeks', effort: 'Low', productivityGain: '90% less note-taking time' },
        { name: 'Email Classification', timeline: '6 weeks', effort: 'Low', productivityGain: '75% faster email processing' },
        { name: 'IT Support Assistant', timeline: '8 weeks', effort: 'Low', productivityGain: '50% faster resolution' }
      ]
    },
    {
      phase: 'Phase 2: Process Automation (3-9 months)',
      focus: 'Address highest pain point processes',
      totalHoursSaved: 121,
      employeesImpacted: 31,
      totalProductivityGain: '65% process acceleration',
      initiatives: [
        { name: 'Invoice Processing', timeline: '12 weeks', effort: 'Medium', productivityGain: '70% faster processing' },
        { name: 'Customer Onboarding', timeline: '16 weeks', effort: 'Medium', productivityGain: '60% faster processing' }
      ]
    },
    {
      phase: 'Phase 3: Advanced Solutions (9+ months)',
      focus: 'Complex but high-value automation',
      totalHoursSaved: 202,
      employeesImpacted: 93,
      totalProductivityGain: '70% automation rate',
      initiatives: [
        { name: 'Resume Screening AI', timeline: '20 weeks', effort: 'High', productivityGain: '80% faster screening' },
        { name: 'Expense Automation', timeline: '16 weeks', effort: 'Medium', productivityGain: '85% less manual entry' }
      ]
    }
  ]

  const getQuadrant = (value: number, effort: number) => {
    if (value >= 75 && effort <= 35) return 'quick-wins'
    if (value >= 75 && effort > 35) return 'major-projects'
    if (value < 75 && effort <= 35) return 'fill-ins'
    return 'low-priority'
  }

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'quick-wins': return '#22c55e'
      case 'major-projects': return '#3b82f6'
      case 'fill-ins': return '#f59e0b'
      case 'low-priority': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'Quick Win': return 'success'
      case 'Moderate': return 'warning'
      case 'Advanced': return 'info'
      default: return 'default'
    }
  }

  const filteredUseCases = useCaseSolutions.filter(useCase => {
    const deptMatch = selectedDepartment === 'all' || useCase.department === selectedDepartment
    const maturityMatch = selectedMaturity === 'all' || useCase.maturity === selectedMaturity
    return deptMatch && maturityMatch
  })

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Transformation</h1>
        <p className="text-gray-600 mt-2">
          Transforming 32% automatable work into productivity gains through employee-identified AI use cases
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-sm text-gray-600">Pain Points Identified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-600">AI Use Cases Identified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,250</div>
            <p className="text-sm text-gray-600">Hours/Week Productivity Gain</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">32%</div>
            <p className="text-sm text-gray-600">Work Automatable</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="py-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('workflow-audit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'workflow-audit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Workflow Audit
            </button>
            <button
              onClick={() => setActiveTab('pain-points')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pain-points'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Pain Points
            </button>
            <button
              onClick={() => setActiveTab('implementation')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'implementation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Implementation
            </button>
            <button
              onClick={() => setActiveTab('prioritization')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'prioritization'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Prioritization
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Audit Tab */}
      {activeTab === 'workflow-audit' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                Workflow Audit & Automation Potential
              </CardTitle>
              <p className="text-sm text-gray-600">Comprehensive analysis of all identified processes and their AI/automation opportunities</p>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="flex space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Department</label>
                  <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Departments</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Automation Potential</label>
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="all">All Levels</option>
                    <option value="high">High (80%+)</option>
                    <option value="medium">Medium (60-79%)</option>
                    <option value="low">Low (&lt;60%)</option>
                  </select>
                </div>
              </div>

              {/* Workflow Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Automation Potential</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Opportunity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current State</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workflowAudit
                      .filter(workflow => selectedDepartment === 'all' || workflow.department === selectedDepartment)
                      .map((workflow) => (
                      <tr key={workflow.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{workflow.workflow}</div>
                            <div className="text-sm text-gray-500">{workflow.frequency} • {workflow.avgTimePerTask}/task</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info" size="sm">{workflow.department}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{workflow.employeesInvolved} employees</div>
                          <div className="text-xs text-gray-500">Pain level: {workflow.painLevel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full ${
                                  workflow.automationPotential >= 80 ? 'bg-green-500' :
                                  workflow.automationPotential >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${workflow.automationPotential}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{workflow.automationPotential}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={workflow.aiOpportunity === 'High' ? 'success' : workflow.aiOpportunity === 'Medium' ? 'warning' : 'danger'}
                            size="sm"
                          >
                            {workflow.aiOpportunity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {workflow.currentTools.slice(0, 2).join(', ')}
                            {workflow.currentTools.length > 2 && '...'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">32%</div>
                  <p className="text-sm text-gray-600">Avg Automation Potential</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{workflowAudit.filter(w => w.aiOpportunity === 'High').length}</div>
                  <p className="text-sm text-gray-600">High AI Opportunity</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{workflowAudit.reduce((sum, w) => sum + w.employeesInvolved, 0)}</div>
                  <p className="text-sm text-gray-600">Total Employees Affected</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{workflowAudit.filter(w => w.painLevel === 'High').length}</div>
                  <p className="text-sm text-gray-600">High-Pain Processes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pain Points Tab */}
      {activeTab === 'pain-points' && (
        <div className="space-y-8">
          {/* Automation Potential Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 text-purple-600 mr-2" />
                Automation Potential Analysis
              </CardTitle>
              <p className="text-sm text-gray-600">How we identified 32% of work as automatable</p>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">32%</div>
                    <p className="text-sm text-gray-600">Avg Automation Potential</p>
                    <p className="text-xs text-purple-700 mt-1">Across all workflows</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">79%</div>
                    <p className="text-sm text-gray-600">Manual Steps Ratio</p>
                    <p className="text-xs text-purple-700 mt-1">Average across processes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">47</div>
                    <p className="text-sm text-gray-600">Total Pain Points</p>
                    <p className="text-xs text-purple-700 mt-1">From employee feedback</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Automation Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <h5 className="font-medium text-green-800 mb-2">High Automation (80%+)</h5>
                    <p className="text-sm text-green-700">IT support tickets, email classification, basic data entry</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h5 className="font-medium text-yellow-800 mb-2">Medium Automation (60-80%)</h5>
                    <p className="text-sm text-yellow-700">Customer onboarding, resume screening, invoice processing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                Biggest Process Pain Points
              </CardTitle>
              <p className="text-sm text-gray-600">Based on employee assessment responses and workflow analysis</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {processPainPoints.map((painPoint, index) => (
                  <div key={index} className="p-6 border-2 border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{painPoint.process}</h3>
                          <div className="flex items-center space-x-4">
                            <Badge variant="warning">{painPoint.department}</Badge>
                            <Badge variant="danger">Impact: {painPoint.impactScore}%</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{painPoint.employeesReporting} of {painPoint.totalEmployees} affected</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{painPoint.avgTimeSpent}</span>
                          </div>
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 mr-1" />
                            <span>{painPoint.manualSteps} manual steps</span>
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>{painPoint.automationPotential}% automatable</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <CircularProgress 
                          value={Math.round((painPoint.employeesReporting / painPoint.totalEmployees) * 100)} 
                          size="sm" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Top Employee Complaints:</h4>
                      <div className="space-y-2">
                        {painPoint.topComplaints.map((complaint, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{complaint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="text-sm">
                        <span className="font-medium text-green-800">Automation Potential: </span>
                        <span className="text-green-700">{painPoint.potentialProductivityGain} productivity improvement</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Solutions Tab */}
      {activeTab === 'implementation' && (
        <div className="space-y-8">
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Department:</span>
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Maturity:</span>
                  <select 
                    value={selectedMaturity}
                    onChange={(e) => setSelectedMaturity(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="Quick Win">Quick Win</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pain-Point Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 text-blue-600 mr-2" />
                Implementation Solutions & Tools
              </CardTitle>
              <p className="text-sm text-gray-600">Action-driven AI implementations with specific tools, case studies, and integration approaches</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredUseCases.map((useCase, index) => (
                  <div key={index} className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{useCase.name}</h3>
                          <div className="flex space-x-2">
                            <Badge variant={getMaturityColor(useCase.maturity)} size="sm">
                              {useCase.maturity}
                            </Badge>
                            <Badge variant="info" size="sm">{useCase.department}</Badge>
                          </div>
                        </div>
                        <div className="mb-3 p-3 bg-white border-l-4 border-blue-400 rounded">
                          <span className="text-sm font-medium text-blue-700">Addresses: {useCase.painPointAddress}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{useCase.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Time Savings</div>
                          <div className="text-sm text-gray-600">{useCase.timeSavings}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Productivity Gain</div>
                          <div className="text-sm text-gray-600">{useCase.productivityGain}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-purple-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">People Impacted</div>
                          <div className="text-sm text-gray-600">{useCase.employeesImpacted} employees</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-orange-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Implementation Time</div>
                          <div className="text-sm text-gray-600">{useCase.implementationTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-blue-200 pt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Implementation Steps</h4>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {useCase.implementationSteps.slice(0, 3).map((step, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-blue-500 mr-2 font-medium">{idx + 1}.</span>
                                {step}
                              </li>
                            ))}
                            {useCase.implementationSteps.length > 3 && (
                              <li className="text-blue-600 font-medium">
                                + {useCase.implementationSteps.length - 3} more steps
                              </li>
                            )}
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Success Metrics</h4>
                          <div className="space-y-1">
                            {useCase.successMetrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                                <span className="text-gray-600">{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Business Value</h4>
                          <div className="text-sm text-gray-600">
                            {useCase.businessValue}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Employee-Suggested Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                Additional AI Use Cases from Employee Suggestions
              </CardTitle>
              <p className="text-sm text-gray-600">Most requested AI use cases from assessment responses</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {additionalUseCases.map((suggestion, index) => (
                  <div key={index} className="p-5 border border-green-200 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{suggestion.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                    
                    <div className="mb-3 p-3 bg-white border-l-4 border-green-400 rounded">
                      <p className="text-sm italic text-gray-600">{suggestion.employeeQuote}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Suggested by</span>
                        <div className="font-medium text-green-600">{suggestion.suggestedBy} employees</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Productivity</span>
                        <div className="font-medium text-gray-900">{suggestion.productivityGain}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="success" size="sm">{suggestion.maturity}</Badge>
                      <span className="text-xs text-gray-500">{suggestion.implementationTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Prioritization Tab */}
      {activeTab === 'prioritization' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 text-purple-600 mr-2" />
              Opportunity Prioritization Matrix
            </CardTitle>
            <p className="text-sm text-gray-600">Value vs Effort analysis for strategic prioritization (bubble size = employee impact)</p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden mb-6">
              {/* Grid lines and labels */}
              <div className="absolute inset-0">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                  Business Value →
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
                  Implementation Effort →
                </div>
                
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
                
                <div className="absolute top-4 left-4 text-xs font-semibold text-green-600">
                  Quick Wins<br/>
                  <span className="font-normal text-gray-500">High Value, Low Effort</span>
                </div>
                <div className="absolute top-4 right-4 text-xs font-semibold text-blue-600">
                  Major Projects<br/>
                  <span className="font-normal text-gray-500">High Value, High Effort</span>
                </div>
                <div className="absolute bottom-16 left-4 text-xs font-semibold text-yellow-600">
                  Fill-ins<br/>
                  <span className="font-normal text-gray-500">Low Value, Low Effort</span>
                </div>
                <div className="absolute bottom-16 right-4 text-xs font-semibold text-gray-600">
                  Questionable<br/>
                  <span className="font-normal text-gray-500">Low Value, High Effort</span>
                </div>
              </div>

              <div className="absolute inset-8">
                {matrixOpportunities.map((opportunity) => {
                  const x = (opportunity.effort / 100) * 100
                  const y = ((100 - opportunity.value) / 100) * 100
                  const size = Math.max(12, Math.min(40, opportunity.employeesImpacted / 4))
                  const quadrant = getQuadrant(opportunity.value, opportunity.effort)
                  
                  return (
                    <div
                      key={opportunity.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                      title={`${opportunity.name}\nValue: ${opportunity.value}% | Effort: ${opportunity.effort}%\n${opportunity.employeesImpacted} employees impacted\n${opportunity.productivityGain || 'Productivity improvement'}`}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-xs font-medium text-white shadow-lg border-2 border-white"
                        style={{ backgroundColor: getQuadrantColor(quadrant) }}
                      >
                        {opportunity.name.substring(0, 2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Quick Wins (Implement First)
                </h4>
                <div className="space-y-3">
                  {matrixOpportunities
                    .filter(op => getQuadrant(op.value, op.effort) === 'quick-wins')
                    .map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{opportunity.name}</h5>
                          <Badge variant="success" size="sm">{opportunity.timeToImplement}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Value</span>
                            <div className="font-medium text-green-600">{opportunity.value}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Productivity Boost</span>
                            <div className="font-medium text-gray-900">
                              {opportunity.productivityGain}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Impact</span>
                            <div className="font-medium text-gray-900">{opportunity.employeesImpacted} people</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Major Projects (Plan for Later)
                </h4>
                <div className="space-y-3">
                  {matrixOpportunities
                    .filter(op => getQuadrant(op.value, op.effort) === 'major-projects')
                    .map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{opportunity.name}</h5>
                          <Badge variant="info" size="sm">{opportunity.timeToImplement}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Value</span>
                            <div className="font-medium text-blue-600">{opportunity.value}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Productivity Boost</span>
                            <div className="font-medium text-gray-900">
                              {opportunity.productivityGain}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Impact</span>
                            <div className="font-medium text-gray-900">{opportunity.employeesImpacted} people</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}