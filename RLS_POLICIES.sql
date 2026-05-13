-- RLS Policies for businesses table
-- Run these SQL commands in Supabase SQL Editor

-- 1. Enable RLS on businesses table (if not already enabled)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can insert their own businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can update any business" ON businesses;
DROP POLICY IF EXISTS "Admins can delete any business" ON businesses;
DROP POLICY IF EXISTS "Business owners can delete their own businesses" ON businesses;

-- 3. Create proper RLS policies

-- Public can only view approved businesses (verified is optional, rejected are hidden)
CREATE POLICY "Public can view approved businesses" ON businesses
  FOR SELECT USING (
    approved = true AND (rejected IS NULL OR rejected = false)
  );

-- Business owners can view all their own businesses (including pending)
CREATE POLICY "Business owners can view their own businesses" ON businesses
  FOR SELECT USING (
    auth.uid() = owner_id
  );

-- Admins can view all businesses (most important for admin control)
CREATE POLICY "Admins can view all businesses" ON businesses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Business owners can insert their own businesses
CREATE POLICY "Business owners can insert their own businesses" ON businesses
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
  );

-- Business owners can update their own businesses
CREATE POLICY "Business owners can update their own businesses" ON businesses
  FOR UPDATE USING (
    auth.uid() = owner_id
  );

-- Admins can update any business
CREATE POLICY "Admins can update any business" ON businesses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Admins can delete any business
CREATE POLICY "Admins can delete any business" ON businesses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Business owners can delete their own businesses
CREATE POLICY "Business owners can delete their own businesses" ON businesses
  FOR DELETE USING (
    auth.uid() = owner_id
  );

-- 4. Ensure admin user exists and has proper role
-- This will create/update the admin user if they don't exist
INSERT INTO users (id, email, name, role, verified, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'azizalipcff@gmail.com'),
  'azizalipcff@gmail.com',
  'Admin User',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  verified = true,
  updated_at = NOW();

-- 5. Grant necessary permissions
GRANT ALL ON businesses TO authenticated;
GRANT ALL ON businesses TO service_role;
