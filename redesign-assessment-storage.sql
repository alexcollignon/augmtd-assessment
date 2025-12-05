-- Redesign assessment storage to one row per submission
-- This makes much more sense for analysis and reporting

-- 1. Drop the old response-per-question table
DROP TABLE IF EXISTS assessment_responses;

-- 2. Create simple assessment_submissions table (one row per completed assessment)
CREATE TABLE IF NOT EXISTS assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  
  -- Store all responses as JSON (only when complete)
  responses JSONB NOT NULL,
  
  -- Simple timestamp
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one submission per email per cohort
  UNIQUE (email, cohort_id)
);

-- Note: No need for assessment_results table - responses contain everything needed

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_email_cohort ON assessment_submissions(email, cohort_id);
CREATE INDEX IF NOT EXISTS idx_submissions_cohort ON assessment_submissions(cohort_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON assessment_submissions(submitted_at);

-- 4. Create policies for Row Level Security
CREATE POLICY "Users can access submissions" ON assessment_submissions
  FOR ALL USING (true); -- For now allow all - restrict later as needed

-- 5. Enable RLS
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;

COMMIT;