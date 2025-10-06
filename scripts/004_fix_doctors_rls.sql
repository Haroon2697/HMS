-- Fix doctors RLS policies to allow authenticated users to manage doctors
-- Drop existing restrictive policy
drop policy if exists "Admins can manage doctors" on public.doctors;

-- Create more permissive policies for doctors
create policy "Authenticated users can insert doctors"
  on public.doctors for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update doctors"
  on public.doctors for update
  using (auth.uid() is not null);

create policy "Authenticated users can delete doctors"
  on public.doctors for delete
  using (auth.uid() is not null);

-- Also ensure profiles table allows inserts for new users
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
