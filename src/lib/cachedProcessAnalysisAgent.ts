import { processAnalysisAgent, ProcessData, CompanySettings, AnalyzedProcess } from './processAnalysisAgent'
import { aiAnalysisService } from './aiAnalysisService'

export interface AnalysisOptions {
  forceRefresh?: boolean
  companyId: string
}

export class CachedProcessAnalysisAgent {
  
  async getOrGenerateAnalysis(
    processData: ProcessData[], 
    companySettings: CompanySettings | undefined,
    options: AnalysisOptions
  ): Promise<{
    analyses: AnalyzedProcess[]
    fromCache: boolean
    metadata: {
      submissionsAnalyzed: number
      lastUpdated: string | null
      needsUpdate: boolean
    }
  }> {
    try {
      const { companyId, forceRefresh = false } = options

      // Check if we have cached analysis and if it's fresh
      const freshness = await aiAnalysisService.getAnalysisFreshness(companyId)
      const hasCache = freshness !== null
      const needsUpdate = freshness?.needsUpdate || false

      // Use cache if available and fresh (unless force refresh)
      if (hasCache && !needsUpdate && !forceRefresh) {
        console.log('📊 Using cached AI analysis')
        const cachedAnalysis = await aiAnalysisService.getAnalysisForCompany(companyId)
        
        return {
          analyses: cachedAnalysis,
          fromCache: true,
          metadata: {
            submissionsAnalyzed: freshness.submissionsAnalyzed,
            lastUpdated: freshness.lastAnalysisDate,
            needsUpdate: false
          }
        }
      }

      // Generate fresh analysis
      console.log('🤖 Generating fresh AI analysis...')
      const analyses = await processAnalysisAgent.analyzeProcesses(processData, companySettings)
      
      // Extract submission IDs for tracking
      const submissionIds = this.extractSubmissionIds(processData)
      
      // Save to cache
      await aiAnalysisService.saveAnalysis(companyId, analyses, submissionIds, companySettings)
      
      return {
        analyses,
        fromCache: false,
        metadata: {
          submissionsAnalyzed: submissionIds.length,
          lastUpdated: new Date().toISOString(),
          needsUpdate: false
        }
      }

    } catch (error) {
      console.error('Error in cached analysis:', error)
      
      // Fallback to cache if generation fails
      try {
        const cachedAnalysis = await aiAnalysisService.getAnalysisForCompany(options.companyId)
        if (cachedAnalysis.length > 0) {
          console.log('⚠️ AI generation failed, using cached analysis')
          return {
            analyses: cachedAnalysis,
            fromCache: true,
            metadata: {
              submissionsAnalyzed: 0,
              lastUpdated: null,
              needsUpdate: true
            }
          }
        }
      } catch (cacheError) {
        console.error('Cache fallback also failed:', cacheError)
      }

      // Last resort: generate basic analysis without AI
      console.log('🔧 Using fallback analysis')
      const fallbackAnalysis = await processAnalysisAgent.analyzeProcesses(processData, companySettings)
      
      return {
        analyses: fallbackAnalysis,
        fromCache: false,
        metadata: {
          submissionsAnalyzed: processData.length,
          lastUpdated: new Date().toISOString(),
          needsUpdate: false
        }
      }
    }
  }

  async forceRefreshAnalysis(
    processData: ProcessData[],
    companySettings: CompanySettings | undefined,
    companyId: string
  ): Promise<AnalyzedProcess[]> {
    const result = await this.getOrGenerateAnalysis(processData, companySettings, {
      companyId,
      forceRefresh: true
    })
    return result.analyses
  }

  async getAnalysisMetadata(companyId: string) {
    return aiAnalysisService.getAnalysisMetadata(companyId)
  }

  async checkAnalysisFreshness(companyId: string) {
    return aiAnalysisService.getAnalysisFreshness(companyId)
  }

  private extractSubmissionIds(processData: ProcessData[]): string[] {
    // For now, we'll use process names as identifiers
    // In a more sophisticated setup, you'd track actual submission IDs
    return processData.map((_, index) => `process_${index}_${Date.now()}`)
  }
}

export const cachedProcessAnalysisAgent = new CachedProcessAnalysisAgent()