import { createFileRoute, Link } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { Search, MapPin, Star, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/search")({
  component: SearchPage,
});

const CATEGORIES = ["Dentists", "Restaurants", "Salons", "Plumbers", "Gyms", "Auto", "Lawyers"];

function SearchPage() {
  const runSearch = usePmStore((s) => s.runSearch);
  const saveSearch = usePmStore((s) => s.saveSearch);
  const saved = usePmStore((s) => s.savedSearches);
  const prospects = usePmStore((s) => s.prospects);

  const [category, setCategory] = React.useState("Dentists");
  const [location, setLocation] = React.useState("Austin, TX");
  const [loading, setLoading] = React.useState(false);
  const [lastFound, setLastFound] = React.useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLastFound(null);
    // Simulate scan latency
    await new Promise((r) => setTimeout(r, 900));
    const created = runSearch({ category, location, count: 8 });
    setLastFound(created.length);
    setLoading(false);
  };

  const recent = prospects.slice(0, 8);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Live Prospect Search</h1>
      <p className="text-sm text-muted-foreground mt-1">Real-time scan for no-website businesses. Mock data simulates Google Maps API.</p>

      <form onSubmit={handleSearch} className="pm-card p-5 mt-6">
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, background: "#fff" }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Location</label>
            <div className="relative mt-1">
              <MapPin size={13} style={{ position: "absolute", top: 11, left: 10, color: "#999" }} />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State or ZIP" style={{ width: "100%", padding: "9px 10px 9px 30px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="pm-btn-red">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {loading ? "Scanning..." : "Scan now"}
            </button>
            <button type="button" onClick={() => saveSearch(`${category} in ${location}`, category, location)} className="pm-btn-ghost" title="Save search">
              <Save size={14} />
            </button>
          </div>
        </div>
        {lastFound !== null && (
          <div className="mt-3 text-xs" style={{ color: "#CC0000" }}>
            ✓ Found {lastFound} no-website {category.toLowerCase()} in {location}.
          </div>
        )}
      </form>

      {saved.length > 0 && (
        <div className="mt-6">
          <div className="text-xs text-muted-foreground mb-2">Saved searches (rerun daily)</div>
          <div className="flex flex-wrap gap-2">
            {saved.map((s) => (
              <button key={s.id} onClick={() => { setCategory(s.category); setLocation(s.location); }} className="text-xs px-3 py-1.5" style={{ border: "0.5px solid #E0E0E0", borderRadius: 20, background: "#fff" }}>
                {s.query}
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Latest discoveries</h2>
      <div className="mt-3 pm-card overflow-hidden">
        {recent.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No prospects yet. Run a scan above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "#FAFAFA", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <tr>
                <th className="text-left p-3">Business</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Score</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id} style={{ borderTop: "0.5px solid #F0F0F0" }}>
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.address} · {p.city}, {p.state}</div>
                  </td>
                  <td className="p-3 text-xs">{p.category}</td>
                  <td className="p-3 text-xs flex items-center gap-1"><Star size={11} style={{ color: "#F5A623", fill: "#F5A623" }} /> {p.rating} <span className="text-muted-foreground">({p.reviews})</span></td>
                  <td className="p-3 text-xs">{p.phone}</td>
                  <td className="p-3">
                    <TierBadge tier={p.tier} score={p.score} />
                  </td>
                  <td className="p-3 text-right">
                    <Link to="/dashboard/leads" className="text-xs" style={{ color: "#CC0000" }}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function TierBadge({ tier, score }: { tier: "HOT" | "WARM" | "COLD"; score: number }) {
  const map = {
    HOT: { bg: "#CC0000", fg: "#fff" },
    WARM: { bg: "#FFE5C7", fg: "#B36B00" },
    COLD: { bg: "#E5EAF0", fg: "#5A6A7E" },
  } as const;
  const c = map[tier];
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: c.bg, color: c.fg }}>{tier} · {score}</span>;
}
