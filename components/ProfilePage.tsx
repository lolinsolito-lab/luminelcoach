import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon, Cog6ToothIcon, CreditCardIcon,
  ArrowRightOnRectangleIcon, ChartBarIcon, ShieldCheckIcon,
  SparklesIcon, FireIcon, ClockIcon, TrophyIcon,
  ArrowRightIcon, StarIcon,
} from "@heroicons/react/24/outline";
import { FireIcon as FireSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const DL = {
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
  guer: "#D4603A", white: "#F0EBE0", muted: "#6A6560",
  glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
  dim: "#252330",
};

// ─── LEVEL NAME ───────────────────────────────────────────────────────────────
const getLevelName = (level: number) => {
  const names = ["", "Esploratore", "Cercatore", "Discepolo", "Guerriero", "Alchimista", "Stratega", "Maestro", "Sovrano"];
  return names[Math.min(level, names.length - 1)] || "Sovrano";
};

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────
const PLAN_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  free: { label: "Explorer", color: DL.stra, bg: "rgba(74,158,212,0.1)", border: "rgba(74,158,212,0.3)" },
  premium: { label: "Premium", color: DL.gold, bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.3)" },
  vip: { label: "VIP Sovereign", color: DL.alch, bg: "rgba(155,116,224,0.1)", border: "rgba(155,116,224,0.3)" },
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode; delay: number }> =
  ({ label, value, sub, color, icon, delay }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl p-5 transition-all" whileHover={{ y: -2, borderColor: `${color}50` }}
      style={{ background: `${color}08`, border: `0.5px solid ${color}22` }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, color }}>{icon}</div>
        <div className="text-[9px] tracking-[0.14em] uppercase" style={{ color: DL.muted }}>{label}</div>
      </div>
      <div className="font-serif text-[30px] font-normal leading-none mb-1" style={{ color: DL.white }}>{value}</div>
      {sub && <div className="text-[11px]" style={{ color }}>{sub}</div>}
    </motion.div>
  );

