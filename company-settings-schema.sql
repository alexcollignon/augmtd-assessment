-- New JSON-based Company Settings Schema
-- This replaces the individual ai_tools and departments tables with a single company_settings table

-- Create the new company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  ai_tools JSONB DEFAULT '[]'::jsonb,
  departments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_settings_company_id ON company_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_company_settings_ai_tools ON company_settings USING GIN (ai_tools);
CREATE INDEX IF NOT EXISTS idx_company_settings_departments ON company_settings USING GIN (departments);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update timestamps
CREATE TRIGGER update_company_settings_updated_at 
  BEFORE UPDATE ON company_settings 
  FOR EACH ROW EXECUTE FUNCTION update_company_settings_updated_at();

-- Disable RLS for now (same as existing tables)
ALTER TABLE company_settings DISABLE ROW LEVEL SECURITY;

-- Migration script to transfer existing data
-- This will be run after the table is created
DO $$
DECLARE
    company_record RECORD;
    tools_json JSONB;
    departments_json JSONB;
BEGIN
    -- Loop through each company that has settings
    FOR company_record IN 
        SELECT DISTINCT company_id 
        FROM ai_tools 
        WHERE company_id IS NOT NULL
        UNION
        SELECT DISTINCT company_id 
        FROM departments 
        WHERE company_id IS NOT NULL
    LOOP
        -- Aggregate AI tools for this company
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'tool_name', tool_name,
                    'category', category,
                    'usage_level', usage_level,
                    'risk_level', risk_level,
                    'user_count', user_count,
                    'approved', approved,
                    'detected', detected
                )
            ), 
            '[]'::jsonb
        ) INTO tools_json
        FROM ai_tools 
        WHERE company_id = company_record.company_id;

        -- Aggregate departments for this company
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'name', name
                )
            ),
            '[]'::jsonb
        ) INTO departments_json
        FROM departments 
        WHERE company_id = company_record.company_id;

        -- Insert into new company_settings table
        INSERT INTO company_settings (company_id, ai_tools, departments)
        VALUES (company_record.company_id, tools_json, departments_json)
        ON CONFLICT (company_id) DO UPDATE SET
            ai_tools = EXCLUDED.ai_tools,
            departments = EXCLUDED.departments,
            updated_at = NOW();

        RAISE NOTICE 'Migrated settings for company: %', company_record.company_id;
    END LOOP;
END $$;

-- After migration is complete and verified, you can optionally:
-- 1. Backup the old tables: CREATE TABLE ai_tools_backup AS SELECT * FROM ai_tools;
-- 2. Drop the old tables: DROP TABLE ai_tools, departments;
-- 
-- For now, we'll keep both schemas running in parallel for safety