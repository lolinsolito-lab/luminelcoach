# LUMINEL COACH TRANSFORMATIONAL
## Audit Tecnico & Strategico Completo — Aprile 2026
### Insolito Experiences · Michael Jara · P.IVA 14379200968

---

## 1. STATO INFRASTRUTTURA

| Componente | Stato | Note |
|---|---|---|
| Supabase DB | ✅ ATTIVO | Schema v3 eseguito · 12 tabelle · Frankfurt EU |
| Supabase Auth | ✅ ATTIVO | Email/password + Google OAuth pronto |
| Edge Function AI | ⚠️ DEPLOY MANCANTE | File scritto, non ancora deployato |
| Anthropic API Key | ❌ NON CONFIGURATA | Da aggiungere nei segreti Supabase |
| Stripe | ❌ NON CONFIGURATO | Price IDs mancanti |
| ElevenLabs | ❌ NON CONFIGURATO | Per Voice Coach VIP |
| Vercel Deploy | ✅ luminelcoach.vercel.app | Attivo |
| .env | ✅ CORRETTO | Solo SUPABASE_URL + ANON_KEY |

---

## 2. AUDIT PAGINE — MOCK vs REALE

### ✅ REALE (Supabase collegato)
- **AuthContext.tsx** — login/signup/logout/Google OAuth reali
- **LoginPage.tsx** — Supabase Auth reale, errori in italiano
- **SignupPage.tsx** — registrazione reale + schermata conferma email
- **ForgotPasswordPage.tsx** — reset password via Supabase email
- **WelcomePage.tsx** — onboarding 7 step, salva dati al signup
- **ProfilePage / SettingsPage** — `updateUserProfile()` salva su `profiles` table

### ⚠️ PARZIALMENTE REALE
| Pagina | Cosa è reale | Cosa è mock |
|---|---|---|
| **Dashboard** | `streak`, `xp`, `level` da Supabase via `useProgress` | Stats bar (minuti, rank) sono mock/calcolati localmente |
| **ChatPage** | UI completa, limits check, session history structure | AI risponde con mock (Anthropic non configurata) |
| **CoursesPage** | UI, filtri, lock per piano | Dati corsi hardcoded in `coursesData.ts` |
| **CourseDetailPage** | Progress tracking localStorage → Supabase pronto | `audioUrl/videoUrl` vuoti, player è placeholder |
| **CalmView** | Mood selector, filtri, lock piano | `audioUrl` vuoti, nessun audio reale |
| **MeditationView** | Timer funzionante, filtri, lock piano | `audioUrl` vuoti, nessun audio reale |
| **QuestsPage** | 7 quests con contenuto reale, modal | Progress non salvato su Supabase |
| **CommunityPage** | Feed con like funzionale | Utenti e post sono mock statici |
| **CallPage** | UI completa, pricing corretto | Player vocale non funzionante (ElevenLabs mancante) |
| **CouncilPage** | 4 archetipi, VIP lock, UI debate | Risposte archetipi sono mock |
| **CalendarPage** | UI eventi completa | Nessuna persistenza su Supabase |
| **PlansPage** | Prezzi corretti (€0/€49/€199) | Stripe non configurato, upgrade non reale |

### ❌ COMPLETAMENTE MOCK
- **ProgressTracking** — dati tutti hardcoded
- **Community feed** — utenti fittizi
- **Leaderboard** — posizioni fisse
- **Reality Quest AI** — testo fisso, non generato da Claude

---

## 3. PIANO → FUNZIONALITÀ (come funziona oggi)

```
FREE (€0)
├── Chat AI: 10 msg/giorno (limite in Edge Function — attivo quando deployata)
├── Corsi: 3 gratuiti (mindfulness-intro, morning-spark, gratitude-journal)
├── Calm Space: categorie free
├── Quests: max 1 attiva
├── Community: sola lettura
├── Voice Coach: 1 demo/mese
├── Il Consiglio: ❌ bloccato (UI mostra lock)
└── Reality Quest: generica (non AI personalizzata)

PREMIUM (€49/mese)
├── Chat AI: 50 msg/giorno
├── Corsi: tutti i Premium
├── Calm Space: tutte le categorie
├── Quests: illimitate in parallelo
├── Community: completa + gruppi
├── Voice Coach: ❌ ancora bloccato (solo VIP)
├── Il Consiglio: ❌ bloccato
└── Reality Quest: AI giornaliera

VIP SOVEREIGN (€199/mese)
├── Chat AI: illimitata (claude-opus-4-6)
├── Corsi: tutti incluso Deep Transformation
├── Il Consiglio degli Archetipi: ✅ sbloccato
├── Voice Coach HD: ✅ ElevenLabs
├── Reality Quest: prioritaria + analisi AI
├── Badge Sovereign + rank community
└── 1 sessione mensile con Michael Jara
```

