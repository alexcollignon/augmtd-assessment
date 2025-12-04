// Check what columns actually exist in the tables
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kivrgvqjirzvnojuxtmy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdnJndnFqaXJ6dm5vanV4dG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzExNTksImV4cCI6MjA4MDQ0NzE1OX0.j1Sq_WOKgwsWxLsA4lvqTp65ivZtEErvvKx--QW8gys'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  try {
    console.log('🔍 Checking table structures...\n')
    
    // Check cohorts table
    const { data: cohorts, error: cohortError } = await supabase
      .from('cohorts')
      .select('*')
      .limit(1)
    
    if (cohortError) {
      console.error('❌ Cohorts query failed:', cohortError)
    } else if (cohorts.length > 0) {
      console.log('📋 COHORTS table columns:')
      console.log(Object.keys(cohorts[0]))
      console.log('\nFirst cohort data:')
      console.log(cohorts[0])
    }
    
    console.log('\n' + '='.repeat(50) + '\n')
    
    // Check participants table
    const { data: participants, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .limit(1)
    
    if (participantError) {
      console.error('❌ Participants query failed:', participantError)
    } else if (participants.length > 0) {
      console.log('👥 PARTICIPANTS table columns:')
      console.log(Object.keys(participants[0]))
      console.log('\nFirst participant data:')
      console.log(participants[0])
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkTables()