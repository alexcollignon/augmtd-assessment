// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kivrgvqjirzvnojuxtmy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdnJndnFqaXJ6dm5vanV4dG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzExNTksImV4cCI6MjA4MDQ0NzE1OX0.j1Sq_WOKgwsWxLsA4lvqTp65ivZtEErvvKx--QW8gys'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing basic connection...')
    
    // Test 1: Simple select from participants
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .limit(1)
    
    if (participantsError) {
      console.error('Participants query failed:', participantsError)
    } else {
      console.log('✅ Participants query successful:', participants?.length || 0, 'results')
    }

    // Test 2: Test the specific query that's failing
    const { data: testData, error: testError } = await supabase
      .from('participants')  
      .select('*')
      .eq('email', 'john.smith@company.com')
      .eq('access_code', 'ASS2024001')
      .single()
    
    if (testError) {
      console.error('❌ Test query failed:', testError.message)
    } else {
      console.log('✅ Test query successful:', testData?.email)
    }

    // Test 3: Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('participants')
      .select('email, access_code')
      .limit(5)
      
    if (tablesError) {
      console.error('❌ Tables check failed:', tablesError)
    } else {
      console.log('✅ Found', tables?.length || 0, 'participants in database')
      tables?.forEach(p => console.log(`  - ${p.email}: ${p.access_code}`))
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()