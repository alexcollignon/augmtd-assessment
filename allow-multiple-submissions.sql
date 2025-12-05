-- Allow multiple submissions per user per cohort for progress tracking
-- Remove unique constraints to enable learning progress tracking

-- 1. Drop the unique constraint that prevents multiple submissions
ALTER TABLE assessment_submissions DROP CONSTRAINT IF EXISTS assessment_submissions_email_cohort_id_key;
ALTER TABLE assessment_submissions DROP CONSTRAINT IF EXISTS unique_email_cohort;

-- 2. Drop the unique constraint on results table too
ALTER TABLE assessment_results DROP CONSTRAINT IF EXISTS assessment_results_email_cohort_id_key;  
ALTER TABLE assessment_results DROP CONSTRAINT IF EXISTS unique_email_cohort;

-- 3. Add a submission_number to track sequence of submissions
ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS submission_number INTEGER DEFAULT 1;
ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS submission_number INTEGER DEFAULT 1;

-- 4. Update existing records to have submission_number = 1
UPDATE assessment_submissions SET submission_number = 1 WHERE submission_number IS NULL;
UPDATE assessment_results SET submission_number = 1 WHERE submission_number IS NULL;

-- 5. Add indexes for querying by email, cohort, and submission number
CREATE INDEX IF NOT EXISTS idx_submissions_email_cohort_number ON assessment_submissions(email, cohort_id, submission_number);
CREATE INDEX IF NOT EXISTS idx_submissions_latest ON assessment_submissions(email, cohort_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_email_cohort_number ON assessment_results(email, cohort_id, submission_number);

-- 6. Add helpful comments
COMMENT ON COLUMN assessment_submissions.submission_number IS 'Sequence number for multiple submissions by same user (1, 2, 3...)';
COMMENT ON COLUMN assessment_results.submission_number IS 'Matches submission_number in assessment_submissions for tracking progress';

-- 7. Create a view for getting latest submissions per user
CREATE OR REPLACE VIEW latest_assessment_submissions AS
SELECT DISTINCT ON (email, cohort_id) 
  id,
  email,
  cohort_id,
  responses,
  submission_number,
  submitted_at,
  started_at,
  completed_at
FROM assessment_submissions
ORDER BY email, cohort_id, submitted_at DESC;

-- 8. Create a view for comparing first vs latest results
CREATE OR REPLACE VIEW assessment_progress AS
SELECT 
  first_sub.email,
  first_sub.cohort_id,
  first_sub.submission_number as first_submission_number,
  first_sub.submitted_at as first_submitted_at,
  latest_sub.submission_number as latest_submission_number,
  latest_sub.submitted_at as latest_submitted_at,
  first_res.overall_score as first_score,
  latest_res.overall_score as latest_score,
  (latest_res.overall_score - first_res.overall_score) as score_improvement,
  first_res.dimension_scores as first_dimension_scores,
  latest_res.dimension_scores as latest_dimension_scores
FROM 
  (SELECT DISTINCT ON (email, cohort_id) * 
   FROM assessment_submissions 
   ORDER BY email, cohort_id, submitted_at ASC) first_sub
JOIN 
  (SELECT DISTINCT ON (email, cohort_id) * 
   FROM assessment_submissions 
   ORDER BY email, cohort_id, submitted_at DESC) latest_sub
   ON first_sub.email = latest_sub.email 
   AND first_sub.cohort_id = latest_sub.cohort_id
LEFT JOIN assessment_results first_res 
   ON first_sub.id = first_res.submission_id
LEFT JOIN assessment_results latest_res 
   ON latest_sub.id = latest_res.submission_id
WHERE first_sub.id != latest_sub.id; -- Only show users with multiple submissions

COMMIT;