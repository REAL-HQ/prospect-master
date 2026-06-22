import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadTier = "HOT" | "WARM" | "COLD";
export type DealStatus = "New" | "Contacted" | "Interested" | "Closed" | "Lost";

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

type State = {
  prospects: Prospect[];
  sites: Site[];
  previewEvents: PreviewEvent[];
  outreach: Outreach[];
  payments: Payment[];
  savedSearches: { id: string; query: string; category: string; location: string; createdAt: number }[];
  notifications: { id: string; text: string; at: number; read: boolean }[];
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
};

const uid = () => Math.random().toString(36).slice(2, 10);

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
  const hasWebsite = Math.random() < 0.25; // 75% no-website (filtered later)
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
  };
}

const DEMO_CATEGORIES = ["Dentists","Restaurants","Plumbers"];
const DEMO_LOCATIONS = ["Austin, TX","Denver, CO","Miami, FL"];

function seedProspects(): Prospect[] {
  const list: Prospect[] = [];
  for (let i = 0; i < 12; i++) {
    const p = generateProspect(DEMO_CATEGORIES[i % 3], DEMO_LOCATIONS[i % 3]);
    if (p.hasWebsite) p.hasWebsite = false; // demo: ensure no-website
    p.score = score(p.rating, p.reviews, false);
    p.tier = tierOf(p.score);
    list.push(p);
  }
  return list;
}

export const usePmStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      prospects: [],
      sites: [],
      previewEvents: [],
      outreach: [],
      payments: [],
      savedSearches: [],
      notifications: [],

      runSearch: ({ category, location, count = 8 }) => {
        const created: Prospect[] = [];
        for (let i = 0; i < count; i++) {
          const p = generateProspect(category, location);
          if (p.hasWebsite) continue; // we only surface no-website
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
        const slug = prospect.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const site: Site = {
          id: uid(),
          prospectId,
          slug,
          headline: copy.headline || `${prospect.name}`,
          tagline: copy.tagline || `${prospect.category} in ${prospect.city}, ${prospect.state}`,
          about: copy.about || `${prospect.name} serves the ${prospect.city} community with trusted ${prospect.category.toLowerCase()} services.`,
          services: copy.services || ["Quality service", "Trusted professionals", "Local expertise"],
          cta: copy.cta || "Get in touch",
          palette: copy.palette || { primary: "#CC0000", bg: "#FFF8F8" },
          createdAt: Date.now(),
        };
        set((s) => ({ sites: [site, ...s.sites] }));
        get().updateProspect(prospectId, { siteId: site.id });
        get().pushNotification(`Built demo site for ${prospect.name}`);
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
        const steps: OutreachStep[] = [
          {
            channel: "email",
            day: 1,
            subject: `Quick site I built for ${prospect.name}`,
            body: `Hi ${prospect.name} team,\n\nI noticed ${prospect.name} doesn't have a website yet — so I built you a free preview. Most ${cat} miss 60–80% of online leads without one.\n\nTake a look (30 seconds): preview.prospectmaster.com/${prospect.name.toLowerCase().replace(/\s+/g, "-")}\n\nIf you like it, I can deploy it to your domain today. No design fees.\n\n— Sent via ProspectMaster`,
            sent: false,
          },
          {
            channel: "email",
            day: 3,
            subject: `Re: site for ${prospect.name}`,
            body: `Just checking in — did you get a chance to look at the preview? Happy to tweak anything. Most of my ${cat} clients see new bookings within 2 weeks of going live.`,
            sent: false,
          },
          {
            channel: "sms",
            day: 7,
            body: `Hi — sent over a free website preview for ${prospect.name} last week. Want me to take it down or push it live? Reply STOP to opt out.`,
            sent: false,
          },
        ];
        const o: Outreach = { id: uid(), prospectId, siteId, steps, createdAt: Date.now() };
        set((s) => ({ outreach: [o, ...s.outreach] }));
        get().updateProspect(prospectId, { outreachId: o.id, status: "Contacted" });
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
        if (p) get().pushNotification(`Sent outreach step to ${p.name}`);
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

      resetAll: () => set({ prospects: [], sites: [], previewEvents: [], outreach: [], payments: [], savedSearches: [], notifications: [] }),

      seedDemo: () => {
        const prospects = seedProspects();
        set({
          prospects,
          sites: [],
          previewEvents: [],
          outreach: [],
          payments: [],
          savedSearches: [
            { id: uid(), query: "dentists austin", category: "Dentists", location: "Austin, TX", createdAt: Date.now() - 86400000 },
          ],
          notifications: [
            { id: uid(), text: "Welcome! Demo data loaded. Try a search.", at: Date.now(), read: false },
          ],
        });
      },
    }),
    { name: "pm-store-v1" },
  ),
);
