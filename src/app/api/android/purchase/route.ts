import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { PLAY_PRODUCT_IDS, googlePlayConfigured, verifyPlaySubscription } from "@/lib/googlePlay";

// Called by the Android app after a Google Play purchase or restore. The
// purchase token is verified with Google before the account becomes Pro.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!googlePlayConfigured()) {
    console.error("[android/purchase] GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is not set");
    return NextResponse.json({ error: "Purchases can't be verified right now. Please try again later." }, { status: 503 });
  }

  const { productId, purchaseToken } = await req.json().catch(() => ({})) as { productId?: string; purchaseToken?: string };
  if (!purchaseToken || !productId || !(PLAY_PRODUCT_IDS as readonly string[]).includes(productId)) {
    return NextResponse.json({ error: "Invalid purchase" }, { status: 400 });
  }

  let result;
  try {
    result = await verifyPlaySubscription(purchaseToken);
  } catch (err) {
    console.error("[android/purchase] verification failed", err);
    return NextResponse.json({ error: "We couldn't verify this purchase with Google Play." }, { status: 502 });
  }
  if (!result.entitled) {
    return NextResponse.json({ error: "This subscription isn't active." }, { status: 402 });
  }

  const db = createServiceClient();
  // One Google Play subscription can only unlock one SonoBuddy AI account.
  const { data: owner } = await db.from("profiles").select("id").eq("google_purchase_token", purchaseToken).maybeSingle();
  if (owner && owner.id !== user.id) {
    return NextResponse.json({ error: "This subscription is already linked to another SonoBuddy AI account." }, { status: 409 });
  }

  const { error } = await db.from("profiles").update({
    tier: "pro",
    google_purchase_token: purchaseToken,
    pro_expires_at: result.expiresAt,
  }).eq("id", user.id);
  if (error) {
    console.error("[android/purchase] profile update failed", error);
    return NextResponse.json({ error: "Purchase verified but your account couldn't be updated. Please contact support." }, { status: 500 });
  }

  return NextResponse.json({ success: true, tier: "pro", expiresAt: result.expiresAt });
}
