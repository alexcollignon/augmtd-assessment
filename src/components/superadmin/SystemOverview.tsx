import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { superadminAuthService } from '@/lib/superadminAuth'
import { Building, Users, UserCheck, FileText, Clock } from 'lucide-react'

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