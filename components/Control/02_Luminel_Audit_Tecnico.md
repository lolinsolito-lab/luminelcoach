# 02 — LUMINEL: AUDIT TECNICO & ARCHITETTURA
## Skill File per Claude Project · Insolito Experiences · Michael Jara
### Fonte di verità per: stack, DB schema, Edge Functions, bug pendenti, checklist lancio

---

## STATO PRODUZIONE — 30 Aprile 2026

### ✅ COMPLETATO
| Area | File chiave |
|---|---|
| UI Dark Luxury completa | tutti i componenti |
| Database schema v3.0 (12 tabelle) | admin-setup.sql |
| Auth Supabase funzionante | contexts/AuthContext.tsx |
| Admin Dashboard responsivo | pages/AdminDashboard.tsx |
| Routing BrowserRouter (no `/#`) | App.tsx + vercel.json |
| Prezzi corretti ovunque | PlansPage, UpgradeModal, SettingsPage |
| Firma ASCII console in produzione | index.tsx |
| WelcomeVideoModal centrato (portal) | components/WelcomeVideoModal.tsx |
| Mood selector → salva su user_context | components/Dashboard.tsx |
| Piano letto da DB Supabase (non auth) | components/Dashboard.tsx |
| Admin link in sidebar (solo admin) | components/Layout.tsx |
| Modal AICallModal + UpgradeModal portal | CallPage, PlansPage |
| Quest progress → RPC `add_xp()` al completamento | services/memoryService.ts |
| Voice counter → aggiornamento `monthly_voice_count` su Supabase | components/AICallModal.tsx |
| Automazione prezzi Settembre 2026 | api/stripe/create-checkout.ts |

### ⚠️ PENDENTI IN CODICE (priorità alta)
| Fix | Priorità |
|---|---|
| Sync onboarding data → Supabase dopo signup | 🔴 Alta |
| Errori auth in italiano | 🟡 Media |
| Community likes → Supabase live | 🟡 Media |

### 🔒 RICHIEDE AZIONE ESTERNA (non è codice)
| Azione | Dove |
|---|---|
| `ANTHROPIC_API_KEY` | Supabase → Settings → Edge Functions → Secrets |
| Deploy Edge Function | `supabase functions deploy luminel-chat` |
| Stripe account + prodotti | stripe.com |
| Stripe webhook | Vercel → /api/stripe-webhook |
| Cron jobs Supabase | Supabase → Database → Cron |
| Google OAuth | Google Cloud Console + Supabase Auth |
| ElevenLabs Voice VIP | Supabase Secrets: `ELEVENLABS_API_KEY` |
| Email automation | Resend account |

---

## INFRASTRUTTURA BASE

### Supabase
- **URL:** `https://byszehdinjlejkzsbwvi.supabase.co`
- **Admin:** jaramichael@hotmail.com → role = 'admin'

### Cron Jobs (attivare su Supabase)
```sql
-- Reset giornaliero contatori messaggi
SELECT cron.schedule(
  'reset-daily-counts',
  '0 0 * * *',
  'SELECT reset_daily_counts()'
);

-- Reset mensile voice count
SELECT cron.schedule(
  'reset-monthly-voice',
  '0 0 1 * *',
  'SELECT reset_monthly_voice()'
);
```

### Edge Function: `luminel-chat`
- **File:** `supabase/functions/luminel-chat/index.ts`
- **Deploy:** `supabase functions deploy luminel-chat`

**Flusso completo:**
```
REQUEST
  ├─ Verifica JWT utente
  ├─ Legge plan da profiles
  ├─ Controlla daily_message_count
  │   ├─ FREE:    limit 5
  │   ├─ STARTER: limit 30
  │   ├─ PREMIUM: limit 100
  │   └─ VIP:     limit 999
  │
  ├─ Sceglie modello:
  │   ├─ FREE:    claude-haiku-4-5-20251001
  │   ├─ STARTER: claude-haiku-4-5-20251001
  │   ├─ PREMIUM: claude-sonnet-4-6
  │   └─ VIP:     claude-opus-4-6
  │
  ├─ Costruisce system prompt:
  │   ├─ Base prompt (identità + metodo)
  │   ├─ Modalità (coach / shadow / strategy)
  │   └─ Blocco memoria da user_context
  │
  ├─ Chiama Anthropic API
  ├─ Salva in session_messages
  ├─ Aggiorna daily_message_count
  │
  └─ [BACKGROUND — ogni 10 msg O fine sessione]
      └─ Chiama Claude per estrazione insights
          └─ Aggiorna user_context su Supabase

RESPONSE → Browser
```

**Trigger estrazione memoria:**
1. Nessun messaggio per 30 minuti (sessione terminata)
2. Utente apre nuova sessione (estrae dalla precedente)
3. Ogni 10 messaggi (aggiornamento progressivo)

---

## DATABASE SCHEMA — 12 TABELLE

