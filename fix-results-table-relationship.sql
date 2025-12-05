-- Fix assessment_results table to reference assessment_submissions
-- Add the missing relationship

-- 1. Add submission_id column to reference assessment_submissions
ALTER TABLE assessment_results 
ADD COLUMN IF NOT EXISTS submission_id UUID REFERENCES assessment_submissions(id);

-- 2. Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_results_submission_id ON assessment_results(submission_id);

-- 3. Update any existing records to link them properly (if any exist)
-- This will match by email and cohort_id
UPDATE assessment_results 
SET submission_id = (
  SELECT s.id 
  FROM assessment_submissions s 
  WHERE s.email = assessment_results.email 
  AND s.cohort_id = assessment_results.cohort_id 
  LIMIT 1
)
WHERE submission_id IS NULL;

-- 4. Add helpful comment
COMMENT ON COLUMN assessment_results.submission_id IS 'Foreign key to assessment_submissions.id - links results to original submission';

COMMIT;