import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { superadminAuthService } from '@/lib/superadminAuth'
import { Plus, Users, Building, Calendar, FileText, Edit, Trash } from 'lucide-react'

interface Cohort {
  id: string
  name: string
  access_code: string
  description: string | null
  company_id: string | null
  template_id: string
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
  companies?: { id: string; name: string } | null
  assessment_templates?: { id: string; name: string } | null
}

interface Company {
  id: string
  name: string
}

interface Template {
  id: string
  name: string
}

export function CohortManagement() {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    accessCode: '',
    description: '',
    companyId: '',
    templateId: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cohortsData, companiesData, templatesData] = await Promise.all([
        superadminAuthService.getCohorts(),
        superadminAuthService.getCompanies(),
        superadminAuthService.getTemplates()
      ])
      
      setCohorts(cohortsData)
      setCompanies(companiesData)
      setTemplates(templatesData)
      
      // Set default template if available
      if (templatesData.length > 0) {
        setFormData(prev => ({ ...prev, templateId: templatesData[0].id }))
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.accessCode.trim() || !formData.templateId) return

    setIsCreating(true)
    try {
      const newCohort = await superadminAuthService.createCohort({
        name: formData.name.trim(),
        accessCode: formData.accessCode.trim(),
        templateId: formData.templateId,
        companyId: formData.companyId || null,
        description: formData.description.trim() || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      })

      await loadData() // Reload to get full data with relationships
      setShowCreateForm(false)
      setFormData({
        name: '',
        accessCode: '',
        description: '',
        companyId: '',
        templateId: templates[0]?.id || '',
        startDate: '',
        endDate: ''
      })
    } catch (error) {
      console.error('Failed to create cohort:', error)
      alert('Failed to create cohort. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const generateAccessCode = () => {
    const timestamp = Date.now().toString().slice(-4)
    const randomCode = `AIR-2024-${timestamp}`
    setFormData(prev => ({ ...prev, accessCode: randomCode }))
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCohortType = (cohort: Cohort) => {
    return cohort.company_id ? 'Company' : 'Workshop'
  }

  const handleDeleteCohort = async (cohortId: string, cohortName: string) => {
    if (!window.confirm(`Are you sure you want to delete cohort "${cohortName}"? This will delete all associated assessment data. This action cannot be undone.`)) {
      return
    }

    try {
      await superadminAuthService.deleteCohort(cohortId)
      await loadData() // Reload to get updated data
    } catch (error) {
      console.error('Failed to delete cohort:', error)
      alert('Failed to delete cohort. It may have associated assessment data that prevents deletion.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Cohort Management</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cohort Management</h1>
          <p className="text-gray-600 mt-1">Manage assessment batches and workshops</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Cohort
        </button>
      </div>

      {/* Create Cohort Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assessment Cohort</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCohort} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cohort Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Q1 2024 Leadership Assessment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., AIR-2024-Q1"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateAccessCode}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description of this assessment batch"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Cross-company workshop</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank for workshops with participants from multiple companies
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Template *
                  </label>
                  <select
                    value={formData.templateId}
                    onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Cohort'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Cohorts List */}
      <div className="space-y-4">
        {cohorts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts yet</h3>
              <p className="text-gray-600 mb-4">Create your first assessment cohort to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Cohort
              </button>
            </CardContent>
          </Card>
        ) : (
          cohorts.map((cohort) => (
            <Card key={cohort.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
                        <Badge variant={getCohortType(cohort) === 'Workshop' ? 'secondary' : 'primary'}>
                          {getCohortType(cohort)}
                        </Badge>
                        <Badge variant={cohort.status === 'active' ? 'success' : 'secondary'}>
                          {cohort.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Access Code:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{cohort.access_code}</code>
                        </div>
                        {cohort.companies && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span>{cohort.companies.name}</span>
                          </div>
                        )}
                        {cohort.assessment_templates && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{cohort.assessment_templates.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(cohort.created_at)}</span>
                        </div>
                      </div>
                      
                      {cohort.description && (
                        <p className="text-sm text-gray-600 mt-2">{cohort.description}</p>
                      )}
                      
                      {(cohort.start_date || cohort.end_date) && (
                        <div className="flex gap-4 text-sm text-gray-600 mt-2">
                          {cohort.start_date && (
                            <span>Starts: {formatDate(cohort.start_date)}</span>
                          )}
                          {cohort.end_date && (
                            <span>Ends: {formatDate(cohort.end_date)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit cohort">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCohort(cohort.id, cohort.name)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete cohort"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}