import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { Badge } from '@/components/ui/Badge'
import { 
  Brain, 
  Shield, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function ExecutiveSummary() {
  const aiHealthScore = 74
  const maturityLevel = 3
  const valueLeakage = 127000
  
  const strengths = [
    'Customer service team achieving 3x faster response times with AI tools',
    'Finance department automated 40% of invoice processing, saving 20 hrs/week',
    'Zero security incidents from AI implementations in past 12 months',
    '89% of assessed employees actively using approved AI tools',
    'Data quality score (79%) exceeds industry average by 15 points'
  ]
  
  const risks = [
    '127 employees using ungoverned shadow AI tools (18% of workforce)',
    'Sales & Marketing departments lag with only 45% AI readiness',
    '68% of workflows remain manual, causing 1,250 hrs/week inefficiency',
    'Missing AI ethics committee exposes company to bias risks',
    '3 critical systems lack API integration for automation'
  ]
  
  const opportunities = [
    { name: 'Customer Service Chatbot', value: '$2.1M', feasibility: 'High', process: 'Customer Onboarding Process' },
    { name: 'Invoice Data Extraction & Validation', value: '$890K', feasibility: 'Medium', process: 'Invoice Processing Workflow' },
    { name: 'Resume Screening & Ranking AI', value: '$670K', feasibility: 'High', process: 'Employee Recruitment Process' },
    { name: 'Predictive Equipment Maintenance', value: '$1.5M', feasibility: 'Medium', process: 'Operations Maintenance Workflow' },
    { name: 'Content Generation Assistant', value: '$540K', feasibility: 'High', process: 'Marketing Campaign Creation' }
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Executive Summary</h1>
        <p className="text-gray-600 mt-2">
          High-level AI readiness snapshot and strategic insights
        </p>
      </div>

      {/* AI Health Score Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <CircularProgress value={aiHealthScore} size="xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Health Score</h2>
            <p className="text-gray-600 mb-4">Overall organizational readiness</p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                Level {maturityLevel}
              </div>
              <div className="text-gray-500">Developing</div>
            </div>
            <div className="flex items-center justify-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
              <ArrowDown className="w-4 h-4 mr-1" />
              <span className="text-xs">Based on 6 pillars below</span>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="flex items-center justify-center">
            <CardContent className="text-center py-5">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">Employees Assessed</p>
              <div className="text-3xl font-bold text-gray-900">1,247</div>
              <p className="text-xs text-gray-500 mt-1">Across 6 departments</p>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center">
            <CardContent className="text-center py-5">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">Automatable Work</p>
              <div className="text-3xl font-bold text-gray-900">32%</div>
              <p className="text-xs text-gray-500 mt-1">Of processes can be automated</p>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center">
            <CardContent className="text-center py-5">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Skill Level</p>
              <div className="text-3xl font-bold text-gray-900">68%</div>
              <p className="text-xs text-gray-500 mt-1">Across all domains</p>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center">
            <CardContent className="text-center py-5">
              <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 mb-1">Risk Exposure</p>
              <div className="text-3xl font-bold text-orange-600">18%</div>
              <p className="text-xs text-gray-500 mt-1">Shadow AI & compliance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pillar Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>AI Maturity Pillars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Strategy', score: 82, icon: Brain, description: 'AI vision & roadmap clarity' },
              { name: 'Cost & Value', score: 71, icon: DollarSign, description: 'ROI tracking & benefits' },
              { name: 'Organization', score: 68, icon: Users, description: 'Team skills & readiness' },
              { name: 'Technology', score: 74, icon: TrendingUp, description: 'Infrastructure & tools' },
              { name: 'Data', score: 79, icon: Brain, description: 'Quality & governance' },
              { name: 'Security', score: 86, icon: Shield, description: 'Risk & compliance' }
            ].map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.name} className="text-center">
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="mb-2">
                    <CircularProgress value={pillar.score} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{pillar.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
              Top 5 Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Risks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-danger-600 mr-2" />
              Top 5 Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {risks.map((risk, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{risk}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Leakage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Value Leakage Estimate</h3>
                <p className="text-sm text-gray-600">Monthly cost of operational inefficiencies</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-danger-600">
                {formatCurrency(valueLeakage)}/mo
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                12% increase from last quarter
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top AI Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 AI Use Case Opportunities</CardTitle>
          <p className="text-sm text-gray-600">Based on workflow analysis and process automation potential</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{opportunity.name}</h4>
                    <p className="text-sm text-gray-600">Process: {opportunity.process}</p>
                    <p className="text-sm text-gray-500">Estimated Annual Value: {opportunity.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={opportunity.feasibility === 'High' ? 'success' : 'warning'}>
                    {opportunity.feasibility} Feasibility
                  </Badge>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}