-- ==============================================================================
-- FOODLY: Fix Infinite Recursion on public.profiles RLS
-- ==============================================================================
-- If you encounter: "infinite recursion detected in policy for relation profiles"
-- or "Database error saving new user" during signup, run this script in the
-- Supabase SQL Editor: https://supabase.com/dashboard/project/uaptqazhwegkawyjmvrj/sql
-- ==============================================================================

-- 1. Drop any recursive / self-referencing policies on profiles
drop policy if exists "admin read profiles" on public.profiles;
drop policy if exists "admin read all profiles" on public.profiles;
drop policy if exists "admin view profiles" on public.profiles;
drop policy if exists "admin view all profiles" on public.profiles;
drop policy if exists "admin update profiles" on public.profiles;
drop policy if exists "admin update all profiles" on public.profiles;

-- 2. Drop existing basic policies to cleanly recreate them
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;

-- 3. Re-enable RLS
alter table public.profiles enable row level security;

-- 4. Re-create clean, non-recursive policies
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 5. Re-create the handle_new_user trigger safely with search_path set
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
