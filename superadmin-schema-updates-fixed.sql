-- Superadmin Schema Updates (Fixed for existing schema)
-- Enables simplified access model with superadmin and workshop support

-- 1. Allow NULL company_id in cohorts for workshops
ALTER TABLE cohorts ALTER COLUMN company_id DROP NOT NULL;

-- 2. Update admin_users table to support superadmin role and NULL company
ALTER TABLE admin_users ALTER COLUMN company_id DROP NOT NULL;

-- Drop existing role constraint and add superadmin
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check 
  CHECK (role IN ('admin', 'executive', 'manager', 'superadmin'));

-- 3. Create admin cohort access table for granular permissions
CREATE TABLE IF NOT EXISTS admin_cohort_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES admin_users(id), -- Track who granted access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(admin_user_id, cohort_id)
);

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_admin_cohort_access_admin ON admin_cohort_access(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_cohort_access_cohort ON admin_cohort_access(cohort_id);

-- 5. Check if cohorts table needs access_code column
-- First check if access_code column exists, if not add it
DO $$ 
BEGIN
    -- Check if access_code column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cohorts' AND column_name='access_code') THEN
        -- If access_code_prefix exists, rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cohorts' AND column_name='access_code_prefix') THEN
            ALTER TABLE cohorts RENAME COLUMN access_code_prefix TO access_code;
        ELSE
            -- Otherwise add access_code column
            ALTER TABLE cohorts ADD COLUMN access_code TEXT NOT NULL DEFAULT 'AIR-2024-DEFAULT';
        END IF;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cohorts' AND column_name='description') THEN
        ALTER TABLE cohorts ADD COLUMN description TEXT;
    END IF;
END $$;

-- 6. Enable RLS for new table
ALTER TABLE admin_cohort_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON admin_cohort_access FOR ALL USING (true);

-- 7. Insert initial superadmin user (only if doesn't exist)
INSERT INTO admin_users (email, name, role, password_hash, company_id) VALUES (
  'superadmin@airplatform.com',
  'System Administrator', 
  'superadmin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NULL
) ON CONFLICT (email) DO NOTHING;

-- 8. Update existing cohorts to use proper access codes if needed
UPDATE cohorts 
SET access_code = 'AIR-2024-Q1'
WHERE access_code = 'ASS2024' OR access_code = 'AIR-2024-DEFAULT';

-- 9. Add comments for documentation
COMMENT ON TABLE admin_cohort_access IS 'Grants admin users access to specific cohorts (for workshops or special access)';
COMMENT ON COLUMN admin_users.company_id IS 'NULL for superadmins or workshop-only admins';
COMMENT ON COLUMN cohorts.company_id IS 'NULL for cross-company workshops';
COMMENT ON COLUMN cohorts.access_code IS 'Direct access code (e.g., AIR-2024-Q1)';

-- 10. Show current table structure for verification
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('cohorts', 'admin_users', 'admin_cohort_access')
ORDER BY table_name, ordinal_position;

COMMIT;