import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { MapPin, Target, Zap, Calendar, TrendingUp, Users, Settings, ArrowRight } from 'lucide-react'

export function CompanyMaturity() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showDepartments, setShowDepartments] = useState(false)
  
  const departments = ['all', 'Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations']
  // Department-specific scores
  const departmentScores = {
    Engineering: { strategy: 88, costValue: 76, organization: 82, technology: 91, data: 85, security: 92 },
    Sales: { strategy: 75, costValue: 82, organization: 58, technology: 62, data: 68, security: 74 },
    Marketing: { strategy: 79, costValue: 68, organization: 65, technology: 70, data: 72, security: 78 },
    Finance: { strategy: 91, costValue: 88, organization: 74, technology: 78, data: 86, security: 94 },
    HR: { strategy: 72, costValue: 65, organization: 78, technology: 58, data: 64, security: 82 },
    Operations: { strategy: 84, costValue: 70, organization: 62, technology: 72, data: 80, security: 86 },
  }

  const getScoreForDepartment = (pillar: string, dept: string) => {
    if (dept === 'all') {
      // Return company-wide average
      const allScores = Object.values(departmentScores).map(d => {
        const pillarKey = pillar.toLowerCase().replace(' & ', '').replace(' ', '')
        return d[pillarKey as keyof typeof d] || 0
      })
      return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    }
    const deptData = departmentScores[dept as keyof typeof departmentScores]
    const pillarKey = pillar.toLowerCase().replace(' & ', '').replace(' ', '')
    return deptData[pillarKey as keyof typeof deptData] || 0
  }

  const maturityData = [
    { 
      pillar: 'Strategy', 
      current: 82, 
      target: 90,
      gap: 8,
      impact: 'Misaligned AI initiatives waste 15-20 hrs/week',
      effort: 'Medium (2-3 months)',
      priority: 3
    },
    { 
      pillar: 'Cost & Value', 
      current: 71, 
      target: 85,
      gap: 14,
      impact: 'ROI tracking gaps delay decisions by 2-3 weeks',
      effort: 'Low (1-2 months)',
      priority: 2
    },
    { 
      pillar: 'Organization', 
      current: 68, 
      target: 80,
      gap: 12,
      impact: 'Skills gaps slow AI adoption by 40%',
      effort: 'High (4-6 months)',
      priority: 1
    },
    { 
      pillar: 'Technology', 
      current: 74, 
      target: 88,
      gap: 14,
      impact: 'Legacy systems add 30% overhead to projects',
      effort: 'High (6-9 months)',
      priority: 4
    },
    { 
      pillar: 'Data', 
      current: 79, 
      target: 85,
      gap: 6,
      impact: 'Data quality issues affect 25% of AI models',
      effort: 'Medium (3-4 months)',
      priority: 5
    },
    { 
      pillar: 'Security', 
      current: 86, 
      target: 90,
      gap: 4,
      impact: 'Compliance reviews add 1-2 weeks per project',
      effort: 'Low (1 month)',
      priority: 6
    },
  ]

  const radarData = maturityData.map(item => ({
    pillar: item.pillar,
    current: selectedDepartment === 'all' 
      ? item.current 
      : getScoreForDepartment(item.pillar, selectedDepartment),
    target: item.target,
  }))

  const maturityLevels = [
    { 
      level: 1, 
      title: 'Ad Hoc', 
      description: 'Unstructured, reactive approach to AI',
      range: '0-20%',
      example: 'No AI strategy, random tool usage'
    },
    { 
      level: 2, 
      title: 'Developing', 
      description: 'Basic AI awareness and initial experiments',
      range: '21-40%',
      example: 'Pilot projects, limited governance'
    },
    { 
      level: 3, 
      title: 'Defined', 
      description: 'Structured AI strategy and governance',
      range: '41-60%',
      example: 'Documented processes, assigned roles'
    },
    { 
      level: 4, 
      title: 'Managed', 
      description: 'Systematic AI implementation and measurement',
      range: '61-80%',
      example: 'KPIs tracked, scaled deployment',
      current: true // 74% falls in this range
    },
    { 
      level: 5, 
      title: 'Optimized', 
      description: 'Continuous AI innovation and optimization',
      range: '81-100%',
      example: 'AI-first culture, continuous improvement'
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Maturity</h1>
        <p className="text-gray-600 mt-2">
          AI maturity assessment across the six-pillar framework
        </p>
      </div>

      {/* Department Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">View by Department:</span>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'Company-Wide' : dept}
                </option>
              ))}
            </select>
            {selectedDepartment !== 'all' && (
              <Badge variant="info" size="sm">
                Viewing: {selectedDepartment} Department
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>AI Maturity Radar</CardTitle>
            <p className="text-sm text-gray-600">Current vs Target Performance</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#10b981"
                    fill="none"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pillar Scorecards */}
        <Card>
          <CardHeader>
            <CardTitle>Pillar Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col justify-center">
              <div className="space-y-6">
                {maturityData.map((pillar) => {
                  const currentScore = selectedDepartment === 'all' 
                    ? pillar.current 
                    : getScoreForDepartment(pillar.pillar, selectedDepartment)
                  const gap = pillar.target - currentScore
                  
                  return (
                    <div key={pillar.pillar}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{pillar.pillar}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-semibold text-gray-700">{currentScore}%</span>
                          <span className="text-xs text-gray-500">→ {pillar.target}%</span>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${currentScore}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Path to Industry Leadership */}
      <Card>
        <CardHeader>
          <CardTitle>Path to Industry Leadership</CardTitle>
          <p className="text-sm text-gray-600">Strategic and capability gaps to reach the Leaders quadrant</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Current Position Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Your Current Position</h4>
              </div>
              <p className="text-sm text-blue-800">
                You're positioned between <strong>Builders</strong> and <strong>Leaders</strong> - strong technical capabilities (70th percentile) 
                but strategic alignment needs improvement to reach industry-leading performance.
              </p>
            </div>

            {/* Strategy Gap */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <Target className="w-5 h-5 text-gray-700 mr-2" />
                  <h4 className="font-semibold text-gray-900">Strategy Gap</h4>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="warning" size="sm">Primary Focus Area</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm font-medium text-blue-700">Strategic Misalignment:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">67% of teams lack clear AI success metrics tied to business outcomes, causing 8-12 hours/week of misdirected effort</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Target className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Leadership Advantage:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Industry leaders achieve 40-50% productivity gains through unified AI strategy execution vs. your current 20-25%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium text-red-700">Strategic Overhead:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Teams spend 15-20% of AI project time on unclear requirements and changing priorities</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <ArrowRight className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-sm font-medium text-purple-700">Improvement Potential:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Strategic clarity could boost overall AI ROI by 60% and reduce project delivery time by 40%</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Settings className="w-4 h-4 text-gray-600 mr-1" />
                    <span className="text-sm font-medium text-gray-700">Strategic Actions:</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Establish AI-first business KPIs linked to revenue and cost reduction targets
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Create quarterly AI strategy alignment sessions with all department heads
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Deploy AI success metrics dashboard visible to all teams in real-time
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Capability Gap */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <Zap className="w-5 h-5 text-gray-700 mr-2" />
                  <h4 className="font-semibold text-gray-900">Capability Gap</h4>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="info" size="sm">Secondary Focus Area</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm font-medium text-blue-700">Execution Bottlenecks:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">30% of workforce are non-users, creating capability gaps that slow down cross-team AI initiatives</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Target className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Leadership Standard:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Industry leaders have 85%+ workforce AI-capable with advanced automation reducing manual work by 60%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium text-red-700">Capability Tax:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Technical limitations force 6-10 hours/week of manual workarounds per employee</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <ArrowRight className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-sm font-medium text-purple-700">Acceleration Opportunity:</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Infrastructure upgrades could double current productivity gains and enable advanced AI use cases</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Settings className="w-4 h-4 text-gray-600 mr-1" />
                    <span className="text-sm font-medium text-gray-700">Capability Actions:</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Launch 30-day AI intensive training for bottom 30% of performers
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Upgrade to enterprise AI platform with automated data pipelines
                    </li>
                    <li className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Deploy AI-to-AI integrations for seamless workflow automation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Success Timeline */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Path to Leaders Quadrant</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Months 1-3:</span>
                  <p className="text-green-800">Focus on capability improvements - fastest wins with infrastructure and training</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Months 4-6:</span>
                  <p className="text-green-800">Strategic alignment initiatives - KPIs, governance, cross-team coordination</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Months 7-9:</span>
                  <p className="text-green-800">Optimization phase - reach Leaders quadrant with 40-50% productivity gains</p>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>


      {/* Industry Benchmark Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmark Matrix</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-600">Position relative to industry peers</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show Departments:</span>
              <button
                onClick={() => setShowDepartments(!showDepartments)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showDepartments ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showDepartments ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gray-50 rounded-lg">
            {/* Axis Labels */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
              AI Strategy →
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
              AI Capabilities →
            </div>
            
            {/* Quadrant Lines */}
            <div className="absolute left-12 right-4 top-4 bottom-12">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
              
              {/* Quadrant Labels */}
              <div className="absolute top-2 left-2 text-xs font-medium text-gray-500">
                <div>Planners</div>
                <div className="text-xs font-normal">Strong strategy, weak capabilities</div>
              </div>
              <div className="absolute top-2 right-2 text-xs font-medium text-green-700">
                <div>Leaders</div>
                <div className="text-xs font-normal">Strong strategy, strong capabilities</div>
              </div>
              <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-500">
                <div>Beginners</div>
                <div className="text-xs font-normal">Weak strategy, weak capabilities</div>
              </div>
              <div className="absolute bottom-2 right-2 text-xs font-medium text-blue-600">
                <div>Builders</div>
                <div className="text-xs font-normal">Weak strategy, strong capabilities</div>
              </div>
              
              {/* Company Position */}
              <div 
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  left: '70%', // Based on implementation speed
                  top: '30%'   // Based on maturity score (74% inverted for Y axis)
                }}
              >
                <div className="w-full h-full bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">You</span>
                </div>
              </div>
              
              {/* Department Positions (when enabled) */}
              {showDepartments && departments.filter(d => d !== 'all').map((dept, index) => {
                const deptScores = departmentScores[dept as keyof typeof departmentScores]
                const avgScore = Object.values(deptScores).reduce((a, b) => a + b, 0) / Object.values(deptScores).length
                const implementationSpeed = 50 + (index * 15) - 30 // Spread departments across X axis
                
                return (
                  <div
                    key={dept}
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{
                      left: `${Math.min(90, Math.max(10, implementationSpeed))}%`,
                      top: `${100 - avgScore}%`
                    }}
                    title={`${dept}: ${Math.round(avgScore)}% maturity`}
                  >
                    <div className="w-full h-full bg-purple-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {dept.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {/* Industry Peers */}
              <div 
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '75%', top: '20%' }}
                title="Industry Leader A"
              >
                <div className="w-full h-full bg-green-500 rounded-full border-2 border-white shadow-md opacity-60" />
              </div>
              <div 
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '85%', top: '25%' }}
                title="Industry Leader B"
              >
                <div className="w-full h-full bg-green-500 rounded-full border-2 border-white shadow-md opacity-60" />
              </div>
              <div 
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '55%', top: '45%' }}
                title="Industry Average"
              >
                <div className="w-full h-full bg-gray-400 rounded-full border-2 border-white shadow-md opacity-60" />
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2" />
              <span>Your Company</span>
            </div>
            {showDepartments && (
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2" />
                <span>Departments</span>
              </div>
            )}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 opacity-60" />
              <span>Industry Leaders</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2 opacity-60" />
              <span>Industry Average</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}