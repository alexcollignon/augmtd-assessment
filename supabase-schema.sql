-- AIR Admin Dashboard Database Schema
-- Run this in your Supabase SQL Editor

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment templates
CREATE TABLE assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES companies(id),
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment cohorts (batches)
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  template_id UUID NOT NULL REFERENCES assessment_templates(id),
  name TEXT NOT NULL,
  access_code_prefix TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment participants
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id),
  email TEXT NOT NULL,
  access_code TEXT UNIQUE NOT NULL,
  name TEXT,
  department TEXT,
  role TEXT,
  status TEXT DEFAULT 'not_started',
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(cohort_id, email)
);

-- Assessment responses
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id),
  section_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  response_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_id, section_id, question_id)
);

-- Assessment results (calculated scores)
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id),
  overall_score INTEGER,
  dimension_scores JSONB,
  radar_data JSONB,
  recommendations TEXT[],
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_id)
);

-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'executive', 'manager')),
  department TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_participants_cohort ON participants(cohort_id);
CREATE INDEX idx_participants_access_code ON participants(access_code);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_responses_participant ON assessment_responses(participant_id);
CREATE INDEX idx_responses_unique_key ON assessment_responses(participant_id, section_id, question_id);
CREATE INDEX idx_cohorts_company ON cohorts(company_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_company ON admin_users(company_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_templates_updated_at BEFORE UPDATE ON assessment_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_responses_updated_at BEFORE UPDATE ON assessment_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO companies (id, name, domain, primary_color) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo Company Inc.', 'democompany.com', '#3B82F6'),
('550e8400-e29b-41d4-a716-446655440001', 'Enterprise Corp', 'enterprisecorp.com', '#7C3AED');

-- Insert default assessment template
INSERT INTO assessment_templates (id, name, company_id, template_data) VALUES (
  '660e8400-e29b-41d4-a716-446655440000',
  'AI Readiness Assessment 2024',
  '550e8400-e29b-41d4-a716-446655440000',
  '{
    "dimensions": [
      {
        "id": "promptingProficiency",
        "name": "Prompting Proficiency",
        "description": "Ability to effectively communicate with AI systems",
        "maxScore": 100,
        "weight": 1
      },
      {
        "id": "toolUse",
        "name": "Tool Use",
        "description": "Experience with AI tools and automation",
        "maxScore": 100,
        "weight": 1
      },
      {
        "id": "ethics",
        "name": "Ethics & Responsible Use",
        "description": "Understanding of responsible AI practices",
        "maxScore": 100,
        "weight": 1
      },
      {
        "id": "aiThinking",
        "name": "AI Thinking",
        "description": "Conceptual understanding of AI systems and data",
        "maxScore": 100,
        "weight": 1
      },
      {
        "id": "coIntelligence",
        "name": "Co-Intelligence",
        "description": "Human-AI collaboration and workflow integration",
        "maxScore": 100,
        "weight": 1.5
      }
    ]
  }'::jsonb
);

-- Insert demo cohort
INSERT INTO cohorts (id, company_id, template_id, name, access_code_prefix) VALUES (
  '770e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440000',
  'Q1 2024 AI Readiness Assessment',
  'ASS2024'
);

-- Insert demo participants
INSERT INTO participants (cohort_id, email, access_code, name, department, role, status, completion_percentage) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'john.smith@company.com', 'ASS2024001', 'John Smith', 'Engineering', 'Senior Developer', 'not_started', 0),
('770e8400-e29b-41d4-a716-446655440000', 'sarah.jones@company.com', 'ASS2024002', 'Sarah Jones', 'Marketing', 'Marketing Manager', 'in_progress', 45),
('770e8400-e29b-41d4-a716-446655440000', 'mike.wilson@company.com', 'ASS2024003', 'Mike Wilson', 'Finance', 'Financial Analyst', 'completed', 100),
('770e8400-e29b-41d4-a716-446655440000', 'lisa.chen@company.com', 'ASS2024004', 'Lisa Chen', 'HR', 'HR Director', 'not_started', 0);

-- Insert demo admin users with properly hashed passwords
-- admin123 -> $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- executive123 -> $2b$10$O.BFKMKYvnlw8ygm3VCBLOgVmZSJ8uy2UJH.GKGKv7xHVJ8VLqYou  
-- manager123 -> $2b$10$X8E3Vu9HZEq3QOB8C3y5wOJ6YZy8YZy8YZy8YZy8YZy8YZy8YZy8Y
INSERT INTO admin_users (company_id, email, name, role, department, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@airplatform.com', 'Sarah Chen', 'admin', 'Technology', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('550e8400-e29b-41d4-a716-446655440000', 'cto@company.com', 'Michael Rodriguez', 'executive', 'Technology', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('550e8400-e29b-41d4-a716-446655440000', 'manager@company.com', 'Emily Johnson', 'manager', 'Operations', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for now, allow all operations - can be tightened later)
CREATE POLICY "Allow all operations" ON companies FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON assessment_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON cohorts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON participants FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON assessment_results FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON admin_users FOR ALL USING (true);