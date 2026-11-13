import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/** Handles the OAuth / email-confirmation callback from Supabase */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next");

  // Supabase sends ?error= when the link itself was expired or already used.
  if (searchParams.get("error")) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  // Token-hash flow (our email templates): works in any browser, so the user
  // lands signed in even when they open the email on another device/app.
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      // Recovery tokens must land on the reset-password form, not the home page
      const destination = type === "recovery" ? "/auth/reset-password" : next ?? "/?welcome=1";
      return NextResponse.redirect(`${origin}${destination}`);
    }
    return NextResponse.redirect(`${origin}/auth/error${type === "recovery" ? "?type=recovery" : ""}`);
  }

  // PKCE flow (default Supabase templates): Supabase has already confirmed the
  // email before redirecting here. The exchange only succeeds in the browser
  // that signed up, so anywhere else we send them to sign in instead of
  // showing an error.
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next ?? "/?welcome=1"}`);
    if (next === "/auth/reset-password") return NextResponse.redirect(`${origin}/auth/error?type=recovery`);
    return NextResponse.redirect(`${origin}/?confirmed=1`);
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
