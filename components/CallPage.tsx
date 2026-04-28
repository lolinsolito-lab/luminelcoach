import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MicrophoneIcon, CheckCircleIcon, StarIcon,
  SparklesIcon, CalendarIcon, PlayIcon, PhoneIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AICallModal from "./AICallModal";
import UpgradeModal from "./UpgradeModal";

const DL = {
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4", guer: "#D4603A",
  white: "#F0EBE0", muted: "#6A6560", glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
};

// ── Waveform animation ───────────────────────────────────────────────────────
const Waveform: React.FC<{ color?: string }> = ({ color = DL.gold }) => (
  <div className="flex items-end gap-[3px] h-8">
    {[4, 7, 5, 9, 6, 8, 5, 7, 4, 6, 8, 5, 7, 4].map((h, i) => (
      <motion.div key={i} className="w-1 rounded-full" style={{ background: color }}
        animate={{ height: [`${h * 2.5}px`, `${h * 4}px`, `${h * 2.5}px`] }}
        transition={{ duration: 0.6 + i * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }} />
    ))}
  </div>
);

// ── Pulse orb ────────────────────────────────────────────────────────────────
const PulseOrb: React.FC = () => (
  <div className="relative w-28 h-28 mx-auto">
    {[1, 0.6, 0.35].map((op, i) => (
      <motion.div key={i} className="absolute inset-0 rounded-full"
        style={{ border: `0.5px solid rgba(201,168,76,${op * 0.4})`, background: `rgba(201,168,76,${op * 0.04})` }}
        animate={{ scale: [1, 1.14 + i * 0.12, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} />
    ))}
    <div className="absolute inset-4 rounded-full flex items-center justify-center"
      style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
      <PhoneIcon className="w-9 h-9" style={{ color: DL.gold }} />
    </div>
  </div>
);

// ── Plan check row ───────────────────────────────────────────────────────────
const Check: React.FC<{ text: string; color: string; bold?: boolean }> = ({ text, color, bold }) => (
  <div className="flex items-start gap-2.5 text-[12px]" style={{ color: bold ? DL.white : DL.muted }}>
    <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color }} />
    <span style={{ fontWeight: bold ? 500 : 400 }}>{text}</span>
  </div>
);
const NoCheck: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2.5 text-[12px] opacity-35">
    <XMarkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: DL.muted }} />
    <span style={{ color: DL.muted }}>{text}</span>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const CallPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleStartDemo = () => setIsCallModalOpen(true);

  // Allineato con PlansPage: Premium NON include Voice Coach (solo 1 demo come Free)
  // VIP Sovereign: Voice Coach illimitato HD
  const planVoiceFeatures = {
    free: {
      included: ["1 Demo vocale al mese", "Qualità standard"],
      excluded: ["Voice Coach illimitato", "Voce HD Ultra-Realistica", "Analisi emotiva post-call"],
    },
    premium: {
      included: ["1 Demo vocale al mese", "Qualità standard"],
      excluded: ["Voice Coach illimitato", "Voce HD Ultra-Realistica", "Analisi emotiva post-call"],
      note: "⚠️ Il Voice Coach illimitato è esclusivo del piano VIP"
    },
    vip: {
      included: [
        "Voice Coach illimitato HD",
        "Voce Ultra-Realistica (ElevenLabs)",
        "Analisi emotiva post-call con AI",
        "1 sessione mensile con Michael Jara",
        "Report settimanale del percorso vocale",
        "Accesso prioritario alle nuove voci",
      ],
    },
  };

  const features = [
    { icon: <MicrophoneIcon className="w-5 h-5" />, color: DL.stra, title: "Voce Naturale", desc: "TTS avanzato per un'esperienza umana. Intonazione, pause e calore — come un vero coach." },
    { icon: <SparklesIcon className="w-5 h-5" />, color: DL.gold, title: "AI Empatica", desc: "Comprende le sfumature emotive della tua voce e adatta la risposta al tuo stato in tempo reale." },
    { icon: <CalendarIcon className="w-5 h-5" />, color: DL.alch, title: "Disponibile 24/7", desc: "Nessun appuntamento. Luminel è sempre disponibile — alle 3 di notte o prima di un pitch." },
  ];

  const testimonials = [
    { name: "Elena R.", role: "Imprenditrice", text: "Parlare con Luminel è come avere un coach saggio sempre in tasca. Mi ha calmato prima di un pitch importante.", color: DL.gold },
    { name: "Marco B.", role: "Studente", text: "Incredibile quanto la voce sia naturale. Mi aiuta a riflettere ad alta voce senza giudizio.", color: DL.stra },
    { name: "Sofia L.", role: "Designer", text: "Le sessioni vocali sono diventate il mio rituale serale per decomprimere e ritrovare chiarezza.", color: DL.alch },
  ];

  const currentPlan = user?.plan ?? "free";

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      {isCallModalOpen && <AICallModal onClose={() => setIsCallModalOpen(false)} />}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} planType="vip" />

      {/* ── HERO ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-14 text-center"
        style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(80,40,160,0.1))", border: `0.5px solid ${DL.goldB}`, padding: "52px 32px 44px" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${DL.gold}55,transparent)` }} />
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: "rgba(201,168,76,0.05)", filter: "blur(50px)" }} />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full pointer-events-none" style={{ background: "rgba(155,116,224,0.06)", filter: "blur(50px)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[9px] tracking-[0.2em] uppercase font-medium"
            style={{ background: DL.goldDim, color: DL.gold, border: `0.5px solid ${DL.goldB}` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: DL.gold }} />
            Nuova Funzionalità · Coach Vocale AI
          </div>
          <div className="mb-7"><PulseOrb /></div>
          <h1 className="font-serif mb-4 leading-tight" style={{ fontSize: "clamp(28px,5vw,46px)", color: DL.white, fontWeight: 400 }}>
            Il tuo Coach Vocale<br />
            <em className="italic" style={{ color: DL.gold }}>Personale & Intelligente</em>
          </h1>
          <p className="text-[14px] leading-relaxed mb-3 max-w-xl mx-auto" style={{ color: "rgba(240,235,224,0.6)" }}>
            Supera i limiti del testo. Parla liberamente con Luminel, esplora i tuoi pensieri ad alta voce e ricevi guida immediata con una voce calda ed empatica.
          </p>
          <div className="flex justify-center mb-8"><Waveform color={DL.gold} /></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={handleStartDemo}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all group"
              style={{ background: DL.gold, color: "#06060F", boxShadow: "0 0 24px rgba(201,168,76,0.2)" }}>
              <PlayIcon className="w-4 h-4" />
              Prova la Demo Vocale
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {currentPlan !== "vip" && (
              <button onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all"
                style={{ background: "transparent", border: `0.5px solid ${DL.goldB}`, color: DL.gold }}
                onMouseEnter={e => e.currentTarget.style.background = DL.goldDim}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Sblocca Accesso VIP
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── FEATURES ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-14">
        <div className="text-[9px] tracking-[0.22em] uppercase mb-2 opacity-70 text-center" style={{ color: DL.gold }}>Come funziona</div>
        <h2 className="font-serif text-[24px] font-normal text-center mb-7" style={{ color: DL.white }}>
          Un'esperienza vocale <em className="italic" style={{ color: DL.gold }}>senza precedenti</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl p-6 transition-all duration-200"
              style={{ background: `${f.color}07`, border: `0.5px solid ${f.color}25` }}
              whileHover={{ y: -2, borderColor: `${f.color}50` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}18`, color: f.color }}>{f.icon}</div>
              <h3 className="text-[14px] font-medium mb-2" style={{ color: DL.white }}>{f.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: DL.muted }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── PRICING — allineato con PlansPage ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-14">
        <div className="text-[9px] tracking-[0.22em] uppercase mb-2 opacity-70 text-center" style={{ color: DL.gold }}>Voice Coach · Piani</div>
        <h2 className="font-serif text-[24px] font-normal text-center mb-3" style={{ color: DL.white }}>
          Scegli il tuo <em className="italic" style={{ color: DL.gold }}>livello</em>
        </h2>
        <p className="text-[12px] text-center mb-8" style={{ color: DL.muted }}>
          Il Voice Coach illimitato è una funzionalità <span style={{ color: "#9B74E0" }}>esclusiva del piano VIP Sovereign</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">

          {/* FREE + PREMIUM — stesse funzionalità voice */}
          <div className="rounded-xl p-7 flex flex-col"
            style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, opacity: currentPlan === "vip" ? 0.55 : 1 }}>
            <div className="text-[9px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.muted }}>
              Explorer & Premium
            </div>
            <div className="font-serif text-[26px] font-normal mb-1" style={{ color: DL.muted }}>Limitato</div>
            <p className="text-[12px] mb-2" style={{ color: DL.muted }}>Accesso di prova · stessa quota per entrambi i piani</p>

            {/* Note allineamento */}
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-5 text-[11px]"
              style={{ background: "rgba(212,96,58,0.07)", border: "0.5px solid rgba(212,96,58,0.2)", color: "#D4603A" }}>
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>Il Voice Coach illimitato HD è disponibile solo con il piano <strong>VIP Sovereign</strong> (€199/mese)</span>
            </div>

            <div className="flex flex-col gap-2.5 mb-6 flex-1">
              {planVoiceFeatures.free.included.map((f, i) => <Check key={i} text={f} color={DL.muted} />)}
              <div className="h-px my-1" style={{ background: DL.glassB }} />
              {planVoiceFeatures.free.excluded.map((f, i) => <NoCheck key={i} text={f} />)}
            </div>

            <div className="flex flex-col gap-2">
              <button disabled className="w-full py-2.5 rounded-xl text-[12px] font-medium"
                style={{ background: "rgba(255,255,255,0.03)", color: DL.muted, border: `0.5px solid ${DL.glassB}`, cursor: "default" }}>
                {currentPlan === "free" ? "Piano attuale (Explorer)" : "Piano attuale (Premium)"}
              </button>
              <button onClick={() => navigate("/plans")}
                className="w-full py-2.5 rounded-xl text-[12px] transition-all"
                style={{ background: "transparent", color: DL.muted, border: `0.5px solid ${DL.glassB}` }}
                onMouseEnter={e => e.currentTarget.style.color = DL.white}
                onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                Confronta tutti i piani →
              </button>
            </div>
          </div>

          {/* VIP SOVEREIGN */}
          <div className="rounded-xl p-7 flex flex-col relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(155,116,224,0.09),rgba(201,168,76,0.06))", border: "0.5px solid rgba(155,116,224,0.38)" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(155,116,224,0.6),transparent)" }} />
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(155,116,224,0.08)", filter: "blur(30px)" }} />

            <div className="flex items-center justify-between mb-1">
              <div className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "#9B74E0" }}>VIP Sovereign</div>
              <span className="text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full font-medium"
                style={{ background: DL.goldDim, color: DL.gold, border: `0.5px solid ${DL.goldB}` }}>
                Esclusivo
              </span>
            </div>
            <div className="font-serif text-[28px] font-normal mb-1" style={{ color: DL.white }}>Illimitato</div>
            <p className="text-[12px] mb-5" style={{ color: DL.muted }}>Voice Coach HD · tutto incluso · €199/mese</p>
            <div className="mb-5"><Waveform color="#9B74E0" /></div>
            <div className="flex flex-col gap-2.5 mb-6 flex-1">
              {planVoiceFeatures.vip.included.map((f, i) => (
                <Check key={i} text={f} color="#9B74E0" bold={i < 3} />
              ))}
            </div>

            {currentPlan === "vip" ? (
              <button disabled className="w-full py-3 rounded-xl text-[13px] font-medium"
                style={{ background: "rgba(155,116,224,0.15)", color: "#9B74E0", border: "0.5px solid rgba(155,116,224,0.3)", cursor: "default" }}>
                ✓ Piano attuale — VIP Sovereign
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full py-3 rounded-xl text-[13px] font-medium tracking-wide transition-all"
                  style={{ background: "#9B74E0", color: "#FFFFFF" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  Diventa VIP Sovereign →
                </button>
                <button onClick={() => navigate("/plans")}
                  className="w-full py-2 rounded-xl text-[11px] transition-all"
                  style={{ background: "transparent", color: DL.muted, border: "none" }}
                  onMouseEnter={e => e.currentTarget.style.color = DL.white}
                  onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                  Confronta tutti i piani
                </button>
                <p className="text-center text-[10px]" style={{ color: DL.muted }}>
                  Cancella quando vuoi · Nessun vincolo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coerenza con PlansPage */}
        <div className="mt-5 text-center">
          <button onClick={() => navigate("/plans")}
            className="inline-flex items-center gap-1.5 text-[12px] transition-all"
            style={{ color: DL.muted }}
            onMouseEnter={e => e.currentTarget.style.color = DL.gold}
            onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
            Vedi confronto completo di tutti i piani
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mb-14 rounded-xl p-7"
        style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
        <div className="text-[9px] tracking-[0.22em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Come iniziare</div>
        <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Tre passi verso la tua sessione vocale</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Premi il pulsante", desc: "Nessuna installazione. Clicca 'Prova la Demo' e sei dentro in 3 secondi.", color: DL.stra },
            { num: "02", title: "Parla liberamente", desc: "Di' quello che hai in mente. Luminel ascolta, comprende e risponde con empatia.", color: DL.gold },
            { num: "03", title: "Ricevi guida reale", desc: "Domande potenti, Reality Quest vocale, insight basati sul metodo Jara.", color: DL.alch },
          ].map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="font-serif text-[30px] font-normal flex-shrink-0 leading-none mt-1" style={{ color: s.color, opacity: 0.35 }}>{s.num}</div>
              <div>
                <div className="text-[13px] font-medium mb-1" style={{ color: DL.white }}>{s.title}</div>
                <div className="text-[12px] leading-relaxed" style={{ color: DL.muted }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-14">
        <div className="text-[9px] tracking-[0.22em] uppercase mb-2 opacity-70 text-center" style={{ color: DL.gold }}>Testimonianze</div>
        <h2 className="font-serif text-[24px] font-normal text-center mb-7" style={{ color: DL.white }}>Cosa dicono gli utenti</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl p-5 transition-all"
              style={{ background: `${t.color}06`, border: `0.5px solid ${t.color}20` }}
              whileHover={{ y: -2, borderColor: `${t.color}40` }}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => <StarIcon key={j} className="w-3.5 h-3.5" style={{ color: t.color }} />)}
              </div>
              <p className="text-[12px] leading-relaxed italic mb-4" style={{ color: "rgba(240,235,224,0.65)" }}>"{t.text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
                  style={{ background: `${t.color}18`, color: t.color }}>{t.name.charAt(0)}</div>
                <div>
                  <div className="text-[12px] font-medium" style={{ color: DL.white }}>{t.name}</div>
                  <div className="text-[10px]" style={{ color: DL.muted }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── BOTTOM CTA ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="text-center rounded-xl p-8"
        style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
        <div className="font-serif text-[22px] font-normal mb-2" style={{ color: DL.white }}>Pronto a sentire la differenza?</div>
        <p className="text-[13px] mb-6" style={{ color: DL.muted }}>
          1 demo gratuita · Nessuna carta di credito · Voice Coach illimitato con VIP (€199/mese)
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={handleStartDemo}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all group"
            style={{ background: DL.gold, color: "#06060F" }}>
            <PlayIcon className="w-4 h-4" />
            Inizia la Demo Vocale
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          {currentPlan !== "vip" && (
            <button onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: "rgba(155,116,224,0.1)", border: "0.5px solid rgba(155,116,224,0.3)", color: "#9B74E0" }}>
              Sblocca VIP Sovereign
            </button>
          )}
        </div>
        <p className="text-[10px] mt-5" style={{ color: DL.muted }}>
          Sviluppo personale ai sensi della Legge 4/2013 · Non è un servizio medico · Server EU · GDPR
        </p>
      </motion.div>
    </div>
  );
};

export default CallPage;