### `profiles` — dati utente principale
```sql
id               UUID (FK auth.users)
email            TEXT
full_name        TEXT
plan             TEXT DEFAULT 'free'  -- 'free' | 'starter' | 'premium' | 'vip' | 'elite'
role             TEXT DEFAULT 'user'  -- 'user' | 'admin'
daily_message_count  INTEGER DEFAULT 0
monthly_voice_count  INTEGER DEFAULT 0
streak_days      INTEGER DEFAULT 0
last_login       TIMESTAMP
xp               INTEGER DEFAULT 0
level            INTEGER DEFAULT 1
ikigai_stage     TEXT DEFAULT 'scoperta'
created_at       TIMESTAMP
```

### `user_context` — memoria lungo termine AI
```sql
id               UUID
user_id          UUID (FK profiles)
last_session_summary   TEXT
key_insights     JSONB   -- array di stringhe
patterns_observed      JSONB   -- array di stringhe
active_quest_text      TEXT
quest_deadline   TIMESTAMP
quest_completed  BOOLEAN DEFAULT false
quest_category   TEXT
ikigai_stage     TEXT
emotional_state  TEXT
next_session_hook      TEXT
session_count    INTEGER DEFAULT 0
updated_at       TIMESTAMP
```

### `coaching_sessions` — contenitore sessione
```sql
id               UUID
user_id          UUID (FK profiles)
mode             TEXT DEFAULT 'coach'  -- 'coach' | 'shadow' | 'strategy'
started_at       TIMESTAMP
ended_at         TIMESTAMP
message_count    INTEGER DEFAULT 0
summary          TEXT
```

### `session_messages` — ogni singolo messaggio
```sql
id               UUID
session_id       UUID (FK coaching_sessions)
user_id          UUID (FK profiles)
role             TEXT  -- 'user' | 'assistant'
content          TEXT
created_at       TIMESTAMP
```

### `daily_reality_quests` — quest AI giornaliere
```sql
id               UUID
user_id          UUID (FK profiles)
quest_text       TEXT
quest_title      TEXT
category         TEXT
deadline_hours   INTEGER
completed        BOOLEAN DEFAULT false
completed_at     TIMESTAMP
generated_at     TIMESTAMP
```

### `quests` — quest predefinite sistema
```sql
id               UUID
title            TEXT
description      TEXT
category         TEXT
ikigai_phase     TEXT
xp_reward        INTEGER
difficulty       TEXT
```

### `user_quest_progress`
```sql
id, user_id, quest_id, status, completed_at, xp_earned
```

### `user_course_progress`
```sql
id, user_id, course_id, lesson_id, completed, completed_at, progress_pct
```

### `council_sessions` — sessioni Il Consiglio (VIP)
```sql
id               UUID
user_id          UUID (FK profiles)
problem_text     TEXT
alchimista_response   TEXT
stratega_response     TEXT
guerriero_response    TEXT
sovrano_response      TEXT
luminel_synthesis     TEXT
reality_quest    TEXT
created_at       TIMESTAMP
```

### `subscriptions` — Stripe sync
```sql
id               UUID
user_id          UUID (FK profiles)
stripe_customer_id    TEXT
stripe_subscription_id TEXT
plan             TEXT
status           TEXT  -- 'active' | 'canceled' | 'past_due'
current_period_end    TIMESTAMP
```

### `community_posts` e `community_likes`
```sql
-- community_posts: id, user_id, content, type, likes_count, created_at
-- community_likes: id, user_id, post_id, created_at
```

### Funzioni SQL critiche
```sql
is_admin()                    -- SECURITY DEFINER, no loop RLS
add_xp(uid UUID, xp INT)      -- aggiorna XP + level
update_user_streak(uid UUID)  -- chiamata al login
reset_daily_counts()          -- cron mezzanotte
reset_monthly_voice()         -- cron 1° del mese
```

### Trigger critici
```sql
on_auth_user_created     -- crea profilo automaticamente al signup
on_subscription_change   -- aggiorna profiles.plan da Stripe webhook
```

---

## ARCHITETTURA FILE PROGETTO

```
c:\LuminelCoach\
├── App.tsx                     # Router + AuthProvider + ThemeProvider
├── index.tsx                   # Entry point + firma ASCII console
├── vercel.json                 # SPA rewrite per BrowserRouter
├── vite.config.ts              # Build (drop_console: false — non cambiare!)
│
├── components/
│   ├── Layout.tsx              # Sidebar + Mobile nav + Admin link
│   ├── Dashboard.tsx           # Home (mood→Supabase, piano da DB)
│   ├── ChatPage.tsx            # Chat AI → luminel-chat edge function
│   ├── CallPage.tsx            # Voice Coach + modal portals
│   ├── PlansPage.tsx           # Prezzi: €0 / €49 / €199
│   ├── WelcomeVideoModal.tsx   # Portal → centrato su body
│   ├── UpgradeModal.tsx        # Prezzi: €49 / €199
│   ├── AICallModal.tsx         # Portal
│   └── FOMOSection.tsx         # Hidden per VIP
│
├── pages/
│   └── AdminDashboard.tsx      # /admin — solo role='admin'
│
├── contexts/
│   ├── AuthContext.tsx         # Supabase Auth + profilo
│   └── ProgressContext.tsx     # XP, streak, level
│
└── services/
    ├── supabase.ts             # Client Supabase
    ├── adminService.ts         # KPI, CRM, AI Health
    ├── memoryService.ts        # user_context read/write
    └── councilService.ts       # 4 archetipi Il Consiglio
```

