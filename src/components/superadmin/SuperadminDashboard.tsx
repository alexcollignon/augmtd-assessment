import React, { useState } from 'react'
import { useSuperadmin } from '@/contexts/SuperadminContext'
import { SuperadminSidebar } from './SuperadminSidebar'
import { SystemOverview } from './SystemOverview'
import { CompanyManagement } from './CompanyManagement'
import { CohortManagement } from './CohortManagement'
import { AdminUserManagement } from './AdminUserManagement'
import { LogOut } from 'lucide-react'

type SuperadminPage = 'overview' | 'companies' | 'cohorts' | 'admins'

export function SuperadminDashboard() {
  const { user, logout } = useSuperadmin()
  const [currentPage, setCurrentPage] = useState<SuperadminPage>('overview')

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <SystemOverview />
      case 'companies':
        return <CompanyManagement />
      case 'cohorts':
        return <CohortManagement />
      case 'admins':
        return <AdminUserManagement />
      default:
        return <SystemOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SuperadminSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Superadmin Dashboard</h1>
              <p className="text-sm text-gray-600">System Administration & Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  )
}