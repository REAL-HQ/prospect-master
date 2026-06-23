import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Bell, LogOut, Settings } from "lucide-react";
import * as React from "react";
import { usePmStore } from "@/lib/pm-store";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const notifications = usePmStore((s) => s.notifications);
  const markAllRead = usePmStore((s) => s.markAllRead);
  const [bellOpen, setBellOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-[100] bg-white" style={{ borderBottom: "0.5px solid #E0E0E0" }}>
        <nav className="flex h-[56px] items-center justify-between px-6 md:px-10">
          <Link to="/" className="font-medium tracking-[0.09em] uppercase text-[16px] select-none">
            <span style={{ color: "#111" }}>PROSPECT</span>
            <span style={{ color: "#CC0000" }}>MASTER</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setBellOpen((o) => !o); if (!bellOpen) markAllRead(); }}
                className="relative flex items-center justify-center rounded-full border border-border bg-background"
                style={{ width: 32, height: 32 }}
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

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center justify-center rounded-full border border-border bg-background overflow-hidden"
                style={{ width: 32, height: 32 }}
              >
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={userDisplayName(user)} />
                  <AvatarFallback className="bg-primary-tint text-primary text-xs font-medium">
                    {userInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-10 w-[260px] rounded-2xl border border-border bg-background shadow-xl z-50 overflow-hidden">
                  <div className="p-4 flex items-center gap-3 border-b border-border">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={userDisplayName(user)} />
                      <AvatarFallback className="bg-primary-tint text-primary text-sm font-medium">
                        {userInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{userDisplayName(user)}</div>
                      <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings size={14} />
                      Account
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
