-- ============================================================
-- Signed-in users may only edit their own display name. Billing and
-- usage columns (tier, scans_used_this_month, apple_original_transaction_id,
-- ...) can only be changed server-side with the service role key, so a
-- user can't upgrade themselves to Pro from the browser.
-- ============================================================

revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;
