// Check current access codes in database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kivrgvqjirzvnojuxtmy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdnJndnFqaXJ6dm5vanV4dG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzExNTksImV4cCI6MjA4MDQ0NzE1OX0.j1Sq_WOKgwsWxLsA4lvqTp65ivZtEErvvKx--QW8gys'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAccessCodes() {
  try {
    console.log('📋 Current access codes in participants table:')
    
    const { data: participants, error } = await supabase
      .from('participants')
      .select('email, access_code, name, department')
      .order('email')
    
    if (error) {
      console.error('❌ Query failed:', error)
      return
    }
    
    console.log(`\n✅ Found ${participants.length} participants:\n`)
    participants.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name || 'Unknown'}`)
      console.log(`   Email: ${p.email}`)
      console.log(`   Access Code: ${p.access_code}`)
      console.log(`   Department: ${p.department || 'Not set'}`)
      console.log('')
    })

    // Check if cohorts still has prefix column
    const { data: cohorts, error: cohortError } = await supabase
      .from('cohorts')
      .select('*')
      .limit(1)
    
    if (cohortError) {
      console.error('❌ Cohorts query failed:', cohortError)
    } else {
      const firstCohort = cohorts[0]
      console.log('🏢 Cohort structure:')
      console.log('- Has access_code_prefix?', 'access_code_prefix' in firstCohort)
      console.log('- Cohort fields:', Object.keys(firstCohort))
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkAccessCodes()