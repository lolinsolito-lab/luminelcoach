import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, StarIcon } from "@heroicons/react/24/solid";
import {
  ShieldCheckIcon, FireIcon, UserGroupIcon,
  ArrowRightIcon, LockClosedIcon, SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import UpgradeModal from "./UpgradeModal";

// ─── DARK LUXURY TOKENS ───────────────────────────────────────────────────────
const DL = {
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
  guer: "#D4603A", white: "#F0EBE0", muted: "#6A6560",
  glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
  green: "#10B981", surface: "#0D0D20",
};

// ─── PRICING ─────────────────────────────────────────────────────────────────
const LAUNCH_PRICES = { starter: 9.99, premium: 49, vip: 149 };
const FULL_PRICES = { starter: 14.99, premium: 67, vip: 199 };

// ─── PIANI ───────────────────────────────────────────────────────────────────
const PIANI = [
  {
    id: "free",
    identity: "L'Esploratore",
    name: "Explorer",
    tagline: "Assaggia prima di scegliere",
    promise: "Scopri se Luminel fa per te — senza impegni.",
    color: DL.muted,
    bg: "rgba(255,255,255,0.02)",
    border: DL.glassB,
    launchPrice: 0,
    fullPrice: 0,
    features: [
      { t: "5 messaggi AI al giorno", h: false },
      { t: "Ikigai Assessment completo", h: false },
      { t: "Preview prime 2 lezioni di ogni corso", h: false },
      { t: "1 Reality Quest base/settimana", h: false },
      { t: "Community (solo lettura)", h: false },
      { t: "1 demo Voice Coach/mese", h: false },
    ],
    locked: ["Memoria AI tra sessioni", "Corsi completi", "Calm Space avanzato", "Il Consiglio"],
    cta: "Inizia gratis",
    ctaStyle: "outline",
  },
  {
    id: "starter",
    identity: "Il Primo Passo",
    name: "Starter",
    tagline: "Per chi vuole provare sul serio",
    promise: "Non stai comprando messaggi. Stai comprando 30 domande al giorno che nessuno ti ha mai fatto.",
    color: DL.stra,
    bg: "rgba(74,158,212,0.05)",
    border: "rgba(74,158,212,0.25)",
    launchPrice: LAUNCH_PRICES.starter,
    fullPrice: FULL_PRICES.starter,
    features: [
      { t: "30 messaggi AI al giorno", h: true },
      { t: "Modalità Coach + Shadow Work", h: true },
      { t: "3 corsi base completi con audio", h: true },
      { t: "Reality Quest giornaliera con tracking", h: true },
      { t: "Memoria AI semplice tra sessioni", h: false },
      { t: "Calm Space base + 1 binaural", h: false },
      { t: "Community completa", h: false },
    ],
    cta: "Diventa Starter",
    ctaStyle: "color",
  },
  {
    id: "premium",
    identity: "Il Cercatore",
    name: "Premium",
    tagline: "La trasformazione quotidiana",
    promise: "Un coach umano: €100/ora. Luminel: €49/mese. Illimitato nel tempo.",
    color: DL.gold,
    bg: "rgba(201,168,76,0.06)",
    border: "rgba(201,168,76,0.3)",
    launchPrice: LAUNCH_PRICES.premium,
    fullPrice: FULL_PRICES.premium,
    popular: true,
    badge: "Più scelto",
    features: [
      { t: "100 messaggi AI/giorno con Claude Sonnet", h: true },
      { t: "Tutti i corsi completi con audio", h: true },
      { t: "Tutte le modalità (Coach+Shadow+Strategia)", h: true },
      { t: "Memoria AI profonda con pattern behavior", h: true },
      { t: "Calm Space + Binaural completo", h: true },
      { t: "Reality Quest AI ogni giorno + analytics", h: false },
      { t: "Voice Coach 3 sessioni/mese", h: false },
      { t: "Community premium + gruppi esclusivi", h: false },
    ],
    cta: "Diventa Premium",
    ctaStyle: "gold",
  },
  {
    id: "vip",
    identity: "Il Sovrano",
    name: "VIP Sovereign",
    tagline: "Senza limiti. Senza compromessi.",
    promise: "Non stai entrando in un piano. Stai entrando nell'ecosistema di chi non accetta versioni ridotte di sé.",
    color: DL.alch,
    bg: "rgba(155,116,224,0.06)",
    border: "rgba(155,116,224,0.3)",
    launchPrice: LAUNCH_PRICES.vip,
    fullPrice: FULL_PRICES.vip,
    badge: "Elite",
    features: [
      { t: "Messaggi illimitati con Claude Opus", h: true },
      { t: "Il Consiglio dei 4 Archetipi", h: true },
      { t: "Voice Coach illimitato HD — voce Michael Jara", h: true },
      { t: "Corsi VIP esclusivi con video di Michael Jara", h: true },
      { t: "1 sessione live con Michael Jara/mese", h: true },
      { t: "Report settimanale AI del tuo percorso", h: false },
      { t: "Badge Sovereign + rank community", h: false },
      { t: "Accesso anticipato nuovi contenuti", h: false },
      { t: "Analisi emotiva post-sessione", h: false },
    ],
    cta: "Diventa Sovereign",
    ctaStyle: "alch",
  },
];

// ─── CONFRONTO TIER ───────────────────────────────────────────────────────────
const COMPARE = [
  { f: "Messaggi AI/giorno", free: "5", starter: "30", premium: "100", vip: "Illimitati" },
  { f: "Modello AI", free: "Haiku", starter: "Haiku", premium: "Sonnet", vip: "Opus (migliore)" },
  { f: "Corsi disponibili", free: "Preview 2L", starter: "3 base", premium: "Tutti + audio", vip: "Tutti + VIP esclusivi" },
  { f: "Video Michael Jara", free: false, starter: false, premium: false, vip: true },
  { f: "Memoria AI tra sessioni", free: false, starter: "Base", premium: "Profonda", vip: "Profonda + pattern" },
  { f: "Reality Quest", free: "1/sett", starter: "Ogni giorno", premium: "AI + analytics", vip: "Prioritaria + analisi" },
  { f: "Calm Space & Binaural", free: "Base", starter: "Base", premium: "Completo", vip: "Completo" },
  { f: "Voice Coach", free: "1 demo/mese", starter: false, premium: "3 sess/mese", vip: "Illimitato HD" },
  { f: "Voce Michael Jara", free: false, starter: false, premium: false, vip: true },
  { f: "Il Consiglio Archetipi", free: false, starter: false, premium: false, vip: true },
  { f: "Sessione con Michael Jara", free: false, starter: false, premium: false, vip: "1/mese" },
  { f: "Community", free: "Lettura", starter: "Completa", premium: "Premium+gruppi", vip: "Sovereign+badge" },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Perché Luminel e non ChatGPT o altri AI?",
    a: "ChatGPT risponde. Luminel trasforma. La differenza è il Metodo Jara: memoria tra sessioni, Reality Quest reali, Il Consiglio dei 4 Archetipi, corsi strutturati. Non stai comprando un chatbot — stai comprando un percorso di crescita con una metodologia provata.",
  },
  {
    q: "Cos'è il prezzo di lancio Fondatori?",
    a: "Chi entra adesso mantiene il prezzo di lancio per sempre — non è uno sconto temporaneo, è un privilegio permanente. Da settembre 2026 i prezzi salgono ai prezzi standard. Il tuo account viene marcato con il badge esclusivo ♦ Fondatore.",
  },
  {
    q: "Cos'è Il Consiglio degli Archetipi?",
    a: "Esclusivo VIP. Quattro intelligenze AI con personalità distinte — L'Alchimista, Lo Stratega, Il Guerriero, Il Sovrano — analizzano la tua sfida da prospettive opposte. La tensione tra loro è il valore: non il consenso, ma il confronto che ti forza a scegliere.",
  },
  {
    q: "Il Voice Coach VIP — come funziona esattamente?",
    a: "Parli con Luminel a voce. Luminel ti risponde con la voce sintetica HD di Michael Jara (ElevenLabs). Non è un recording — è una sessione AI vocale in tempo reale con la metodologia Jara. Illimitato per i VIP.",
  },
  {
    q: "Posso cancellare quando voglio?",
    a: "Sempre. Nessun vincolo, nessuna penale. Cancelli da Settings → Abbonamento. L'accesso rimane attivo fino alla fine del periodo pagato.",
  },
  {
    q: "I corsi sono diversi per ogni piano?",
    a: "Sì. Explorer vede solo l'anteprima (prime 2 lezioni). Starter sblocca 3 corsi base con audio. Premium sblocca tutti i corsi con audio. VIP ha tutto Premium più i corsi esclusivi con i video personali di Michael Jara.",
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const Check: React.FC<{ color: string; highlight: boolean; text: string }> = ({ color, highlight, text }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${color}20`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
      <CheckIcon style={{ width: 10, height: 10 }} />
    </div>
    <span style={{ fontSize: 12, lineHeight: 1.55, color: highlight ? DL.white : DL.muted }}>{text}</span>
  </div>
);

const Locked: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, opacity: .35 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
      <LockClosedIcon style={{ width: 9, height: 9, color: DL.muted }} />
    </div>
    <span style={{ fontSize: 12, lineHeight: 1.55, color: DL.muted }}>{text}</span>
  </div>
);

const PlanCard: React.FC<{ plan: typeof PIANI[0]; isCurrentPlan: boolean; onSelect: () => void; delay: number; founderPrice?: boolean }> =
  ({ plan, isCurrentPlan, onSelect, delay, founderPrice }) => {

    const isFree = plan.id === "free";
    const saving = plan.fullPrice - plan.launchPrice;
    const savingPct = plan.fullPrice > 0 ? Math.round((saving / plan.fullPrice) * 100) : 0;

    const btnBg = isCurrentPlan ? "rgba(255,255,255,0.04)"
      : plan.ctaStyle === "gold" ? DL.gold
        : plan.ctaStyle === "alch" ? DL.alch
          : plan.ctaStyle === "color" ? DL.stra
            : "rgba(255,255,255,0.06)";
    const btnColor = isCurrentPlan ? DL.muted
      : plan.ctaStyle === "gold" ? "#06060F"
        : plan.ctaStyle === "outline" ? DL.white
          : "#fff";

    return (
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: .35, ease: "easeOut" }}
        style={{
          background: plan.bg, border: `0.5px solid ${plan.border}`, borderRadius: 20,
          padding: "40px 32px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
        }}
        whileHover={!isCurrentPlan ? { y: -3 } : {}}>

        {/* Top line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,transparent,${plan.color}55,transparent)`
        }} />

        {/* Glow */}
        {!isFree && <div style={{
          position: "absolute", top: -60, right: -60, width: 160, height: 160,
          borderRadius: "50%", background: `${plan.color}08`, filter: "blur(50px)", pointerEvents: "none"
        }} />}

        {/* Badge */}
        {plan.badge && (
          <div style={{ position: "absolute", top: 18, right: 18 }}>
            <span style={{
              fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase",
              padding: "4px 12px", borderRadius: 100, background: `${plan.color}18`,
              color: plan.color, border: `0.5px solid ${plan.color}35`
            }}>
              {plan.badge}
            </span>
          </div>
        )}

        {/* Identity */}
        <div style={{
          fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase",
          color: plan.color, opacity: .7, marginBottom: 6
        }}>{plan.identity}</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400,
          color: DL.white, marginBottom: 4
        }}>{plan.name}</h3>
        <p style={{ fontSize: 11, letterSpacing: ".1em", color: plan.color, marginBottom: 12 }}>{plan.tagline}</p>
        <p style={{
          fontSize: 12, lineHeight: 1.75, color: DL.muted, fontStyle: "italic",
          marginBottom: 24, minHeight: 52
        }}>{plan.promise}</p>

        {/* Price */}
        <div style={{
          padding: "20px 0", borderTop: `0.5px solid ${DL.glassB}`,
          borderBottom: `0.5px solid ${DL.glassB}`, marginBottom: 24
        }}>
          {isFree ? (
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 52,
                fontWeight: 300, color: DL.white, lineHeight: 1
              }}>€0</div>
              <div style={{ fontSize: 11, color: DL.muted, marginTop: 4 }}>per sempre</div>
            </div>
          ) : (
            <div>
              {/* Launch price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 52,
                  fontWeight: 300, color: DL.white, lineHeight: 1
                }}>€{plan.launchPrice}</span>
                <span style={{ fontSize: 14, color: DL.muted }}>/mese</span>
              </div>
              {/* Founder badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: DL.muted, textDecoration: "line-through" }}>
                  €{plan.fullPrice}/mese da settembre
                </span>
                <span style={{
                  fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase",
                  padding: "3px 10px", borderRadius: 100,
                  background: "rgba(16,185,129,0.12)", color: DL.green,
                  border: "0.5px solid rgba(16,185,129,0.25)"
                }}>
                  -{savingPct}% Fondatori
                </span>
              </div>
              <p style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", marginTop: 6, letterSpacing: ".06em" }}>
                ♦ Prezzo bloccato per sempre se entri adesso
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {plan.features.map((f, i) => (
            <Check key={i} color={plan.color} highlight={f.h} text={f.t} />
          ))}
          {plan.locked?.map((f, i) => <Locked key={i} text={f} />)}
        </div>

        {/* CTA */}
        <button onClick={!isCurrentPlan ? onSelect : undefined} disabled={isCurrentPlan}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, fontSize: 13, fontWeight: 500,
            letterSpacing: ".04em", border: "none", cursor: isCurrentPlan ? "default" : "pointer",
            background: btnBg, color: btnColor, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, transition: "all .25s", fontFamily: "'DM Sans',sans-serif"
          }}>
          {isCurrentPlan ? "Piano attuale" : plan.cta}
          {!isCurrentPlan && !isFree && <ArrowRightIcon style={{ width: 16, height: 16 }} />}
        </button>
        {!isFree && !isCurrentPlan && (
          <p style={{ textAlign: "center", fontSize: 10, color: DL.muted, marginTop: 10 }}>
            Cancella quando vuoi · Nessun vincolo
          </p>
        )}
      </motion.div>
    );
  };

