import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { RadarChartData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface AIReadinessRadarProps {
  data: RadarChartData[]
  title?: string
  showPeerComparison?: boolean
}

export function AIReadinessRadar({ data, title = "AI Readiness Assessment", showPeerComparison = false }: AIReadinessRadarProps) {
  // Transform data for Recharts format
  const chartData = data.map(item => ({
    dimension: item.dimension,
    'Your Score': item.userScore,
    ...(showPeerComparison && item.peerAverage && { 'Peer Average': item.peerAverage }),
    fullMark: item.maxScore
  }))

  // Custom tick formatter to truncate long dimension names
  const formatTick = (value: string) => {
    if (value.length > 15) {
      return value.substring(0, 12) + '...'
    }
    return value
  }

  // Custom dot component for better visibility
  const CustomDot = (props: any) => {
    const { cx, cy, fill } = props
    return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Your performance across AI readiness dimensions
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fontSize: 12, fill: '#374151' }}
                tickFormatter={formatTick}
              />
              <PolarRadiusAxis 
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickCount={5}
              />
              
              {/* User's scores */}
              <Radar
                name="Your Score"
                dataKey="Your Score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={3}
                dot={<CustomDot />}
              />
              
              {/* Peer comparison if available */}
              {showPeerComparison && (
                <Radar
                  name="Peer Average"
                  dataKey="Peer Average"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={<CustomDot />}
                />
              )}
              
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Dimension Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{item.dimension}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{item.userScore}%</div>
                  <div className="text-xs text-gray-500">Your Score</div>
                </div>
                {showPeerComparison && item.peerAverage && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{item.peerAverage}%</div>
                    <div className="text-xs text-gray-500">Avg</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}