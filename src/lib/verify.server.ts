// Real website-presence verification. No third-party API keys required:
// we probe likely domains directly over HTTP and score the evidence.

export type VerifySignal = { label: string; detail?: string; weight: number };

export type VerifyResult = {
  verdict: "no_website" | "social_only" | "has_website";
  foundUrl?: string;
  confidence: number; // 0-100 confidence in the verdict
  signals: VerifySignal[];
};

export type VerifyInput = {
  name: string;
  city?: string;
  state?: string;
  phone?: string;
};

const TLDS = [".com", ".net", ".co", ".biz", ".us"];

const PARKED_MARKERS = [
  "this domain is for sale",
  "domain for sale",
  "buy this domain",
  "parked free",
  "godaddy.com/domainsearch",
  "sedoparking",
  "hugedomains",
  "afternic",
  "future home of something quite cool",
  "default web site page",
];

const BUILDER_MARKERS = ["wixsite.com", "squarespace", "weebly", "godaddysites.com", "wordpress.com"];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(llc|inc|co|corp|company|the)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");

const digits = (s?: string) => (s || "").replace(/\D/g, "");

function candidateDomains(input: VerifyInput): string[] {
  const base = slugify(input.name);
  if (!base || base.length < 3) return [];
  const words = input.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !["llc", "inc", "co", "corp", "company", "the", "and"].includes(w));

  const stems = new Set<string>([base]);
  if (words.length > 1) stems.add(words.join("-"));
  if (words.length > 2) stems.add(words.slice(0, 2).join(""));
  if (input.city) stems.add(base + slugify(input.city));

  const out: string[] = [];
  for (const stem of stems) {
    for (const tld of TLDS) {
      out.push(`${stem}${tld}`);
      if (out.length >= 10) return out;
    }
  }
  return out;
}

async function fetchText(url: string, timeoutMs = 7000): Promise<{ ok: boolean; status: number; body: string; finalUrl: string } | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; ProspectMasterBot/1.0)", accept: "text/html,*/*" },
    });
    const body = res.ok ? (await res.text()).slice(0, 120_000) : "";
    return { ok: res.ok, status: res.status, body, finalUrl: res.url || url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function scorePage(input: VerifyInput, html: string, finalUrl: string): { score: number; signals: VerifySignal[] } {
  const lower = html.toLowerCase();
  const signals: VerifySignal[] = [];
  let score = 40;
  signals.push({ label: "Domain resolves and serves a page", detail: finalUrl, weight: 40 });

  if (PARKED_MARKERS.some((m) => lower.includes(m))) {
    signals.push({ label: "Page looks parked or for sale", weight: -45 });
    score -= 45;
  }

  const nameWords = input.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const nameHits = nameWords.filter((w) => lower.includes(w)).length;
  if (nameWords.length && nameHits / nameWords.length >= 0.5) {
    signals.push({ label: "Business name appears on the page", weight: 25 });
    score += 25;
  }

  const phone = digits(input.phone);
  if (phone.length >= 10 && digits(html).includes(phone.slice(-10))) {
    signals.push({ label: "Matching phone number on the page", weight: 30 });
    score += 30;
  }

  if (input.city && lower.includes(input.city.toLowerCase())) {
    signals.push({ label: "City matches", detail: input.city, weight: 10 });
    score += 10;
  }

  if (BUILDER_MARKERS.some((m) => lower.includes(m))) {
    signals.push({ label: "Built on a DIY site builder", weight: 0 });
  }

  if (html.length < 1500) {
    signals.push({ label: "Very thin page content", weight: -15 });
    score -= 15;
  }

  return { score: Math.max(0, Math.min(100, score)), signals };
}

async function checkSocial(input: VerifyInput): Promise<VerifySignal | null> {
  const slug = slugify(input.name);
  if (slug.length < 4) return null;
  const res = await fetchText(`https://www.facebook.com/${slug}`, 5000);
  if (!res?.ok || !res.body) return null;
  const lower = res.body.toLowerCase();
  const notFound = ["content isn't available", "page isn't available", "content not found", "log in or sign up"].some((m) =>
    lower.includes(m),
  );
  if (notFound) return null;
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(res.body)?.[1]?.toLowerCase() ?? "";
  const words = input.name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  const titleMatch = words.length > 0 && words.every((w) => title.includes(w));
  if (!titleMatch) return null;
  return { label: "Facebook page found", detail: `facebook.com/${slug}`, weight: 20 };
}


export async function verifyBusiness(input: VerifyInput): Promise<VerifyResult> {
  const domains = candidateDomains(input);
  const signals: VerifySignal[] = [];
  let best: { score: number; url: string; signals: VerifySignal[] } | null = null;

  const probes = await Promise.all(
    domains.slice(0, 8).map(async (d) => {
      const res = (await fetchText(`https://${d}`)) ?? (await fetchText(`http://${d}`));
      return { domain: d, res };
    }),
  );

  for (const { domain, res } of probes) {
    if (!res || !res.ok || !res.body) continue;
    const scored = scorePage(input, res.body, res.finalUrl);
    if (!best || scored.score > best.score) best = { score: scored.score, url: `https://${domain}`, signals: scored.signals };
  }

  if (best && best.score >= 55) {
    return { verdict: "has_website", foundUrl: best.url, confidence: best.score, signals: best.signals };
  }

  signals.push({ label: `Checked ${probes.length} likely domains, none matched`, weight: 30 });
  if (best) signals.push({ label: "Closest match was too weak to count", detail: `${best.url} (${best.score}%)`, weight: -10 });

  const social = await checkSocial(input);
  if (social) {
    signals.push(social);
    return { verdict: "social_only", foundUrl: `https://www.facebook.com/${slugify(input.name)}`, confidence: 70, signals };
  }

  signals.push({ label: "No social profile found either", weight: 15 });
  const confidence = Math.min(90, 55 + (best ? 0 : 15) + (input.phone ? 10 : 0));
  return { verdict: "no_website", confidence, signals };
}
