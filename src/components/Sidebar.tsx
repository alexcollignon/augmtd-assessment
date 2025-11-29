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
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavigationCategory } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  currentCategory: NavigationCategory
  currentTab: string
  onCategoryChange: (category: NavigationCategory) => void
  onTabChange: (tab: string) => void
}

const navigationStructure = {
  overview: {
    label: 'OVERVIEW',
    icon: BarChart3,
    tabs: [
      { id: 'executive-summary', label: 'Executive Summary', icon: Target },
      { id: 'company-maturity', label: 'AI Maturity', icon: Building2 },
      { id: 'risk-compliance', label: 'Risk & Compliance', icon: ShieldCheck },
      { id: 'roadmap', label: 'Automation Roadmap', icon: Map },
    ]
  },
  capabilities: {
    label: 'CAPABILITIES',
    icon: Brain,
    tabs: [
      { id: 'ai-pillars', label: 'AI Pillars', icon: Brain },
      { id: 'skills-proficiency', label: 'Skills & Proficiency', icon: Users },
      { id: 'department-maturity', label: 'Department Maturity', icon: Building2 },
      { id: 'persona-insights', label: 'Persona Insights', icon: User },
      { id: 'progress-time', label: 'Progress Over Time', icon: TrendingUp },
    ]
  },
  operations: {
    label: 'OPERATIONS',
    icon: Workflow,
    tabs: [
      { id: 'workflow-insights', label: 'Workflow Insights', icon: Workflow },
      { id: 'inefficiency-heatmap', label: 'Inefficiency Heatmap', icon: Flame },
      { id: 'automation-opportunities', label: 'Automation Opportunities', icon: Zap },
      { id: 'opportunity-map', label: 'Opportunity Map', icon: MapPin },
      { id: 'time-cost-savings', label: 'Time & Cost Savings', icon: Clock },
      { id: 'adoption-patterns', label: 'Adoption Patterns', icon: UserCheck },
      { id: 'investment-economics', label: 'Investment & Economics', icon: DollarSign },
    ]
  },
  assessments: {
    label: 'ASSESSMENTS',
    icon: FileText,
    tabs: [
      { id: 'cohort-overview', label: 'Cohort Overview', icon: Users },
      { id: 'assessment-explorer', label: 'Assessment Explorer', icon: Search },
      { id: 'individual-responses', label: 'Individual Responses', icon: UserCircle },
      { id: 'exports', label: 'Exports', icon: Download },
    ]
  }
}

export function Sidebar({ currentCategory, currentTab, onCategoryChange, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth()
  
  return (
    <div className="w-72 bg-navy-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-navy-700">
        <h1 className="text-xl font-bold text-white">AIR Dashboard</h1>
        <p className="text-navy-300 text-sm mt-1">AI Readiness & Due Diligence</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        {Object.entries(navigationStructure).map(([categoryKey, category]) => {
          const CategoryIcon = category.icon
          const isActiveCategory = currentCategory === categoryKey
          
          return (
            <div key={categoryKey} className="mb-6">
              <button
                onClick={() => onCategoryChange(categoryKey as NavigationCategory)}
                className={cn(
                  'w-full flex items-center px-6 py-3 text-left font-semibold text-xs uppercase tracking-wider transition-colors',
                  isActiveCategory ? 'bg-navy-800 text-white' : 'text-navy-300 hover:text-white hover:bg-navy-800'
                )}
              >
                <CategoryIcon className="w-4 h-4 mr-3" />
                {category.label}
              </button>
              
              {isActiveCategory && (
                <div className="bg-navy-800">
                  {category.tabs.map((tab) => {
                    const TabIcon = tab.icon
                    const isActiveTab = currentTab === tab.id
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                          'w-full flex items-center px-8 py-2.5 text-left text-sm transition-colors',
                          isActiveTab 
                            ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                            : 'text-navy-300 hover:text-white hover:bg-navy-700'
                        )}
                      >
                        <TabIcon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      
      <div className="p-6 border-t border-navy-700 space-y-4">
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