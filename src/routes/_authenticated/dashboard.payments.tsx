import { createFileRoute } from "@tanstack/react-router";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";
import { CreditCard, Check, Globe } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const prospects = usePmStore((s) => s.prospects);
  const payments = usePmStore((s) => s.payments);
  const record = usePmStore((s) => s.recordPayment);
  const sites = usePmStore((s) => s.sites);

  const [selectedId, setSelectedId] = React.useState("");
  const [amount, setAmount] = React.useState(1500);
  const [hosting, setHosting] = React.useState(49);
  const [success, setSuccess] = React.useState<string | null>(null);

  const eligible = prospects.filter((p) => p.status !== "Closed" && p.status !== "Lost");
  const selected = prospects.find((p) => p.id === selectedId);
  const site = sites.find((s) => s.prospectId === selectedId);

  const collect = () => {
    if (!selected) return;
    record(selected.id, amount, "upfront");
    if (hosting > 0) record(selected.id, hosting, "hosting");
    setSuccess(`Payment received from ${selected.name}. Site auto-deployed.`);
    setSelectedId("");
    setTimeout(() => setSuccess(null), 4000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500 }}>Auto-Close + Stripe</h1>
      <p className="text-sm text-muted-foreground mt-1">When they pay, the site auto-deploys to their custom domain. (Demo: simulate the Stripe webhook.)</p>

      <div className="grid md:grid-cols-[1fr_360px] gap-6 mt-6">
        {/* Configure */}
        <div className="pm-card p-5">
          <div className="text-sm font-medium mb-4">Send checkout</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Prospect</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13, background: "#fff" }}>
                <option value="">Select…</option>
                {eligible.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.category}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Upfront ($)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Monthly hosting ($)</label>
                <input type="number" value={hosting} onChange={(e) => setHosting(+e.target.value)} className="w-full mt-1" style={{ padding: "9px 10px", border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <button onClick={collect} disabled={!selected} className="pm-btn-red w-full justify-center">
              <Check size={14} /> Simulate payment received
            </button>
            {success && <div className="text-xs flex items-center gap-1" style={{ color: "#2A7A4F" }}><Check size={11} /> {success}</div>}
          </div>
        </div>

        {/* Stripe-style mock */}
        <div className="pm-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "0.5px solid #F0F0F0", background: "#FAFAFA" }}>
            <CreditCard size={14} /> <span className="text-xs font-medium">Checkout preview</span>
          </div>
          <div className="p-5">
            <div className="text-xs text-muted-foreground">Pay {selected?.name || "Prospect"}</div>
            <div style={{ fontSize: 32, fontWeight: 600, marginTop: 4 }}>${amount.toLocaleString()}</div>
            {hosting > 0 && <div className="text-xs text-muted-foreground mt-1">+ ${hosting}/mo hosting</div>}
            <div className="mt-4 space-y-2">
              <input placeholder="4242 4242 4242 4242" disabled className="w-full" style={{ padding: 10, border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 12, background: "#FAFAFA" }} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="MM / YY" disabled style={{ padding: 10, border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 12, background: "#FAFAFA" }} />
                <input placeholder="CVC" disabled style={{ padding: 10, border: "0.5px solid #E0E0E0", borderRadius: 6, fontSize: 12, background: "#FAFAFA" }} />
              </div>
            </div>
            <button disabled className="w-full mt-3" style={{ background: "#CC0000", color: "#fff", padding: 12, borderRadius: 6, fontSize: 13, fontWeight: 500, opacity: 0.5 }}>
              Pay ${amount.toLocaleString()} · Site deploys instantly
            </button>
            {site && (
              <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1"><Globe size={11} /> Will deploy to {selected?.name.toLowerCase().replace(/\s+/g, "-")}.com</div>
            )}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 500, marginTop: 32 }}>Recent payments</h2>
      <div className="mt-3 pm-card overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No payments yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ background: "#FAFAFA", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <tr>
                <th className="text-left p-3">Prospect</th>
                <th className="text-left p-3">Type</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-right p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => {
                const p = prospects.find((x) => x.id === pay.prospectId);
                return (
                  <tr key={pay.id} style={{ borderTop: "0.5px solid #F0F0F0" }}>
                    <td className="p-3">{p?.name}</td>
                    <td className="p-3 text-xs"><span style={{ background: pay.type === "upfront" ? "#FFF0F0" : "#F0F7FF", color: pay.type === "upfront" ? "#CC0000" : "#2C5FB3", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{pay.type.toUpperCase()}</span></td>
                    <td className="p-3 text-right font-medium">${pay.amount.toLocaleString()}{pay.type === "hosting" && "/mo"}</td>
                    <td className="p-3 text-right text-xs text-muted-foreground">{new Date(pay.paidAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
