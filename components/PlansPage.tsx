import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, SparklesIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  BoltIcon, ChatBubbleLeftRightIcon, PhoneIcon, UserGroupIcon,
  FireIcon, ShieldCheckIcon, ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import UpgradeModal from "./UpgradeModal";

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────
// Prezzi aggiornati al posizionamento premium Luminel Coach Transformational
const MONTHLY = { free: 0, premium: 49, vip: 199 };
const YEARLY = { free: 0, premium: 39, vip: 159 }; // ~-20% annuale

type BillingCycle = "monthly" | "yearly";
type PlanId = "free" | "premium" | "vip";

interface PlanFeature { label: string; highlight?: boolean; }
interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  features: PlanFeature[];
  notIncluded?: string[];
  popular?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Explorer",
    tagline: "Inizia il viaggio",
    description: "Scopri il metodo Ikigai di Michael Jara. Perfetto per capire se Luminel fa per te.",
    accentColor: "#6A6560",
    accentBg: "rgba(255,255,255,0.025)",
    borderColor: "rgba(255,255,255,0.08)",
    features: [
      { label: "3 corsi gratuiti (7 giorni)" },
      { label: "5 sessioni Chat AI/mese" },
      { label: "Reality Quest — 1/settimana" },
      { label: "1 Quest attiva alla volta" },
      { label: "Community (solo lettura)" },
      { label: "1 demo vocale/mese" },
    ],
    notIncluded: [
      "Il Consiglio degli Archetipi",
      "Audio binaural",
      "Sessioni illimitate",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Trasformazione quotidiana",
    description: "Il percorso completo per chi è pronto a fare il salto. Tutti i corsi, sessioni illimitate e Reality Quest AI ogni giorno.",
    accentColor: "#C9A84C",
    accentBg: "rgba(201,168,76,0.05)",
    borderColor: "rgba(201,168,76,0.3)",
    popular: true,
    badge: "Più scelto",
    features: [
      { label: "Tutti i corsi Premium", highlight: true },
      { label: "Chat AI illimitata — Metodo Jara", highlight: true },
      { label: "Reality Quest AI — ogni giorno", highlight: true },
      { label: "Audio binaural Theta/Gamma", highlight: true },
      { label: "Quest illimitate in parallelo" },
      { label: "Community completa + gruppi" },
      { label: "Statistiche avanzate e journaling" },
      { label: "Priorità supporto 24/7" },
    ],
  },
  {
    id: "vip",
    name: "VIP Sovereign",
    tagline: "Il Consiglio degli Archetipi",
    description: "L'esperienza definitiva. Accesso esclusivo al Consiglio dei 4 Archetipi, Voice Coach illimitato e sessioni 1-to-1 con Michael Jara.",
    accentColor: "#9B74E0",
    accentBg: "rgba(155,116,224,0.05)",
    borderColor: "rgba(155,116,224,0.3)",
    badge: "Elite",
    features: [
      { label: "Tutto incluso in Premium", highlight: true },
      { label: "Il Consiglio degli Archetipi", highlight: true },
      { label: "Voice Coach illimitato HD", highlight: true },
      { label: "1 sessione mensile con Michael Jara", highlight: true },
      { label: "Corsi VIP esclusivi (Deep Transformation)", highlight: true },
      { label: "Reality Quest prioritaria + analisi AI" },
      { label: "Badge Sovereign + rank community" },
      { label: "Accesso anticipato ai nuovi contenuti" },
      { label: "Analisi emotiva post-sessione" },
    ],
  },
];

