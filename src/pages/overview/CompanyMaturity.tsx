import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function CompanyMaturity() {
  const maturityData = [
    { pillar: 'Strategy', current: 82, target: 90 },
    { pillar: 'Cost & Value', current: 71, target: 85 },
    { pillar: 'Organization', current: 68, target: 80 },
    { pillar: 'Technology', current: 74, target: 88 },
    { pillar: 'Data', current: 79, target: 85 },
    { pillar: 'Security', current: 86, target: 90 },
  ]

  const radarData = maturityData.map(item => ({
    pillar: item.pillar,
    current: item.current,
    target: item.target,
  }))

  const maturityLevels = [
    { level: 1, title: 'Ad Hoc', description: 'Unstructured, reactive approach to AI' },
    { level: 2, title: 'Developing', description: 'Basic AI awareness and initial experiments' },
    { level: 3, title: 'Defined', description: 'Structured AI strategy and governance', current: true },
    { level: 4, title: 'Managed', description: 'Systematic AI implementation and measurement' },
    { level: 5, title: 'Optimized', description: 'Continuous AI innovation and optimization' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Maturity</h1>
        <p className="text-gray-600 mt-2">
          AI maturity assessment across the six-pillar framework
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

        {/* Pillar Scorecards */}
        <Card>
          <CardHeader>
            <CardTitle>Pillar Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maturityData.map((pillar) => (
                <div key={pillar.pillar} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{pillar.pillar}</span>
                    <span className="text-sm text-gray-600">{pillar.current}%</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pillar.current}%` }}
                      />
                    </div>
                    <div className="w-16 text-xs text-gray-500 text-right">
                      Target: {pillar.target}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Gap vs Target Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maturityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pillar" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="current" fill="#3b82f6" name="Current Score" />
                <Bar dataKey="target" fill="#10b981" name="Target Score" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Maturity Stage Definition */}
      <Card>
        <CardHeader>
          <CardTitle>Maturity Levels</CardTitle>
          <p className="text-sm text-gray-600">AI maturity progression framework</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maturityLevels.map((level) => (
              <div 
                key={level.level} 
                className={`p-4 rounded-lg border-2 ${
                  level.current 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      level.current 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {level.level}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{level.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    </div>
                  </div>
                  {level.current && (
                    <Badge variant="info" size="sm">Current Level</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmark (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmark</CardTitle>
          <p className="text-sm text-gray-600">How your organization compares to industry peers</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Above Average</div>
              <p className="text-sm text-gray-600 mt-1">Overall Performance</p>
              <div className="mt-2">
                <Badge variant="success">Top 25%</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Level 3.2</div>
              <p className="text-sm text-gray-600 mt-1">Industry Average</p>
              <div className="mt-2">
                <Badge variant="info">+0.3 vs avg</Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12-18mo</div>
              <p className="text-sm text-gray-600 mt-1">Est. to Level 4</p>
              <div className="mt-2">
                <Badge variant="default">Projection</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}