-- Fix: Access code should be in cohorts table, not participants
-- One access code per cohort loads the template for all participants

-- 1. Rename the confusing column to just 'access_code'
ALTER TABLE cohorts RENAME COLUMN access_code_prefix TO access_code;

-- 2. Set the cohort access code (one code for the whole cohort)
UPDATE cohorts SET access_code = 'AIR-2024-Q1' WHERE id = '770e8400-e29b-41d4-a716-446655440000';

-- 3. Remove individual access codes from participants (no longer needed)
ALTER TABLE participants DROP COLUMN access_code;

-- 4. Add a simple participant_code for individual identification (optional)
ALTER TABLE participants ADD COLUMN participant_code TEXT;

-- 5. Set participant codes for individual identification
UPDATE participants SET participant_code = 'SMITH-01' WHERE email = 'john.smith@company.com';
UPDATE participants SET participant_code = 'JONES-02' WHERE email = 'sarah.jones@company.com';
UPDATE participants SET participant_code = 'WILSON-03' WHERE email = 'mike.wilson@company.com';
UPDATE participants SET participant_code = 'CHEN-04' WHERE email = 'lisa.chen@company.com';