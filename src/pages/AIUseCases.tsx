import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Zap, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  TrendingUp,
  Building2,
  MessageSquare,
  FileText,
  BarChart3,
  Shield,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react'

export function AIUseCases() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedMaturity, setSelectedMaturity] = useState('all')
  
  const useCases = [
    {
      id: 'uc-001',
      name: 'Intelligent Email Management',
      department: 'Sales',
      category: 'Communication',
      maturity: 'Quick Win',
      description: 'AI-powered email classification, prioritization, and auto-responses for customer inquiries',
      impact: 'High',
      effort: 'Low',
      timeSavings: '2-3 hours/week per person',
      costSavings: '$45K annually',
      employeesImpacted: 45,
      roiTimeframe: '2 months',
      toolsNeeded: ['Email AI platform', 'CRM integration'],
      skills: ['Basic AI prompting', 'Email workflow setup'],
      successMetrics: ['Response time -60%', 'Email processing +75% faster', 'Customer satisfaction +15%'],
      implementationSteps: [
        'Set up email AI classification',
        'Train on historical email data',
        'Create response templates',
        'Deploy to pilot group',
        'Scale across sales team'
      ],
      businessValue: 'Dramatically reduces email management overhead while improving customer response quality'
    },
    {
      id: 'uc-002',
      name: 'Automated Invoice Processing',
      department: 'Finance',
      category: 'Document Processing',
      maturity: 'Quick Win',
      description: 'Extract data from invoices, validate against purchase orders, and route for approval',
      impact: 'High',
      effort: 'Medium',
      timeSavings: '6-8 hours/week per person',
      costSavings: '$125K annually',
      employeesImpacted: 12,
      roiTimeframe: '3 months',
      toolsNeeded: ['OCR platform', 'ERP integration', 'Workflow automation'],
      skills: ['Document AI setup', 'Workflow configuration'],
      successMetrics: ['Processing time -70%', 'Error rate -85%', 'Approval cycle -50%'],
      implementationSteps: [
        'Configure OCR for invoice scanning',
        'Set up data validation rules',
        'Create approval workflows',
        'Test with sample invoices',
        'Full deployment'
      ],
      businessValue: 'Eliminates manual data entry errors and accelerates payment processing'
    },
    {
      id: 'uc-003',
      name: 'AI-Powered Resume Screening',
      department: 'HR',
      category: 'Talent Management',
      maturity: 'Moderate',
      description: 'Automatically screen resumes against job requirements and rank candidates',
      impact: 'High',
      effort: 'Medium',
      timeSavings: '8-12 hours/week per recruiter',
      costSavings: '$90K annually',
      employeesImpacted: 8,
      roiTimeframe: '4 months',
      toolsNeeded: ['AI screening platform', 'ATS integration'],
      skills: ['AI model training', 'Bias detection'],
      successMetrics: ['Screening time -80%', 'Candidate quality +25%', 'Time to hire -30%'],
      implementationSteps: [
        'Define job requirement criteria',
        'Train AI model on historical hires',
        'Set up bias detection checks',
        'Pilot with current openings',
        'Refine and scale'
      ],
      businessValue: 'Accelerates hiring while reducing unconscious bias in candidate selection'
    },
    {
      id: 'uc-004',
      name: 'Intelligent Meeting Assistant',
      department: 'All',
      category: 'Productivity',
      maturity: 'Quick Win',
      description: 'Auto-transcribe meetings, generate summaries, and track action items',
      impact: 'Medium',
      effort: 'Low',
      timeSavings: '1-2 hours/week per person',
      costSavings: '$180K annually',
      employeesImpacted: 156,
      roiTimeframe: '1 month',
      toolsNeeded: ['Meeting transcription service', 'Calendar integration'],
      skills: ['Meeting setup', 'Summary review'],
      successMetrics: ['Note-taking time -90%', 'Action item tracking +100%', 'Follow-up rate +40%'],
      implementationSteps: [
        'Set up transcription service',
        'Create summary templates',
        'Train teams on usage',
        'Integrate with project tools',
        'Monitor and optimize'
      ],
      businessValue: 'Ensures no meeting insights are lost while freeing attendees to focus on discussion'
    },
    {
      id: 'uc-005',
      name: 'Predictive Customer Analytics',
      department: 'Marketing',
      category: 'Analytics',
      maturity: 'Advanced',
      description: 'Predict customer behavior, churn risk, and personalize marketing campaigns',
      impact: 'High',
      effort: 'High',
      timeSavings: '4-6 hours/week per analyst',
      costSavings: '$250K annually',
      employeesImpacted: 15,
      roiTimeframe: '8 months',
      toolsNeeded: ['ML platform', 'Customer data platform', 'Analytics tools'],
      skills: ['Data science', 'ML model management', 'Business intelligence'],
      successMetrics: ['Prediction accuracy 85%+', 'Campaign ROI +35%', 'Churn reduction -20%'],
      implementationSteps: [
        'Consolidate customer data sources',
        'Build predictive models',
        'Create dashboard interfaces',
        'Train marketing team',
        'Implement feedback loops'
      ],
      businessValue: 'Enables data-driven marketing decisions with predictive insights for competitive advantage'
    },
    {
      id: 'uc-006',
      name: 'Automated Report Generation',
      department: 'Operations',
      category: 'Reporting',
      maturity: 'Moderate',
      description: 'Generate daily, weekly, and monthly operational reports with AI insights',
      impact: 'Medium',
      effort: 'Medium',
      timeSavings: '5-8 hours/week per team',
      costSavings: '$95K annually',
      employeesImpacted: 24,
      roiTimeframe: '5 months',
      toolsNeeded: ['BI platform', 'Data connectors', 'Report automation'],
      skills: ['Report design', 'Data visualization', 'Automated insights'],
      successMetrics: ['Report generation time -85%', 'Data accuracy +99%', 'Insight depth +200%'],
      implementationSteps: [
        'Map existing report requirements',
        'Set up automated data pipelines',
        'Design interactive dashboards',
        'Add AI-generated insights',
        'Deploy and train users'
      ],
      businessValue: 'Provides real-time operational visibility with AI-generated insights for proactive decision-making'
    }
  ]

  const departmentStats = [
    { dept: 'Sales', useCases: 8, quickWins: 3, avgROI: '3.2x', topUseCase: 'Email Management' },
    { dept: 'Finance', useCases: 6, quickWins: 2, avgROI: '4.1x', topUseCase: 'Invoice Processing' },
    { dept: 'HR', useCases: 5, quickWins: 1, avgROI: '2.8x', topUseCase: 'Resume Screening' },
    { dept: 'Marketing', useCases: 7, quickWins: 2, avgROI: '3.5x', topUseCase: 'Content Generation' },
    { dept: 'Operations', useCases: 4, quickWins: 2, avgROI: '3.8x', topUseCase: 'Process Automation' },
    { dept: 'IT', useCases: 3, quickWins: 1, avgROI: '2.9x', topUseCase: 'Automated Monitoring' }
  ]

  const categories = [
    { name: 'Communication', count: 12, avgImpact: 'High', icon: MessageSquare },
    { name: 'Document Processing', count: 8, avgImpact: 'High', icon: FileText },
    { name: 'Analytics', count: 6, avgImpact: 'Medium', icon: BarChart3 },
    { name: 'Productivity', count: 15, avgImpact: 'Medium', icon: Zap },
    { name: 'Security', count: 4, avgImpact: 'High', icon: Shield },
    { name: 'Customer Service', count: 9, avgImpact: 'High', icon: Users }
  ]

  const filteredUseCases = useCases.filter(useCase => {
    const deptMatch = selectedDepartment === 'all' || useCase.department === selectedDepartment || useCase.department === 'All'
    const maturityMatch = selectedMaturity === 'all' || useCase.maturity === selectedMaturity
    return deptMatch && maturityMatch
  })

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'Quick Win': return 'success'
      case 'Moderate': return 'warning'
      case 'Advanced': return 'info'
      default: return 'default'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'success'
      case 'Medium': return 'warning'
      case 'Low': return 'default'
      default: return 'default'
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Use Cases</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive library of AI applications tailored to your organization's workflows and priorities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <Lightbulb className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">33</div>
            <p className="text-sm text-gray-600">Total Use Cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">11</div>
            <p className="text-sm text-gray-600">Quick Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">$785K</div>
            <p className="text-sm text-gray-600">Annual Savings Potential</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">3.4x</div>
            <p className="text-sm text-gray-600">Average ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Use Case Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Use Case Categories
          </CardTitle>
          <p className="text-sm text-gray-600">AI applications organized by business function</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.count} use cases</p>
                    </div>
                  </div>
                  <Badge variant={getImpactColor(category.avgImpact)} size="sm">
                    {category.avgImpact} Impact
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 text-purple-600 mr-2" />
            Department AI Opportunities
          </CardTitle>
          <p className="text-sm text-gray-600">Use case potential and ROI by department</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{dept.dept}</h4>
                  <Badge variant="info" size="sm">{dept.avgROI} ROI</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Use Cases</span>
                    <div className="font-medium text-gray-900">{dept.useCases}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Quick Wins</span>
                    <div className="font-medium text-green-600">{dept.quickWins}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Top Opportunity:</strong> {dept.topUseCase}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
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

      {/* Use Cases Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 text-green-600 mr-2" />
            AI Use Cases Library
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed implementation guides for each use case</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredUseCases.map((useCase, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{useCase.name}</h3>
                      <div className="flex space-x-2">
                        <Badge variant={getMaturityColor(useCase.maturity)} size="sm">
                          {useCase.maturity}
                        </Badge>
                        <Badge variant={getImpactColor(useCase.impact)} size="sm">
                          {useCase.impact} Impact
                        </Badge>
                        <Badge variant="info" size="sm">{useCase.department}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{useCase.description}</p>
                  </div>
                  <button className="ml-4 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
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
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Cost Savings</div>
                      <div className="text-sm text-gray-600">{useCase.costSavings}</div>
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
                    <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">ROI Timeframe</div>
                      <div className="text-sm text-gray-600">{useCase.roiTimeframe}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
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
                      <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {useCase.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Business Value:</strong> {useCase.businessValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}