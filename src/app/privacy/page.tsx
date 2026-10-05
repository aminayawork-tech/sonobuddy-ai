import Link from "next/link";
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Privacy Policy — SonoBuddy AI",
  description: "SonoBuddy AI privacy policy: how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-14 pb-24 md:pt-16 md:pb-8" style={{ background: "#f8fafc" }}>
      <NavBar />
      <div className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>Privacy Policy</h1>
        <p className="mb-8 text-sm" style={{ color: "#94a3b8" }}>Last updated: May 2025</p>

        <Section title="1. Introduction">
          SonoBuddy AI ("we," "us," or "our") operates the SonoBuddy AI application and website at sonobuddyai.app. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. By using SonoBuddy AI, you agree to the terms of this policy.
        </Section>

        <Section title="2. Information We Collect">
          <b>Account information:</b> When you create an account, we collect your email address and a hashed password managed by our authentication provider (Supabase).<br /><br />
          <b>Ultrasound images:</b> Images you upload for analysis are transmitted securely to our AI processing service. We do not permanently store your uploaded images; they are processed in real time and discarded after the analysis is returned to you.<br /><br />
          <b>Usage data:</b> We collect anonymized information about how you interact with the app (pages visited, features used, scan counts) to improve our service.<br /><br />
          <b>Payment information:</b> Billing and payment data are handled entirely by Apple through In-App Purchase. We never store your credit card number or full payment details on our servers.
        </Section>

        <Section title="3. How We Use Your Information">
          We use the information we collect to:
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Provide, operate, and maintain the SonoBuddy AI service</li>
            <li>Process AI-guided ultrasound study walkthroughs</li>
            <li>Manage your account and subscription</li>
            <li>Send transactional emails (account creation, password reset)</li>
            <li>Monitor usage to enforce plan limits and prevent abuse</li>
            <li>Improve and develop new features based on aggregated usage patterns</li>
          </ul>
        </Section>

        <Section title="4. Medical Disclaimer">
          SonoBuddy AI is an educational study tool only. It is <strong>not a substitute for professional medical care</strong> and does not provide medical advice, diagnosis, or treatment. Always seek the advice of a licensed physician or other qualified healthcare provider with any questions regarding a medical condition. Do not use SonoBuddy AI as the basis for any medical decision.
        </Section>

        <Section title="5. Data Sharing and Third Parties">
          We do not sell your personal information. We share data only with:<br /><br />
          <b>Anthropic:</b> Ultrasound images and related prompts are sent to Anthropic's API for AI processing. Anthropic's data practices are governed by their own privacy policy.<br /><br />
          <b>Supabase:</b> Manages user authentication and profile storage. Data is encrypted at rest and in transit.<br /><br />
          <b>Apple (In-App Purchase):</b> Handles all payment processing and subscription entitlement management. Subject to Apple's privacy policy.<br /><br />
          <b>Vercel:</b> Hosts the application. Processes request logs as part of hosting infrastructure.
        </Section>

        <Section title="6. Data Retention">
          Account data is retained for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we are required to retain it by law (e.g., financial records). Uploaded images are not retained after analysis is complete.
        </Section>

        <Section title="7. Security">
          We implement industry-standard security measures including TLS encryption in transit, encrypted storage, and access controls. However, no method of transmission or storage is 100% secure. We encourage you not to upload images containing patient-identifying information.
        </Section>

        <Section title="8. HIPAA Notice">
          SonoBuddy AI is not a HIPAA-covered entity. Do not upload protected health information (PHI) as defined under HIPAA. If your use case requires HIPAA compliance, please contact us at <a href="mailto:support@sonobuddyai.app" className="text-purple-600 underline">support@sonobuddyai.app</a> before proceeding.
        </Section>

        <Section title="9. Children's Privacy">
          SonoBuddy AI is intended for use by students and learners aged 18 and over and is not directed to individuals under 18. We do not knowingly collect personal information from children.
        </Section>

        <Section title="10. Your Rights">
          Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. To exercise any of these rights, please contact us at <a href="mailto:support@sonobuddyai.app" className="text-purple-600 underline">support@sonobuddyai.app</a>.
        </Section>

        <Section title="11. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice in the app. Continued use of SonoBuddy AI after changes take effect constitutes acceptance of the revised policy.
        </Section>

        <Section title="12. Contact Us">
          Questions about this Privacy Policy? Contact us at:<br />
          <a href="mailto:support@sonobuddyai.app" className="text-purple-600 underline">support@sonobuddyai.app</a>
        </Section>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm font-medium" style={{ color: "#7c3aed" }}>← Back to SonoBuddy AI</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-bold" style={{ color: "#1a2235" }}>{title}</h2>
      <div className="text-sm leading-relaxed" style={{ color: "#374151" }}>{children}</div>
    </div>
  );
}
