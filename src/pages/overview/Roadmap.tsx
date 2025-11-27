import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Settings, 
  Users, 
  Database, 
  Shield,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export function Roadmap() {
  const quickWins = [
    {
      title: 'AI Ethics Committee Formation',
      description: 'Establish cross-functional AI governance team',
      timeline: '2 weeks',
      impact: 'High',
      effort: 'Low',
      owner: 'Chief Data Officer'
    },
    {
      title: 'Shadow AI Tool Audit',
      description: 'Complete inventory of unauthorized AI tools in use',
      timeline: '3 weeks', 
      impact: 'Medium',
      effort: 'Low',
      owner: 'IT Security'
    },
    {
      title: 'Customer Service Bot Pilot',
      description: 'Deploy AI chatbot for common customer queries',
      timeline: '4 weeks',
      impact: 'High',
      effort: 'Medium',
      owner: 'Customer Success'
    },
    {
      title: 'Data Quality Assessment',
      description: 'Baseline data quality metrics across systems',
      timeline: '6 weeks',
      impact: 'High',
      effort: 'Medium',
      owner: 'Data Engineering'
    }
  ]

  const ninetyDayPlan = [
    {
      week: 'Week 1-2',
      initiatives: [
        'Form AI Ethics Committee',
        'Launch AI awareness training',
        'Begin shadow AI audit'
      ]
    },
    {
      week: 'Week 3-6',
      initiatives: [
        'Complete data quality assessment',
        'Deploy customer service pilot',
        'Establish model monitoring framework'
      ]
    },
    {
      week: 'Week 7-10',
      initiatives: [
        'Implement bias detection tools',
        'Develop AI governance policies',
        'Begin HR automation pilot'
      ]
    },
    {
      week: 'Week 11-12',
      initiatives: [
        'Evaluate pilot results',
        'Plan next phase rollout',
        'Update risk assessments'
      ]
    }
  ]

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      focus: 'Foundation & Governance',
      items: [
        'AI governance framework',
        'Data infrastructure audit',
        'Initial automation pilots'
      ]
    },
    {
      quarter: 'Q2 2024',
      focus: 'Pilot Expansion',
      items: [
        'Scale successful pilots',
        'Advanced analytics platform',
        'Employee AI training program'
      ]
    },
    {
      quarter: 'Q3 2024',
      focus: 'Department Integration',
      items: [
        'Department-specific AI solutions',
        'Process automation at scale',
        'Performance measurement system'
      ]
    },
    {
      quarter: 'Q4 2024',
      focus: 'Optimization & Innovation',
      items: [
        'AI-driven decision systems',
        'Advanced ML capabilities',
        'Innovation lab establishment'
      ]
    }
  ]

  const requiredIntegrations = [
    { system: 'Salesforce CRM', priority: 'High', complexity: 'Medium', timeline: '6-8 weeks' },
    { system: 'SAP ERP', priority: 'High', complexity: 'High', timeline: '12-16 weeks' },
    { system: 'Microsoft 365', priority: 'Medium', complexity: 'Low', timeline: '3-4 weeks' },
    { system: 'Slack/Teams', priority: 'Medium', complexity: 'Low', timeline: '2-3 weeks' },
    { system: 'Tableau/PowerBI', priority: 'High', complexity: 'Medium', timeline: '4-6 weeks' },
    { system: 'AWS/Azure ML', priority: 'High', complexity: 'High', timeline: '8-12 weeks' }
  ]

  const governanceChanges = [
    'Establish AI Center of Excellence (COE)',
    'Update data governance policies for AI',
    'Implement AI risk management framework',
    'Create AI vendor assessment process',
    'Develop AI incident response procedures'
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Roadmap & Recommendations</h1>
        <p className="text-gray-600 mt-2">
          Strategic implementation plan and key milestones for AI transformation
        </p>
      </div>

      {/* 30-Day Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 text-green-600 mr-2" />
            30-Day Quick Wins
          </CardTitle>
          <p className="text-sm text-gray-600">High-impact initiatives to start immediately</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickWins.map((win, index) => (
              <div key={index} className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{win.title}</h3>
                  <Badge variant="success" size="sm">{win.timeline}</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{win.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex space-x-2">
                    <Badge variant={win.impact === 'High' ? 'success' : 'warning'} size="sm">
                      {win.impact} Impact
                    </Badge>
                    <Badge variant={win.effort === 'Low' ? 'success' : 'warning'} size="sm">
                      {win.effort} Effort
                    </Badge>
                  </div>
                  <span className="text-gray-500">{win.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 90-Day Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            90-Day Implementation Plan
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed timeline for the first quarter</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ninetyDayPlan.map((phase, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  {index < ninetyDayPlan.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{phase.week}</h3>
                  <div className="space-y-2">
                    {phase.initiatives.map((initiative, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {initiative}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 12-Month Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            12-Month Strategic Roadmap
          </CardTitle>
          <p className="text-sm text-gray-600">High-level quarterly milestones and focus areas</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {roadmapItems.map((quarter, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{quarter.quarter}</h3>
                    {index < roadmapItems.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-purple-600">{quarter.focus}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {quarter.items.map((item, idx) => (
                      <div key={idx} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Required Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 text-blue-600 mr-2" />
              Required Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredIntegrations.map((integration, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{integration.system}</h4>
                    <Badge 
                      variant={integration.priority === 'High' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {integration.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Complexity: {integration.complexity}</span>
                    <span>{integration.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Required Governance Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 text-orange-600 mr-2" />
              Required Governance Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {governanceChanges.map((change, index) => (
                <div key={index} className="flex items-start p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{change}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
            Success Metrics & KPIs
          </CardTitle>
          <p className="text-sm text-gray-600">Key indicators to track progress and impact</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: 'AI Maturity Score', target: '85%', current: '74%' },
              { metric: 'Process Automation', target: '40%', current: '15%' },
              { metric: 'Employee AI Adoption', target: '80%', current: '42%' },
              { metric: 'Cost Savings Realized', target: '$2.5M', current: '$380K' },
            ].map((kpi, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{kpi.metric}</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">{kpi.target}</div>
                <div className="text-sm text-gray-600">Target</div>
                <div className="text-sm text-gray-500 mt-1">Current: {kpi.current}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}