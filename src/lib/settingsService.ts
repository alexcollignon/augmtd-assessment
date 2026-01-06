import { supabase } from './supabase'

// Legacy interfaces for backward compatibility
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

// New JSON-based interfaces
export interface AIToolJSON {
  tool_name: string
  category: string
  usage_level: 'High' | 'Medium' | 'Low'
  risk_level: 'High' | 'Medium' | 'Low'
  user_count: number
  approved: boolean
  detected: boolean
}

export interface DepartmentJSON {
  name: string
}

export interface CompanySettings {
  id: string
  company_id: string
  ai_tools: AIToolJSON[]
  departments: DepartmentJSON[]
  created_at: string
  updated_at: string
}

export class SettingsService {
  
  // ===============================
  // NEW JSON-BASED METHODS
  // ===============================

  async getCompanySettings(companyId: string): Promise<CompanySettings | null> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching company settings:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error in getCompanySettings:', error)
      return null
    }
  }

  async ensureCompanySettings(companyId: string): Promise<CompanySettings> {
    try {
      let settings = await this.getCompanySettings(companyId)
      
      if (!settings) {
        // Create new settings record for company
        const { data, error } = await supabase
          .from('company_settings')
          .insert([{
            company_id: companyId,
            ai_tools: [],
            departments: []
          }])
          .select()
          .single()

        if (error) {
          console.error('Error creating company settings:', error)
          throw error
        }

        settings = data
      }

      return settings!
    } catch (error) {
      console.error('Error in ensureCompanySettings:', error)
      throw error
    }
  }

  // ===============================
  // AI TOOLS MANAGEMENT (Updated to use JSON)
  // ===============================
  
  async getAITools(companyId?: string): Promise<AITool[]> {
    try {
      if (!companyId) {
        // For backward compatibility, return empty array if no company ID
        return []
      }

      const settings = await this.getCompanySettings(companyId)
      
      if (!settings || !settings.ai_tools) {
        return []
      }

      // Convert JSON tools to legacy AITool format for UI compatibility
      return settings.ai_tools.map((tool, index) => ({
        id: index, // Generate fake ID for UI
        tool_name: tool.tool_name,
        category: tool.category,
        usage_level: tool.usage_level,
        risk_level: tool.risk_level,
        user_count: tool.user_count,
        approved: tool.approved,
        detected: tool.detected,
        created_at: settings.created_at,
        updated_at: settings.updated_at,
        company_id: companyId
      }))
    } catch (error) {
      console.error('Error in getAITools:', error)
      return []
    }
  }

  async createAITool(tool: Omit<AITool, 'id' | 'created_at' | 'updated_at'>): Promise<AITool | null> {
    try {
      console.log('Creating AI tool:', tool)
      
      if (!tool.company_id) {
        console.error('Company ID is required for creating AI tool')
        return null
      }

      // Ensure company settings exist
      const settings = await this.ensureCompanySettings(tool.company_id)
      
      // Check if tool already exists
      const existingToolIndex = settings.ai_tools.findIndex(
        t => t.tool_name.toLowerCase() === tool.tool_name.toLowerCase()
      )
      
      if (existingToolIndex !== -1) {
        console.error('Tool already exists:', tool.tool_name)
        return null
      }

      // Create new tool JSON object
      const newTool: AIToolJSON = {
        tool_name: tool.tool_name,
        category: tool.category,
        usage_level: tool.usage_level,
        risk_level: tool.risk_level,
        user_count: tool.user_count,
        approved: tool.approved,
        detected: tool.detected
      }

      // Add to tools array
      const updatedTools = [...settings.ai_tools, newTool]

      // Update database
      const { data, error } = await supabase
        .from('company_settings')
        .update({ 
          ai_tools: updatedTools,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', tool.company_id)
        .select()
        .single()

      if (error) {
        console.error('Error creating AI tool:', error)
        return null
      }

      // Return in legacy format for UI compatibility
      const createdTool: AITool = {
        id: updatedTools.length - 1, // Fake ID based on array index
        tool_name: newTool.tool_name,
        category: newTool.category,
        usage_level: newTool.usage_level,
        risk_level: newTool.risk_level,
        user_count: newTool.user_count,
        approved: newTool.approved,
        detected: newTool.detected,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_id: tool.company_id
      }

      console.log('AI tool created successfully:', createdTool)
      return createdTool
    } catch (error) {
      console.error('Error in createAITool:', error)
      return null
    }
  }

  async updateAITool(id: number, updates: Partial<Omit<AITool, 'id' | 'created_at' | 'updated_at'>>): Promise<AITool | null> {
    try {
      if (!updates.company_id) {
        console.error('Company ID is required for updating AI tool')
        return null
      }

      const settings = await this.getCompanySettings(updates.company_id)
      if (!settings) {
        console.error('Company settings not found')
        return null
      }

      // Find tool by array index (id is actually array index)
      if (id >= settings.ai_tools.length || id < 0) {
        console.error('Invalid tool ID:', id)
        return null
      }

      // Update the tool in the array
      const updatedTools = [...settings.ai_tools]
      updatedTools[id] = {
        ...updatedTools[id],
        ...(updates.tool_name && { tool_name: updates.tool_name }),
        ...(updates.category && { category: updates.category }),
        ...(updates.usage_level && { usage_level: updates.usage_level }),
        ...(updates.risk_level && { risk_level: updates.risk_level }),
        ...(updates.user_count !== undefined && { user_count: updates.user_count }),
        ...(updates.approved !== undefined && { approved: updates.approved }),
        ...(updates.detected !== undefined && { detected: updates.detected })
      }

      // Update database
      const { data, error } = await supabase
        .from('company_settings')
        .update({ 
          ai_tools: updatedTools,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', updates.company_id)
        .select()
        .single()

      if (error) {
        console.error('Error updating AI tool:', error)
        return null
      }

      // Return in legacy format
      return {
        id,
        tool_name: updatedTools[id].tool_name,
        category: updatedTools[id].category,
        usage_level: updatedTools[id].usage_level,
        risk_level: updatedTools[id].risk_level,
        user_count: updatedTools[id].user_count,
        approved: updatedTools[id].approved,
        detected: updatedTools[id].detected,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_id: updates.company_id
      }
    } catch (error) {
      console.error('Error in updateAITool:', error)
      return null
    }
  }

  async deleteAITool(id: number): Promise<boolean> {
    try {
      // We need to find which company this tool belongs to
      // This is a limitation of the new approach - we need company context
      console.error('deleteAITool requires company context. Use deleteAIToolByName instead.')
      return false
    } catch (error) {
      console.error('Error in deleteAITool:', error)
      return false
    }
  }

  async deleteAIToolByName(toolName: string, companyId: string): Promise<boolean> {
    try {
      const settings = await this.getCompanySettings(companyId)
      if (!settings) {
        console.error('Company settings not found')
        return false
      }

      // Remove tool from array
      const updatedTools = settings.ai_tools.filter(
        tool => tool.tool_name.toLowerCase() !== toolName.toLowerCase()
      )

      // Update database
      const { error } = await supabase
        .from('company_settings')
        .update({ 
          ai_tools: updatedTools,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId)

      if (error) {
        console.error('Error deleting AI tool:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteAIToolByName:', error)
      return false
    }
  }

  async toggleAIToolApproval(id: number): Promise<AITool | null> {
    try {
      // This method now needs company context - we'll need to modify the calling code
      console.error('toggleAIToolApproval requires company context. Use toggleAIToolApprovalByName instead.')
      return null
    } catch (error) {
      console.error('Error in toggleAIToolApproval:', error)
      return null
    }
  }

  async toggleAIToolApprovalByName(toolName: string, companyId: string): Promise<AITool | null> {
    try {
      const settings = await this.getCompanySettings(companyId)
      if (!settings) {
        console.error('Company settings not found')
        return null
      }

      // Find and toggle tool
      const toolIndex = settings.ai_tools.findIndex(
        tool => tool.tool_name.toLowerCase() === toolName.toLowerCase()
      )

      if (toolIndex === -1) {
        console.error('Tool not found:', toolName)
        return null
      }

      const updatedTools = [...settings.ai_tools]
      updatedTools[toolIndex] = {
        ...updatedTools[toolIndex],
        approved: !updatedTools[toolIndex].approved
      }

      // Update database
      const { data, error } = await supabase
        .from('company_settings')
        .update({ 
          ai_tools: updatedTools,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId)
        .select()
        .single()

      if (error) {
        console.error('Error toggling AI tool approval:', error)
        return null
      }

      // Return in legacy format
      return {
        id: toolIndex,
        tool_name: updatedTools[toolIndex].tool_name,
        category: updatedTools[toolIndex].category,
        usage_level: updatedTools[toolIndex].usage_level,
        risk_level: updatedTools[toolIndex].risk_level,
        user_count: updatedTools[toolIndex].user_count,
        approved: updatedTools[toolIndex].approved,
        detected: updatedTools[toolIndex].detected,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_id: companyId
      }
    } catch (error) {
      console.error('Error in toggleAIToolApprovalByName:', error)
      return null
    }
  }

  // ===============================
  // DEPARTMENTS MANAGEMENT (Updated to use JSON)
  // ===============================

  async getDepartments(companyId?: string): Promise<Department[]> {
    try {
      if (!companyId) {
        // For backward compatibility, return empty array if no company ID
        return []
      }

      const settings = await this.getCompanySettings(companyId)
      
      if (!settings || !settings.departments) {
        return []
      }

      // Convert JSON departments to legacy Department format for UI compatibility
      return settings.departments.map((dept, index) => ({
        id: index, // Generate fake ID for UI
        name: dept.name,
        company_id: companyId,
        created_at: settings.created_at,
        updated_at: settings.updated_at
      }))
    } catch (error) {
      console.error('Error in getDepartments:', error)
      return []
    }
  }

  async createDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department | null> {
    try {
      console.log('Creating department:', department)
      
      if (!department.company_id) {
        console.error('Company ID is required for creating department')
        return null
      }

      // Ensure company settings exist
      const settings = await this.ensureCompanySettings(department.company_id)
      
      // Check if department already exists
      const existingDeptIndex = settings.departments.findIndex(
        d => d.name.toLowerCase() === department.name.toLowerCase()
      )
      
      if (existingDeptIndex !== -1) {
        console.error('Department already exists:', department.name)
        return null
      }

      // Create new department JSON object
      const newDepartment: DepartmentJSON = {
        name: department.name
      }

      // Add to departments array
      const updatedDepartments = [...settings.departments, newDepartment]

      // Update database
      const { data, error } = await supabase
        .from('company_settings')
        .update({ 
          departments: updatedDepartments,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', department.company_id)
        .select()
        .single()

      if (error) {
        console.error('Error creating department:', error)
        return null
      }

      // Return in legacy format for UI compatibility
      const createdDepartment: Department = {
        id: updatedDepartments.length - 1, // Fake ID based on array index
        name: newDepartment.name,
        company_id: department.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      console.log('Department created successfully:', createdDepartment)
      return createdDepartment
    } catch (error) {
      console.error('Error in createDepartment:', error)
      return null
    }
  }

  async updateDepartment(id: number, updates: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department | null> {
    try {
      if (!updates.company_id) {
        console.error('Company ID is required for updating department')
        return null
      }

      const settings = await this.getCompanySettings(updates.company_id)
      if (!settings) {
        console.error('Company settings not found')
        return null
      }

      // Find department by array index (id is actually array index)
      if (id >= settings.departments.length || id < 0) {
        console.error('Invalid department ID:', id)
        return null
      }

      // Update the department in the array
      const updatedDepartments = [...settings.departments]
      if (updates.name) {
        updatedDepartments[id] = {
          ...updatedDepartments[id],
          name: updates.name
        }
      }

      // Update database
      const { data, error } = await supabase
        .from('company_settings')
        .update({ 
          departments: updatedDepartments,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', updates.company_id)
        .select()
        .single()

      if (error) {
        console.error('Error updating department:', error)
        return null
      }

      // Return in legacy format
      return {
        id,
        name: updatedDepartments[id].name,
        company_id: updates.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error in updateDepartment:', error)
      return null
    }
  }

  async deleteDepartment(id: number): Promise<boolean> {
    try {
      // We need company context - this is a limitation of the new approach
      console.error('deleteDepartment requires company context. Use deleteDepartmentByName instead.')
      return false
    } catch (error) {
      console.error('Error in deleteDepartment:', error)
      return false
    }
  }

  async deleteDepartmentByName(departmentName: string, companyId: string): Promise<boolean> {
    try {
      const settings = await this.getCompanySettings(companyId)
      if (!settings) {
        console.error('Company settings not found')
        return false
      }

      // Remove department from array
      const updatedDepartments = settings.departments.filter(
        dept => dept.name.toLowerCase() !== departmentName.toLowerCase()
      )

      // Update database
      const { error } = await supabase
        .from('company_settings')
        .update({ 
          departments: updatedDepartments,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId)

      if (error) {
        console.error('Error deleting department:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteDepartmentByName:', error)
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