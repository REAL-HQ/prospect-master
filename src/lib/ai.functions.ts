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
};

export const generateSiteCopy = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SiteCopyInput.parse(d))
  .handler(async ({ data }): Promise<SiteCopy> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      // Fallback templated copy if no key configured
      return {
        headline: `Welcome to ${data.name}`,
        tagline: `Trusted ${data.category} in ${data.city}, ${data.state}`,
        about: `${data.name} has been serving the ${data.city} community with reliable, professional ${data.category.toLowerCase()} services. We pride ourselves on quality work, fair prices, and friendly service.`,
        services: ["Expert service", "Trusted professionals", "Local & family-friendly"],
        cta: "Book now",
      };
    }

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Write conversion-focused website copy for a small local business.

Business: ${data.name}
Category: ${data.category}
Location: ${data.city}, ${data.state}

Return:
- headline: bold, 5-8 words, includes business name
- tagline: 1 short sentence (8-14 words) under the headline
- about: 2-3 sentences, warm and trustworthy, mentions the city
- services: array of 3 short service bullets (3-5 words each), specific to the category
- cta: 2-3 word button text, action-oriented`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({
          schema: z.object({
            headline: z.string(),
            tagline: z.string(),
            about: z.string(),
            services: z.array(z.string()).min(3).max(3),
            cta: z.string(),
          }),
        }),
        prompt,
      });
      return output;
    } catch {
      return {
        headline: `Welcome to ${data.name}`,
        tagline: `Trusted ${data.category} in ${data.city}, ${data.state}`,
        about: `${data.name} proudly serves ${data.city} with professional ${data.category.toLowerCase()} services.`,
        services: ["Expert service", "Local team", "Fair pricing"],
        cta: "Get a quote",
      };
    }
  });
