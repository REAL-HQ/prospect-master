import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Search, Sparkles, Globe, Eye, Send, Users, CreditCard, TrendingUp, Sprout, Settings } from "lucide-react";
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
];

export function DashboardShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const seedDemo = usePmStore((s) => s.seedDemo);
  const prospectsLen = usePmStore((s) => s.prospects.length);

  // Seed demo data on first visit if empty
  React.useEffect(() => {
    if (prospectsLen === 0) seedDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="px-6 md:px-10 py-8 max-w-[1280px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
