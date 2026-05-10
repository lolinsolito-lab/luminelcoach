# 03 — LUMINEL: FINANZA, CRESCITA & ADMIN
## Skill File per Claude Project · Insolito Experiences · Michael Jara
### Fonte di verità per: margini, proiezioni, meccaniche di crescita, Admin Dashboard

---

## STRUTTURA DEI COSTI

### Costi Fissi Mensili (~€80/mese — invariano con gli utenti)
| Voce | Costo/mese |
|---|---|
| Supabase Pro | $25 |
| Vercel Pro | $20 |
| ElevenLabs Starter (30K char/mese Voice VIP) | $22 |
| Dominio + email (luminelcoach.com + G Suite) | €15 |

### Costi Variabili per Utente
| Piano | API usata | Costo/utente/mese |
|---|---|---|
| Free | Haiku (5 msg/die) | ~€0.06 |
| Starter | Haiku (30 msg/die) | ~€0.12 |
| Premium | Sonnet (100 msg/die) | ~€0.70 |
| VIP | Opus (999 msg/die) | ~€1.80 |

> **Nota sui Prezzi (Lancio vs Regime):** I prezzi mostrati di seguito sono a "regime". Durante la fase di lancio (fino al 1° Settembre 2026), i prezzi effettivi sulla Landing Page sono inferiori (es. Starter €9.99, VIP €149). L'Edge Function ignora il prezzo: legge solo il campo `plan` (`starter`, `premium`, `vip`) aggiornato via webhook da Stripe, che è l'unico sistema delegato a calcolare l'importo corretto in base alla data.

### Margini per Piano
```
FREE (€0)
  Costo AI: ~€0.06/mese
  → Costo di acquisizione utente, non un problema

STARTER (€14.99/mese)
  Ricavo:        €14.99
  Costo AI:      €0.12
  Stripe fees:   €0.40
  Quota fissi:   €0.50
  MARGINE NETTO: ~€13.97 = 93% ✅

PREMIUM (€49/mese)
  Ricavo:        €49.00
  Costo AI:      €0.35
  Stripe fees:   €1.00
  Quota fissi:   €1.50
  MARGINE NETTO: ~€46.15 = 94% ✅

VIP SOVEREIGN (€199/mese)
  Ricavo:        €199.00
  Costo AI:      €1.80 (Opus)
  ElevenLabs:    €0.50
  Stripe fees:   €3.24
  Quota fissi:   €2.00
  MARGINE NETTO: ~€191.46 = 96% ✅

ELITE SOVEREIGN (€5.000/anno = €416/mese)
  Ricavo:        €416/mese
  Costo totale:  ~€10
  MARGINE NETTO: ~€406/mese = 97% ✅
```

**Break-even:** 2 utenti Premium o 1 utente VIP.
→ Luminel è redditizio dal primo utente pagante.

---

## PROIEZIONI FINANZIARIE

### Scenario Base (crescita organica)

```
MESE 1-2 — Beta privata
  Free: 50 · Starter: 10 · Premium: 5 · VIP: 1 · Elite: 0
  Ricavi: €593/mese · Costi: €106 · Utile: €487/mese

MESE 3-4 — Lancio soft
  Free: 200 · Starter: 40 · Premium: 20 · VIP: 5 · Elite: 1
  Ricavi: €2.990/mese · Costi: €214 · Utile: €2.776/mese

MESE 6 — Momentum
  Free: 500 · Starter: 100 · Premium: 80 · VIP: 20 · Elite: 5
  Ricavi: €11.479/mese · Costi: €592 · Utile: €10.887/mese

MESE 12 — Scala
  Free: 2.000 · Starter: 400 · Premium: 250 · VIP: 60 · Elite: 15
  Ricavi: €36.426/mese = €437.112 ARR
  Costi: €2.148/mese
  UTILE NETTO: €34.278/mese = 94% margine
```

### Conversion Rates Realistiche
```
Free → Starter:   10-15% (primo sblocco soft)
Starter → Premium: 8-12% (media SaaS coaching)
Premium → VIP:    15-20% (quando vedono Il Consiglio)
VIP → Elite:      2-5%   (solo i più committed)

Churn mensile:
  Premium: 5-8%
  VIP:     2-4%  (alta soddisfazione)
  Elite:   0-1%  (commitment annuale)
```

