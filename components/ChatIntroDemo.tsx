import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const DL = {
  void: "#06060F", deep: "#09091A",
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4", guer: "#D4603A",
  white: "#F0EBE0", muted: "#6A6560",
  glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
};

interface ChatIntroDemoProps {
  onComplete: () => void;
}

const FEATURES = [
  {
    icon: "⬡", color: DL.gold,
    title: "Coach Trasformativo",
    desc: "Non risposte generiche — domande potenti che sbloccano ciò che sai già ma non ti permetti di dire.",
  },
  {
    icon: "♛", color: DL.alch,
    title: "Shadow Work · Strategia",
    desc: "Tre modalità distinte: Coach, Shadow Work e Stratega. Ogni archetipo serve uno scopo preciso.",
  },
  {
    icon: "🔥", color: DL.guer,
    title: "Reality Quest",
    desc: "Ogni sessione termina con un'azione concreta entro 24-72 ore. Il coaching senza azione è solo intrattenimento.",
  },
];

const ChatIntroDemo: React.FC<ChatIntroDemoProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const name = (user as any)?.user_metadata?.full_name?.split(" ")[0]
    ?? (user as any)?.fullName?.split(" ")[0] ?? "Viaggiatore";

  return (
    <div style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "48px 32px", textAlign: "center",
      background: `radial-gradient(ellipse at 60% 0%, rgba(201,168,76,0.05) 0%, transparent 55%),
                  radial-gradient(ellipse at 20% 80%, rgba(155,116,224,0.05) 0%, transparent 50%),
                  ${DL.deep}`,
      borderRadius: 20, border: `0.5px solid ${DL.glassB}`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(155,116,224,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Logo orb */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ position: "relative", width: 90, height: 90, marginBottom: 32 }}>
        {/* Rings */}
        {[90, 66, 44].map((size, i) => (
          <motion.div key={i}
            style={{ position: "absolute", top: "50%", left: "50%", width: size, height: size, marginTop: -size / 2, marginLeft: -size / 2, borderRadius: "50%", border: `0.5px solid rgba(201,168,76,${0.1 + i * 0.1})` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "linear" }} />
        ))}
        {/* Core */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 16px rgba(201,168,76,0.5)", "0 0 32px rgba(201,168,76,0.8)", "0 0 16px rgba(201,168,76,0.5)"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", left: "50%", width: 26, height: 26, marginTop: -13, marginLeft: -13, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%,#FFF5C0,#EDD980 30%,#C9A84C 65%,rgba(201,168,76,0.2))" }} />
      </motion.div>

      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, marginBottom: 18 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: DL.gold, display: "inline-block" }} />
        <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: DL.gold }}>
          AI Coach · Sessione attiva
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, color: DL.white, lineHeight: 1.1, marginBottom: 16 }}>
        Benvenuto,{" "}
        <em style={{ color: DL.gold, fontStyle: "italic" }}>{name}</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ fontSize: 14, color: DL.muted, lineHeight: 1.75, maxWidth: 520, marginBottom: 48 }}>
        Questo non è un chatbot. È uno specchio trasformativo basato sul Metodo Jara — progettato per sbloccare ciò che già sai ma non ti permetti ancora di fare.
      </motion.p>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, width: "100%", maxWidth: 760, marginBottom: 44 }}>
        {FEATURES.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.1, ease: [0.34, 1.2, 0.64, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.22 } }}
            style={{ padding: "24px 20px", borderRadius: 14, background: `${f.color}08`, border: `0.5px solid ${f.color}25`, textAlign: "left" }}>
            <div style={{ fontSize: 22, marginBottom: 12, color: f.color }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: DL.white, marginBottom: 7 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: DL.muted, lineHeight: 1.6 }}>{f.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Modes */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}
        style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Coach", color: DL.gold, desc: "Sessione guidata" },
          { label: "Shadow Work", color: DL.alch, desc: "Pattern nascosti" },
          { label: "Strategia", color: DL.stra, desc: "Piano e azione" },
        ].map((m, i) => (
          <div key={i} style={{ padding: "8px 16px", borderRadius: 10, background: `${m.color}10`, border: `0.5px solid ${m.color}35`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: m.color, fontWeight: 500 }}>{m.label}</span>
            <span style={{ fontSize: 10, color: DL.muted }}>·</span>
            <span style={{ fontSize: 11, color: DL.muted }}>{m.desc}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(201,168,76,0.3)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px", borderRadius: 14, background: DL.gold, color: "#06060F", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em", boxShadow: "0 0 28px rgba(201,168,76,0.2)" }}>
        Inizia la sessione
        <ArrowRightIcon style={{ width: 18, height: 18 }} />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        style={{ marginTop: 16, fontSize: 10, color: DL.muted }}>
        Sviluppo personale ai sensi della Legge 4/2013 · Non è un servizio medico
      </motion.p>
    </div>
  );
};

export default ChatIntroDemo;