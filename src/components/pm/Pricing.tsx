import { useState } from "react";
import { Check, Tag } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Plan = {
  name: string;
  monthly: number;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 49,
    tagline: "Test your first market and close your first 3 to 5 deals.",
    features: [
      "50 Lead Searches / Month",
      "10 AI Sites Built / Month",
      "Automated Email Outreach",
      "Trackable Preview Links",
      "CRM Pipeline",
      "Stripe Payments",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthly: 149,
    tagline: "For serious operators closing 10 to 20 deals a month on full autopilot.",
    features: [
      "200 Lead Searches / Month",
      "50 AI Sites Built / Month",
      "Email + SMS Outreach",
      "Multi-Step Follow-Up Sequences",
      "AI Objection Handling",
      "Skip Trace Enrichment",
      "Revenue Dashboard",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Agency",
    monthly: 399,
    tagline: "White-label the whole system. Run it under your brand.",
    features: [
      "Unlimited Searches",
      "Unlimited AI Sites",
      "White-Label Dashboard",
      "Multi-Seat Access",
      "Custom Domain Branding",
      "Priority Support",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="px-6 md:px-10 py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] text-center">
        <SectionHeader
          icon={Tag}
          eyebrow="Pricing"
          headline={<>Start Free. <span style={{ color: "#CC0000" }}>Scale When You Close.</span></>}
          subtext="Every plan includes the full automation stack. Pay more only when you want more volume."
          maxWidth={560}
        />

        <div
          className="inline-flex mt-7 p-1"
          style={{ background: "#F5F5F5", borderRadius: 8 }}
        >
          {[
            { id: false, label: "Monthly" },
            { id: true, label: "Annual" },
          ].map((opt) => (
            <button
              key={String(opt.id)}
              onClick={() => setAnnual(opt.id)}
              className="px-4 py-2 text-[13px] font-medium transition-all"
              style={{
                background: annual === opt.id ? "white" : "transparent",
                color: annual === opt.id ? "#111" : "#666",
                borderRadius: 6,
                boxShadow: annual === opt.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {opt.label}
            {opt.id && (
                <span
                  className="ml-2 text-[10px] px-1.5 py-0.5"
                  style={{ background: "#FFF0F0", color: "#CC0000", borderRadius: 10 }}
                >
                  2 Months Free
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-9 grid md:grid-cols-3 gap-3.5 max-w-[920px] mx-auto text-left">
          {plans.map((p) => {
            const price = annual ? p.monthly * 10 : p.monthly;
            const suffix = annual ? "/yr" : "/mo";
            return (
              <div
                key={p.name}
                className="bg-white relative p-6 md:p-7 flex flex-col"
                style={{
                  border: p.featured ? "1.5px solid #CC0000" : "0.5px solid #E0E0E0",
                  borderRadius: 12,
                }}
              >
                {p.featured && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 text-white"
                    style={{ background: "#CC0000", borderRadius: 20 }}
                  >
                    Most Popular
                  </span>
                )}
                <div className="text-[14px] font-medium" style={{ color: "#111" }}>
                  {p.name}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[32px] font-medium" style={{ color: "#111" }}>
                    ${price.toLocaleString()}
                  </span>
                  <span className="text-[13px]" style={{ color: "#666" }}>
                    {suffix}
                  </span>
                </div>
                <p className="mt-2 text-[12px]" style={{ color: "#666", lineHeight: 1.55 }}>
                  {p.tagline}
                </p>
                <button
                  className={p.featured ? "pm-btn-red mt-5 justify-center" : "pm-btn-ghost mt-5 justify-center"}
                  style={{ width: "100%" }}
                >
                  {p.cta}
                </button>
                <div
                  className="my-5"
                  style={{ height: "0.5px", background: "#E0E0E0" }}
                />
                <ul className="flex flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px]" style={{ color: "#666" }}>
                      <Check size={13} style={{ color: "#CC0000", marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-7 text-[12px]" style={{ color: "#999" }}>
          Switch plans anytime · No setup fees · Prices in USD
        </p>
      </div>
    </section>
  );
}
