// Test template data loading
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kivrgvqjirzvnojuxtmy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdnJndnFqaXJ6dm5vanV4dG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzExNTksImV4cCI6MjA4MDQ0NzE1OX0.j1Sq_WOKgwsWxLsA4lvqTp65ivZtEErvvKx--QW8gys'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTemplate() {
  try {
    console.log('Testing template data structure...')
    
    // Get the specific participant and template data
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('email', 'john.smith@company.com')
      .eq('access_code', 'ASS2024001')
      .single()
    
    if (participantError || !participant) {
      console.error('❌ Participant query failed:', participantError)
      return
    }
    
    console.log('✅ Found participant:', participant.email)
    
    // Get cohort and template
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
      .eq('id', participant.cohort_id)
      .single()
    
    if (cohortError || !cohortData) {
      console.error('❌ Cohort query failed:', cohortError)
      return
    }
    
    console.log('✅ Found cohort:', cohortData.id)
    
    const templateData = cohortData.assessment_templates.template_data
    console.log('📄 Template data structure:')
    console.log('- Has dimensions?', !!templateData.dimensions)
    console.log('- Has profile?', !!templateData.profile)
    console.log('- Has strategic?', !!templateData.strategic)
    console.log('- Has competence?', !!templateData.competence)
    
    if (templateData.profile) {
      console.log('- Profile questions count:', templateData.profile.questions?.length || 0)
      if (templateData.profile.questions) {
        console.log('- First question:', templateData.profile.questions[0])
      }
    } else {
      console.log('❌ Missing profile section!')
    }
    
  } catch (error) {
    console.error('❌ Template test failed:', error)
  }
}

testTemplate()