import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/pm/Navigation";
import { Hero } from "@/components/pm/Hero";
import { HowItWorks } from "@/components/pm/HowItWorks";
import { FeaturesGrid } from "@/components/pm/FeaturesGrid";
import { ComparisonTable } from "@/components/pm/ComparisonTable";
import { RevenueCalculator } from "@/components/pm/RevenueCalculator";
import { Pricing } from "@/components/pm/Pricing";
import { CTABanner } from "@/components/pm/CTABanner";
import { Footer } from "@/components/pm/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProspectMaster — Your AI Closes Website Deals While You Sleep" },
      {
        name: "description",
        content:
          "ProspectMaster finds local businesses with no website, builds their demo site, sends personalized outreach, and closes the deal. Automatically.",
      },
      { property: "og:title", content: "ProspectMaster — AI Prospect Discovery + Auto-Close" },
      {
        property: "og:description",
        content:
          "Find no-website businesses, auto-build their site, send personalized outreach, close the deal — fully automated.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-white">
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesGrid />
        <ComparisonTable />
        <RevenueCalculator />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
