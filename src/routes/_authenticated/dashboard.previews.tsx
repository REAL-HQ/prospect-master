import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { Eye, MousePointerClick, Smartphone, Monitor, Copy, Check, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/previews")({
  component: PreviewsPage,
});

function PreviewsPage() {
  const sites = usePmStore((s) => s.sites);
  const events = usePmStore((s) => s.previewEvents);
  const prospects = usePmStore((s) => s.prospects);
  const simulate = usePmStore((s) => s.simulatePreviewActivity);

  const totalViews = events.filter((e) => e.type === "view").length;
  const totalClicks = events.filter((e) => e.type === "cta_click").length;
  const unique = new Set(events.map((e) => `${e.siteId}-${e.device}`)).size;

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Trackable Preview Links</h1>
      <p className="text-sm text-muted-foreground mt-1">Every preview URL is tracked. See the moment a prospect opens it.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat icon={Eye} label="Total views" value={totalViews} />
        <Stat icon={Smartphone} label="Unique visitors" value={unique} />
        <Stat icon={MousePointerClick} label="CTA clicks" value={totalClicks} />
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Active preview links</h2>
      <div className="mt-3 grid gap-2">
        {sites.map((site) => {
          const p = prospects.find((x) => x.id === site.prospectId);
          const siteEvents = events.filter((e) => e.siteId === site.id);
          const views = siteEvents.filter((e) => e.type === "view").length;
          const clicks = siteEvents.filter((e) => e.type === "cta_click").length;
          return <PreviewRow key={site.id} site={site} prospectName={p?.name || "—"} views={views} clicks={clicks} events={siteEvents} onSimulate={() => simulate(site.id, 1 + Math.floor(Math.random() * 3))} />;
        })}
        {sites.length === 0 && <div className="text-sm text-muted-foreground p-8 text-center pm-card">No preview links yet. Build a site first.</div>}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="pm-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon size={12} /> {label}</div>
      <div style={{ fontSize: 24, fontWeight: 500, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function PreviewRow({ site, prospectName, views, clicks, events, onSimulate }: {
  site: { id: string; slug: string };
  prospectName: string;
  views: number;
  clicks: number;
  events: { id: string; type: string; device: string; at: number }[];
  onSimulate: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const url = `preview.prospectmaster.com/${site.slug}`;
  const copy = () => { navigator.clipboard.writeText(`https://${url}`); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="pm-card p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="text-sm font-medium">{prospectName}</div>
          <button onClick={copy} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5">
            {url} {copied ? <Check size={11} style={{ color: "#2A7A4F" }} /> : <Copy size={11} />}
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><Eye size={12} style={{ color: "#CC0000" }} /> {views}</span>
          <span className="flex items-center gap-1"><MousePointerClick size={12} style={{ color: "#CC0000" }} /> {clicks}</span>
          <button onClick={onSimulate} className="pm-btn-ghost text-xs"><Zap size={11} /> Simulate open</button>
        </div>
      </div>
      {events.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {events.slice(0, 6).map((e) => (
            <span key={e.id} className="text-[10px] px-2 py-1" style={{ background: "#FAFAFA", borderRadius: 4, border: "0.5px solid #F0F0F0" }}>
              {e.type === "view" ? <Eye size={9} className="inline mr-1" /> : <MousePointerClick size={9} className="inline mr-1" />}
              {e.device === "mobile" ? <Smartphone size={9} className="inline" /> : <Monitor size={9} className="inline" />}
              <span className="ml-1 text-muted-foreground">{new Date(e.at).toLocaleTimeString()}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
