import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SiteCopyInput = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

export type SiteCopy = {
  headline: string;
  tagline: string;
  about: string;
  services: string[];
  cta: string;
  business: {
    testimonial: { quote: string; author: string };
    faqs: { q: string; a: string }[];
    hours: string[];
    highlights: string[];
  };
};

function fallbackCopy(data: z.infer<typeof SiteCopyInput>): SiteCopy {
  const cat = data.category.toLowerCase();
  return {
    headline: `Welcome to ${data.name}`,
    tagline: `Trusted ${cat} serving ${data.city}, ${data.state}`,
    about: `${data.name} proudly serves the ${data.city} community with reliable, professional ${cat} services. Quality work, fair prices, and friendly people.`,
    services: ["Expert service", "Trusted local team", "Fair, upfront pricing"],
    cta: "Book Now",
    business: {
      testimonial: { quote: `Great experience from start to finish — highly recommend ${data.name}.`, author: `Local customer, ${data.city}` },
      faqs: [
        { q: "Do you offer free estimates?", a: "Yes — reach out and we'll give you a clear quote before any work begins." },
        { q: "What areas do you serve?", a: `${data.city} and the surrounding communities.` },
        { q: "How soon can you help?", a: "Most requests are scheduled within a few days." },
      ],
      hours: ["Mon–Fri: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 3:00 PM", "Sun: Closed"],
      highlights: ["Locally owned", "Licensed & insured", "5-star reviews"],
    },
  };
}

export const generateSiteCopy = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SiteCopyInput.parse(d))
  .handler(async ({ data }): Promise<SiteCopy> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return fallbackCopy(data);

    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Write a complete, conversion-focused one-page website for a small local business. Sound like a confident local brand, never like AI filler.

Business: ${data.name}
Category: ${data.category}
Location: ${data.city}, ${data.state}

Rules:
- headline: 5-9 words, benefit-led, may include the business name
- tagline: one sentence, 10-16 words
- about: 3 sentences, warm and credible, mentions ${data.city}
- services: exactly 3 items, 3-6 words each, specific to ${data.category}
- cta: 2-3 words, Title Case, action-oriented
- testimonial: one realistic 15-25 word quote plus a first name and last initial
- faqs: exactly 3 short question/answer pairs a real customer would ask this category
- hours: 3 lines of plausible opening hours
- highlights: exactly 3 trust badges, 2-4 words each`;

    const schema = z.object({
      headline: z.string(),
      tagline: z.string(),
      about: z.string(),
      services: z.array(z.string()),
      cta: z.string(),
      testimonial: z.object({ quote: z.string(), author: z.string() }),
      faqs: z.array(z.object({ q: z.string(), a: z.string() })),
      hours: z.array(z.string()),
      highlights: z.array(z.string()),
    });

    try {
      const result = streamText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema }),
        prompt,
      });
      const out = await result.output;
      return {
        headline: out.headline,
        tagline: out.tagline,
        about: out.about,
        services: out.services.slice(0, 3),
        cta: out.cta,
        business: {
          testimonial: out.testimonial,
          faqs: out.faqs.slice(0, 3),
          hours: out.hours.slice(0, 3),
          highlights: out.highlights.slice(0, 3),
        },
      };
    } catch (error) {
      if (!NoObjectGeneratedError.isInstance(error)) console.error("[site copy]", error);
      return fallbackCopy(data);
    }
  });
