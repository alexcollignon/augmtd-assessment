import React from 'react'
import { Settings, LogOut, ArrowLeft, Shield } from 'lucide-react'
import { AIRLogo } from './ui/AIRLogo'
import { navigateToAdmin, navigateToHome, navigateToSuperadmin } from '../router'

interface AssessmentNavBarProps {
  showAdminButton?: boolean
  showSuperadminButton?: boolean
  showLogoutButton?: boolean
  showBackButton?: boolean
  onLogout?: () => void
  onBack?: () => void
  subtitle?: string
}

export function AssessmentNavBar({ 
  showAdminButton = true, 
  showSuperadminButton = false,
  showLogoutButton = false,
  showBackButton = false,
  onLogout,
  onBack,
  subtitle = "AI Readiness Assessment Platform"
}: AssessmentNavBarProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <AIRLogo size="md" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900">AI Readiness Assessment</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={onBack || navigateToHome}
                className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exit Assessment</span>
                <span className="sm:hidden">Exit</span>
              </button>
            )}
            
            {showAdminButton && (
              <button
                onClick={navigateToAdmin}
                className="flex items-center px-4 py-2 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Intelligence Platform for Organizational Transformation</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}
            
            {showSuperadminButton && (
              <button
                onClick={navigateToSuperadmin}
                className="flex items-center px-3 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all"
              >
                <Shield className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Superadmin</span>
                <span className="sm:hidden">Super</span>
              </button>
            )}
            
            {showLogoutButton && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exit Assessment</span>
                <span className="sm:hidden">Exit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}