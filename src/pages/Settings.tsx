import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { settingsService, AITool, Department } from '@/lib/settingsService'
import { adminDataScopingService } from '@/lib/adminDataScoping'
import { 
  Settings as SettingsIcon,
  Search,
  Check,
  X,
  Database,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface SettingsProps {
  initialTab?: string
}

export function Settings({ initialTab = 'ai-tools' }: SettingsProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    loadSettingsData()
  }, [user])

  // Department Management State
  const [departments, setDepartments] = useState<Department[]>([])
  const [editingDepartment, setEditingDepartment] = useState<number | null>(null)
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [isAddingDepartment, setIsAddingDepartment] = useState(false)
  const [errors, setErrors] = useState<Record<string | number, string>>({})

  // AI Tool Management State
  const [toolApprovals, setToolApprovals] = useState<AITool[]>([])

  // Load settings data from Supabase
  const loadSettingsData = async () => {
    try {
      setIsLoading(true)
      
      // Get user's company access
      let userCompanyId: string | null = null
      if (user) {
        const adminUser = await adminDataScopingService.getAdminUserWithPermissions(user.email)
        if (adminUser) {
          // For company users, use their direct company_id
          if (adminUser.company_id) {
            userCompanyId = adminUser.company_id
            console.log('Company user found, company_id:', userCompanyId)
          } else {
            // For cohort-only users, we could get company access from cohorts
            // For now, allow operations without company scoping for cohort users
            console.log('Cohort user found (no direct company), operating without company scoping')
          }
        } else {
          console.log('No admin user found for email:', user.email)
        }
      }
      
      setCompanyId(userCompanyId)

      // Load departments and AI tools
      const [departmentsData, aiToolsData] = await Promise.all([
        settingsService.getDepartments(userCompanyId || undefined),
        settingsService.getAITools(userCompanyId || undefined)
      ])

      setDepartments(departmentsData)
      setToolApprovals(aiToolsData)

    } catch (error) {
      console.error('Error loading settings data:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleToolApproval = async (toolName: string) => {
    try {
      const existingTool = toolApprovals.find(tool => tool.tool_name === toolName)
      if (!existingTool) return

      const updatedTool = await settingsService.toggleAIToolApproval(existingTool.id)
      if (updatedTool) {
        setToolApprovals(prev => 
          prev.map(tool => 
            tool.id === updatedTool.id ? updatedTool : tool
          )
        )
      }
    } catch (error) {
      console.error('Error toggling tool approval:', error)
    }
  }

  const addToolToApprovedList = async (toolName: string) => {
    try {
      if (!toolApprovals.find(tool => tool.tool_name === toolName)) {
        // Determine category for the tool
        let category = 'Other'
        for (const [categoryName, tools] of Object.entries(aiToolCategories)) {
          if (tools.includes(toolName)) {
            category = categoryName
            break
          }
        }

        const newTool = await settingsService.createAITool({
          tool_name: toolName,
          category: category,
          usage_level: 'Low',
          risk_level: 'Low',
          user_count: 0,
          approved: true,
          detected: false,
          company_id: companyId || undefined
        })

        if (newTool) {
          setToolApprovals(prev => [...prev, newTool])
        }
      }
    } catch (error) {
      console.error('Error adding tool to approved list:', error)
    }
  }

  const removeToolFromList = async (toolId: number) => {
    try {
      const success = await settingsService.deleteAITool(toolId)
      if (success) {
        setToolApprovals(prev => prev.filter(tool => tool.id !== toolId))
      }
    } catch (error) {
      console.error('Error removing tool:', error)
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

  // Department Management Functions
  const validateDepartmentName = (name: string): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'Department name is required'
    }
    if (trimmed.length < 2) {
      return 'Department name must be at least 2 characters'
    }
    if (trimmed.length > 50) {
      return 'Department name must be less than 50 characters'
    }
    if (departments.some(dept => dept.name.toLowerCase() === trimmed.toLowerCase() && dept.id !== editingDepartment)) {
      return 'Department name already exists'
    }
    return null
  }

  const handleAddDepartment = async () => {
    const error = validateDepartmentName(newDepartmentName)
    if (error) {
      setErrors({ add: error })
      return
    }
    
    try {
      const newDept = await settingsService.createDepartment({
        name: newDepartmentName.trim(),
        company_id: companyId || undefined
      })

      if (newDept) {
        setDepartments([...departments, newDept])
        setNewDepartmentName('')
        setIsAddingDepartment(false)
        setErrors({})
      }
    } catch (error) {
      console.error('Error adding department:', error)
      setErrors({ add: 'Failed to add department. Please try again.' })
    }
  }

  const handleEditDepartment = async (id: number, newName: string) => {
    const error = validateDepartmentName(newName)
    if (error) {
      setErrors({ [id]: error })
      return
    }

    try {
      const updatedDept = await settingsService.updateDepartment(id, { name: newName.trim() })
      if (updatedDept) {
        setDepartments(departments.map(dept => 
          dept.id === id ? updatedDept : dept
        ))
        setEditingDepartment(null)
        setErrors({})
      }
    } catch (error) {
      console.error('Error updating department:', error)
      setErrors({ [id]: 'Failed to update department. Please try again.' })
    }
  }

  const handleDeleteDepartment = async (id: number) => {
    try {
      const success = await settingsService.deleteDepartment(id)
      if (success) {
        setDepartments(departments.filter(dept => dept.id !== id))
        setErrors({})
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      // You could add a toast notification here
    }
  }

  const tabs = [
    { id: 'ai-tools', label: 'AI Tools', icon: Database },
    { id: 'organization', label: 'Organization', icon: Building2 },
  ]

  const renderOrganizationTab = () => (
    <div className="space-y-8">
      {/* Department Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                Department Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configure your organization's departments. These names will appear throughout the dashboard.
              </p>
            </div>
            <button
              onClick={() => {
                setIsAddingDepartment(true)
                setNewDepartmentName('')
                setErrors({})
              }}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Department
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Department Form */}
          {isAddingDepartment && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-3">Add New Department</h5>
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Department name"
                    value={newDepartmentName}
                    onChange={(e) => {
                      setNewDepartmentName(e.target.value)
                      if (errors.add) setErrors({})
                    }}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.add ? 'border-red-300' : 'border-gray-300'
                    }`}
                    maxLength={50}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddDepartment()
                      }
                    }}
                  />
                  {errors.add && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.add}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddDepartment}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsAddingDepartment(false)
                    setNewDepartmentName('')
                    setErrors({})
                  }}
                  className="px-3 py-2 text-gray-600 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Department List */}
          <div className="space-y-3">
            {departments.map((department) => (
              <DepartmentRow
                key={department.id}
                department={department}
                editingDepartment={editingDepartment}
                setEditingDepartment={setEditingDepartment}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                errors={errors}
                setErrors={setErrors}
              />
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )

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
                    const existingTool = toolApprovals.find(existing => existing.tool_name === tool)
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
                              removeToolFromList(existingTool.id)
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
                                {isDetected && existingTool.user_count > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {existingTool.user_count} users
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

  // Department Row Component
  const DepartmentRow = ({ department, editingDepartment, setEditingDepartment, onEdit, onDelete, errors, setErrors }: {
    department: Department
    editingDepartment: number | null
    setEditingDepartment: (id: number | null) => void
    onEdit: (id: number, newName: string) => void
    onDelete: (id: number) => void
    errors: Record<string | number, string>
    setErrors: (errors: Record<string | number, string>) => void
  }) => {
    const [editName, setEditName] = useState(department.name)
    const isEditing = editingDepartment === department.id
    const hasError = errors[department.id]

    const handleSave = () => {
      onEdit(department.id, editName)
    }

    const handleCancel = () => {
      setEditName(department.name)
      setEditingDepartment(null)
      setErrors({})
    }

    const startEdit = () => {
      setEditName(department.name)
      setEditingDepartment(department.id)
      setErrors({})
    }

    return (
      <div className={`p-4 border rounded-lg transition-colors ${
        hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {isEditing ? (
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value)
                    if (hasError) setErrors({})
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={50}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSave()
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-gray-900">{department.name}</h4>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startEdit}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Edit department name"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(department.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {hasError && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {hasError}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your AI governance settings and organizational preferences
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 border-4 border-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

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
        {activeTab === 'organization' && renderOrganizationTab()}
      </div>
    </div>
  )
}