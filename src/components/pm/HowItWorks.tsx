import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Search, ListChecks, Check } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { AccordionItem } from "./AccordionItem";

type AccItem = { label: string; detail: string };

type StepProps = {
  num: number;
  eyebrow: string;
  title: string;
  desc: string;
  items: AccItem[];
  visual: ReactNode;
  imageLeft?: boolean;
};

function StepCard({ num, eyebrow, title, desc, items, visual, imageLeft }: StepProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const textSide = (
    <div className="p-6 md:p-8" style={{ minWidth: 0 }}>
      <div
        className="inline-block uppercase tracking-wide"
        style={{ fontSize: 10, color: "#CC0000", fontWeight: 500, letterSpacing: "0.08em" }}
      >
        Step {num} · {eyebrow}
      </div>
      <h3 className="mt-3" style={{ fontSize: 22, fontWeight: 600, color: "#0E1116", lineHeight: 1.25 }}>
        {title}
      </h3>
      <p className="mt-3" style={{ fontSize: 15, color: "#555", lineHeight: 1.6 }}>
        {desc}
      </p>
      <div className="mt-4">
        {items.map((it, i) => (
          <AccordionItem
            key={it.label}
            label={it.label}
            detail={it.detail}
            isOpen={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );

  const imageSide = (
    <div className="p-4 md:p-5" style={{ minHeight: 420 }}>
      <div
        className="h-full w-full"
        style={{
          background: "#F5F5F5",
          border: "0.5px solid #E0E0E0",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {visual}
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid #E8E8E8",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div className={`grid md:grid-cols-2 ${imageLeft ? "md:[direction:rtl]" : ""}`}>
        <div className={imageLeft ? "md:[direction:ltr]" : ""}>{textSide}</div>
        <div className={imageLeft ? "md:[direction:ltr]" : ""}>{imageSide}</div>
      </div>
    </div>
  );
}

const fadeRow = (delay: number) => ({
  initial: { opacity: 0, y: 6 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { delay, duration: 0.4 },
});
const slideIn = (delay: number) => ({
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { delay, duration: 0.4 },
});

function Visual1() {
  const rows = ["Lakeside Dental", "Smile Bay Co.", "Bright Family Dental", "Coastal Orthodontics", "Harbor View Dental", "Sunshine Smile Clinic", "Bay Bridge Dental"];
  const delays = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4];
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "#f8f8f8", borderBottom: "0.5px solid #E8E8E8" }}
      >
        <div className="flex items-center gap-2">
          <Search size={13} style={{ color: "#CC0000" }} />
          <span style={{ fontSize: 11, color: "#444" }}>Search · Tampa, FL · Dentists</span>
        </div>
        <span style={{ fontSize: 10, color: "#CC0000", fontWeight: 500, letterSpacing: "0.06em" }}>
          SCANNING...
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "0.5px solid #E8E8E8" }}>
        <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>Business</span>
        <span style={{ fontSize: 11, color: "#CC0000", fontWeight: 500 }}>No Website</span>
      </div>
      <div className="flex-1 flex flex-col">
        {rows.map((r, i) => (
          <motion.div
            key={r}
            {...fadeRow(delays[i])}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < rows.length - 1 ? "0.5px solid #F0F0F0" : undefined }}
          >
            <span style={{ fontSize: 13, color: "#222" }}>{r}</span>
            <span style={{ fontSize: 11, color: "#CC0000", fontWeight: 500 }}>YES</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Visual2() {
  const cards = [
    { name: "Lakeside Dental", score: "9.4", tag: "HOT", hot: true, scoreColor: "#CC0000" },
    { name: "Bella Vista Trattoria", score: "7.1", tag: "WARM", hot: false, scoreColor: "#666", bg: "#f0f0f0", tc: "#888" },
    { name: "Lux Hair Lounge", score: "4.8", tag: "COLD", hot: false, scoreColor: "#bbb", bg: "#f4f4f4", tc: "#aaa" },
    { name: "Coastal Orthodontics", score: "8.7", tag: "HOT", hot: true, scoreColor: "#CC0000" },
    { name: "Harbor View Dental", score: "6.2", tag: "WARM", hot: false, scoreColor: "#666", bg: "#f0f0f0", tc: "#888" },
  ];
  const delays = [0.2, 0.4, 0.6, 0.8, 1.0];
  return (
    <div className="p-4 flex flex-col gap-2.5 h-full justify-center">
      {cards.map((c, i) => (
        <motion.div
          key={c.name}
          {...slideIn(delays[i])}
          className="flex items-center justify-between px-4 py-3"
          style={{
            border: c.hot ? "1.5px solid #CC0000" : "0.5px solid #E0E0E0",
            borderRadius: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#111", fontWeight: 500 }}>{c.name}</div>
            <div style={{ fontSize: 10, color: "#999" }}>Signal score</div>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 18, fontWeight: 500, color: c.scoreColor }}>{c.score}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: "3px 8px",
                borderRadius: 10,
                background: c.hot ? "#CC0000" : c.bg,
                color: c.hot ? "white" : c.tc,
              }}
            >
              {c.tag}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Visual3() {
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-1.5 px-2 py-1.5"
        style={{ background: "#f8f8f8", borderBottom: "0.5px solid #E8E8E8" }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f09595" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF9F27" }} />
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#97C459" }} />
        <span className="ml-2" style={{ fontSize: 9, color: "#bbb" }}>
          preview.prospectmaster.com/lakeside-dental
        </span>
      </div>
      <motion.div {...fadeRow(0.3)} className="p-3" style={{ background: "#CC0000" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>Lakeside Dental</div>
        <motion.div {...fadeRow(0.5)} style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
          Your smile is our priority. Book today.
        </motion.div>
        <motion.button
          {...fadeRow(0.7)}
          style={{
            marginTop: 8,
            background: "white",
            color: "#CC0000",
            fontSize: 10,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 4,
          }}
        >
          Book A Consultation
        </motion.button>
      </motion.div>
      <motion.div {...fadeRow(0.9)} className="p-3 flex flex-col gap-1.5">
        {[90, 75, 60].map((w) => (
          <div key={w} style={{ height: 6, width: `${w}%`, background: "#E8E8E8", borderRadius: 3 }} />
        ))}
      </motion.div>
    </div>
  );
}

function Visual4() {
  const cards = [
    {
      tag: "Day 1 — Initial Email",
      status: "Sent",
      subj: "I built a website for Lakeside Dental",
      body: "Hi — I noticed Lakeside Dental isn't online yet, so I built you a free preview...",
      delay: 0.2,
      tagColor: "#CC0000",
      statusColor: "#999",
      bg: "white",
      border: "0.5px solid #E0E0E0",
      opacity: 1,
    },
    {
      tag: "Day 3 — Follow-Up",
      status: "Opened 2x",
      subj: "86% of patients search before booking",
      body: "Just wanted to check — most new patients find dentists on Google first...",
      delay: 0.55,
      tagColor: "#CC0000",
      statusColor: "#CC0000",
      bg: "#fff0f0",
      border: "1px solid rgba(204,0,0,0.2)",
      opacity: 1,
    },
    {
      tag: "Day 7 — Final Notice",
      status: "Scheduled",
      subj: "Holding your site for 48 more hours",
      body: "Last note before this preview goes to your competitor...",
      delay: 0.85,
      tagColor: "#999",
      statusColor: "#999",
      bg: "white",
      border: "0.5px solid #E0E0E0",
      opacity: 0.6,
    },
  ];
  return (
    <div className="p-3 flex flex-col gap-2 h-full">
      {cards.map((c) => (
        <motion.div
          key={c.tag}
          {...fadeRow(c.delay)}
          style={{
            background: c.bg,
            border: c.border,
            borderRadius: 8,
            padding: "8px 10px",
            opacity: c.opacity,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 9, fontWeight: 500, color: c.tagColor, letterSpacing: "0.05em" }}>
              {c.tag.toUpperCase()}
            </span>
            <span style={{ fontSize: 9, color: c.statusColor }}>{c.status}</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "#111", marginTop: 3 }}>{c.subj}</div>
          <div style={{ fontSize: 9.5, color: "#888", marginTop: 1, lineHeight: 1.4 }}>{c.body}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Visual5() {
  return (
    <div className="p-3 flex flex-col gap-2 h-full">
      <motion.div
        {...fadeRow(0.2)}
        style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 10, padding: "10px 12px" }}
      >
        <div style={{ fontSize: 9, color: "#999" }}>Lakeside Dental — Website Purchase</div>
        <div
          className="mt-1.5 px-2 py-1.5"
          style={{ background: "#f5f5f5", borderRadius: 4, fontSize: 10, color: "#888" }}
        >
          4242 4242 4242 4242
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          <div className="px-2 py-1.5" style={{ background: "#f5f5f5", borderRadius: 4, fontSize: 10, color: "#888" }}>
            MM / YY
          </div>
          <div className="px-2 py-1.5" style={{ background: "#f5f5f5", borderRadius: 4, fontSize: 10, color: "#888" }}>
            CVC
          </div>
        </div>
        <button
          className="mt-2 w-full"
          style={{
            background: "#CC0000",
            color: "white",
            fontSize: 11,
            fontWeight: 500,
            padding: "7px",
            borderRadius: 5,
          }}
        >
          Pay $1,000 — Claim Your Website
        </button>
      </motion.div>
      <motion.div
        {...fadeRow(0.8)}
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background: "#f0fff4",
          border: "0.5px solid rgba(42,122,79,0.3)",
          borderRadius: 10,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 22, height: 22, background: "#2A7A4F", borderRadius: "50%" }}
        >
          <Check size={12} color="white" strokeWidth={3} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#2A7A4F" }}>Payment received — $1,000</div>
          <div style={{ fontSize: 9.5, color: "#2A7A4F", opacity: 0.85 }}>Site live at lakesidedental.com</div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-1.5">
        <motion.div
          {...fadeRow(1.0)}
          style={{ background: "#F5F5F5", borderRadius: 8, padding: "8px 10px" }}
        >
          <div style={{ fontSize: 9, color: "#999" }}>This Month</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>$8,500</div>
        </motion.div>
        <motion.div
          {...fadeRow(1.1)}
          style={{ background: "#F5F5F5", borderRadius: 8, padding: "8px 10px" }}
        >
          <div style={{ fontSize: 9, color: "#999" }}>Active MRR</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#CC0000" }}>$3,450</div>
        </motion.div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 md:px-10 py-16 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeader
          icon={ListChecks}
          eyebrow="How It Works"
          headline={<>Five Steps. <span style={{ color: "#CC0000" }}>Zero Manual Work.</span></>}
          subtext="Other tools hand you leads and walk away. ProspectMaster runs the full pipeline."
          maxWidth={520}
        />

        <div className="mt-10 flex flex-col gap-5">
          <StepCard
            num={1}
            eyebrow="Discovery"
            title="AI Scans Google Maps + Local Directories"
            desc="Enter a location and keyword. Our AI searches live data, not a stale database, and returns every business with no website detected."
            items={[
              { label: "Live Web Search, Not A Database", detail: "Pulls directly from Google Maps in real time. Every result is fresh, not cached from weeks ago." },
              { label: "Filter By Category And Rating", detail: "Search restaurants, dentists, salons, plumbers, gyms, or any custom keyword in any city, state, or ZIP." },
              { label: "Verified Contact On Every Result", detail: "Phone number, address, hours, rating, and review count pulled automatically. Ready to call or email instantly." },
              { label: "Global Coverage — 200+ Countries", detail: "Anywhere Google Maps reaches, ProspectMaster can scan. No geographic limits." },
            ]}
            visual={<Visual1 />}
          />
          <StepCard
            num={2}
            eyebrow="Scoring"
            title="Leads Scored, Ranked, And Enriched"
            desc="Every result gets a signal score 1 to 10. High ratings plus no website equals hot lead."
            items={[
              { label: "HOT / WARM / COLD Tiers", detail: "Color-coded at a glance. 8+ red HOT, 6-7 amber WARM, below 6 gray COLD." },
              { label: "Skip Trace Enrichment", detail: "Owner names and emails pulled automatically where available. Go deeper on your best leads." },
              { label: "Score Breakdown Popover", detail: "See exactly why each lead scored as it did — rating weight, review count, no-website bonus." },
            ]}
            visual={<Visual2 />}
            imageLeft
          />
          <StepCard
            num={3}
            eyebrow="Build"
            title="AI Builds A Custom Demo Site In 60 Seconds"
            desc="Full website generated. Copy, images, layout, SEO. Tuned for that exact business type."
            items={[
              { label: "Category Design Systems", detail: "Restaurants get editorial warmth. Dentists get clinical calm. Plumbers get industrial trade. 12 vertical systems built in." },
              { label: "Free Hosting + SSL On Every Preview", detail: "Sites go live instantly at preview.prospectmaster.com/{slug}. No ZIP uploads, no extra steps." },
              { label: "One-Click Deploy On Close", detail: "When they pay, the site automatically deploys to their custom domain. You just collect the notification." },
            ]}
            visual={<Visual3 />}
          />
          <StepCard
            num={4}
            eyebrow="Outreach"
            title="AI Sends Personalized Outreach And Follows Up"
            desc="Industry-specific cold email and SMS sent automatically. Multi-step follow-up sequences run on autopilot."
            items={[
              { label: "Day 1, Day 3, Day 7 Cadence", detail: "Three-step automated sequence. Each message escalates urgency. Zero manual sends required from you." },
              { label: "Industry-Specific Objection Handling", detail: "Plumber scripts cite emergency search stats. Restaurant scripts cite diner discovery habits. Each pitch hits the right nerve." },
              { label: "Email Via Resend + SMS Via Twilio", detail: "Both channels covered. Hit them in their inbox and their phone. Stripe link included in every message." },
              { label: "Trackable Preview Link In Every Send", detail: "Real-time open tracking. Get notified the moment they view their site. Auto-trigger next follow-up on view." },
            ]}
            visual={<Visual4 />}
            imageLeft
          />
          <StepCard
            num={5}
            eyebrow="Close"
            title="AI Closes The Deal. You Collect The Payment."
            desc="Stripe checkout included in every outreach. They pay, the site deploys to their domain. You get notified. No sales call needed."
            items={[
              { label: "Stripe Payment Link Auto-Created", detail: "Generated automatically on site build. Embedded in every email and SMS. Set your own price — $500, $1,000, $2,500, any amount." },
              { label: "Site Auto-Deploys On Payment", detail: "The moment Stripe confirms payment, the site goes live on their custom domain. Fully automatic." },
              { label: "100% Of Revenue Goes To You", detail: "ProspectMaster takes zero cut of your sales. Every dollar from the upfront fee and monthly hosting is yours to keep." },
              { label: "Monthly Hosting MRR From Day One", detail: "Auto-create a Stripe subscription for recurring hosting. Stack clients month over month. Watch your MRR compound." },
            ]}
            visual={<Visual5 />}
          />
        </div>
      </div>
    </section>
  );
}
