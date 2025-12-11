import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'executive' | 'manager'
  department?: string
  company_id?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const storedUser = localStorage.getItem('air_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        // Verify user still exists in database
        const { data } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userData.id)
          .eq('is_active', true)
          .single()
        
        if (data) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            department: data.department,
            company_id: data.company_id
          })
        } else {
          localStorage.removeItem('air_user')
        }
      }
    } catch (error) {
      console.error('Session check failed:', error)
      localStorage.removeItem('air_user')
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Query admin user from database
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single()

      if (error || !adminUser) {
        setIsLoading(false)
        return false
      }

      let validPassword = false

      // Check if this is a demo account (hardcoded passwords)
      const demoAccounts = [
        { email: 'admin@airplatform.com', password: 'admin123' }
      ]

      const demoAccount = demoAccounts.find(acc => acc.email === adminUser.email)
      
      if (demoAccount) {
        // Demo account - use hardcoded password
        validPassword = password === demoAccount.password
      } else {
        // Real account - use bcrypt to verify hashed password
        if (adminUser.password_hash) {
          validPassword = await bcrypt.compare(password, adminUser.password_hash)
        }
      }
      
      if (validPassword) {
        const userData: User = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          department: adminUser.department,
          company_id: adminUser.company_id
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', adminUser.id)

        setUser(userData)
        localStorage.setItem('air_user', JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('air_user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}