import { supabase } from './supabase'
import { AnalyzedProcess, CompanySettings } from './processAnalysisAgent'

export interface AIAnalysisRecord {
  id: string
  company_id: string
  process_analyses: AnalyzedProcess[] // JSON array of all analyses
  based_on_submissions: number
  submission_ids: string[]
  company_settings_snapshot: CompanySettings | null
  total_processes: number
  avg_automation_percentage: number
  created_at: string
  updated_at: string
}

export interface AnalysisFreshnessInfo {
  lastAnalysisDate: string
  submissionsAnalyzed: number
  newSubmissionsSince: number
  needsUpdate: boolean
}

export class AIAnalysisService {
  
  async getAnalysisForCompany(companyId: string): Promise<AnalyzedProcess[]> {
    try {
      const { data, error } = await supabase
        .from('ai_process_analysis')
        .select('process_analyses')
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching AI analysis:', error)
        return []
      }

      if (!data || !data.process_analyses) {
        return []
      }

      // Sort by automation percentage (highest impact first)
      return (data.process_analyses as AnalyzedProcess[]).sort(
        (a, b) => b.automationPercentage - a.automationPercentage
      )
    } catch (error) {
      console.error('Failed to get analysis for company:', error)
      return []
    }
  }

  async saveAnalysis(
    companyId: string, 
    analyses: AnalyzedProcess[], 
    submissionIds: string[],
    companySettings?: CompanySettings
  ): Promise<void> {
    try {
      // Calculate summary statistics
      const totalProcesses = analyses.length
      const avgAutomationPercentage = totalProcesses > 0 
        ? analyses.reduce((sum, analysis) => sum + analysis.automationPercentage, 0) / totalProcesses
        : 0

      const analysisRecord = {
        company_id: companyId,
        process_analyses: analyses,
        based_on_submissions: submissionIds.length,
        submission_ids: submissionIds,
        company_settings_snapshot: companySettings || null,
        total_processes: totalProcesses,
        avg_automation_percentage: Math.round(avgAutomationPercentage * 100) / 100, // Round to 2 decimal places
        updated_at: new Date().toISOString()
      }

      // Use upsert to either insert or update the single row for this company
      const { error } = await supabase
        .from('ai_process_analysis')
        .upsert(analysisRecord, { 
          onConflict: 'company_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Error saving AI analysis:', error)
        throw error
      }

      console.log(`✅ Saved ${analyses.length} AI process analyses for company ${companyId} in single row`)
    } catch (error) {
      console.error('Failed to save AI analysis:', error)
      throw error
    }
  }

  async getAnalysisFreshness(companyId: string): Promise<AnalysisFreshnessInfo | null> {
    try {
      // Get analysis record for this company
      const { data: analysisRecord, error } = await supabase
        .from('ai_process_analysis')
        .select('updated_at, based_on_submissions, submission_ids')
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching analysis freshness:', error)
        return null
      }

      if (!analysisRecord) {
        return null // No analysis exists
      }

      // Get total current submissions count
      const { count: totalSubmissions } = await supabase
        .from('assessment_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      const newSubmissionsSince = (totalSubmissions || 0) - analysisRecord.based_on_submissions
      const needsUpdate = newSubmissionsSince >= 5 // Threshold: update if 5+ new submissions

      return {
        lastAnalysisDate: analysisRecord.updated_at,
        submissionsAnalyzed: analysisRecord.based_on_submissions,
        newSubmissionsSince,
        needsUpdate
      }
    } catch (error) {
      console.error('Error checking analysis freshness:', error)
      return null
    }
  }

  async deleteAnalysisForCompany(companyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_process_analysis')
        .delete()
        .eq('company_id', companyId)

      if (error) {
        console.error('Error deleting AI analysis:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to delete AI analysis:', error)
      throw error
    }
  }

  async getAnalysisMetadata(companyId: string): Promise<{
    totalProcesses: number
    lastUpdated: string | null
    avgAutomation: number
  }> {
    try {
      const { data, error } = await supabase
        .from('ai_process_analysis')
        .select('total_processes, updated_at, avg_automation_percentage')
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching analysis metadata:', error)
        return { totalProcesses: 0, lastUpdated: null, avgAutomation: 0 }
      }

      if (!data) {
        return { totalProcesses: 0, lastUpdated: null, avgAutomation: 0 }
      }

      return {
        totalProcesses: data.total_processes || 0,
        lastUpdated: data.updated_at,
        avgAutomation: Math.round(data.avg_automation_percentage || 0)
      }
    } catch (error) {
      console.error('Error getting analysis metadata:', error)
      return { totalProcesses: 0, lastUpdated: null, avgAutomation: 0 }
    }
  }
}

export const aiAnalysisService = new AIAnalysisService()