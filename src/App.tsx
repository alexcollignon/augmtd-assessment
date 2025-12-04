import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedAssessment } from './components/ProtectedAssessment'
import { Assessment } from './components/assessment/Assessment'
import { AuthProvider } from './contexts/AuthContext'
import { AssessmentProvider } from './contexts/AssessmentContext'
import { getAppMode, handleNavigation, AppMode } from './router'

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
    return (
      <AssessmentProvider>
        <ProtectedAssessment>
          <Assessment />
        </ProtectedAssessment>
      </AssessmentProvider>
    )
  }

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App