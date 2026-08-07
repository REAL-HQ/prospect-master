import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Shape of the full store snapshot exchanged with the server.
// Keep in sync with PmStoreSnapshot in src/lib/pm-store.ts
type Snapshot = {
  prospects: any[];
  sites: any[];
  previewEvents: any[];
  outreach: any[];
  payments: any[];
  savedSearches: any[];
  notifications: any[];
  filings: any[];
  activities: any[];
  automation: {
    autoFollowUp: boolean;
    defaultTags: string[];
    sitePrice: number;
    hostingFee: number;
  };
  firecrawlConfigured: boolean;
};

const toIso = (ms?: number) => (ms ? new Date(ms).toISOString() : null);
const fromIso = (s?: string | null) => (s ? new Date(s).getTime() : undefined);

export const pmLoadState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [
      prospectsRes,
      sitesRes,
      outreachRes,
      stepsRes,
      paymentsRes,
      searchesRes,
      notificationsRes,
      filingsRes,
      activitiesRes,
      settingsRes,
    ] = await Promise.all([
      supabase.from("prospects").select("*").eq("user_id", userId),
      supabase.from("sites").select("*").eq("user_id", userId),
      supabase.from("outreach").select("*").eq("user_id", userId),
      supabase.from("outreach_steps").select("*").eq("user_id", userId),
      supabase.from("payments").select("*").eq("user_id", userId),
      supabase.from("saved_searches").select("*").eq("user_id", userId),
      supabase.from("notifications").select("*").eq("user_id", userId),
      supabase.from("fresh_filings").select("*").eq("user_id", userId),
      supabase.from("activities").select("*").eq("user_id", userId),
      supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    const sites = sitesRes.data ?? [];
    const siteIds = sites.map((s) => s.id);
    const previewEventsRes = siteIds.length
      ? await supabase.from("preview_events").select("*").in("site_id", siteIds)
      : { data: [] as any[] };

    const stepsByOutreach: Record<string, any[]> = {};
    for (const st of stepsRes.data ?? []) {
      (stepsByOutreach[st.outreach_id] ||= []).push(st);
    }

    const snapshot: Snapshot = {
      prospects: (prospectsRes.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category ?? "",
        city: p.city ?? "",
        state: p.state ?? "",
        country: p.country,
        phone: p.phone ?? "",
        address: p.address ?? "",
        rating: Number(p.rating),
        reviews: p.reviews,
        hasWebsite: p.has_website,
        score: Number(p.score),
        tier: p.tier,
        status: p.status,
        notes: p.notes,
        createdAt: new Date(p.created_at).getTime(),
        lastActivityAt: new Date(p.last_activity_at).getTime(),
        siteId: p.site_id ?? undefined,
        outreachId: p.outreach_id ?? undefined,
        verificationStatus: p.verification_status,
        foundUrl: p.found_url ?? undefined,
        verifiedAt: fromIso(p.verified_at),
        ghlContactId: p.ghl_contact_id ?? undefined,
        ghlPushedAt: fromIso(p.ghl_pushed_at),
      })),
      sites: sites.map((s: any) => ({
        id: s.id,
        prospectId: s.prospect_id ?? "",
        slug: s.slug,
        headline: s.headline ?? "",
        tagline: s.tagline ?? "",
        about: s.about ?? "",
        services: Array.isArray(s.services) ? s.services : [],
        cta: s.cta ?? "",
        palette: (s.palette as any) ?? { primary: "#CC0000", bg: "#FFF8F8" },
        template: s.template ?? "modern",
        business: (s.business as any) ?? {},
        published: s.published ?? true,
        deployedDomain: s.deployed_domain ?? undefined,
        createdAt: new Date(s.created_at).getTime(),
      })),

      previewEvents: (previewEventsRes.data ?? []).map((e) => ({
        id: e.id,
        siteId: e.site_id,
        type: e.type,
        device: e.device,
        at: new Date(e.at).getTime(),
      })),
      outreach: (outreachRes.data ?? []).map((o) => ({
        id: o.id,
        prospectId: o.prospect_id,
        siteId: o.site_id ?? undefined,
        createdAt: new Date(o.created_at).getTime(),
        steps: (stepsByOutreach[o.id] ?? [])
          .sort((a, b) => a.day - b.day)
          .map((st) => ({
            channel: st.channel,
            day: st.day,
            subject: st.subject ?? undefined,
            body: st.body,
            sent: st.sent,
            sentAt: fromIso(st.sent_at),
            openedAt: fromIso(st.opened_at),
          })),
      })),
      payments: (paymentsRes.data ?? []).map((p) => ({
        id: p.id,
        prospectId: p.prospect_id,
        amount: Number(p.amount),
        type: p.type,
        paidAt: new Date(p.paid_at).getTime(),
      })),
      savedSearches: (searchesRes.data ?? []).map((s) => ({
        id: s.id,
        query: s.query,
        category: s.category ?? "",
        location: s.location ?? "",
        createdAt: new Date(s.created_at).getTime(),
      })),
      notifications: (notificationsRes.data ?? []).map((n) => ({
        id: n.id,
        text: n.text,
        at: new Date(n.at).getTime(),
        read: n.read,
      })),
      filings: (filingsRes.data ?? []).map((f) => ({
        id: f.id,
        businessName: f.business_name,
        entityNumber: f.entity_number ?? undefined,
        filingDate: f.filing_date ?? "",
        city: f.city ?? "",
        zip: f.zip ?? undefined,
        registeredAgent: f.registered_agent ?? undefined,
        webPresence: f.web_presence,
        status: f.status,
        leadId: f.lead_id ?? undefined,
        raw: (f.raw as any) ?? undefined,
        createdAt: new Date(f.created_at).getTime(),
      })),
      activities: (activitiesRes.data ?? []).map((a: any) => ({
        id: a.id,
        prospectId: a.prospect_id ?? undefined,
        type: a.type,
        text: a.text,
        at: new Date(a.at).getTime(),
      })),
      automation: {
        autoFollowUp: settingsRes.data?.auto_follow_up ?? true,
        defaultTags: (settingsRes.data?.default_tags as any) ?? ["no-website", "prospectmaster"],
        sitePrice: Number(settingsRes.data?.default_site_price ?? 1000),
        hostingFee: Number(settingsRes.data?.default_hosting_fee ?? 99),
      },
      firecrawlConfigured: settingsRes.data?.firecrawl_configured ?? false,
    };

    return snapshot;
  });