// ─── SETTINGS ROW ─────────────────────────────────────────────────────────────
const SettingsRow: React.FC<{ icon: React.ReactNode; iconColor: string; title: string; sub: string; onClick: () => void; danger?: boolean }> =
  ({ icon, iconColor, title, sub, onClick, danger }) => (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left group"
      style={{ background: "transparent" }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? "rgba(212,96,58,0.06)" : DL.glass; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}18`, color: iconColor, border: `0.5px solid ${iconColor}25` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium" style={{ color: danger ? DL.guer : DL.white }}>{title}</div>
        <div className="text-[11px]" style={{ color: DL.muted }}>{sub}</div>
      </div>
      <ArrowRightIcon className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: danger ? DL.guer : DL.muted }} />
    </button>
  );

// ─── GOAL BAR ────────────────────────────────────────────────────────────────
const GoalBar: React.FC<{ label: string; current: number; goal: number; color: string }> = ({ label, current, goal, color }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[12px]" style={{ color: DL.muted }}>{label}</span>
      <span className="text-[11px] font-medium" style={{ color }}>{current}/{goal}</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
      <motion.div className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }} animate={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { streak, xp, level, weeklyProgress, weeklyGoal } = useProgress();
  const navigate = useNavigate();

  const handleLogout = () => { signOut(); navigate("/"); };

  if (!user) return null;

  const totalMinutes = Math.floor(xp / 2);
  const movementProg = 1;
  const movementGoal_ = 3;
  const sessionsProg = 2;
  const sessionsGoal = 4;
  const rqProg = 3;
  const rqGoal = 3;
  const plan = user.plan || "free";
  const planCfg = PLAN_CFG[plan] ?? PLAN_CFG.free;
  const levelName = getLevelName(level ?? 1);
  const xpToNext = 500 - (xp % 500);
  const xpPct = ((xp % 500) / 500) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* ── PAGE TITLE ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-[9px] tracking-[0.24em] uppercase mb-1 opacity-70" style={{ color: DL.gold }}>Il tuo spazio</div>
        <h1 className="font-serif font-normal" style={{ fontSize: "clamp(26px,5vw,38px)", color: DL.white }}>
          <em className="italic" style={{ color: DL.gold }}>Profilo</em>
        </h1>
      </motion.div>

      {/* ── HERO CARD ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl p-7 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(155,116,224,0.07))", border: `0.5px solid ${DL.goldB}` }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${DL.gold}50,transparent)` }} />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "rgba(201,168,76,0.06)", filter: "blur(40px)" }} />

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-serif text-[32px]"
            style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, color: DL.gold }}>
            {user.fullName?.charAt(0)?.toLowerCase() ?? "m"}
          </div>
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
            style={{ background: DL.gold, color: "#06060F" }}>
            {levelName}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="font-serif text-[22px] font-normal" style={{ color: DL.white }}>{user.fullName}</h2>
            <span className="text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full font-medium"
              style={{ background: planCfg.bg, color: planCfg.color, border: `0.5px solid ${planCfg.border}` }}>
              {planCfg.label}
            </span>
          </div>
          <p className="text-[12px] mb-3" style={{ color: DL.muted }}>
            {user.email ?? "jaramichael"} · Membro dal 2024 · Cernusco sul Naviglio
          </p>

          {/* XP bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: DL.muted }}>Livello {level ?? 1} · {levelName}</span>
              <span style={{ color: DL.gold }}>{xp.toLocaleString()} xp · ancora {xpToNext} al prossimo</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div className="h-full rounded-full" style={{ background: DL.gold }}
                initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
          </div>
        </div>

        {/* Edit button */}
        <button onClick={() => navigate('/settings')}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
          style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = DL.goldB; e.currentTarget.style.color = DL.white }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = DL.glassB; e.currentTarget.style.color = DL.muted }}>
          Modifica profilo
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── SETTINGS COLUMN ── */}
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: DL.muted }}>Impostazioni</div>
            <div className="rounded-xl overflow-hidden mb-4" style={{ border: `0.5px solid ${DL.glassB}`, background: "rgba(255,255,255,0.015)" }}>
              <SettingsRow icon={<UserCircleIcon className="w-4.5 h-4.5" />} iconColor={DL.stra}
                title="Dati Personali" sub="Nome, email, avatar, password"
                onClick={() => navigate("/settings")} />
              <div style={{ borderTop: `0.5px solid ${DL.dim}` }} />
              <SettingsRow icon={<Cog6ToothIcon className="w-4.5 h-4.5" />} iconColor={DL.alch}
                title="Preferenze App" sub="Notifiche, tema, lingua"
                onClick={() => navigate("/settings")} />
              <div style={{ borderTop: `0.5px solid ${DL.dim}` }} />
              <SettingsRow icon={<CreditCardIcon className="w-4.5 h-4.5" />} iconColor={DL.gold}
                title="Abbonamento" sub={`Piano ${planCfg.label} · Gestisci su Stripe`}
                onClick={() => navigate("/plans")} />
              <div style={{ borderTop: `0.5px solid ${DL.dim}` }} />
              <SettingsRow icon={<ShieldCheckIcon className="w-4.5 h-4.5" />} iconColor="#10B981"
                title="Privacy & GDPR" sub="Dati, consensi, esporta account"
                onClick={() => navigate("/settings")} />
            </div>

            {/* Plan upgrade nudge */}
            {plan !== "vip" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="rounded-xl p-4 mb-4 cursor-pointer transition-all"
                style={{ background: "rgba(155,116,224,0.06)", border: "0.5px solid rgba(155,116,224,0.22)" }}
                onClick={() => navigate("/plans")}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(155,116,224,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(155,116,224,0.22)"}>
                <div className="flex items-center gap-2 mb-1">
                  <SparklesIcon className="w-4 h-4" style={{ color: "#9B74E0" }} />
                  <span className="text-[12px] font-medium" style={{ color: DL.white }}>
                    {plan === "free" ? "Passa a Premium · €49/mese" : "Diventa VIP Sovereign · €199/mese"}
                  </span>
                </div>
                <p className="text-[11px] leading-snug" style={{ color: DL.muted }}>
                  {plan === "free"
                    ? "Chat AI illimitata, Reality Quest ogni giorno, audio binaural"
                    : "Il Consiglio degli Archetipi, Voice Coach HD, sessione con Michael Jara"}
                </p>
              </motion.div>
            )}

            {/* Logout */}
            <div className="rounded-xl overflow-hidden" style={{ border: `0.5px solid rgba(212,96,58,0.15)`, background: "rgba(212,96,58,0.03)" }}>
              <SettingsRow icon={<ArrowRightOnRectangleIcon className="w-4.5 h-4.5" />} iconColor={DL.guer}
                title="Esci dall'account" sub="Verrai disconnesso da Luminel"
                onClick={handleLogout} danger />
            </div>
          </motion.div>
        </div>

        {/* ── STATS COLUMN ── */}
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: DL.muted }}>Le tue statistiche</div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Streak" value={`${streak}g`} sub="giorni consecutivi"
              color="#F59E0B" icon={<FireSolid className="w-4 h-4" />} delay={0.15} />
            <StatCard label="Minuti totali" value={totalMinutes} sub="di pratica"
              color={DL.stra} icon={<ClockIcon className="w-4 h-4" />} delay={0.2} />
            <StatCard label="XP totali" value={xp.toLocaleString()} sub={`Lv.${level ?? 1} · ${levelName}`}
              color={DL.gold} icon={<StarSolid className="w-4 h-4" />} delay={0.25} />
            <StatCard label="Livello" value={level ?? 1} sub={levelName}
              color={DL.alch} icon={<TrophyIcon className="w-4 h-4" />} delay={0.3} />
          </div>

          {/* Weekly goals */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-xl p-5"
            style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
            <div className="text-[10px] tracking-[0.16em] uppercase mb-4" style={{ color: DL.muted }}>Obiettivi settimanali</div>
            <GoalBar label="Sessioni AI" current={sessionsProg} goal={sessionsGoal} color={DL.alch} />
            <GoalBar label="Meditazione" current={weeklyProgress} goal={weeklyGoal} color="#9B74E0" />
            <GoalBar label="Movimento" current={movementProg} goal={movementGoal_} color="#10B981" />
            <GoalBar label="Reality Quest" current={rqProg} goal={rqGoal} color={DL.gold} />
          </motion.div>

          {/* Community rank */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-4 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all"
            style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}
            onClick={() => navigate("/community")}
            onMouseEnter={e => e.currentTarget.style.borderColor = DL.goldB}
            onMouseLeave={e => e.currentTarget.style.borderColor = DL.glassB}>
            <div>
              <div className="text-[10px] tracking-[0.12em] uppercase mb-0.5" style={{ color: DL.muted }}>Community rank</div>
              <div className="font-serif text-[22px] font-normal" style={{ color: DL.gold }}>#8</div>
              <div className="text-[11px]" style={{ color: DL.muted }}>Top 3% globale · 2.340 xp</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] mb-1" style={{ color: DL.muted }}>Badge</div>
              <div className="flex items-center gap-1.5 justify-end">
                {["♛", "⭐", "🔥"].map((b, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px]"
                    style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>{b}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MODALS REMOVED — use /settings page ── */}
    </div>
  );
};

export default ProfilePage;