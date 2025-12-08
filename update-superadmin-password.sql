-- Update superadmin password with correct bcrypt hash
UPDATE admin_users 
SET password_hash = '$2b$10$YY1Tl3JqBwBwYer58.ZofesWccXBBwbmzhMAjNKVnK5TTPWMn1yoS'
WHERE email = 'superadmin@airplatform.com' AND role = 'superadmin';

-- Verify the update
SELECT email, name, role, password_hash 
FROM admin_users 
WHERE email = 'superadmin@airplatform.com';