import { GoogleAuth } from "google-auth-library";
import { createServiceClient } from "@/lib/supabase/server";

// Server-side verification of Google Play subscriptions. Requires a Google
// Cloud service account with access to the app in Play Console, stored as the
// GOOGLE_PLAY_SERVICE_ACCOUNT_JSON environment variable (the whole JSON key).

export const ANDROID_PACKAGE = "app.sonobuddy.ai";
export const PLAY_PRODUCT_IDS = ["sonobuddyai_pro_monthly", "sonobuddyai_pro_yearly"] as const;

const API = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${ANDROID_PACKAGE}/purchases`;

let auth: GoogleAuth | null = null;
function getAuth() {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  auth ??= new GoogleAuth({
    credentials: JSON.parse(raw),
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
  return auth;
}

export function googlePlayConfigured() {
  return !!process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
}

export interface PlayEntitlement {
  entitled: boolean;
  productId: string | null;
  expiresAt: string | null;
}

// Subscription states that still grant access. CANCELED means auto-renew is
// off but the paid period hasn't ended yet, so it's checked against expiry.
const ACTIVE_STATES = ["SUBSCRIPTION_STATE_ACTIVE", "SUBSCRIPTION_STATE_IN_GRACE_PERIOD", "SUBSCRIPTION_STATE_CANCELED"];

export async function verifyPlaySubscription(purchaseToken: string): Promise<PlayEntitlement> {
  const client = await getAuth()?.getClient();
  if (!client) throw new Error("Google Play verification is not configured");

  const { data } = await client.request<{
    subscriptionState?: string;
    acknowledgementState?: string;
    lineItems?: { productId: string; expiryTime?: string }[];
  }>({ url: `${API}/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}` });

  const item = (data.lineItems ?? [])
    .filter((l) => (PLAY_PRODUCT_IDS as readonly string[]).includes(l.productId))
    .sort((a, b) => (b.expiryTime ?? "").localeCompare(a.expiryTime ?? ""))[0];
  const expiresAt = item?.expiryTime ?? null;
  const notExpired = !!expiresAt && new Date(expiresAt).getTime() > Date.now();
  const entitled = !!item && notExpired && ACTIVE_STATES.includes(data.subscriptionState ?? "");

  // Google refunds purchases that aren't acknowledged within 3 days. The app
  // acknowledges too; this covers the case where it didn't get the chance.
  if (entitled && data.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
    await client.request({
      url: `${API}/subscriptions/${item.productId}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`,
      method: "POST",
      data: {},
    }).catch((err) => console.warn("[googlePlay] acknowledge failed", err));
  }

  return { entitled, productId: item?.productId ?? null, expiresAt };
}

// Re-checks an Android subscriber whose paid period has passed, so a
// cancelled or lapsed subscription returns the account to the free plan.
export async function refreshPlayEntitlement(userId: string) {
  if (!googlePlayConfigured()) return;
  const db = createServiceClient();
  const { data: profile } = await db
    .from("profiles")
    .select("tier, google_purchase_token, pro_expires_at")
    .eq("id", userId)
    .single();
  if (!profile?.google_purchase_token || profile.tier !== "pro") return;
  if (profile.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now()) return;

  try {
    const result = await verifyPlaySubscription(profile.google_purchase_token);
    await db.from("profiles").update(
      result.entitled
        ? { pro_expires_at: result.expiresAt }
        : { tier: "free", pro_expires_at: result.expiresAt },
    ).eq("id", userId);
  } catch (err) {
    // Leave access unchanged if Google can't be reached; try again next time.
    console.warn("[googlePlay] refresh failed", err);
  }
}
