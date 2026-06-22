import { Check, Minus, Scale } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const competitors = ["ProspectMaster", "SiteSeeker", "NoSiteSearch", "Origami", "Durable"];
type Row = { label: string; values: (boolean | "only")[] };

const rows: Row[] = [
  { label: "Find No-Website Businesses", values: [true, true, true, true, false] },
  { label: "Lead Scoring", values: [true, true, true, false, false] },
  { label: "Auto-Builds Demo Website", values: [true, false, true, false, true] },
  { label: "Sends Outreach Automatically", values: [true, false, false, true, false] },
  { label: "Automated Follow-Up Sequences", values: [true, false, false, false, false] },
  { label: "AI Closes Deal + Takes Payment", values: [true, false, false, false, false] },
  { label: "Fully Automated End-To-End", values: ["only", false, false, false, false] },
];

function Cell({ v }: { v: boolean | "only" }) {
  if (v === "only") {
    return (
      <span
        className="inline-flex items-center text-[10px] font-medium uppercase tracking-wide px-2 py-1 text-white"
        style={{ background: "#CC0000", borderRadius: 20 }}
      >
        Only Us
      </span>
    );
  }
  if (v) return <Check size={16} style={{ color: "#2A7A4F" }} strokeWidth={2.5} />;
  return <Minus size={14} style={{ color: "#999" }} />;
}

export function ComparisonTable() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeader
          icon={Scale}
          eyebrow="vs. The Competition"
          headline="Nobody Else Does All Of This."
          subtext="See how ProspectMaster stacks up against the most popular alternatives."
        />

        <div
          className="mt-10 overflow-x-auto"
          style={{ border: "0.5px solid #E0E0E0", borderRadius: 12 }}
        >
          <table className="w-full text-left border-collapse" style={{ minWidth: 720 }}>
            <thead>
              <tr style={{ background: "#F5F5F5" }}>
                <th
                  className="px-5 py-3.5 text-[11px] uppercase font-medium tracking-wider"
                  style={{ color: "#666" }}
                >
                  Capability
                </th>
                {competitors.map((c, i) => (
                  <th
                    key={c}
                    className="px-4 py-3.5 text-[11px] uppercase font-medium tracking-wider text-center"
                    style={{
                      color: i === 0 ? "#CC0000" : "#666",
                      background: i === 0 ? "#FFF8F8" : "transparent",
                      borderLeft: i > 0 ? "0.5px solid #E0E0E0" : undefined,
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr
                  key={r.label}
                  style={ri < rows.length - 1 ? { borderBottom: "0.5px solid #E0E0E0" } : {}}
                >
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: "#111" }}>
                    {r.label}
                  </td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className="px-4 py-3.5 text-center"
                      style={{
                        background: i === 0 ? "#FFF8F8" : "transparent",
                        fontWeight: i === 0 ? 500 : 400,
                        borderLeft: i > 0 ? "0.5px solid #E0E0E0" : undefined,
                      }}
                    >
                      <div className="inline-flex items-center justify-center">
                        <Cell v={v} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
