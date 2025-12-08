import React from 'react'
import { Shield, Building, Users, UserCheck, BarChart3 } from 'lucide-react'

type SuperadminPage = 'overview' | 'companies' | 'cohorts' | 'admins'

interface SuperadminSidebarProps {
  currentPage: SuperadminPage
  onPageChange: (page: SuperadminPage) => void
}

export function SuperadminSidebar({ currentPage, onPageChange }: SuperadminSidebarProps) {
  const menuItems = [
    {
      id: 'overview' as SuperadminPage,
      label: 'System Overview',
      icon: BarChart3,
      description: 'Platform metrics and statistics'
    },
    {
      id: 'companies' as SuperadminPage,
      label: 'Companies',
      icon: Building,
      description: 'Manage organizations'
    },
    {
      id: 'cohorts' as SuperadminPage,
      label: 'Cohorts',
      icon: Users,
      description: 'Assessment batches & workshops'
    },
    {
      id: 'admins' as SuperadminPage,
      label: 'Admin Users',
      icon: UserCheck,
      description: 'Manage administrators'
    }
  ]

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AIR Platform</h2>
            <p className="text-xs text-slate-400">System Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <p>System Administration</p>
          <p className="text-slate-500">v1.0.0</p>
        </div>
      </div>
    </div>
  )
}