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
  ArrowDown,
  MessageSquare,
  Wrench
} from 'lucide-react'

interface ExecutiveSummaryProps {
  onNavigate?: (page: string, options?: { settingsTab?: string }) => void
}

export function ExecutiveSummary({ onNavigate }: ExecutiveSummaryProps) {
  const aiMaturityScore = 58
  const maturityLevel = 3
  
  
  const opportunities = [
    { name: 'Customer Service Chatbot', productivityGain: '75% faster response times', feasibility: 'High', process: 'Customer Onboarding Process' },
    { name: 'Invoice Data Extraction & Validation', productivityGain: '70% processing acceleration', feasibility: 'Medium', process: 'Invoice Processing Workflow' },
    { name: 'Resume Screening & Ranking AI', productivityGain: '80% screening efficiency', feasibility: 'High', process: 'Employee Recruitment Process' },
    { name: 'Predictive Equipment Maintenance', productivityGain: '60% downtime reduction', feasibility: 'Medium', process: 'Operations Maintenance Workflow' },
    { name: 'Content Generation Assistant', productivityGain: '65% content creation speed', feasibility: 'High', process: 'Marketing Campaign Creation' }
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

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="text-center py-5">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Employees Assessed</p>
            <div className="text-3xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-gray-500 mt-1">Across 6 departments</p>
            <button 
              onClick={() => onNavigate?.('assessment-data')}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Show Details →
            </button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="text-center py-5">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Avg. Skill Level</p>
            <div className="text-3xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-gray-500 mt-1">Across all domains</p>
            <button 
              onClick={() => onNavigate?.('people-skills')}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Show Details →
            </button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="text-center py-5">
            <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Automatable Work</p>
            <div className="text-3xl font-bold text-gray-900">32%</div>
            <p className="text-xs text-gray-500 mt-1">Of processes can be automated</p>
            <button 
              onClick={() => onNavigate?.('ai-transformation')}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Show Details →
            </button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="text-center py-5">
            <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Risk Exposure</p>
            <div className="text-3xl font-bold text-orange-600">18%</div>
            <p className="text-xs text-gray-500 mt-1">Shadow AI & compliance</p>
            <button 
              onClick={() => onNavigate?.('risk-compliance')}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Show Details →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* AI Maturity Score and Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>AI Maturity Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <CircularProgress value={aiMaturityScore} size="xl" />
            </div>
            <p className="text-gray-600 mb-4">Overall organizational readiness</p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
                Level {maturityLevel}
              </div>
              <div className="text-gray-500">Progressing</div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Maturity Pillars</CardTitle>
                <button 
                  onClick={() => onNavigate?.('ai-readiness')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Show Details →
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Top row - 3 pillars */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <MessageSquare className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="mb-2">
                      <CircularProgress value={62} size="sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Prompting</p>
                    <p className="text-xs text-gray-500 mt-1">AI conversation & prompt skills</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Wrench className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="mb-2">
                      <CircularProgress value={58} size="sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Tools</p>
                    <p className="text-xs text-gray-500 mt-1">AI platform proficiency</p>
                  </div>
                  
                  <div className="text-center col-span-2 md:col-span-1">
                    <div className="flex justify-center mb-3">
                      <Shield className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="mb-2">
                      <CircularProgress value={71} size="sm" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Responsible Use</p>
                    <p className="text-xs text-gray-500 mt-1">Ethics & governance</p>
                  </div>
                </div>
                
                {/* Bottom row - 2 pillars centered */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <Brain className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="mb-2">
                        <CircularProgress value={45} size="sm" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">AI Thinking</p>
                      <p className="text-xs text-gray-500 mt-1">Strategic thinking & analysis</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <Users className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="mb-2">
                        <CircularProgress value={52} size="sm" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Co-Intelligence</p>
                      <p className="text-xs text-gray-500 mt-1">Human-AI collaboration</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



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
                    <p className="text-sm text-gray-500">Estimated Productivity Gains: {opportunity.productivityGain}</p>
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