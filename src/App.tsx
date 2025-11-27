import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedAssessment } from './components/ProtectedAssessment'
import { AssessmentPlaceholder } from './components/AssessmentPlaceholder'
import { AuthProvider } from './contexts/AuthContext'
import { AssessmentProvider } from './contexts/AssessmentContext'
import { getAppMode, handleNavigation, AppMode } from './router'
import { NavigationCategory } from './types'

// Page Components
import { ExecutiveSummary } from './pages/overview/ExecutiveSummary'
import { CompanyMaturity } from './pages/overview/CompanyMaturity'
import { RiskCompliance } from './pages/overview/RiskCompliance'
import { Roadmap } from './pages/overview/Roadmap'

import { AIPillars } from './pages/capabilities/AIPillars'
import { SkillsProficiency } from './pages/capabilities/SkillsProficiency'
import { DepartmentMaturity } from './pages/capabilities/DepartmentMaturity'
import { PersonaInsights } from './pages/capabilities/PersonaInsights'
import { ProgressTime } from './pages/capabilities/ProgressTime'

import { WorkflowInsights } from './pages/operations/WorkflowInsights'
import { InefficiencyHeatmap } from './pages/operations/InefficiencyHeatmap'
import { AutomationOpportunities } from './pages/operations/AutomationOpportunities'
import { OpportunityMap } from './pages/operations/OpportunityMap'
import { TimeCostSavings } from './pages/operations/TimeCostSavings'
import { AdoptionPatterns } from './pages/operations/AdoptionPatterns'
import { InvestmentEconomics } from './pages/operations/InvestmentEconomics'

import { CohortOverview } from './pages/assessments/CohortOverview'
import { AssessmentExplorer } from './pages/assessments/AssessmentExplorer'
import { IndividualResponses } from './pages/assessments/IndividualResponses'
import { Exports } from './pages/assessments/Exports'

function Dashboard() {
  const [currentCategory, setCurrentCategory] = useState<NavigationCategory>('overview')
  const [currentTab, setCurrentTab] = useState('executive-summary')

  const renderContent = () => {
    switch (currentTab) {
      // Overview
      case 'executive-summary':
        return <ExecutiveSummary />
      case 'company-maturity':
        return <CompanyMaturity />
      case 'risk-compliance':
        return <RiskCompliance />
      case 'roadmap':
        return <Roadmap />
      
      // Capabilities
      case 'ai-pillars':
        return <AIPillars />
      case 'skills-proficiency':
        return <SkillsProficiency />
      case 'department-maturity':
        return <DepartmentMaturity />
      case 'persona-insights':
        return <PersonaInsights />
      case 'progress-time':
        return <ProgressTime />
      
      // Operations
      case 'workflow-insights':
        return <WorkflowInsights />
      case 'inefficiency-heatmap':
        return <InefficiencyHeatmap />
      case 'automation-opportunities':
        return <AutomationOpportunities />
      case 'opportunity-map':
        return <OpportunityMap />
      case 'time-cost-savings':
        return <TimeCostSavings />
      case 'adoption-patterns':
        return <AdoptionPatterns />
      case 'investment-economics':
        return <InvestmentEconomics />
      
      // Assessments
      case 'cohort-overview':
        return <CohortOverview />
      case 'assessment-explorer':
        return <AssessmentExplorer />
      case 'individual-responses':
        return <IndividualResponses />
      case 'exports':
        return <Exports />
      
      default:
        return <ExecutiveSummary />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentCategory={currentCategory}
        currentTab={currentTab}
        onCategoryChange={setCurrentCategory}
        onTabChange={setCurrentTab}
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