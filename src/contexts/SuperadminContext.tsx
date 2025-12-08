import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SuperadminUser, superadminAuthService } from '@/lib/superadminAuth'

interface SuperadminContextType {
  user: SuperadminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const SuperadminContext = createContext<SuperadminContextType | undefined>(undefined)

export function useSuperadmin() {
  const context = useContext(SuperadminContext)
  if (context === undefined) {
    throw new Error('useSuperadmin must be used within a SuperadminProvider')
  }
  return context
}

interface SuperadminProviderProps {
  children: ReactNode
}

export function SuperadminProvider({ children }: SuperadminProviderProps) {
  const [user, setUser] = useState<SuperadminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = () => {
    try {
      const storedSession = localStorage.getItem('air_superadmin_session')
      if (storedSession) {
        const sessionData = JSON.parse(storedSession)
        setUser(sessionData)
      }
    } catch (error) {
      console.error('Failed to load superadmin session:', error)
      logout()
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const userData = await superadminAuthService.login(email, password)
      
      if (userData) {
        setUser(userData)
        localStorage.setItem('air_superadmin_session', JSON.stringify(userData))
        console.log('Superadmin login successful')
        return true
      } else {
        console.log('Superadmin login failed')
        return false
      }
    } catch (error) {
      console.error('Superadmin login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('air_superadmin_session')
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <SuperadminContext.Provider value={value}>
      {children}
    </SuperadminContext.Provider>
  )
}