import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { superadminAuthService } from '@/lib/superadminAuth'
import { Plus, Building, Globe, Users, Calendar, Edit, Trash } from 'lucide-react'

interface Company {
  id: string
  name: string
  domain: string | null
  logo_url: string | null
  primary_color: string
  created_at: string
  updated_at: string
}

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    primaryColor: '#3B82F6'
  })

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const data = await superadminAuthService.getCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsCreating(true)
    try {
      const newCompany = await superadminAuthService.createCompany({
        name: formData.name.trim(),
        domain: formData.domain.trim() || undefined,
        primaryColor: formData.primaryColor
      })

      setCompanies([newCompany, ...companies])
      setShowCreateForm(false)
      setFormData({ name: '', domain: '', primaryColor: '#3B82F6' })
    } catch (error) {
      console.error('Failed to create company:', error)
      alert('Failed to create company. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete company "${companyName}"? This will also delete all associated cohorts and may affect admin users. This action cannot be undone.`)) {
      return
    }

    try {
      await superadminAuthService.deleteCompany(companyId)
      await loadCompanies() // Reload to get updated data
    } catch (error) {
      console.error('Failed to delete company:', error)
      alert('Failed to delete company. It may have associated data that prevents deletion.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg animate-pulse"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600 mt-1">Manage organizations and their settings</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Create Company Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Company</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., company.com"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Brand color for this company's interface</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Company'}
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

      {/* Companies List */}
      <div className="space-y-4">
        {companies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
              <p className="text-gray-600 mb-4">Create your first company to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Company
              </button>
            </CardContent>
          </Card>
        ) : (
          companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: company.primary_color + '20' }}
                    >
                      <Building 
                        className="w-6 h-6" 
                        style={{ color: company.primary_color }} 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        {company.domain && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{company.domain}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(company.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit company">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCompany(company.id, company.name)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete company"
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