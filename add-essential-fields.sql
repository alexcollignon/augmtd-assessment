-- Add back essential fields and create assessment_results table
-- Fix the oversimplification

-- 1. Add back essential date tracking to assessment_submissions
ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to have proper timestamps
UPDATE assessment_submissions 
SET started_at = submitted_at, completed_at = submitted_at 
WHERE started_at IS NULL OR completed_at IS NULL;

-- 2. Create assessment_results table for calculated scores and reports
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  
  -- Calculated scores by dimension (JSON)
  dimension_scores JSONB,
  
  -- Overall score
  overall_score INTEGER,
  
  -- AI-generated recommendation report (JSON)
  recommendation_report JSONB,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  report_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Ensure one result per email per cohort
  UNIQUE (email, cohort_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_results_email_cohort ON assessment_results(email, cohort_id);
CREATE INDEX IF NOT EXISTS idx_results_cohort ON assessment_results(cohort_id);
CREATE INDEX IF NOT EXISTS idx_results_overall_score ON assessment_results(overall_score);
CREATE INDEX IF NOT EXISTS idx_submissions_completed_at ON assessment_submissions(completed_at);

-- 4. Create policies for Row Level Security
CREATE POLICY "Users can access assessment results" ON assessment_results
  FOR ALL USING (true); -- For now allow all - restrict later as needed

-- 5. Enable RLS
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- 6. Add helpful comments
COMMENT ON TABLE assessment_submissions IS 'Raw assessment responses - one row per completed assessment';
COMMENT ON TABLE assessment_results IS 'Calculated scores and AI-generated reports for assessments';
COMMENT ON COLUMN assessment_results.dimension_scores IS 'JSON object with scores for each AI readiness dimension (Strategy, Cost, Organization, Technology, Data, Security)';
COMMENT ON COLUMN assessment_results.overall_score IS 'Overall AI readiness score (0-100)';
COMMENT ON COLUMN assessment_results.recommendation_report IS 'AI-generated personalized recommendations and action plan';

COMMIT;