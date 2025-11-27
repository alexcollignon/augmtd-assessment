import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { useAssessment } from '../contexts/AssessmentContext'
import { navigateToAdmin } from '../router'
import { Brain, User, Building2, LogOut, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { AssessmentNavBar } from './AssessmentNavBar'

export function AssessmentPlaceholder() {
  const { participant, logout } = useAssessment()

  if (!participant) return null

  const getStatusIcon = () => {
    switch (participant.assessmentStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-orange-600" />
    }
  }

  const getStatusText = () => {
    switch (participant.assessmentStatus) {
      case 'completed':
        return 'Assessment Completed'
      case 'in_progress':
        return 'Assessment In Progress'
      default:
        return 'Ready to Start'
    }
  }

  const getStatusMessage = () => {
    switch (participant.assessmentStatus) {
      case 'completed':
        return 'Thank you for completing the AI readiness assessment. Your responses have been recorded.'
      case 'in_progress':
        return 'You can continue where you left off. Your progress has been saved.'
      default:
        return 'Welcome! You\'re ready to begin the AI readiness assessment.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AssessmentNavBar 
        showAdminButton={true}
        showLogoutButton={true}
        onLogout={logout}
        subtitle={`${participant.name} - ${participant.department}`}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Participant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-air-blue-600" />
                Participant Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-lg font-medium text-gray-900">{participant.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-lg font-medium text-gray-900">{participant.department}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-lg font-medium text-gray-900">{participant.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Status */}
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getStatusIcon()}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStatusText()}</h2>
                  <p className="text-gray-600 max-w-md mx-auto">{getStatusMessage()}</p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{participant.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-air-purple-500 to-air-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${participant.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Placeholder */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Assessment Interface</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    The assessment questionnaire will be implemented here. This will include 
                    AI knowledge evaluation, workflow analysis, and skill assessments.
                  </p>
                </div>

                <div className="bg-air-blue-50 border border-air-blue-200 rounded-lg p-4 max-w-lg mx-auto">
                  <div className="text-sm text-air-blue-700">
                    <strong>Coming Soon:</strong> Interactive assessment with sections for AI strategy, 
                    technical knowledge, workflow inefficiencies, and automation opportunities.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="bg-gray-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>Session ID: {participant.id}</span>
                  <span>Cohort: {participant.cohortId}</span>
                </div>
                {participant.lastActivity && (
                  <span>Last activity: {new Date(participant.lastActivity).toLocaleString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}