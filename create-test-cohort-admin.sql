-- Create a test cohort admin user for testing hybrid authentication
INSERT INTO admin_users (
  id, 
  email, 
  name, 
  role, 
  department, 
  password_hash, 
  company_id, 
  is_active, 
  created_at
) VALUES (
  'test-cohort-admin-001',
  'cohort.admin@testcompany.com',
  'Test Cohort Admin',
  'admin',
  'Test Department',
  '$2b$12$cIAaWk/EUZWuhcE/2k5N7Og66mIvYy20gYO9CAjBtA76ow1rtJH6K',
  NULL,
  true,
  NOW()
);

-- Give this admin access to the main demo cohort
INSERT INTO admin_cohort_access (
  id,
  admin_user_id,
  cohort_id,
  granted_by,
  created_at
) VALUES (
  gen_random_uuid(),
  'test-cohort-admin-001',
  (SELECT id FROM cohorts WHERE access_code = 'AIR-2024-Q1' LIMIT 1),
  'system',
  NOW()
);

-- Verify the setup
SELECT 
  au.email,
  au.name,
  au.role,
  au.company_id,
  CASE 
    WHEN au.password_hash IS NOT NULL THEN 'Has hashed password'
    ELSE 'No password hash'
  END as password_status,
  aca.cohort_id,
  c.name as cohort_name
FROM admin_users au
LEFT JOIN admin_cohort_access aca ON au.id = aca.admin_user_id
LEFT JOIN cohorts c ON aca.cohort_id = c.id
WHERE au.email = 'cohort.admin@testcompany.com';