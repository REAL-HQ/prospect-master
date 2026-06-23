import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Search, Sparkles, Globe, Eye, Send, Users, CreditCard, TrendingUp, LogOut, RotateCcw, Sprout, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePmStore } from "@/lib/pm-store";
import * as React from "react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/search", label: "Search", icon: Search },
  { to: "/dashboard/leads", label: "Leads", icon: Sparkles },
  { to: "/dashboard/filings", label: "Filings", icon: Sprout },
  { to: "/dashboard/sites", label: "Sites", icon: Globe },
  { to: "/dashboard/previews", label: "Previews", icon: Eye },
  { to: "/dashboard/outreach", label: "Outreach", icon: Send },
  { to: "/dashboard/crm", label: "CRM", icon: Users },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/revenue", label: "Revenue", icon: TrendingUp },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const notifications = usePmStore((s) => s.notifications);
  const markAllRead = usePmStore((s) => s.markAllRead);
  const resetAll = usePmStore((s) => s.resetAll);
  const seedDemo = usePmStore((s) => s.seedDemo);
  const prospectsLen = usePmStore((s) => s.prospects.length);
  const [bellOpen, setBellOpen] = React.useState(false);

  // Seed demo data on first visit if empty
  React.useEffect(() => {
    if (prospectsLen === 0) seedDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 56px)" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col"
        style={{ width: 220, borderRight: "0.5px solid #E0E0E0", background: "#FAFAFA", padding: "20px 12px" }}
      >
        <div style={{ fontSize: 10, color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px 8px" }}>
          Workspace
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2.5 transition-colors"
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 13,
                  color: active ? "#CC0000" : "#444",
                  background: active ? "#FFF0F0" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon size={15} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4" style={{ borderTop: "0.5px solid #E8E8E8" }}>
          <button
            onClick={() => { if (confirm("Reset all demo data?")) resetAll(); }}
            className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            style={{ padding: "6px 10px" }}
          >
            <RotateCcw size={12} /> Reset demo
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground" style={{ padding: "6px 10px" }}>
            <LogOut size={12} /> Sign out
          </button>
          <div className="text-[11px] text-muted-foreground mt-2 px-2.5 truncate">{user?.email}</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-end gap-3 px-6 md:px-10 py-3" style={{ borderBottom: "0.5px solid #F0F0F0" }}>
          <div className="relative">
            <button
              onClick={() => { setBellOpen((o) => !o); if (!bellOpen) markAllRead(); }}
              className="relative flex items-center justify-center"
              style={{ width: 32, height: 32, borderRadius: 8, border: "0.5px solid #E0E0E0", background: "#fff" }}
            >
              <Bell size={14} />
              {unread > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, background: "#CC0000", color: "#fff", fontSize: 9, fontWeight: 600, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>
                  {unread}
                </span>
              )}
            </button>
            {bellOpen && (
              <div style={{ position: "absolute", right: 0, top: 40, width: 320, background: "#fff", border: "0.5px solid #E0E0E0", borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", zIndex: 50, maxHeight: 400, overflow: "auto" }}>
                <div style={{ padding: "10px 12px", borderBottom: "0.5px solid #F0F0F0", fontSize: 12, fontWeight: 500 }}>Notifications</div>
                {notifications.length === 0 ? (
                  <div className="text-xs text-muted-foreground p-4">No notifications yet.</div>
                ) : notifications.map((n) => (
                  <div key={n.id} style={{ padding: "10px 12px", borderBottom: "0.5px solid #F5F5F5", fontSize: 12 }}>
                    <div>{n.text}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(n.at).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 md:px-10 py-8 max-w-[1280px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
