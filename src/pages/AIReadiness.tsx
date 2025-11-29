import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { MapPin, Target, Zap, Calendar, TrendingUp, Users, Settings, ArrowRight, MessageCircle, CheckCircle, Building2 } from 'lucide-react'

export function AIReadiness() {
  const [viewType, setViewType] = useState<'organizational' | 'skills'>('organizational')
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

  // Employee skills scores from individual assessments
  const departmentSkillScores = {
    Engineering: { toolProficiency: 89, promptEngineering: 85, dataAnalysis: 92, processAutomation: 88, aiEthics: 76, creativeApplications: 82 },
    Sales: { toolProficiency: 72, promptEngineering: 68, dataAnalysis: 58, processAutomation: 64, aiEthics: 71, creativeApplications: 79 },
    Marketing: { toolProficiency: 84, promptEngineering: 91, dataAnalysis: 67, processAutomation: 59, aiEthics: 78, creativeApplications: 95 },
    Finance: { toolProficiency: 76, promptEngineering: 71, dataAnalysis: 88, processAutomation: 82, aiEthics: 89, creativeApplications: 62 },
    HR: { toolProficiency: 69, promptEngineering: 74, dataAnalysis: 61, processAutomation: 58, aiEthics: 85, creativeApplications: 71 },
    Operations: { toolProficiency: 81, promptEngineering: 73, dataAnalysis: 79, processAutomation: 91, aiEthics: 82, creativeApplications: 68 },
  }

  const getScoreForDepartment = (pillar: string, dept: string) => {
    const scores = viewType === 'organizational' ? departmentScores : departmentSkillScores
    
    if (dept === 'all') {
      // Return company-wide average
      const pillarKey = getPillarKey(pillar, viewType)
      const allScores = Object.values(scores).map(d => d[pillarKey as keyof typeof d] || 0)
      return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    }
    
    const deptData = scores[dept as keyof typeof scores]
    if (!deptData) return 0
    
    const pillarKey = getPillarKey(pillar, viewType)
    return deptData[pillarKey as keyof typeof deptData] || 0
  }

  const getPillarKey = (pillar: string, viewType: 'organizational' | 'skills') => {
    if (viewType === 'organizational') {
      // Organizational pillars
      switch (pillar.toLowerCase()) {
        case 'strategy': return 'strategy'
        case 'cost & value': return 'costValue'
        case 'organization': return 'organization'
        case 'technology': return 'technology'
        case 'data': return 'data'
        case 'security': return 'security'
        default: return pillar.toLowerCase()
      }
    } else {
      // Skills pillars
      switch (pillar.toLowerCase()) {
        case 'ai tool proficiency': return 'toolProficiency'
        case 'prompt engineering': return 'promptEngineering'
        case 'data analysis with ai': return 'dataAnalysis'
        case 'process automation': return 'processAutomation'
        case 'ai ethics & bias': return 'aiEthics'
        case 'creative applications': return 'creativeApplications'
        default: return pillar.toLowerCase()
      }
    }
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

  // Employee skills data from individual assessments
  const skillsData = [
    {
      pillar: 'AI Tool Proficiency',
      current: 78,
      target: 85,
      gap: 7,
      impact: '32% of employees struggle with basic AI tools, reducing productivity',
      effort: 'Low (1-2 months)',
      priority: 1
    },
    {
      pillar: 'Prompt Engineering',
      current: 74,
      target: 88,
      gap: 14,
      impact: 'Poor prompting leads to 40% lower AI output quality',
      effort: 'Medium (2-3 months)',
      priority: 2
    },
    {
      pillar: 'Data Analysis with AI',
      current: 72,
      target: 82,
      gap: 10,
      impact: 'Manual analysis adds 5-8 hrs/week per analyst',
      effort: 'Medium (3-4 months)',
      priority: 3
    },
    {
      pillar: 'Process Automation',
      current: 69,
      target: 80,
      gap: 11,
      impact: 'Missed automation opportunities cost 12+ hrs/week per dept',
      effort: 'High (4-6 months)',
      priority: 4
    },
    {
      pillar: 'AI Ethics & Bias',
      current: 80,
      target: 90,
      gap: 10,
      impact: 'Bias incidents could damage reputation and compliance',
      effort: 'Low (1 month)',
      priority: 5
    },
    {
      pillar: 'Creative Applications',
      current: 77,
      target: 85,
      gap: 8,
      impact: 'Limited creative AI use misses innovation opportunities',
      effort: 'Medium (2-3 months)',
      priority: 6
    }
  ]

  const currentData = viewType === 'organizational' ? maturityData : skillsData
  
  const radarData = currentData.map(item => ({
    pillar: item.pillar,
    current: viewType === 'organizational' 
      ? item.current 
      : (selectedDepartment === 'all' 
          ? item.current 
          : getScoreForDepartment(item.pillar, selectedDepartment)),
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Readiness</h1>
            <p className="text-gray-600 mt-2">
              {viewType === 'organizational' 
                ? 'AI maturity assessment across the six-pillar framework'
                : 'Employee AI skills assessment from individual evaluations'
              }
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('organizational')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewType === 'organizational'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Organizational
            </button>
            <button
              onClick={() => setViewType('skills')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewType === 'skills'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Employee Skills
            </button>
          </div>
        </div>
      </div>

      {/* Department Filter - Only show for Employee Skills view */}
      {viewType === 'skills' && (
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
                    {dept === 'all' ? 'All Departments' : dept}
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {viewType === 'organizational' ? 'AI Maturity Radar' : 'Employee Skills Radar'}
            </CardTitle>
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
            <CardTitle>
              {viewType === 'organizational' ? 'Pillar Performance' : 'Skills Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col justify-center">
              <div className="space-y-6">
                {currentData.map((pillar) => {
                  const currentScore = viewType === 'organizational'
                    ? pillar.current 
                    : (selectedDepartment === 'all' 
                        ? pillar.current 
                        : getScoreForDepartment(pillar.pillar, selectedDepartment))
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

      {/* Path to Industry Leadership - Only show for Organizational view */}
      {viewType === 'organizational' && (
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
      )}

      {/* Employee Skills Deep-Dive - Only show for Employee Skills view */}
      {viewType === 'skills' && (
        <div className="space-y-8">
          {/* Skill Distribution Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                Skill Distribution Analysis
              </CardTitle>
              <p className="text-sm text-gray-600">Performance distribution across 1,247 assessed employees</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { skill: 'AI Tool Proficiency', advanced: 23, intermediate: 31, basic: 28, beginner: 18 },
                  { skill: 'Prompt Engineering', advanced: 19, intermediate: 25, basic: 33, beginner: 23 },
                  { skill: 'Data Analysis with AI', advanced: 15, intermediate: 28, basic: 35, beginner: 22 },
                  { skill: 'Process Automation', advanced: 12, intermediate: 22, basic: 31, beginner: 35 },
                  { skill: 'AI Ethics & Bias', advanced: 34, intermediate: 29, basic: 24, beginner: 13 },
                  { skill: 'Creative Applications', advanced: 21, intermediate: 27, basic: 30, beginner: 22 }
                ].map((skillData, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">{skillData.skill}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Advanced</span>
                        <span className="text-sm font-medium">{skillData.advanced}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${skillData.advanced}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Intermediate</span>
                        <span className="text-sm font-medium">{skillData.intermediate}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skillData.intermediate}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Basic</span>
                        <span className="text-sm font-medium">{skillData.basic}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${skillData.basic}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700">Beginner</span>
                        <span className="text-sm font-medium">{skillData.beginner}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${skillData.beginner}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employee Feedback by Skill */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
                Employee Feedback Insights
              </CardTitle>
              <p className="text-sm text-gray-600">Direct feedback from assessment responses</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  {
                    skill: 'AI Tool Proficiency',
                    quotes: [
                      { quote: "I use ChatGPT daily but struggle with complex tasks", role: "Marketing Specialist", dept: "Marketing" },
                      { quote: "Need training on GitHub Copilot features beyond autocomplete", role: "Software Engineer", dept: "Engineering" }
                    ]
                  },
                  {
                    skill: 'Prompt Engineering', 
                    quotes: [
                      { quote: "My prompts are too generic, I get mediocre results", role: "Sales Manager", dept: "Sales" },
                      { quote: "I know advanced techniques but my team doesn't", role: "Content Manager", dept: "Marketing" }
                    ]
                  },
                  {
                    skill: 'Data Analysis with AI',
                    quotes: [
                      { quote: "I want to use AI for Excel analysis but don't know how", role: "Financial Analyst", dept: "Finance" },
                      { quote: "AI helps with basic charts, but I need advanced analytics training", role: "Operations Manager", dept: "Operations" }
                    ]
                  },
                  {
                    skill: 'Process Automation',
                    quotes: [
                      { quote: "I see automation opportunities everywhere but lack technical skills", role: "HR Coordinator", dept: "HR" },
                      { quote: "Built one workflow automation, want to do more", role: "Operations Specialist", dept: "Operations" }
                    ]
                  }
                ].map((skillFeedback, index) => (
                  <div key={index} className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-3">{skillFeedback.skill}</h4>
                    <div className="space-y-3">
                      {skillFeedback.quotes.map((feedback, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border-l-4 border-purple-400">
                          <p className="text-sm italic text-gray-700 mb-2">"{feedback.quote}"</p>
                          <p className="text-xs text-gray-500">{feedback.role}, {feedback.dept}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department-Specific Insights & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 text-orange-600 mr-2" />
                  Department Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: 'Engineering', avg: 86, insight: 'Strong technical foundation, needs business application training', color: 'green' },
                    { dept: 'Marketing', avg: 81, insight: 'Creative AI leaders, could mentor prompt engineering', color: 'green' },
                    { dept: 'Operations', avg: 79, insight: 'Process-focused, excellent automation candidates', color: 'blue' },
                    { dept: 'Finance', avg: 78, insight: 'Excel/data-focused, wants AI analytics integration', color: 'blue' },
                    { dept: 'HR', avg: 70, insight: 'Ethics-conscious, needs practical application guidance', color: 'yellow' },
                    { dept: 'Sales', avg: 67, insight: 'Biggest opportunity for improvement, needs foundational training', color: 'red' }
                  ].map((dept, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        dept.color === 'green' ? 'bg-green-500' :
                        dept.color === 'blue' ? 'bg-blue-500' :
                        dept.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{dept.dept}</span>
                          <span className={`text-sm font-semibold ${
                            dept.color === 'green' ? 'text-green-600' :
                            dept.color === 'blue' ? 'text-blue-600' :
                            dept.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                          }`}>{dept.avg}% avg</span>
                        </div>
                        <p className="text-sm text-gray-600">{dept.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: 'Engineering', rec: 'Advanced automation workshops, API integration training' },
                    { dept: 'Marketing', rec: 'Become company prompt engineering mentors, creative AI showcase' },
                    { dept: 'Operations', rec: 'Process automation intensive, workflow optimization focus' },
                    { dept: 'Finance', rec: 'AI-powered analytics bootcamp, Excel-to-AI workflow training' },
                    { dept: 'HR', rec: 'AI ethics leadership role, bias detection training' },
                    { dept: 'Sales', rec: 'Foundational AI literacy program, CRM integration training' }
                  ].map((rec, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-1">{rec.dept}</h4>
                      <p className="text-sm text-green-700">{rec.rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                High Performer Success Stories
              </CardTitle>
              <p className="text-sm text-gray-600">Examples from top 10% of assessed employees</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Sarah M.',
                    dept: 'Marketing',
                    role: 'Content Manager',
                    story: 'Uses AI for campaign ideation, content creation, and A/B testing',
                    impact: 'Saves 12 hrs/week',
                    skills: ['Prompt Engineering: 95%', 'Creative Applications: 98%']
                  },
                  {
                    name: 'Mike R.',
                    dept: 'Engineering', 
                    role: 'Senior Developer',
                    story: 'Automated code review process with AI, integrated with CI/CD pipeline',
                    impact: 'Reduced bugs by 40%',
                    skills: ['Tool Proficiency: 97%', 'Process Automation: 94%']
                  },
                  {
                    name: 'Lisa C.',
                    dept: 'Finance',
                    role: 'Financial Analyst',
                    story: 'Built AI-powered expense categorization and budget forecasting models',
                    impact: 'Cut processing time 70%',
                    skills: ['Data Analysis: 93%', 'Process Automation: 89%']
                  },
                  {
                    name: 'David K.',
                    dept: 'Operations',
                    role: 'Process Manager',
                    story: 'Implemented AI chatbot for internal support, automated workflow routing',
                    impact: '25% efficiency gain',
                    skills: ['Process Automation: 96%', 'Tool Proficiency: 91%']
                  },
                  {
                    name: 'Jennifer L.',
                    dept: 'Sales',
                    role: 'Account Executive', 
                    story: 'Uses AI for lead qualification, proposal generation, and client research',
                    impact: '30% more qualified leads',
                    skills: ['Prompt Engineering: 88%', 'Creative Applications: 85%']
                  },
                  {
                    name: 'Alex T.',
                    dept: 'HR',
                    role: 'Talent Acquisition',
                    story: 'AI-assisted resume screening and interview question generation',
                    impact: '50% faster hiring',
                    skills: ['Data Analysis: 86%', 'AI Ethics: 95%']
                  }
                ].map((story, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{story.name}</h4>
                        <p className="text-sm text-gray-600">{story.role}, {story.dept}</p>
                      </div>
                      <Badge variant="success" size="sm">Top 10%</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{story.story}</p>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-green-700">Impact: </span>
                      <span className="text-sm text-green-600">{story.impact}</span>
                    </div>
                    <div className="space-y-1">
                      {story.skills.map((skill, idx) => (
                        <div key={idx} className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Industry Benchmark Matrix - Only show for Organizational view */}
      {viewType === 'organizational' && (
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
      )}
    </div>
  )
}