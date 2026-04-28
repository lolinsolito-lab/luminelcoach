import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const STORAGE_KEY = "luminel_welcome_seen_v1";

const WelcomeVideoModal: React.FC = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"intro" | "video" | "cta">("intro");
  const [orbScale, setOrbScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const name = (user as any)?.user_metadata?.full_name?.split(" ")[0]
    ?? (user as any)?.fullName?.split(" ")[0] ?? "Viaggiatore";

  // Mostra solo la prima volta
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Orb pulse animation
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setOrbScale(s => s === 1 ? 1.08 : 1);
    }, 1800);
    return () => clearInterval(interval);
  }, [visible]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const handleVideoPhase = () => setPhase("video");

  const VIDEO_SRC = "/videos/michael-jara-welcome.mp4"; // carica qui il tuo video
  const hasRealVideo = false; // ← cambia in true quando carichi il video reale

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(6,6,15,0.92)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}>

          {/* Close */}
          <button onClick={handleClose}
            style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", color: "#6A6560", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <XMarkIcon style={{ width: 16, height: 16 }} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ width: "100%", maxWidth: 560, position: "relative" }}>

            {/* Card */}
            <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(13,13,32,0.95)", border: "0.5px solid rgba(201,168,76,0.3)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.06)" }}>
              {/* Top shimmer */}
              <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)" }} />

              <AnimatePresence mode="wait">
                {/* ── FASE INTRO — animazione cinematica ── */}
                {phase === "intro" && (
                  <motion.div key="intro"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ padding: "48px 40px 40px", textAlign: "center" }}>

                    {/* Orb animato */}
                    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 32px" }}>
                      {/* Rings */}
                      {[120, 90, 62].map((size, i) => (
                        <motion.div key={i}
                          style={{ position: "absolute", top: "50%", left: "50%", width: size, height: size, marginTop: -size/2, marginLeft: -size/2, borderRadius: "50%", border: `0.5px solid rgba(201,168,76,${0.12 + i*0.1})` }}
                          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }} />
                      ))}
                      {/* Core */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 20px rgba(201,168,76,0.5)", "0 0 40px rgba(201,168,76,0.8)", "0 0 20px rgba(201,168,76,0.5)"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ position: "absolute", top: "50%", left: "50%", width: 32, height: 32, marginTop: -16, marginLeft: -16, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #FFF5C0 0%, #EDD980 25%, #C9A84C 55%, rgba(201,168,76,0.3) 100%)" }} />
                      {/* Dot on ring */}
                      <div style={{ position: "absolute", top: "calc(50% - 60px)", left: "calc(50% - 3px)", width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", boxShadow: "0 0 8px rgba(201,168,76,0.9)" }} />
                    </div>

                    <div style={{ fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 12 }}>
                      Insolito Experiences · Metodo Jara
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 400, color: "#F0EBE0", marginBottom: 8, lineHeight: 1.2 }}>
                      Benvenuto nel tuo<br />
                      <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Impero Interiore</em>
                    </h2>
                    <p style={{ fontSize: 14, color: "#6A6560", lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
                      Ciao <strong style={{ color: "#F0EBE0" }}>{name}</strong> — sono Michael Jara. Questo è il tuo spazio di trasformazione. Non un'app. Un campo di forza che diventa te.
                    </p>

                    {/* Pillole features */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 }}>
                      {[
                        { icon: "⬡", label: "Ikigai Discovery", color: "#C9A84C" },
                        { icon: "♛", label: "Il Consiglio AI", color: "#9B74E0" },
                        { icon: "🔥", label: "Reality Quest", color: "#D4603A" },
                        { icon: "🎧", label: "Binaural Sounds", color: "#4A9ED4" },
                      ].map((f, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: `${f.color}10`, border: `0.5px solid ${f.color}30`, fontSize: 12, color: f.color }}>
                          <span>{f.icon}</span>{f.label}
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {hasRealVideo && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={handleVideoPhase}
                          style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", border: "0.5px solid rgba(201,168,76,0.4)", color: "#C9A84C", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                          <PlayIcon style={{ width: 16, height: 16 }} />
                          Guarda il messaggio di Michael Jara
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#C9A84C", color: "#06060F", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em" }}>
                        Inizia la mia trasformazione →
                      </motion.button>
                    </div>

                    <p style={{ fontSize: 10, color: "#6A6560", marginTop: 16 }}>
                      Questo messaggio apparirà una sola volta · Legge 4/2013
                    </p>
                  </motion.div>
                )}

                {/* ── FASE VIDEO — player reale ── */}
                {phase === "video" && (
                  <motion.div key="video"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "relative" }}>
                    <video ref={videoRef} src={VIDEO_SRC} controls autoPlay
                      onEnded={() => setPhase("cta")}
                      style={{ width: "100%", display: "block", maxHeight: 360, objectFit: "cover", background: "#06060F" }} />
                    <div style={{ padding: "20px 28px 28px", textAlign: "center" }}>
                      <motion.button whileHover={{ scale: 1.01 }} onClick={handleClose}
                        style={{ padding: "12px 32px", borderRadius: 10, background: "#C9A84C", color: "#06060F", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        Inizia il percorso →
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeVideoModal;
