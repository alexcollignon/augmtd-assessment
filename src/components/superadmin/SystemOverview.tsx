import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { superadminAuthService } from '@/lib/superadminAuth'
import { Building, Users, UserCheck, FileText, Activity, Clock } from 'lucide-react'

interface SystemStats {
  totalCompanies: number
  totalCohorts: number
  totalAdminUsers: number
  totalAssessments: number
}

export function SystemOverview() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSystemStats()
  }, [])

  const loadSystemStats = async () => {
    try {
      const systemStats = await superadminAuthService.getSystemStats()
      setStats(systemStats)
    } catch (error) {
      console.error('Failed to load system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
            <p className="text-gray-600 mt-1">Platform health and key metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-1">Platform health and key metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Companies"
          value={stats?.totalCompanies || 0}
          icon={<Building className="w-8 h-8 text-blue-600" />}
          subtitle="Active organizations"
        />
        <MetricCard
          title="Assessment Cohorts"
          value={stats?.totalCohorts || 0}
          icon={<Users className="w-8 h-8 text-green-600" />}
          subtitle="Including workshops"
        />
        <MetricCard
          title="Admin Users"
          value={stats?.totalAdminUsers || 0}
          icon={<UserCheck className="w-8 h-8 text-purple-600" />}
          subtitle="System administrators"
        />
        <MetricCard
          title="Assessments Completed"
          value={stats?.totalAssessments || 0}
          icon={<FileText className="w-8 h-8 text-orange-600" />}
          subtitle="Total submissions"
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assessment Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Running</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dashboard APIs</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">New company registered</p>
                  <p className="text-gray-500">Enterprise Corp - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Workshop cohort created</p>
                  <p className="text-gray-500">Q4 Leadership Assessment - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Admin user added</p>
                  <p className="text-gray-500">sarah.manager@company.com - 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Assessment template updated</p>
                  <p className="text-gray-500">AI Readiness v2.1 - 2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <Building className="w-8 h-8 text-blue-600 mb-3 group-hover:text-blue-700" />
              <h3 className="font-medium text-gray-900 mb-1">Add Company</h3>
              <p className="text-sm text-gray-600">Create new organization</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
              <Users className="w-8 h-8 text-green-600 mb-3 group-hover:text-green-700" />
              <h3 className="font-medium text-gray-900 mb-1">Create Cohort</h3>
              <p className="text-sm text-gray-600">Setup new assessment batch</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group">
              <UserCheck className="w-8 h-8 text-purple-600 mb-3 group-hover:text-purple-700" />
              <h3 className="font-medium text-gray-900 mb-1">Add Admin</h3>
              <p className="text-sm text-gray-600">Create administrator account</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}