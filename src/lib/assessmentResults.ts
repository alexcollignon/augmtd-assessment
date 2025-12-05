import { supabase } from './supabase'
import { AssessmentTemplate } from '@/types'

export interface AssessmentResultsData {
  submission: {
    id: string
    email: string
    cohort_id: string
    responses: Record<string, any>
    submitted_at: string
    started_at: string
    completed_at: string
  }
  results: {
    id: string
    dimension_scores: Record<string, number>
    overall_score: number
    recommendation_report: Record<string, any>
    calculated_at: string
  }
  template: AssessmentTemplate
  cohort: {
    id: string
    access_code: string
  }
}

export async function loadAssessmentByResultsId(resultsId: string): Promise<AssessmentResultsData | null> {
  try {
    console.log('Loading assessment by results ID:', resultsId)
    
    // First, check if the results record exists
    const { data: resultsCheck, error: checkError } = await supabase
      .from('assessment_results')
      .select('id, submission_id, email, cohort_id, dimension_scores, overall_score, recommendation_report, calculated_at')
      .eq('id', resultsId)
      .single()

    if (checkError || !resultsCheck) {
      console.error('Assessment results not found:', checkError)
      return null
    }

    console.log('Found results:', resultsCheck)

    // Load the related submission
    const { data: submission, error: submissionError } = await supabase
      .from('assessment_submissions')
      .select('id, email, cohort_id, responses, submitted_at, started_at, completed_at')
      .eq('id', resultsCheck.submission_id)
      .single()

    if (submissionError || !submission) {
      console.error('Submission not found:', submissionError)
      return null
    }

    console.log('Found submission:', submission)

    // Load the cohort data  
    const { data: cohort, error: cohortError } = await supabase
      .from('cohorts')
      .select('id, access_code, template_id')
      .eq('id', submission.cohort_id)
      .single()

    if (cohortError || !cohort) {
      console.error('Cohort not found:', cohortError)
      return null
    }

    console.log('Found cohort:', cohort)

    // Load the template data
    const { data: template, error: templateError } = await supabase
      .from('assessment_templates')
      .select('id, name, template_data')
      .eq('id', cohort.template_id)
      .single()

    if (templateError || !template) {
      console.error('Template not found:', templateError)
      return null
    }

    console.log('Found template:', template)

    // Build the response object from individual queries
    const assessmentData: AssessmentResultsData = {
      submission: {
        id: submission.id,
        email: submission.email,
        cohort_id: submission.cohort_id,
        responses: submission.responses,
        submitted_at: submission.submitted_at,
        started_at: submission.started_at,
        completed_at: submission.completed_at
      },
      results: {
        id: resultsCheck.id,
        dimension_scores: resultsCheck.dimension_scores,
        overall_score: resultsCheck.overall_score,
        recommendation_report: resultsCheck.recommendation_report,
        calculated_at: resultsCheck.calculated_at
      },
      template: {
        id: template.id,
        name: template.name,
        companyId: cohort.id,
        ...template.template_data
      },
      cohort: {
        id: cohort.id,
        access_code: cohort.access_code
      }
    }

    console.log('Successfully loaded assessment data:', assessmentData)
    return assessmentData

  } catch (error) {
    console.error('Failed to load assessment by results ID:', error)
    return null
  }
}

export function generateAssessmentUrl(resultsId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/a/${resultsId}`
}