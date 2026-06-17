import {
  MapPin,
  BarChart2,
  Layout,
  Eye,
  Mail,
  DollarSign,
  Users,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = { icon: LucideIcon; title: string; body: string };

const features: Feature[] = [
  {
    icon: MapPin,
    title: "Live Prospect Search",
    body: "Country, state, city, ZIP, or keyword. Real-time scanning, not a stale list.",
  },
  {
    icon: BarChart2,
    title: "Lead Scoring Engine",
    body: "Every lead ranked 1-10 by signal quality, rating, and demand.",
  },
  {
    icon: Layout,
    title: "AI Website Builder",
    body: "Full site in 60 seconds. Copy, layout, images, SEO. Tuned per category.",
  },
  {
    icon: Eye,
    title: "Trackable Preview Links",
    body: "See when they open it, how many times, from where. Know who is hot.",
  },
  {
    icon: Mail,
    title: "Automated Outreach",
    body: "Industry-specific email + SMS. Multi-step follow-up with objection handling.",
  },
  {
    icon: DollarSign,
    title: "Auto-Close + Stripe",
    body: "Payment link in outreach. They pay, site deploys, you get notified.",
  },
  {
    icon: Users,
    title: "Built-In CRM",
    body: "Pipeline with status, notes, last activity. Slack + email alerts.",
  },
  {
    icon: RefreshCw,
    title: "MRR Dashboard",
    body: "Track hosting revenue, conversion rates, and lifetime value.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 md:px-10 py-16 md:py-20" style={{ background: "#F5F5F5" }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="pm-eyebrow mb-3">Features</div>
        <h2 className="mb-3" style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>
          Everything In One Platform.
        </h2>
        <p className="max-w-[520px] text-[15px]" style={{ color: "#666" }}>
          No stitching tools together. No Zapier. No manual steps.
        </p>

        <div
          className="mt-10 overflow-hidden"
          style={{
            border: "0.5px solid #E0E0E0",
            borderRadius: 12,
            background: "#E0E0E0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white p-6">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    background: "#FFF0F0",
                    borderRadius: 7,
                  }}
                >
                  <Icon size={16} style={{ color: "#CC0000" }} strokeWidth={2} />
                </div>
                <h4 className="mt-3 text-[13px]">{f.title}</h4>
                <p className="mt-1.5 text-[12px]" style={{ color: "#666", lineHeight: 1.6 }}>
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
