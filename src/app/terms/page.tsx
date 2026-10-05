import Link from "next/link";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Terms of Use — SonoBuddy AI",
  description: "SonoBuddy AI terms of use and service agreement.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-14 pb-24 md:pt-16 md:pb-8" style={{ background: "#f8fafc" }}>
      <NavBar />
      <div className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>Terms of Use</h1>
        <p className="mb-8 text-sm" style={{ color: "#94a3b8" }}>Last updated: May 2025</p>

        <Section title="1. Acceptance of Terms">
          By accessing or using SonoBuddy AI ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.
        </Section>

        <Section title="2. Medical Disclaimer">
          SonoBuddy AI is an educational study tool only. It does <strong>not</strong> constitute medical advice, diagnosis, or treatment, and is not a substitute for professional medical care. All AI-generated output is for educational study purposes only and must never be used as the basis for any clinical or medical decision. Always seek the advice of a licensed physician or other qualified healthcare provider with any questions regarding a medical condition.
        </Section>

        <Section title="3. Eligibility">
          You must be at least 18 years of age to use SonoBuddy AI. By creating an account, you represent that you meet this requirement.
        </Section>

        <Section title="4. Account Responsibilities">
          You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately at support@sonobuddyai.app if you suspect unauthorized access.
        </Section>

        <Section title="5. Acceptable Use">
          You agree not to:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Upload protected health information (PHI) or identifiable patient data</li>
            <li>Use the Service to provide medical advice to patients without appropriate clinical oversight</li>
            <li>Attempt to reverse-engineer, copy, or resell any part of the Service</li>
            <li>Use automated scripts to access or scrape the Service</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </Section>

        <Section title="6. Subscription and Billing">
          Paid plans are billed on a recurring basis (monthly or annually) via Apple In-App Purchase. You may cancel your subscription at any time through your Apple ID subscription settings. Cancellation takes effect at the end of the current billing period. Refunds are handled by Apple in accordance with its own refund policies.
        </Section>

        <Section title="7. Intellectual Property">
          All content, features, and functionality of SonoBuddy AI — including the AI models, interface design, protocols, and educational content — are the exclusive property of SonoBuddy AI and are protected by applicable intellectual property laws. You may not reproduce or distribute any part of the Service without written permission.
        </Section>

        <Section title="8. Limitation of Liability">
          To the maximum extent permitted by law, SonoBuddy AI and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including any clinical decisions made in reliance on AI-generated output. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.
        </Section>

        <Section title="9. Indemnification">
          You agree to indemnify and hold harmless SonoBuddy AI, its operators, and affiliates from any claims, damages, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or any clinical decisions you make.
        </Section>

        <Section title="10. Termination">
          We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any conduct we determine to be harmful to the Service or its users.
        </Section>

        <Section title="11. Changes to Terms">
          We may update these Terms from time to time. We will notify you of material changes by email or in-app notice. Continued use after changes are posted constitutes acceptance.
        </Section>

        <Section title="12. Governing Law">
          These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the applicable jurisdiction.
        </Section>

        <Section title="13. Contact">
          Questions? Contact us at <a href="mailto:support@sonobuddyai.app" className="text-blue-600 underline">support@sonobuddyai.app</a>.
        </Section>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-medium" style={{ color: "#2563eb" }}>← Back to SonoBuddy AI</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-bold" style={{ color: "#1a2235" }}>{title}</h2>
      <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{children}</p>
    </div>
  );
}
