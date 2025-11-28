import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  FileText, 
  Users,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  ArrowDown
} from 'lucide-react'

export function RiskCompliance() {
  const overallRiskScore = 68
  
  const responsibleAIMetrics = [
    { name: 'Fairness', score: 72, icon: Users },
    { name: 'Explainability', score: 58, icon: Eye },
    { name: 'Bias Monitoring', score: 64, icon: Settings },
    { name: 'Safety Controls', score: 81, icon: Shield },
  ]

  const securityHeatmap = [
    { department: 'Engineering', score: 85, level: 'High' },
    { department: 'Marketing', score: 62, level: 'Medium' },
    { department: 'Sales', score: 58, level: 'Medium' },
    { department: 'HR', score: 74, level: 'High' },
    { department: 'Finance', score: 91, level: 'High' },
    { department: 'Operations', score: 45, level: 'Low' },
  ]

  const shadowAIIndicators = [
    { tool: 'ChatGPT', usage: 'High', risk: 'Medium', users: 127 },
    { tool: 'Claude', usage: 'Medium', risk: 'Low', users: 43 },
    { tool: 'GitHub Copilot', usage: 'High', risk: 'Low', users: 89 },
    { tool: 'Grammarly AI', usage: 'Medium', risk: 'Low', users: 156 },
    { tool: 'Midjourney', usage: 'Low', risk: 'High', users: 12 },
  ]

  const governanceGaps = [
    'AI ethics committee not established',
    'Data lineage tracking incomplete',
    'Model monitoring framework missing',
    'Incident response plan undefined',
    'Third-party AI vendor assessments lacking'
  ]

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'success'
    if (score >= 50) return 'warning'
    return 'danger'
  }

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Risk & Compliance</h1>
        <p className="text-gray-600 mt-2">
          AI risk assessment, responsible AI metrics, and governance status
        </p>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <CircularProgress value={overallRiskScore} size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Risk Score</h2>
            <p className="text-gray-600 mb-4">Overall ethical AI risk posture</p>
            <div className="flex items-center justify-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
              <ArrowDown className="w-4 h-4 mr-1" />
              <span className="text-xs">Based on 4 metrics below</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <AlertTriangle className="w-6 h-6 text-danger-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">High-Risk Areas</p>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">Shadow AI, governance gaps, bias</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Compliance Score</p>
            <div className="text-3xl font-bold text-gray-900">74%</div>
            <p className="text-xs text-gray-500 mt-1">Regulatory alignment</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <Eye className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Shadow AI Tools</p>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <p className="text-xs text-gray-500 mt-1">Detected in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Responsible AI Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            Responsible AI Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">Key ethical AI metrics and controls</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {responsibleAIMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.name} className="text-center">
                  <div className="mb-4">
                    <CircularProgress value={metric.score} size="md" />
                  </div>
                  <div className="flex justify-center mb-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <p className="text-sm text-gray-600">{metric.score}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Risk Heatmap by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityHeatmap.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" 
                         style={{ 
                           backgroundColor: dept.score >= 75 ? '#10b981' : 
                                          dept.score >= 50 ? '#f59e0b' : '#ef4444' 
                         }}
                    />
                    <span className="font-medium text-gray-900">{dept.department}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{dept.score}%</span>
                    <Badge variant={getRiskColor(dept.score)}>{dept.level}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shadow AI Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 text-warning-600 mr-2" />
              Shadow AI Usage Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shadowAIIndicators.map((tool) => (
                <div key={tool.tool} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{tool.tool}</h4>
                    <p className="text-sm text-gray-600">{tool.users} users</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getUsageColor(tool.usage)} size="sm">
                      {tool.usage} Usage
                    </Badge>
                    <Badge variant={getRiskBadgeColor(tool.risk)} size="sm">
                      {tool.risk} Risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Governance Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="w-5 h-5 text-danger-600 mr-2" />
            Top 5 Governance Gaps
          </CardTitle>
          <p className="text-sm text-gray-600">Critical areas requiring immediate attention</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {governanceGaps.map((gap, index) => (
              <div key={index} className="p-4 border-2 border-danger-200 bg-danger-50 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-danger-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-danger-800">{gap}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
            Regulatory Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { regulation: 'GDPR', status: 'Compliant', score: 89 },
              { regulation: 'CCPA', status: 'Partial', score: 67 },
              { regulation: 'SOX', status: 'Compliant', score: 94 },
              { regulation: 'HIPAA', status: 'Non-Applicable', score: null },
              { regulation: 'EU AI Act', status: 'In Progress', score: 34 },
              { regulation: 'ISO 27001', status: 'Compliant', score: 91 },
            ].map((item) => (
              <div key={item.regulation} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.regulation}</h4>
                  <Badge 
                    variant={
                      item.status === 'Compliant' ? 'success' :
                      item.status === 'Partial' || item.status === 'In Progress' ? 'warning' :
                      'default'
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>
                {item.score && (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.score >= 75 ? 'bg-success-500' :
                          item.score >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{item.score}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}