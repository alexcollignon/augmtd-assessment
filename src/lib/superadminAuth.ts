import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface SuperadminUser {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt?: string
}

export class SuperadminAuthService {
  
  async login(email: string, password: string): Promise<SuperadminUser | null> {
    try {
      console.log('Superadmin login attempt:', email)
      
      // Fetch user with superadmin role only
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('id, email, name, role, password_hash, is_active, last_login_at')
        .eq('email', email)
        .eq('role', 'superadmin')
        .eq('is_active', true)
        .single()

      if (error || !user) {
        console.error('Superadmin user not found:', error)
        return null
      }

      // Verify password using bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        console.error('Invalid password for superadmin:', email)
        return null
      }

      // Update last login time
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id)

      console.log('Superadmin login successful:', user.email)

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at || undefined
      }

    } catch (error) {
      console.error('Superadmin login error:', error)
      return null
    }
  }

  // Company management
  async createCompany(data: {
    name: string
    domain?: string
    logoUrl?: string
    primaryColor?: string
  }) {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          domain: data.domain,
          logo_url: data.logoUrl,
          primary_color: data.primaryColor || '#3B82F6'
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create company:', error)
        throw error
      }

      console.log('Company created successfully:', company)
      return company

    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  }

  async getCompanies() {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) {
        console.error('Failed to fetch companies:', error)
        throw error
      }

      return companies || []

    } catch (error) {
      console.error('Error fetching companies:', error)
      throw error
    }
  }

  // Cohort management
  async createCohort(data: {
    name: string
    accessCode: string
    templateId: string
    companyId?: string | null
    description?: string
    startDate?: string
    endDate?: string
  }) {
    try {
      const { data: cohort, error } = await supabase
        .from('cohorts')
        .insert({
          name: data.name,
          access_code: data.accessCode,
          template_id: data.templateId,
          company_id: data.companyId,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create cohort:', error)
        throw error
      }

      console.log('Cohort created successfully:', cohort)
      return cohort

    } catch (error) {
      console.error('Error creating cohort:', error)
      throw error
    }
  }

  async getCohorts() {
    try {
      const { data: cohorts, error } = await supabase
        .from('cohorts')
        .select(`
          *,
          companies (
            id,
            name
          ),
          assessment_templates (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch cohorts:', error)
        throw error
      }

      return cohorts || []

    } catch (error) {
      console.error('Error fetching cohorts:', error)
      throw error
    }
  }

  // Admin user management
  async createAdminUser(data: {
    email: string
    name: string
    role: string
    department?: string
    password: string
    companyId?: string | null
    cohortIds?: string[]
  }) {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10)

      // Create admin user
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .insert({
          email: data.email,
          name: data.name,
          role: data.role,
          department: data.department,
          password_hash: passwordHash,
          company_id: data.companyId,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create admin user:', error)
        throw error
      }

      // Grant cohort access if specified
      if (data.cohortIds && data.cohortIds.length > 0) {
        const cohortAccess = data.cohortIds.map(cohortId => ({
          admin_user_id: adminUser.id,
          cohort_id: cohortId
        }))

        const { error: accessError } = await supabase
          .from('admin_cohort_access')
          .insert(cohortAccess)

        if (accessError) {
          console.error('Failed to grant cohort access:', accessError)
          // Don't throw here, user is created successfully
        }
      }

      console.log('Admin user created successfully:', adminUser)
      return adminUser

    } catch (error) {
      console.error('Error creating admin user:', error)
      throw error
    }
  }

  async getAdminUsers() {
    try {
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select(`
          *,
          companies (
            id,
            name
          ),
          admin_cohort_access!admin_cohort_access_admin_user_id_fkey (
            id,
            cohort_id,
            cohorts (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch admin users:', error)
        throw error
      }

      return adminUsers || []

    } catch (error) {
      console.error('Error fetching admin users:', error)
      throw error
    }
  }

  // Template management
  async getTemplates() {
    try {
      const { data: templates, error } = await supabase
        .from('assessment_templates')
        .select('id, name, description, is_active, created_at')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Failed to fetch templates:', error)
        throw error
      }

      return templates || []

    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  }

  // Edit/Delete operations
  async deleteCompany(companyId: string) {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId)

      if (error) {
        console.error('Failed to delete company:', error)
        throw error
      }

      console.log('Company deleted successfully:', companyId)
    } catch (error) {
      console.error('Error deleting company:', error)
      throw error
    }
  }

  async deleteCohort(cohortId: string) {
    try {
      const { error } = await supabase
        .from('cohorts')
        .delete()
        .eq('id', cohortId)

      if (error) {
        console.error('Failed to delete cohort:', error)
        throw error
      }

      console.log('Cohort deleted successfully:', cohortId)
    } catch (error) {
      console.error('Error deleting cohort:', error)
      throw error
    }
  }

  async deleteAdminUser(userId: string) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Failed to delete admin user:', error)
        throw error
      }

      console.log('Admin user deleted successfully:', userId)
    } catch (error) {
      console.error('Error deleting admin user:', error)
      throw error
    }
  }

  async updateAdminUserStatus(userId: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: isActive })
        .eq('id', userId)

      if (error) {
        console.error('Failed to update admin user status:', error)
        throw error
      }

      console.log('Admin user status updated:', userId, isActive)
    } catch (error) {
      console.error('Error updating admin user status:', error)
      throw error
    }
  }

  // System metrics
  async getSystemStats() {
    try {
      const [companiesResult, cohortsResult, usersResult, submissionsResult] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }),
        supabase.from('cohorts').select('id', { count: 'exact', head: true }),
        supabase.from('admin_users').select('id', { count: 'exact', head: true }),
        supabase.from('assessment_submissions').select('id', { count: 'exact', head: true })
      ])

      return {
        totalCompanies: companiesResult.count || 0,
        totalCohorts: cohortsResult.count || 0,
        totalAdminUsers: usersResult.count || 0,
        totalAssessments: submissionsResult.count || 0
      }

    } catch (error) {
      console.error('Error fetching system stats:', error)
      return {
        totalCompanies: 0,
        totalCohorts: 0,
        totalAdminUsers: 0,
        totalAssessments: 0
      }
    }
  }
}

export const superadminAuthService = new SuperadminAuthService()