export const pmSaveState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: Snapshot) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Wipe existing rows (child tables first for FK safety).
    // Sites are upserted (not wiped) so real visitor analytics in
    // preview_events survive every sync.
    const keepSiteIds = new Set<string>((data.sites ?? []).map((s: any) => s.id));
    const existingSites = await supabase.from("sites").select("id").eq("user_id", userId);
    const staleSiteIds = (existingSites.data ?? []).map((s) => s.id).filter((id) => !keepSiteIds.has(id));
    await Promise.all([
      supabase.from("outreach_steps").delete().eq("user_id", userId),
      supabase.from("payments").delete().eq("user_id", userId),
      supabase.from("notifications").delete().eq("user_id", userId),
      supabase.from("saved_searches").delete().eq("user_id", userId),
      supabase.from("fresh_filings").delete().eq("user_id", userId),
    ]);
    await supabase.from("outreach").delete().eq("user_id", userId);
    // prospects references sites via site_id and vice versa — null both sides before delete
    await supabase.from("prospects").update({ site_id: null, outreach_id: null }).eq("user_id", userId);
    await supabase.from("sites").update({ prospect_id: null }).eq("user_id", userId);
    await supabase.from("prospects").delete().eq("user_id", userId);

    if (staleSiteIds.length) {
      await supabase.from("preview_events").delete().in("site_id", staleSiteIds);
      await supabase.from("sites").delete().in("id", staleSiteIds).eq("user_id", userId);
    }


    // Insert fresh
    if (data.prospects.length) {
      await supabase.from("prospects").insert(
        data.prospects.map((p: any) => ({
          id: p.id,
          user_id: userId,
          name: p.name,
          category: p.category || null,
          city: p.city || null,
          state: p.state || null,
          country: p.country || "USA",
          phone: p.phone || null,
          address: p.address || null,
          rating: p.rating ?? 0,
          reviews: p.reviews ?? 0,
          has_website: !!p.hasWebsite,
          score: p.score ?? 5,
          tier: p.tier ?? "COLD",
          status: p.status ?? "New",
          notes: p.notes ?? "",
          verification_status: p.verificationStatus ?? "unverified",
          found_url: p.foundUrl ?? null,
          verified_at: toIso(p.verifiedAt),
          ghl_contact_id: p.ghlContactId ?? null,
          ghl_pushed_at: toIso(p.ghlPushedAt),
          created_at: toIso(p.createdAt) ?? new Date().toISOString(),
          last_activity_at: toIso(p.lastActivityAt) ?? new Date().toISOString(),
        })),
      );
    }
    if (data.sites.length) {
      const { error: sitesError } = await supabase.from("sites").upsert(
        data.sites.map((s: any) => ({
          id: s.id,
          user_id: userId,
          prospect_id: s.prospectId || null,
          slug: s.slug,
          headline: s.headline || null,
          tagline: s.tagline || null,
          about: s.about || null,
          cta: s.cta || null,
          services: s.services ?? [],
          palette: s.palette ?? { primary: "#CC0000", bg: "#FFF8F8" },
          template: s.template ?? "modern",
          business: s.business ?? {},
          published: s.published ?? true,
          deployed_domain: s.deployedDomain ?? null,

          created_at: toIso(s.createdAt) ?? new Date().toISOString(),
        })),
        { onConflict: "id" },
      );
      if (sitesError) throw new Error(`Failed to save sites: ${sitesError.message}`);
    }

    // Backfill site_id/outreach_id on prospects
    for (const p of data.prospects) {
      if (p.siteId || p.outreachId) {
        await supabase
          .from("prospects")
          .update({ site_id: p.siteId ?? null, outreach_id: p.outreachId ?? null })
          .eq("id", p.id)
          .eq("user_id", userId);
      }
    }
    if (data.outreach.length) {
      await supabase.from("outreach").insert(
        data.outreach.map((o: any) => ({
          id: o.id,
          user_id: userId,
          prospect_id: o.prospectId,
          site_id: o.siteId ?? null,
          created_at: toIso(o.createdAt) ?? new Date().toISOString(),
        })),
      );
      const steps = data.outreach.flatMap((o: any) =>
        (o.steps ?? []).map((st: any) => ({
          user_id: userId,
          outreach_id: o.id,
          channel: st.channel,
          day: st.day,
          subject: st.subject ?? null,
          body: st.body,
          sent: !!st.sent,
          sent_at: toIso(st.sentAt),
          opened_at: toIso(st.openedAt),
        })),
      );
      if (steps.length) await supabase.from("outreach_steps").insert(steps);
    }
    if (data.previewEvents.length) {
      await supabase.from("preview_events").insert(
        data.previewEvents.map((e: any) => ({
          id: e.id,
          site_id: e.siteId,
          type: e.type,
          device: e.device,
          at: toIso(e.at) ?? new Date().toISOString(),
        })),
      );
    }
    if (data.payments.length) {
      await supabase.from("payments").insert(
        data.payments.map((p: any) => ({
          id: p.id,
          user_id: userId,
          prospect_id: p.prospectId,
          amount: p.amount,
          type: p.type,
          paid_at: toIso(p.paidAt) ?? new Date().toISOString(),
        })),
      );
    }
    if (data.savedSearches.length) {
      await supabase.from("saved_searches").insert(
        data.savedSearches.map((s: any) => ({
          id: s.id,
          user_id: userId,
          query: s.query,
          category: s.category || null,
          location: s.location || null,
          created_at: toIso(s.createdAt) ?? new Date().toISOString(),
        })),
      );
    }
    if (data.notifications.length) {
      await supabase.from("notifications").insert(
        data.notifications.map((n: any) => ({
          id: n.id,
          user_id: userId,
          text: n.text,
          read: !!n.read,
          at: toIso(n.at) ?? new Date().toISOString(),
        })),
      );
    }
    if (data.filings.length) {
      await supabase.from("fresh_filings").insert(
        data.filings.map((f: any) => ({
          id: f.id,
          user_id: userId,
          business_name: f.businessName,
          entity_number: f.entityNumber ?? null,
          filing_date: f.filingDate || null,
          city: f.city || null,
          zip: f.zip ?? null,
          registered_agent: f.registeredAgent ?? null,
          web_presence: f.webPresence ?? "unknown",
          status: f.status ?? "new",
          lead_id: f.leadId ?? null,
          raw: f.raw ?? null,
          created_at: toIso(f.createdAt) ?? new Date().toISOString(),
        })),
      );
    }

    if (data.activities?.length) {
      await supabase.from("activities").insert(
        data.activities.map((a: any) => ({
          id: a.id,
          user_id: userId,
          prospect_id: a.prospectId ?? null,
          type: a.type ?? "note",
          text: a.text,
          at: toIso(a.at) ?? new Date().toISOString(),
        })),
      );
    }

    await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        auto_follow_up: data.automation?.autoFollowUp ?? true,
        default_tags: data.automation?.defaultTags ?? [],
        default_site_price: data.automation?.sitePrice ?? 1000,
        default_hosting_fee: data.automation?.hostingFee ?? 99,
        firecrawl_configured: data.firecrawlConfigured,
        updated_at: new Date().toISOString(),
      },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    return { ok: true };
  });
