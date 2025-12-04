-- Simplify access code system - remove prefix concept
-- Each access code is unique and directly identifies a participant

-- 1. Remove the confusing access_code_prefix column from cohorts
ALTER TABLE cohorts DROP COLUMN IF EXISTS access_code_prefix;

-- 2. Update the cohorts table to remove the prefix concept
-- (The existing data is fine, we just don't use prefixes anymore)

-- 3. Make access codes more readable and unique
-- Update existing participants with cleaner codes
UPDATE participants SET access_code = 'AIR-SMITH-2024' WHERE email = 'john.smith@company.com';
UPDATE participants SET access_code = 'AIR-JONES-2024' WHERE email = 'sarah.jones@company.com';
UPDATE participants SET access_code = 'AIR-WILSON-2024' WHERE email = 'mike.wilson@company.com';
UPDATE participants SET access_code = 'AIR-CHEN-2024' WHERE email = 'lisa.chen@company.com';

-- 4. Add some additional test participants with unique codes
INSERT INTO participants (cohort_id, email, access_code, name, department, role, status, completion_percentage) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'alex.garcia@company.com', 'AIR-GARCIA-2024', 'Alex Garcia', 'Product', 'Product Manager', 'not_started', 0),
('770e8400-e29b-41d4-a716-446655440000', 'emma.taylor@company.com', 'AIR-TAYLOR-2024', 'Emma Taylor', 'Design', 'UX Designer', 'not_started', 0),
('770e8400-e29b-41d4-a716-446655440000', 'david.brown@company.com', 'AIR-BROWN-2024', 'David Brown', 'Sales', 'Sales Director', 'not_started', 0);