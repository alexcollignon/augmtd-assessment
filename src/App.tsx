import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedAssessment } from './components/ProtectedAssessment'
import { Assessment } from './components/assessment/Assessment'
import { AuthProvider } from './contexts/AuthContext'
import { AssessmentProvider } from './contexts/AssessmentContext'
import { SuperadminProvider, useSuperadmin } from './contexts/SuperadminContext'
import { getAppMode, handleNavigation, AppMode, getAssessmentIdFromUrl, navigateToLogin } from './router'
import { AssessmentAccessPage } from './components/AssessmentAccessPage'
import { UniqueAssessmentView } from './components/UniqueAssessmentView'
import { SuperadminDashboard } from './components/superadmin/SuperadminDashboard'
import { UnifiedLoginPage } from './components/UnifiedLoginPage'

// Page Components
import { ExecutiveSummary } from './pages/overview/ExecutiveSummary'
import { AIReadiness } from './pages/AIReadiness'
import { RiskCompliance } from './pages/overview/RiskCompliance'
import { AITransformationPipeline } from './pages/AITransformationPipeline'
import { PeopleSkills } from './pages/PeopleSkills'
import { AssessmentData } from './pages/AssessmentData'
import { Settings } from './pages/Settings'

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('executive-summary')
  const [settingsTab, setSettingsTab] = useState('ai-tools')

  const handleNavigation = (page: string, options?: { settingsTab?: string }) => {
    setCurrentPage(page)
    if (options?.settingsTab) {
      setSettingsTab(options.settingsTab)
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'executive-summary':
        return <ExecutiveSummary onNavigate={handleNavigation} />
      case 'ai-readiness':
        return <AIReadiness />
      case 'ai-transformation':
        return <AITransformationPipeline />
      case 'risk-compliance':
        return <RiskCompliance onNavigate={handleNavigation} />
      case 'people-skills':
        return <PeopleSkills />
      case 'assessment-data':
        return <AssessmentData />
      case 'settings':
        return <Settings initialTab={settingsTab} />
      
      default:
        return <ExecutiveSummary />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => handleNavigation(page)}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

function App() {
  const [appMode, setAppMode] = useState<AppMode>(() => getAppMode())

  useEffect(() => {
    handleNavigation()
    
    const handlePopState = () => {
      setAppMode(getAppMode())
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (appMode === 'assessment') {
    // Check if this is a unique assessment URL
    const assessmentId = getAssessmentIdFromUrl()
    
    if (assessmentId) {
      // Show unique assessment results (no authentication required)
      return <UniqueAssessmentView />
    }
    
    // Regular assessment flow
    return (
      <AssessmentProvider>
        <ProtectedAssessment>
          <Assessment />
        </ProtectedAssessment>
      </AssessmentProvider>
    )
  }

  if (appMode === 'login') {
    return (
      <AuthProvider>
        <SuperadminProvider>
          <UnifiedLoginPage />
        </SuperadminProvider>
      </AuthProvider>
    )
  }

  if (appMode === 'superadmin') {
    return (
      <SuperadminProvider>
        <SuperadminApp />
      </SuperadminProvider>
    )
  }

  if (appMode === 'admin') {
    return (
      <AuthProvider>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </AuthProvider>
    )
  }

  // Default home/landing page
  return <AssessmentAccessPage />
}

function SuperadminApp() {
  const { isAuthenticated, isLoading, user } = useSuperadmin()
  
  console.log('SuperadminApp - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user)
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading superadmin...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    // Redirect to unified login page
    React.useEffect(() => {
      console.log('Not authenticated, redirecting to login')
      navigateToLogin()
    }, [])
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }
  
  console.log('Rendering SuperadminDashboard')
  return <SuperadminDashboard />
}

export default App