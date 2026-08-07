import { createFileRoute, notFound } from "@tanstack/react-router";
import * as React from "react";
import { Phone, MapPin, Clock, Star, Check } from "lucide-react";
import { getPublicSite, trackPreviewEvent, type PublicSite } from "@/lib/site.functions";
import { heroImage } from "@/lib/site-templates";

export const Route = createFileRoute("/s/$slug")({
  loader: async ({ params }) => {
    const site = await getPublicSite({ data: { slug: params.slug } });
    if (!site) throw notFound();
    return site;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Site unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.business.name ?? loaderData.headline} — ${loaderData.business.city ?? "Local business"}`;
    const description = loaderData.tagline || loaderData.about.slice(0, 150);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PublicSitePage,
  notFoundComponent: SiteNotFound,
});

function SiteNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-2xl font-medium">Site not found</h1>
        <p className="text-sm text-muted-foreground mt-2">This preview may have been unpublished.</p>
      </div>
    </div>
  );
}

function PublicSitePage() {
  const site = Route.useLoaderData();
  const b = site.business;
  const hero = heroImage(b.heroKey);

  React.useEffect(() => {
    const device = window.innerWidth < 768 ? "mobile" : "desktop";
    void trackPreviewEvent({ data: { slug: site.slug, type: "view", device } }).catch(() => {});
  }, [site.slug]);

  const onCta = () => {
    const device = window.innerWidth < 768 ? "mobile" : "desktop";
    void trackPreviewEvent({ data: { slug: site.slug, type: "cta_click", device } }).catch(() => {});
  };

  const shared = { site, hero, onCta };
  if (site.template === "classic") return <ClassicTemplate {...shared} />;
  if (site.template === "bold") return <BoldTemplate {...shared} />;
  return <ModernTemplate {...shared} />;
}

type TplProps = { site: PublicSite; hero: string; onCta: () => void };

function Chrome({ site, children }: { site: PublicSite; children: React.ReactNode }) {
  const b = site.business;
  return (
    <div style={{ background: site.palette.bg, minHeight: "100vh" }}>
      <header className="flex items-center justify-between px-6 md:px-10 py-5">
        <span style={{ fontWeight: 700, letterSpacing: -0.4, fontSize: 18, color: site.palette.primary }}>
          {b.name ?? "Local Business"}
        </span>
        {b.phone && (
          <a
            href={`tel:${b.phone}`}
            className="text-sm font-medium flex items-center gap-2 px-4 py-2"
            style={{ border: `1px solid ${site.palette.primary}`, color: site.palette.primary, borderRadius: 999 }}
          >
            <Phone size={14} /> {b.phone}
          </a>
        )}
      </header>
      {children}
      <Footer site={site} />
    </div>
  );
}

function Footer({ site }: { site: PublicSite }) {
  const b = site.business;
  return (
    <footer className="px-6 md:px-10 py-10 mt-16" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-sm">
        <div>
          <div className="font-semibold" style={{ color: site.palette.primary }}>{b.name}</div>
          <p className="text-muted-foreground mt-2">{site.tagline}</p>
        </div>
        <div>
          <div className="font-medium flex items-center gap-2"><Clock size={14} /> Hours</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {(b.hours ?? []).map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-medium flex items-center gap-2"><MapPin size={14} /> Visit us</div>
          <p className="mt-2 text-muted-foreground">
            {b.address}
            {b.address ? <br /> : null}
            {b.city}{b.city && b.state ? ", " : ""}{b.state}
          </p>
        </div>
      </div>
    </footer>
  );
}

function Services({ site }: { site: PublicSite }) {
  return (
    <section className="px-6 md:px-10 mt-20 max-w-5xl mx-auto">
      <h2 style={{ fontSize: 26, fontWeight: 600 }}>What we do</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {site.services.map((s) => (
          <div key={s} className="p-6" style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 34, height: 34, borderRadius: 10, background: `${site.palette.primary}18`, color: site.palette.primary }}
            >
              <Check size={16} />
            </div>
            <div className="mt-3 font-medium">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Social({ site }: { site: PublicSite }) {
  const b = site.business;
  return (
    <section className="px-6 md:px-10 mt-20 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      {b.testimonial && (
        <div className="p-7" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex gap-1" style={{ color: "#F5A623" }}>
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed">“{b.testimonial.quote}”</p>
          <div className="text-xs text-muted-foreground mt-3">{b.testimonial.author}</div>
        </div>
      )}
      <div className="p-7" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
        <h3 className="font-medium">Common questions</h3>
        <div className="mt-3 space-y-3">
          {(b.faqs ?? []).map((f) => (
            <div key={f.q}>
              <div className="text-sm font-medium">{f.q}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand({ site, onCta }: { site: PublicSite; onCta: () => void }) {
  return (
    <section className="px-6 md:px-10 mt-20 max-w-5xl mx-auto">
      <div className="p-10 text-center" style={{ background: site.palette.primary, borderRadius: 20 }}>
        <h2 style={{ fontSize: 26, fontWeight: 600, color: "#fff" }}>Ready to get started?</h2>
        <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>{site.tagline}</p>
        <button
          onClick={onCta}
          className="mt-5 text-sm font-medium px-6 py-3"
          style={{ background: "#fff", color: site.palette.primary, borderRadius: 999 }}
        >
          {site.cta}
        </button>
      </div>
    </section>
  );
}

function ModernTemplate({ site, hero, onCta }: TplProps) {
  const b = site.business;
  return (
    <Chrome site={site}>
      <section className="px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto mt-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: site.palette.primary }}>
            {b.category} · {b.city}, {b.state}
          </div>
          <h1 style={{ fontSize: 44, lineHeight: 1.08, fontWeight: 600, marginTop: 14 }}>{site.headline}</h1>
          <p className="text-[17px] text-muted-foreground mt-4 leading-relaxed">{site.tagline}</p>
          <div className="flex gap-3 mt-7">
            <button onClick={onCta} className="text-sm font-medium px-6 py-3" style={{ background: site.palette.primary, color: "#fff", borderRadius: 999 }}>
              {site.cta}
            </button>
            {b.phone && (
              <a href={`tel:${b.phone}`} className="text-sm font-medium px-6 py-3" style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 999 }}>
                Call Us
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-8 text-xs text-muted-foreground">
            {(b.highlights ?? []).map((h) => (
              <span key={h} className="flex items-center gap-1.5"><Check size={12} style={{ color: site.palette.primary }} /> {h}</span>
            ))}
          </div>
        </div>
        <img src={hero} alt={`${b.name} in ${b.city}`} width={1280} height={800} className="w-full h-auto" style={{ borderRadius: 20, objectFit: "cover", maxHeight: 460 }} />
      </section>
      <section className="px-6 md:px-10 mt-20 max-w-3xl mx-auto text-center">
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>About {b.name}</h2>
        <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed">{site.about}</p>
      </section>
      <Services site={site} />
      <Social site={site} />
      <CtaBand site={site} onCta={onCta} />
    </Chrome>
  );
}

function ClassicTemplate({ site, hero, onCta }: TplProps) {
  const b = site.business;
  return (
    <Chrome site={site}>
      <section className="relative">
        <img src={hero} alt={`${b.name} in ${b.city}`} width={1280} height={800} className="w-full" style={{ height: 480, objectFit: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.65))" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 46, lineHeight: 1.1, color: "#fff", fontWeight: 400, maxWidth: 780 }}>
            {site.headline}
          </h1>
          <p className="mt-4 text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)", maxWidth: 620 }}>{site.tagline}</p>
          <button onClick={onCta} className="mt-7 text-sm font-medium px-7 py-3" style={{ background: "#fff", color: site.palette.primary, borderRadius: 4 }}>
            {site.cta}
          </button>
        </div>
      </section>
      <section className="px-6 md:px-10 mt-16 max-w-3xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: site.palette.primary }}>Since day one</div>
        <p className="text-[17px] mt-4 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{site.about}</p>
      </section>
      <Services site={site} />
      <Social site={site} />
      <CtaBand site={site} onCta={onCta} />
    </Chrome>
  );
}

function BoldTemplate({ site, hero, onCta }: TplProps) {
  const b = site.business;
  return (
    <Chrome site={site}>
      <section className="px-6 md:px-10 max-w-6xl mx-auto">
        <div className="relative overflow-hidden" style={{ borderRadius: 24 }}>
          <img src={hero} alt={`${b.name} in ${b.city}`} width={1280} height={800} className="w-full" style={{ height: 440, objectFit: "cover" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${site.palette.primary}F2 12%, ${site.palette.primary}55 70%, transparent)` }} />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12" style={{ maxWidth: 620 }}>
            <div className="text-[11px] uppercase tracking-[0.22em] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
              {b.city}, {b.state}
            </div>
            <h1 style={{ fontSize: 46, lineHeight: 1.03, fontWeight: 800, color: "#fff", letterSpacing: -1, marginTop: 10 }}>
              {site.headline.toUpperCase()}
            </h1>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{site.tagline}</p>
            <div className="mt-6">
              <button onClick={onCta} className="text-sm font-bold px-7 py-3" style={{ background: "#fff", color: site.palette.primary, borderRadius: 8 }}>
                {site.cta}
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {(b.highlights ?? []).map((h) => (
            <div key={h} className="p-5 text-center" style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="text-sm font-semibold">{h}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="px-6 md:px-10 mt-20 max-w-3xl mx-auto">
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>About {b.name}</h2>
        <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed">{site.about}</p>
      </section>
      <Services site={site} />
      <Social site={site} />
      <CtaBand site={site} onCta={onCta} />
    </Chrome>
  );
}
