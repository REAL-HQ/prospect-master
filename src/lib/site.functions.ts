import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PublicSite = {
  slug: string;
  headline: string;
  tagline: string;
  about: string;
  services: string[];
  cta: string;
  template: string;
  palette: { primary: string; bg: string };
  business: {
    name?: string;
    category?: string;
    city?: string;
    state?: string;
    phone?: string;
    address?: string;
    heroKey?: string;
    testimonial?: { quote: string; author: string };
    faqs?: { q: string; a: string }[];
    hours?: string[];
    highlights?: string[];
  };
};

async function anonClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}


export const getPublicSite = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<PublicSite | null> => {
    const supabase = await anonClient();
    const { data: row, error } = await supabase
      .from("sites")
      .select("slug, headline, tagline, about, services, cta, palette, template, business")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !row) return null;
    const r = row as Record<string, any>;
    return {
      slug: r.slug,
      headline: r.headline ?? "",
      tagline: r.tagline ?? "",
      about: r.about ?? "",
      services: Array.isArray(r.services) ? r.services : [],
      cta: r.cta ?? "Contact Us",
      template: r.template ?? "modern",
      palette: r.palette ?? { primary: "#CC0000", bg: "#FFF8F8" },
      business: r.business ?? {},
    };
  });

export const trackPreviewEvent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        slug: z.string().min(1),
        type: z.enum(["view", "cta_click"]),
        device: z.enum(["mobile", "desktop"]),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const supabase = await anonClient();
    const { data: row } = await supabase
      .from("sites")
      .select("id")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!row) return { ok: false };
    const { error } = await supabase.rpc("log_preview_event", {
      _site_id: (row as { id: string }).id,
      _type: data.type,
      _device: data.device,
    });
    return { ok: !error };
  });
