import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

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

      {/* Gap Analysis with Priority */}
      <Card>
        <CardHeader>
          <CardTitle>Gap Analysis & Action Items</CardTitle>
          <p className="text-sm text-gray-600">
            {selectedDepartment === 'all' 
              ? 'Key gaps and actionable next steps' 
              : `${selectedDepartment} department improvement areas`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maturityData
              .map(pillar => {
                const currentScore = selectedDepartment === 'all' 
                  ? pillar.current 
                  : getScoreForDepartment(pillar.pillar, selectedDepartment)
                const gap = pillar.target - currentScore
                
                // Define business-focused insights with productivity impact
                let assessmentInsights = { 
                  currentState: '', 
                  productivityImpact: '', 
                  timeWasted: '', 
                  gainPotential: '', 
                  actions: [] 
                }
                
                switch(pillar.pillar) {
                  case 'Strategy':
                    assessmentInsights = currentScore < 75 ? {
                      currentState: 'Teams using AI tools inconsistently - same tasks done 3 different ways',
                      productivityImpact: 'Productivity gains vary wildly: 5-40% depending on team approach',
                      timeWasted: '8-12 hours per employee per week on redundant AI experimentation',
                      gainPotential: 'Standardization could deliver consistent 25-30% productivity boost across all teams',
                      actions: ['Standardize AI workflows for top 5 business processes', 'Deploy AI champions to scale best practices', 'Measure and publish team productivity benchmarks']
                    } : {
                      currentState: 'Good strategic alignment with minor execution variations between teams',
                      productivityImpact: 'Consistent 20-25% productivity gains across most functions',
                      timeWasted: '2-3 hours per week on process optimization',
                      gainPotential: 'Fine-tuning could push gains to 30-35% with better cross-team collaboration',
                      actions: ['Optimize high-performing workflows', 'Share advanced techniques across departments']
                    }
                    break
                  case 'Cost & Value':
                    assessmentInsights = currentScore < 75 ? {
                      currentState: 'AI investments show positive ROI but value capture is ad-hoc and under-reported',
                      productivityImpact: 'Documented gains of 15-20% but likely missing 50% of actual value created',
                      timeWasted: '5-8 hours per week per manager trying to manually calculate AI ROI',
                      gainPotential: 'Systematic tracking could reveal 35-45% total productivity improvement and enable 2x faster scaling',
                      actions: ['Deploy automated ROI tracking across all AI tools', 'Create monthly value scorecards by department', 'Link AI performance to team bonuses']
                    } : {
                      currentState: 'Strong value measurement with clear ROI demonstration across most initiatives',
                      productivityImpact: 'Well-documented 25-30% productivity gains with clear attribution',
                      timeWasted: '1-2 hours per week on value optimization',
                      gainPotential: 'Advanced analytics could push measured value to 40-45% with predictive insights',
                      actions: ['Implement predictive value modeling', 'Automate business case generation for new AI initiatives']
                    }
                    break
                  case 'Organization':
                    assessmentInsights = currentScore < 75 ? {
                      currentState: 'Skill gaps create 3-tier workforce: 30% power users, 40% basic users, 30% non-users',
                      productivityImpact: 'Top performers achieve 40-50% gains while others see 5-10% or none',
                      timeWasted: '12-15 hours per week across team helping struggling users, slowing high performers',
                      gainPotential: 'Bringing bottom 70% to intermediate level could deliver 25-35% company-wide productivity boost',
                      actions: ['Intensive 30-day AI boot camp for lagging teams', 'Pair high performers with struggling users', 'Mandate AI proficiency targets with performance reviews']
                    } : {
                      currentState: 'Strong AI competency across 80%+ of workforce with clear skill progressions',
                      productivityImpact: 'Consistent 25-35% productivity gains across most roles and departments',
                      timeWasted: '2-3 hours per week on advanced skill development',
                      gainPotential: 'Specialized AI skills training could push top performers to 50-60% productivity gains',
                      actions: ['Advanced AI certification program', 'Cross-functional AI project teams', 'AI innovation challenges with rewards']
                    }
                    break
                  case 'Technology':
                    assessmentInsights = currentScore < 75 ? {
                      currentState: 'Technical friction costs 20-30 minutes per AI task due to slow systems and workarounds',
                      productivityImpact: 'Infrastructure limitations cap productivity gains at 15-20% vs. potential 30-40%',
                      timeWasted: '6-10 hours per week per employee on manual data prep and system switching',
                      gainPotential: 'Infrastructure upgrades could double AI productivity gains and reduce task completion time by 50%',
                      actions: ['Upgrade to enterprise AI platform with API integrations', 'Deploy single sign-on for all AI tools', 'Automate data pipeline from core systems to AI tools']
                    } : {
                      currentState: 'Solid technical foundation enables smooth AI integration with minimal friction',
                      productivityImpact: 'Technology supports 25-30% productivity gains without significant bottlenecks',
                      timeWasted: '1-2 hours per week on system optimization',
                      gainPotential: 'Advanced automation and AI-to-AI integrations could push gains to 40-50%',
                      actions: ['Implement AI workflow automation', 'Deploy advanced AI tool integrations', 'Optimize system performance for power users']
                    }
                    break
                  case 'Data':
                    assessmentInsights = currentScore < 75 ? {
                      currentState: 'Data prep consumes 40-50% of AI project time, bottlenecking productivity gains',
                      productivityImpact: 'Poor data quality reduces AI accuracy by 20-30%, requiring manual verification',
                      timeWasted: '10-15 hours per week per team on data cleaning and validation tasks',
                      gainPotential: 'Automated data pipeline could cut AI task time by 60% and improve accuracy to 95%+',
                      actions: ['Deploy automated data cleaning for top 10 data sources', 'Create real-time data quality dashboards', 'Establish data SLAs with automatic monitoring']
                    } : {
                      currentState: 'Strong data foundation enables reliable AI outputs with minimal manual intervention',
                      productivityImpact: 'High-quality data supports 25-30% productivity gains with 90%+ AI accuracy',
                      timeWasted: '2-3 hours per week on data quality monitoring',
                      gainPotential: 'Advanced data automation could push AI accuracy to 98%+ and enable real-time insights',
                      actions: ['Implement predictive data quality monitoring', 'Deploy real-time data streaming for AI applications']
                    }
                    break
                  case 'Security':
                    assessmentInsights = currentScore < 85 ? {
                      currentState: 'Shadow AI usage puts 15-20% of productivity gains at risk due to compliance violations',
                      productivityImpact: 'Security restrictions slow AI adoption, reducing potential gains by 25-30%',
                      timeWasted: '4-6 hours per week on manual security reviews and incident response',
                      gainPotential: 'Secure-by-design AI platform could unlock full productivity potential while reducing security overhead by 80%',
                      actions: ['Deploy enterprise AI platform with built-in security', 'Automate compliance monitoring for AI usage', 'Create fast-track approval for secure AI tools']
                    } : {
                      currentState: 'Strong security posture enables confident AI adoption without compromising productivity',
                      productivityImpact: 'Security measures support rather than hinder 25-30% productivity gains',
                      timeWasted: '1 hour per week on security monitoring and updates',
                      gainPotential: 'Advanced threat detection could enable more aggressive AI adoption for 35-40% gains',
                      actions: ['Implement AI-powered security monitoring', 'Expand approved AI tool ecosystem', 'Deploy zero-trust AI access controls']
                    }
                    break
                }
                
                return { ...pillar, currentScore, gap, assessmentInsights }
              })
              .filter(pillar => pillar.gap > 0) // Only show items with gaps
              .sort((a, b) => b.gap - a.gap) // Sort by gap size
              .map((pillar) => (
                <div key={pillar.pillar} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{pillar.pillar}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">{pillar.currentScore}% → {pillar.target}%</span>
                        <Badge 
                          variant={pillar.gap > 10 ? 'warning' : 'info'}
                          size="sm"
                        >
                          {pillar.gap} point gap
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="default" size="sm">
                      {pillar.effort}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-blue-700">📊 Current State:</span>
                        <p className="text-sm text-gray-600 mt-1">{pillar.assessmentInsights.currentState}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-700">📈 Productivity Impact:</span>
                        <p className="text-sm text-gray-600 mt-1">{pillar.assessmentInsights.productivityImpact}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-red-700">⏱️ Time Wasted:</span>
                        <p className="text-sm text-gray-600 mt-1">{pillar.assessmentInsights.timeWasted}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-purple-700">🚀 Gain Potential:</span>
                        <p className="text-sm text-gray-600 mt-1">{pillar.assessmentInsights.gainPotential}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">🎯 Actions to Capture Gains:</span>
                      <ul className="mt-2 space-y-1">
                        {pillar.assessmentInsights.actions.map((action, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
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