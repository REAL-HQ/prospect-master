ALTER TABLE public.prospects
  ADD COLUMN IF NOT EXISTS verification_confidence numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_signals jsonb NOT NULL DEFAULT '[]'::jsonb;