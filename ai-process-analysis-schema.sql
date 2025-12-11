-- AI Process Analysis Persistent Storage Schema
-- This table stores AI-generated process analysis to avoid regenerating on every page load
-- ONE ROW PER COMPANY with all analyses stored as JSON

CREATE TABLE IF NOT EXISTS ai_process_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE, -- One row per company
  
  -- All process analyses stored as JSON array
  process_analyses JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Analysis metadata
  based_on_submissions INTEGER NOT NULL DEFAULT 0,
  submission_ids TEXT[] DEFAULT '{}', -- Array of submission IDs used in analysis
  
  -- Company context used for analysis
  company_settings_snapshot JSONB, -- Snapshot of approved tools at analysis time
  
  -- Summary statistics for quick access
  total_processes INTEGER DEFAULT 0,
  avg_automation_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_process_analysis_company_id ON ai_process_analysis(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_process_analysis_updated_at ON ai_process_analysis(updated_at);

-- GIN index for JSONB process_analyses for fast JSON querying
CREATE INDEX IF NOT EXISTS idx_ai_process_analyses ON ai_process_analysis USING GIN (process_analyses);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_process_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update timestamps
CREATE TRIGGER update_ai_process_analysis_updated_at 
  BEFORE UPDATE ON ai_process_analysis 
  FOR EACH ROW EXECUTE FUNCTION update_ai_process_analysis_updated_at();

-- RLS disabled for now (same as other tables in project)
ALTER TABLE ai_process_analysis DISABLE ROW LEVEL SECURITY;

-- Comments for documentation
COMMENT ON TABLE ai_process_analysis IS 'Stores AI-generated process analysis to avoid expensive regeneration on every page load - ONE ROW PER COMPANY';
COMMENT ON COLUMN ai_process_analysis.process_analyses IS 'Array of all AI process analyses for this company in JSON format';
COMMENT ON COLUMN ai_process_analysis.based_on_submissions IS 'Number of assessment submissions this analysis was based on';
COMMENT ON COLUMN ai_process_analysis.submission_ids IS 'Array of submission IDs used for tracking data freshness';
COMMENT ON COLUMN ai_process_analysis.company_settings_snapshot IS 'Snapshot of company approved tools when analysis was generated';
COMMENT ON COLUMN ai_process_analysis.total_processes IS 'Cached count of total processes analyzed';
COMMENT ON COLUMN ai_process_analysis.avg_automation_percentage IS 'Cached average automation percentage across all processes';