import React from 'react'
import { useAssessment } from '../contexts/AssessmentContext'
import { AssessmentAccessPage } from './AssessmentAccessPage'

interface ProtectedAssessmentProps {
  children: React.ReactNode
}

export function ProtectedAssessment({ children }: ProtectedAssessmentProps) {
  const { isAuthenticated, isLoading } = useAssessment()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AssessmentAccessPage />
  }

  return <>{children}</>
}