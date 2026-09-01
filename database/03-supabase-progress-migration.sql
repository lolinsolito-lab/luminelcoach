-- Esegui questo script nel SQL Editor di Supabase per aggiungere le colonne necessarie
-- per il tracciamento dei progressi ai profili utente.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS completed_lessons JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS course_progress JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS weekly_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_week_check TEXT;
