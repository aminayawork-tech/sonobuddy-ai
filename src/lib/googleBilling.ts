"use client";

// Google Play Billing for the Android app (Capacitor plugin
// @capgo/native-purchases). Only used inside the Android shell.
import { NativePurchases, PURCHASE_TYPE, type Product } from "@capgo/native-purchases";
import { PLANS, type PlanKey } from "@/lib/plans";

export interface PlayPlan {
  productId: string;
  basePlanId: string;
  offerToken?: string;
  priceString: string;
  price: number;
}

// Base offers only (no intro/promo offers), keyed by our plan key.
export async function loadPlayPlans(): Promise<Partial<Record<PlanKey, PlayPlan>>> {
  const ids = (Object.keys(PLANS) as PlanKey[]).map((k) => PLANS[k].iapProductId);
  const { products } = await NativePurchases.getProducts({ productIdentifiers: ids, productType: PURCHASE_TYPE.SUBS });
  const out: Partial<Record<PlanKey, PlayPlan>> = {};
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    const matches = products.filter((p: Product) => (p.planIdentifier ?? p.identifier) === PLANS[key].iapProductId);
    const base = matches.find((p) => !p.offerId) ?? matches[0];
    if (base) {
      out[key] = {
        productId: PLANS[key].iapProductId,
        basePlanId: base.identifier,
        offerToken: base.offerToken,
        priceString: base.priceString,
        price: base.price,
      };
    }
  }
  return out;
}

async function syncToServer(productId: string, purchaseToken: string) {
  const res = await fetch("/api/android/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, purchaseToken }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "We couldn't verify your purchase. Please try Restore Purchases.");
  }
}

export async function buyPlayPlan(plan: PlayPlan) {
  const tx = await NativePurchases.purchaseProduct({
    productIdentifier: plan.productId,
    planIdentifier: plan.basePlanId,
    offerToken: plan.offerToken,
    productType: PURCHASE_TYPE.SUBS,
  });
  if (!tx.purchaseToken) throw new Error("Google Play didn't return a purchase. Please try again.");
  await syncToServer(plan.productId, tx.purchaseToken);
}

// Returns true if an active subscription was found and linked.
export async function restorePlayPurchases(): Promise<boolean> {
  const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS });
  const ours = purchases.filter((p) => p.purchaseToken && Object.values(PLANS).some((pl) => pl.iapProductId === p.productIdentifier));
  for (const p of ours) {
    await syncToServer(p.productIdentifier, p.purchaseToken!);
    return true;
  }
  return false;
}

export function playSubscriptionsUrl() {
  return "https://play.google.com/store/account/subscriptions?package=app.sonobuddy.ai";
}
