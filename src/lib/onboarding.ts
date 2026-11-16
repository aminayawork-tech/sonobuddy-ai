import type { Category } from "./protocols";

// Answers from the onboarding questions. Kept in localStorage so they survive
// the sign-up / email-confirmation round trip, then copied onto the user's
// profile (role, focus_areas, onboarded_at) once they're signed in.
const KEY = "sonobuddyai_onboarding_v2";

export type StudyRole =
  | "sonography_student"
  | "medical_student"
  | "resident"
  | "nurse_pa_np"
  | "sonographer"
  | "curious";

export interface OnboardingAnswers {
  role: StudyRole | null;
  focusAreas: Category[];
  completedAt: string | null;
}

export const EMPTY_ANSWERS: OnboardingAnswers = { role: null, focusAreas: [], completedAt: null };

export function getOnboarding(): OnboardingAnswers {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY_ANSWERS, ...JSON.parse(raw) };
  } catch {
    // storage unavailable or corrupt
  }
  return EMPTY_ANSWERS;
}

export function saveOnboarding(answers: OnboardingAnswers) {
  try {
    localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // storage unavailable
  }
}

// Events other components use to open the onboarding / auth UI.
export const OPEN_ONBOARDING_EVENT = "sbai:open-onboarding";
export const OPEN_AUTH_EVENT = "sbai:open-auth";
