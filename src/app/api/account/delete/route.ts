import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// In-app account deletion (required by App Store 5.1.1(v) and Google Play).
// App data is removed first, then the sign-in account itself.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Your session has expired. Please sign in again, then delete your account." }, { status: 401 });

  let db;
  try {
    db = createServiceClient();
  } catch (err) {
    console.error("[account/delete] service client unavailable:", err);
    return NextResponse.json({ error: "Account deletion is temporarily unavailable (server configuration). Please email hello@sonobuddy.com." }, { status: 500 });
  }

  // Delete the user's data explicitly rather than relying only on cascades,
  // so a missing cascade can't block deleting the account.
  const history = await db.from("scan_history").delete().eq("user_id", user.id);
  if (history.error) console.error("[account/delete] scan_history:", history.error);
  const profile = await db.from("profiles").delete().eq("id", user.id);
  if (profile.error) console.error("[account/delete] profiles:", profile.error);

  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[account/delete] auth user:", error);
    return NextResponse.json({ error: `Could not delete account (${error.message}). Please try again or email hello@sonobuddy.com.` }, { status: 500 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
