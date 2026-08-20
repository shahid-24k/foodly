-- FOODLY database schema (already applied to the live Supabase project
-- referenced in .env.example — this file is for reference / self-hosting).

create table restaurants (
  id text primary key, name text not null, since text, cuisine text not null,
  locality text not null, rating numeric not null, delivery_time int not null,
  price_range text not null, is_veg boolean not null default false, offer text,
  tags text[] not null default '{}', gradient_from text not null, gradient_to text not null,
  hero_image text, created_at timestamptz default now()
);

create table menu_items (
  id text primary key, restaurant_id text references restaurants(id) on delete cascade,
  name text not null, description text, price int not null, is_veg boolean not null default true,
  category text not null, image_url text, created_at timestamptz default now()
);

create table addresses (
  id text primary key, label text not null, name text not null, phone text,
  line text not null, city text not null, state text not null, pin text not null,
  created_at timestamptz default now()
);

create table orders (
  id text primary key, restaurant_id text references restaurants(id), restaurant_name text not null,
  items jsonb not null, subtotal int not null, delivery_fee int not null, tax int not null,
  total int not null, address jsonb, payment_method text not null, status_index int not null default 0,
  eta int not null default 30, created_at timestamptz default now()
);

create table profiles (
  id uuid references auth.users on delete cascade primary key, email text, full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer','restaurant','admin')),
  restaurant_id text references restaurants(id), created_at timestamptz default now()
);

alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;

create policy "public read restaurants" on restaurants for select using (true);
create policy "public read menu_items" on menu_items for select using (true);
create policy "public read addresses" on addresses for select using (true);
create policy "public read orders" on orders for select using (true);
create policy "public insert addresses" on addresses for insert with check (true);
create policy "public insert orders" on orders for insert with check (true);
create policy "owner update own orders" on orders for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and (p.role = 'admin' or (p.role = 'restaurant' and p.restaurant_id = orders.restaurant_id)))
);
create policy "read own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);

-- IMPORTANT: the RLS policy above alone does NOT stop a logged-in user from
-- setting their own role/restaurant_id via a direct client update — RLS has
-- no column-level granularity. This trigger closes that gap: only an admin
-- (or a direct SQL/service-role session, i.e. auth.uid() is null) may change
-- `role` or `restaurant_id` on a profile.
create or replace function prevent_privilege_escalation()
returns trigger as $$
begin
  if (new.role is distinct from old.role or new.restaurant_id is distinct from old.restaurant_id) then
    if auth.uid() is not null and not exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Only admins can change role or restaurant_id';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger enforce_no_self_promotion
  before update on profiles
  for each row execute function prevent_privilege_escalation();


create or replace function handle_new_user() 
returns trigger 
language plpgsql 
security definer 
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role);
  return new;
exception
  when others then
    return new;
end; 
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

