import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

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
  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-[100] bg-white" style={{ borderBottom: "0.5px solid #E0E0E0" }}>
        <nav className="mx-auto flex h-[56px] items-center justify-between px-6 md:px-10 max-w-[1280px]">
          <Link to="/" className="font-medium tracking-[0.09em] uppercase text-[16px] select-none">
            <span style={{ color: "#111" }}>PROSPECT</span>
            <span style={{ color: "#CC0000" }}>MASTER</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Dashboard
            </Link>
          </div>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
