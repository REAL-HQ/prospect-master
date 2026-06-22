import { createFileRoute } from "@tanstack/react-router";
import { usePmStore, type LeadTier } from "@/lib/pm-store";
import * as React from "react";
import { Star, Info } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const prospects = usePmStore((s) => s.prospects);
  const [tier, setTier] = React.useState<"ALL" | LeadTier>("ALL");
  const [sort, setSort] = React.useState<"score" | "rating" | "recent">("score");

  const list = React.useMemo(() => {
    let l = [...prospects];
    if (tier !== "ALL") l = l.filter((p) => p.tier === tier);
    l.sort((a, b) => sort === "score" ? b.score - a.score : sort === "rating" ? b.rating - a.rating : b.createdAt - a.createdAt);
    return l;
  }, [prospects, tier, sort]);

  const counts = {
    HOT: prospects.filter((p) => p.tier === "HOT").length,
    WARM: prospects.filter((p) => p.tier === "WARM").length,
    COLD: prospects.filter((p) => p.tier === "COLD").length,
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Lead Scoring</h1>
      <p className="text-sm text-muted-foreground mt-1">Every lead scored 1–10 on rating, reviews, category demand, and no-website signal.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {(["HOT", "WARM", "COLD"] as const).map((t) => (
          <button key={t} onClick={() => setTier(t === tier ? "ALL" : t)} className="pm-card p-4 text-left" style={{ outline: tier === t ? "1px solid #CC0000" : "none" }}>
            <div className="text-xs text-muted-foreground">{t}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{counts[t]}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {(["ALL", "HOT", "WARM", "COLD"] as const).map((t) => (
            <button key={t} onClick={() => setTier(t)} className="text-xs px-3 py-1.5" style={{ border: "0.5px solid #E0E0E0", borderRadius: 20, background: tier === t ? "#FFF0F0" : "#fff", color: tier === t ? "#CC0000" : "#444" }}>
              {t}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="text-xs" style={{ padding: "6px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff" }}>
          <option value="score">Sort by score</option>
          <option value="rating">Sort by rating</option>
          <option value="recent">Sort by recent</option>
        </select>
      </div>

      <div className="mt-3 grid gap-2">
        {list.map((p) => (
          <div key={p.id} className="pm-card p-4 flex items-center gap-4">
            <ScoreDial score={p.score} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{p.category}</span>·
                <span className="flex items-center gap-1"><Star size={10} style={{ color: "#F5A623", fill: "#F5A623" }} /> {p.rating} ({p.reviews})</span>·
                <span>{p.city}, {p.state}</span>·
                <span style={{ color: p.hasWebsite ? "#999" : "#CC0000" }}>{p.hasWebsite ? "has site" : "no website"}</span>
              </div>
            </div>
            <ScoreBreakdown p={p} />
          </div>
        ))}
        {list.length === 0 && <div className="text-sm text-muted-foreground p-8 text-center pm-card">No leads in this view.</div>}
      </div>
    </div>
  );
}

function ScoreDial({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 7.5 ? "#CC0000" : score >= 5 ? "#F5A623" : "#9AA4B2";
  return (
    <div style={{ width: 44, height: 44, borderRadius: 22, background: `conic-gradient(${color} ${pct}%, #F0F0F0 0)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: 34, height: 34, borderRadius: 17, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color }}>{score}</div>
    </div>
  );
}

function ScoreBreakdown({ p }: { p: { rating: number; reviews: number; hasWebsite: boolean; score: number; tier: string } }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <Info size={12} /> Breakdown
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-10 p-3" style={{ width: 220, background: "#fff", border: "0.5px solid #E0E0E0", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="text-xs space-y-1.5">
            <Row k="Rating boost" v={`+${(p.rating * 1.2).toFixed(1)}`} />
            <Row k="Reviews boost" v={`+${Math.min(p.reviews / 30, 4).toFixed(1)}`} />
            <Row k="No-website" v={p.hasWebsite ? "—" : "+2.5"} />
            <div style={{ borderTop: "0.5px solid #F0F0F0", paddingTop: 6 }} className="flex justify-between font-medium">
              <span>Total</span><span style={{ color: "#CC0000" }}>{p.score} ({p.tier})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>;
}
