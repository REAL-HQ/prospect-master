import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import { generateSiteCopy } from "@/lib/ai.functions";
import * as React from "react";
import { Sparkles, Loader2, Globe, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/sites")({
  component: SitesPage,
});

function SitesPage() {
  const prospects = usePmStore((s) => s.prospects);
  const sites = usePmStore((s) => s.sites);
  const generateSite = usePmStore((s) => s.generateSite);

  const [selectedId, setSelectedId] = React.useState<string>(prospects[0]?.id || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const eligible = prospects.filter((p) => !p.siteId);
  const selected = prospects.find((p) => p.id === selectedId);

  const build = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const copy = await generateSiteCopy({
        data: { name: selected.name, category: selected.category, city: selected.city, state: selected.state },
      });
      generateSite(selected.id, copy);
      setSelectedId(eligible.find((p) => p.id !== selected.id)?.id || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to build site");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>AI Website Builder</h1>
      <p className="text-sm text-muted-foreground mt-1">AI writes on-brand copy tuned to the business category. ~10 seconds per site.</p>

      <div className="pm-card p-5 mt-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Prospect</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, background: "#fff" }}>
              <option value="">Select a prospect…</option>
              {eligible.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.category}, {p.city}</option>)}
            </select>
          </div>
          <button onClick={build} disabled={!selected || loading} className="pm-btn-red">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? "AI is writing…" : "Build site with AI"}
          </button>
        </div>
        {error && <div className="text-xs text-[#CC0000] mt-2">{error}</div>}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Generated sites ({sites.length})</h2>
      <div className="mt-3 grid md:grid-cols-2 gap-4">
        {sites.map((site) => {
          const p = prospects.find((x) => x.id === site.prospectId);
          return (
            <div key={site.id} className="pm-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "0.5px solid #F0F0F0", background: "#FAFAFA" }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: "#FF5F57" }} />
                <span style={{ width: 8, height: 8, borderRadius: 4, background: "#FEBC2E" }} />
                <span style={{ width: 8, height: 8, borderRadius: 4, background: "#28C840" }} />
                <span className="text-[11px] text-muted-foreground ml-1 truncate">preview.prospectmaster.com/{site.slug}</span>
              </div>
              <div style={{ background: site.palette.bg, padding: 20 }}>
                <div className="text-[11px] uppercase tracking-wider" style={{ color: site.palette.primary, fontWeight: 600 }}>{p?.category}</div>
                <div style={{ fontSize: 20, fontWeight: 600, marginTop: 6, color: "#0E1116" }}>{site.headline}</div>
                <div className="text-sm text-muted-foreground mt-1">{site.tagline}</div>
                <p className="text-xs text-[#444] mt-3 leading-relaxed">{site.about}</p>
                <ul className="mt-3 space-y-1">
                  {site.services.map((s) => (
                    <li key={s} className="text-xs flex items-center gap-1.5"><span style={{ width: 4, height: 4, borderRadius: 2, background: site.palette.primary }} /> {s}</li>
                  ))}
                </ul>
                <button className="mt-4 text-xs font-medium px-4 py-2" style={{ background: site.palette.primary, color: "#fff", borderRadius: 6 }}>{site.cta}</button>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs" style={{ borderTop: "0.5px solid #F0F0F0" }}>
                <span className="text-muted-foreground flex items-center gap-1"><Globe size={11} /> Free hosting + SSL</span>
                <span className="flex items-center gap-1" style={{ color: "#CC0000" }}>Preview <ExternalLink size={10} /></span>
              </div>
            </div>
          );
        })}
        {sites.length === 0 && <div className="text-sm text-muted-foreground p-8 text-center pm-card md:col-span-2">No sites generated yet.</div>}
      </div>
    </div>
  );
}
