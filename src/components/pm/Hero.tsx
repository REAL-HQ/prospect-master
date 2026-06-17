import { Search, Play, MapPin } from "lucide-react";
import { MapBackground } from "./MapBackground";

type Pin = {
  type: string;
  name: string;
  value: string;
  top: string;
  left?: string;
  right?: string;
};

const pins: Pin[] = [
  { type: "Restaurant", name: "Bella Vista Trattoria", value: "$1,200", top: "5%", right: "18%" },
  { type: "Dentist", name: "Lakeside Dental", value: "$2,500", top: "22%", right: "2%" },
  { type: "Hair Salon", name: "Lux Hair Lounge", value: "$900", top: "42%", right: "22%" },
  { type: "Plumber", name: "Lone Star Plumbing", value: "$1,800", top: "62%", right: "4%" },
  { type: "Gym", name: "Desert Iron Fitness", value: "$1,500", top: "82%", right: "26%" },
];

function PinCard({ pin }: { pin: Pin }) {
  return (
    <div
      className="hidden lg:block absolute bg-white"
      style={{
        top: pin.top,
        right: pin.right,
        left: pin.left,
        padding: "8px 11px",
        minWidth: 168,
        borderRadius: 10,
        border: "1px solid #E8E2D5",
        boxShadow: "0 6px 20px -8px rgba(20,20,20,0.18), 0 2px 6px -2px rgba(20,20,20,0.08)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <MapPin size={10} strokeWidth={2.4} style={{ color: "#CC0000" }} />
        <div className="text-[9px] uppercase tracking-[0.08em] font-semibold" style={{ color: "#CC0000" }}>
          {pin.type}
        </div>
      </div>
      <div className="text-[12.5px] font-semibold leading-tight" style={{ color: "#0E1116" }}>
        {pin.name}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-[11px]" style={{ color: "#666" }}>
          Value <span className="font-semibold" style={{ color: "#0E1116" }}>{pin.value}</span>
        </div>
        <span
          className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: "#FFE6E6", color: "#CC0000" }}
        >
          No Site
        </span>
      </div>
      <div
        className="absolute"
        style={{
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: "#CC0000",
          border: "2.5px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <MapBackground />
      <div className="relative z-[2] mx-auto max-w-[1280px] grid lg:grid-cols-[1fr_460px] gap-6">
        <div className="px-6 md:px-10 lg:px-12 pt-8 pb-6 max-w-[640px]">
          <div className="pm-eyebrow mb-3">AI-Powered · Fully Automated</div>
          <h1
            className="mb-3 font-extrabold tracking-tight"
            style={{
              fontSize: "clamp(32px, 4.2vw, 54px)",
              lineHeight: 1.05,
              color: "#0E1116",
              letterSpacing: "-0.02em",
            }}
          >
            Your AI Closes Website Deals<br />
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-x-[-6px] bottom-[4px] h-[48%] -z-0"
                style={{ background: "#FFE14D", transform: "skew(-4deg)" }}
              />
              <span className="relative z-[1]">While You Sleep.</span>
            </span>
          </h1>
          <p className="text-[14px] leading-snug" style={{ color: "#555" }}>
            ProspectMaster Finds Local Businesses With No Website, Builds Their Site, Pitches It, And Closes The Deal. Automatically.
          </p>
          <p className="text-[14px] font-semibold mt-1.5" style={{ color: "#111" }}>
            Zero Human Follow-Up Required.
          </p>

          <div className="mt-5 max-w-[520px]">
            <div
              className="flex items-stretch bg-white overflow-hidden"
              style={{ border: "1px solid #E0E0E0", borderRadius: 8, boxShadow: "0 4px 14px -8px rgba(0,0,0,0.1)" }}
            >
              <input
                type="text"
                placeholder="Tampa, FL or ZIP 33601"
                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] outline-none bg-transparent"
              />
              <div className="self-center" style={{ width: "1px", height: 22, background: "#E0E0E0" }} />
              <input
                type="text"
                placeholder="Dentists, gyms, salons..."
                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] outline-none bg-transparent"
              />
              <button
                className="text-white font-medium text-[13px] px-4 py-2.5 flex items-center gap-1.5"
                style={{ background: "#CC0000" }}
              >
                <Search size={14} strokeWidth={2.2} />
                <span className="hidden sm:inline">Scan</span>
              </button>
            </div>
            <div className="text-[11.5px] mt-1.5" style={{ color: "#999" }}>
              Returns Only Businesses With No Website · Scored · Contact-Ready
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5 items-center">
            <button className="pm-btn-red">Start Free</button>
            <button className="pm-btn-ghost">
              <Play size={13} /> Watch Demo
            </button>
            <div className="text-[11.5px] ml-1" style={{ color: "#999" }}>
              No Credit Card Required · First 10 Prospects Free
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block" style={{ minHeight: 540 }}>
          {pins.map((p) => (
            <PinCard key={p.name} pin={p} />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="relative z-[2] bg-white"
        style={{ borderTop: "0.5px solid #E0E0E0", borderBottom: "0.5px solid #E0E0E0" }}
      >
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-3">
          {[
            { stat: "37%", label: "Of US small businesses have no website" },
            { stat: "2.5M+", label: "Prospects ready today" },
            { stat: "$0", label: "Human labor to close" },
          ].map((s, i) => (
            <div
              key={s.stat}
              className="px-8 py-4 text-center md:text-left"
              style={i < 2 ? { borderRight: "0.5px solid #E0E0E0" } : {}}
            >
              <div className="text-[24px] font-semibold" style={{ color: "#CC0000" }}>
                {s.stat}
              </div>
              <div className="text-[12.5px] mt-0.5" style={{ color: "#666" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
