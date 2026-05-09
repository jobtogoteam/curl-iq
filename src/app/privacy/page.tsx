import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Curl IQ",
};

const EFFECTIVE_DATE = "April 8, 2026";
const CONTACT_EMAIL = "privacy@curliq.app";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-5 pt-12 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-prose mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[13px] mb-8"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ChevronLeft size={14} />
          Back
        </Link>

        <h1
          className="font-display mb-1"
          style={{ fontSize: "32px", fontWeight: 500, color: "var(--text-primary)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-[13px] mb-8" style={{ color: "var(--text-tertiary)" }}>
          Effective {EFFECTIVE_DATE}
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              What is Curl IQ?
            </h2>
            <p>
              Curl IQ is an AI-powered mobile app that analyses hair photos to provide personalised curl
              type identification, hair health metrics, routine recommendations, and product suggestions.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Data we collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Account information:</strong> Your email
                address, display name, and hashed password when you register.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Hair photos:</strong> Images you upload
                for analysis. These are stored on our servers.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Analysis results:</strong> AI-generated
                hair metrics, curl type, health scores, routine steps, and product recommendations
                associated with your account.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Usage data:</strong> Basic server logs
                (request timestamps, errors) for debugging purposes. We do not use third-party analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              How we use your data
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve the Curl IQ service.</li>
              <li>
                To send your hair photos to the{" "}
                <strong style={{ color: "var(--text-primary)" }}>Anthropic Claude API</strong> for
                AI analysis. Anthropic processes images transiently and does not store them for training.
                See{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)" }}
                >
                  Anthropic's privacy policy
                </a>
                .
              </li>
              <li>To store your scan history so you can track progress over time.</li>
              <li>We do not sell your data to any third party.</li>
              <li>We do not use your data to train AI models.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Data retention
            </h2>
            <p>
              Your data is retained for as long as your account is active. If you delete your account,
              all associated data (scans, photos, analysis results, and account information) is permanently
              deleted within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Your rights
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Access:</strong> You can view all your
                scan data within the app.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Deletion:</strong> You can permanently
                delete your account and all associated data from the app settings at any time.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Portability:</strong> To request an
                export of your data, email us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--primary)" }}>
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Security
            </h2>
            <p>
              Passwords are hashed and never stored in plain text. Sessions are encrypted. Images are
              stored securely on our servers. We use HTTPS for all data transmission.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Children's privacy
            </h2>
            <p>
              Curl IQ is not intended for children under 13. We do not knowingly collect personal
              information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. We will notify users of significant changes
              via the app. The effective date at the top of this page reflects the latest revision.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Contact
            </h2>
            <p>
              Questions or requests regarding your privacy can be sent to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--primary)" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}