import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Search, ListChecks, Check, Sparkles, Shield, Smile, Star, MapPin, Phone, Calendar } from "lucide-react";
import dentalHero from "@/assets/dental-hero.jpg";
import dentalSmile from "@/assets/dental-smile.jpg";
import dentalClinic from "@/assets/dental-clinic.jpg";
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
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "white" }}>
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 sticky top-0 z-10"
        style={{ background: "#f8f8f8", borderBottom: "0.5px solid #E8E8E8" }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f09595" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF9F27" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#97C459" }} />
        <span className="ml-2" style={{ fontSize: 10, color: "#bbb" }}>
          preview.prospectmaster.com/lakeside-dental
        </span>
      </div>

      {/* Site nav */}
      <motion.div
        {...fadeRow(0.2)}
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "0.5px solid #EEE", background: "white" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "linear-gradient(135deg,#0E6BA8,#3FA7D6)",
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#0E1116", letterSpacing: "0.02em" }}>
            LAKESIDE<span style={{ color: "#3FA7D6" }}>DENTAL</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {["Services", "About", "Reviews"].map((l) => (
            <span key={l} style={{ fontSize: 9, color: "#555" }}>
              {l}
            </span>
          ))}
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "white",
              background: "#0E6BA8",
              padding: "3px 7px",
              borderRadius: 4,
            }}
          >
            Book
          </span>
        </div>
      </motion.div>

      {/* Hero with real imagery */}
      <motion.div
        {...fadeRow(0.35)}
        className="relative px-4 py-4"
        style={{
          background:
            "linear-gradient(135deg,#EAF4FB 0%,#F7FBFD 60%,#FFFFFF 100%)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle,#3FA7D6 0%,transparent 70%)",
            opacity: 0.3,
          }}
        />
        <div className="grid grid-cols-[1fr_88px] gap-3 items-center relative">
          <div className="min-w-0">
            <motion.div
              {...fadeRow(0.45)}
              className="inline-flex items-center gap-1 mb-1.5"
              style={{
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#0E6BA8",
                background: "rgba(14,107,168,0.1)",
                padding: "2px 6px",
                borderRadius: 999,
              }}
            >
              <Sparkles size={8} /> NEW PATIENTS WELCOME
            </motion.div>
            <motion.div
              {...fadeRow(0.5)}
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0A2540",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Healthy Smiles,<br />Crafted On The Lake.
            </motion.div>
            <motion.div
              {...fadeRow(0.6)}
              style={{ fontSize: 9, color: "#5A6B7A", marginTop: 5, lineHeight: 1.4 }}
            >
              Modern, Gentle Dentistry In The Heart Of Tampa.
            </motion.div>
            <div className="flex items-center gap-2 mt-2.5">
              <motion.button
                {...fadeRow(0.7)}
                style={{
                  background: "#0E6BA8",
                  color: "white",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "6px 11px",
                  borderRadius: 5,
                  boxShadow: "0 4px 12px -4px rgba(14,107,168,0.5)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Calendar size={9} /> Book A Consultation
              </motion.button>
              <motion.button
                {...fadeRow(0.75)}
                style={{
                  background: "white",
                  color: "#0E6BA8",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "6px 10px",
                  borderRadius: 5,
                  border: "1px solid #D6E6F2",
                }}
              >
                Our Story
              </motion.button>
            </div>
          </div>
          <motion.div
            {...fadeRow(0.55)}
            style={{
              width: 88,
              height: 110,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 10px 24px -8px rgba(14,107,168,0.5)",
              position: "relative",
            }}
          >
            <img
              src={dentalHero}
              alt="Dr. Chen with patient"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,37,64,0.7), transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 5,
                left: 6,
                right: 6,
                fontSize: 7,
                color: "white",
                fontWeight: 600,
              }}
            >
              Dr. Chen, DDS
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        {...fadeRow(0.85)}
        className="grid grid-cols-3 gap-1.5 px-4 py-3"
        style={{ background: "white" }}
      >
        {[
          { n: "20+", l: "Years Of Care" },
          { n: "4.9★", l: "Google Rating" },
          { n: "12k", l: "Happy Smiles" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              border: "0.5px solid #E8EEF3",
              borderRadius: 6,
              padding: "6px 6px",
              textAlign: "center",
              background: "#FBFDFE",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0E6BA8" }}>{s.n}</div>
            <div style={{ fontSize: 7, color: "#8896A4", letterSpacing: "0.05em" }}>{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* Services */}
      <motion.div {...fadeRow(0.95)} className="px-4 py-3" style={{ background: "#F7FBFD" }}>
        <div
          style={{
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#3FA7D6",
            marginBottom: 4,
          }}
        >
          WHAT WE DO
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0A2540",
            letterSpacing: "-0.01em",
            marginBottom: 8,
          }}
        >
          Comprehensive Dental Care
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { i: Smile, t: "Cosmetic" },
            { i: Shield, t: "Preventive" },
            { i: Sparkles, t: "Whitening" },
          ].map((s) => (
            <div
              key={s.t}
              style={{
                background: "white",
                border: "0.5px solid #E8EEF3",
                borderRadius: 8,
                padding: "8px 6px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "rgba(63,167,214,0.12)",
                  margin: "0 auto 4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0E6BA8",
                }}
              >
                <s.i size={10} />
              </div>
              <div style={{ fontSize: 8, fontWeight: 600, color: "#0A2540" }}>{s.t}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gallery */}
      <motion.div {...fadeRow(1.05)} className="grid grid-cols-2 gap-1.5 px-4 py-3" style={{ background: "white" }}>
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            height: 60,
            position: "relative",
          }}
        >
          <img
            src={dentalClinic}
            alt="Modern clinic"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 5,
              fontSize: 7,
              color: "white",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Our Clinic
          </div>
        </div>
        <div
          style={{
            borderRadius: 8,
            overflow: "hidden",
            height: 60,
            position: "relative",
          }}
        >
          <img
            src={dentalSmile}
            alt="Bright smile"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 5,
              fontSize: 7,
              color: "white",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Real Results
          </div>
        </div>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        {...fadeRow(1.15)}
        className="mx-4 mb-3 p-3"
        style={{
          background: "linear-gradient(135deg,#0E6BA8,#3FA7D6)",
          borderRadius: 10,
          color: "white",
        }}
      >
        <div className="flex items-center gap-0.5 mb-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={8} fill="#FFD166" stroke="#FFD166" />
          ))}
        </div>
        <div style={{ fontSize: 9, lineHeight: 1.4, fontWeight: 500 }}>
          "Best Dental Experience I've Ever Had. The Team Made Me Feel Right At Home."
        </div>
        <div style={{ fontSize: 7, marginTop: 5, opacity: 0.85, fontWeight: 500 }}>
          — Sarah M., Tampa
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        {...fadeRow(1.25)}
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "#0A2540", color: "white" }}
      >
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, marginBottom: 2 }}>
            Ready For A Brighter Smile?
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: 7, opacity: 0.7 }}>
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={7} /> Tampa, FL
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Phone size={7} /> (813) 555-0142
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "#0A2540",
            background: "white",
            padding: "5px 9px",
            borderRadius: 4,
          }}
        >
          Book Now →
        </span>
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
      body: "Hi — I noticed Lakeside Dental isn't online yet, so I built you a free preview site so you can see what you're missing...",
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
      body: "Just wanted to check — most new patients find dentists on Google first. Without a site, you're invisible to them...",
      delay: 0.45,
      tagColor: "#CC0000",
      statusColor: "#CC0000",
      bg: "#fff0f0",
      border: "1px solid rgba(204,0,0,0.2)",
      opacity: 1,
    },
    {
      tag: "Day 5 — Second Follow-Up",
      status: "Clicked link",
      subj: "Your preview site got 12 views this week",
      body: "People are already checking out the preview I built. Imagine what happens when it goes live with your branding...",
      delay: 0.65,
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
      body: "Last note before this preview goes to your competitor down the street. Ready to claim it?",
      delay: 0.85,
      tagColor: "#999",
      statusColor: "#999",
      bg: "white",
      border: "0.5px solid #E0E0E0",
      opacity: 0.6,
    },
  ];
  return (
    <div className="p-4 flex flex-col gap-2.5 h-full">
      {cards.map((c) => (
        <motion.div
          key={c.tag}
          {...fadeRow(c.delay)}
          style={{
            background: c.bg,
            border: c.border,
            borderRadius: 10,
            padding: "10px 12px",
            opacity: c.opacity,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, fontWeight: 500, color: c.tagColor, letterSpacing: "0.05em" }}>
              {c.tag.toUpperCase()}
            </span>
            <span style={{ fontSize: 10, color: c.statusColor }}>{c.status}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#111", marginTop: 4 }}>{c.subj}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, lineHeight: 1.4 }}>{c.body}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Visual5() {
  return (
    <div className="p-4 flex flex-col gap-3 h-full">
      <motion.div
        {...fadeRow(0.2)}
        style={{ background: "white", border: "0.5px solid #E0E0E0", borderRadius: 12, padding: "12px 14px" }}
      >
        <div style={{ fontSize: 10, color: "#999" }}>Lakeside Dental — Website Purchase</div>
        <div
          className="mt-2 px-3 py-2"
          style={{ background: "#f5f5f5", borderRadius: 5, fontSize: 11, color: "#888" }}
        >
          4242 4242 4242 4242
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="px-3 py-2" style={{ background: "#f5f5f5", borderRadius: 5, fontSize: 11, color: "#888" }}>
            MM / YY
          </div>
          <div className="px-3 py-2" style={{ background: "#f5f5f5", borderRadius: 5, fontSize: 11, color: "#888" }}>
            CVC
          </div>
        </div>
        <button
          className="mt-3 w-full"
          style={{
            background: "#CC0000",
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            padding: "9px",
            borderRadius: 6,
          }}
        >
          Pay $1,000 — Claim Your Website
        </button>
      </motion.div>
      <motion.div
        {...fadeRow(0.8)}
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: "#f0fff4",
          border: "0.5px solid rgba(42,122,79,0.3)",
          borderRadius: 12,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 26, height: 26, background: "#2A7A4F", borderRadius: "50%" }}
        >
          <Check size={14} color="white" strokeWidth={3} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2A7A4F" }}>Payment received — $1,000</div>
          <div style={{ fontSize: 10, color: "#2A7A4F", opacity: 0.85 }}>Site live at lakesidedental.com</div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          {...fadeRow(1.0)}
          style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 12px" }}
        >
          <div style={{ fontSize: 10, color: "#999" }}>This Month</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>$8,500</div>
        </motion.div>
        <motion.div
          {...fadeRow(1.1)}
          style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 12px" }}
        >
          <div style={{ fontSize: 10, color: "#999" }}>Active MRR</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#CC0000" }}>$3,450</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          {...fadeRow(1.2)}
          style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 12px" }}
        >
          <div style={{ fontSize: 10, color: "#999" }}>Clients</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#111" }}>12</div>
        </motion.div>
        <motion.div
          {...fadeRow(1.3)}
          style={{ background: "#F5F5F5", borderRadius: 10, padding: "10px 12px" }}
        >
          <div style={{ fontSize: 10, color: "#999" }}>Sites Built</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#CC0000" }}>47</div>
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
          headline={<>Five Steps. <span style={{ color: "#CC0000" }}>Zero Manual Work.</span><br />Plus Everything They Don't.</>}
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
            title="AI Sends Personalized Outreach & Follows Up"
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
