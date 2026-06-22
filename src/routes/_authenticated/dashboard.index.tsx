import { createFileRoute, Link } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import { Search, Sparkles, Globe, Send, Users, CreditCard, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

function Overview() {
  const { prospects, sites, outreach, payments } = usePmStore();
  const hot = prospects.filter((p) => p.tier === "HOT").length;
  const revenue = payments.reduce((a, b) => a + b.amount, 0);
  const mrr = payments.filter((p) => p.type === "hosting").reduce((a, b) => a + b.amount, 0);

  const stats = [
    { label: "Active Prospects", value: prospects.length, hint: `${hot} hot`, icon: Sparkles },
    { label: "Demo Sites", value: sites.length, hint: "AI-generated", icon: Globe },
    { label: "Outreach Sequences", value: outreach.length, hint: `${outreach.reduce((a, o) => a + o.steps.filter((s) => s.sent).length, 0)} sent`, icon: Send },
    { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, hint: `$${mrr}/mo MRR`, icon: TrendingUp },
  ];

  const quick = [
    { to: "/dashboard/search", title: "Find no-website leads", desc: "Scan Google Maps live", icon: Search },
    { to: "/dashboard/sites", title: "Build a demo site", desc: "AI writes copy in seconds", icon: Globe },
    { to: "/dashboard/outreach", title: "Launch outreach", desc: "Cold email + SMS cadence", icon: Send },
    { to: "/dashboard/crm", title: "Work your pipeline", desc: "Move leads to close", icon: Users },
    { to: "/dashboard/payments", title: "Collect payment", desc: "Stripe-style checkout", icon: CreditCard },
    { to: "/dashboard/revenue", title: "See revenue", desc: "Track MRR & conversion", icon: TrendingUp },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Overview</h1>
      <p className="text-sm text-muted-foreground mt-1">Your end-to-end prospecting workspace.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="pm-card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center" style={{ width: 28, height: 28, background: "#FFF0F0", borderRadius: 7 }}>
                  <Icon size={14} style={{ color: "#CC0000" }} />
                </div>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 500 }}>{s.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{s.hint}</div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Quick actions</h2>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <Link key={q.to} to={q.to} className="pm-card p-5 group" style={{ display: "block" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, background: "#FFF0F0", borderRadius: 8 }}>
                  <Icon size={15} style={{ color: "#CC0000" }} />
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="mt-3 text-[14px] font-medium">{q.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{q.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
