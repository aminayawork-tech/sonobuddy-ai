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
      "All 31 protocols",
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
      "All 31 protocols",
      "Full reference measurements",
      "AI chat",
      "PDF study export",
      "PHI auto-redaction",
      "Priority AI queue",
    ],
  },
};

export const FREE_SCAN_LIMIT = 5;
