import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          domain: string | null
          logo_url: string | null
          primary_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          logo_url?: string | null
          primary_color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          logo_url?: string | null
          primary_color?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessment_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          company_id: string | null
          template_data: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          company_id?: string | null
          template_data: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          company_id?: string | null
          template_data?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cohorts: {
        Row: {
          id: string
          company_id: string | null
          template_id: string
          name: string
          access_code: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          template_id: string
          name: string
          access_code: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          template_id?: string
          name?: string
          access_code?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          cohort_id: string
          email: string
          access_code: string
          name: string | null
          department: string | null
          role: string | null
          status: string
          completion_percentage: number
          started_at: string | null
          completed_at: string | null
          last_activity_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cohort_id: string
          email: string
          access_code: string
          name?: string | null
          department?: string | null
          role?: string | null
          status?: string
          completion_percentage?: number
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cohort_id?: string
          email?: string
          access_code?: string
          name?: string | null
          department?: string | null
          role?: string | null
          status?: string
          completion_percentage?: number
          started_at?: string | null
          completed_at?: string | null
          last_activity_at?: string | null
          created_at?: string
        }
      }
      assessment_responses: {
        Row: {
          id: string
          participant_id: string
          section_id: string
          question_id: string
          response_value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          section_id: string
          question_id: string
          response_value: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          section_id?: string
          question_id?: string
          response_value?: any
          created_at?: string
          updated_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          participant_id: string
          overall_score: number | null
          dimension_scores: any | null
          radar_data: any | null
          recommendations: string[] | null
          calculated_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          overall_score?: number | null
          dimension_scores?: any | null
          radar_data?: any | null
          recommendations?: string[] | null
          calculated_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          overall_score?: number | null
          dimension_scores?: any | null
          radar_data?: any | null
          recommendations?: string[] | null
          calculated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          company_id: string | null
          email: string
          name: string
          role: string
          department: string | null
          password_hash: string
          is_active: boolean
          last_login_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          email: string
          name: string
          role: string
          department?: string | null
          password_hash: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          email?: string
          name?: string
          role?: string
          department?: string | null
          password_hash?: string
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
        }
      }
      admin_cohort_access: {
        Row: {
          id: string
          admin_user_id: string
          cohort_id: string
          granted_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          cohort_id: string
          granted_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          cohort_id?: string
          granted_by?: string | null
          created_at?: string
        }
      }
    }
  }
}