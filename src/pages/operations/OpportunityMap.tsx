import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Filter, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  BarChart3
} from 'lucide-react'

export function OpportunityMap() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null)
  const [filterDepartment, setFilterDepartment] = useState('all')

  const opportunities = [
    {
      id: 'op-001',
      name: 'Customer Service Chatbot',
      department: 'Customer Success',
      value: 85,
      effort: 25,
      employeesImpacted: 45,
      timeToImplement: '6-8 weeks',
      annualSavings: 420000,
      description: 'AI-powered chatbot for handling common customer inquiries'
    },
    {
      id: 'op-002',
      name: 'Invoice Processing Automation',
      department: 'Finance',
      value: 75,
      effort: 30,
      employeesImpacted: 12,
      timeToImplement: '4-6 weeks',
      annualSavings: 180000,
      description: 'Automated invoice data extraction and validation'
    },
    {
      id: 'op-003',
      name: 'Resume Screening AI',
      department: 'HR',
      value: 70,
      effort: 40,
      employeesImpacted: 8,
      timeToImplement: '8-10 weeks',
      annualSavings: 150000,
      description: 'Intelligent resume filtering and candidate ranking'
    },
    {
      id: 'op-004',
      name: 'Predictive Maintenance',
      department: 'Operations',
      value: 90,
      effort: 80,
      employeesImpacted: 25,
      timeToImplement: '16-20 weeks',
      annualSavings: 750000,
      description: 'IoT-based predictive maintenance for equipment'
    },
    {
      id: 'op-005',
      name: 'Email Classification',
      department: 'Sales',
      value: 60,
      effort: 20,
      employeesImpacted: 35,
      timeToImplement: '3-4 weeks',
      annualSavings: 95000,
      description: 'Automatic email categorization and routing'
    },
    {
      id: 'op-006',
      name: 'Content Generation',
      department: 'Marketing',
      value: 65,
      effort: 35,
      employeesImpacted: 12,
      timeToImplement: '6-8 weeks',
      annualSavings: 120000,
      description: 'AI-assisted content creation for campaigns'
    },
    {
      id: 'op-007',
      name: 'Code Review Automation',
      department: 'Engineering',
      value: 55,
      effort: 60,
      employeesImpacted: 18,
      timeToImplement: '10-12 weeks',
      annualSavings: 200000,
      description: 'Automated code quality analysis and suggestions'
    },
    {
      id: 'op-008',
      name: 'Document Summarization',
      department: 'Legal',
      value: 80,
      effort: 45,
      employeesImpacted: 6,
      timeToImplement: '8-10 weeks',
      annualSavings: 180000,
      description: 'AI-powered legal document analysis and summarization'
    }
  ]

  const getQuadrant = (value: number, effort: number) => {
    if (value >= 70 && effort <= 40) return 'quick-wins'
    if (value >= 70 && effort > 40) return 'major-projects'
    if (value < 70 && effort <= 40) return 'fill-ins'
    return 'low-priority'
  }

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case 'quick-wins': return 'Quick Wins'
      case 'major-projects': return 'Major Projects'
      case 'fill-ins': return 'Fill-ins'
      case 'low-priority': return 'Low Priority'
      default: return ''
    }
  }

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'quick-wins': return '#10b981'
      case 'major-projects': return '#3b82f6'
      case 'fill-ins': return '#f59e0b'
      case 'low-priority': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const filteredOpportunities = filterDepartment === 'all' 
    ? opportunities 
    : opportunities.filter(op => op.department === filterDepartment)

  const departments = [...new Set(opportunities.map(op => op.department))]

  const quadrantSummary = {
    'quick-wins': filteredOpportunities.filter(op => getQuadrant(op.value, op.effort) === 'quick-wins').length,
    'major-projects': filteredOpportunities.filter(op => getQuadrant(op.value, op.effort) === 'major-projects').length,
    'fill-ins': filteredOpportunities.filter(op => getQuadrant(op.value, op.effort) === 'fill-ins').length,
    'low-priority': filteredOpportunities.filter(op => getQuadrant(op.value, op.effort) === 'low-priority').length,
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Opportunity Map</h1>
        <p className="text-gray-600 mt-2">
          Value vs Effort matrix for prioritizing automation initiatives
        </p>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Department:</span>
              <select 
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="ml-auto flex space-x-4 text-sm">
              {Object.entries(quadrantSummary).map(([quadrant, count]) => (
                <div key={quadrant} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getQuadrantColor(quadrant) }}
                  />
                  <span>{getQuadrantLabel(quadrant)}: {count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            Value vs Effort Matrix
          </CardTitle>
          <p className="text-sm text-gray-600">
            Bubble size represents number of employees impacted
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
            {/* Grid lines and labels */}
            <div className="absolute inset-0">
              {/* Y-axis label */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
                Value Impact →
              </div>
              {/* X-axis label */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
                Implementation Effort →
              </div>
              
              {/* Quadrant lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
              
              {/* Quadrant labels */}
              <div className="absolute top-4 left-4 text-xs font-semibold text-success-600">
                Quick Wins<br/>
                <span className="font-normal text-gray-500">High Value, Low Effort</span>
              </div>
              <div className="absolute top-4 right-4 text-xs font-semibold text-blue-600">
                Major Projects<br/>
                <span className="font-normal text-gray-500">High Value, High Effort</span>
              </div>
              <div className="absolute bottom-16 left-4 text-xs font-semibold text-warning-600">
                Fill-ins<br/>
                <span className="font-normal text-gray-500">Low Value, Low Effort</span>
              </div>
              <div className="absolute bottom-16 right-4 text-xs font-semibold text-gray-600">
                Low Priority<br/>
                <span className="font-normal text-gray-500">Low Value, High Effort</span>
              </div>
            </div>

            {/* Opportunity bubbles */}
            <div className="absolute inset-8">
              {filteredOpportunities.map((opportunity) => {
                const x = (opportunity.effort / 100) * 100
                const y = ((100 - opportunity.value) / 100) * 100
                const size = Math.max(8, Math.min(32, opportunity.employeesImpacted / 2))
                const quadrant = getQuadrant(opportunity.value, opportunity.effort)
                
                return (
                  <div
                    key={opportunity.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                    onClick={() => setSelectedQuadrant(selectedQuadrant === opportunity.id ? null : opportunity.id)}
                  >
                    <div
                      className="w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: getQuadrantColor(quadrant) }}
                      title={opportunity.name}
                    >
                      {opportunity.name.substring(0, 2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Wins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 text-success-600 mr-2" />
              Quick Wins (High Value, Low Effort)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredOpportunities
                .filter(op => getQuadrant(op.value, op.effort) === 'quick-wins')
                .sort((a, b) => b.value - a.value)
                .map((opportunity) => (
                  <div key={opportunity.id} className="p-3 bg-success-50 border border-success-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{opportunity.name}</h4>
                      <Badge variant="success" size="sm">{opportunity.timeToImplement}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Value Score</span>
                        <div className="font-medium text-success-600">{opportunity.value}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Annual Savings</span>
                        <div className="font-medium text-gray-900">
                          ${(opportunity.annualSavings / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">People Impact</span>
                        <div className="font-medium text-gray-900">{opportunity.employeesImpacted}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Major Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              Major Projects (High Value, High Effort)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredOpportunities
                .filter(op => getQuadrant(op.value, op.effort) === 'major-projects')
                .sort((a, b) => b.value - a.value)
                .map((opportunity) => (
                  <div key={opportunity.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{opportunity.name}</h4>
                      <Badge variant="info" size="sm">{opportunity.timeToImplement}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Value Score</span>
                        <div className="font-medium text-blue-600">{opportunity.value}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Annual Savings</span>
                        <div className="font-medium text-gray-900">
                          ${(opportunity.annualSavings / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">People Impact</span>
                        <div className="font-medium text-gray-900">{opportunity.employeesImpacted}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                ${(filteredOpportunities.reduce((sum, op) => sum + op.annualSavings, 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-sm text-gray-600">Total Annual Potential</p>
            </div>
            
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {filteredOpportunities.reduce((sum, op) => sum + op.employeesImpacted, 0)}
              </div>
              <p className="text-sm text-gray-600">Employees Impacted</p>
            </div>
            
            <div className="text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(filteredOpportunities.reduce((sum, op) => sum + op.value, 0) / filteredOpportunities.length)}%
              </div>
              <p className="text-sm text-gray-600">Avg Value Score</p>
            </div>
            
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {quadrantSummary['quick-wins']}
              </div>
              <p className="text-sm text-gray-600">Immediate Opportunities</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}