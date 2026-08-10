import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type VerifyItem = { id: string; name: string; city?: string; state?: string; phone?: string };

export const verifyBusinesses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { items: VerifyItem[] }) => ({
    items: (data?.items ?? []).slice(0, 25).filter((i) => i && i.id && i.name),
  }))
  .handler(async ({ data }) => {
    const { verifyBusiness } = await import("./verify.server");
    const results = await Promise.all(
      data.items.map(async (item) => {
        try {
          const r = await verifyBusiness(item);
          return { id: item.id, ...r, error: null as string | null };
        } catch (e) {
          return {
            id: item.id,
            verdict: "no_website" as const,
            foundUrl: undefined,
            confidence: 0,
            signals: [],
            error: e instanceof Error ? e.message : "check failed",
          };
        }
      }),
    );
    return { results };
  });
