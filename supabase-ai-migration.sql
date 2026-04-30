-- Migrazione per supportare il nuovo Cervello AI di Luminel v2.0

-- 1. TABELLA USER CONTEXT (Memoria a lungo termine)
CREATE TABLE IF NOT EXISTS public.user_context (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Memoria
  last_session_summary text,
  observed_patterns jsonb DEFAULT '[]'::jsonb,
  key_themes jsonb DEFAULT '[]'::jsonb,
  ikigai_stage text DEFAULT 'scoperta',
  current_mood text,
  
  -- Tracking Sessioni
  session_count integer DEFAULT 0,
  last_session_at timestamp with time zone,
  
  -- Reality Quest Attiva
  active_quest_text text,
  quest_deadline timestamp with time zone,
  quest_completed boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS per user_context
ALTER TABLE public.user_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own context"
  ON public.user_context FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own context"
  ON public.user_context FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own context"
  ON public.user_context FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_user_context_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_context_updated_at ON public.user_context;
CREATE TRIGGER trg_user_context_updated_at
BEFORE UPDATE ON public.user_context
FOR EACH ROW EXECUTE FUNCTION update_user_context_updated_at();
