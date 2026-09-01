-- ============================================================
-- LUMINEL DATABASE SCHEMA — Supabase PostgreSQL
-- Entità: Insolito Experiences (Legge 4/2013 · ATECO 969999)
-- Server: EU-WEST (Frankfurt) — GDPR compliant
-- ============================================================

-- Abilita UUID e RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILI UTENTE
-- ============================================================
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  -- Dati personali
  full_name         TEXT,
  username          TEXT UNIQUE,
  avatar_url        TEXT,
  bio               TEXT,

  -- Piano abbonamento
  plan              TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'vip')),
  stripe_customer_id TEXT UNIQUE,
  plan_expires_at   TIMESTAMPTZ,

  -- Progresso coaching
  ikigai_stage      TEXT DEFAULT 'scoperta' 
                    CHECK (ikigai_stage IN ('scoperta', 'chiarezza', 'strategia', 'sviluppo')),
  level             INTEGER DEFAULT 1,
  xp_total          INTEGER DEFAULT 0,
  streak_days       INTEGER DEFAULT 0,
  last_active_at    TIMESTAMPTZ,

  -- Preferenze
  preferred_language TEXT DEFAULT 'it' 
                      CHECK (preferred_language IN ('it','en','es','fr','ja','ko','pt')),
  theme             TEXT DEFAULT 'dark',

  -- Ikigai assessment (onboarding)
  ikigai_loves      TEXT[], -- "Cosa ami fare"
  ikigai_good_at    TEXT[], -- "In cosa sei bravo"
  ikigai_world_needs TEXT[], -- "Di cosa il mondo ha bisogno"
  ikigai_paid_for   TEXT[], -- "Per cosa puoi essere pagato"
  ikigai_summary    TEXT,   -- sintesi generata da Claude

  -- Metadata
  session_count     INTEGER DEFAULT 0,
  minutes_total     INTEGER DEFAULT 0,
  community_rank    INTEGER,
  is_neurodivergent_friendly BOOLEAN DEFAULT FALSE -- modalità comunicazione adattata
);

-- RLS: ogni utente vede solo i propri dati
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- ============================================================
-- 2. SESSIONI COACHING (memoria AI)
-- ============================================================
CREATE TABLE coaching_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,

  -- Tipo sessione
  mode          TEXT DEFAULT 'coach' 
                CHECK (mode IN ('coach', 'council', 'quest', 'meditation', 'voice')),
  archetype     TEXT CHECK (archetype IN ('alchimista','stratega','guerriero','sovrano')),

  -- Contenuto (crittografato lato applicazione prima di salvare)
  title         TEXT, -- titolo auto-generato da Claude
  summary       TEXT, -- riassunto della sessione generato da Claude
  key_insights  TEXT[], -- insight principali estratti
  patterns      TEXT[], -- pattern identificati da Claude

  -- Emozioni e contesto
  mood_before   TEXT,
  mood_after    TEXT,
  energy_level  INTEGER CHECK (energy_level BETWEEN 1 AND 10),

  -- Reality Quest generata
  reality_quest_text TEXT,
  reality_quest_deadline TIMESTAMPTZ,
  reality_quest_completed BOOLEAN DEFAULT FALSE,
  reality_quest_completed_at TIMESTAMPTZ,

  -- Stats
  duration_minutes INTEGER,
  message_count    INTEGER DEFAULT 0,
  ikigai_stage_at_time TEXT, -- stage quando è stata fatta la sessione
  xp_earned       INTEGER DEFAULT 0
);

ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_sessions" ON coaching_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 3. MESSAGGI SESSIONE (storico conversazioni)
-- ============================================================
CREATE TABLE session_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL, -- NOTA: crittografare lato app per sessioni sensibili
  archetype   TEXT, -- se messaggio viene da un archetipo specifico
  is_quest    BOOLEAN DEFAULT FALSE -- questo messaggio contiene una Reality Quest
);

ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_messages" ON session_messages
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 4. QUESTS (percorsi strutturati)
-- ============================================================
CREATE TABLE quests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Contenuto
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT CHECK (category IN ('mindfulness','leadership','health','relationships','ikigai','identity')),
  difficulty    TEXT CHECK (difficulty IN ('principiante','intermedio','avanzato')),
  duration_days INTEGER NOT NULL,
  minutes_per_day INTEGER DEFAULT 20,

  -- Accesso
  required_plan TEXT DEFAULT 'free' CHECK (required_plan IN ('free','premium','vip')),
  is_featured   BOOLEAN DEFAULT FALSE,

  -- Autore
  author_name   TEXT DEFAULT 'Michael Jara',
  author_avatar TEXT,

  -- Stats
  rating        NUMERIC(3,2) DEFAULT 5.0,
  completions   INTEGER DEFAULT 0,

  -- Contenuto giornaliero (JSONB)
  -- { "day": 1, "title": "...", "content": "...", "exercise": "...", "reality_quest": "..." }
  days_content  JSONB DEFAULT '[]'::JSONB
);

-- ============================================================
-- 5. PROGRESSO QUESTS UTENTE
-- ============================================================
CREATE TABLE user_quest_progress (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id    UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),

  status      TEXT DEFAULT 'active' CHECK (status IN ('active','completed','paused')),
  current_day INTEGER DEFAULT 1,
  completed_days INTEGER[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  xp_earned   INTEGER DEFAULT 0,

  UNIQUE(user_id, quest_id)
);

ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_quest_progress" ON user_quest_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 6. REALITY QUESTS GIORNALIERE (generate da AI)
-- ============================================================
CREATE TABLE daily_reality_quests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Quest
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline_hours INTEGER DEFAULT 3,
  category    TEXT,
  urgency     TEXT DEFAULT 'normale' CHECK (urgency IN ('normale','critica','sfida')),

  -- Completion
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  reflection  TEXT, -- nota dell'utente dopo aver completato

  -- Generata da Claude basandosi su
  based_on_patterns TEXT[], -- pattern che hanno generato questa quest
  xp_reward   INTEGER DEFAULT 50,

  UNIQUE(user_id, date)
);

