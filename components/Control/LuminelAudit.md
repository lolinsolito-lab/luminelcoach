# LUMINEL — AUDIT COMPLETO DI PRODUZIONE v1.1
## Brief Operativo per AI Assistente
### Aggiornato: 30 Aprile 2026
### Insolito Experiences · Michael Jara · P.IVA 14379200968

---

## ISTRUZIONI PER L'AI

Questo documento è l'audit tecnico completo di Luminel Coach Transformational.
Usalo come **fonte di verità** per qualsiasi verifica, implementazione o debug.

> **Prezzi ufficiali (NON cambiare):**
> - Free: €0
> - Premium: €49/mese (annuale: €39/mese)
> - VIP Sovereign: €199/mese (annuale: €159/mese)
> - Elite: €5.000/anno (solo contatto diretto)

---

## STATO AL 30 APRILE 2026

### ✅ COMPLETATO
| Area | File chiave |
|---|---|
| UI Dark Luxury completa | tutti i componenti |
| Database schema v3.0 (12 tabelle) | admin-setup.sql |
| Auth Supabase funzionante | contexts/AuthContext.tsx |
| Admin Dashboard responsivo | pages/AdminDashboard.tsx |
| Routing BrowserRouter (no `/#`) | App.tsx + vercel.json |
| Prezzi corretti ovunque | PlansPage, UpgradeModal, SettingsPage |
| Firma ASCII console in produzione | index.tsx + vite.config.ts (drop_console: false) |
| WelcomeVideoModal centrato (portal) | components/WelcomeVideoModal.tsx |
| Mood selector → salva su user_context | components/Dashboard.tsx |
| Piano letto da DB Supabase (non auth) | components/Dashboard.tsx |
| Admin link in sidebar (solo admin) | components/Layout.tsx |
| Modal AICallModal + UpgradeModal portal | CallPage, PlansPage |

### 🔒 RICHIEDE AZIONE ESTERNA (non è codice)
| Azione | Dove | Note |
|---|---|---|
| `ANTHROPIC_API_KEY` | Supabase → Settings → Edge Functions → Secrets | Chiave da Anthropic Console |
| `supabase functions deploy luminel-chat` | Terminale locale | Dopo aver aggiunto la chiave |
| Stripe account + prodotti | stripe.com | Premium €49, VIP €199, Elite €5.000 |
| Stripe webhook su Vercel | Vercel → /api/stripe-webhook | Da creare |
| Cron jobs Supabase | Supabase → Database → Cron | Vedi SQL sotto |
| Google OAuth | Google Cloud Console + Supabase Auth | |
| ElevenLabs VIP voice | Supabase Secrets: ELEVENLABS_API_KEY | |
| Email automation | Resend account | |

### ⚠️ PENDENTI IN CODICE
| Fix | Priorità |
|---|---|
| Voice counter → aggiornamento `monthly_voice_count` su Supabase | Media |
| Sync onboarding data → Supabase dopo signup | Alta |
| Errori auth in italiano | Media |
| Community likes → Supabase live | Media |
| Quest progress → RPC `add_xp()` al completamento | Alta |

---

## 1. INFRASTRUTTURA BASE

### 1.1 Supabase
- URL: `https://byszehdinjlejkzsbwvi.supabase.co`
- 12 tabelle: profiles, user_context, coaching_sessions, session_messages,
  quests, user_quest_progress, user_course_progress, daily_reality_quests,
  council_sessions, subscriptions, community_posts, community_likes
- Funzione `is_admin()` → SECURITY DEFINER, no loop RLS
- Funzione `add_xp(uid, xp)` → aggiorna level
- Funzione `update_user_streak(uid)` → chiamata al login
- Funzione `reset_daily_counts()` → cron mezzanotte
- Trigger `on_auth_user_created` → crea profilo automaticamente
- Trigger `on_subscription_change` → aggiorna `profiles.plan` da Stripe
- Admin: jaramichael@hotmail.com → role = 'admin'

### 1.2 Cron Jobs (da attivare su Supabase)
```sql
select cron.schedule(
  'reset-daily-counts',
  '0 0 * * *',
  'select reset_daily_counts()'
);
select cron.schedule(
  'reset-monthly-voice',
  '0 0 1 * *',
  'select reset_monthly_voice()'
);
```

### 1.3 Edge Function
- File: `supabase/functions/luminel-chat/index.ts`
- Limiti: free=10, premium=50, vip=999 msg/giorno
- Modelli: free=claude-haiku, premium=claude-sonnet, vip=claude-opus
- Salva in: `coaching_sessions` + `session_messages`
- Legge: `user_context` per memoria personalizzata
- Deploy: `supabase functions deploy luminel-chat`