**PROBLEMA CRITICO:** Il sistema di piani esiste nell'UI ma non è enforced lato server perché:
1. Edge Function non deployata → nessun limite reale
2. Stripe non configurato → `upgradePlan()` aggiorna solo il DB manualmente
3. `user.plan` viene letto dal DB ma non verificato contro un abbonamento attivo

---

## 4. CONNESSIONI IN TEMPO REALE

| Funzionalità | Real-time? | Come |
|---|---|---|
| Auth session | ✅ | Supabase `onAuthStateChange` |
| Profilo utente | ✅ | Caricato al login, aggiornato on demand |
| Streak giorni | ✅ | RPC `update_user_streak` al login |
| XP / Livello | ✅ | RPC `add_xp` + `calculate_level` |
| Messaggi chat | ⚠️ | Salvati su `session_messages` MA AI è mock |
| Progresso corsi | ⚠️ | localStorage → Supabase pronto ma non attivo |
| Community likes | ⚠️ | Logica presente, non collegata a Supabase |
| Reality Quest | ❌ | Testo fisso, non da Claude |
| Mood → context | ❌ | `updateUserMood()` scritto ma non chiamato |

---

## 5. COSA MANCA PER ANDARE LIVE (priorità)

### 🔴 CRITICO (blocca il business)
1. **Deploy Edge Function** `supabase functions deploy luminel-chat`
2. **ANTHROPIC_API_KEY** nei segreti Supabase
3. **Stripe** — 3 price IDs + webhook che aggiorna `profiles.plan`
4. **Email template** Supabase → dominio Vercel per reset password

### 🟡 IMPORTANTE (degrada esperienza)
5. **Audio/Video corsi** — caricare MP3 su Supabase Storage
6. ✅ **progressService.ts** — COMPLETATO: collegato CourseDetailPage e Dashboard a Supabase in tempo reale.
7. **Reality Quest AI** — generare daily quest da Claude basandosi su `user_context`
8. **Community** — collegare post/like a tabelle reali

### 🟢 NICE TO HAVE (dopo lancio)
9. ElevenLabs per Voice Coach VIP
10. Google OAuth (configurare in Supabase + Google Cloud Console)
11. Cron job per `reset_daily_counts()` su Supabase

---

## 6. LA SAAS È PASSIVA O ATTIVA?

**Attuale: 40% attiva, 60% passiva**

```
PASSIVA (statica):
- Corsi: contenuto fisso, nessuna personalizzazione
- Community: feed finto
- Reality Quest: testo hardcoded
- Raccomandazioni: sempre le stesse

ATTIVA (dinamica):
- Mood selector → risposta Luminel contestuale ✅
- Mood → Reality Quest adattata ✅
- Mood → Accesso Rapido riordinato ✅
- Streak + XP reali da Supabase ✅
- Limiti piano su Edge Function ✅ (quando deployata)
- Welcome Modal prima visita ✅
- FOMO Section con countdown live ✅
- Timer countdown Reality Quest ✅
```

**Per diventare 90% attiva:**
- Claude genera Reality Quest personalizzata ogni mattina basandosi su `user_context`
- Claude aggiorna `user_context.patterns` dopo ogni sessione
- Corsi suggeriti cambiano in base al mood + progresso
- Community mostra attività reale degli utenti

---

## 7. ICONA AI — SERVE ANCORA?

**No, non serve un'icona AI separata.** Hai già:
- Chat AI (testo) → ChatPage
- Voice AI (voce) → CallPage
- Council AI (4 archetipi) → CouncilPage
- Reality Quest AI (azione) → Dashboard
- AI nei corsi (commenti personalizzati) → da implementare

L'AI è **pervasiva** nell'esperienza, non un bottone separato. Aggiungere un'icona "AI" sarebbe un downgrade visivo e concettuale.

---

## 8. DIFFERENZIAZIONE DALLA CONCORRENZA ITALIANA

