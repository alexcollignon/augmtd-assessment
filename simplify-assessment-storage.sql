-- Simplify assessment_submissions table for one-shot assessment
-- Remove unnecessary progress tracking fields

-- 1. Remove progress tracking columns that aren't needed for one-shot assessment
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS current_section;
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS completion_percentage;
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS status;
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS started_at;
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS last_updated_at;
ALTER TABLE assessment_submissions DROP COLUMN IF EXISTS completed_at;

-- 2. Drop assessment_results table entirely (not needed)
DROP TABLE IF EXISTS assessment_results;

-- 3. Drop any indexes that no longer apply
DROP INDEX IF EXISTS idx_submissions_status;
DROP INDEX IF EXISTS idx_results_email_cohort;

-- 4. Clean up any existing data to reset for new simplified approach
DELETE FROM assessment_submissions;

-- 5. Add a check to ensure responses is not empty (only complete assessments)
ALTER TABLE assessment_submissions ADD CONSTRAINT responses_not_empty 
  CHECK (jsonb_typeof(responses) = 'object' AND responses != '{}');

COMMIT;