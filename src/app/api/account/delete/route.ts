import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// In-app account deletion (required by App Store 5.1.1(v) and Google Play).
// Deleting the auth user cascades to profiles and scan_history.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error } = await createServiceClient().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Account deletion failed:", error);
    return NextResponse.json({ error: "Could not delete account. Please try again." }, { status: 500 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
