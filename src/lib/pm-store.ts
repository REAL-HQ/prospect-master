import { create } from "zustand";
import { pmLoadState, pmSaveState } from "./pm.functions";
import { verifyBusinesses } from "./verify.functions";
import { themeFor } from "./site-templates";


export type LeadTier = "HOT" | "WARM" | "COLD";
export type DealStatus = "New" | "Contacted" | "Interested" | "Closed" | "Lost";
export type VerificationStatus = "unverified" | "verified_no_site" | "unlinked_site";
export type WebPresence = "unknown" | "no_website" | "social_only" | "has_website";
export type FilingStatus = "new" | "checked" | "converted" | "skipped";

export type Prospect = {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  address: string;
  rating: number;
  reviews: number;
  hasWebsite: boolean;
  score: number; // 1-10
  tier: LeadTier;
  status: DealStatus;
  notes: string;
  createdAt: number;
  lastActivityAt: number;
  siteId?: string;
  outreachId?: string;
  // Phase 2: verification
  verificationStatus: VerificationStatus;
  foundUrl?: string;
  verifiedAt?: number;
  verificationConfidence?: number;
  verificationSignals?: { label: string; detail?: string; weight: number }[];

  // Native CRM
  tags: string[];
};

export type SiteBusinessInfo = {
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

export type Site = {
  id: string;
  prospectId: string;
  slug: string;
  headline: string;
  tagline: string;
  about: string;
  services: string[];
  cta: string;
  palette: { primary: string; bg: string };
  template: string;
  business: SiteBusinessInfo;
  published: boolean;
  deployedDomain?: string;
  createdAt: number;
};


export type PreviewEvent = {
  id: string;
  siteId: string;
  type: "view" | "cta_click";
  device: "mobile" | "desktop";
  at: number;
};

export type OutreachStep = {
  channel: "email" | "sms";
  day: number;
  subject?: string;
  body: string;
  sent: boolean;
  sentAt?: number;
  openedAt?: number;
  scheduledFor?: number;
  autoSent?: boolean;
};

export type Outreach = {
  id: string;
  prospectId: string;
  siteId?: string;
  steps: OutreachStep[];
  createdAt: number;
};

export type Payment = {
  id: string;
  prospectId: string;
  amount: number;
  type: "upfront" | "hosting";
  paidAt: number;
};

export type FreshFiling = {
  id: string;
  businessName: string;
  entityNumber?: string;
  filingDate: string; // ISO date
  city: string;
  zip?: string;
  registeredAgent?: string;
  webPresence: WebPresence;
  status: FilingStatus;
  leadId?: string;
  raw?: Record<string, string>;
  createdAt: number;
};

export type ActivityType = "note" | "tag" | "outreach" | "status" | "payment" | "system";

export type Activity = {
  id: string;
  prospectId?: string;
  type: ActivityType;
  text: string;
  at: number;
};

export type AutomationSettings = {
  autoFollowUp: boolean;
  defaultTags: string[];
  sitePrice: number;
  hostingFee: number;
};

export const DEFAULT_AUTOMATION: AutomationSettings = {
  autoFollowUp: true,
  defaultTags: ["no-website", "prospectmaster"],
  sitePrice: 1000,
  hostingFee: 99,
};

type State = {
  prospects: Prospect[];
  sites: Site[];
  previewEvents: PreviewEvent[];
  outreach: Outreach[];
  payments: Payment[];
  savedSearches: { id: string; query: string; category: string; location: string; createdAt: number }[];
  notifications: { id: string; text: string; at: number; read: boolean }[];
  filings: FreshFiling[];
  activities: Activity[];
  automation: AutomationSettings;
  firecrawlConfigured: boolean;
};

type Actions = {
  runSearch: (params: { category: string; location: string; count?: number }) => Prospect[];
  updateProspect: (id: string, patch: Partial<Prospect>) => void;
  setStatus: (id: string, status: DealStatus) => void;
  generateSite: (prospectId: string, copy: Partial<Site>) => Site;
  simulatePreviewActivity: (siteId: string, n?: number) => void;
  createOutreach: (prospectId: string, siteId?: string) => Outreach;
  sendNextStep: (outreachId: string) => void;
  recordPayment: (prospectId: string, amount: number, type?: "upfront" | "hosting") => Payment;
  saveSearch: (query: string, category: string, location: string) => void;
  pushNotification: (text: string) => void;
  markAllRead: () => void;
  resetAll: () => void;
  seedDemo: () => void;
  // Phase 2
  verifyLeads: (ids: string[]) => Promise<{ verified_no_site: number; unlinked_site: number; errors: number }>;
  verifyNext: (limit?: number) => Promise<{ verified_no_site: number; unlinked_site: number; errors: number }>;
  importFilings: (rows: Array<Omit<FreshFiling, "id" | "webPresence" | "status" | "createdAt">>) => number;
  checkFilingPresence: (ids: string[]) => Promise<{ no_website: number; social_only: number; has_website: number }>;
  checkFilingNext: (limit?: number) => Promise<{ no_website: number; social_only: number; has_website: number }>;
  convertFilingsToLeads: (ids: string[]) => number;
  deleteFilings: (ids: string[]) => void;
  // Native CRM (replaces GoHighLevel)
  setAutomation: (patch: Partial<AutomationSettings>) => void;
  logActivity: (prospectId: string | undefined, text: string, type?: ActivityType) => void;
  addTags: (ids: string[], tags: string[]) => number;
  removeTag: (id: string, tag: string) => void;
  runDueSteps: () => number;
  setFirecrawlConfigured: (v: boolean) => void;
};


const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;

const FIRST_NAMES = [
  "Sunrise","Bluebird","Maple","Iron","Cobalt","Ember","Pine","Granite","Willow","Harbor","Copper","Silver","Crown","Anchor","Lone Star","Pioneer","Atlas","Lighthouse","Ridge","Bayside","Oakwood","Cedar","Ironclad","Riverstone","Goldleaf",
];
const SUFFIXES: Record<string, string[]> = {
  Restaurants: ["Bistro","Kitchen","Cafe","Grill","Tavern"],
  Dentists: ["Dental","Dental Co.","Family Dentistry","Smiles","Orthodontics"],
  Salons: ["Salon","Beauty Bar","Studio","Hair Lounge","Color Co."],
  Plumbers: ["Plumbing","Plumbing & Heating","Drains Co.","Pipe Works","Mechanical"],
  Gyms: ["Fitness","Strength Co.","CrossFit","Athletic Club","Studio"],
  Auto: ["Auto","Auto Repair","Garage","Motors","Tire & Lube"],
  Lawyers: ["Law Group","& Associates","Legal","Attorneys","Law Office"],
};
const CATS = Object.keys(SUFFIXES);

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function score(rating: number, reviews: number, hasWebsite: boolean) {
  let s = rating * 1.2 + Math.min(reviews / 30, 4);
  if (!hasWebsite) s += 2.5;
  return Math.max(1, Math.min(10, Math.round(s * 10) / 10));
}
function tierOf(s: number): LeadTier {
  if (s >= 7.5) return "HOT";
  if (s >= 5) return "WARM";
  return "COLD";
}

function generateProspect(category: string, location: string): Prospect {
  const cat = CATS.includes(category) ? category : pick(CATS);
  const suffix = pick(SUFFIXES[cat]);
  const first = pick(FIRST_NAMES);
  const rating = +(3.5 + Math.random() * 1.5).toFixed(1);
  const reviews = Math.floor(20 + Math.random() * 400);
  const hasWebsite = Math.random() < 0.25;
  const [city, state] = location.includes(",") ? location.split(",").map((s) => s.trim()) : [location, "TX"];
  const s = score(rating, reviews, hasWebsite);
  const now = Date.now();
  return {
    id: uid(),
    name: `${first} ${suffix}`,
    category: cat,
    city: city || "Austin",
    state: state || "TX",
    country: "USA",
    phone: `(${Math.floor(200 + Math.random() * 700)}) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 8999)}`,
    address: `${Math.floor(100 + Math.random() * 9000)} ${pick(["Main","Oak","Elm","Cedar","Maple","Pine"])} St`,
    rating,
    reviews,
    hasWebsite,
    score: s,
    tier: tierOf(s),
    status: "New",
    notes: "",
    createdAt: now,
    lastActivityAt: now,
    verificationStatus: "unverified",
    tags: hasWebsite ? [] : ["no-website"],
  };
}

const DEMO_CATEGORIES = ["Dentists","Restaurants","Plumbers"];
const DEMO_LOCATIONS = ["Austin, TX","Denver, CO","Miami, FL"];

function seedProspects(): Prospect[] {
  const list: Prospect[] = [];
  for (let i = 0; i < 12; i++) {
    const p = generateProspect(DEMO_CATEGORIES[i % 3], DEMO_LOCATIONS[i % 3]);
    if (p.hasWebsite) p.hasWebsite = false;
    p.score = score(p.rating, p.reviews, false);
    p.tier = tierOf(p.score);
    list.push(p);
  }
  return list;
}

function seedFilings(): FreshFiling[] {
  const cities = ["Austin","Denver","Miami","Dallas","Tampa"];
  const agents = ["John Carter","Emily Chen","Marcus Reed","Priya Patel","David Kim"];
  const names = [
    "Bright Path Wellness LLC","Stonebridge Coffee Co","Aurora Roofing Solutions","Nine Pines Pediatrics PLLC",
    "Cobble & Co Bakery","Westwind HVAC Services","Magnolia Pet Grooming","Velocity Auto Detail","Harborlight Counseling Group",
  ];
  return names.map((n, i) => ({
    id: uid(),
    businessName: n,
    entityNumber: `TX-${20260000 + i}`,
    filingDate: new Date(Date.now() - (i + 1) * 86400000).toISOString().slice(0, 10),
    city: cities[i % cities.length],
    zip: `${78700 + i}`,
    registeredAgent: agents[i % agents.length],
    webPresence: "unknown" as WebPresence,
    status: "new" as FilingStatus,
    createdAt: Date.now() - i * 3600000,
  }));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Snapshot = Pick<
  State,
  | "prospects"
  | "sites"
  | "previewEvents"
  | "outreach"
  | "payments"
  | "savedSearches"
  | "notifications"
  | "filings"
  | "activities"
  | "automation"
  | "firecrawlConfigured"
>;

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncPaused = false;
function scheduleSync(getState: () => State & Actions) {
  if (syncPaused) return;
  if (typeof window === "undefined") return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const s = getState();
    const snap: Snapshot = {
      prospects: s.prospects,
      sites: s.sites,
      previewEvents: s.previewEvents,
      outreach: s.outreach,
      payments: s.payments,
      savedSearches: s.savedSearches,
      notifications: s.notifications,
      filings: s.filings,
      activities: s.activities,
      automation: s.automation,
      firecrawlConfigured: s.firecrawlConfigured,
    };
    pmSaveState({ data: snap as never }).catch((err) => console.error("[pm sync]", err));
  }, 800);
}

