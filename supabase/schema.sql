-- ============================================================
-- QFLOW — profiles schema + Row Level Security
-- Run in the Supabase SQL editor (or via the CLI migrations).
-- ============================================================

-- One profile row per auth user.
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade,
  full_name       text,
  email           text,
  plan            text default 'free',
  proposals_used  integer default 0,
  created_at      timestamp default now(),
  primary key (id)
);

-- Lock the table down — no access until a policy allows it.
alter table public.profiles enable row level security;

-- A user may read their own profile.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- A user may update their own profile.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- A user may insert their own profile row (needed for the client-side
-- upsert in lib/auth.js when email confirmation is disabled). The trigger
-- below also covers the confirmation-enabled flow where no session exists yet.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- Auto-create a profile whenever a new auth user is created.
-- SECURITY DEFINER lets the trigger bypass RLS so it works even
-- before the user has a session (e.g. email confirmation pending).
-- This is the source of truth; the client upsert is just a fast path.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
