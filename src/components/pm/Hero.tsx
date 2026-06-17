import { Search, Play } from "lucide-react";
import { MapBackground } from "./MapBackground";

type Pin = {
  type: string;
  name: string;
  value: string;
  top: number;
  right: number;
};

const pins: Pin[] = [
  { type: "Restaurant", name: "Bella Vista Trattoria", value: "$1,200", top: 20, right: 260 },
  { type: "Dentist", name: "Lakeside Dental", value: "$2,500", top: 150, right: 30 },
  { type: "Hair Salon", name: "Lux Hair Lounge", value: "$900", top: 330, right: 210 },
  { type: "Plumber", name: "Lone Star Plumbing", value: "$1,800", top: 470, right: 20 },
  { type: "Gym", name: "Desert Iron Fitness", value: "$1,500", top: 600, right: 280 },
];

function PinCard({ pin }: { pin: Pin }) {
  return (
    <div
      className="hidden lg:block absolute pm-card hover:border-[#CC0000] transition-colors"
      style={{
        top: pin.top,
        right: pin.right,
        padding: "9px 12px",
        minWidth: 158,
        borderRadius: 8,
      }}
    >
      <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "#CC0000" }}>
        {pin.type}
      </div>
      <div className="text-[12px] font-medium leading-tight mt-0.5" style={{ color: "#111" }}>
        {pin.name}
      </div>
      <div className="text-[12px] mt-0.5" style={{ color: "#666" }}>
        Site value: {pin.value}
      </div>
      <div className="mt-1.5">
        <span className="pm-pill-red">No Website</span>
      </div>
      <div
        className="absolute"
        style={{
          bottom: -5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#CC0000",
          border: "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ minHeight: 600 }}>
      <MapBackground />
      <div className="relative z-[2] mx-auto max-w-[1280px] grid lg:grid-cols-2">
        <div className="px-6 md:px-10 lg:px-12 py-14 lg:py-[60px] max-w-[560px]">
          <div className="pm-eyebrow mb-4">AI-Powered · Fully Automated</div>
          <h1 className="mb-5" style={{ fontSize: "clamp(32px, 5vw, 44px)", lineHeight: 1.1 }}>
            Your AI Closes<br />
            Website Deals<br />
            <span style={{ color: "#CC0000" }}>While You Sleep.</span>
          </h1>
          <p className="text-[15px]" style={{ color: "#666" }}>
            ProspectMaster Finds Local Businesses With No Website, Builds Their Site, Pitches It, And Closes The Deal. Automatically.
          </p>
          <p className="text-[15px] font-medium mt-3" style={{ color: "#111" }}>
            Zero Human Follow-Up Required.
          </p>

          <div className="mt-7 max-w-[460px]">
            <div
              className="flex items-stretch bg-white overflow-hidden"
              style={{ border: "0.5px solid #E0E0E0", borderRadius: 8 }}
            >
              <input
                type="text"
                placeholder="Tampa, FL or ZIP 33601"
                className="flex-1 min-w-0 px-3.5 py-[13px] text-[13px] outline-none bg-transparent"
              />
              <div className="self-center" style={{ width: "0.5px", height: 26, background: "#E0E0E0" }} />
              <input
                type="text"
                placeholder="Dentists, gyms, salons..."
                className="flex-1 min-w-0 px-3.5 py-[13px] text-[13px] outline-none bg-transparent"
              />
              <button
                className="text-white font-medium text-[13px] px-[18px] py-[13px] flex items-center gap-1.5"
                style={{ background: "#CC0000" }}
              >
                <Search size={14} strokeWidth={2.2} />
                <span className="hidden sm:inline">Scan For Prospects</span>
                <span className="sm:hidden">Scan</span>
              </button>
            </div>
            <div className="text-[12px] mt-2" style={{ color: "#999" }}>
              Returns Only Businesses With No Website · Scored · Contact-Ready
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button className="pm-btn-red">Start Free</button>
            <button className="pm-btn-ghost">
              <Play size={13} /> Watch Demo
            </button>
          </div>

          <div className="mt-5 text-[12px]" style={{ color: "#999" }}>
            No Credit Card Required · First 10 Prospects Free
          </div>
        </div>

        <div className="relative hidden lg:block" style={{ minHeight: 520 }}>
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
              className="px-8 py-7 text-center md:text-left"
              style={i < 2 ? { borderRight: "0.5px solid #E0E0E0" } : {}}
            >
              <div className="text-[28px] font-medium" style={{ color: "#CC0000" }}>
                {s.stat}
              </div>
              <div className="text-[13px] mt-1" style={{ color: "#666" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
