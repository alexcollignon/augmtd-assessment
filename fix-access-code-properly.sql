-- Fix access code design based on actual table structure
-- Add access_code to cohorts, remove it from participants

-- 1. Add access_code column to cohorts table
ALTER TABLE cohorts ADD COLUMN access_code TEXT;

-- 2. Set the cohort access code (one code for the whole assessment)
UPDATE cohorts SET access_code = 'AIR-2024-Q1' WHERE id = '770e8400-e29b-41d4-a716-446655440000';

-- 3. Make the cohort access_code required and unique
ALTER TABLE cohorts ALTER COLUMN access_code SET NOT NULL;
ALTER TABLE cohorts ADD CONSTRAINT unique_cohort_access_code UNIQUE (access_code);

-- 4. Remove access_code from participants (move to cohorts where it belongs)
ALTER TABLE participants DROP COLUMN access_code;

-- 5. Optionally add participant_code for individual identification within cohort
ALTER TABLE participants ADD COLUMN participant_code TEXT;

-- 6. Set simple participant codes for identification
UPDATE participants SET participant_code = 'SMITH' WHERE email = 'john.smith@company.com';
UPDATE participants SET participant_code = 'JONES' WHERE email = 'sarah.jones@company.com';
UPDATE participants SET participant_code = 'WILSON' WHERE email = 'mike.wilson@company.com';
UPDATE participants SET participant_code = 'CHEN' WHERE email = 'lisa.chen@company.com';