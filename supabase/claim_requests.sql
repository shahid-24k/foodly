-- FOODLY claim requests schema & RLS policies
-- Execute this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/uaptqazhwegkawyjmvrj/sql)

create table if not exists claim_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  restaurant_id text references restaurants(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  message text,
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table claim_requests enable row level security;

-- Users can view their own claim requests
create policy "read own claims" on claim_requests for select using (
  auth.uid() = user_id
);

-- Users can submit a claim request for themselves
create policy "insert own claim" on claim_requests for insert with check (
  auth.uid() = user_id
);

-- Admins can view all claim requests
create policy "admin read all claims" on claim_requests for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Admins can update claim requests
create policy "admin update claims" on claim_requests for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
