-- Enable row level security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

-- Create policies
CREATE POLICY "Users can insert their own data" 
ON users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
USING (auth.uid() = id OR auth.jwt() -> 'claims' ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all users" 
ON users 
USING (auth.jwt() -> 'claims' ->> 'role' = 'service_role');

-- Enable realtime for users table
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'users'
  ) THEN
    alter publication supabase_realtime add table users;
  END IF;
END$;