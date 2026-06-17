import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Zap, TrendingUp, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ProspectMaster" },
      { name: "description", content: "Your ProspectMaster dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0E1116" }}>
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.email?.split("@")[0] || "there"}
          </p>
        </div>
        <button onClick={handleSignOut} className="pm-btn-ghost">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="pm-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center" style={{ width: 30, height: 30, background: "#FFF0F0", borderRadius: 8 }}>
              <Zap size={16} style={{ color: "#CC0000" }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Active Prospects</span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#0E1116" }}>0</p>
          <p className="text-xs text-muted-foreground mt-1">Start a scan to find leads</p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center" style={{ width: 30, height: 30, background: "#FFF0F0", borderRadius: 8 }}>
              <TrendingUp size={16} style={{ color: "#CC0000" }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Revenue</span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#0E1116" }}>$0</p>
          <p className="text-xs text-muted-foreground mt-1">Track your earnings</p>
        </div>

        <div className="pm-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center" style={{ width: 30, height: 30, background: "#FFF0F0", borderRadius: 8 }}>
              <LayoutDashboard size={16} style={{ color: "#CC0000" }} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Sites Built</span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#0E1116" }}>0</p>
          <p className="text-xs text-muted-foreground mt-1">AI-generated demo sites</p>
        </div>
      </div>

      <div className="mt-8 pm-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings size={16} style={{ color: "#CC0000" }} />
          <h2 style={{ fontSize: 16, fontWeight: 500 }}>Getting Started</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full border border-[#E0E0E0] flex items-center justify-center flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Run your first prospect scan</p>
              <p className="text-xs text-muted-foreground">Find local businesses with no website</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full border border-[#E0E0E0] flex items-center justify-center flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Build a demo site</p>
              <p className="text-xs text-muted-foreground">AI generates a preview site in 60 seconds</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full border border-[#E0E0E0] flex items-center justify-center flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Send outreach</p>
              <p className="text-xs text-muted-foreground">Auto-send personalized emails and follow-ups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
