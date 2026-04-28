import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const DL = {
  void: "#06060F", gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", white: "#F0EBE0", muted: "#6A6560", guer: "#D4603A",
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Inserisci la tua email"); return; }
    setLoading(true); setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Errore nell'invio. Riprova.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: DL.void, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(90px)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>

        {/* Back */}
        <button onClick={() => navigate("/login")}
          style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: DL.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 24 }}
          onMouseEnter={e => e.currentTarget.style.color = DL.white}
          onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Torna al login
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <div style={{ width: 16, height: 16, background: "linear-gradient(135deg,#EDD980,#C9A84C)", clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, letterSpacing: ".22em", color: DL.goldBr }}>LUMINEL</span>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(20px)" }}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 400, color: DL.white, marginBottom: 8, textAlign: "center" }}>
                  Password dimenticata?
                </h2>
                <p style={{ fontSize: 13, color: DL.muted, textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
                  Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: DL.muted, marginBottom: 7 }}>Email</div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: DL.muted, pointerEvents: "none" }}>
                        <EnvelopeIcon style={{ width: 16, height: 16 }} />
                      </div>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="nome@esempio.com" autoComplete="email"
                        style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, color: DL.white, outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color .15s", boxSizing: "border-box" }}
                        onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ fontSize: 12, color: DL.guer, background: "rgba(212,96,58,0.08)", border: "0.5px solid rgba(212,96,58,0.25)", borderRadius: 8, padding: "9px 12px", textAlign: "center" }}>
                      {error}
                    </div>
                  )}

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
                    style={{ width: "100%", padding: "13px", background: loading ? DL.goldDim : DL.gold, color: "#06060F", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}>
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#06060F", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                        Invio in corso...
                      </span>
                    ) : "Invia istruzioni"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "0.5px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <CheckCircleIcon style={{ width: 28, height: 28, color: "#10B981" }} />
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 400, color: DL.white, marginBottom: 8 }}>
                  Email inviata
                </h2>
                <p style={{ fontSize: 13, color: DL.muted, marginBottom: 6, lineHeight: 1.6 }}>
                  Controlla la casella di{" "}
                  <span style={{ color: DL.white }}>{email}</span>
                </p>
                <p style={{ fontSize: 12, color: DL.muted, marginBottom: 24 }}>
                  Il link scade in 60 minuti.
                </p>
                <motion.button whileHover={{ scale: 1.01 }} onClick={() => navigate("/login")}
                  style={{ width: "100%", padding: "12px", background: DL.gold, color: "#06060F", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Torna al login
                </motion.button>
                <button onClick={() => { setSent(false); setEmail(""); }}
                  style={{ marginTop: 12, fontSize: 12, color: DL.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.color = DL.white}
                  onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                  Reinvia email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;