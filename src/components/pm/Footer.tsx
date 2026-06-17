import { Logo } from "./Navigation";

const cols = [
  {
    heading: "Product",
    links: ["How It Works", "Features", "Calculator", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#F5F5F5", borderTop: "0.5px solid #E0E0E0" }}>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-[13px] max-w-[240px]" style={{ color: "#666" }}>
            Your AI closes website deals while you sleep.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.heading}>
            <div
              className="text-[11px] font-medium uppercase tracking-wider mb-3"
              style={{ color: "#999" }}
            >
              {c.heading}
            </div>
            <ul className="flex flex-col gap-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] hover:text-[#CC0000] transition-colors"
                    style={{ color: "#666" }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="mx-auto max-w-[1280px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: "0.5px solid #E0E0E0" }}
      >
        <Logo />
        <div className="text-[12px]" style={{ color: "#999" }}>
          © {new Date().getFullYear()} ProspectMaster. All rights reserved.
        </div>
        <a
          href="#"
          className="text-[12px]"
          style={{ color: "#666" }}
        >
          prospectmaster.com
        </a>
      </div>
    </footer>
  );
}
