import { createBrowserClient } from "@supabase/ssr";

function isValidUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const rawUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const SUPABASE_URL  = isValidUrl(rawUrl) ? rawUrl : "https://placeholder.supabase.co";
const SUPABASE_ANON = rawAnon?.trim() ? rawAnon : "placeholder-anon-key";

/** Singleton browser Supabase client — safe to call in any Client Component */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
}

export const supabaseConfigured = isValidUrl(rawUrl) && !!rawAnon?.trim();
