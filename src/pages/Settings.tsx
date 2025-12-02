import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Settings as SettingsIcon,
  Search,
  Check,
  X,
  Database,
  Shield,
  Bell,
  User,
  Globe
} from 'lucide-react'

export function Settings() {
  const [activeTab, setActiveTab] = useState('ai-tools')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // AI Tool Management State
  const [toolApprovals, setToolApprovals] = useState([
    { tool: 'ChatGPT', usage: 'High', risk: 'Medium', users: 127, approved: false, detected: true },
    { tool: 'Claude', usage: 'Medium', risk: 'Low', users: 43, approved: true, detected: true },
    { tool: 'GitHub Copilot', usage: 'High', risk: 'Low', users: 89, approved: true, detected: true },
    { tool: 'Grammarly AI', usage: 'Medium', risk: 'Low', users: 156, approved: true, detected: true },
    { tool: 'Midjourney', usage: 'Low', risk: 'High', users: 12, approved: false, detected: true },
  ])

  // Categorized AI tools
  const aiToolCategories = {
    'Chat & Communication': [
      'ChatGPT', 'Claude', 'Google Bard', 'Perplexity AI', 'Character.AI', 'Microsoft Copilot'
    ],
    'Development & Code': [
      'GitHub Copilot', 'Tabnine', 'Replit AI', 'Sourcegraph Cody', 'Cursor', 'Amazon CodeWhisperer'
    ],
    'Writing & Content': [
      'Grammarly AI', 'Jasper AI', 'Copy.ai', 'Writesonic', 'Rytr', 'Notion AI', 'Quillbot'
    ],
    'Image & Design': [
      'Midjourney', 'DALL-E', 'Stable Diffusion', 'Adobe Firefly', 'Canva AI', 'Figma AI', 'Runway ML'
    ],
    'Video & Audio': [
      'Synthesia', 'Murf AI', 'ElevenLabs', 'Loom AI', 'Descript', 'Pictory', 'InVideo AI', 'Lumen5'
    ],
    'Productivity & Tools': [
      'Notion AI', 'Calendly AI', 'Motion', 'Reclaim AI', 'Otter.ai', 'Krisp', 'Speechify'
    ],
    'Translation & Language': [
      'DeepL', 'Google Translate', 'Reverso AI', 'Linguee'
    ],
    'Presentation & Slides': [
      'Tome', 'Beautiful.AI', 'Gamma', 'Simplified AI', 'Decktopus'
    ],
    'SEO & Marketing': [
      'Surfer AI', 'Frase', 'MarketMuse', 'Semrush AI', 'Ahrefs AI'
    ],
    'Research & Analysis': [
      'Consensus', 'Elicit', 'ResearchRabbit', 'Semantic Scholar', 'Connected Papers'
    ]
  }

  const handleToolApproval = (toolName: string) => {
    setToolApprovals(prev => 
      prev.map(tool => 
        tool.tool === toolName 
          ? { ...tool, approved: !tool.approved }
          : tool
      )
    )
  }

  const addToolToApprovedList = (toolName: string) => {
    if (!toolApprovals.find(tool => tool.tool === toolName)) {
      setToolApprovals(prev => [...prev, {
        tool: toolName,
        usage: 'Low', 
        risk: 'Low',
        users: 0,
        approved: true,
        detected: false
      }])
    }
  }

  const getAvailableToolsByCategory = () => {
    if (selectedCategory === 'All') {
      return Object.entries(aiToolCategories).map(([category, tools]) => ({
        category,
        tools: searchTerm 
          ? tools.filter(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
          : tools
      })).filter(({ tools }) => tools.length > 0)
    } else {
      const tools = aiToolCategories[selectedCategory] || []
      return [{
        category: selectedCategory,
        tools: searchTerm 
          ? tools.filter(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
          : tools
      }]
    }
  }

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  const tabs = [
    { id: 'ai-tools', label: 'AI Tools', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const renderAIToolsTab = () => (
    <div className="space-y-8">
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          {Object.keys(aiToolCategories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* AI Tools Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 text-blue-600 mr-2" />
            AI Tool Approval Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Browse AI tools and manage approval status. Green = Approved, Red = Blocked, Gray = Not in use.
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-y-auto">
            {getAvailableToolsByCategory().map(({ category, tools }) => (
              <div key={category} className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                  {category}
                  <span className="ml-2 text-xs text-gray-500 normal-case">
                    ({tools.length} tools)
                  </span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tools.map((tool) => {
                    const existingTool = toolApprovals.find(existing => existing.tool === tool)
                    const isApproved = existingTool?.approved || false
                    const isDetected = existingTool?.detected || false
                    
                    return (
                      <button
                        key={tool}
                        onClick={() => {
                          if (existingTool) {
                            // Tool exists - toggle approval or remove if not detected
                            if (isDetected) {
                              handleToolApproval(tool)
                            } else {
                              // Pre-approved tool - remove it
                              setToolApprovals(prev => prev.filter(t => t.tool !== tool))
                            }
                          } else {
                            // Tool doesn't exist - add as approved
                            addToolToApprovedList(tool)
                          }
                        }}
                        className={`p-3 text-left border-2 rounded-lg transition-all relative group ${
                          existingTool
                            ? isApproved 
                              ? 'border-green-300 bg-green-50 hover:bg-green-100'
                              : 'border-red-300 bg-red-50 hover:bg-red-100'
                            : 'border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            existingTool
                              ? isApproved ? 'text-green-800' : 'text-red-800'
                              : 'text-gray-900'
                          }`}>
                            {tool}
                          </span>
                          
                          {/* Status indicator */}
                          <div className="flex items-center space-x-1">
                            {existingTool ? (
                              <>
                                {isApproved ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                                {isDetected && existingTool.users > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {existingTool.users} users
                                  </span>
                                )}
                              </>
                            ) : (
                              <div className="w-4 h-4 border border-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </div>
                        
                        {/* Action hint */}
                        <div className="mt-1">
                          {existingTool ? (
                            <span className="text-xs text-gray-500">
                              {isDetected 
                                ? `Click to ${isApproved ? 'block' : 'approve'}` 
                                : `Click to remove${isApproved ? ' (pre-approved)' : ''}`
                              }
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to approve
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your AI governance settings and organizational preferences
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ai-tools' && renderAIToolsTab()}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Security configuration options will be available here.</p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Notification settings will be available here.</p>
            </CardContent>
          </Card>
        )}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Profile management options will be available here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}