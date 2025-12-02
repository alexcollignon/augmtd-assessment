import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export function AIReadiness() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showDepartments, setShowDepartments] = useState(false)
  
  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations']
  // Department-specific scores (realistic for beginner-level company)
  const departmentScores = {
    Engineering: { prompting: 45, tools: 52, responsibleUse: 38, aiThinking: 48, coIntelligence: 41 },
    Sales: { prompting: 28, tools: 35, responsibleUse: 25, aiThinking: 22, coIntelligence: 30 },
    Marketing: { prompting: 38, tools: 42, responsibleUse: 35, aiThinking: 28, coIntelligence: 33 },
    Finance: { prompting: 32, tools: 38, responsibleUse: 45, aiThinking: 40, coIntelligence: 35 },
    HR: { prompting: 25, tools: 30, responsibleUse: 42, aiThinking: 28, coIntelligence: 26 },
    Operations: { prompting: 35, tools: 40, responsibleUse: 38, aiThinking: 32, coIntelligence: 44 },
  }


  const getPillarKey = (pillar: string) => {
    // AI skill pillars
    switch (pillar.toLowerCase()) {
      case 'prompting': return 'prompting'
      case 'tools': return 'tools'
      case 'responsible use': return 'responsibleUse'
      case 'ai thinking': return 'aiThinking'
      case 'co-intelligence': return 'coIntelligence'
      default: return pillar.toLowerCase()
    }
  }

  const maturityData = [
    { 
      pillar: 'Strategy Alignment', 
      current: 55, 
      target: 75,
      gap: 20,
      impact: 'Misaligned AI initiatives reduce strategic impact',
      effort: 'Medium (2-3 months)',
      priority: 1
    },
    { 
      pillar: 'Team Ownership', 
      current: 60, 
      target: 80,
      gap: 20,
      impact: 'Limited ownership slows AI adoption and accountability',
      effort: 'Low (1-2 months)',
      priority: 2
    },
    { 
      pillar: 'Infrastructure', 
      current: 65, 
      target: 85,
      gap: 20,
      impact: 'Weak infrastructure limits AI implementation scale',
      effort: 'High (4-6 months)',
      priority: 5
    },
    { 
      pillar: 'Culture', 
      current: 60, 
      target: 80,
      gap: 20,
      impact: 'Poor AI culture creates resistance and adoption barriers',
      effort: 'High (4-5 months)',
      priority: 4
    },
    { 
      pillar: 'Task Automation', 
      current: 45, 
      target: 70,
      gap: 25,
      impact: 'Limited automation reduces productivity potential',
      effort: 'Medium (3-4 months)',
      priority: 3
    },
  ]

  const radarData = maturityData.map(item => ({
    pillar: item.pillar,
    current: item.current,
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
          AI maturity assessment across the five core skill pillars
        </p>
      </div>

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

        {/* Top Priority Themes */}
        <Card>
          <CardHeader>
            <CardTitle>Top Priority Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col justify-center">
              <div className="space-y-6">
                {[
                  { theme: 'Data Analysis', current: 43, color: 'bg-blue-600' },
                  { theme: 'Automation', current: 40, color: 'bg-green-600' },
                  { theme: 'Content Creation', current: 40, color: 'bg-purple-600' },
                  { theme: 'Communication', current: 26, color: 'bg-orange-600' },
                  { theme: 'Innovation', current: 35, color: 'bg-red-600' }
                ].map((item) => (
                  <div key={item.theme}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.theme}</span>
                      <span className="text-sm font-semibold text-gray-700">{item.current}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmark Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>AI Maturity Matrix</CardTitle>
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
                  left: '25%', // Low implementation speed (beginner quadrant)
                  top: '75%'   // Low maturity score (beginner quadrant)
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
              
              {/* Industry Average */}
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
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2 opacity-60" />
              <span>Industry Average</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}