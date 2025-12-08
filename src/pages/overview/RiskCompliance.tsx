import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardDataService, SecurityHeatmap, ShadowAITool, DepartmentRisk } from '@/lib/dashboardDataService'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  FileText,
  ArrowDown,
  Settings,
  TrendingUp,
  Users
} from 'lucide-react'

interface RiskComplianceProps {
  onNavigate?: (page: string, options?: { settingsTab?: string }) => void
}

export function RiskCompliance({ onNavigate }: RiskComplianceProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [overallRiskScore, setOverallRiskScore] = useState(68)
  const [securityHeatmap, setSecurityHeatmap] = useState<SecurityHeatmap[]>([])
  const [shadowAITools, setShadowAITools] = useState<ShadowAITool[]>([])
  const [departmentRisks, setDepartmentRisks] = useState<DepartmentRisk[]>([])

  useEffect(() => {
    loadRiskData()
  }, [user])

  const loadRiskData = async () => {
    try {
      setIsLoading(true)
      
      const [heatmapData, toolsData, risksData] = await Promise.all([
        dashboardDataService.calculateSecurityHeatmap(user || undefined),
        dashboardDataService.getDetectedAITools(user || undefined),
        dashboardDataService.calculateRiskExposureByDepartment(user || undefined)
      ])

      setSecurityHeatmap(heatmapData)
      setShadowAITools(toolsData)
      setDepartmentRisks(risksData)
      
      // Calculate overall risk score from department data
      if (risksData.length > 0) {
        const avgRisk = risksData.reduce((sum, dept) => sum + dept.exposureLevel, 0) / risksData.length
        setOverallRiskScore(Math.round(100 - avgRisk)) // Invert so higher score = lower risk
      }

    } catch (error) {
      console.error('Error loading risk data:', error)
    } finally {
      setIsLoading(false)
    }
  }


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

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Risk & Compliance</h1>
          <p className="text-gray-600 mt-2">AI risk assessment and Shadow AI monitoring</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading risk analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  const approvedTools = shadowAITools.filter(tool => tool.approved)
  const unauthorizedTools = shadowAITools.filter(tool => !tool.approved)
  const totalUnauthorizedUsers = unauthorizedTools.reduce((sum, tool) => sum + tool.users, 0)
  const highRiskDepartments = securityHeatmap.filter(dept => dept.level === 'High Risk')
  const totalAssessedEmployees = securityHeatmap.reduce((sum, dept) => sum + dept.count, 0)

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Risk & Compliance</h1>
        <p className="text-gray-600 mt-2">
          AI risk assessment and Shadow AI monitoring
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
            <p className="text-gray-600 mb-4">Overall AI risk posture</p>
            <div className="flex items-center justify-center text-gray-400 mt-6 pt-4 border-t border-gray-200">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-xs">Based on {totalAssessedEmployees} assessments</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <AlertTriangle className="w-6 h-6 text-danger-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">High-Risk Departments</p>
            <div className="text-3xl font-bold text-gray-900">{highRiskDepartments.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {highRiskDepartments.length > 0 
                ? highRiskDepartments.slice(0, 2).map(d => d.department).join(', ')
                : 'None identified'
              }
            </p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Approved Tools</p>
            <div className="text-3xl font-bold text-gray-900">{approvedTools.length}</div>
            <p className="text-xs text-gray-500 mt-1">of {shadowAITools.length} detected tools</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center">
          <CardContent className="text-center py-5">
            <Eye className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Shadow AI Users</p>
            <div className="text-3xl font-bold text-gray-900">{totalUnauthorizedUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Unapproved tool usage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Risk Heatmap by Department
            </CardTitle>
            <p className="text-sm text-gray-600">AI risk scores across organizational departments</p>
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

        {/* Shadow AI Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 text-warning-600 mr-2" />
                Shadow AI Tools Overview
              </CardTitle>
              <button 
                onClick={() => onNavigate?.('settings', { settingsTab: 'ai-tools' })}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Go to Settings to manage AI tool approvals"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              AI tools detected in your organization
            </p>
          </CardHeader>
          <CardContent>
            {/* Tools Summary */}
            <div className="space-y-4">
              {shadowAITools.map((tool) => (
                <div key={tool.tool} className={`p-4 rounded-lg border-2 transition-all ${
                  tool.approved 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        tool.approved ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <span className="font-medium text-gray-900">{tool.tool}</span>
                        <p className="text-sm text-gray-600">{tool.users} active users</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getUsageColor(tool.usage)} size="sm">
                        {tool.usage} Usage
                      </Badge>
                      <Badge variant={getRiskBadgeColor(tool.risk)} size="sm">
                        {tool.risk} Risk
                      </Badge>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        tool.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tool.approved ? 'Approved' : 'Unauthorized'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Alert */}
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800 mb-1">Shadow AI Alert</p>
                  <p className="text-sm text-orange-700">
                    {totalUnauthorizedUsers} employees using {unauthorizedTools.length} unauthorized AI tools. 
                    Review and approve tools in Settings to improve compliance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}