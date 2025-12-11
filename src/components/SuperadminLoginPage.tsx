import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useSuperadmin } from '@/contexts/SuperadminContext'
import { Shield, AlertTriangle, Eye, EyeOff, LogIn } from 'lucide-react'
import { AIRLogo } from '@/components/ui/AIRLogo'

export function SuperadminLoginPage() {
  const { login, isLoading } = useSuperadmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError('Invalid email or password')
    }
  }

  const handleDemoLogin = () => {
    setEmail('superadmin@airplatform.com')
    setPassword('superadmin123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4 relative">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header with Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ring-2 ring-red-100">
              <AIRLogo size="lg" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">Superadmin portal access</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-800">Superadmin Access</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage companies, cohorts, and admin users
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="superadmin@airplatform.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Demo Account Helper */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Demo Account</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Use Demo Superadmin Credentials
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-blue-200">
            Secure access to platform administration
          </p>
        </div>
      </div>
    </div>
  )
}