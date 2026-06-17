import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  headline: ReactNode;
  subtext?: ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
};

export function SectionHeader({
  eyebrow,
  headline,
  subtext,
  align = "center",
  maxWidth = 640,
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
          style={{ background: "#FFF0F0" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#CC0000" }} />
          <span className="text-[13px] font-medium" style={{ color: "#CC0000" }}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className="font-extrabold tracking-tight"
        style={{
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.1,
          color: "#0E1116",
          letterSpacing: "-0.02em",
        }}
      >
        {headline}
      </h2>
      {subtext && (
        <p
          className="mt-4 text-[18px] md:text-[20px] leading-relaxed"
          style={{
            color: "#555",
            maxWidth,
            marginLeft: align === "center" ? "auto" : undefined,
            marginRight: align === "center" ? "auto" : undefined,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
