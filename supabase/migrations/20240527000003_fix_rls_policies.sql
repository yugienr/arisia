-- Fix RLS policies for users table
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;

-- Create more permissive policies
CREATE POLICY "Enable insert for authenticated users" 
ON users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON users FOR SELECT 
USING (true);

CREATE POLICY "Enable update for users based on id" 
ON users FOR UPDATE 
USING (auth.uid() = id OR auth.jwt() -> 'claims' ->> 'role' = 'service_role');

-- Fix RLS for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Enable insert for authenticated users" 
ON profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Enable update for users based on id" 
ON profiles FOR UPDATE 
USING (auth.uid() = id OR auth.jwt() -> 'claims' ->> 'role' = 'service_role');
