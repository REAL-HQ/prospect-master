import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Logo() {
  return (
    <a
      href="#top"
      className="font-medium tracking-[0.09em] uppercase text-[16px] select-none"
      style={{ letterSpacing: "0.09em" }}
    >
      <span style={{ color: "#111" }}>PROSPECT</span>
      <span style={{ color: "#CC0000" }}>MASTER</span>
    </a>
  );
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header
      className="sticky top-0 z-[100] bg-white"
      style={{ borderBottom: "0.5px solid #E0E0E0" }}
    >
      <nav className="mx-auto flex h-[56px] items-center justify-between px-6 md:px-10 max-w-[1280px]">
        <Logo />
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <div className="w-20 h-8 animate-pulse bg-muted rounded" />
          ) : user ? (
            <>
              <Link to="/dashboard" className="pm-btn-ghost">
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="pm-btn-ghost">
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="pm-btn-ghost">
                Sign In
              </Link>
              <Link to="/auth" className="pm-btn-red">
                Start Free
              </Link>
            </>
          )}
        </div>
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div
          className="md:hidden bg-white px-6 py-4 flex flex-col gap-4"
          style={{ borderTop: "0.5px solid #E0E0E0" }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {loading ? null : user ? (
              <>
                <Link to="/dashboard" className="pm-btn-ghost flex-1 justify-center" onClick={() => setOpen(false)}>
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <button onClick={() => { handleSignOut(); setOpen(false); }} className="pm-btn-ghost flex-1 justify-center">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="pm-btn-ghost flex-1 justify-center" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link to="/auth" className="pm-btn-red flex-1 justify-center" onClick={() => setOpen(false)}>
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
