import { supabase } from './supabase'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  company_id: string | null
  is_active: boolean
}

export interface AdminCohortAccess {
  cohort_id: string
  cohorts: {
    id: string
    name: string
    company_id: string | null
  }
}

export class AdminDataScopingService {
  
  /**
   * Get cohorts accessible to an admin user
   */
  async getAccessibleCohorts(adminUser: AdminUser): Promise<string[]> {
    try {
      if (adminUser.company_id) {
        // Company admin: get all cohorts for their company
        const { data, error } = await supabase
          .from('cohorts')
          .select('id')
          .eq('company_id', adminUser.company_id)

        if (error) {
          console.error('Failed to fetch company cohorts:', error)
          return []
        }

        return (data || []).map(cohort => cohort.id)
      } else {
        // Non-company admin: get cohorts from explicit grants
        const { data, error } = await supabase
          .from('admin_cohort_access')
          .select('cohort_id')
          .eq('admin_user_id', adminUser.id)

        if (error) {
          console.error('Failed to fetch admin cohort access:', error)
          return []
        }

        return (data || []).map(access => access.cohort_id)
      }
    } catch (error) {
      console.error('Error getting accessible cohorts:', error)
      return []
    }
  }

  /**
   * Get assessment submissions accessible to an admin user
   */
  async getAccessibleSubmissions(adminUser: AdminUser, limit: number = 100) {
    try {
      const cohortIds = await this.getAccessibleCohorts(adminUser)
      
      if (cohortIds.length === 0) {
        console.log('Admin has no cohort access, returning empty submissions')
        return []
      }

      const { data, error } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          assessment_results (
            dimension_scores,
            overall_score,
            calculated_at
          )
        `)
        .in('cohort_id', cohortIds)
        .order('submitted_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Failed to fetch accessible submissions:', error)
        return []
      }

      console.log(`Admin ${adminUser.email} accessing ${(data || []).length} submissions from ${cohortIds.length} cohorts`)
      return data || []
    } catch (error) {
      console.error('Error getting accessible submissions:', error)
      return []
    }
  }

  /**
   * Get cohort details accessible to an admin user
   */
  async getAccessibleCohortDetails(adminUser: AdminUser) {
    try {
      const cohortIds = await this.getAccessibleCohorts(adminUser)
      
      if (cohortIds.length === 0) {
        return []
      }

      const { data, error } = await supabase
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
        .in('id', cohortIds)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch cohort details:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting cohort details:', error)
      return []
    }
  }

  /**
   * Check if admin user has access to a specific cohort
   */
  async hasAccessToCohort(adminUser: AdminUser, cohortId: string): Promise<boolean> {
    const accessibleCohorts = await this.getAccessibleCohorts(adminUser)
    return accessibleCohorts.includes(cohortId)
  }

  /**
   * Get admin user with permissions from database
   */
  async getAdminUserWithPermissions(email: string): Promise<AdminUser | null> {
    try {
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('id, email, name, role, company_id, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        console.error('Admin user not found or inactive:', error)
        return null
      }

      return user as AdminUser
    } catch (error) {
      console.error('Error fetching admin user:', error)
      return null
    }
  }
}

export const adminDataScopingService = new AdminDataScopingService()