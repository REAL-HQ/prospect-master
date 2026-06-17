import { useState } from "react";
import { Menu, X } from "lucide-react";

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
          <button className="pm-btn-ghost">Sign In</button>
          <button className="pm-btn-red">Start Free</button>
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
            <button className="pm-btn-ghost flex-1">Sign In</button>
            <button className="pm-btn-red flex-1 justify-center">Start Free</button>
          </div>
        </div>
      )}
    </header>
  );
}
