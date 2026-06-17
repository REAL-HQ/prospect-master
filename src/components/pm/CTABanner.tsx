import { Rocket } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function CTABanner() {
  return (
    <section
      className="px-6 md:px-10 py-16 md:py-20 text-center"
      style={{ background: "#F5F5F5" }}
    >
      <div className="mx-auto max-w-[760px]">
        <SectionHeader
          icon={Rocket}
          eyebrow="Ready To Start"
          headline={<>37% Of Local Businesses Need A Website. <br /><span style={{ color: "#CC0000" }}>Your AI Is About To Call All Of Them.</span></>}
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
