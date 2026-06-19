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
    title: "Revenue Dashboard",
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

// Mini UI mockup visuals — one per feature
const RED = "#CC0000";
const SOFT = "#FFF0F0";

function VisualWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-5 relative overflow-hidden"
      style={{
        marginLeft: 42,
        height: 140,
        borderRadius: 10,
        border: "0.5px solid #ECECEC",
        background: "linear-gradient(135deg, #FAFAFA 0%, #FFF5F5 100%)",
        padding: 12,
      }}
    >
      {children}
    </div>
  );
}

function MockSearch() {
  return (
    <VisualWrap>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "0.5px solid #EEE", borderRadius: 6, padding: "5px 8px", fontSize: 9, color: "#999" }}>
        <MapPin size={10} style={{ color: RED }} /> Austin, TX · Dentists
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ marginTop: 6, background: "#fff", border: "0.5px solid #EEE", borderRadius: 6, padding: "6px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#0E1116" }}>Smile Dental Co.</div>
            <div style={{ fontSize: 8, color: "#999", marginTop: 1 }}>★ 4.8 · 142 reviews · No website</div>
          </div>
          <span style={{ fontSize: 8, color: RED, background: SOFT, padding: "2px 5px", borderRadius: 4, fontWeight: 600 }}>HOT</span>
        </div>
      ))}
    </VisualWrap>
  );
}

