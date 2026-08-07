ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.outreach_steps ADD COLUMN IF NOT EXISTS auto_sent boolean NOT NULL DEFAULT false;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS auto_follow_up boolean NOT NULL DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS default_tags jsonb NOT NULL DEFAULT '["no-website","prospectmaster"]'::jsonb;

CREATE TABLE IF NOT EXISTS public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'note',
  text text NOT NULL,
  at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities owner all" ON public.activities;
CREATE POLICY "activities owner all" ON public.activities FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS activities_user_at_idx ON public.activities (user_id, at DESC);