---

## PROTEZIONI FINANZIARIE ANTHROPIC

```
Alert a:     $50  → email notifica
Alert a:     $100 → email notifica
Hard limit:  $200/mese → API si ferma automaticamente

Quando raggiungi $200 = circa 3.000 utenti premium attivi
→ stai guadagnando ~€15.000/mese → aumenta il limite
```

**Rate limits Anthropic (salgono automaticamente con la spesa):**
| Tier | Soglia | Limite |
|---|---|---|
| Tier 1 | $0-100 spesi | 60 req/min |
| Tier 2 | $100-1.000 spesi | 1.000 req/min |
| Tier 3 | $1.000+ spesi | 5.000 req/min |

---

## MECCANICHE DI CRESCITA AUTOMATICA

*(già nel prodotto — zero intervento manuale)*

**1. STREAK LOOP**
Utente accumula streak → paura di perderla → rimane attivo → si converte a Premium per mantenere accesso.

**2. REALITY QUEST VIRALE**
Quest completata → genera card condivisibile → ogni post su Instagram = acquisizione gratuita.
Target: 1 condivisione ogni 5 quest completate.

**3. IL CONSIGLIO COME HOOK**
"Ho fatto analizzare il mio problema a 4 AI" → TikTok/Reel → CTA gratuita → conversione diretta VIP.

**4. IKIGAI RESULT SHAREABLE**
Dopo onboarding → card personalizzata Ikigai → altamente condivisibile su LinkedIn.

**5. LIVELLO SOVRANO**
Badge al livello 8 → certificato digitale scaricabile → valore percepito → condiviso → prova sociale.

### Email Automation (implementare con Resend)
```
DAY 1 SIGNUP:      "Benvenuto — la tua prima Reality Quest"
DAY 3 (no login):  "Il tuo streak rischia di azzerarsi"
DAY 7 FREE:        "Questa settimana X persone hanno completato Deep Transformation"
DAY 14 FREE:       "Hai raggiunto il 70% del limite messaggi — cosa faresti con 50?"
DAY 30 PREMIUM:    "Hai fatto X sessioni — sei pronto per Il Consiglio?"
```

---

## MECCANICHE DI CRESCITA MANUALE (Admin Dashboard → 1 click)

### 5 Tipi di Promo
```
PROMO 1 — Sconto temporaneo
  "48 ore: Premium a €29 invece di €49"
  Target: utenti free da +30 giorni senza conversione
  → Stripe coupon auto-generato dall'Admin

PROMO 2 — Trial gratuito
  "7 giorni VIP gratis — nessuna carta"
  Target: utenti con streak >10
  → Stripe trial period configurabile

PROMO 3 — Upgrade contestuale (automatico)
  "Hai usato tutti i tuoi 10 messaggi — passa a Premium ora al 40% di sconto"
  Trigger: quando limit_hit = true

PROMO 4 — Elite preview
  "Solo per i nostri migliori VIP: sessione gratuita con Michael Jara"
  Target: top 10% per engagement → genera referral di alta qualità

PROMO 5 — Seasonal
  "Settembre di trasformazione: VIP a €149 per sempre"
  Attivazione manuale → scade dopo X ore → FOMO massima
```

---

## AUTO-SCALING INFRASTRUTTURA

### Come scala (già configurato, zero azioni necessarie)
```
FRONTEND (Vercel)     → auto-scale globale, CDN incluso, 0→1000 utenti simultanei
DATABASE (Supabase)   → connection pooling (PgBouncer incluso)
AI (Anthropic)        → rate limits salgono automaticamente con la spesa
EDGE FUNCTION         → auto-scale da 0 a milioni di invocazioni
```

### Soglie di Upgrade
```
0-100 utenti:     tutto free tier → costo infrastruttura €0
100-500 utenti:   Supabase Pro → +$25/mese
500-2.000 utenti: Vercel Pro + Supabase Pro → +$45/mese totale
2.000+ utenti:    Supabase Team ($599/mese) + ottimizzazioni DB
```

---

## ADMIN DASHBOARD — MODULI

**URL:** `/admin` · Accesso: solo `role = 'admin'` (jaramichael@hotmail.com)

