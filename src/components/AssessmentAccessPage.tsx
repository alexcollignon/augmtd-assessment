import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { useAssessment } from '../contexts/AssessmentContext'
import { navigateToAdmin } from '../router'
import { 
  Brain, 
  Key, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Building2, 
  Settings, 
  GraduationCap, 
  ArrowRight,
  Target,
  Clock,
  Shield,
  BarChart3,
  Lightbulb,
  Zap,
  FileText,
  Award
} from 'lucide-react'
import { AssessmentNavBar } from './AssessmentNavBar'

export function AssessmentAccessPage() {
  const [email, setEmail] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const { accessAssessment, isLoading } = useAssessment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !accessCode) {
      setError('Please enter both your work email and access code')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid work email address')
      return
    }

    const success = await accessAssessment(email, accessCode)
    if (!success) {
      setError('Invalid email or access code. Please check your credentials and try again.')
    }
  }

  const handleELearningClick = () => {
    alert('AI eLearning Platform - Coming Soon!\n\nAccess comprehensive AI training including:\n• Interactive AI use cases library\n• PowerPrompts collection & tools\n• Enterprise training modules\n• Hands-on AI implementation guides')
  }

  const demoParticipants = [
    { 
      email: 'john.smith@company.com', 
      accessCode: 'ASS2024001'
    },
    { 
      email: 'sarah.jones@company.com', 
      accessCode: 'ASS2024002'
    },
    { 
      email: 'mike.wilson@company.com', 
      accessCode: 'ASS2024003'
    },
    { 
      email: 'lisa.chen@company.com', 
      accessCode: 'ASS2024004'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AssessmentNavBar 
        showAdminButton={true}
        subtitle="Enterprise AI Due Diligence & Transformation Platform"
      />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-5xl">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your AI Assessment</h1>
            <p className="text-base text-gray-600 mb-1">Enterprise AI Due Diligence & Transformation Evaluation</p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Evaluate your organization's AI maturity, identify opportunities, and receive personalized recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Benefits & eLearning */}
            <div className="space-y-8">
              {/* Key Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Benefits</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-air-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-air-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Strategic Insights</h3>
                      <p className="text-sm text-gray-600">AI maturity assessment across six critical pillars: Strategy, Cost, Organization, Technology, Data, and Security.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-air-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-air-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Opportunity Discovery</h3>
                      <p className="text-sm text-gray-600">Identify workflow inefficiencies and automation opportunities that can deliver measurable ROI.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-air-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-air-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Personalized Results</h3>
                      <p className="text-sm text-gray-600">Receive tailored recommendations and implementation paths based on your role and organizational context.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* eLearning Access */}
              <Card 
                className="border-air-purple-200 bg-gradient-to-br from-air-purple-50 to-air-blue-50 hover:from-air-purple-100 hover:to-air-blue-100 transition-all cursor-pointer shadow-lg" 
                onClick={handleELearningClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-air-purple-900 mb-2">AI eLearning Platform</h3>
                      <p className="text-air-purple-700 mb-3">Access comprehensive AI training, use cases library, and PowerPrompts collection</p>
                      <div className="flex items-center text-air-purple-600">
                        <span className="font-medium mr-2">Explore Training Resources</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Assessment Form & Details */}
            <div className="space-y-8">
              {/* Access Form */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-14 h-14 bg-air-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Key className="w-7 h-7 text-air-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Begin Your Assessment</CardTitle>
                  <p className="text-gray-600">Enter your credentials to access your personalized AI readiness evaluation</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Work Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-air-purple-500 focus:border-air-purple-500 transition-all text-base"
                        placeholder="your.name@company.com"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="accessCode" className="block text-sm font-semibold text-gray-700 mb-3">
                        Assessment Access Code
                      </label>
                      <input
                        type="text"
                        id="accessCode"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-air-purple-500 focus:border-air-purple-500 transition-all text-base font-mono tracking-wider"
                        placeholder="ASS2024XXX"
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-700 font-medium">Access Error</p>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-purple-300 disabled:to-blue-300 text-white font-semibold py-4 px-6 rounded-xl transition-all focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Verifying Access...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Target className="w-5 h-5 mr-2" />
                          Begin AI Assessment
                        </div>
                      )}
                    </button>
                  </form>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Demo Accounts - Compact */}
          <Card className="mt-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600 text-center flex items-center justify-center">
                <Users className="w-4 h-4 mr-2" />
                Demo Test Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {demoParticipants.slice(0, 4).map((participant, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setEmail(participant.email)
                      setAccessCode(participant.accessCode)
                      setError('')
                    }}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                    disabled={isLoading}
                  >
                    <div className="text-xs font-medium text-gray-900">{participant.email}</div>
                    <div className="text-xs text-blue-600 mt-1">{participant.accessCode}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}