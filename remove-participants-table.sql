-- Remove participants table and all related columns/relationships
-- This script will clean up the database to remove the participants concept entirely

-- 1. Drop foreign key constraints that reference participants table
ALTER TABLE assessment_responses DROP CONSTRAINT IF EXISTS assessment_responses_participant_id_fkey;
ALTER TABLE assessment_results DROP CONSTRAINT IF EXISTS assessment_results_participant_id_fkey;

-- 2. Drop indexes related to participants
DROP INDEX IF EXISTS idx_participants_email;
DROP INDEX IF EXISTS idx_participants_cohort_id;
DROP INDEX IF EXISTS idx_participants_status;
DROP INDEX IF EXISTS idx_assessment_responses_participant_id;
DROP INDEX IF EXISTS idx_assessment_results_participant_id;

-- 3. Remove participant_id columns from related tables
ALTER TABLE assessment_responses DROP COLUMN IF EXISTS participant_id;
ALTER TABLE assessment_results DROP COLUMN IF EXISTS participant_id;

-- Also remove assessment_id if it exists (not needed for our simplified approach)
ALTER TABLE assessment_responses DROP COLUMN IF EXISTS assessment_id;
ALTER TABLE assessment_results DROP COLUMN IF EXISTS assessment_id;

-- 4. Add email column to assessment_responses to track who submitted what
ALTER TABLE assessment_responses ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE assessment_responses ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id);

-- 5. Add email column to assessment_results to track results by email
ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id);

-- 6. Drop the participants table entirely
DROP TABLE IF EXISTS participants;

-- 7. Create indexes and constraints for the new email-based structure
CREATE INDEX IF NOT EXISTS idx_assessment_responses_email_cohort ON assessment_responses(email, cohort_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_email_cohort ON assessment_results(email, cohort_id);

-- 8. Add unique constraint for upsert operations on assessment_responses
ALTER TABLE assessment_responses ADD CONSTRAINT IF NOT EXISTS unique_response_per_question 
  UNIQUE (email, cohort_id, section_id, question_id);

-- 8. Update Row Level Security policies to work with email instead of participant_id
DROP POLICY IF EXISTS "Users can only access their own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can only access their own results" ON assessment_results;

-- Create new policies based on email
CREATE POLICY "Users can access responses by email" ON assessment_responses
  FOR ALL USING (true); -- For now, allow all access - you can restrict later

CREATE POLICY "Users can access results by email" ON assessment_results
  FOR ALL USING (true); -- For now, allow all access - you can restrict later

-- 9. Clean up any remaining data
DELETE FROM assessment_responses WHERE email IS NULL;
DELETE FROM assessment_results WHERE email IS NULL;

COMMIT;