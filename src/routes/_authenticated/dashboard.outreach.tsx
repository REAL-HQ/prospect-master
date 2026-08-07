import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { Mail, MessageSquare, Send, Check, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/outreach")({
  component: OutreachPage,
});

function OutreachPage() {
  const prospects = usePmStore((s) => s.prospects);
  const outreach = usePmStore((s) => s.outreach);
  const sites = usePmStore((s) => s.sites);
  const createOutreach = usePmStore((s) => s.createOutreach);
  const sendNext = usePmStore((s) => s.sendNextStep);
  const automation = usePmStore((s) => s.automation);
  const setAutomation = usePmStore((s) => s.setAutomation);
  const runDueSteps = usePmStore((s) => s.runDueSteps);

  const [selectedId, setSelectedId] = React.useState("");

  // Automation scheduler: send any steps that have come due.
  React.useEffect(() => {
    runDueSteps();
    const t = setInterval(() => runDueSteps(), 60000);
    return () => clearInterval(t);
  }, [runDueSteps]);

  const eligible = prospects.filter((p) => !p.outreachId);

  const start = () => {
    if (!selectedId) return;
    const site = sites.find((s) => s.prospectId === selectedId);
    createOutreach(selectedId, site?.id);
    setSelectedId("");
  };

  const totalSent = outreach.reduce((a, o) => a + o.steps.filter((s) => s.sent).length, 0);
  const totalOpened = outreach.reduce((a, o) => a + o.steps.filter((s) => s.openedAt).length, 0);
  const queued = outreach.reduce((a, o) => a + o.steps.filter((s) => !s.sent).length, 0);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>AI outreach + follow-up</h1>
      <p className="text-sm text-muted-foreground mt-1">3-step cadence: Day 1 email → Day 3 email → Day 7 SMS. Steps send themselves when auto follow-up is on.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Active sequences" value={outreach.length} />
        <MiniStat label="Messages sent" value={totalSent} />
        <MiniStat label="Scheduled" value={queued} />
        <MiniStat label="Opens detected" value={totalOpened} />
      </div>

      <div className="pm-card p-4 mt-3 flex items-center gap-3">
        <Zap size={14} style={{ color: automation.autoFollowUp ? "#CC0000" : "#999" }} />
        <div className="flex-1">
          <div className="text-sm font-medium">Auto follow-up {automation.autoFollowUp ? "on" : "off"}</div>
          <div className="text-xs text-muted-foreground">
            {automation.autoFollowUp
              ? "Due steps send automatically — no manual work needed."
              : "Steps stay queued until you send them manually."}
          </div>
        </div>
        <button
          onClick={() => setAutomation({ autoFollowUp: !automation.autoFollowUp })}
          style={{ position: "relative", width: 42, height: 24, borderRadius: 12, background: automation.autoFollowUp ? "#CC0000" : "#D0D0D0", transition: "background 0.15s", flexShrink: 0 }}
          aria-label="Toggle auto follow-up"
        >
          <span style={{ position: "absolute", top: 2, left: automation.autoFollowUp ? 20 : 2, width: 20, height: 20, borderRadius: 10, background: "#fff", transition: "left 0.15s" }} />
        </button>
      </div>


      <div className="pm-card p-5 mt-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Start sequence for</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, background: "#fff" }}>
              <option value="">Select a prospect…</option>
              {eligible.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.category}</option>)}
            </select>
          </div>
          <button onClick={start} disabled={!selectedId} className="pm-btn-red"><Send size={14} /> Launch sequence</button>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Sequences</h2>
      <div className="mt-3 grid gap-3">
        {outreach.map((o) => {
          const p = prospects.find((x) => x.id === o.prospectId);
          const nextIdx = o.steps.findIndex((s) => !s.sent);
          return (
            <div key={o.id} className="pm-card p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-sm font-medium">{p?.name}</div>
                  <div className="text-xs text-muted-foreground">{p?.category} · {p?.city}, {p?.state}</div>
                </div>
                {nextIdx >= 0 ? (
                  <button onClick={() => sendNext(o.id)} className="pm-btn-ghost text-xs">
                    <Send size={11} /> Send step {nextIdx + 1}
                  </button>
                ) : (
                  <span className="text-xs flex items-center gap-1" style={{ color: "#2A7A4F" }}><Check size={11} /> Cadence complete</span>
                )}
              </div>
              <div className="mt-4 space-y-3">
                {o.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div style={{ width: 26, height: 26, borderRadius: 13, background: step.sent ? "#CC0000" : "#F0F0F0", color: step.sent ? "#fff" : "#999", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {step.channel === "email" ? <Mail size={12} /> : <MessageSquare size={12} />}
                      </div>
                      {i < o.steps.length - 1 && <div style={{ width: 1, flex: 1, background: "#F0F0F0", marginTop: 2 }} />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">Day {step.day} · {step.channel.toUpperCase()}</span>
                        {step.sent ? (
                          <span className="text-muted-foreground flex items-center gap-1"><Check size={10} /> Sent {new Date(step.sentAt!).toLocaleTimeString()}</span>
                        ) : (
                          <span className="text-muted-foreground flex items-center gap-1"><Clock size={10} /> Queued</span>
                        )}
                        {step.openedAt && <span style={{ color: "#CC0000" }}>· Opened</span>}
                      </div>
                      {step.subject && <div className="text-xs font-medium mt-1">{step.subject}</div>}
                      <pre className="text-xs text-[#555] mt-1 whitespace-pre-wrap font-sans" style={{ background: "#FAFAFA", padding: 10, borderRadius: 6, border: "0.5px solid #F0F0F0" }}>{step.body}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {outreach.length === 0 && <div className="text-sm text-muted-foreground p-8 text-center pm-card">No sequences started.</div>}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="pm-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}
