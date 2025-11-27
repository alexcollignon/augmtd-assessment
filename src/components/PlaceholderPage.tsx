import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'

interface PlaceholderPageProps {
  title: string
  description: string
  comingSoon?: boolean
}

export function PlaceholderPage({ title, description, comingSoon = true }: PlaceholderPageProps) {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {comingSoon && <Badge variant="info">Coming Soon</Badge>}
        </div>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Under Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title} Dashboard
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This page is currently under development. The {title.toLowerCase()} analytics and insights will be available in the next release.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 mb-2">📊</div>
            <h4 className="font-medium text-gray-700 mb-1">Interactive Charts</h4>
            <p className="text-xs text-gray-500">Dynamic data visualizations</p>
          </CardContent>
        </Card>
        
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 mb-2">🔍</div>
            <h4 className="font-medium text-gray-700 mb-1">Detailed Analytics</h4>
            <p className="text-xs text-gray-500">Deep dive into metrics</p>
          </CardContent>
        </Card>
        
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 mb-2">📈</div>
            <h4 className="font-medium text-gray-700 mb-1">Real-time Insights</h4>
            <p className="text-xs text-gray-500">Live data updates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}