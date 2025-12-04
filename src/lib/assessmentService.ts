import { supabase } from './supabase'
import { AssessmentTemplate } from '@/types'

export async function getAssessmentTemplateForCohort(cohortId: string): Promise<AssessmentTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('cohorts')
      .select(`
        assessment_templates!inner (
          id,
          name,
          template_data,
          company_id
        )
      `)
      .eq('id', cohortId)
      .single()

    if (error || !data) {
      return null
    }

    const templateData = data.assessment_templates.template_data
    const template: AssessmentTemplate = {
      id: data.assessment_templates.id,
      name: data.assessment_templates.name,
      companyId: data.assessment_templates.company_id,
      ...templateData
    }

    return template
  } catch (error) {
    console.error('Error loading assessment template:', error)
    return null
  }
}

export async function getParticipantResults(participantId: string) {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('participant_id', participantId)
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error loading results:', error)
    return { data: null, error }
  }
}

export async function saveAssessmentResults(
  participantId: string, 
  results: {
    overall_score: number
    dimension_scores: any
    radar_data: any
    recommendations: string[]
  }
) {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .upsert({
        participant_id: participantId,
        ...results,
        calculated_at: new Date().toISOString()
      }, {
        onConflict: 'participant_id'
      })

    return { data, error }
  } catch (error) {
    console.error('Error saving results:', error)
    return { data: null, error }
  }
}

// For admin dashboard - get company analytics
export async function getCompanyAnalytics(companyId: string) {
  try {
    // Get all participants for the company
    const { data: participants, error } = await supabase
      .from('participants')
      .select(`
        *,
        cohorts!inner (
          company_id
        )
      `)
      .eq('cohorts.company_id', companyId)

    if (error) {
      return { participants: [], error }
    }

    return { participants, error: null }
  } catch (error) {
    console.error('Error loading company analytics:', error)
    return { participants: [], error }
  }
}