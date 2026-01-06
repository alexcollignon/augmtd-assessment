import { supabase } from './supabase'
import { AssessmentTemplate } from '@/types'

export interface AssessmentAuthResult {
  success: boolean
  session?: {
    email: string
    cohortId: string
    companyId: string
    templateId: string
    accessCode: string
  }
  template?: AssessmentTemplate
  error?: string
}

export async function authenticateAssessment(email: string, accessCode: string): Promise<AssessmentAuthResult> {
  try {
    // 1. Find cohort by access code - this determines which assessment they get
    const { data: cohortData, error: cohortError } = await supabase
      .from('cohorts')
      .select(`
        id,
        template_id,
        company_id,
        assessment_templates (
          id,
          name,
          template_data
        )
      `)
      .eq('access_code', accessCode)
      .single()

    if (cohortError || !cohortData) {
      return { success: false, error: 'Invalid access code' }
    }

    // 2. Create session object
    const session = {
      email: email.toLowerCase(),
      cohortId: cohortData.id,
      companyId: cohortData.company_id,
      templateId: cohortData.template_id,
      accessCode: accessCode
    }

    // 3. Create template object
    const assessmentTemplate = Array.isArray(cohortData.assessment_templates) 
      ? cohortData.assessment_templates[0] 
      : cohortData.assessment_templates
    const templateData = assessmentTemplate?.template_data || {}
    const template: AssessmentTemplate = {
      id: assessmentTemplate?.id || '',
      name: assessmentTemplate?.name || '',
      companyId: cohortData.company_id,
      ...templateData
    }

    // 4. Store session in localStorage
    localStorage.setItem('air_assessment_session', JSON.stringify({
      email: session.email,
      accessCode: session.accessCode,
      cohortId: session.cohortId,
      companyId: session.companyId,
      templateId: session.templateId,
      lastActivity: new Date().toISOString()
    }))

    return { 
      success: true, 
      session, 
      template 
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'Authentication failed. Please try again.' }
  }
}