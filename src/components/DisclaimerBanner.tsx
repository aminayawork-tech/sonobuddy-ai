import { ShieldAlert } from "lucide-react";

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs"
        style={{ borderColor: "#fcd34d", background: "#fefce8", color: "#92400e" }}>
        <ShieldAlert size={13} style={{ flexShrink: 0, color: "#ca8a04" }} />
        <span>
          <strong>Educational use only — not medical advice.</strong> SonoBuddy AI does not diagnose or
          treat. Always consult a licensed physician for medical decisions.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4"
      style={{ borderColor: "#fcd34d", background: "#fefce8" }}>
      <div className="flex items-start gap-3">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" style={{ color: "#ca8a04" }} />
        <div className="space-y-1">
          <p className="text-sm font-bold" style={{ color: "#92400e" }}>Important Disclaimer</p>
          <p className="text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
            SonoBuddy AI is an educational study tool only.{" "}
            <strong>It does not provide medical advice, diagnosis, or treatment</strong> and is not
            a substitute for professional medical care. Always seek the advice of a licensed
            physician or other qualified healthcare provider with any questions regarding a
            medical condition.
          </p>
        </div>
      </div>
    </div>
  );
}
