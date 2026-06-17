import type { ReactNode } from "react";
import { Search, BarChart3, Layout, Mail, DollarSign, Check } from "lucide-react";

type Step = {
  num: number;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  visual: ReactNode;
};

function Visual1() {
  return (
    <div
      className="w-full h-full p-4 flex flex-col gap-1.5 text-[10px]"
      style={{ color: "#444" }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Search size={12} style={{ color: "#CC0000" }} />
        <span className="font-medium">Search · Tampa, FL · Dentists</span>
      </div>
      <div
        className="grid grid-cols-[1fr_auto] gap-2 px-2 py-1.5 font-medium"
        style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 6 }}
      >
        <span>Business</span>
        <span style={{ color: "#CC0000" }}>No Website</span>
      </div>
      {["Lakeside Dental", "Smile Bay Co.", "Bright Family Dental", "Coastal Orthodontics"].map(
        (n) => (
          <div
            key={n}
            className="grid grid-cols-[1fr_auto] items-center gap-2 px-2 py-1.5"
            style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 6 }}
          >
            <span>{n}</span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5"
              style={{ background: "#FFF0F0", color: "#CC0000", borderRadius: 10 }}
            >
              YES
            </span>
          </div>
        )
      )}
    </div>
  );
}

function Visual2() {
  const items = [
    { name: "Lakeside Dental", score: "9.4", tag: "HOT", hot: true },
    { name: "Bella Vista Trattoria", score: "7.1", tag: "WARM", hot: false },
    { name: "Lux Hair Lounge", score: "4.8", tag: "COLD", hot: false },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2 justify-center">
      {items.map((it) => (
        <div
          key={it.name}
          className="flex items-center justify-between px-3 py-2.5"
          style={{
            background: "white",
            border: it.hot ? "1px solid #CC0000" : "0.5px solid #E0E0E0",
            borderRadius: 8,
          }}
        >
          <div>
            <div className="text-[11px] font-medium" style={{ color: "#111" }}>
              {it.name}
            </div>
            <div className="text-[9px]" style={{ color: "#666" }}>
              Signal score
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[16px] font-medium"
              style={{ color: it.hot ? "#CC0000" : "#666" }}
            >
              {it.score}
            </span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5"
              style={{
                background: it.hot ? "#CC0000" : "#f0f0f0",
                color: it.hot ? "white" : "#666",
                borderRadius: 10,
              }}
            >
              {it.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Visual3() {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div
        className="w-full overflow-hidden"
        style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 6 }}
      >
        <div
          className="flex items-center gap-1 px-2 py-1.5"
          style={{ background: "#f5f5f5", borderBottom: "0.5px solid #E0E0E0" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840" }} />
          <span className="text-[9px] ml-2" style={{ color: "#999" }}>
            lakesidedental.pm.site
          </span>
        </div>
        <div className="p-3" style={{ background: "#CC0000" }}>
          <div className="text-[11px] text-white font-medium">Lakeside Dental</div>
          <div className="text-[9px] text-white/85 mt-0.5">Trusted Tampa family dentistry</div>
          <button
            className="mt-2 text-[9px] px-2 py-1 font-medium"
            style={{ background: "white", color: "#CC0000", borderRadius: 4 }}
          >
            Book An Appointment
          </button>
        </div>
        <div className="p-2 grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: "#f5f5f5", height: 24, borderRadius: 3 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Visual4() {
  const steps = [
    { day: "Day 1", subj: "Built a free site for you", active: false },
    { day: "Day 3", subj: "Did you see this?", active: true },
    { day: "Day 7", subj: "Last chance — going to your competitor", active: false },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col justify-center gap-2 relative">
      {steps.map((s, i) => (
        <div key={s.day} className="relative">
          <div
            className="px-3 py-2"
            style={{
              background: "white",
              border: s.active ? "1px solid #CC0000" : "0.5px solid #E0E0E0",
              borderRadius: 6,
            }}
          >
            <div
              className="text-[9px] font-medium uppercase tracking-wide"
              style={{ color: s.active ? "#CC0000" : "#999" }}
            >
              {s.day}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "#111" }}>
              {s.subj}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              className="ml-4 my-0.5"
              style={{
                height: 8,
                borderLeft: "1px dashed #CC0000",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Visual5() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2 justify-center">
      <div
        className="p-3"
        style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 8 }}
      >
        <div className="text-[9px] uppercase tracking-wide" style={{ color: "#999" }}>
          Stripe Checkout
        </div>
        <div className="mt-1 text-[12px] font-medium" style={{ color: "#111" }}>
          Lakeside Dental Site
        </div>
        <div className="text-[16px] font-medium mt-0.5" style={{ color: "#111" }}>
          $1,200.00
        </div>
        <div
          className="mt-2 px-2 py-1.5 text-[10px]"
          style={{ background: "#f5f5f5", borderRadius: 4, color: "#666" }}
        >
          •••• •••• •••• 4242
        </div>
        <button
          className="mt-2 w-full text-[11px] py-1.5 font-medium text-white"
          style={{ background: "#CC0000", borderRadius: 4 }}
        >
          Pay $1,200
        </button>
      </div>
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background: "#EAF7EF",
          border: "0.5px solid #2A7A4F",
          borderRadius: 8,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 16,
            height: 16,
            background: "#2A7A4F",
            borderRadius: "50%",
          }}
        >
          <Check size={10} color="white" strokeWidth={3} />
        </div>
        <div>
          <div className="text-[10px] font-medium" style={{ color: "#2A7A4F" }}>
            Deal closed
          </div>
          <div className="text-[9px]" style={{ color: "#2A7A4F" }}>
            Site deploying to lakesidedental.com
          </div>
        </div>
      </div>
    </div>
  );
}

const steps: Step[] = [
  {
    num: 1,
    eyebrow: "Discovery",
    title: "AI Scans Google Maps + Local Directories",
    body: "Enter a location and keyword. Our AI searches live data, not a stale database, and returns every business in that area with no website detected.",
    tags: ["Live Web Search", "Not A Database"],
    visual: <Visual1 />,
  },
  {
    num: 2,
    eyebrow: "Scoring",
    title: "Leads Scored, Ranked, And Enriched",
    body: "Every result gets a signal score 1 to 10. High ratings + no website = hot lead. Phone numbers, addresses, and owner names pulled automatically.",
    tags: ["Signal Scoring", "Skip Trace Enrichment"],
    visual: <Visual2 />,
  },
  {
    num: 3,
    eyebrow: "Build",
    title: "AI Builds A Custom Demo Site In 60 Seconds",
    body: "Full website generated with copy, images, layout, and SEO meta, tuned for that exact business category. Hosted instantly with a trackable preview link.",
    tags: ["AI Site Builder", "Free Hosting", "SSL"],
    visual: <Visual3 />,
  },
  {
    num: 4,
    eyebrow: "Outreach",
    title: "AI Sends Personalized Outreach And Follows Up",
    body: "Industry-specific cold email and SMS sent automatically. Multi-step follow-up sequences run on autopilot with built-in objection handling.",
    tags: ["Email", "SMS", "Automated Follow-Up"],
    visual: <Visual4 />,
  },
  {
    num: 5,
    eyebrow: "Close",
    title: "AI Closes The Deal — You Collect The Payment",
    body: "Stripe checkout link sent automatically. When they pay, the site goes live under their domain. You earn the upfront fee plus monthly hosting MRR.",
    tags: ["Stripe", "Auto-Deploy", "MRR Dashboard"],
    visual: <Visual5 />,
  },
];

const stepIcons = [Search, BarChart3, Layout, Mail, DollarSign];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 md:px-10 py-16 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="pm-eyebrow mb-3">The System</div>
        <h2 className="mb-3" style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>
          Five Steps. Zero Manual Work.
        </h2>
        <p className="max-w-[520px] text-[15px]" style={{ color: "#666" }}>
          Every other tool hands you leads and walks away. ProspectMaster runs the entire pipeline from the first scan to the signed deal.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {steps.map((s, i) => {
            const Icon = stepIcons[i];
            const isEven = i % 2 === 1;
            return (
              <div
                key={s.num}
                className="grid md:grid-cols-[1fr_300px] overflow-hidden"
                style={{
                  border: "0.5px solid #E0E0E0",
                  borderRadius: 12,
                  direction: isEven ? "rtl" : "ltr",
                }}
              >
                <div className="p-7 md:p-8" style={{ direction: "ltr" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center text-white text-[12px] font-medium"
                      style={{
                        width: 26,
                        height: 26,
                        background: "#CC0000",
                        borderRadius: "50%",
                      }}
                    >
                      {s.num}
                    </div>
                    <div className="pm-eyebrow">{s.eyebrow}</div>
                  </div>
                  <h3 className="mt-4 text-[18px] md:text-[20px]">
                    <span className="inline-flex items-center gap-2">
                      <Icon size={18} style={{ color: "#CC0000" }} />
                      {s.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-[13px]" style={{ color: "#666", lineHeight: 1.6 }}>
                    {s.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="pm-pill-red">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="min-h-[200px]"
                  style={{
                    background: "#F5F5F5",
                    borderLeft: isEven ? undefined : "0.5px solid #E0E0E0",
                    borderRight: isEven ? "0.5px solid #E0E0E0" : undefined,
                    direction: "ltr",
                  }}
                >
                  {s.visual}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
