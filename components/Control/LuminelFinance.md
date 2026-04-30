# LUMINEL — FINANZA, CRESCITA & INFRASTRUTTURA
## Piano Operativo Completo v1.0
### Insolito Experiences · Michael Jara · P.IVA 14379200968

---

## INDICE

1. [Struttura dei Costi](#1-struttura-dei-costi)
2. [Proiezioni Finanziarie](#2-proiezioni-finanziarie)
3. [Crescita Esponenziale — Automatica e Manuale](#3-crescita-esponenziale)
4. [Auto-Scaling Infrastruttura](#4-auto-scaling-infrastruttura)
5. [Admin Dashboard — CRM + Finance + CLSM](#5-admin-dashboard)
6. [Roadmap Tecnica Admin](#6-roadmap-tecnica-admin)

---

## 1. STRUTTURA DEI COSTI

### Costi Fissi Mensili (invariano con gli utenti)

| Voce | Costo/mese | Note |
|---|---|---|
| Supabase Pro | $25 | Fino a 8GB DB, necessario da 500+ utenti |
| Vercel Pro | $20 | Custom domain + analytics |
| ElevenLabs Starter | $22 | 30.000 caratteri/mese Voice VIP |
| Dominio + email | €15 | luminelcoach.com + G Suite |
| **TOTALE FISSO** | **~€80/mese** | |

### Costi Variabili (crescono con gli utenti)

| Voce | Formula | Costo per utente |
|---|---|---|
| Anthropic API (Free) | 10 msg/giorno × Haiku | ~€0.06/utente/mese |
| Anthropic API (Premium) | 50 msg/giorno × Sonnet | ~€0.35/utente/mese |
| Anthropic API (VIP) | 100 msg/giorno × Opus | ~€1.80/utente/mese |
| Supabase Storage | 0.021$/GB | Trascurabile |
| Stripe fees | 1.5% + €0.25/transazione | Su ogni pagamento |

### Margine per Piano

```
FREE (€0)
  Ricavo:   €0
  Costo AI: ~€0.06/mese
  Margine:  -€0.06 ← acquisizione utente, non problema

PREMIUM (€49/mese)
  Ricavo:   €49
  Costo AI: ~€0.35
  Stripe:   ~€1.00
  Fisso:    ~€1.50 (quota parte)
  Margine:  ~€46.15 = 94% ✅

VIP SOVEREIGN (€199/mese)
  Ricavo:   €199
  Costo AI: ~€1.80 (Opus)
  ElevenLabs: ~€0.50
  Stripe:   ~€3.24
  Fisso:    ~€2.00 (quota parte)
  Margine:  ~€191.46 = 96% ✅

ELITE SOVEREIGN (€5.000/anno = €416/mese)
  Ricavo:   €416/mese
  Costo:    ~€10 (sessioni Michael + overhead)
  Margine:  ~€406/mese = 97% ✅
```

---

## 2. PROIEZIONI FINANZIARIE

### Scenario Base (crescita organica)

```
MESE 1-2 (Beta privata)
  Utenti free:    50
  Premium:         5  →  €245/mese
  VIP:             1  →  €199/mese
  Elite:           0
  ─────────────────────────────────
  RICAVI TOTALI:       €444/mese
  COSTI TOTALI:        €105/mese
  UTILE NETTO:         €339/mese

MESE 3-4 (Lancio soft)
  Utenti free:   200
  Premium:        20  →  €980/mese
  VIP:             5  →  €995/mese
  Elite:           1  →  €416/mese
  ─────────────────────────────────
  RICAVI TOTALI:     €2.391/mese
  COSTI TOTALI:        €210/mese
  UTILE NETTO:       €2.181/mese

MESE 6 (Momentum)
  Utenti free:   500
  Premium:        80  →  €3.920/mese
  VIP:            20  →  €3.980/mese
  Elite:           5  →  €2.080/mese
  ─────────────────────────────────
  RICAVI TOTALI:     €9.980/mese
  COSTI TOTALI:        €580/mese
  UTILE NETTO:       €9.400/mese

MESE 12 (Scala)
  Utenti free: 2.000
  Premium:       250  →  €12.250/mese
  VIP:            60  →  €11.940/mese
  Elite:          15  →   €6.240/mese
  ─────────────────────────────────
  RICAVI TOTALI:    €30.430/mese = €365.160 ARR
  COSTI TOTALI:      €2.100/mese
  UTILE NETTO:      €28.330/mese ← 93% margine
```

### Conversione Rates Realistiche

```
Free → Premium:    8-12% (media SaaS coaching)
Premium → VIP:     15-20% (quando vedono il Consiglio)
VIP → Elite:       2-5%  (solo i più committed)

Churn mensile atteso:
  Premium: 5-8%
  VIP:     2-4% (alta soddisfazione)
  Elite:   0-1% (commitment annuale)
```

### Break-even Point

```
Costi fissi: €80/mese
Break-even con SOLI Premium: 2 utenti paganti
Break-even con SOLI VIP: 1 utente pagante

→ Luminel è redditizio dal primo utente pagante.
```

---

## 3. CRESCITA ESPONENZIALE

### A. Crescita Automatica (senza intervento manuale)

**Meccaniche già nel prodotto:**

```
1. STREAK LOOP
   Utente accumula streak → ha paura di perderla
   → rimane attivo → si converte a Premium per mantenere accesso
   → retention automatica

2. REALITY QUEST VIRALE
   Quest completata → genera card condivisibile su Instagram
   → ogni post = acquisizione gratuita
   → target: 1 condivisione ogni 5 quest completate

3. IL CONSIGLIO COME HOOK
   "Ho fatto analizzare il mio problema a 4 AI" → TikTok/Reel
   → CTA gratuita sul prodotto
   → conversione diretta a VIP

4. IKIGAI RESULT SHAREABLE
   Dopo onboarding → card personalizzata del proprio Ikigai
   → altamente condivisibile su LinkedIn

5. LIVELLO SOVRANO
   Badge al livello 8 → certificato digitale scaricabile
   → valore percepito → condiviso → prova sociale
```

**Automazioni email (da implementare con Resend o Brevo):**

```
DAY 1 SIGNUP:     "Benvenuto, Michael — la tua prima Reality Quest"
DAY 3 (no login): "Il tuo streak rischia di azzerarsi"
DAY 7 FREE:       "Questa settimana X persone hanno completato Deep Transformation"
DAY 14 FREE:      "Hai raggiunto il 70% del limite messaggi — cosa faresti con 50?"
DAY 30 PREMIUM:   "Hai fatto X sessioni — sei pronto per Il Consiglio?"
```

### B. Crescita Manuale (Michael Jara interviene)

**Promo gestibili dall'Admin Dashboard:**

```
PROMO TIPO 1 — Sconto temporaneo
  "48 ore: Premium a €29 invece di €49"
  Attivabile: 1 click dall'Admin → Stripe coupon auto-generato
  Target: utenti free da +30 giorni senza conversione

PROMO TIPO 2 — Trial gratuito
  "7 giorni VIP gratis — nessuna carta"
  Attivabile: segmento specifico (es. utenti con streak >10)
  Stripe: trial period configurabile

PROMO TIPO 3 — Upgrade contestuale
  "Hai usato tutti i tuoi 10 messaggi — passa a Premium ora al 40% di sconto"
  Trigger: automatico quando limit_hit = true

PROMO TIPO 4 — Elite preview
  "Solo per i nostri migliori VIP: sessione gratuita con Michael Jara"
  Target: top 10% per engagement
  Genera referral di alta qualità

PROMO TIPO 5 — Seasonal
  "Settembre di trasformazione: VIP a €149 per sempre"
  Attivabile manualmente → scade dopo X ore
  FOMO massima
```

---

## 4. AUTO-SCALING INFRASTRUTTURA

### Come scala automaticamente (già configurato)

```
FRONTEND (Vercel)
  ✅ Auto-scale globale — nessuna configurazione
  ✅ CDN globale incluso
  ✅ 0→1000 utenti simultanei: nessuna azione necessaria
  Upgrade necessario: Vercel Pro ($20/mese) da 1000+ build/mese

DATABASE (Supabase)
  Free tier: fino a 500MB DB, 2 progetti
  Pro tier ($25/mese): 8GB DB, backups daily, branching
  → Upgrade da fare a 500+ utenti attivi

  Connection pooling: già gestito da Supabase (PgBouncer incluso)
  Read replicas: disponibili su Supabase Pro se necessario

AI (Anthropic)
  Rate limits per tier:
    Tier 1 ($0-100 spesi):    60 req/min
    Tier 2 ($100-1000 spesi): 1000 req/min
    Tier 3 ($1000+ spesi):    5000 req/min
  → Sale automaticamente con la spesa — zero configurazione

EDGE FUNCTION (Supabase)
  ✅ Auto-scale da 0 a milioni di invocazioni
  ✅ Cold start: ~200ms (accettabile)
  Nessuna configurazione necessaria
```

### Soglie di Upgrade Infrastruttura

```
0-100 utenti:    Tutto free tier → costo infrastruttura: €0
100-500 utenti:  Supabase Pro → +$25/mese
500-2000 utenti: Vercel Pro + Supabase Pro → +$45/mese
2000+ utenti:    Supabase Team ($599/mese) + ottimizzazioni DB
```

### Budget Limit Anthropic (protezione automatica)

```
Impostare su console.anthropic.com:

Alert a: $50  → email notifica
Alert a: $100 → email notifica  
Hard limit:   $200/mese → API si ferma automaticamente

Quando raggiungi $200: significa ~3.000 utenti premium attivi
→ stai guadagnando ~€15.000/mese → upgrade il limite
```

---

## 5. ADMIN DASHBOARD

### Cos'è e perché serve

L'Admin Dashboard è l'interfaccia privata di Michael Jara per:
- Vedere in tempo reale lo stato del business
- Gestire utenti e piani
- Attivare promozioni
- Monitorare la salute del sistema AI
- Analisi finanziaria in tempo reale

**URL:** `luminelcoach.vercel.app/admin` (protetto da ruolo admin)

### Moduli della Dashboard

---

#### 5.1 FINANCE MODULE

```
KPI in tempo reale:
  ┌─────────────────────────────────────────────┐
  │  MRR        ARR         Utenti paganti       │
  │  €2.391    €28.692        26 totali          │
  │  +18% mese  +240% anno    +3 questa settim.  │
  └─────────────────────────────────────────────┘

  Breakdown per piano:
  ├── Free:    200 utenti  │ €0
  ├── Premium:  20 utenti  │ €980/mese
  ├── VIP:       5 utenti  │ €995/mese
  └── Elite:     1 utente  │ €416/mese

  Costi AI questo mese:
  ├── Anthropic: $45.20
  ├── ElevenLabs: $12.50
  └── Infrastruttura: $45.00
  TOTALE COSTI: $102.70
  MARGINE NETTO: 95.7%

  Grafico MRR ultimi 12 mesi
  Grafico Churn per piano
  Previsione prossimi 3 mesi (basata su trend)
```

#### 5.2 CRM MODULE (Customer Relationship Management)

```
Lista utenti con filtri:
  ├── Piano attuale
  ├── Streak giorni
  ├── Ultima sessione
  ├── Messaggi totali
  ├── XP e livello
  └── Rischio churn (calcolato da AI)

Profilo singolo utente:
  ├── Dati anagrafici
  ├── Piano + data rinnovo
  ├── Storico sessioni (titoli, date)
  ├── Reality Quest attive/completate
  ├── Fase Ikigai attuale
  └── Pattern osservati da Luminel

Azioni su singolo utente:
  ├── Upgrade/downgrade piano manuale
  ├── Invia coupon personalizzato
  ├── Aggiungi nota interna
  ├── Segna come "VIP priority support"
  └── Invia email personalizzata
```

#### 5.3 CLSM MODULE (Customer Lifecycle Management)

```
Funnel di conversione:
  Visitatori → Signup → Onboarding → 1° sessione → Premium → VIP

  Step by step con %:
  100% visitatori
   68% completano signup
   45% completano onboarding
   38% fanno 1° sessione
   12% si convertono a Premium (entro 30 giorni)
    3% si convertono a VIP (entro 90 giorni)

Segmenti automatici:
  "A rischio churn":     free >20 giorni senza login
  "Pronto per upgrade":  free con 8+ messaggi/giorno
  "VIP candidate":       premium con streak >14 giorni
  "Super user":          qualsiasi piano, top 10% engagement

Azioni automatiche per segmento:
  A rischio churn → email riattivazione automatica
  Pronto upgrade  → in-app banner promo
  VIP candidate   → notifica personal a Michael
  Super user      → invito a Elite Sovereign
```

#### 5.4 PROMO MODULE

```
Crea nuova promozione:
  ├── Tipo: sconto% | trial | accesso funzionalità | combo
  ├── Target: tutti | segmento | utente singolo
  ├── Durata: data inizio/fine
  ├── Codice coupon: auto-generato o personalizzato
  ├── Stripe: crea coupon in automatico via API
  └── Notifica: email | in-app | push | tutti

Promozioni attive:
  Lista con click, conversioni, ricavo generato

A/B test:
  ├── Testa 2 messaggi di upgrade
  ├── Testa 2 prezzi diversi
  └── Vedi vincitore automaticamente dopo X giorni
```

#### 5.5 AI HEALTH MODULE

```
Monitoraggio in tempo reale:
  ├── Messaggi AI oggi: 347/1000 quota
  ├── Costo AI oggi: $4.20
  ├── Errori API: 0
  ├── Latenza media: 1.2s
  └── Modelli usati: Haiku 78% | Sonnet 18% | Opus 4%

Budget tracker:
  ├── Speso questo mese: $45.20
  ├── Proiezione fine mese: $67.50
  ├── Budget limit: $200
  └── Alert: ● Verde (22% del limite)

Qualità conversazioni:
  ├── Sessioni completate oggi: 23
  ├── Reality Quest generate: 18
  ├── Media messaggi per sessione: 8.4
  └── Rate completamento quest: 34%
```

#### 5.6 CONTENT MODULE

```
Gestione corsi:
  ├── Modifica contenuto lezioni (senza deploy)
  ├── Aggiungi nuovo corso
  ├── Upload audio/video su Supabase Storage
  └── Pubblica/nascondi corso

Reality Quest manuali:
  ├── Crea quest speciale per evento/stagione
  ├── Assegna a segmento utenti
  └── Monitora completamento

Notifiche push:
  ├── Invia a tutti
  ├── Invia a segmento
  └── Programma per data/ora
```

---

## 6. ROADMAP TECNICA ADMIN

### Come si costruisce tecnicamente

**Stack Admin:**
```
Frontend: React + stesso Dark Luxury design system
Backend:  Supabase (stesso DB — solo tabelle admin aggiuntive)
Auth:     Supabase RLS con ruolo 'admin' su profiles
Stripe:   Stripe Dashboard API per coupon e subscriptions
Charts:   Recharts (già disponibile nel progetto)
```

**Tabelle Supabase aggiuntive:**
```sql
-- Ruolo admin
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
-- admin_notes — note interne su utenti
-- promotions — promozioni create dall'admin
-- ab_tests — A/B test attivi
```

**Protezione route admin:**
```typescript
// Nel router: solo se user.role === 'admin'
// Michael Jara è l'unico admin
// Imposta manualmente su Supabase:
UPDATE profiles SET role = 'admin' WHERE email = 'jaramichael@hotmail.com';
```

### Fasi di costruzione Admin

```
FASE 1 — Foundation (1 settimana)
  ├── Route /admin protetta
  ├── Finance KPI in tempo reale (MRR, ARR, utenti per piano)
  ├── Lista utenti con filtri base
  └── AI Health monitor

FASE 2 — CRM (1 settimana)
  ├── Profilo utente dettagliato
  ├── Azioni manuali (upgrade, coupon)
  └── Note interne

FASE 3 — Automazioni (2 settimane)
  ├── Segmenti automatici
  ├── Email automatiche per lifecycle
  ├── Promo Module con Stripe API
  └── A/B test base

FASE 4 — Intelligence (in futuro)
  ├── Previsione churn con AI
  ├── Revenue forecasting
  └── Suggerimenti automatici "questo utente è pronto per VIP"
```

### File da creare per Admin

```
src/
├── pages/
│   └── AdminDashboard.tsx          ← router principale admin
├── components/admin/
│   ├── FinanceModule.tsx            ← MRR, ARR, costi
│   ├── CRMModule.tsx                ← lista e profili utenti
│   ├── CLSMModule.tsx               ← funnel e segmenti
│   ├── PromoModule.tsx              ← promozioni e coupon
│   ├── AIHealthModule.tsx           ← monitor API
│   └── ContentModule.tsx            ← corsi e notifiche
└── services/
    └── adminService.ts              ← chiamate Supabase admin
```

---

## RIEPILOGO ESECUTIVO

```
MODELLO ECONOMICO:
  Costo marginale per utente: quasi zero
  Margine per piano pagante:  94-97%
  Break-even:                 2 utenti Premium

PROTEZIONI FINANZIARIE:
  Budget limit Anthropic:     $200/mese hard stop
  Limiti per piano nel codice: già implementati
  Stripe webhook:             sincronizza piani automaticamente

CRESCITA:
  Automatica:   viral loops, email automation, FOMO mechanics
  Manuale:      Admin Dashboard promo a 1 click
  Infrastruttura: scala senza intervento fino a €30K MRR

ADMIN DASHBOARD:
  Priorità 1: Finance + AI Health (sai sempre dove sei)
  Priorità 2: CRM (gestisci i clienti)
  Priorità 3: Promo Module (attivi crescita a comando)
  Priorità 4: CLSM + Automazioni (scala senza lavoro manuale)
```

---

*Documento interno · Insolito Experiences · Michael Jara*
*Non distribuire · Aggiornare ogni trimestre*
