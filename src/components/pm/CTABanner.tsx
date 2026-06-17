import { SectionHeader } from "./SectionHeader";

export function CTABanner() {
  return (
    <section
      className="px-6 md:px-10 py-16 md:py-20 text-center"
      style={{ background: "#F5F5F5" }}
    >
      <div className="mx-auto max-w-[760px]">
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>
          37% Of Local Businesses Need A Website.{" "}
          <span style={{ color: "#CC0000" }}>
            Your AI Is About To Call All Of Them.
          </span>
        </h2>
        <p className="mt-4 text-[15px]" style={{ color: "#666" }}>
          Start free. No credit card. First 10 prospects on us.
        </p>
        <div className="mt-6">
          <button className="pm-btn-red" style={{ padding: "13px 28px", fontSize: 14 }}>
            Start Free — It's Automatic
          </button>
        </div>
      </div>
    </section>
  );
}
