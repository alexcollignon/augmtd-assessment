import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { navigateToAssessment } from '../router'
import { Brain, Shield, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError('Invalid email or password')
    }
  }

  const demoAccounts = [
    { email: 'admin@airplatform.com', password: 'admin123', role: 'Platform Admin' },
    { email: 'cto@company.com', password: 'executive123', role: 'Executive' },
    { email: 'manager@company.com', password: 'manager123', role: 'Department Manager' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center p-4">
      {/* Back to Assessment Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={navigateToAssessment}
          className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assessment
        </button>
      </div>
      
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">AIR Admin Dashboard</h1>
          <p className="text-navy-300 mt-2">Administrative Access Portal</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Secure Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-danger-600 mr-2" />
                  <span className="text-sm text-danger-700">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600 text-center">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{account.role}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <div>Email: {account.email}</div>
                    <div>Password: {account.password}</div>
                  </div>
                  <button
                    onClick={() => {
                      setEmail(account.email)
                      setPassword(account.password)
                      setError('')
                    }}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    disabled={isLoading}
                  >
                    Use this account
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-navy-300 text-sm">
          <p>Secure enterprise platform for AI readiness assessment</p>
          <p className="mt-2">© 2024 AIR Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}