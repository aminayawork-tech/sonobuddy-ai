// Subscription plans — sold exclusively via Apple In-App Purchase (StoreKit).
// Product IDs here MUST match the auto-renewable subscription products
// configured in App Store Connect exactly.
export type PlanKey = "pro_monthly" | "pro_yearly";

export const PLANS: Record<PlanKey, {
  name: string;
  price: string;
  period: string;
  badge?: string;
  iapProductId: string;
  features: string[];
}> = {
  pro_monthly: {
    name: "Pro",
    price: "$9.99",
    period: "month",
    iapProductId: "sonobuddyai_pro_monthly",
    features: [
      "Unlimited AI study sessions",
      "All 34 protocols",
      "Full reference measurements",
      "AI chat",
      "PDF study export",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
  pro_yearly: {
    name: "Pro",
    price: "$69.99",
    period: "year",
    badge: "4 months free",
    iapProductId: "sonobuddyai_pro_yearly",
    features: [
      "Unlimited AI study sessions",
      "All 34 protocols",
      "Full reference measurements",
      "AI chat",
      "PDF study export",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
};

export const FREE_SCAN_LIMIT = 5;

// Black Friday sale on the yearly plan. The app only displays this price —
// Apple charges whatever App Store Connect has for sonobuddyai_pro_yearly, so
// schedule the same $49.99 price there for the same dates.
export const YEARLY_SALE = {
  price: "$49.99",
  label: "BLACK FRIDAY",
  endsLabel: "Ends Nov 30",
  // Midnight Dec 1 US Eastern — the app falls back to the regular price after this.
  endsAt: new Date("2026-12-01T05:00:00Z"),
};

export function yearlySaleActive(now = new Date()) {
  return now < YEARLY_SALE.endsAt;
}

export function planPrice(key: PlanKey) {
  return key === "pro_yearly" && yearlySaleActive() ? YEARLY_SALE.price : PLANS[key].price;
}
