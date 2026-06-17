import {
  MapPin,
  BarChart2,
  Layout,
  Eye,
  Mail,
  Users,
  DollarSign,
  TrendingUp,
  Check,
  Zap,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  bullets: string[];
  onlyUs?: boolean;
};

const features: Feature[] = [
  {
    icon: MapPin,
    title: "Live Prospect Search",
    desc: "Real-time Google Maps scanning. Not a stale database. Every result verified as no-website before it reaches you.",
    bullets: [
      "Search by country, state, city, ZIP, or any keyword",
      "Filter by category — restaurants, dentists, salons, plumbers, gyms",
      "Real-time website detection, no false positives",
      "Verified phone, address, hours, and rating on every result",
      "Reaches every city Google Maps covers globally",
    ],
  },
  {
    icon: BarChart2,
    title: "Lead Scoring Engine",
    desc: "Every lead gets a signal score from 1 to 10 so you know exactly who to call first.",
    bullets: [
      "Score factors: rating, review count, category demand, no-website",
      "HOT / WARM / COLD tier labels at a glance",
      "Sort results by score, rating, or proximity",
      "Slack and email alerts on every high-score lead found",
      "Score breakdown popover so you understand the ranking",
    ],
  },
  {
    icon: Layout,
    title: "AI Website Builder",
    onlyUs: true,
    desc: "A complete, on-brand demo site built in 60 seconds. A real deployed site with the prospect's name on it.",
    bullets: [
      "AI writes all copy tuned to the exact business category",
      "Category design systems for 12 verticals",
      "Free hosting + SSL on every preview",
      "Inline text editor to tweak headline and about section",
      "One-click deploy to custom domain when deal closes",
    ],
  },
  {
    icon: Eye,
    title: "Trackable Preview Links",
    desc: "Send a live preview of the site. See the moment they open it, how many times, and from which device.",
    bullets: [
      "Real-time open tracking, notified the moment they view",
      "Track total views, unique visitors, and CTA clicks",
      "Preview page shows a Claim This Website Stripe banner",
      "Professional preview.prospectmaster.com/{slug} URLs",
      "Trigger automated follow-up when view detected",
    ],
  },
  {
    icon: Mail,
    title: "AI Outreach + Follow-Up",
    onlyUs: true,
    desc: "Personalized cold email and SMS written by AI, sent automatically, with multi-step follow-up on autopilot.",
    bullets: [
      "Industry-specific copy — plumber scripts differ from restaurant",
      "3-step automated cadence: Day 1, Day 3, Day 7",
      "Built-in objection handling trained on high-converting data",
      "Email via Resend + SMS via Twilio, both channels included",
      "Stripe payment link embedded in every outreach",
    ],
  },
  {
    icon: Users,
    title: "Built-In CRM Pipeline",
    desc: "Every lead drops into a pipeline with status tracking, notes, and activity history.",
    bullets: [
      "Statuses: New, Contacted, Interested, Closed, Lost",
      "Auto-populated from lead data, no manual entry",
      "Slide-out detail panel with full business info and notes",
      "Last-activity tracking so you never let a hot lead go cold",
      "Filter by status, score, category, and date",
    ],
  },
  {
    icon: DollarSign,
    title: "Auto-Close + Stripe",
    onlyUs: true,
    desc: "The AI closes the deal. Stripe checkout goes out in the outreach. They pay, site deploys, you get notified.",
    bullets: [
      "Stripe payment link created automatically on site build",
      "On payment, site auto-deploys to prospect's custom domain",
      "Upsell to monthly hosting subscription, recurring MRR",
      "Set your own upfront price — $500, $1,000, $2,500, any amount",
      "100% of revenue goes to you, ProspectMaster takes no cut",
    ],
  },
  {
    icon: TrendingUp,
    title: "MRR Dashboard",
    desc: "Track every dollar earned, active hosting subscriptions, and which markets convert best.",
    bullets: [
      "Monthly revenue breakdown — upfront sales vs. recurring hosting",
      "12-month growth chart showing compounding MRR over time",
      "Track conversion rate, avg deal size, and total clients",
      "Saved searches that rerun daily for new no-website businesses",
      "Agency plan: white-label the entire dashboard under your brand",
    ],
  },
];

function OnlyUsBadge() {
  return (
    <span
      className="inline-flex items-center uppercase"
      style={{
        gap: 5,
        fontSize: 9,
        letterSpacing: "0.07em",
        padding: "2px 8px",
        borderRadius: 20,
        background: "#FFF0F0",
        color: "#CC0000",
        border: "0.5px solid rgba(204,0,0,0.25)",
        fontWeight: 500,
      }}
    >
      <Zap size={10} />
      Only Us
    </span>
  );
}

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 md:px-10 py-16 md:py-20" style={{ background: "#F5F5F5" }}>
      <div className="mx-auto max-w-[1100px]">
        <SectionHeader
          icon={Layers}
          eyebrow="Why ProspectMaster"
          headline={
            <>
              Everything Competitors Do. <span style={{ color: "#CC0000" }}>Plus Everything They Don't.</span>
            </>
          }
          subtext="Other systems help you find leads. Others help you build websites. ProspectMaster does all of it and keeps going until the deal is closed."
          maxWidth={620}
        />

        <div
          className="mt-10 overflow-hidden grid md:grid-cols-2"
          style={{
            border: "0.5px solid #E0E0E0",
            borderRadius: 12,
            background: "#E8E8E8",
            gap: 1,
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white p-7">
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 30, height: 30, background: "#FFF0F0", borderRadius: 8 }}
                  >
                    <Icon size={16} style={{ color: "#CC0000" }} strokeWidth={2} />
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 500, color: "#0E1116" }}>{f.title}</h4>
                  {f.onlyUs && <OnlyUsBadge />}
                </div>
                <p
                  className="mt-3"
                  style={{ fontSize: 12, color: "#666", lineHeight: 1.6, paddingLeft: 42 }}
                >
                  {f.desc}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5" style={{ paddingLeft: 42 }}>
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check size={13} style={{ color: "#CC0000", marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
                      <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
