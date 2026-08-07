ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS template text NOT NULL DEFAULT 'modern',
  ADD COLUMN IF NOT EXISTS hero_url text,
  ADD COLUMN IF NOT EXISTS business jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

-- make slugs globally unique so public URLs resolve to one site
UPDATE public.sites s
SET slug = s.slug || '-' || left(s.id::text, 6)
WHERE EXISTS (
  SELECT 1 FROM public.sites o WHERE o.slug = s.slug AND o.id <> s.id AND o.created_at < s.created_at
);
CREATE UNIQUE INDEX IF NOT EXISTS sites_slug_unique ON public.sites (slug);

-- public marketing pages: anyone may read a published site
GRANT SELECT ON public.sites TO anon;
DROP POLICY IF EXISTS "Published sites are publicly readable" ON public.sites;
CREATE POLICY "Published sites are publicly readable"
  ON public.sites FOR SELECT TO anon
  USING (published = true);