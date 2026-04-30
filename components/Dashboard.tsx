import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { supabase } from "../services/supabase";
import { ArrowRightIcon, LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import WelcomeVideoModal from "./WelcomeVideoModal";
import FOMOSection from "./FOMOSection";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MOODS = [
  {
    id: "focused", label: "Focalizzato", emoji: "🔥", color: "#D4603A",
    response: "Sei in uno stato di picco. Il momento ideale per la tua sessione più profonda e per prendere quella decisione che rimandi.",
    quest: { title: "La Decisione Rimasta nel Cassetto", body: 'Ho rilevato un pattern di evitamento nelle tue ultime 4 sessioni. Identifica <em style="color:#F0EBE0">una</em> decisione che rimandi da più di 2 settimane — prendila entro le prossime 3 ore. Non analizzarla. Agisci.' },
    quickAccess: ["chat", "council", "quests"],
  },
  {
    id: "inspired", label: "Ispirato", emoji: "✨", color: "#C9A84C",
    response: "L'ispirazione è rara e preziosa. Non sprecarla. Usa questo stato per creare, decidere o condividere qualcosa di significativo.",
    quest: { title: "L'Insight di Oggi", body: 'Sei in uno stato creativo di picco. Prendi carta e penna — scrivi per 10 minuti senza fermarti su questa domanda: "Se potessi costruire una cosa sola oggi, quale sarebbe?"' },
    quickAccess: ["council", "chat", "courses"],
  },
  {
    id: "calm", label: "Calmo", emoji: "🌊", color: "#4A9ED4",
    response: "La calma è il terreno della saggezza. Questo è il momento migliore per meditare, studiare o prendere decisioni ponderate.",
    quest: { title: "La Sessione di Silenzio", body: 'Hai 20 minuti? Siediti, chiudi gli occhi e lascia che i pensieri passino senza aggrapparti a nessuno. Nessun obiettivo. Solo presenza.' },
    quickAccess: ["experiences", "courses", "chat"],
  },
  {
    id: "anxious", label: "Ansioso", emoji: "😰", color: "#F59E0B",
    response: "L'ansia è energia non direzionata. Non combatterla — trasformala. Ti guido in una tecnica specifica per i prossimi 5 minuti.",
    quest: { title: "Il Respiro 4-7-8", body: 'Fai questo adesso, prima di qualsiasi altra cosa: inspira per 4 secondi, trattieni per 7, espira per 8. Ripeti 4 volte. L\'ansia non scomparirà — ma tornerai al comando.' },
    quickAccess: ["experiences", "chat", "quests"],
  },
  {
    id: "tired", label: "Stanco", emoji: "😔", color: "#6A6560",
    response: "La stanchezza è un segnale, non un fallimento. Il tuo corpo ti sta chiedendo qualcosa. Ascoltalo invece di ignorarlo.",
    quest: { title: "Il Permesso di Fermarsi", body: 'La tua missione di oggi è non fare. Nessun obiettivo da raggiungere. Concediti 30 minuti di riposo attivo — una camminata lenta, musica rilassante, o semplicemente stare fermo.' },
    quickAccess: ["experiences", "chat", "courses"],
  },
  {
    id: "lost", label: "Perso", emoji: "🌑", color: "#9B74E0",
    response: "Essere persi è spesso il precursore di una grande chiarezza. Non sai dove andare perché stai crescendo oltre i tuoi vecchi confini.",
    quest: { title: "La Bussola Interiore", body: 'Scrivi 3 risposte a questa domanda: "Cosa so con certezza di non volere nella mia vita?" Le risposte negative spesso rivelano la direzione positiva che cerchi.' },
    quickAccess: ["council", "chat", "experiences"],
  },
];

const ROUTE_MAP: Record<string, string> = {
  chat: "/chat", council: "/council", experiences: "/experiences", courses: "/courses", quests: "/quests"
};
const QUICK_LABELS: Record<string, { label: string; color: string; lock?: boolean }> = {
  chat: { label: "✦ Sessione con Luminel", color: "#C9A84C" },
  council: { label: "⬡ Convoca Il Consiglio", color: "#9B74E0", lock: true },
  experiences: { label: "🎧 Calm Space · Binaural", color: "#4A9ED4" },
  courses: { label: "📚 Esplora i Corsi", color: "#C9A84C" },
  quests: { label: "⚡ Reality Quest", color: "#D4603A" },
};

const COURSES = [
  { title: "Deep Transformation", progress: 38, note: "Day 22/60", color: "#9B74E0" },
  { title: "Emotional Intelligence", progress: 65, note: "65% completato", color: "#4A9ED4" },
  { title: "The Art of Mindful Living", progress: 85, note: "Quasi fatto!", color: "#C9A84C" },
];
const COMMUNITY = [
  { name: "Sarah Chen", lv: 5, av: "S", color: "#4A9ED4", note: "30-day meditation streak! 🕯" },
  { name: "Roberto M.", lv: 8, av: "R", color: "#9B74E0", note: 'Quest "Deep Dive" completata' },
  { name: "Anna K.", lv: 4, av: "A", color: "#C9A84C", note: "+3 Reality Quest questa settimana" },
];

const LEVELS = ["", "Esploratore", "Cercatore", "Discepolo", "Guerriero", "Alchimista", "Stratega", "Maestro", "Sovrano"];
const getLv = (l: number) => LEVELS[Math.min(l, 8)] ?? "Sovrano";

const useTimer = (h: number) => {
  const [s, setS] = useState(h * 3600);
  useEffect(() => { const t = setInterval(() => setS(v => Math.max(0, v - 1)), 1000); return () => clearInterval(t); }, []);
  const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60);
  return `${hh}h ${mm}m`;
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
const Card3D: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; delay?: number }> =
  ({ children, style, onClick, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
      whileHover={{ y: -5, rotateX: 1.2, z: 12, transition: { duration: 0.28, ease: [0.34, 1.3, 0.64, 1] } }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </motion.div>
  );

const SideCard: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
    whileHover={{ z: 6, y: -2, transition: { duration: 0.22 } }}
    style={{ transformStyle: "preserve-3d", background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.2)" }}>
    {children}
  </motion.div>
);

const StatCard: React.FC<{ label: string; value: string; sub: string; color: string; delay: number }> = ({ label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
    whileHover={{ y: -7, z: 16, rotateX: 1.5, transition: { duration: 0.28, ease: [0.34, 1.4, 0.64, 1] } }}
    style={{ transformStyle: "preserve-3d", background: `${color}09`, border: `0.5px solid ${color}28`, borderRadius: 14, padding: "18px 16px 14px", position: "relative", overflow: "hidden", cursor: "default", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
    <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "14px 14px 0 0", background: `linear-gradient(90deg,transparent,${color},transparent)` }}
      initial={{ opacity: 0.2 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(0deg,rgba(0,0,0,0.15) 0%,transparent 100%)", pointerEvents: "none" }} />
    <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(106,101,96,0.8)", marginBottom: 10 }}>{label}</div>
    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,2.3vw,30px)", fontWeight: 400, color: "#F0EBE0", lineHeight: 1, marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>{value}</div>
    <div style={{ fontSize: 10, color }}>{sub}</div>
  </motion.div>
);

const QuantumOrb: React.FC = () => (
  <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
    {[{ size: 108, bc: "rgba(201,168,76,0.1)", dur: 20, dir: 1 }, { size: 82, bc: "rgba(201,168,76,0.2)", dur: 13, dir: -1 }, { size: 56, bc: "rgba(201,168,76,0.45)", dur: 8, dir: 1 }].map((r, i) => (
      <motion.div key={i} style={{ position: "absolute", borderRadius: "50%", border: "0.5px solid", borderColor: r.bc, width: r.size, height: r.size, top: "50%", left: "50%", marginTop: -r.size / 2, marginLeft: -r.size / 2 }}
        animate={{ rotate: r.dir * 360 }} transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }} />
    ))}
    <div style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", top: "calc(50% - 54px)", left: "calc(50% - 3px)", boxShadow: "0 0 8px rgba(201,168,76,0.9),0 0 18px rgba(201,168,76,0.45)" }} />
    <motion.div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", top: "50%", left: "50%", marginTop: -14, marginLeft: -14, background: "radial-gradient(circle at 30% 30%,#FFF5C0 0%,#EDD980 25%,#C9A84C 55%,rgba(201,168,76,0.3) 100%)" }}
      animate={{ scale: [1, 1.14, 1], boxShadow: ["0 0 18px rgba(201,168,76,0.6),0 0 36px rgba(201,168,76,0.25)", "0 0 28px rgba(201,168,76,0.85),0 0 56px rgba(201,168,76,0.35)", "0 0 18px rgba(201,168,76,0.6),0 0 36px rgba(201,168,76,0.25)"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
    <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { streak, xp, level, weeklyProgress, weeklyGoal } = useProgress();

  const [moodId, setMoodId] = useState("focused");
  const [prevMoodId, setPrevMoodId] = useState("focused");
  const [nudge, setNudge] = useState(false);
  const [dbPlan, setDbPlan] = useState<string>("free");
  const timer = useTimer(3);

  // Carica piano e mood salvato da Supabase
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.plan) setDbPlan(data.plan);
      });
    supabase
      .from("user_context")
      .select("current_mood")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.current_mood) setMoodId(data.current_mood);
      });
  }, [user]);

  const name = (user as any)?.user_metadata?.full_name?.split(" ")[0] ?? (user as any)?.fullName?.split(" ")[0] ?? "Michael";
  const plan = dbPlan;
  const isVIP = plan === "vip";
  const isPremium = plan === "premium" || isVIP;
  const mins = Math.floor((xp ?? 300) / 2);
  const lvName = getLv(level ?? 1);
  const today = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const mood = MOODS.find(m => m.id === moodId) ?? MOODS[0];

  const handleMoodSelect = async (id: string) => {
    if (id === moodId) return;
    setPrevMoodId(moodId);
    setMoodId(id);
    // Salva su Supabase user_context
    if (user) {
      await supabase
        .from("user_context")
        .upsert(
          { user_id: user.id, current_mood: id, mood_updated_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
    }
  };

  useEffect(() => {
    if (!isVIP) { const t = setTimeout(() => setNudge(true), 9000); return () => clearTimeout(t); }
  }, [isVIP]);

  return (
    <div className="w-full pb-14" style={{ perspective: 1400 }}>
      {/* ══ WELCOME MODAL (prima visita) ══ */}
      <WelcomeVideoModal />

      {/* ══ HEADER ══ */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div style={{ fontSize: 9, letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)", marginBottom: 6 }}>
          Luminel Daily Guidance · {today}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(38px,4.5vw,56px)", fontWeight: 400, lineHeight: 1.02, color: "#F0EBE0", letterSpacing: "-0.01em" }}>
          Bentornato,{" "}
          <em style={{ color: "#C9A84C", fontStyle: "italic", textShadow: "0 0 40px rgba(201,168,76,0.3)" }}>{name}</em>
        </h1>
        <div style={{ height: .5, marginTop: 18, background: "linear-gradient(90deg,rgba(201,168,76,0.45),rgba(201,168,76,0.08),transparent)" }} />
      </motion.div>

      {/* ══ MOOD SELECTOR ══ */}
      <div className="mb-3">
        <div style={{ fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "#6A6560", marginBottom: 12 }}>Come ti senti oggi?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {MOODS.map((m, idx) => {
            const on = moodId === m.id;
            return (
              <motion.button key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, z: 14, rotateX: 2, transition: { duration: 0.25, ease: [0.34, 1.5, 0.64, 1] } }}
                whileTap={{ scale: 0.97 }}
                style={{
                  transformStyle: "preserve-3d",
                  padding: "18px 8px 14px", textAlign: "center",
                  background: on ? `${m.color}18` : "rgba(255,255,255,0.028)",
                  border: `0.5px solid ${on ? m.color + "55" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, cursor: "pointer", position: "relative", overflow: "hidden",
                  boxShadow: on ? `0 12px 32px rgba(0,0,0,0.4),0 0 0 0.5px ${m.color}28,0 0 20px ${m.color}14` : "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: on ? `linear-gradient(90deg,transparent,${m.color}65,transparent)` : "transparent" }} />
                {on && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%,${m.color}10 0%,transparent 70%)` }} />}
                <motion.div
                  style={{ fontSize: 26, display: "block", marginBottom: 7, filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.4))" }}
                  animate={on ? { scale: [1, 1.18, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.5 }}>
                  {m.emoji}
                </motion.div>
                <div style={{ fontSize: 10, color: on ? m.color : "#6A6560", letterSpacing: ".04em", fontWeight: on ? 500 : 300 }}>{m.label}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ══ LUMINEL RISPONDE AL MOOD ══ */}
      <AnimatePresence mode="wait">
        <motion.div key={moodId}
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.3, ease: [0.34, 1.1, 0.64, 1] }}
          className="mb-8 overflow-hidden">
          <div style={{
            padding: "12px 18px", borderRadius: 10, marginTop: 10,
            background: `linear-gradient(135deg,${mood.color}09,rgba(6,6,15,0.3))`,
            border: `0.5px solid ${mood.color}28`,
            display: "flex", alignItems: "flex-start", gap: 12
          }}>
            <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⬡</div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: mood.color, marginBottom: 4 }}>
                Luminel · risponde al tuo stato
              </div>
              <div style={{ fontSize: 13, color: "rgba(240,235,224,0.75)", lineHeight: 1.6, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>
                "{mood.response}"
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ══ MAIN GRID ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 306px", gap: 18, alignItems: "start" }}>

        {/* ── LEFT ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* QUANTUM CORE */}
          <Card3D delay={0.05} style={{
            display: "flex", alignItems: "center", gap: 30,
            padding: "30px 32px",
            background: "linear-gradient(135deg,rgba(201,168,76,0.09) 0%,rgba(155,116,224,0.07) 55%,rgba(6,6,15,0) 100%)",
            border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 18,
            minHeight: 172, position: "relative", overflow: "hidden",
            boxShadow: "0 4px 28px rgba(0,0,0,0.3),0 1px 0 rgba(255,255,255,0.04) inset",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.65),transparent)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 18% 50%,rgba(201,168,76,0.07) 0%,transparent 55%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "rgba(155,116,224,0.06)", filter: "blur(40px)", pointerEvents: "none" }} />
            <QuantumOrb />
            <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 14 }}>⬡</span>Nucleo Identitario · Allineato
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,2vw,23px)", fontStyle: "italic", color: "rgba(240,235,224,0.88)", lineHeight: 1.38, marginBottom: 20, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                "La trasformazione non è un evento.<br />È un campo di forza che diventa te."
              </p>
              <motion.button whileHover={{ x: 5 }} onClick={() => navigate("/chat")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 10, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, letterSpacing: ".05em", background: "rgba(201,168,76,0.12)", border: "0.5px solid rgba(201,168,76,0.3)", color: "#C9A84C", cursor: "pointer" }}>
                Inizia sessione profonda <ArrowRightIcon style={{ width: 14, height: 14 }} />
              </motion.button>
            </div>
          </Card3D>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              { l: "Giorni di fila", v: `${streak ?? 3}`, s: "↑ 2% settimana", c: "#D4603A", delay: 0.1 },
              { l: "Livello", v: lvName, s: `Lv${level ?? 1} · ${xp ?? 300} xp`, c: "#C9A84C", delay: 0.14 },
              { l: "Minuti totali", v: `${mins}`, s: "↑ 15% mese", c: "#4A9ED4", delay: 0.18 },
              { l: "Community rank", v: "#8", s: "Top 3% globale", c: "#9B74E0", delay: 0.22 },
            ].map((s, i) => (
              <StatCard key={i} label={s.l} value={s.v} sub={s.s} color={s.c} delay={s.delay} />
            ))}
          </div>

          {/* REALITY QUEST — mood-adaptive */}
          <AnimatePresence mode="wait">
            <motion.div key={`rq-${moodId}`}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
              whileHover={{ y: -5, z: 10, rotateX: 0.8, transition: { duration: 0.28 } }}
              style={{
                transformStyle: "preserve-3d",
                padding: "26px 28px",
                background: "linear-gradient(135deg,rgba(212,96,58,0.1) 0%,rgba(201,168,76,0.05) 50%,rgba(6,6,15,0.3) 100%)",
                border: "0.5px solid rgba(212,96,58,0.32)", borderRadius: 18,
                position: "relative", overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,96,58,0.7),rgba(201,168,76,0.3),transparent)" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 5% 50%,rgba(212,96,58,0.09) 0%,transparent 50%)", pointerEvents: "none" }} />
              <motion.div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none" }}
                animate={{ boxShadow: ["0 0 0 rgba(212,96,58,0)", "0 0 24px rgba(212,96,58,0.14)", "0 0 0 rgba(212,96,58,0)"] }}
                transition={{ duration: 5, repeat: Infinity }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <motion.div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D4603A", boxShadow: "0 0 8px rgba(212,96,58,0.8),0 0 18px rgba(212,96,58,0.4)" }}
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span style={{ fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(212,96,58,0.85)" }}>
                    Reality Quest · AI · Oggi
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,2.2vw,27px)", fontWeight: 400, color: "#F0EBE0", marginBottom: 10, lineHeight: 1.15, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                  {mood.quest.title}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(240,235,224,0.65)", lineHeight: 1.68, marginBottom: 20, maxWidth: 680 }}
                  dangerouslySetInnerHTML={{ __html: mood.quest.body }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#D4603A", padding: "6px 15px", border: "0.5px solid rgba(212,96,58,0.4)", borderRadius: 24, background: "rgba(212,96,58,0.08)" }}>
                    ⏱ {timer} rimanenti · Missione critica
                  </div>
                  <motion.button whileHover={{ x: 4 }} onClick={() => navigate("/quests")}
                    style={{ fontSize: 12, color: "#D4603A", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans',sans-serif" }}>
                    Vai alla Quest <ArrowRightIcon style={{ width: 14, height: 14 }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* COUNCIL LOCK / WEEKLY GOAL */}
          <AnimatePresence mode="wait">
            {!isVIP ? (
              <motion.div key="lock"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.25, ease: [0.34, 1.2, 0.64, 1] }}
                whileHover={{ y: -4, z: 8, transition: { duration: 0.25 } }}
                onClick={() => navigate("/plans")}
                style={{ transformStyle: "preserve-3d", cursor: "pointer", padding: "18px 22px", background: "linear-gradient(135deg,rgba(155,116,224,0.08),rgba(201,168,76,0.04))", border: "0.5px solid rgba(155,116,224,0.22)", borderRadius: 14, position: "relative", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.2)" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(155,116,224,0.5),transparent)" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(155,116,224,0.12)", border: "0.5px solid rgba(155,116,224,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LockClosedIcon style={{ width: 18, height: 18, color: "#9B74E0" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#F0EBE0", marginBottom: 3, fontWeight: 500 }}>Il Consiglio degli Archetipi</div>
                      <div style={{ fontSize: 11, color: "#6A6560" }}>4 intelligenze AI che analizzano la tua sfida · esclusivo VIP Sovereign</div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(155,116,224,0.1)", border: "0.5px solid rgba(155,116,224,0.3)", color: "#9B74E0", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
                    Sblocca · €199 <ArrowRightIcon style={{ width: 12, height: 12 }} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="goal"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.25 }}
                style={{ padding: "18px 20px", background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#6A6560" }}>Obiettivo settimanale</span>
                  <span style={{ fontSize: 12, color: "#C9A84C" }}>{weeklyProgress ?? 3}/{weeklyGoal ?? 5} sessioni</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                  <motion.div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#C9A84C,#EDD980)" }}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(((weeklyProgress ?? 3) / (weeklyGoal ?? 5)) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 0 }}>

          {/* PERCORSO ATTIVO */}
          <SideCard delay={0.1}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px 12px", borderBottom: "0.5px solid rgba(37,35,48,0.8)", background: "rgba(255,255,255,0.012)" }}>
              <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(106,101,96,0.7)" }}>Il tuo percorso attivo</span>
              <button onClick={() => navigate("/courses")} style={{ fontSize: 10, color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Vedi tutti →</button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {COURSES.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "10px 18px", borderBottom: i < 2 ? "0.5px solid rgba(37,35,48,0.6)" : "none" }}>
                  <motion.div style={{ width: 9, height: 9, borderRadius: "50%", background: c.color, boxShadow: `0 0 7px ${c.color}80`, flexShrink: 0, marginTop: 2 }}
                    animate={{ opacity: [1, 0.45, 1] }} transition={{ duration: 2.2 + i * 0.5, repeat: Infinity }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#F0EBE0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                      {c.note === "Quasi fatto!" && <span style={{ fontSize: 9, color: c.color, flexShrink: 0, marginLeft: 4 }}>{c.note}</span>}
                    </div>
                    <div style={{ height: 3, background: "rgba(37,35,48,0.9)", borderRadius: 2, overflow: "hidden" }}>
                      <motion.div style={{ height: "100%", borderRadius: 2, background: c.color }}
                        initial={{ width: 0 }} animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#6A6560", marginTop: 3 }}>{c.note !== "Quasi fatto!" ? c.note : "Day 18/21"}</div>
                  </div>
                </div>
              ))}
            </div>
          </SideCard>

          {/* COMMUNITY */}
          <SideCard delay={0.15}>
            <div style={{ padding: "13px 18px 12px", borderBottom: "0.5px solid rgba(37,35,48,0.8)", background: "rgba(255,255,255,0.012)" }}>
              <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(106,101,96,0.7)" }}>Community · Highlight</span>
            </div>
            <div style={{ padding: "6px 0" }}>
              {COMMUNITY.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 18px", borderBottom: i < 2 ? "0.5px solid rgba(37,35,48,0.6)" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${c.color}22`, border: `0.5px solid ${c.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: c.color, fontWeight: 500, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                    {c.av}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#F0EBE0" }}>{c.name}</span>
                      <span style={{ fontSize: 9, color: c.color }}>Lv.{c.lv}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(201,168,76,0.7)", lineHeight: 1.4 }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 14px 14px" }}>
              <motion.button whileHover={{ y: -1 }} onClick={() => navigate("/community")}
                style={{ width: "100%", padding: "8px", borderRadius: 9, fontSize: 11, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", color: "#6A6560", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLElement).style.color = "#C9A84C" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#6A6560" }}>
                Vai alla Community →
              </motion.button>
            </div>
          </SideCard>

          {/* ACCESSO RAPIDO — mood-adaptive */}
          <SideCard delay={0.2}>
            <div style={{ padding: "13px 18px 12px", borderBottom: "0.5px solid rgba(37,35,48,0.8)", background: "rgba(255,255,255,0.012)" }}>
              <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(106,101,96,0.7)" }}>Accesso rapido</span>
            </div>
            <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              <AnimatePresence mode="popLayout">
                {mood.quickAccess.map((key, i) => {
                  const item = QUICK_LABELS[key];
                  const locked = key === "council" && !isVIP;
                  const route = ROUTE_MAP[key];
                  return (
                    <motion.button key={key}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                      whileHover={{ x: 3, transition: { duration: 0.15 } }}
                      onClick={() => locked ? navigate("/plans") : navigate(route)}
                      style={{ width: "100%", textAlign: "left", padding: "9px 13px", borderRadius: 9, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "space-between", background: `${item.color}09`, border: `0.5px solid ${item.color}22`, color: item.color, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}16`; (e.currentTarget as HTMLElement).style.borderColor = `${item.color}45` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}09`; (e.currentTarget as HTMLElement).style.borderColor = `${item.color}22` }}>
                      <span>{item.label}</span>
                      {locked
                        ? <LockClosedIcon style={{ width: 13, height: 13, opacity: 0.4 }} />
                        : <ArrowRightIcon style={{ width: 13, height: 13, opacity: 0.5 }} />}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </SideCard>
        </div>
      </div>

      {/* ══ FOMO SECTION ══ */}
      <FOMOSection plan={plan} streak={streak ?? 0} navigate={navigate} />

      {/* ══ VIP NUDGE ══ */}
      <AnimatePresence>
        {nudge && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ position: "fixed", bottom: 88, right: 20, zIndex: 50, width: 280, borderRadius: 14, overflow: "hidden", background: "rgba(9,9,26,0.97)", border: "0.5px solid rgba(155,116,224,0.42)", backdropFilter: "blur(24px)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(155,116,224,0.6),transparent)" }} />
            <div style={{ padding: "16px 18px", position: "relative" }}>
              <button onClick={() => setNudge(false)} style={{ position: "absolute", top: 13, right: 14, width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", color: "#6A6560", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XMarkIcon style={{ width: 12, height: 12 }} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <motion.div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9B74E0" }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <span style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#9B74E0" }}>Esclusivo VIP Sovereign</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#F0EBE0", marginBottom: 4 }}>Il Consiglio degli Archetipi</div>
              <div style={{ fontSize: 11, color: "#6A6560", marginBottom: 14, lineHeight: 1.55 }}>4 intelligenze AI che analizzano la tua sfida da ogni angolazione.</div>
              <button onClick={() => { setNudge(false); navigate("/plans"); }} style={{ width: "100%", padding: "10px", borderRadius: 9, background: "#9B74E0", color: "#fff", border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                Diventa VIP Sovereign · €199/mese
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;