---

## 2. AUTENTICAZIONE
- Signup → email conferma → trigger crea profilo
- Login → carica profilo + aggiorna streak
- Google OAuth → da configurare
- Password reset → via Supabase email
- `autoRefreshToken: true` → sessione persiste

---

## 3. PIANI & ACCESSO
```typescript
// Logica canAccess() usata nei componenti
free:    chat (10/die), 1 quest, 3 corsi, 1 voice demo/mese
premium: chat illimitata (50/die), tutte le quests, tutti i corsi, audio binaural
vip:     tutto + Il Consiglio, Voice HD (120 min), sessione Michael Jara 1/mese
```

---

## 4. STRIPE (da implementare)

### Prodotti da creare
| Piano | Prezzo | Stripe Price ID |
|---|---|---|
| Premium | €49/mese | da creare |
| Premium Annuale | €39/mese (€468/anno) | da creare |
| VIP | €199/mese | da creare |
| VIP Annuale | €159/mese (€1.908/anno) | da creare |
| Elite | €5.000/anno | da creare (one-time o subscription) |

### Webhook Events da gestire
- `customer.subscription.created` → INSERT `subscriptions`
- `customer.subscription.updated` → UPDATE `subscriptions`
- `customer.subscription.deleted` → UPDATE status='canceled'
- Trigger `on_subscription_change` → aggiorna `profiles.plan`

### Variables da aggiungere su Vercel
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...         ← solo server-side (Edge Function)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5. ARCHITETTURA FILE

```
c:\LuminelCoach\
├── App.tsx                        # Router + AuthProvider + ThemeProvider
├── index.tsx                      # Entry point + firma ASCII console
├── vercel.json                    # SPA rewrite per BrowserRouter
├── vite.config.ts                 # Build config (drop_console: false!)
├── .env.example                   # Template variabili ambiente
│
├── components/
│   ├── Layout.tsx                 # Sidebar + Mobile nav + Admin link
│   ├── Dashboard.tsx              # Home (mood→Supabase, piano da DB)
│   ├── ChatPage.tsx               # Chat AI → luminel-chat edge function
│   ├── CallPage.tsx               # Voice Coach + modal portals
│   ├── PlansPage.tsx              # Prezzi: €0/€49/€199
│   ├── WelcomeVideoModal.tsx      # Portal → centrato su body
│   ├── UpgradeModal.tsx           # Prezzi: €49/€199
│   ├── AICallModal.tsx            # Portal
│   ├── FOMOSection.tsx            # Hidden per VIP
│   └── Control/                  # Documenti operativi (questo file)
│       ├── LuminelAI_Brain.md
│       ├── LuminelAudit.md        ← SEI QUI
│       └── LuminelFinance.md
│
├── pages/
│   └── AdminDashboard.tsx         # /admin — solo per role='admin'
│
├── contexts/
│   ├── AuthContext.tsx            # Supabase Auth + profilo
│   └── ProgressContext.tsx        # XP, streak, level
│
└── services/
    ├── supabase.ts                # Client Supabase
    ├── adminService.ts            # KPI, CRM, AI Health
    ├── memoryService.ts           # user_context read/write
    └── councilService.ts          # 4 archetipi
```

---

## 6. CHECKLIST LANCIO

### Tecnica
- [ ] Edge Function deployata (`supabase functions deploy luminel-chat`)
- [ ] `ANTHROPIC_API_KEY` nei Supabase Secrets
- [ ] Stripe live mode attivo
- [ ] Webhook Stripe verificato con firma
- [ ] Cron jobs attivi
- [ ] Budget Anthropic impostato ($200/mese consigliato)
- [ ] Google OAuth testato

### Contenuto
- [ ] 3+ audio meditazioni su Supabase Storage (bucket: 'courses')
- [ ] Video benvenuto Michael Jara (`/public/videos/michael-jara-welcome.mp4`)
- [ ] Privacy Policy pubblicata (`/privacy`)
- [ ] Termini di Servizio pubblicati (`/terms`)

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

## 7. PRIORITÀ ESECUZIONE

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
  10. Fix bug critici da feedback
  11. Google OAuth
  12. Reality Quest AI giornaliera live

MESE 2
  13. ElevenLabs Voice VIP
  14. Community feed live
  15. Google Analytics / Posthog
```

---

*Insolito Experiences · Michael Jara · Cernusco sul Naviglio (MI)*
*Versione 1.1 · Aggiornato 30 Aprile 2026*