function MockScore() {
  const bars = [9, 7, 4, 8, 6, 3, 9, 5, 7];
  return (
    <VisualWrap>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#666" }}>
        <span style={{ fontWeight: 600, color: "#0E1116" }}>Lead Score</span>
        <span style={{ color: RED, fontWeight: 700 }}>9.2/10</span>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: 4, height: 60, marginTop: 8 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 10}%`, background: h >= 7 ? RED : h >= 5 ? "#F5A0A0" : "#F0D0D0", borderRadius: 2 }} />
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
        <span style={{ fontSize: 8, padding: "2px 6px", background: RED, color: "#fff", borderRadius: 3, fontWeight: 600 }}>HOT</span>
        <span style={{ fontSize: 8, padding: "2px 6px", background: "#FFE5C7", color: "#B36B00", borderRadius: 3, fontWeight: 600 }}>WARM</span>
        <span style={{ fontSize: 8, padding: "2px 6px", background: "#E5EAF0", color: "#5A6A7E", borderRadius: 3, fontWeight: 600 }}>COLD</span>
      </div>
    </VisualWrap>
  );
}

function MockSite() {
  return (
    <VisualWrap>
      <div style={{ background: "#fff", border: "0.5px solid #EEE", borderRadius: 6, overflow: "hidden", height: "100%" }}>
        <div style={{ display: "flex", gap: 3, padding: "5px 7px", borderBottom: "0.5px solid #EEE" }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "#FF5F57" }} />
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "#FEBC2E" }} />
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "#28C840" }} />
          <span style={{ marginLeft: 6, fontSize: 7, color: "#999" }}>preview.prospectmaster.com/smile-dental</span>
        </div>
        <div style={{ padding: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0E1116" }}>Smile Dental Co.</div>
          <div style={{ fontSize: 7, color: "#999", marginTop: 2 }}>Family dentistry in Austin, TX</div>
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            <div style={{ flex: 1, height: 22, background: SOFT, borderRadius: 3 }} />
            <div style={{ flex: 1, height: 22, background: SOFT, borderRadius: 3 }} />
            <div style={{ flex: 1, height: 22, background: SOFT, borderRadius: 3 }} />
          </div>
          <div style={{ marginTop: 6, height: 14, background: RED, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 7, fontWeight: 600 }}>Book Appointment</div>
        </div>
      </div>
    </VisualWrap>
  );
}

function MockTracking() {
  return (
    <VisualWrap>
      <div style={{ background: "#fff", border: "0.5px solid #EEE", borderRadius: 6, padding: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
          <span style={{ color: "#0E1116", fontWeight: 600 }}>Preview Activity</span>
          <span style={{ color: "#28A745", fontWeight: 600 }}>● Live</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <div style={{ flex: 1, background: SOFT, borderRadius: 4, padding: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>24</div>
            <div style={{ fontSize: 7, color: "#666" }}>Total views</div>
          </div>
          <div style={{ flex: 1, background: SOFT, borderRadius: 4, padding: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>8</div>
            <div style={{ fontSize: 7, color: "#666" }}>Unique</div>
          </div>
          <div style={{ flex: 1, background: SOFT, borderRadius: 4, padding: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>3</div>
            <div style={{ fontSize: 7, color: "#666" }}>Clicks</div>
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 7, color: "#999" }}>Last viewed 2 min ago · iPhone</div>
      </div>
    </VisualWrap>
  );
}

function MockOutreach() {
  return (
    <VisualWrap>
      {[
        { d: "Day 1", t: "Hey John, noticed Smile Dental doesn't have a site yet…", sent: true },
        { d: "Day 3", t: "Quick follow-up — built you a preview to check out", sent: true },
        { d: "Day 7", t: "Last note — here's what other dentists are seeing…", sent: false },
      ].map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginTop: i === 0 ? 0 : 5 }}>
          <div style={{ fontSize: 7, color: "#999", width: 28 }}>{m.d}</div>
          <div style={{ flex: 1, background: "#fff", border: "0.5px solid #EEE", borderRadius: 5, padding: "5px 7px", fontSize: 8, color: "#555" }}>{m.t}</div>
          <Check size={10} style={{ color: m.sent ? RED : "#DDD" }} strokeWidth={3} />
        </div>
      ))}
    </VisualWrap>
  );
}

function MockCRM() {
  const cols = [
    { name: "New", count: 12, color: "#5A6A7E" },
    { name: "Contacted", count: 8, color: "#B36B00" },
    { name: "Closed", count: 4, color: RED },
  ];
  return (
    <VisualWrap>
      <div style={{ display: "flex", gap: 5, height: "100%" }}>
        {cols.map((c) => (
          <div key={c.name} style={{ flex: 1, background: "#fff", border: "0.5px solid #EEE", borderRadius: 5, padding: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 600, color: "#0E1116" }}>
              <span>{c.name}</span>
              <span style={{ color: c.color }}>{c.count}</span>
            </div>
            {[1, 2].map((i) => (
              <div key={i} style={{ marginTop: 4, background: "#FAFAFA", borderRadius: 3, padding: "4px 5px" }}>
                <div style={{ height: 4, background: "#E5E5E5", borderRadius: 2 }} />
                <div style={{ height: 3, width: "60%", background: "#EFEFEF", borderRadius: 2, marginTop: 3 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </VisualWrap>
  );
}

function MockStripe() {
  return (
    <VisualWrap>
      <div style={{ background: "#fff", border: "0.5px solid #EEE", borderRadius: 6, padding: 10 }}>
        <div style={{ fontSize: 8, color: "#999" }}>Pay Smile Dental Co.</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#0E1116", marginTop: 2 }}>$1,500.00</div>
        <div style={{ marginTop: 8, height: 18, background: "#FAFAFA", border: "0.5px solid #EEE", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 6px", fontSize: 7, color: "#999" }}>
          4242 4242 4242 4242
        </div>
        <div style={{ marginTop: 6, height: 18, background: RED, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 600 }}>
          Pay $1,500 · Site deploys instantly
        </div>
      </div>
    </VisualWrap>
  );
}

function MockRevenue() {
  const pts = [10, 18, 14, 26, 22, 38, 34, 52, 48, 68, 72, 88];
  const max = 100;
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * 100},${100 - (p / max) * 100}`).join(" ");
  return (
    <VisualWrap>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
        <span style={{ color: "#0E1116", fontWeight: 600 }}>Monthly Revenue</span>
        <span style={{ color: RED, fontWeight: 700 }}>$24,800 ↑</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 80, marginTop: 6 }}>
        <defs>
          <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={RED} stopOpacity="0.3" />
            <stop offset="100%" stopColor={RED} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#rev)" points={`0,100 ${path} 100,100`} />
        <polyline fill="none" stroke={RED} strokeWidth="1.5" points={path} vectorEffect="non-scaling-stroke" />
      </svg>
    </VisualWrap>
  );
}

const visuals: Record<string, () => React.ReactElement> = {
  "Live Prospect Search": MockSearch,
  "Lead Scoring Engine": MockScore,
  "AI Website Builder": MockSite,
  "Trackable Preview Links": MockTracking,
  "AI Outreach + Follow-Up": MockOutreach,
  "Built-In CRM Pipeline": MockCRM,
  "Auto-Close + Stripe": MockStripe,
  "Revenue Dashboard": MockRevenue,
};

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 md:px-10 py-16 md:py-20" style={{ background: "#F5F5F5" }}>
      <div className="mx-auto max-w-[1100px]">
        <SectionHeader
          icon={Layers}
          eyebrow="Why ProspectMaster"
          headline={
            <>
              Everything Competitors Do.<br /><span style={{ color: "#CC0000" }}>Plus Everything They Don't.</span>
            </>
          }
          subtext="Other tools do one or two things. ProspectMaster is the only fully automated system."
          maxWidth={1100}
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
            const Visual = visuals[f.title];
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
                {Visual && <Visual />}
                <ul className="mt-4 flex flex-col gap-1.5" style={{ paddingLeft: 42 }}>
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
