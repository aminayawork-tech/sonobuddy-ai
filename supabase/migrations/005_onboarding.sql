-- ============================================================
-- Onboarding answers: who the learner is and which areas they want to
-- study first (used to personalize Quick Start on Home).
-- ============================================================

alter table public.profiles
  add column if not exists role          text,
  add column if not exists focus_areas   text[] not null default '{}',
  add column if not exists onboarded_at  timestamptz;

-- Users may edit their own onboarding answers (billing columns stay locked, see 004).
grant update (role, focus_areas, onboarded_at) on public.profiles to authenticated;
