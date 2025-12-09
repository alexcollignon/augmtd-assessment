-- Temporary fix to disable RLS on settings tables
-- Run this in your Supabase SQL editor

-- Disable RLS on existing tables if they exist
ALTER TABLE IF EXISTS ai_tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be blocking operations
DROP POLICY IF EXISTS "Users can view ai_tools for their companies" ON ai_tools;
DROP POLICY IF EXISTS "Users can insert ai_tools for their companies" ON ai_tools;
DROP POLICY IF EXISTS "Users can update ai_tools for their companies" ON ai_tools;
DROP POLICY IF EXISTS "Users can delete ai_tools for their companies" ON ai_tools;

DROP POLICY IF EXISTS "Users can view departments for their companies" ON departments;
DROP POLICY IF EXISTS "Users can insert departments for their companies" ON departments;
DROP POLICY IF EXISTS "Users can update departments for their companies" ON departments;
DROP POLICY IF EXISTS "Users can delete departments for their companies" ON departments;