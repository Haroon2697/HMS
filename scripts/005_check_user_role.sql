-- Check current user and their role
select 
  auth.uid() as user_id,
  p.email,
  p.full_name,
  p.role
from public.profiles p
where p.id = auth.uid();

-- Check if RLS is enabled on doctors table
select 
  schemaname,
  tablename,
  rowsecurity
from pg_tables 
where tablename = 'doctors' and schemaname = 'public';

-- List all policies on doctors table
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies 
where tablename = 'doctors' and schemaname = 'public';
