import React from 'react'
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
  Workflow
} from 'lucide-react'

export function AutomationPipeline() {
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
      impactScore: 85
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
      impactScore: 92
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
      impactScore: 78
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
      impactScore: 71
    }
  ]

  // Employee-suggested automation opportunities
  const employeeSuggestions = [
    {
      opportunity: 'Automated Email Classification',
      suggestedBy: 28,
      departments: ['Sales', 'Customer Success', 'Marketing'],
      description: 'Auto-sort and route emails to right person/queue',
      employeeQuote: '"I spend 1+ hour daily just sorting and forwarding emails to the right team"',
      estimatedSavings: '2-3 hrs/week per person',
      feasibility: 'High',
      timeline: '4-6 weeks'
    },
    {
      opportunity: 'Meeting Summary Generation',
      suggestedBy: 34,
      departments: ['All'],
      description: 'AI-generated meeting notes and action items',
      employeeQuote: '"Taking notes during meetings means I miss half the conversation"',
      estimatedSavings: '1-2 hrs/week per person',
      feasibility: 'High', 
      timeline: '3-4 weeks'
    },
    {
      opportunity: 'Expense Report Automation',
      suggestedBy: 19,
      departments: ['All'],
      description: 'Photo-to-expense entry with auto-categorization',
      employeeQuote: '"Monthly expense reports take me 2+ hours of tedious data entry"',
      estimatedSavings: '2 hrs/month per person',
      feasibility: 'Medium',
      timeline: '6-8 weeks'
    },
    {
      opportunity: 'Document Template Generation',
      suggestedBy: 15,
      departments: ['Legal', 'Sales', 'HR'],
      description: 'AI-assisted contract and proposal creation',
      employeeQuote: '"Creating proposals from scratch is 80% copy-paste from old ones"',
      estimatedSavings: '4-5 hrs/week per person',
      feasibility: 'Medium',
      timeline: '8-10 weeks'
    }
  ]

  // Implementation roadmap prioritized by employee impact
  const implementationPhases = [
    {
      phase: 'Phase 1: Quick Wins (Next 30 days)',
      focus: 'High employee demand, easy implementation',
      initiatives: [
        {
          name: 'Meeting Summary Tool',
          employees: 34,
          departments: 6,
          timeline: '3-4 weeks',
          effort: 'Low'
        },
        {
          name: 'Email Classification',
          employees: 28,
          departments: 3, 
          timeline: '4-6 weeks',
          effort: 'Low'
        }
      ]
    },
    {
      phase: 'Phase 2: Process Automation (30-90 days)',
      focus: 'Address highest pain point processes',
      initiatives: [
        {
          name: 'Invoice Processing Automation',
          employees: 8,
          departments: 1,
          timeline: '6-8 weeks',
          effort: 'Medium'
        },
        {
          name: 'Customer Onboarding Workflow',
          employees: 23,
          departments: 2,
          timeline: '8-10 weeks',
          effort: 'Medium'
        }
      ]
    },
    {
      phase: 'Phase 3: Advanced Solutions (90+ days)',
      focus: 'Complex but high-value automation',
      initiatives: [
        {
          name: 'Resume Screening AI',
          employees: 4,
          departments: 1,
          timeline: '10-12 weeks',
          effort: 'High'
        },
        {
          name: 'Document Generation Suite',
          employees: 15,
          departments: 3,
          timeline: '12-16 weeks',
          effort: 'High'
        }
      ]
    }
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Automation Pipeline</h1>
        <p className="text-gray-600 mt-2">
          AI implementation plan based on employee assessment responses and workflow analysis
        </p>
        <div className="flex items-center mt-3 text-sm text-blue-600">
          <FileText className="w-4 h-4 mr-1" />
          Based on 1,247 employee assessment responses across 6 departments
        </div>
      </div>

      {/* Assessment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-sm text-gray-600">Processes Identified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">823</div>
            <p className="text-sm text-gray-600">Pain Points Reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-sm text-gray-600">Automation Suggestions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">1,250</div>
            <p className="text-sm text-gray-600">Hrs/Week Can Be Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Process Pain Points from Employee Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            Biggest Process Pain Points
          </CardTitle>
          <p className="text-sm text-gray-600">Based on employee assessment responses and time tracking</p>
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
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <span><Users className="w-4 h-4 inline mr-1" />{painPoint.employeesReporting} of {painPoint.totalEmployees} employees reporting issues</span>
                      <span><Clock className="w-4 h-4 inline mr-1" />Avg. {painPoint.avgTimeSpent} per person</span>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee-Suggested Automation Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            Employee-Suggested Automation Opportunities
          </CardTitle>
          <p className="text-sm text-gray-600">Most requested automation ideas from assessment responses</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {employeeSuggestions.map((suggestion, index) => (
              <div key={index} className="p-5 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{suggestion.opportunity}</h3>
                  <div className="flex space-x-2">
                    <Badge variant={suggestion.feasibility === 'High' ? 'success' : 'warning'} size="sm">
                      {suggestion.feasibility}
                    </Badge>
                    <Badge variant="info" size="sm">{suggestion.timeline}</Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                
                <div className="mb-3 p-3 bg-white border-l-4 border-blue-400 rounded">
                  <p className="text-sm italic text-gray-600">{suggestion.employeeQuote}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Suggested by</span>
                    <div className="font-medium text-blue-600">{suggestion.suggestedBy} employees</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Savings</span>
                    <div className="font-medium text-green-600">{suggestion.estimatedSavings}</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">Departments: </span>
                  <span className="text-sm text-gray-700">{suggestion.departments.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Expected Outcomes Based on Employee Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            Expected Outcomes
          </CardTitle>
          <p className="text-sm text-gray-600">Projected impact based on employee time estimates and pain point severity</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">40%</div>
              <p className="text-sm text-gray-600">Time Savings</p>
              <p className="text-xs text-gray-500 mt-1">From employee estimates</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">278</div>
              <p className="text-sm text-gray-600">Employees Impacted</p>
              <p className="text-xs text-gray-500 mt-1">Across all phases</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg">
              <Workflow className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <p className="text-sm text-gray-600">Processes Automated</p>
              <p className="text-xs text-gray-500 mt-1">Top pain points addressed</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <p className="text-sm text-gray-600">Employee Satisfaction</p>
              <p className="text-xs text-gray-500 mt-1">Expected improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 text-green-600 mr-2" />
            Implementation Roadmap
          </CardTitle>
          <p className="text-sm text-gray-600">Employee-prioritized automation timeline with quick wins first</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {implementationPhases.map((phase, index) => (
              <div key={index} className="relative">
                {/* Phase Header */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{phase.phase}</h3>
                    <p className="text-sm text-gray-600">{phase.focus}</p>
                  </div>
                </div>

                {/* Initiatives */}
                <div className="ml-12 space-y-4">
                  {phase.initiatives.map((initiative, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 border-l-4 border-green-400 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{initiative.name}</h4>
                        <div className="flex space-x-2">
                          <Badge variant={
                            initiative.effort === 'Low' ? 'success' : 
                            initiative.effort === 'Medium' ? 'warning' : 'danger'
                          } size="sm">
                            {initiative.effort} Effort
                          </Badge>
                          <Badge variant="info" size="sm">{initiative.timeline}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {initiative.employees} employees affected
                        </span>
                        <span className="flex items-center">
                          <Workflow className="w-4 h-4 mr-1" />
                          {initiative.departments} departments
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connecting Line */}
                {index < implementationPhases.length - 1 && (
                  <div className="absolute left-4 top-16 w-px h-8 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment & Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              Investment Requirements
            </CardTitle>
            <p className="text-sm text-gray-600">Resource allocation for automation pipeline</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  category: 'Technology & Tools',
                  amount: 125000,
                  breakdown: ['AI platform licenses ($45K)', 'Integration tools ($35K)', 'Training platforms ($25K)', 'Infrastructure ($20K)'],
                  timeline: 'Months 1-3'
                },
                {
                  category: 'Professional Services',
                  amount: 180000,
                  breakdown: ['Implementation consultants ($90K)', 'Training & change management ($50K)', 'System integration ($40K)'],
                  timeline: 'Months 1-6'
                },
                {
                  category: 'Internal Resources',
                  amount: 95000,
                  breakdown: ['Project management (0.5 FTE)', 'Technical lead (0.3 FTE)', 'Change champions (0.2 FTE)'],
                  timeline: 'Months 1-9'
                }
              ].map((investment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{investment.category}</h4>
                    <div className="text-lg font-bold text-blue-600">${investment.amount.toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Timeline:</strong> {investment.timeline}
                  </div>
                  <div className="space-y-1">
                    {investment.breakdown.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-500 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              ROI Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">Return on investment projections</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* ROI Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">$850K</div>
                  <p className="text-sm text-gray-600">Annual Savings</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">18 months</div>
                  <p className="text-sm text-gray-600">Payback Period</p>
                </div>
              </div>

              {/* Year-by-Year Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3">3-Year Financial Impact</h4>
                {[
                  { year: 'Year 1', investment: 400000, savings: 340000, netValue: -60000, cumulative: -60000 },
                  { year: 'Year 2', investment: 150000, savings: 680000, netValue: 530000, cumulative: 470000 },
                  { year: 'Year 3', investment: 75000, savings: 850000, netValue: 775000, cumulative: 1245000 }
                ].map((year, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{year.year}</span>
                      <span className={`font-bold ${year.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${year.cumulative.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        Investment: ${year.investment.toLocaleString()}
                      </div>
                      <div>
                        Savings: ${year.savings.toLocaleString()}
                      </div>
                      <div className={year.netValue >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Net: ${year.netValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risk Mitigation */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Risk Mitigation</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Phased approach reduces implementation risk
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Quick wins in Phase 1 build momentum and confidence
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Employee-driven priorities ensure adoption success
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}