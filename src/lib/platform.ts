// The Android shell appends this to its user agent (see capacitor.config.ts).
// Pro is sold only through Apple In-App Purchase, so the Android app runs on
// the free plan until Google Play Billing is added.
export function isAndroidApp(): boolean {
  return typeof navigator !== "undefined" && navigator.userAgent.includes("SonoBuddyAI-Android");
}
