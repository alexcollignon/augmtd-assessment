-- Settings Management Schema for AIR Admin Dashboard
-- Add these tables to your existing Supabase database

-- AI Tools management table
CREATE TABLE IF NOT EXISTS ai_tools (
  id BIGSERIAL PRIMARY KEY,
  tool_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  usage_level VARCHAR(10) CHECK (usage_level IN ('High', 'Medium', 'Low')) DEFAULT 'Low',
  risk_level VARCHAR(10) CHECK (risk_level IN ('High', 'Medium', 'Low')) DEFAULT 'Low',
  user_count INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  detected BOOLEAN DEFAULT false,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments management table 
CREATE TABLE IF NOT EXISTS departments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_company_id ON ai_tools(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_tool_name ON ai_tools(tool_name);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_approved ON ai_tools(approved);
CREATE INDEX IF NOT EXISTS idx_departments_company_id ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);

-- Add unique constraints to prevent duplicates
ALTER TABLE ai_tools ADD CONSTRAINT unique_tool_per_company UNIQUE(tool_name, company_id);
ALTER TABLE departments ADD CONSTRAINT unique_department_per_company UNIQUE(name, company_id);

-- RLS (Row Level Security) Policies for multi-tenancy
-- Disable RLS for initial testing and development

-- Disable RLS on the tables to allow operations without authentication policies
ALTER TABLE ai_tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;

-- TODO: Enable RLS and configure proper policies once authentication system is fully integrated
-- For now, access control is handled at the application level via adminDataScopingService

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- This can be run after setting up a company
/*
-- Example: Insert sample data for company_id = 1
INSERT INTO departments (name, company_id) VALUES 
  ('Engineering', 1),
  ('Marketing', 1),
  ('Finance', 1),
  ('Operations', 1),
  ('HR', 1),
  ('Sales', 1);

INSERT INTO ai_tools (tool_name, category, usage_level, risk_level, user_count, approved, detected, company_id) VALUES
  ('ChatGPT', 'Chat & Communication', 'High', 'Medium', 127, false, true, 1),
  ('Claude', 'Chat & Communication', 'Medium', 'Low', 43, true, true, 1),
  ('GitHub Copilot', 'Development & Code', 'High', 'Low', 89, true, true, 1),
  ('Grammarly AI', 'Writing & Content', 'Medium', 'Low', 156, true, true, 1),
  ('Midjourney', 'Image & Design', 'Low', 'High', 12, false, true, 1);
*/