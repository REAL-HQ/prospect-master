import { Rocket } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function CTABanner() {
  return (
    <section
      className="px-6 md:px-10 py-16 md:py-20 text-center"
      style={{ background: "#F5F5F5" }}
    >
      <div className="mx-auto">
        <SectionHeader
          icon={Rocket}
          eyebrow="Ready To Start"
          headline={
            <span style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}>
              <span className="whitespace-normal md:whitespace-nowrap">37% Of Local Businesses Need A Website.</span>
              <br />
              <span className="whitespace-normal md:whitespace-nowrap" style={{ color: "#CC0000" }}>Your AI Is About To Contact All Of Them.</span>
            </span>
          }
          subtext="Start free. No credit card. First 10 prospects on us."
          maxWidth={760}
        />
        <div className="mt-6">
          <button className="pm-btn-red" style={{ padding: "13px 28px", fontSize: 14 }}>
            Start Free — It's Automatic
          </button>
        </div>
      </div>
    </section>
  );
}

