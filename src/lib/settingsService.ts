import { supabase } from './supabase'

export interface AITool {
  id: number
  tool_name: string
  category: string
  usage_level: 'High' | 'Medium' | 'Low'
  risk_level: 'High' | 'Medium' | 'Low'
  user_count: number
  approved: boolean
  detected: boolean
  created_at: string
  updated_at: string
  company_id?: string // UUID type
}

export interface Department {
  id: number
  name: string
  company_id?: string // UUID type
  created_at: string
  updated_at: string
}

export interface Company {
  id: string // UUID type
  name: string
  created_at: string
  updated_at: string
}

export class SettingsService {
  
  // ===============================
  // AI TOOLS MANAGEMENT
  // ===============================
  
  async getAITools(companyId?: string): Promise<AITool[]> {
    try {
      let query = supabase
        .from('ai_tools')
        .select('*')
        .order('tool_name')

      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching AI tools:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAITools:', error)
      return []
    }
  }

  async createAITool(tool: Omit<AITool, 'id' | 'created_at' | 'updated_at'>): Promise<AITool | null> {
    try {
      console.log('Creating AI tool:', tool)
      
      const { data, error } = await supabase
        .from('ai_tools')
        .insert([{
          tool_name: tool.tool_name,
          category: tool.category,
          usage_level: tool.usage_level,
          risk_level: tool.risk_level,
          user_count: tool.user_count,
          approved: tool.approved,
          detected: tool.detected,
          company_id: tool.company_id
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating AI tool:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return null
      }

      console.log('AI tool created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in createAITool:', error)
      return null
    }
  }

  async updateAITool(id: number, updates: Partial<Omit<AITool, 'id' | 'created_at' | 'updated_at'>>): Promise<AITool | null> {
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating AI tool:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateAITool:', error)
      return null
    }
  }

  async deleteAITool(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting AI tool:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteAITool:', error)
      return false
    }
  }

  async toggleAIToolApproval(id: number): Promise<AITool | null> {
    try {
      // First get the current tool to toggle its approval status
      const { data: currentTool, error: fetchError } = await supabase
        .from('ai_tools')
        .select('approved')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching current tool:', fetchError)
        return null
      }

      // Update with the opposite approval status
      const { data, error } = await supabase
        .from('ai_tools')
        .update({
          approved: !currentTool.approved,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling AI tool approval:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in toggleAIToolApproval:', error)
      return null
    }
  }

  // ===============================
  // DEPARTMENTS MANAGEMENT
  // ===============================

  async getDepartments(companyId?: string): Promise<Department[]> {
    try {
      let query = supabase
        .from('departments')
        .select('*')
        .order('name')

      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching departments:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getDepartments:', error)
      return []
    }
  }

  async createDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department | null> {
    try {
      console.log('Creating department:', department)
      
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: department.name,
          company_id: department.company_id
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating department:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return null
      }

      console.log('Department created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in createDepartment:', error)
      return null
    }
  }

  async updateDepartment(id: number, updates: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department | null> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating department:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateDepartment:', error)
      return null
    }
  }

  async deleteDepartment(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting department:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteDepartment:', error)
      return false
    }
  }

  // ===============================
  // COMPANIES MANAGEMENT
  // ===============================

  async getCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching companies:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getCompanies:', error)
      return []
    }
  }

  async createCompany(name: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select()
        .single()

      if (error) {
        console.error('Error creating company:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in createCompany:', error)
      return null
    }
  }

  // ===============================
  // UTILITY METHODS
  // ===============================

  // Get AI tool by name (useful for checking if tool already exists)
  async getAIToolByName(toolName: string, companyId?: string): Promise<AITool | null> {
    try {
      let query = supabase
        .from('ai_tools')
        .select('*')
        .eq('tool_name', toolName)

      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching AI tool by name:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error in getAIToolByName:', error)
      return null
    }
  }

  // Bulk update AI tools (useful for category updates)
  async bulkUpdateAITools(tools: Array<{ id: number, updates: Partial<AITool> }>): Promise<boolean> {
    try {
      const promises = tools.map(({ id, updates }) => 
        this.updateAITool(id, updates)
      )

      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Error in bulkUpdateAITools:', error)
      return false
    }
  }

  // Initialize default AI tools for a company
  async initializeDefaultAITools(companyId: string): Promise<boolean> {
    try {
      const defaultTools = [
        { tool_name: 'ChatGPT', category: 'Chat & Communication', usage_level: 'High' as const, risk_level: 'Medium' as const, user_count: 0, approved: false, detected: false },
        { tool_name: 'Claude', category: 'Chat & Communication', usage_level: 'Medium' as const, risk_level: 'Low' as const, user_count: 0, approved: true, detected: false },
        { tool_name: 'GitHub Copilot', category: 'Development & Code', usage_level: 'High' as const, risk_level: 'Low' as const, user_count: 0, approved: true, detected: false },
        { tool_name: 'Grammarly AI', category: 'Writing & Content', usage_level: 'Medium' as const, risk_level: 'Low' as const, user_count: 0, approved: true, detected: false },
        { tool_name: 'Midjourney', category: 'Image & Design', usage_level: 'Low' as const, risk_level: 'High' as const, user_count: 0, approved: false, detected: false },
      ]

      const toolsWithCompanyId = defaultTools.map(tool => ({
        ...tool,
        company_id: companyId
      }))

      const { error } = await supabase
        .from('ai_tools')
        .insert(toolsWithCompanyId)

      if (error) {
        console.error('Error initializing default AI tools:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in initializeDefaultAITools:', error)
      return false
    }
  }

  // Initialize default departments for a company
  async initializeDefaultDepartments(companyId: string): Promise<boolean> {
    try {
      const defaultDepartments = [
        'Engineering',
        'Marketing', 
        'Finance',
        'Operations',
        'HR',
        'Sales'
      ]

      const departmentsWithCompanyId = defaultDepartments.map(name => ({
        name,
        company_id: companyId
      }))

      const { error } = await supabase
        .from('departments')
        .insert(departmentsWithCompanyId)

      if (error) {
        console.error('Error initializing default departments:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in initializeDefaultDepartments:', error)
      return false
    }
  }
}

export const settingsService = new SettingsService()