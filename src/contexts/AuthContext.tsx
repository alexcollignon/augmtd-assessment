import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'executive' | 'manager'
  department?: string
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
    const storedUser = localStorage.getItem('air_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Demo users for testing
      const demoUsers: Record<string, { password: string; user: User }> = {
        'admin@airplatform.com': {
          password: 'admin123',
          user: {
            id: '1',
            email: 'admin@airplatform.com',
            name: 'Sarah Chen',
            role: 'admin'
          }
        },
        'cto@company.com': {
          password: 'executive123',
          user: {
            id: '2',
            email: 'cto@company.com',
            name: 'Michael Rodriguez',
            role: 'executive',
            department: 'Technology'
          }
        },
        'manager@company.com': {
          password: 'manager123',
          user: {
            id: '3',
            email: 'manager@company.com',
            name: 'Emily Johnson',
            role: 'manager',
            department: 'Operations'
          }
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const userRecord = demoUsers[email]
      if (userRecord && userRecord.password === password) {
        setUser(userRecord.user)
        localStorage.setItem('air_user', JSON.stringify(userRecord.user))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
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