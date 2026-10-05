-- ============================================================
-- SonoBuddy AI – User Profiles + Billing Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- Subscriptions are sold via Apple In-App Purchase (RevenueCat).
-- ============================================================

-- 1. Profiles table -------------------------------------------
create table public.profiles (
  id                      uuid        references auth.users(id) on delete cascade primary key,
  email                   text,
  tier                    text        not null default 'free'
                            check (tier in ('free', 'pro', 'clinic')),
  scans_used_this_month   integer     not null default 0,
  current_period_start    timestamptz not null default now(),
  revenuecat_app_user_id  text        unique,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- 2. RLS ------------------------------------------------------
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (limited fields via app logic)
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role bypasses RLS automatically (used by webhooks)

-- 3. Auto-create profile on signup ---------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Updated_at trigger ---------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- 5. Atomic scan-status check (handles lazy monthly reset) ---
-- Called server-side before every scan attempt.
-- Returns JSON: { tier, scans_used, limit_reached, revenuecat_app_user_id }
create or replace function public.check_scan_status(p_user_id uuid)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  rec profiles%rowtype;
  free_limit constant integer := 5;
begin
  select * into rec from profiles where id = p_user_id;

  if not found then
    return json_build_object('error', 'profile_not_found');
  end if;

  -- Lazy monthly reset: if period_start is older than 30 days, reset counter
  if rec.current_period_start < now() - interval '30 days' then
    update profiles
    set scans_used_this_month = 0,
        current_period_start  = now()
    where id = p_user_id
    returning * into rec;
  end if;

  return json_build_object(
    'tier',                   rec.tier,
    'scans_used',             rec.scans_used_this_month,
    'limit_reached',          (rec.tier = 'free' and rec.scans_used_this_month >= free_limit),
    'revenuecat_app_user_id', rec.revenuecat_app_user_id
  );
end;
$$;

-- 6. Atomic scan count increment ------------------------------
-- Called after a successful analysis so partial failures don't
-- double-count or miss a count.
create or replace function public.increment_scan_count(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update profiles
  set scans_used_this_month = scans_used_this_month + 1
  where id = p_user_id;
end;
$$;

-- 7. pg_cron monthly reset (optional hardcoded reset on 1st) --
-- Enable via: Supabase Dashboard → Database → Extensions → pg_cron
-- Then uncomment the lines below:
--
-- select cron.schedule(
--   'monthly-scan-reset',
--   '0 0 1 * *',  -- midnight on the 1st of every month
--   $$
--     update public.profiles
--     set scans_used_this_month = 0,
--         current_period_start  = now();
--   $$
-- );
