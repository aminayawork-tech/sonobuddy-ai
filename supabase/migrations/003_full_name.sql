-- ============================================================
-- Adds a display name, captured at sign-up, so the app can greet
-- users by name instead of falling back to their email address.
-- ============================================================

alter table public.profiles
  add column if not exists full_name text;

-- Update the signup trigger to pull full_name out of the signup
-- metadata (passed as `options.data.full_name` to supabase.auth.signUp).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
