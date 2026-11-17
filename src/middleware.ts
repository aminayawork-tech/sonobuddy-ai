import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  // The iOS / Android apps load the site root; "/" is now the marketing page,
  // so send the native shells straight to the app (keeps existing builds working).
  if (request.nextUrl.pathname === "/") {
    const ua = request.headers.get("user-agent") ?? "";
    const isNativeApp = ua.includes("PWAShell") || ua.includes("SonoBuddyAI-Android") || request.cookies.has("app-platform");
    if (isNativeApp) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }
  }

  // Skip session refresh if Supabase isn't configured yet
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.next({ request });
  }

  const { createServerClient } = await import("@supabase/ssr");
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
