import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CreditCard, KeyRound, Mail, Trash2 } from "lucide-react";

export const metadata = {
  title: "Support — SonoBuddy AI",
  description: "Get help with SonoBuddy AI: contact us, manage your subscription, reset your password or delete your account.",
};

const EMAIL = "hello@sonobuddy.com";

const HELP = [
  {
    icon: CreditCard,
    title: "Manage or cancel your subscription",
    text: "Subscriptions are billed through Apple. On your iPhone, open Settings → your name → Subscriptions → SonoBuddy AI. To restore a purchase on a new phone, tap Restore Purchases on the Pro screen in the app.",
  },
  {
    icon: KeyRound,
    title: "Forgot your password",
    text: "On the sign-in screen, tap “Forgot password?” and enter your email. We'll send you a link to choose a new one.",
  },
  {
    icon: Trash2,
    title: "Delete your account",
    text: "In the app, open the menu (☰) on Home → Account → “Delete account” at the bottom. This permanently deletes your account and study history. Cancel any App Store subscription separately.",
  },
];

const FAQ = [
  { q: "I didn't get the confirmation email", a: "Check your spam or promotions folder for an email from SonoBuddy AI. Links expire after 1 hour; if yours expired, tap Create Free Account again with the same email to get a new link, or email us." },
  { q: "The AI result looks wrong", a: "AI walkthroughs can be wrong, and label positions are approximate. Use the Report button on the result so we can review it. SonoBuddy AI is a study tool and should never be used for patient care." },
  { q: "Where are my images?", a: "Images are kept only on the device where you studied them (Account → Scan images). Your study notes sync to your account on every device." },
  { q: "How many free study sessions do I get?", a: "Free accounts get 5 AI study sessions every month. SonoBuddy AI Pro on iPhone unlocks unlimited sessions." },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: "#eef3f8" }}>
      <div className="mx-auto max-w-2xl px-5 pt-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/sonobuddy-favicon.png" alt="" width={30} height={30} className="rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight">
            <span style={{ color: "#0f172a" }}>Sono</span><span style={{ color: "#7c3aed" }}>Buddy </span><span style={{ color: "#7c3aed", fontStyle: "italic" }}>ai</span>
          </span>
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>How can we help?</h1>
        <p className="mt-2 text-[15px]" style={{ color: "#5a6a85" }}>We usually reply within 1–2 business days.</p>

        <a href={`mailto:${EMAIL}?subject=SonoBuddy%20AI%20support`}
          className="mt-6 flex items-center gap-4 rounded-3xl p-5 text-white transition-transform active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)", boxShadow: "0 14px 34px -14px rgba(124,58,237,0.6)" }}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.18)" }}>
            <Mail size={22} />
          </span>
          <span>
            <span className="block text-sm font-semibold" style={{ color: "#ede9fe" }}>Email us</span>
            <span className="block text-lg font-bold">{EMAIL}</span>
          </span>
        </a>

        <div className="mt-8 space-y-3">
          {HELP.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-white p-5" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "#f5f3ff" }}>
                <Icon size={18} style={{ color: "#7c3aed" }} />
              </span>
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: "#0f172a" }}>{title}</h2>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "#5a6a85" }}>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-extrabold" style={{ color: "#0f172a" }}>Common questions</h2>
        <div className="mt-4 space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-2xl bg-white px-5 py-4" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold" style={{ color: "#0f172a" }}>
                {q}
                <ChevronDown size={17} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: "#94a3b8" }} />
              </summary>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5a6a85" }}>{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" style={{ color: "#7c3aed" }}>
          <Link href="/app">Open the app</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </div>
        <p className="mt-6 text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
          SonoBuddy AI is an educational study tool. It is not a medical device and does not provide medical advice, diagnosis or treatment.
        </p>
      </div>
    </div>
  );
}
