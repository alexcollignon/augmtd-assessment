import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedAssessment } from './components/ProtectedAssessment'
import { AssessmentPlaceholder } from './components/AssessmentPlaceholder'
import { AuthProvider } from './contexts/AuthContext'
import { AssessmentProvider } from './contexts/AssessmentContext'
import { getAppMode, handleNavigation, AppMode } from './router'

// Page Components
import { ExecutiveSummary } from './pages/overview/ExecutiveSummary'
import { AIReadiness } from './pages/AIReadiness'
import { RiskCompliance } from './pages/overview/RiskCompliance'
import { AutomationPipeline } from './pages/AutomationPipeline'

import { AIUseCases } from './pages/AIUseCases'
import { PeopleSkills } from './pages/PeopleSkills'
import { ProcessInsights } from './pages/ProcessInsights'
import { AssessmentData } from './pages/AssessmentData'

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('executive-summary')

  const renderContent = () => {
    switch (currentPage) {
      case 'executive-summary':
        return <ExecutiveSummary />
      case 'ai-readiness':
        return <AIReadiness />
      case 'ai-use-cases':
        return <AIUseCases />
      case 'risk-compliance':
        return <RiskCompliance />
      case 'process-insights':
        return <ProcessInsights />
      case 'automation-pipeline':
        return <AutomationPipeline />
      case 'people-skills':
        return <PeopleSkills />
      case 'assessment-data':
        return <AssessmentData />
      
      default:
        return <ExecutiveSummary />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
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
          <AssessmentPlaceholder />
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