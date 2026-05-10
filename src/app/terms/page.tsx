import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Curl IQ",
};

const EFFECTIVE_DATE = "April 8, 2026";
const CONTACT_EMAIL = "team@job-to-go.com";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-[13px] mb-8" style={{ color: "var(--text-tertiary)" }}>
          Effective {EFFECTIVE_DATE}
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Acceptance of terms
            </h2>
            <p>
              By creating an account or using Curl IQ, you agree to these Terms of Service. If you
              do not agree, do not use the app.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              What Curl IQ provides
            </h2>
            <p>
              Curl IQ is an AI-powered tool that analyses hair photos to identify curl type, assess
              hair health, and suggest care routines and products. Results are generated automatically
              by artificial intelligence and are intended for informational and educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Not medical or professional advice
            </h2>
            <p>
              Curl IQ is <strong style={{ color: "var(--text-primary)" }}>not a medical service</strong>.
              The analysis, scores, and product recommendations provided by Curl IQ are not a substitute
              for professional advice from a trichologist, dermatologist, or licensed hair care
              professional. If you have concerns about scalp health, hair loss, or any medical condition,
              please consult a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              AI limitations
            </h2>
            <p>
              AI analysis is not perfect. Results may vary based on photo quality, lighting, and other
              factors. Curl IQ makes no guarantee that the analysis is accurate, complete, or suitable
              for your specific circumstances. Product recommendations are suggestions only — always
              perform a patch test before using new hair care products.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Your account
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 13 years old to use Curl IQ.</li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>You may only create one account per person.</li>
              <li>
                You may delete your account at any time from the app settings. All data will be
                permanently removed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Upload images that do not contain hair, or images of other people without their consent.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the service.</li>
              <li>Use the service in any way that violates applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Intellectual property
            </h2>
            <p>
              The Curl IQ app, branding, and all content created by us remain our intellectual property.
              You retain ownership of the photos you upload.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Disclaimer of warranties
            </h2>
            <p>
              Curl IQ is provided "as is" without warranties of any kind. We do not guarantee
              uninterrupted or error-free service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Curl IQ and its developers shall not be liable
              for any indirect, incidental, or consequential damages arising from your use of the app.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the app after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-[16px] mb-2" style={{ color: "var(--text-primary)" }}>
              Contact
            </h2>
            <p>
              Questions about these terms? Email us at{" "}
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