### Modulo 1 — FINANCE
```
KPI in tempo reale: MRR · ARR · Utenti paganti · % variazione mese
Breakdown: utenti e ricavi per piano (Free / Premium / VIP / Elite)
Costi AI questo mese: Anthropic + ElevenLabs + Infrastruttura
Margine netto %
Grafico MRR ultimi 12 mesi
Grafico Churn per piano
Previsione prossimi 3 mesi
```

### Modulo 2 — CRM
```
Lista utenti con filtri: piano · streak · ultima sessione · messaggi totali · XP · rischio churn
Profilo singolo: dati anagrafici · piano · storico sessioni · Reality Quest · fase Ikigai · pattern AI
Azioni su utente: upgrade/downgrade · invia coupon · aggiungi nota · segna VIP priority · invia email
```

### Modulo 3 — CLSM (Customer Lifecycle)
```
Funnel: Visitatori → Signup → Onboarding → 1° sessione → Premium → VIP
Segmenti automatici:
  "A rischio churn":     free >20 giorni senza login
  "Pronto per upgrade":  free con 8+ msg/giorno
  "VIP candidate":       premium con streak >14 giorni
  "Super user":          top 10% engagement
Azioni automatiche per segmento
```

### Modulo 4 — PROMO
```
Crea promozione: tipo · target · durata · codice coupon · Stripe auto · notifica
Lista promozioni attive con click, conversioni, ricavo generato
A/B test: testa 2 messaggi di upgrade o 2 prezzi → vincitore automatico
```

### Modulo 5 — AI HEALTH
```
Messaggi AI oggi / quota
Costo AI oggi
Errori API
Latenza media
Modelli usati: Haiku % · Sonnet % · Opus %
Budget tracker: speso / proiezione fine mese / hard limit / alert status
Qualità conversazioni: sessioni completate · quest generate · rate completamento quest
```

### Modulo 6 — CONTENT
```
Gestione corsi: modifica lezioni senza deploy · aggiungi corso · upload audio/video Storage
Reality Quest manuali: crea quest speciale per evento/stagione · assegna a segmento
Notifiche push: invia a tutti / segmento / programma
```

### Stack Admin
```typescript
Frontend: React + stesso Dark Luxury design system
Backend:  Supabase (stesso DB + tabelle admin aggiuntive)
Auth:     RLS con role='admin'
Stripe:   Dashboard API per coupon e subscriptions
Charts:   Recharts (già nel progetto)
```

### Tabelle Supabase aggiuntive per Admin
```sql
-- admin_notes  → note interne su utenti
-- promotions   → promozioni create dall'admin
-- ab_tests     → A/B test attivi
```

### File da creare per Admin
```
src/components/admin/
├── FinanceModule.tsx    ← MRR, ARR, costi
├── CRMModule.tsx        ← lista e profili utenti
├── CLSMModule.tsx       ← funnel e segmenti
├── PromoModule.tsx      ← promozioni e coupon Stripe
├── AIHealthModule.tsx   ← monitor API Anthropic
└── ContentModule.tsx    ← corsi e notifiche

src/services/
└── adminService.ts      ← chiamate Supabase admin
```

---

## RIEPILOGO ESECUTIVO

```
MODELLO ECONOMICO:
  Costo marginale per utente:  quasi zero
  Margine per piano pagante:   94-97%
  Break-even:                  2 utenti Premium

PROTEZIONI FINANZIARIE:
  Budget limit Anthropic:      $200/mese hard stop
  Limiti per piano:            già implementati nel codice
  Stripe webhook:              sincronizza piani automaticamente

CRESCITA:
  Automatica:    viral loops + email automation + FOMO mechanics
  Manuale:       Admin Dashboard promo a 1 click
  Infrastruttura: scala senza intervento fino a €30K MRR

ADMIN DASHBOARD — PRIORITÀ BUILD:
  1. Finance + AI Health   → sai sempre dove sei
  2. CRM                   → gestisci i clienti
  3. Promo Module          → attivi crescita a comando
  4. CLSM + Automazioni    → scala senza lavoro manuale
```

---

*Insolito Experiences · Michael Jara · P.IVA 14379200968*
*Documento interno — non distribuire · Aggiornare ogni trimestre*
