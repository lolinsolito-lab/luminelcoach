import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireIcon, LockClosedIcon, ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import { FireIcon as FireSolid } from "@heroicons/react/24/solid";

interface FOMOSectionProps {
  plan: string;
  streak: number;
  navigate: (path: string) => void;
}

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────
const useCountdown24h = () => {
  const getSecsLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  };
  const [secs, setSecs] = useState(getSecsLeft);
  useEffect(() => {
    const t = setInterval(() => setSecs(getSecsLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};

// ─── SOCIAL PROOF (mock realistico) ───────────────────────────────────────────
const SOCIAL: Record<string, { count: number; label: string }> = {
  "mindfulness-intro":    { count: 23, label: "stanno seguendo oggi" },
  "deep-transformation":  { count: 8,  label: "nuovi iscritti questa settimana" },
  "emotional-intelligence": { count: 15, label: "hanno completato questa settimana" },
};

// ─── COURSE PROMO ─────────────────────────────────────────────────────────────
const COURSE_PROMOS = [
  {
    id: "mindfulness-intro",
    title: "Introduzione alla Mindfulness",
    subtitle: "Il punto di partenza di ogni trasformazione",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    color: "#4A9ED4",
    plan: "free",
    badgeLabel: "✦ GRATIS",
    cta: "Inizia ora",
    urgency: null,
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    subtitle: "21 giorni per cambiare le tue relazioni",
    image: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=600&q=80",
    color: "#C9A84C",
    plan: "premium",
    badgeLabel: "⭐ PREMIUM",
    cta: "Sblocca · €49/mese",
    urgency: "Sconto del 20% scade oggi",
  },
];

// ─── STREAK CARD ─────────────────────────────────────────────────────────────
const StreakCard: React.FC<{ streak: number; navigate: (p: string) => void }> = ({ streak, navigate }) => {
  const countdown = useCountdown24h();
  const isAtRisk = streak >= 3; // mostra urgenza solo se ha già qualcosa da perdere

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, ease: [0.34, 1.2, 0.64, 1] }}
      style={{
        borderRadius: 16, overflow: "hidden", position: "relative",
        background: isAtRisk
          ? "linear-gradient(135deg, rgba(212,96,58,0.1) 0%, rgba(201,168,76,0.06) 100%)"
          : "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(74,158,212,0.05) 100%)",
        border: `0.5px solid ${isAtRisk ? "rgba(212,96,58,0.35)" : "rgba(201,168,76,0.25)"}`,
        boxShadow: isAtRisk ? "0 0 24px rgba(212,96,58,0.08)" : "none",
      }}>
      {/* Top shimmer */}
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${isAtRisk ? "rgba(212,96,58,0.6)" : "rgba(201,168,76,0.4)"},transparent)` }} />

      <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <motion.div
              animate={isAtRisk ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 48, height: 48, borderRadius: 12, background: isAtRisk ? "rgba(212,96,58,0.15)" : "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              🔥
            </motion.div>
            {isAtRisk && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, borderRadius: "50%", background: "#D4603A", border: "2px solid #06060F" }} />
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F0EBE0", marginBottom: 2 }}>
              {isAtRisk
                ? `Non perdere la tua serie di ${streak} giorni!`
                : `Ottimo inizio — ${streak} giorno${streak > 1 ? "i" : ""} consecutivi`}
            </div>
            <div style={{ fontSize: 11, color: "#6A6560" }}>
              {isAtRisk
                ? "Completa almeno una sessione oggi per mantenere la streak"
                : "Costruisci un'abitudine quotidiana — ogni giorno conta"}
            </div>
          </div>
        </div>

        {/* Right — countdown + CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          {isAtRisk && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontFamily: "'DM Mono',monospace", color: "#D4603A", background: "rgba(212,96,58,0.1)", padding: "4px 10px", borderRadius: 6, border: "0.5px solid rgba(212,96,58,0.3)" }}>
              <ClockIcon style={{ width: 13, height: 13 }} />
              {countdown}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.03, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/quests")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: isAtRisk ? "#D4603A" : "#C9A84C", color: "#06060F", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            {isAtRisk ? "Salva la streak →" : "Fai la prima sessione →"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── COURSE PROMO CARD ────────────────────────────────────────────────────────
const CoursePromoCard: React.FC<{
  promo: typeof COURSE_PROMOS[0];
  index: number;
  navigate: (p: string) => void;
  unlocked: boolean;
}> = ({ promo, index, navigate, unlocked }) => {
  const social = SOCIAL[promo.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, ease: [0.34, 1.2, 0.64, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.22 } }}
      onClick={() => navigate(unlocked ? `/courses/${promo.id}` : "/plans")}
      style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(255,255,255,0.07)", cursor: "pointer", boxShadow: "0 2px 14px rgba(0,0,0,0.2)", position: "relative" }}>

      {/* Thumbnail */}
      <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
        <img src={promo.image} alt={promo.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: unlocked ? "none" : "grayscale(40%) brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(13,13,32,0.85) 0%,rgba(13,13,32,0.1) 60%)" }} />

        {/* Badge piano */}
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 20, background: "rgba(13,13,32,0.8)", color: promo.color, border: `0.5px solid ${promo.color}40`, backdropFilter: "blur(8px)" }}>
            {promo.badgeLabel}
          </span>
        </div>

        {/* Urgency badge */}
        {promo.urgency && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, background: "rgba(212,96,58,0.85)", color: "#fff", backdropFilter: "blur(8px)" }}>
              ⏱ {promo.urgency}
            </motion.span>
          </div>
        )}

        {/* Lock */}
        {!unlocked && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LockClosedIcon style={{ width: 24, height: 24, color: "rgba(240,235,224,0.6)" }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px 14px" }}>
        {/* Social proof */}
        {social && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
            <div style={{ display: "flex" }}>
              {["#4A9ED4","#9B74E0","#C9A84C"].map((c,i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "1.5px solid #06060F", marginLeft: i > 0 ? -5 : 0, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#6A6560" }}>
              <strong style={{ color: promo.color }}>{social.count}</strong> {social.label}
            </span>
          </div>
        )}

        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 400, color: "#F0EBE0", marginBottom: 4, lineHeight: 1.25 }}>
          {promo.title}
        </div>
        <div style={{ fontSize: 11, color: "#6A6560", marginBottom: 12, lineHeight: 1.4 }}>
          {promo.subtitle}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={e => { e.stopPropagation(); navigate(unlocked ? `/courses/${promo.id}` : "/plans"); }}
          style={{ width: "100%", padding: "8px", borderRadius: 8, background: unlocked ? promo.color : "transparent", color: unlocked ? "#06060F" : promo.color, border: `0.5px solid ${promo.color}${unlocked ? "" : "50"}`, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {promo.cta} <ArrowRightIcon style={{ width: 12, height: 12 }} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── ELITE SOVEREIGN BANNER ───────────────────────────────────────────────────
const EliteBanner: React.FC<{ navigate: (p: string) => void }> = ({ navigate }) => {
  const countdown = useCountdown24h();
  const [spots] = useState(8); // mock — in produzione viene da Supabase

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
      style={{ borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(135deg,rgba(155,116,224,0.1),rgba(201,168,76,0.06))", border: "0.5px solid rgba(155,116,224,0.3)", cursor: "pointer" }}
      onClick={() => navigate("/plans")}>
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(155,116,224,0.55),transparent)" }} />
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(155,116,224,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>♛</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F0EBE0", marginBottom: 2 }}>
              Elite Sovereign Mentoring
              <span style={{ marginLeft: 8, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: "rgba(212,96,58,0.15)", color: "#D4603A", border: "0.5px solid rgba(212,96,58,0.3)" }}>
                Solo {spots} posti
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#6A6560" }}>
              1 sessione mensile con Michael Jara · €5.000/anno · Accesso diretto
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: "rgba(212,96,58,0.85)", fontFamily: "'DM Mono',monospace" }}>
            ⏱ {countdown}
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={e => { e.stopPropagation(); navigate("/plans"); }}
            style={{ padding: "7px 16px", borderRadius: 8, background: "#9B74E0", color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            Scopri di più →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN FOMO SECTION ────────────────────────────────────────────────────────
const FOMOSection: React.FC<FOMOSectionProps> = ({ plan, streak, navigate }) => {
  const isVIP     = plan === "vip";
  const isPremium = plan === "premium" || isVIP;

  // Corsi da promuovere in base al piano
  const promos = COURSE_PROMOS.filter(p => {
    if (isVIP) return false; // VIP ha già tutto
    if (isPremium) return p.plan === "vip" || p.plan === "premium"; // mostra VIP promo
    return true; // free vede tutto
  });

  if (isVIP) return null; // VIP non vede FOMO — ha tutto

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.05)" }} />
        <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "#6A6560" }}>
          Per te · oggi
        </span>
        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Streak protection */}
      <StreakCard streak={streak} navigate={navigate} />

      {/* Course promos */}
      {promos.length > 0 && (
        <div>
          <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 10 }}>
            Corsi consigliati per te
          </div>
          <div style={{ display: "grid", gridTemplateColumns: promos.length > 1 ? "1fr 1fr" : "1fr", gap: 10 }}>
            {promos.map((p, i) => (
              <CoursePromoCard key={p.id} promo={p} index={i} navigate={navigate}
                unlocked={p.plan === "free" || (isPremium && p.plan === "premium")} />
            ))}
          </div>
        </div>
      )}

      {/* Elite Sovereign banner (solo per free/premium) */}
      <EliteBanner navigate={navigate} />
    </motion.div>
  );
};

export default FOMOSection;
