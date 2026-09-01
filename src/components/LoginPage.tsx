import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const DL = {
  void: "#06060F", deep: "#09091A",
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", white: "#F0EBE0", muted: "#6A6560",
  glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
  guer: "#D4603A",
};

const Field: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
}> = ({ label, type, value, onChange, placeholder, icon, autoComplete }) => (
  <div>
    <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: DL.muted, marginBottom: 7 }}>
      {label}
    </div>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: DL.muted, pointerEvents: "none" }}>
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
          background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 10, fontSize: 13, color: DL.white, outline: "none",
          fontFamily: "'DM Sans',sans-serif", transition: "border-color .15s",
          boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  </div>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Inserisci email e password"); return; }
    setLoading(true); setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Credenziali non valide");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setError("");
    try {
      await loginWithGoogle();
      // Google fa redirect esterno — non serve navigate()
    } catch (err: any) {
      setError(err.message ?? "Errore Google login");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: DL.void, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: -120, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(155,116,224,0.05)", filter: "blur(100px)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div style={{ width: 18, height: 18, background: "linear-gradient(135deg,#EDD980,#C9A84C)", clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, letterSpacing: ".22em", color: DL.goldBr }}>LUMINEL</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: DL.white, marginBottom: 6 }}>
            Bentornato
          </h1>
          <p style={{ fontSize: 13, color: DL.muted }}>Continua il tuo percorso di trasformazione</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(20px)" }}>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Email" type="email" value={email} onChange={setEmail}
              placeholder="nome@esempio.com" autoComplete="email"
              icon={<EnvelopeIcon style={{ width: 16, height: 16 }} />} />
            <Field label="Password" type="password" value={password} onChange={setPassword}
              placeholder="••••••••" autoComplete="current-password"
              icon={<LockClosedIcon style={{ width: 16, height: 16 }} />} />

            {error && (
              <div style={{ fontSize: 12, color: DL.guer, background: "rgba(212,96,58,0.08)", border: "0.5px solid rgba(212,96,58,0.25)", borderRadius: 8, padding: "9px 12px", textAlign: "center" }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: "right", marginTop: -8 }}>
              <button type="button" onClick={() => navigate("/forgot-password")}
                style={{ fontSize: 11, color: DL.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = DL.gold}
                onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                Password dimenticata?
              </button>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "13px", background: loading ? "rgba(201,168,76,0.4)" : DL.gold, color: "#06060F", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em", transition: "all .2s" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#06060F", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  Accesso in corso...
                </span>
              ) : "Accedi"}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 11, color: DL.muted }}>oppure</span>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Google */}
          <motion.button onClick={handleGoogle} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, color: DL.white, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continua con Google
          </motion.button>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: DL.muted }}>
          Non hai ancora un account?{" "}
          <button onClick={() => navigate("/onboarding")}
            style={{ color: DL.gold, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = DL.goldBr}
            onMouseLeave={e => e.currentTarget.style.color = DL.gold}>
            Inizia il percorso →
          </button>
        </p>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "rgba(106,101,96,0.5)", lineHeight: 1.5 }}>
          Luminel Coach Transformational · Legge 4/2013 · GDPR · Server EU
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;