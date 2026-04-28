import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

const DL = {
  void: "#06060F", gold: "#C9A84C", goldBr: "#EDD980",
  white: "#F0EBE0", muted: "#6A6560", guer: "#D4603A",
};

const Field: React.FC<{
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  icon: React.ReactNode; autoComplete?: string; hint?: string;
}> = ({ label, type, value, onChange, placeholder, icon, autoComplete, hint }) => (
  <div>
    <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: DL.muted, marginBottom: 7 }}>{label}</div>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: DL.muted, pointerEvents: "none" }}>{icon}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, color: DL.white, outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color .15s", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
    </div>
    {hint && <div style={{ fontSize: 10, color: DL.muted, marginTop: 4 }}>{hint}</div>}
  </div>
);

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Tutti i campi sono obbligatori"); return; }
    if (password.length < 6) { setError("La password deve avere almeno 6 caratteri"); return; }
    setLoading(true); setError("");
    try {
      await signup(name, email, password);
      // Mostra messaggio di conferma email
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message ?? "Errore durante la registrazione");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true); setError("");
    try { await loginWithGoogle(); }
    catch (err: any) { setError(err.message ?? "Errore Google"); setLoading(false); }
  };

  // ── Email confirmation screen ──
  if (emailSent) {
    return (
      <div style={{ minHeight: "100vh", background: "#06060F", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ position: "absolute", top: -100, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(90px)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: "100%", maxWidth: 400, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 28 }}>
            <div style={{ width: 16, height: 16, background: "linear-gradient(135deg,#EDD980,#C9A84C)", clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, letterSpacing: ".22em", color: "#EDD980" }}>LUMINEL</span>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "0.5px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ fontSize: 28 }}>✉️</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: "#F0EBE0", marginBottom: 10 }}>
            Controlla la tua email
          </h2>
          <p style={{ fontSize: 13, color: "#6A6560", lineHeight: 1.6, marginBottom: 6 }}>
            Abbiamo inviato un link di conferma a
          </p>
          <p style={{ fontSize: 14, color: "#F0EBE0", marginBottom: 24, fontWeight: 500 }}>{email}</p>
          <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(201,168,76,0.07)", border: "0.5px solid rgba(201,168,76,0.25)", marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: "rgba(201,168,76,0.8)", lineHeight: 1.6, margin: 0 }}>
              Clicca <strong>"Confirm your mail"</strong> nell'email per attivare il tuo account Luminel.
            </p>
          </div>
          <p style={{ fontSize: 11, color: "#6A6560", marginBottom: 20 }}>
            Non la trovi? Controlla spam o cartella promozioni.
          </p>
          <button onClick={() => navigate("/login")}
            style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#C9A84C", color: "#06060F", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Vai al Login →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: DL.void, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -60, width: 320, height: 320, borderRadius: "50%", background: "rgba(155,116,224,0.05)", filter: "blur(90px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(90px)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <div style={{ width: 18, height: 18, background: "linear-gradient(135deg,#EDD980,#C9A84C)", clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, letterSpacing: ".22em", color: DL.goldBr }}>LUMINEL</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: DL.white, marginBottom: 5 }}>
            Crea il tuo account
          </h1>
          <p style={{ fontSize: 13, color: DL.muted }}>Inizia la tua trasformazione con Luminel</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "30px 28px", backdropFilter: "blur(20px)" }}>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Nome completo" type="text" value={name} onChange={setName}
              placeholder="Michael Jara" autoComplete="name"
              icon={<UserIcon style={{ width: 16, height: 16 }} />} />
            <Field label="Email" type="email" value={email} onChange={setEmail}
              placeholder="nome@esempio.com" autoComplete="email"
              icon={<EnvelopeIcon style={{ width: 16, height: 16 }} />} />
            <Field label="Password" type="password" value={password} onChange={setPassword}
              placeholder="Minimo 6 caratteri" autoComplete="new-password" hint="Almeno 6 caratteri"
              icon={<LockClosedIcon style={{ width: 16, height: 16 }} />} />

            {error && (
              <div style={{ fontSize: 12, color: DL.guer, background: "rgba(212,96,58,0.08)", border: "0.5px solid rgba(212,96,58,0.25)", borderRadius: 8, padding: "9px 12px", textAlign: "center" }}>
                {error}
              </div>
            )}

            {/* Privacy consent */}
            <div style={{ fontSize: 11, color: DL.muted, lineHeight: 1.5, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.06)" }}>
              Registrandoti accetti i{" "}
              <span style={{ color: DL.gold, cursor: "pointer" }}>Termini di Servizio</span> e la{" "}
              <span style={{ color: DL.gold, cursor: "pointer" }}>Privacy Policy</span>.
              Dati trattati da Insolito Experiences · GDPR · Server EU (Frankfurt).
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "13px", background: loading ? "rgba(201,168,76,0.4)" : DL.gold, color: "#06060F", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em", transition: "all .2s" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#06060F", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  Registrazione in corso...
                </span>
              ) : "Crea Account"}
            </motion.button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 11, color: DL.muted }}>oppure</span>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }} />
          </div>

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
          Hai già un account?{" "}
          <button onClick={() => navigate("/login")}
            style={{ color: DL.gold, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = DL.goldBr}
            onMouseLeave={e => e.currentTarget.style.color = DL.gold}>
            Accedi →
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;