ALTER TABLE daily_reality_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_quests" ON daily_reality_quests
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 7. CONSIGLIO DEGLI ARCHETIPI (debate sessions)
-- ============================================================
CREATE TABLE council_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  problem_text  TEXT NOT NULL, -- il problema sottoposto al consiglio
  
  -- Risposte dei 4 archetipi
  alchimista_response  TEXT,
  stratega_response    TEXT,
  guerriero_response   TEXT,
  sovrano_response     TEXT,
  
  -- Master Plan finale
  master_plan   TEXT,
  reality_quest TEXT,

  -- Rating
  user_rating   INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  useful        BOOLEAN
);

ALTER TABLE council_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_council" ON council_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 8. ABBONAMENTI (Stripe webhook → aggiorna qui)
-- ============================================================
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id        TEXT NOT NULL,
  plan                   TEXT NOT NULL CHECK (plan IN ('premium','vip')),
  status                 TEXT NOT NULL, -- active, canceled, past_due, etc.
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN DEFAULT FALSE
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 9. COMMUNITY FEED
-- ============================================================
CREATE TABLE community_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  content     TEXT NOT NULL,
  post_type   TEXT DEFAULT 'insight' CHECK (post_type IN ('insight','quest_complete','milestone','share')),
  quest_id    UUID REFERENCES quests(id),
  likes_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE community_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_read_all" ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "users_own_posts" ON community_posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 10. FUNZIONE: aggiorna streak e XP
-- ============================================================
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_active DATE;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT last_active_at::DATE INTO last_active
  FROM profiles WHERE id = p_user_id;

  IF last_active = today - INTERVAL '1 day' THEN
    UPDATE profiles SET streak_days = streak_days + 1 WHERE id = p_user_id;
  ELSIF last_active < today - INTERVAL '1 day' THEN
    UPDATE profiles SET streak_days = 1 WHERE id = p_user_id;
  END IF;

  UPDATE profiles SET last_active_at = NOW() WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 11. FUNZIONE: aggiorna livello utente
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE
    WHEN xp < 100   THEN 1  -- Esploratore
    WHEN xp < 300   THEN 2  -- Cercatore
    WHEN xp < 600   THEN 3  -- Discepolo
    WHEN xp < 1000  THEN 4  -- Guerriero
    WHEN xp < 1500  THEN 5  -- Alchimista
    WHEN xp < 2500  THEN 6  -- Stratega
    WHEN xp < 4000  THEN 7  -- Maestro
    ELSE                 8  -- Sovrano
  END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- INDICI per performance
-- ============================================================
CREATE INDEX idx_sessions_user      ON coaching_sessions(user_id, created_at DESC);
CREATE INDEX idx_messages_session   ON session_messages(session_id, created_at);
CREATE INDEX idx_quests_user        ON user_quest_progress(user_id, status);
CREATE INDEX idx_daily_quests_user  ON daily_reality_quests(user_id, date DESC);
CREATE INDEX idx_council_user       ON council_sessions(user_id, created_at DESC);
CREATE INDEX idx_community_created  ON community_posts(created_at DESC);

-- ============================================================
-- SEED: Quests di default (Michael Jara)
-- ============================================================
INSERT INTO quests (title, description, category, difficulty, duration_days, required_plan, is_featured, author_name, rating, completions) VALUES
('Morning Spark',          'Energetizza il tuo risveglio con esercizi brevi e focalizzati.',                  'mindfulness', 'principiante', 7,  'free',    FALSE, 'Luminel Coach', 4.8, 1245),
('Mindful Moments',        'Brevi pause di consapevolezza per mantenere la mente lucida.',                   'mindfulness', 'principiante', 7,  'free',    FALSE, 'Michael Jara',  4.6, 980),
('Gratitude Journal',      'Diario guidato per annotare ogni giorno 3 motivi di gratitudine.',               'ikigai',      'principiante', 7,  'free',    FALSE, 'Michael Jara',  4.9, 1520),
('The Art of Mindful Living','Un viaggio per trasformare le tue abitudini quotidiane e coltivare la pace.', 'mindfulness', 'principiante', 21, 'free',    TRUE,  'Michael Jara',  4.8, 2100),
('Daily Momentum',         'Abitudini vincenti e mindfulness quotidiana.',                                   'identity',    'intermedio',   30, 'premium', FALSE, 'Michael Jara',  4.9, 780),
('Emotional Intelligence', 'Sviluppa la capacità di leggere e guidare le emozioni.',                        'relationships','intermedio',  30, 'premium', FALSE, 'Michael Jara',  4.8, 950),
('Deep Transformation',    'Supera blocchi profondi e sviluppa resilienza e leadership.',                    'identity',    'avanzato',     60, 'vip',     FALSE, 'Michael Jara',  5.0, 320),
('Empowerment Journey',    'Da pattern limitante a creatore: coaching di auto-leadership.',                  'leadership',  'avanzato',     45, 'vip',     FALSE, 'Michael Jara',  4.9, 280);
