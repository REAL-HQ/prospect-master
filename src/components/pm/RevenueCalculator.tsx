import { useMemo, useState } from "react";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (n: number) => void;
};

function Slider({ label, value, min, max, step = 1, display, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[13px] font-medium" style={{ color: "#111" }}>
          {label}
        </label>
        <span className="text-[13px] font-medium" style={{ color: "#CC0000" }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function RevenueCalculator() {
  const [sites, setSites] = useState(5);
  const [price, setPrice] = useState(1000);
  const [host, setHost] = useState(99);
  const [closeRate, setCloseRate] = useState(25);

  const { pitches, monthlyUpfront, months, annualTotal, year1Upfront, year1Hosting } =
    useMemo(() => {
      const pitches = Math.round(sites / (closeRate / 100));
      const monthlyUpfront = sites * price;
      const months: { month: number; upfront: number; mrr: number; total: number }[] = [];
      for (let m = 1; m <= 12; m++) {
        const totalClients = sites * m;
        const mrr = totalClients * host;
        months.push({ month: m, upfront: monthlyUpfront, mrr, total: monthlyUpfront + mrr });
      }
      const annualTotal = months.reduce((s, m) => s + m.total, 0);
      const year1Upfront = monthlyUpfront * 12;
      const year1Hosting = months.reduce((s, m) => s + m.mrr, 0);
      return { pitches, monthlyUpfront, months, annualTotal, year1Upfront, year1Hosting };
    }, [sites, price, host, closeRate]);

  const maxTotal = Math.max(...months.map((m) => m.total));
  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  return (
    <section id="calculator" className="px-6 md:px-10 py-16 md:py-20" style={{ background: "#F5F5F5" }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="pm-eyebrow mb-3">Revenue Calculator</div>
        <h2 className="mb-3" style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>
          See Exactly What You'll Make.
        </h2>
        <p className="max-w-[560px] text-[15px]" style={{ color: "#666" }}>
          Drag the sliders. Watch your income update in real time, broken down by upfront sales, recurring hosting, and annual total.
        </p>

        <div
          className="mt-10 overflow-hidden bg-white"
          style={{ border: "0.5px solid #E0E0E0", borderRadius: 12 }}
        >
          <div className="p-7 md:p-8" style={{ borderBottom: "0.5px solid #E0E0E0" }}>
            <h3>Your ProspectMaster Income Projection.</h3>
            <p className="mt-1 text-[13px]" style={{ color: "#666" }}>
              Based on real market rates. Adjust for your target market and close rate.
            </p>
          </div>

          <div
            className="p-7 md:p-8 grid md:grid-cols-2 gap-7"
            style={{ borderBottom: "0.5px solid #E0E0E0" }}
          >
            <Slider
              label="Sites Sold Per Month"
              value={sites}
              min={1}
              max={50}
              display={`${sites} sites/mo`}
              onChange={setSites}
            />
            <Slider
              label="Upfront Price Per Site"
              value={price}
              min={299}
              max={5000}
              display={fmt(price)}
              onChange={setPrice}
            />
            <Slider
              label="Monthly Hosting Fee Per Client"
              value={host}
              min={29}
              max={500}
              display={`${fmt(host)}/mo per client`}
              onChange={setHost}
            />
            <Slider
              label="Close Rate"
              value={closeRate}
              min={5}
              max={60}
              display={`${closeRate}% of pitches close`}
              onChange={setCloseRate}
            />
          </div>

          <div className="p-7 md:p-8" style={{ borderBottom: "0.5px solid #E0E0E0" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Monthly Upfront Revenue", value: fmt(monthlyUpfront), highlight: false },
                {
                  label: "Monthly Hosting MRR (Month 12)",
                  value: fmt(months[11].mrr),
                  highlight: false,
                },
                { label: "Annual Income Year 1", value: fmt(annualTotal), highlight: true },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-5"
                  style={{
                    border: m.highlight ? "1.5px solid #CC0000" : "0.5px solid #E0E0E0",
                    borderRadius: 10,
                  }}
                >
                  <div className="text-[11px] uppercase tracking-wider" style={{ color: "#666" }}>
                    {m.label}
                  </div>
                  <div
                    className="text-[28px] font-medium mt-1.5"
                    style={{ color: m.highlight ? "#CC0000" : "#111" }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-7 overflow-hidden"
              style={{ border: "0.5px solid #E0E0E0", borderRadius: 10 }}
            >
              {[
                { l: "Pitches Needed Per Month", v: `${pitches} pitches`, color: "#111" },
                {
                  l: "ProspectMaster Handles All",
                  v: `All ${pitches} pitches`,
                  color: "#2A7A4F",
                },
                { l: "Year 1 Upfront Total", v: fmt(year1Upfront), color: "#111" },
                { l: "Year 1 Hosting Total", v: fmt(year1Hosting), color: "#111" },
                {
                  l: "Total Year 1 Income",
                  v: fmt(annualTotal),
                  color: "#CC0000",
                  bg: "#F5F5F5",
                  bold: true,
                },
              ].map((row, i, arr) => (
                <div
                  key={row.l}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    background: row.bg ?? "white",
                    borderBottom: i < arr.length - 1 ? "0.5px solid #E0E0E0" : "none",
                  }}
                >
                  <span className="text-[13px]" style={{ color: "#666" }}>
                    {row.l}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{
                      color: row.color,
                      fontWeight: row.bold ? 500 : 400,
                      fontSize: row.bold ? 15 : 13,
                    }}
                  >
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 md:p-8">
            <div className="text-[13px] mb-4 font-medium">Monthly Income Growth (Year 1)</div>
            <div className="flex flex-col gap-1.5">
              {months.map((m) => {
                const totalPct = (m.total / maxTotal) * 100;
                const upfrontPct = (m.upfront / m.total) * totalPct;
                const mrrPct = totalPct - upfrontPct;
                return (
                  <div key={m.month} className="grid grid-cols-[60px_1fr_90px] items-center gap-3">
                    <span className="text-[11px]" style={{ color: "#666" }}>
                      Month {m.month}
                    </span>
                    <div className="flex h-5 rounded overflow-hidden" style={{ background: "#f5f5f5" }}>
                      <div style={{ width: `${upfrontPct}%`, background: "#CC0000" }} />
                      <div style={{ width: `${mrrPct}%`, background: "#F5B0B0" }} />
                    </div>
                    <span
                      className="text-[12px] text-right font-medium"
                      style={{ color: "#111" }}
                    >
                      {fmt(m.total)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-5 text-[11px]" style={{ color: "#666" }}>
              <span className="flex items-center gap-1.5">
                <span
                  style={{ width: 10, height: 10, background: "#CC0000", borderRadius: 2 }}
                />{" "}
                Upfront Sales
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  style={{ width: 10, height: 10, background: "#F5B0B0", borderRadius: 2 }}
                />{" "}
                Hosting MRR
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