export const usePmStore = create<State & Actions & {
  hydrate: () => Promise<void>;
  hydrated: boolean;
}>()(
    (set, get) => ({
      hydrated: false,
      hydrate: async () => {
        try {
          const snap = await pmLoadState();
          syncPaused = true;
          set({
            prospects: (snap as any).prospects ?? [],
            sites: (snap as any).sites ?? [],
            previewEvents: (snap as any).previewEvents ?? [],
            outreach: (snap as any).outreach ?? [],
            payments: (snap as any).payments ?? [],
            savedSearches: (snap as any).savedSearches ?? [],
            notifications: (snap as any).notifications ?? [],
            filings: (snap as any).filings ?? [],
            activities: (snap as any).activities ?? [],
            automation: { ...DEFAULT_AUTOMATION, ...((snap as any).automation ?? {}) },
            firecrawlConfigured: !!(snap as any).firecrawlConfigured,
            hydrated: true,
          });
          syncPaused = false;
        } catch (err) {
          console.error("[pm hydrate]", err);
          set({ hydrated: true });
        }
      },
      prospects: [],
      sites: [],
      previewEvents: [],
      outreach: [],
      payments: [],
      savedSearches: [],
      notifications: [],
      filings: [],
      activities: [],
      automation: DEFAULT_AUTOMATION,
      firecrawlConfigured: false,

      runSearch: ({ category, location, count = 8 }) => {
        const created: Prospect[] = [];
        for (let i = 0; i < count; i++) {
          const p = generateProspect(category, location);
          if (p.hasWebsite) continue;
          created.push(p);
        }
        set((s) => ({ prospects: [...created, ...s.prospects] }));
        get().pushNotification(`Found ${created.length} no-website leads in ${location}`);
        created.filter((p) => p.tier === "HOT").forEach((p) => get().pushNotification(`🔥 HOT lead: ${p.name} · score ${p.score}`));
        return created;
      },

      updateProspect: (id, patch) => set((s) => ({
        prospects: s.prospects.map((p) => p.id === id ? { ...p, ...patch, lastActivityAt: Date.now() } : p),
      })),

      setStatus: (id, status) => set((s) => ({
        prospects: s.prospects.map((p) => p.id === id ? { ...p, status, lastActivityAt: Date.now() } : p),
      })),

      generateSite: (prospectId, copy) => {
        const prospect = get().prospects.find((p) => p.id === prospectId);
        if (!prospect) throw new Error("Prospect not found");
        const base = prospect.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const cityPart = prospect.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        // Slugs are globally unique in the database, so always add a short suffix.
        const slug = [base, cityPart, Math.random().toString(36).slice(2, 7)].filter(Boolean).join("-");

        const theme = themeFor(prospect.category);
        const site: Site = {
          id: uid(),
          prospectId,
          slug,
          headline: copy.headline || `${prospect.name}`,
          tagline: copy.tagline || `${prospect.category} in ${prospect.city}, ${prospect.state}`,
          about: copy.about || `${prospect.name} serves the ${prospect.city} community with trusted ${prospect.category.toLowerCase()} services.`,
          services: copy.services || ["Quality service", "Trusted professionals", "Local expertise"],
          cta: copy.cta || "Get In Touch",
          palette: copy.palette || theme.palette,
          template: copy.template || theme.template,
          published: true,
          business: {
            name: prospect.name,
            category: prospect.category,
            city: prospect.city,
            state: prospect.state,
            phone: prospect.phone,
            address: prospect.address,
            heroKey: theme.heroKey,
            ...(copy.business ?? {}),
          },
          createdAt: Date.now(),
        };
        set((s) => ({ sites: [site, ...s.sites] }));
        get().updateProspect(prospectId, { siteId: site.id });
        get().pushNotification(`Built live site for ${prospect.name}`);
        return site;

      },

      simulatePreviewActivity: (siteId, n = 1) => {
        const events: PreviewEvent[] = Array.from({ length: n }, () => ({
          id: uid(),
          siteId,
          type: Math.random() > 0.7 ? "cta_click" : "view",
          device: Math.random() > 0.5 ? "mobile" : "desktop",
          at: Date.now() - Math.floor(Math.random() * 3600000),
        }));
        set((s) => ({ previewEvents: [...events, ...s.previewEvents] }));
        const site = get().sites.find((s) => s.id === siteId);
        if (site) get().pushNotification(`👁 Preview opened: ${site.slug}`);
      },

      createOutreach: (prospectId, siteId) => {
        const prospect = get().prospects.find((p) => p.id === prospectId);
        if (!prospect) throw new Error("Prospect not found");
        const cat = prospect.category.toLowerCase();
        const now = Date.now();
        const at = (day: number) => now + (day - 1) * 86400000;
        const steps: OutreachStep[] = [
          {
            channel: "email", day: 1,
            subject: `Quick site I built for ${prospect.name}`,
            body: `Hi ${prospect.name} team,\n\nI noticed ${prospect.name} doesn't have a website yet — so I built you a free preview. Most ${cat} miss 60–80% of online leads without one.\n\nTake a look (30 seconds): preview.prospectmaster.com/${prospect.name.toLowerCase().replace(/\s+/g, "-")}\n\nIf you like it, I can deploy it to your domain today. No design fees.\n\n— Sent via ProspectMaster`,
            sent: false,
            scheduledFor: at(1),
          },
          { channel: "email", day: 3, subject: `Re: site for ${prospect.name}`, body: `Just checking in — did you get a chance to look at the preview? Happy to tweak anything. Most of my ${cat} clients see new bookings within 2 weeks of going live.`, sent: false, scheduledFor: at(3) },
          { channel: "sms", day: 7, body: `Hi — sent over a free website preview for ${prospect.name} last week. Want me to take it down or push it live? Reply STOP to opt out.`, sent: false, scheduledFor: at(7) },
        ];
        const o: Outreach = { id: uid(), prospectId, siteId, steps, createdAt: now };
        set((s) => ({ outreach: [o, ...s.outreach] }));
        get().updateProspect(prospectId, { outreachId: o.id, status: "Contacted" });
        get().addTags([prospectId], get().automation.defaultTags);
        get().logActivity(prospectId, `Sequence launched — 3 steps scheduled (day 1, 3, 7)`, "outreach");
        return o;
      },

      sendNextStep: (outreachId) => {
        set((s) => ({
          outreach: s.outreach.map((o) => {
            if (o.id !== outreachId) return o;
            const idx = o.steps.findIndex((st) => !st.sent);
            if (idx < 0) return o;
            const steps = o.steps.map((st, i) => i === idx ? { ...st, sent: true, sentAt: Date.now(), openedAt: Math.random() > 0.5 ? Date.now() + 60000 : undefined } : st);
            return { ...o, steps };
          }),
        }));
        const o = get().outreach.find((x) => x.id === outreachId);
        const p = o && get().prospects.find((pr) => pr.id === o.prospectId);
        if (p) {
          get().pushNotification(`Sent outreach step to ${p.name}`);
          get().logActivity(p.id, `Manual send to ${p.name}`, "outreach");
        }
      },


      recordPayment: (prospectId, amount, type = "upfront") => {
        const payment: Payment = { id: uid(), prospectId, amount, type, paidAt: Date.now() };
        set((s) => ({ payments: [payment, ...s.payments] }));
        get().setStatus(prospectId, "Closed");
        const p = get().prospects.find((pr) => pr.id === prospectId);
        if (p) get().pushNotification(`💰 Closed ${p.name} for $${amount.toLocaleString()}`);
        return payment;
      },

      saveSearch: (query, category, location) => set((s) => ({
        savedSearches: [{ id: uid(), query, category, location, createdAt: Date.now() }, ...s.savedSearches],
      })),

      pushNotification: (text) => set((s) => ({
        notifications: [{ id: uid(), text, at: Date.now(), read: false }, ...s.notifications].slice(0, 30),
      })),

      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      resetAll: () => set({ prospects: [], sites: [], previewEvents: [], outreach: [], payments: [], savedSearches: [], notifications: [], filings: [], activities: [], automation: DEFAULT_AUTOMATION }),

      seedDemo: () => {
        const prospects = seedProspects();
        set({
          prospects,
          sites: [], previewEvents: [], outreach: [], payments: [],
          savedSearches: [
            { id: uid(), query: "dentists austin", category: "Dentists", location: "Austin, TX", createdAt: Date.now() - 86400000 },
          ],
          notifications: [{ id: uid(), text: "Welcome! Demo data loaded. Try a search.", at: Date.now(), read: false }],
          filings: seedFilings(),
          activities: [],
          automation: DEFAULT_AUTOMATION,
        });
      },

      // ============ Phase 2: Verification ============

      verifyLeads: async (ids) => {
        const capped = ids.slice(0, 25);
        const items = get()
          .prospects.filter((p) => capped.includes(p.id))
          .map((p) => ({ id: p.id, name: p.name, city: p.city, state: p.state, phone: p.phone }));
        if (!items.length) return { verified_no_site: 0, unlinked_site: 0, errors: 0 };

        let verified_no_site = 0, unlinked_site = 0, errors = 0;
        let results: Awaited<ReturnType<typeof verifyBusinesses>>["results"] = [];
        try {
          results = (await verifyBusinesses({ data: { items } })).results;
        } catch {
          get().pushNotification("Verification failed — could not reach the checker");
          return { verified_no_site: 0, unlinked_site: 0, errors: items.length };
        }

        for (const r of results) {
          if (r.error) { errors++; continue; }
          const hasSite = r.verdict === "has_website";
          if (hasSite) unlinked_site++; else verified_no_site++;
          set((s) => ({
            prospects: s.prospects.map((p) => {
              if (p.id !== r.id) return p;
              const newScore = hasSite ? Math.max(p.score - 2, 1) : Math.min(p.score + 1, 10);
              const tags = hasSite
                ? p.tags.filter((t) => t !== "no-website")
                : p.tags.includes("no-website") ? p.tags : [...p.tags, "no-website"];
              return {
                ...p,
                verificationStatus: hasSite ? "unlinked_site" : "verified_no_site",
                hasWebsite: hasSite,
                foundUrl: r.foundUrl,
                verifiedAt: Date.now(),
                verificationConfidence: r.confidence,
                verificationSignals: r.signals,
                score: +newScore.toFixed(1),
                tier: tierOf(newScore),
                tags,
              };
            }),
          }));
          get().logActivity(
            r.id,
            hasSite
              ? `Verification: existing site found at ${r.foundUrl} (${r.confidence}% confidence)`
              : `Verification: no website found (${r.confidence}% confidence)${r.verdict === "social_only" ? " · social profile only" : ""}`,
            "note",
          );
        }
        get().pushNotification(`Verification: ${verified_no_site} confirmed no-site · ${unlinked_site} with a site · ${errors} errors`);
        return { verified_no_site, unlinked_site, errors };
      },

      verifyNext: async (limit = 25) => {
        const ids = get().prospects
          .filter((p) => p.verificationStatus === "unverified")
          .sort((a, b) => b.score - a.score)
          .slice(0, Math.min(limit, 25))
          .map((p) => p.id);
        return get().verifyLeads(ids);
      },


      // ============ Phase 2: Fresh Filings ============

      importFilings: (rows) => {
        const created: FreshFiling[] = rows.map((r) => ({
          id: uid(),
          businessName: r.businessName,
          entityNumber: r.entityNumber,
          filingDate: r.filingDate,
          city: r.city,
          zip: r.zip,
          registeredAgent: r.registeredAgent,
          raw: r.raw,
          webPresence: "unknown",
          status: "new",
          createdAt: Date.now(),
        }));
        set((s) => ({ filings: [...created, ...s.filings] }));
        get().pushNotification(`Imported ${created.length} fresh filings`);
        return created.length;
      },

      checkFilingPresence: async (ids) => {
        const capped = ids.slice(0, 25);
        const items = get()
          .filings.filter((f) => capped.includes(f.id))
          .map((f) => ({ id: f.id, name: f.businessName, city: f.city }));
        if (!items.length) return { no_website: 0, social_only: 0, has_website: 0 };

        let no_website = 0, social_only = 0, has_website = 0;
        let results: Awaited<ReturnType<typeof verifyBusinesses>>["results"] = [];
        try {
          results = (await verifyBusinesses({ data: { items } })).results;
        } catch {
          get().pushNotification("Web presence check failed — could not reach the checker");
          return { no_website: 0, social_only: 0, has_website: 0 };
        }

        for (const r of results) {
          const wp = r.verdict as WebPresence;
          set((s) => ({
            filings: s.filings.map((f) => (f.id === r.id ? { ...f, webPresence: wp, status: "checked" } : f)),
          }));
          if (wp === "no_website") no_website++; else if (wp === "social_only") social_only++; else has_website++;
        }
        get().pushNotification(`Checked ${results.length} filings: ${no_website} no-site · ${social_only} social-only · ${has_website} has site`);
        return { no_website, social_only, has_website };
      },


      checkFilingNext: async (limit = 25) => {
        const ids = get().filings
          .filter((f) => f.webPresence === "unknown")
          .slice(0, Math.min(limit, 50))
          .map((f) => f.id);
        return get().checkFilingPresence(ids);
      },

      convertFilingsToLeads: (ids) => {
        let count = 0;
        const filings = get().filings;
        const targets = filings.filter((f) => ids.includes(f.id) && f.status !== "converted");
        const newProspects: Prospect[] = [];
        targets.forEach((f) => {
          const hasWebsite = f.webPresence === "has_website";
          const rating = 0;
          const reviews = 0;
          let s = score(rating, reviews, hasWebsite);
          // Boost confirmed no_website by 1
          if (f.webPresence === "no_website") s = Math.min(s + 1, 10);
          const now = Date.now();
          const p: Prospect = {
            id: uid(),
            name: f.businessName,
            category: "Fresh Filing",
            city: f.city,
            state: "TX",
            country: "USA",
            phone: "",
            address: f.zip ? `ZIP ${f.zip}` : "",
            rating,
            reviews,
            hasWebsite,
            score: +s.toFixed(1),
            tier: tierOf(s),
            status: "New",
            notes: `Imported from Fresh Filing · Agent: ${f.registeredAgent || "—"} · Filed ${f.filingDate}`,
            createdAt: now,
            lastActivityAt: now,
            tags: ["fresh-filing", ...(f.webPresence === "no_website" ? ["no-website"] : [])],
            verificationStatus: f.webPresence === "no_website" ? "verified_no_site" : f.webPresence === "has_website" ? "unlinked_site" : "unverified",
          };
          newProspects.push(p);
          count++;
          set((st) => ({
            filings: st.filings.map((x) => x.id === f.id ? { ...x, status: "converted", leadId: p.id } : x),
          }));
        });
        if (newProspects.length) set((st) => ({ prospects: [...newProspects, ...st.prospects] }));
        get().pushNotification(`Converted ${count} filings into leads`);
        return count;
      },

      deleteFilings: (ids) => set((s) => ({ filings: s.filings.filter((f) => !ids.includes(f.id)) })),

      // ============ Native CRM (replaces GHL) ============

      setAutomation: (patch) => set((s) => ({ automation: { ...s.automation, ...patch } })),

      logActivity: (prospectId, text, type = "note") => {
        const a: Activity = { id: uid(), prospectId, type, text, at: Date.now() };
        set((s) => ({ activities: [a, ...s.activities].slice(0, 500) }));
        if (prospectId) {
          set((s) => ({
            prospects: s.prospects.map((p) => p.id === prospectId ? { ...p, lastActivityAt: Date.now() } : p),
          }));
        }
      },

      addTags: (ids, tags) => {
        const clean = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
        if (!clean.length) return 0;
        let n = 0;
        set((s) => ({
          prospects: s.prospects.map((p) => {
            if (!ids.includes(p.id)) return p;
            n++;
            const merged = Array.from(new Set([...(p.tags ?? []), ...clean]));
            return { ...p, tags: merged, lastActivityAt: Date.now() };
          }),
        }));
        ids.forEach((id) => get().logActivity(id, `Tagged: ${clean.join(", ")}`, "tag"));
        get().pushNotification(`Tagged ${n} lead${n === 1 ? "" : "s"} with ${clean.join(", ")}`);
        return n;
      },

      removeTag: (id, tag) => set((s) => ({
        prospects: s.prospects.map((p) => p.id === id ? { ...p, tags: (p.tags ?? []).filter((t) => t !== tag) } : p),
      })),

      runDueSteps: () => {
        const { automation, outreach } = get();
        if (!automation.autoFollowUp) return 0;
        const now = Date.now();
        let sent = 0;
        const touched: { prospectId: string; day: number; channel: string }[] = [];
        const next = outreach.map((o) => {
          const idx = o.steps.findIndex((st) => !st.sent);
          if (idx < 0) return o;
          const step = o.steps[idx];
          const due = step.scheduledFor ?? o.createdAt + step.day * 86400000;
          if (due > now) return o;
          sent++;
          touched.push({ prospectId: o.prospectId, day: step.day, channel: step.channel });
          const steps = o.steps.map((st, i) => i === idx
            ? { ...st, sent: true, autoSent: true, sentAt: now, openedAt: Math.random() > 0.5 ? now + 60000 : undefined }
            : st);
          return { ...o, steps };
        });
        if (!sent) return 0;
        set({ outreach: next });
        touched.forEach((t) => {
          const p = get().prospects.find((x) => x.id === t.prospectId);
          get().logActivity(t.prospectId, `Auto-sent day ${t.day} ${t.channel}${p ? ` to ${p.name}` : ""}`, "outreach");
        });
        get().pushNotification(`Automation sent ${sent} scheduled message${sent === 1 ? "" : "s"}`);
        return sent;
      },


      setFirecrawlConfigured: (v) => set({ firecrawlConfigured: v }),
    }),
);

// Auto-sync to cloud on any state change (debounced).
if (typeof window !== "undefined") {
  usePmStore.subscribe((state, prev) => {
    if (!state.hydrated) return;
    // Only sync when data fields change (ignore transient hydration flag).
    const keys: (keyof Snapshot)[] = [
      "prospects","sites","previewEvents","outreach","payments",
      "savedSearches","notifications","filings","activities","automation","firecrawlConfigured",
    ];
    for (const k of keys) {
      if ((state as any)[k] !== (prev as any)[k]) {
        scheduleSync(() => usePmStore.getState());
        return;
      }
    }
  });
}