// ─── PRICE DISPLAY ────────────────────────────────────────────────────────────
function PriceDisplay({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const prices = cycle === "monthly" ? MONTHLY : YEARLY;
  const price = prices[plan.id];
  const monthlyPrice = MONTHLY[plan.id];
  const saving = monthlyPrice - price;

  return (
    <div className="mb-6">
      {price === 0 ? (
        <div className="flex items-baseline gap-1">
          <span className="text-[40px] font-semibold" style={{ color: "#F0EBE0", fontFamily: "'Cormorant Garamond', serif" }}>€0</span>
          <span className="text-[13px]" style={{ color: "#6A6560" }}>per sempre</span>
        </div>
      ) : (
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px]" style={{ color: "#6A6560" }}>€</span>
            <span className="text-[40px] font-semibold leading-none" style={{ color: "#F0EBE0", fontFamily: "'Cormorant Garamond', serif" }}>{price}</span>
            <span className="text-[13px]" style={{ color: "#6A6560" }}>/mese</span>
          </div>
          {cycle === "yearly" && saving > 0 && (
            <div className="mt-1.5 text-[11px] flex items-center gap-2">
              <span style={{ color: "#6A6560", textDecoration: "line-through" }}>€{monthlyPrice}/mese</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: "rgba(61,184,122,0.12)", color: "#3DB87A", border: "0.5px solid rgba(61,184,122,0.25)" }}>
                risparmi €{saving * 12}/anno
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({
  plan, cycle, isCurrentPlan, onSelect, delay,
}: {
  plan: Plan; cycle: BillingCycle; isCurrentPlan: boolean; onSelect: () => void; delay: number;
}) {
  const isFree = plan.id === "free";
  const btnStyle = isCurrentPlan
    ? { background: "rgba(255,255,255,0.04)", color: "#6A6560", border: "0.5px solid rgba(255,255,255,0.08)", cursor: "default" }
    : isFree
      ? { background: "rgba(255,255,255,0.06)", color: "#F0EBE0", border: "0.5px solid rgba(255,255,255,0.12)" }
      : { background: plan.accentColor, color: plan.id === "premium" ? "#06060F" : "#FFFFFF", border: "none" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className="relative flex flex-col rounded-2xl p-7 overflow-hidden"
      style={{ background: plan.accentBg, border: `0.5px solid ${plan.borderColor}`, height: "100%" }}
      whileHover={!isCurrentPlan ? { y: -3, borderColor: `${plan.accentColor}55` } : {}}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${plan.accentColor}55, transparent)` }} />

      {/* Glow orb */}
      {!isFree && (
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: `${plan.accentColor}08`, filter: "blur(40px)" }} />
      )}

      {/* Badge */}
      {plan.badge && (
        <div className="absolute top-5 right-5">
          <span className="text-[9px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${plan.accentColor}18`, color: plan.accentColor, border: `0.5px solid ${plan.accentColor}35` }}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="text-[9px] tracking-[0.22em] uppercase mb-1.5 opacity-70" style={{ color: plan.accentColor }}>
          {plan.tagline}
        </div>
        <h3 className="text-[22px] font-normal mb-1" style={{ color: "#F0EBE0", fontFamily: "'Cormorant Garamond', serif" }}>
          {plan.name}
        </h3>
        <p className="text-[12px] leading-relaxed" style={{ color: "#6A6560" }}>{plan.description}</p>
      </div>

      {/* Price */}
      <PriceDisplay plan={plan} cycle={cycle} />

      {/* Separator */}
      <div className="h-px mb-5" style={{ background: `rgba(255,255,255,0.06)` }} />

      {/* Features */}
      <div className="flex-1 flex flex-col gap-2.5 mb-6">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${plan.accentColor}22`, color: plan.accentColor }}>
              <CheckIcon className="w-2.5 h-2.5" />
            </div>
            <span className="text-[12px] leading-snug" style={{ color: f.highlight ? "#F0EBE0" : "#6A6560" }}>
              {f.label}
            </span>
          </div>
        ))}
        {plan.notIncluded?.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5 opacity-40">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[8px]" style={{ color: "#6A6560" }}>—</span>
            </div>
            <span className="text-[12px] leading-snug" style={{ color: "#6A6560" }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={!isCurrentPlan ? onSelect : undefined}
        disabled={isCurrentPlan}
        className="w-full py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all flex items-center justify-center gap-2"
        style={btnStyle}
      >
        {isCurrentPlan ? "Piano attuale" : isFree ? "Inizia gratis" : `Scegli ${plan.name}`}
        {!isCurrentPlan && !isFree && <ArrowRightIcon className="w-4 h-4" />}
      </button>

      {!isFree && !isCurrentPlan && (
        <p className="text-center text-[10px] mt-2.5" style={{ color: "#6A6560" }}>
          Cancella quando vuoi · Nessun vincolo
        </p>
      )}
    </motion.div>
  );
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
const COMPARE_ROWS = [
  { feature: "Sessioni Chat AI", free: "5/mese", premium: "Illimitate", vip: "Illimitate" },
  { feature: "Reality Quest AI", free: "1/settimana", premium: "Ogni giorno", vip: "Prioritaria + analisi" },
  { feature: "Il Consiglio degli Archetipi", free: false, premium: false, vip: true },
  { feature: "Corsi disponibili", free: "3 gratuiti", premium: "Tutti (Premium)", vip: "Tutti incl. VIP" },
  { feature: "Audio binaural Theta/Gamma", free: false, premium: true, vip: true },
  { feature: "Voice Coach", free: "1 demo/mese", premium: false, vip: "Illimitato HD" },
  { feature: "Sessioni con Michael Jara", free: false, premium: false, vip: "1/mese" },
  { feature: "Community", free: "Lettura", premium: "Completa + gruppi", vip: "Completa + badge Sovereign" },
  { feature: "Supporto", free: "Email", premium: "Prioritario", vip: "Dedicato" },
];

function CompareTable() {
  const col = (val: string | boolean, accent?: string) => {
    if (val === false) return <span style={{ color: "#6A6560" }}>—</span>;
    if (val === true) return (
      <div className="w-5 h-5 rounded-full flex items-center justify-center mx-auto"
        style={{ background: `${accent}22`, color: accent }}>
        <CheckIcon className="w-3 h-3" />
      </div>
    );
    return <span className="text-[12px]" style={{ color: "#F0EBE0" }}>{val}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="mt-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-[9px] tracking-[0.22em] uppercase mb-2 opacity-70" style={{ color: "#C9A84C" }}>Confronto</div>
        <h2 className="font-serif text-[26px] font-normal" style={{ color: "#F0EBE0" }}>
          Cosa è incluso in ogni piano
        </h2>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="grid grid-cols-4 px-5 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div className="text-[11px]" style={{ color: "#6A6560" }}>Funzionalità</div>
          {[["Explorer", "#6A6560"], ["Premium", "#C9A84C"], ["VIP Sovereign", "#9B74E0"]].map(([name, color]) => (
            <div key={name} className="text-center text-[11px] font-medium" style={{ color }}>{name}</div>
          ))}
        </div>
        {/* Rows */}
        {COMPARE_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-4 px-5 py-3.5 items-center"
            style={{ borderBottom: i < COMPARE_ROWS.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
            <div className="text-[12px]" style={{ color: "#6A6560" }}>{row.feature}</div>
            <div className="text-center">{col(row.free, "#6A6560")}</div>
            <div className="text-center">{col(row.premium, "#C9A84C")}</div>
            <div className="text-center">{col(row.vip, "#9B74E0")}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Posso cancellare quando voglio?", a: "Sì. Non ci sono contratti o vincoli. Cancelli in qualsiasi momento dal pannello Settings → Abbonamento. L'accesso rimane attivo fino alla fine del periodo pagato." },
  { q: "Cosa sono Il Consiglio degli Archetipi?", a: "È la killer feature VIP — 4 intelligenze AI distinte (L'Alchimista, Lo Stratega, Il Guerriero, Il Sovrano) che analizzano la tua sfida da 4 prospettive diverse e producono un Master Plan personalizzato." },
  { q: "L'AI Coach sostituisce un vero coach?", a: "No. Luminel AI Coach eroga il metodo di Michael Jara 24/7 ed è uno strumento di sviluppo personale ai sensi della Legge 4/2013. Non è un servizio medico o psicologico. Per il supporto diretto di Michael, il piano VIP include 1 sessione mensile." },
  { q: "Il piano annuale si rinnova automaticamente?", a: "Sì, come il mensile. Riceverai un'email 7 giorni prima del rinnovo. Puoi cancellare in qualsiasi momento prima della scadenza." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      className="mt-16 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-[24px] font-normal" style={{ color: "#F0EBE0" }}>Domande frequenti</h2>
      </div>
      <div className="flex flex-col gap-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-xl overflow-hidden"
            style={{ border: `0.5px solid ${open === i ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`, background: open === i ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-left transition-all">
              <span className="text-[13px] font-medium" style={{ color: "#F0EBE0" }}>{faq.q}</span>
              <span className="text-[18px] flex-shrink-0 ml-3 transition-transform"
                style={{ color: "#C9A84C", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }} className="overflow-hidden">
                  <p className="px-5 pb-4 text-[12px] leading-relaxed" style={{ color: "#6A6560" }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
const TRUST = [
  { icon: <ShieldCheckIcon className="w-4 h-4" />, label: "Pagamento sicuro Stripe" },
  { icon: <FireIcon className="w-4 h-4" />, label: "Server EU · GDPR compliant" },
  { icon: <UserGroupIcon className="w-4 h-4" />, label: "2.000+ utenti attivi" },
  { icon: <StarIcon className="w-4 h-4" />, label: "4.9/5 rating medio" },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const PlansPage: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"premium" | "vip">("premium");

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") return;
    setSelectedPlanType(planId as "premium" | "vip");
    setShowUpgradeModal(true);
  };

  const currentPlan: string = (user as any)?.plan ?? "free";

  return (
    <div className="min-h-screen pb-24">
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} planType={selectedPlanType} />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "rgba(201,168,76,0.04)", filter: "blur(120px)" }} />
        <div className="absolute top-1/2 -right-20 w-[300px] h-[400px] rounded-full"
          style={{ background: "rgba(155,116,224,0.04)", filter: "blur(100px)" }} />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <p className="text-[9px] tracking-[0.24em] uppercase mb-3 opacity-70" style={{ color: "#C9A84C" }}>
          Insolito Experiences · Legge 4/2013
        </p>
        <h1 className="font-serif text-[40px] md:text-[50px] font-normal leading-tight mb-3" style={{ color: "#F0EBE0" }}>
          Scegli il tuo <em className="italic" style={{ color: "#C9A84C" }}>percorso</em>
        </h1>
        <p className="text-[14px] max-w-md mx-auto leading-relaxed mb-8" style={{ color: "#6A6560" }}>
          Investi su te stesso con il metodo Ikigai di Michael Jara.<br />
          Cancella quando vuoi. Nessun impegno.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center p-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
          {(["monthly", "yearly"] as BillingCycle[]).map(c => (
            <button key={c} onClick={() => setBillingCycle(c)}
              className="px-6 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all flex items-center gap-2"
              style={billingCycle === c
                ? { background: "#C9A84C", color: "#06060F" }
                : { background: "transparent", color: "#6A6560" }}>
              {c === "monthly" ? "Mensile" : "Annuale"}
              {c === "yearly" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: billingCycle === "yearly" ? "rgba(0,0,0,0.15)" : "rgba(61,184,122,0.15)", color: billingCycle === "yearly" ? "#06060F" : "#3DB87A" }}>
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Trust bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-8 flex-wrap mb-12">
        {TRUST.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]" style={{ color: "#6A6560" }}>
            <span style={{ color: "#C9A84C" }}>{t.icon}</span>{t.label}
          </div>
        ))}
      </motion.div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto px-4 items-start">
        {PLANS.map((plan, idx) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={billingCycle}
            isCurrentPlan={currentPlan === plan.id}
            onSelect={() => handleSelectPlan(plan.id)}
            delay={idx * 0.1}
          />
        ))}
      </div>

      {/* Comparison table */}
      <CompareTable />

      {/* FAQ */}
      <FAQ />

      {/* Bottom CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="mt-16 text-center">
        <p className="text-[12px] max-w-lg mx-auto leading-relaxed" style={{ color: "#6A6560" }}>
          Luminel è una piattaforma di sviluppo personale ai sensi della Legge 4/2013.<br />
          Non è un servizio medico o psicologico · Pagamenti gestiti da Stripe · Server EU
        </p>
      </motion.div>
    </div>
  );
};

export default PlansPage;