import React, { useState, useEffect } from 'react'
import { useAssessment } from '@/contexts/AssessmentContext'
import { AssessmentSection } from './AssessmentSection'
import { AssessmentResults } from './AssessmentResults'
import { AssessmentNavBar } from '../AssessmentNavBar'
import { Card, CardContent } from '@/components/ui/Card'
import { User, Building2, Target, Brain, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const sectionConfig = [
  { 
    id: 'profile', 
    title: 'Professional Profile', 
    icon: User, 
    description: 'Tell us about your role and background'
  },
  { 
    id: 'strategic', 
    title: 'AI Company Strategy', 
    icon: Target, 
    description: 'How your organization approaches AI'
  },
  { 
    id: 'competence', 
    title: 'AI Fluency Screener', 
    icon: Brain, 
    description: 'Your AI skills and experience'
  }
]

export function Assessment() {
  const { assessmentTemplate, getCurrentSection, setCurrentSection, participant, completeAssessment } = useAssessment()
  const [currentSectionId, setCurrentSectionId] = useState('profile')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const savedSection = getCurrentSection()
    if (savedSection) {
      setCurrentSectionId(savedSection)
    }
  }, [getCurrentSection])

  if (!assessmentTemplate || !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  const currentSectionIndex = sectionConfig.findIndex(s => s.id === currentSectionId)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = async () => {
    const nextIndex = currentSectionIndex + 1
    if (nextIndex < sectionConfig.length) {
      const nextSectionId = sectionConfig[nextIndex].id
      setCurrentSectionId(nextSectionId)
      setCurrentSection(nextSectionId)
      scrollToTop()
    } else {
      // Assessment completed
      try {
        await completeAssessment()
        
        // Redirect to unique URL instead of showing results directly
        const resultsId = localStorage.getItem('air_assessment_results_id')
        if (resultsId) {
          // Navigate to unique assessment URL
          window.history.pushState(null, '', `/a/${resultsId}`)
          window.location.reload()
        } else {
          // Fallback to showing results directly if no results ID
          setShowResults(true)
        }
      } catch (error) {
        console.error('Failed to complete assessment:', error)
        // Show error or fallback to local results
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentSectionIndex - 1
    if (prevIndex >= 0) {
      const prevSectionId = sectionConfig[prevIndex].id
      setCurrentSectionId(prevSectionId)
      setCurrentSection(prevSectionId)
      scrollToTop()
    }
  }

  const handleSectionSelect = (sectionId: string) => {
    setCurrentSectionId(sectionId)
    setCurrentSection(sectionId)
    scrollToTop()
  }

  const getCurrentSectionData = () => {
    switch (currentSectionId) {
      case 'profile':
        return assessmentTemplate.profile
      case 'strategic':
        return assessmentTemplate.strategic
      case 'competence':
        return assessmentTemplate.competence
      default:
        return assessmentTemplate.profile
    }
  }

  // Show results if assessment is completed
  if (showResults) {
    return <AssessmentResults />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AssessmentNavBar 
        subtitle={`${assessmentTemplate.name} • ${participant.email}`}
        showAdminButton={false}
        showBackButton={true}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Section Navigation Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectionConfig.map((section, index) => {
              const Icon = section.icon
              const isActive = currentSectionId === section.id
              const isCompleted = index < currentSectionIndex
              const isAccessible = index <= currentSectionIndex

              return (
                <button
                  key={section.id}
                  onClick={() => isAccessible && handleSectionSelect(section.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex flex-col items-center space-y-3 px-4 py-6 rounded-lg border-2 transition-all",
                    isActive 
                      ? "border-blue-500 bg-blue-50 text-blue-900" 
                      : isCompleted
                        ? "border-green-500 bg-green-50 text-green-900 hover:bg-green-100"
                        : isAccessible
                          ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                  )}>
                    {isCompleted ? (
                      <FileCheck className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm mb-1">{section.title}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Current Section */}
        <AssessmentSection
          sectionId={currentSectionId}
          section={getCurrentSectionData()}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstSection={currentSectionIndex === 0}
          isLastSection={currentSectionIndex === sectionConfig.length - 1}
        />
      </div>
    </div>
  )
}