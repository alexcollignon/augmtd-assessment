import React from 'react'
import { 
  BarChart3, 
  Target, 
  ShieldCheck, 
  Map, 
  Brain, 
  Users, 
  Building2, 
  User, 
  TrendingUp,
  Workflow,
  Flame,
  Zap,
  MapPin,
  Clock,
  UserCheck,
  DollarSign,
  FileText,
  Search,
  UserCircle,
  Download,
  LogOut,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationPages = [
  { id: 'executive-summary', label: 'Overview', icon: Target },
  { id: 'ai-readiness', label: 'Company Maturity', icon: Brain },
  { id: 'ai-transformation', label: 'AI Use Cases', icon: Zap },
  { id: 'risk-compliance', label: 'Risk & Compliance', icon: ShieldCheck },
  { id: 'people-skills', label: 'People & Skills', icon: Users },
  { id: 'assessment-data', label: 'Assessment Data', icon: FileText },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user, logout } = useAuth()
  
  return (
    <div className="w-72 bg-navy-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-navy-700">
        <div className="flex items-center">
          <img 
            src="/images/augmtd-logo.png" 
            alt="AUGMTD Dashboard" 
            className="h-20 w-auto"
          />
        </div>
        <p className="text-navy-300 text-sm mt-2">AI Transformation Intelligence</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationPages.map((page) => {
          const PageIcon = page.icon
          const isActivePage = currentPage === page.id
          
          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={cn(
                'w-full flex items-center px-6 py-3 text-left text-sm transition-colors mb-1',
                isActivePage 
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                  : 'text-navy-300 hover:text-white hover:bg-navy-800'
              )}
            >
              <PageIcon className="w-5 h-5 mr-3" />
              {page.label}
            </button>
          )
        })}
      </nav>
      
      <div className="p-6 border-t border-navy-700 space-y-4">
        {/* Settings Button */}
        <button
          onClick={() => onPageChange('settings')}
          className={cn(
            'w-full flex items-center px-3 py-2 text-sm transition-colors rounded-lg mb-3',
            currentPage === 'settings'
              ? 'bg-blue-600 text-white'
              : 'text-navy-300 hover:text-white hover:bg-navy-800'
          )}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </button>
        
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
            <div className="text-xs text-navy-400 truncate">{user?.role}</div>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm text-navy-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
        
        <div className="text-xs text-navy-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}