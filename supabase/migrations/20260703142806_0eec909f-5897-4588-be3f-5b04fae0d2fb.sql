
-- =====================================================================
-- ProspectMaster: full schema, RLS, and GRANTs
-- =====================================================================

-- Shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.pm_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================================
-- sites  (declared before prospects for FK; prospects.site_id -> sites)
-- =====================================================================
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id uuid,
  slug text NOT NULL,
  headline text,
  tagline text,
  about text,
  cta text,
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  palette jsonb NOT NULL DEFAULT '{"primary":"#CC0000","bg":"#FFF8F8"}'::jsonb,
  preview_path text,
  deployed_domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites owner all" ON public.sites FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- prospects
-- =====================================================================
CREATE TABLE public.prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  city text,
  state text,
  country text NOT NULL DEFAULT 'USA',
  phone text,
  address text,
  rating numeric NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  has_website boolean NOT NULL DEFAULT false,
  score numeric NOT NULL DEFAULT 5,
  tier text NOT NULL DEFAULT 'COLD' CHECK (tier IN ('HOT','WARM','COLD')),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Interested','Closed','Lost')),
  notes text NOT NULL DEFAULT '',
  verification_status text NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified','verified_no_site','unlinked_site')),
  found_url text,
  verified_at timestamptz,
  ghl_contact_id text,
  ghl_pushed_at timestamptz,
  site_id uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  outreach_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prospects TO authenticated;
GRANT ALL ON public.prospects TO service_role;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prospects owner all" ON public.prospects FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER prospects_touch BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.pm_touch_updated_at();
CREATE INDEX prospects_user_idx ON public.prospects(user_id, created_at DESC);

-- Now FK sites.prospect_id -> prospects
ALTER TABLE public.sites
  ADD CONSTRAINT sites_prospect_fk
  FOREIGN KEY (prospect_id) REFERENCES public.prospects(id) ON DELETE CASCADE;

-- =====================================================================
-- outreach
-- =====================================================================
CREATE TABLE public.outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id uuid NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  site_id uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach TO authenticated;
GRANT ALL ON public.outreach TO service_role;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outreach owner all" ON public.outreach FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX outreach_user_idx ON public.outreach(user_id, created_at DESC);

ALTER TABLE public.prospects
  ADD CONSTRAINT prospects_outreach_fk
  FOREIGN KEY (outreach_id) REFERENCES public.outreach(id) ON DELETE SET NULL;

-- =====================================================================
-- outreach_steps
-- =====================================================================
CREATE TABLE public.outreach_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outreach_id uuid NOT NULL REFERENCES public.outreach(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email','sms')),
  day integer NOT NULL DEFAULT 1,
  subject text,
  body text NOT NULL,
  sent boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  opened_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_steps TO authenticated;
GRANT ALL ON public.outreach_steps TO service_role;
ALTER TABLE public.outreach_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outreach_steps owner all" ON public.outreach_steps FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX outreach_steps_outreach_idx ON public.outreach_steps(outreach_id);
CREATE INDEX outreach_steps_scheduler_idx ON public.outreach_steps(scheduled_for) WHERE sent = false;

-- =====================================================================
-- preview_events  (public insert via SECURITY DEFINER fn; owner-only read)
-- =====================================================================
CREATE TABLE public.preview_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('view','cta_click')),
  device text NOT NULL DEFAULT 'desktop' CHECK (device IN ('mobile','desktop')),
  at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.preview_events TO authenticated;
GRANT ALL ON public.preview_events TO service_role;
ALTER TABLE public.preview_events ENABLE ROW LEVEL SECURITY;
-- Owner (via join to sites.user_id) can read
CREATE POLICY "preview_events owner select" ON public.preview_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sites s WHERE s.id = preview_events.site_id AND s.user_id = auth.uid()));

-- Public insert via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.log_preview_event(
  _site_id uuid, _type text, _device text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _type NOT IN ('view','cta_click') THEN
    RAISE EXCEPTION 'invalid type';
  END IF;
  IF _device NOT IN ('mobile','desktop') THEN
    _device := 'desktop';
  END IF;
  INSERT INTO public.preview_events (site_id, type, device)
  VALUES (_site_id, _type, _device);
END;
$$;
GRANT EXECUTE ON FUNCTION public.log_preview_event(uuid, text, text) TO anon, authenticated;

-- =====================================================================
-- payments
-- =====================================================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id uuid NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  type text NOT NULL DEFAULT 'upfront' CHECK (type IN ('upfront','hosting')),
  stripe_payment_intent_id text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments owner all" ON public.payments FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX payments_user_idx ON public.payments(user_id, paid_at DESC);

-- =====================================================================
-- saved_searches
-- =====================================================================
CREATE TABLE public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  category text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_searches TO authenticated;
GRANT ALL ON public.saved_searches TO service_role;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_searches owner all" ON public.saved_searches FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- notifications
-- =====================================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications owner all" ON public.notifications FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, at DESC);

-- =====================================================================
-- fresh_filings
-- =====================================================================
CREATE TABLE public.fresh_filings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  entity_number text,
  filing_date date,
  city text,
  zip text,
  registered_agent text,
  web_presence text NOT NULL DEFAULT 'unknown'
    CHECK (web_presence IN ('unknown','no_website','social_only','has_website')),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','checked','converted','skipped')),
  lead_id uuid REFERENCES public.prospects(id) ON DELETE SET NULL,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fresh_filings TO authenticated;
GRANT ALL ON public.fresh_filings TO service_role;
ALTER TABLE public.fresh_filings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fresh_filings owner all" ON public.fresh_filings FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE UNIQUE INDEX fresh_filings_entity_uidx
  ON public.fresh_filings(user_id, entity_number) WHERE entity_number IS NOT NULL;

-- =====================================================================
-- user_settings
-- =====================================================================
CREATE TABLE public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ghl_enabled boolean NOT NULL DEFAULT false,
  ghl_pit text,
  ghl_location_id text,
  ghl_default_tags jsonb NOT NULL DEFAULT '["prospectmaster","no-website"]'::jsonb,
  default_site_price numeric NOT NULL DEFAULT 1000,
  default_hosting_fee numeric NOT NULL DEFAULT 99,
  firecrawl_configured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_settings owner all" ON public.user_settings FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_settings_touch BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.pm_touch_updated_at();
