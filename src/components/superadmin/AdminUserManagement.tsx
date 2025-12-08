import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { superadminAuthService } from '@/lib/superadminAuth'
import { Plus, UserCheck, Building, Users, Calendar, Mail, Edit, Trash, Eye, EyeOff } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  department: string | null
  company_id: string | null
  is_active: boolean
  created_at: string
  last_login_at: string | null
  companies?: { id: string; name: string } | null
  admin_cohort_access?: Array<{
    id: string
    cohort_id: string
    cohorts: { id: string; name: string } | null
  }>
}

interface Company {
  id: string
  name: string
}

interface Cohort {
  id: string
  name: string
  companies?: { name: string } | null
}

export function AdminUserManagement() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin',
    department: '',
    password: '',
    companyId: '',
    cohortIds: [] as string[]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, companiesData, cohortsData] = await Promise.all([
        superadminAuthService.getAdminUsers(),
        superadminAuthService.getCompanies(),
        superadminAuthService.getCohorts()
      ])
      
      console.log('Raw companies data:', companiesData)
      console.log('Companies data length:', companiesData?.length)
      console.log('Companies data structure:', companiesData?.[0])
      
      setAdminUsers(usersData)
      setCompanies(companiesData || [])
      setCohorts(cohortsData)
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.trim() || !formData.name.trim() || !formData.password) return

    setIsCreating(true)
    try {
      await superadminAuthService.createAdminUser({
        email: formData.email.trim(),
        name: formData.name.trim(),
        role: formData.role,
        department: formData.department.trim() || undefined,
        password: formData.password,
        companyId: formData.companyId || null,
        cohortIds: formData.cohortIds.length > 0 ? formData.cohortIds : undefined
      })

      await loadData() // Reload to get updated data
      setShowCreateForm(false)
      setFormData({
        email: '',
        name: '',
        role: 'admin',
        department: '',
        password: '',
        companyId: '',
        cohortIds: []
      })
    } catch (error) {
      console.error('Failed to create admin user:', error)
      alert('Failed to create admin user. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete admin user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await superadminAuthService.deleteAdminUser(userId)
      await loadData() // Reload to get updated data
    } catch (error) {
      console.error('Failed to delete admin user:', error)
      alert('Failed to delete admin user. Please try again.')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await superadminAuthService.updateAdminUserStatus(userId, !currentStatus)
      await loadData() // Reload to get updated data
    } catch (error) {
      console.error('Failed to update admin user status:', error)
      alert('Failed to update user status. Please try again.')
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }

  const handleCohortSelection = (cohortId: string) => {
    setFormData(prev => ({
      ...prev,
      cohortIds: prev.cohortIds.includes(cohortId)
        ? prev.cohortIds.filter(id => id !== cohortId)
        : [...prev.cohortIds, cohortId]
    }))
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superadmin': return 'destructive'
      case 'admin': return 'primary'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin User Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Admin User Management</h1>
          <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Admin User
        </button>
      </div>

      {/* Create Admin User Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Technology, Operations"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Access
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => {
                    setFormData({ ...formData, companyId: e.target.value, cohortIds: [] })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No company access (workshop-only admin)</option>
                  {companies.length > 0 ? (
                    companies.map((company) => {
                      console.log('Rendering company option:', company)
                      return (
                        <option key={company.id} value={company.id}>
                          {company.name} (All company cohorts)
                        </option>
                      )
                    })
                  ) : (
                    <option disabled>Loading companies...</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Company access grants access to all cohorts for that company. Debug: {companies.length} companies loaded.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Company access grants access to all cohorts for that company
                </p>
              </div>

              {!formData.companyId && cohorts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Cohort Access
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <div className="space-y-2">
                      {cohorts.map((cohort) => (
                        <label key={cohort.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.cohortIds.includes(cohort.id)}
                            onChange={() => handleCohortSelection(cohort.id)}
                            className="rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{cohort.name}</span>
                            {cohort.companies && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({cohort.companies.name})
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select specific cohorts for workshop-only access
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Admin User'}
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

      {/* Admin Users List */}
      <div className="space-y-4">
        {adminUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No admin users yet</h3>
              <p className="text-gray-600 mb-4">Create your first admin user to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Admin User
              </button>
            </CardContent>
          </Card>
        ) : (
          adminUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <UserCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.companies && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span>{user.companies.name}</span>
                          </div>
                        )}
                        {user.department && (
                          <div className="flex items-center gap-2">
                            <span>Dept: {user.department}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(user.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Last login: {formatDate(user.last_login_at)}</span>
                        </div>
                      </div>

                      {user.admin_cohort_access && user.admin_cohort_access.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Users className="w-4 h-4" />
                            <span>Cohort Access:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.admin_cohort_access.map((access) => (
                              <Badge key={access.id} variant="outline" className="text-xs">
                                {access.cohorts?.name || 'Unknown Cohort'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title={user.is_active ? 'Deactivate user' : 'Activate user'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.role !== 'superadmin' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete user"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
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