// ─── ELITE BAND ───────────────────────────────────────────────────────────────
const EliteBand: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}
    style={{
      marginTop: 4, padding: "40px 44px", border: `0.5px solid ${DL.goldB}`,
      background: DL.goldDim, display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden"
    }}>
    {/* Coming soon overlay */}
    <div style={{
      position: "absolute", inset: 0, background: "rgba(6,6,15,0.5)",
      backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2
    }}>
      <div style={{ textAlign: "center" }}>
        <span style={{
          fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: ".32em",
          textTransform: "uppercase", color: DL.gold, display: "block", marginBottom: 8
        }}>
          Coming Soon
        </span>
        <p style={{ fontSize: 12, color: DL.muted }}>Lista d'attesa aperta — solo 20 posti</p>
        <button style={{
          marginTop: 16, padding: "9px 24px", borderRadius: 100,
          background: "none", border: `0.5px solid ${DL.goldB}`, color: DL.gold,
          fontSize: 11, letterSpacing: ".14em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif"
        }}>
          Notificami →
        </button>
      </div>
    </div>
    <div style={{ zIndex: 1 }}>
      <span style={{
        fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase",
        color: DL.gold, display: "block", marginBottom: 8
      }}>Elite Sovereign Mentoring · Max 20 posti</span>
      <h3 style={{
        fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300,
        color: DL.white, marginBottom: 6
      }}>Lavoro diretto con Michael Jara</h3>
      <p style={{ fontSize: 13, color: DL.muted }}>Programma annuale personalizzato · Trasformazione garantita</p>
    </div>
    <div style={{ textAlign: "right", zIndex: 1 }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, color: DL.gold }}>
        €5.000<span style={{ fontSize: 16, color: DL.muted }}>/anno</span>
      </div>
    </div>
  </motion.div>
);

