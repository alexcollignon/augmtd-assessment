import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, AlertCircle, ArrowLeft, LogIn } from 'lucide-react'
import { AIRLogo } from './ui/AIRLogo'

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
    { email: 'admin@airplatform.com', password: 'admin123', role: 'Platform Admin' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-white hover:bg-white/20 shadow-lg transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header with Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl scale-150"></div>
              <div className="relative">
                <AIRLogo size="xl" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Intelligence Platform</h1>
          <p className="text-blue-200 text-lg">Admin Dashboard Access</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-white/60 font-medium"
                    placeholder="admin@company.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-3 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 pr-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder-white/60 font-medium"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/60 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start p-5 bg-red-500/20 border border-red-400/30 rounded-2xl backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-200">Authentication Failed</p>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400/50 disabled:to-purple-400/50 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-400/50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-6 h-6 mr-3" />
                    Access Dashboard
                  </div>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setEmail('admin@airplatform.com')
              setPassword('admin123')
              setError('')
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 border border-white/20 backdrop-blur-sm"
            disabled={isLoading}
          >
            Use Demo Credentials
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm space-y-2">
          <p className="font-medium">Enterprise AI Transformation Intelligence Platform</p>
          <p className="text-xs">© 2024 AUGMTD Intelligence Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}