### Competitor italiani attuali
| App | Debolezza che Luminel sfrutta |
|---|---|
| Meditamente | Solo meditazione, nessuna identità, design mediocre |
| Wipp | Mindfulness generica, nessun coaching, no AI |
| BetterHelp IT | B2C terapia, non coaching identitario, costoso |
| Coach italiani su Instagram | Nessuna app, nessuna scalabilità, tutto manuale |

### Vantaggi esclusivi di Luminel
1. **Unico in italiano** con AI multi-archetipo (Il Consiglio)
2. **Dark Luxury Design** — nessun competitor ha questo livello estetico
3. **Ikigai applicato** — non teoria giapponese generica ma metodo pratico
4. **Reality Quest** — azione quotidiana misurabile (nessuno lo fa così)
5. **Architettura Zero-Touch** — Michael Jara non è il collo di bottiglia
6. **Legge 4/2013** — compliance legale che gli altri ignorano

---

## 9. COSA PUÒ FAR DIVENTARE LUMINEL VIRALE IN ITALIA

### Meccaniche virali da attivare

**A. Reality Quest shareable**
Ogni quest completata genera una card visiva da condividere su Instagram Stories:
`"Ho preso la decisione che rimandavo da 3 settimane. #RealityQuest #Luminel"`
→ User-generated content gratuito, ogni utente è un ambassador

**B. Il Consiglio come hook**
Video TikTok/Reel: "Ho fatto analizzare il mio problema a 4 AI diverse"
→ Mostra screenshot del Consiglio → CTA "Prova gratis su Luminel"
→ Curiosità + FOMO immediata

**C. Streak pubblica**
"Marco R. ha 47 giorni consecutivi su Luminel" → banner in Community
→ Competizione sana, notifica push agli amici

**D. Ikigai risultato shareable**
Dopo l'onboarding, Claude genera una card visiva con il tuo Ikigai personale
→ "Il mio Ikigai secondo l'AI: [risultato]" → massimamente condivisibile

**E. Livello Sovrano**
Badge esclusivo per chi raggiunge livello 8 → certificato digitale scaricabile
→ Valore percepito alto, condiviso su LinkedIn

### Canali di acquisizione prioritari Italia
1. **TikTok/Reels** — contenuto trasformativo + preview Il Consiglio (costo: €0)
2. **LinkedIn** — "Ho costruito un SaaS di coaching AI in italiano" (storia fondatore)
3. **Newsletter** — 5.000 iscritti prima del lancio pagato
4. **Partnership** — coach italiani esistenti che usano Luminel come tool

---

## 10. ROADMAP LANCIO SUGGERITA

```
SETTIMANA 1-2 (Ora)
├── Deploy Edge Function + ANTHROPIC_API_KEY
├── Configurare Stripe (€49 + €199)
├── Fix encoding "Â·" in plan-card sidebar
└── Test completo flusso signup → dashboard → upgrade

SETTIMANA 3-4 (Beta)
├── 20-50 beta tester privati
├── Caricare almeno 3 audio meditazioni su Supabase Storage
├── Attivare Reality Quest AI (Claude genera ogni mattina)
└── Google OAuth configurato

MESE 2 (Lancio soft)
├── Stripe webhook attivo
├── Community feed reale (prime 100 persone)
├── Contenuti TikTok con preview Il Consiglio
└── Primo corso completo con audio reale

MESE 3+ (Scala)
├── ElevenLabs Voice Coach
├── Reality Quest shareable
├── Ikigai card shareable
└── Streak pubblica in Community
```

---

## PUNTEGGIO AUDIT

| Area | Voto | Note |
|---|---|---|
| Design/UX | 9/10 | Dark Luxury eccellente, superiore ai competitor |
| Architettura tecnica | 7/10 | Solida, manca deploy Edge Function |
| Contenuto reale | 5/10 | Mancano audio, video, AI generativa attiva |
| Business model | 8/10 | Prezzi corretti, struttura Zero-Touch valida |
| Compliance legale | 9/10 | Legge 4/2013, GDPR, EU AI Act dichiarati |
| Potenziale virale | 8/10 | Meccaniche ci sono, da attivare |
| **MEDIA** | **7.7/10** | Pronto per beta, non ancora per lancio pubblico |

---

*Documento generato per audit interno Luminel Coach Transformational*
*Insolito Experiences · Cernusco sul Naviglio (MI) · Aprile 2026*