// ─── COMPARE TABLE ────────────────────────────────────────────────────────────
const CompareTable: React.FC = () => {
  const cell = (v: any, color: string) => {
    if (v === false) return <span style={{ color: DL.muted }}>—</span>;
    if (v === true) return (
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: `${color}20`,
        color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto"
      }}>
        <CheckIcon style={{ width: 11, height: 11 }} />
      </div>
    );
    return <span style={{ fontSize: 11, color: DL.white }}>{v}</span>;
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}
      style={{ marginTop: 64, maxWidth: 1000, margin: "64px auto 0" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <span style={{
          fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase",
          color: DL.gold, opacity: .7, display: "block", marginBottom: 10
        }}>Confronto completo</span>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: 32,
          fontWeight: 300, color: DL.white
        }}>Cosa ottieni in ogni piano</h2>
      </div>
      <div style={{ borderRadius: 12, overflow: "hidden", border: `0.5px solid ${DL.glassB}` }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          padding: "12px 20px", background: "rgba(255,255,255,0.03)",
          borderBottom: `0.5px solid ${DL.glassB}`
        }}>
          <div style={{ fontSize: 11, color: DL.muted }}>Funzionalità</div>
          {[["Explorer", DL.muted], ["Starter", DL.stra], ["Premium", DL.gold], ["VIP Sovereign", DL.alch]].map(([n, c]) => (
            <div key={n} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: c }}>{n}</div>
          ))}
        </div>
        {/* Rows */}
        {COMPARE.map((row, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            padding: "13px 20px", alignItems: "center",
            borderBottom: i < COMPARE.length - 1 ? `0.5px solid rgba(255,255,255,0.04)` : "none",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"
          }}>
            <div style={{ fontSize: 12, color: DL.muted }}>{row.f}</div>
            <div style={{ textAlign: "center" }}>{cell(row.free, DL.muted)}</div>
            <div style={{ textAlign: "center" }}>{cell(row.starter, DL.stra)}</div>
            <div style={{ textAlign: "center" }}>{cell(row.premium, DL.gold)}</div>
            <div style={{ textAlign: "center" }}>{cell(row.vip, DL.alch)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7 }}
      style={{ marginTop: 64, maxWidth: 680, margin: "64px auto 0" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: 32,
          fontWeight: 300, color: DL.white
        }}>Domande <em style={{ fontStyle: "italic", color: DL.gold }}>frequenti</em></h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{
            borderRadius: 12, overflow: "hidden",
            border: `0.5px solid ${open === i ? DL.goldB : DL.glassB}`,
            background: open === i ? DL.goldDim : "rgba(255,255,255,0.02)"
          }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", padding: "16px 20px", display: "flex",
                alignItems: "center", justifyContent: "space-between", textAlign: "left",
                background: "none", border: "none", cursor: "pointer"
              }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: DL.white }}>{faq.q}</span>
              <span style={{
                fontSize: 20, color: DL.gold, flexShrink: 0, marginLeft: 12,
                transition: "transform .2s", transform: open === i ? "rotate(45deg)" : "none"
              }}>+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: .2 }} style={{ overflow: "hidden" }}>
                  <p style={{ padding: "0 20px 16px", fontSize: 12, lineHeight: 1.85, color: DL.muted }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PlansPage: React.FC = () => {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "vip" | "starter">("premium");
  const currentPlan: string = (user as any)?.plan ?? "free";
  const isFounder = (user as any)?.is_founder ?? false;

  const handleSelect = (planId: string) => {
    if (planId === "free") return;
    setSelectedPlan(planId as any);
    setShowUpgrade(true);
  };

  const TRUST = [
    { icon: <ShieldCheckIcon style={{ width: 16, height: 16 }} />, label: "Pagamento sicuro Stripe" },
    { icon: <FireIcon style={{ width: 16, height: 16 }} />, label: "Server EU · GDPR compliant" },
    { icon: <UserGroupIcon style={{ width: 16, height: 16 }} />, label: "2.000+ utenti attivi" },
    { icon: <StarIcon style={{ width: 16, height: 16 }} />, label: "4.9/5 rating medio" },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      {ReactDOM.createPortal(
        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} planType={selectedPlan} />,
        document.body
      )}

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "rgba(201,168,76,0.04)", filter: "blur(120px)"
        }} />
        <div style={{
          position: "absolute", top: "50%", right: -80, width: 300, height: 400,
          borderRadius: "50%", background: "rgba(155,116,224,0.04)", filter: "blur(100px)"
        }} />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 40, position: "relative", zIndex: 1 }}>

        {/* Founder badge if applicable */}
        {isFounder && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 18px",
            borderRadius: 100, background: DL.goldDim, border: `0.5px solid ${DL.goldB}`,
            fontSize: 10, color: DL.gold, letterSpacing: ".16em", textTransform: "uppercase",
            marginBottom: 20
          }}>
            ♦ Account Fondatore · Prezzo bloccato per sempre
          </div>
        )}

        <h1 style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,56px)",
          fontWeight: 300, color: DL.white, lineHeight: 1.1, marginBottom: 12
        }}>
          Non scegliere un piano.<br />
          <em style={{ fontStyle: "italic", color: DL.gold }}>Scegli chi vuoi diventare.</em>
        </h1>
        <p style={{
          fontSize: 14, color: DL.muted, maxWidth: 480, margin: "0 auto 32px",
          lineHeight: 1.85
        }}>
          Prezzi di lancio riservati ai Fondatori.<br />
          Chi entra adesso mantiene il prezzo per sempre.
        </p>

        {/* Launch countdown hint */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
          borderRadius: 100, background: "rgba(212,96,58,0.1)", border: "0.5px solid rgba(212,96,58,0.25)",
          fontSize: 11, color: "#D4603A", marginBottom: 32
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#D4603A",
            animation: "pulse 2s infinite", display: "inline-block"
          }} />
          Da settembre 2026 i prezzi salgono · Entra adesso al prezzo Fondatori
        </div>
      </motion.div>

      {/* Trust bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 32, flexWrap: "wrap", marginBottom: 48, position: "relative", zIndex: 1
        }}>
        {TRUST.map((t, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 11, color: DL.muted
          }}>
            <span style={{ color: DL.gold }}>{t.icon}</span>{t.label}
          </div>
        ))}
      </motion.div>

      {/* Plans grid — 4 colonne */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2,
        background: DL.glassB, border: `0.5px solid ${DL.glassB}`,
        position: "relative", zIndex: 1, marginBottom: 2
      }}>
        {PIANI.map((plan, idx) => (
          <PlanCard key={plan.id} plan={plan} delay={idx * .08}
            isCurrentPlan={currentPlan === plan.id}
            onSelect={() => handleSelect(plan.id)}
            founderPrice={true} />
        ))}
      </div>

      {/* Elite Coming Soon */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <EliteBand />
      </div>

      {/* Compare table */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <CompareTable />
      </div>

      {/* FAQ */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <FAQSection />
      </div>

      {/* Bottom legal */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}
        style={{ marginTop: 64, textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 11, color: DL.muted, lineHeight: 2, maxWidth: 520, margin: "0 auto" }}>
          Luminel è una piattaforma di sviluppo personale ai sensi della Legge 4/2013.<br />
          Non è un servizio medico o psicologico · Pagamenti sicuri Stripe · Server EU Frankfurt · GDPR
        </p>
      </motion.div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
};

export default PlansPage;