---

## PIANI & LOGICA ACCESSO

```typescript
// Logica canAccess() usata nei componenti
free:    chat (10/die), 1 quest/giorno, prime 2 lezioni corsi, 1 voice demo/mese
starter: chat (30/die), 1 quest/giorno, 3 corsi base completi, community base
premium: chat (100/die), tutte le quests, tutti i corsi, audio binaural
vip:     tutto + Il Consiglio, Voice HD (120 min), sessione Michael Jara 1/mese
```

**Prezzi ufficiali — NON modificare:**
| Piano | Mensile | Annuale |
|---|---|---|
| Free | €0 | — |
| Starter | €14.99/mese | — |
| Premium | €49/mese | €39/mese (€468/anno) |
| VIP Sovereign | €199/mese | €159/mese (€1.908/anno) |
| Elite Sovereign | — | €5.000/anno (solo contatto diretto) |

---

## STRIPE — IMPLEMENTAZIONE

### Prodotti da creare (Price ID da inserire nel codice)
| Piano | Stripe Price ID |
|---|---|
| Starter mensile €14.99 | `price_starter_monthly` |
| Premium mensile €49 | `price_premium_monthly` |
| Premium annuale €468 | `price_premium_annual` |
| VIP mensile €199 | `price_vip_monthly` |
| VIP annuale €1908 | `price_vip_annual` |
| Elite annuale €5000 | `price_elite_annual` |

### Webhook Events
```
customer.subscription.created  → INSERT subscriptions
customer.subscription.updated  → UPDATE subscriptions
customer.subscription.deleted  → UPDATE status='canceled'
```
Trigger `on_subscription_change` → aggiorna `profiles.plan` automaticamente.

### Variabili Vercel
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## SERVIZI DA CREARE / AGGIORNARE

### `memoryService.ts` (creare)
```typescript
extractInsights(sessionId: string)     // chiama Claude per estrarre
updateUserContext(userId, insights)    // aggiorna Supabase
buildMemoryBlock(userId: string)       // costruisce blocco per system prompt
```

### `councilService.ts` (creare)
```typescript
runCouncilDebate(problem, userContext) // 4 chiamate Claude parallele
// Alchimista + Stratega + Guerriero + Sovrano con personalità distinta
synthesizeCouncil(responses)           // Luminel sintetizza
```

### `system-prompt.ts` (aggiornare)
```typescript
buildSystemPrompt(mode: 'coach'|'shadow'|'strategy', userContext: UserContext)
// Integra il blocco MEMORY con next_session_hook e active_quest
```

---

## CHECKLIST LANCIO

### Tecnica
- [ ] Edge Function deployata
- [ ] `ANTHROPIC_API_KEY` nei Supabase Secrets
- [ ] Budget Anthropic impostato ($200/mese hard limit)
- [ ] Stripe live mode + webhook verificato
- [ ] Cron jobs attivi (reset daily + monthly)
- [ ] Google OAuth testato

### Contenuto
- [ ] 3+ audio meditazioni su Supabase Storage (bucket: `courses`)
- [ ] Video benvenuto Michael Jara (`/public/videos/michael-jara-welcome.mp4`)
- [ ] Privacy Policy (`/privacy`) + Termini di Servizio (`/terms`)

### Legale
- [ ] P.IVA 14379200968 nel footer
- [ ] Legge 4/2013 dichiarata
- [ ] GDPR: cookie banner + privacy policy
- [ ] EU AI Act: sistema dichiarato come automatizzato
- [ ] Disclaimer "Non è un servizio medico" nelle pagine AI

### Business
- [ ] Test pagamento Premium → `profiles.plan` = 'premium'
- [ ] Test cancellazione → `profiles.plan` torna 'free'
- [ ] Admin dashboard mostra dati reali
- [ ] Il Consiglio risponde con Claude reale (non mock)

---

## PRIORITÀ ESECUZIONE

```
SETTIMANA 1
  1. ANTHROPIC_API_KEY + deploy luminel-chat  ← sblocca tutta l'AI
  2. Stripe configurazione + webhook
  3. Cron jobs Supabase
  4. Sync onboarding data post-signup

SETTIMANA 2
  5. 3 audio meditazioni su Storage
  6. Video benvenuto
  7. Privacy Policy + Terms
  8. Email automation (Resend)

SETTIMANA 3 — Beta
  9. 20-50 utenti beta
  10. Fix bug critici
  11. Google OAuth
  12. Reality Quest AI giornaliera live

MESE 2
  13. ElevenLabs Voice VIP
  14. Community feed live
  15. Analytics (Google Analytics o Posthog)
```

---

*Insolito Experiences · Michael Jara · Cernusco sul Naviglio (MI)*
*P.IVA 14379200968 · Audit v1.1 · 30 Aprile 2026*
