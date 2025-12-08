-- Remove unnecessary roles and keep only admin and superadmin
-- Update role constraint to only allow admin and superadmin

-- First, update any existing executive/manager users to admin
UPDATE admin_users 
SET role = 'admin' 
WHERE role IN ('executive', 'manager');

-- Update the constraint to only allow admin and superadmin
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check 
  CHECK (role IN ('admin', 'superadmin'));

-- Show updated users
SELECT email, name, role FROM admin_users ORDER BY role, name;