import { createFileRoute } from "@tanstack/react-router";
import { usePmStore, type DealStatus } from "@/lib/pm-store";
import * as React from "react";
import { X, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/crm")({
  component: CrmPage,
});

const COLUMNS: DealStatus[] = ["New", "Contacted", "Interested", "Closed", "Lost"];

function CrmPage() {
  const prospects = usePmStore((s) => s.prospects);
  const activities = usePmStore((s) => s.activities);
  const setStatus = usePmStore((s) => s.setStatus);
  const updateProspect = usePmStore((s) => s.updateProspect);
  const addTags = usePmStore((s) => s.addTags);
  const removeTag = usePmStore((s) => s.removeTag);
  const logActivity = usePmStore((s) => s.logActivity);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [tagDraft, setTagDraft] = React.useState("");
  const [noteDraft, setNoteDraft] = React.useState("");
  const open = prospects.find((p) => p.id === openId);
  const timeline = React.useMemo(
    () => activities.filter((a) => a.prospectId === openId).sort((a, b) => b.at - a.at).slice(0, 30),
    [activities, openId],
  );

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>CRM pipeline</h1>
      <p className="text-sm text-muted-foreground mt-1">Every lead lands here automatically. Move them through to close.</p>

      <div className="mt-6 grid gap-3" style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(180px, 1fr))`, overflowX: "auto" }}>
        {COLUMNS.map((col) => {
          const items = prospects.filter((p) => p.status === col);
          return (
            <div key={col} className="pm-card p-3" style={{ background: "#FAFAFA", minHeight: 300 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider">{col}</span>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((p) => (
                  <div key={p.id} className="p-3 cursor-pointer" style={{ background: "#fff", border: "0.5px solid #E8E8E8", borderRadius: 6 }} onClick={() => setOpenId(p.id)}>
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{p.category} · {p.city}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] flex items-center gap-1"><Star size={9} style={{ color: "#F5A623", fill: "#F5A623" }} /> {p.rating}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 3, background: p.tier === "HOT" ? "#CC0000" : p.tier === "WARM" ? "#FFE5C7" : "#E5EAF0", color: p.tier === "HOT" ? "#fff" : p.tier === "WARM" ? "#B36B00" : "#5A6A7E" }}>{p.tier}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-4">Empty</div>}
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setOpenId(null)}>
          <aside style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 440, background: "#fff", padding: 24, overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontSize: 18, fontWeight: 500 }}>{open.name}</div>
              <button onClick={() => setOpenId(null)}><X size={16} /></button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>{open.category}</div>
              <div>{open.address}, {open.city}, {open.state}</div>
              <div>{open.phone}</div>
              <div className="flex items-center gap-1"><Star size={11} style={{ color: "#F5A623", fill: "#F5A623" }} /> {open.rating} ({open.reviews} reviews)</div>
              <div>Score: {open.score} · {open.tier}</div>
              <div>Last activity: {new Date(open.lastActivityAt).toLocaleString()}</div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted-foreground">Status</label>
              <div className="grid grid-cols-5 gap-1 mt-1">
                {COLUMNS.map((c) => (
                  <button key={c} onClick={() => setStatus(open.id, c)} className="text-[10px] py-2" style={{ border: "0.5px solid #E0E0E0", borderRadius: 4, background: open.status === c ? "#FFF0F0" : "#fff", color: open.status === c ? "#CC0000" : "#444", fontWeight: open.status === c ? 600 : 400 }}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted-foreground">Tags</label>
              <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                {(open.tags ?? []).map((t) => (
                  <span key={t} className="flex items-center gap-1" style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", borderRadius: 4, background: "#F0F0F0", color: "#555" }}>
                    {t}
                    <button onClick={() => removeTag(open.id, t)} aria-label={`Remove ${t}`}><X size={9} /></button>
                  </span>
                ))}
                {(open.tags ?? []).length === 0 && <span className="text-xs text-muted-foreground">No tags yet</span>}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const tags = tagDraft.split(",").map((t) => t.trim()).filter(Boolean);
                  if (tags.length) addTags([open.id], tags);
                  setTagDraft("");
                }}
                className="flex gap-2 mt-2"
              >
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  placeholder="Add tag…"
                  className="flex-1"
                  style={{ padding: "7px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 12 }}
                />
                <button type="submit" className="text-xs px-3" style={{ border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff" }}>Add</button>
              </form>
            </div>

            <div className="mt-4">
              <label className="text-xs text-muted-foreground">Notes</label>
              <textarea value={open.notes} onChange={(e) => updateProspect(open.id, { notes: e.target.value })} placeholder="Add note…" className="w-full mt-1" style={{ padding: 10, border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, minHeight: 80, fontFamily: "inherit" }} />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noteDraft.trim()) return;
                  logActivity(open.id, noteDraft.trim(), "note");
                  setNoteDraft("");
                }}
                className="flex gap-2 mt-2"
              >
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Log an activity…"
                  className="flex-1"
                  style={{ padding: "7px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 12 }}
                />
                <button type="submit" className="text-xs px-3" style={{ border: "0.5px solid #E0E0E0", borderRadius: 6, background: "#fff" }}>Log</button>
              </form>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-muted-foreground" />
                <label className="text-xs text-muted-foreground">Activity timeline</label>
              </div>
              <div className="space-y-2">
                {timeline.map((a) => (
                  <div key={a.id} className="flex gap-2.5">
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: "#CC0000", marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div className="text-xs">{a.text}</div>
                      <div className="text-[10px] text-muted-foreground">{a.type} · {new Date(a.at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && <div className="text-xs text-muted-foreground">No activity logged yet.</div>}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
