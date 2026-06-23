import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import { TrendingUp, DollarSign, Users, Percent } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/revenue")({
  component: RevenuePage,
});

function RevenuePage() {
  const payments = usePmStore((s) => s.payments);
  const prospects = usePmStore((s) => s.prospects);

  const upfront = payments.filter((p) => p.type === "upfront").reduce((a, b) => a + b.amount, 0);
  const mrr = payments.filter((p) => p.type === "hosting").reduce((a, b) => a + b.amount, 0);
  const closed = prospects.filter((p) => p.status === "Closed").length;
  const totalContacted = prospects.filter((p) => p.status !== "New").length;
  const conv = totalContacted > 0 ? Math.round((closed / totalContacted) * 100) : 0;
  const avgDeal = closed > 0 ? Math.round(upfront / closed) : 0;

  // Build a 12-month projection from current MRR + upfront pace
  const monthly: number[] = [];
  const baseUpfront = upfront / 1; // current month
  for (let i = 0; i < 12; i++) {
    const growth = Math.pow(1.18, i);
    monthly.push(Math.round((baseUpfront * growth) + (mrr * (i + 1))));
  }
  const max = Math.max(...monthly, 1);

  const byCategory = prospects.reduce<Record<string, number>>((acc, p) => {
    if (p.status === "Closed") acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const topCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Revenue dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Every dollar tracked. Compounding MRR over time.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Big icon={DollarSign} label="Upfront revenue" value={`$${upfront.toLocaleString()}`} sub="One-time sales" />
        <Big icon={TrendingUp} label="Recurring MRR" value={`$${mrr.toLocaleString()}`} sub="Hosting subscriptions" />
        <Big icon={Users} label="Total clients" value={closed.toString()} sub="Closed deals" />
        <Big icon={Percent} label="Conversion" value={`${conv}%`} sub={`Avg deal $${avgDeal.toLocaleString()}`} />
      </div>

      <div className="pm-card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">12-month projection</div>
            <div className="text-xs text-muted-foreground">Compounded growth + recurring hosting</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#CC0000" }}>${monthly[11].toLocaleString()}</div>
        </div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: 160 }}>
          <defs>
            <linearGradient id="rev2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#CC0000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#CC0000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const pts = monthly.map((v, i) => `${(i / 11) * 100},${40 - (v / max) * 38}`).join(" ");
            return (
              <>
                <polygon fill="url(#rev2)" points={`0,40 ${pts} 100,40`} />
                <polyline fill="none" stroke="#CC0000" strokeWidth="0.6" points={pts} vectorEffect="non-scaling-stroke" />
              </>
            );
          })()}
        </svg>
        <div className="grid grid-cols-12 gap-1 mt-2 text-[10px] text-muted-foreground text-center">
          {Array.from({ length: 12 }).map((_, i) => <div key={i}>M{i + 1}</div>)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="pm-card p-5">
          <div className="text-sm font-medium">Top converting categories</div>
          {topCats.length === 0 ? (
            <div className="text-xs text-muted-foreground mt-4">Close some deals to see breakdown.</div>
          ) : (
            <div className="mt-3 space-y-2">
              {topCats.map(([cat, n]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs"><span>{cat}</span><span>{n} closed</span></div>
                  <div style={{ height: 6, background: "#F0F0F0", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(n / topCats[0][1]) * 100}%`, height: "100%", background: "#CC0000" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pm-card p-5">
          <div className="text-sm font-medium">Active hosting subscriptions</div>
          <div className="mt-3 space-y-2">
            {payments.filter((p) => p.type === "hosting").map((p) => {
              const pr = prospects.find((x) => x.id === p.prospectId);
              return (
                <div key={p.id} className="flex justify-between text-xs py-2" style={{ borderBottom: "0.5px solid #F5F5F5" }}>
                  <span>{pr?.name}</span>
                  <span style={{ color: "#2A7A4F" }}>${p.amount}/mo</span>
                </div>
              );
            })}
            {payments.filter((p) => p.type === "hosting").length === 0 && <div className="text-xs text-muted-foreground">No subscriptions yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Big({ icon: Icon, label, value, sub }: { icon: typeof TrendingUp; label: string; value: string; sub: string }) {
  return (
    <div className="pm-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center justify-center" style={{ width: 28, height: 28, background: "#FFF0F0", borderRadius: 7 }}>
          <Icon size={14} style={{ color: "#CC0000" }} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 500 }}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
