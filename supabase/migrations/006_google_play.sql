-- ============================================================
-- Google Play subscriptions: the verified purchase token and when the
-- current paid period ends (re-checked with Google after it passes).
-- Written only by the server (service role); not user-editable (see 004).
-- ============================================================

alter table public.profiles
  add column if not exists google_purchase_token text unique,
  add column if not exists pro_expires_at        timestamptz;
