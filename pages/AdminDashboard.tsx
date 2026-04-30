import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon, UsersIcon, SparklesIcon, MegaphoneIcon,
  CurrencyEuroIcon, ShieldCheckIcon, ArrowTrendingUpIcon,
  BellAlertIcon, UserCircleIcon, Cog6ToothIcon,
  ArrowPathIcon, ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";
import {
  getFinanceKPI, getAdminUsers, getAIHealth, getFunnelData,
  getUserSegments, adminUpgradePlan,
  FinanceKPI, AdminUser, AIHealth, FunnelData,
} from "../services/adminService";
import { isAdmin } from "../services/adminService";
import { useNavigate } from "react-router-dom";

// ── RESPONSIVE STYLES ────────────────────────────────────────────────────────
const adminCSS = `
  .adm-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .adm-two-col  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .adm-seg-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
  .adm-content  { max-width: 1400px; margin: 0 auto; padding: 40px 32px; position: relative; z-index: 1; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 1100px) {
    .adm-kpi-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .adm-kpi-grid { grid-template-columns: 1fr; }
    .adm-two-col  { grid-template-columns: 1fr; }
    .adm-seg-grid { grid-template-columns: 1fr; }
    .adm-content  { padding: 20px 16px; }
    .adm-tabs     { overflow-x: auto; white-space: nowrap; }
    .adm-tabs button { padding: 10px 14px !important; font-size: 12px !important; }
  }
`;

const DL = {
  void: "#06060F", deep: "#09091A", surface: "#0D0D20",
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
  guer: "#D4603A", white: "#F0EBE0", muted: "#6A6560",
  glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
  green: "#10B981",
};

type Tab = "finance" | "crm" | "clsm" | "promo" | "ai" | "content";

// ── KPI CARD ─────────────────────────────────────────────────────────────────
const KPICard: React.FC<{ label: string; value: string; sub: string; color: string; delay?: number }> =
  ({ label, value, sub, color, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: `${color}09`, border: `0.5px solid ${color}25`, borderRadius: 16, padding: "24px 26px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
      <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, color: DL.white, lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 13, color }}>{sub}</div>
    </motion.div>
  );

// ── SECTION HEADER ────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ title: string; sub: string; color: string }> = ({ title, sub, color }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color, marginBottom: 6, opacity: .8 }}>{sub}</div>
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,3vw,40px)", fontWeight: 400, color: DL.white }}>
      {title.split("*").map((part, i) =>
        i % 2 === 0 ? part : <em key={i} style={{ color, fontStyle: "italic" }}>{part}</em>
      )}
    </h2>
  </div>
);

// ── RISK BADGE ────────────────────────────────────────────────────────────────
const RiskBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? "#D4603A" : score >= 40 ? "#F59E0B" : "#10B981";
  const label = score >= 70 ? "Alto" : score >= 40 ? "Medio" : "Basso";
  return (
    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: `${color}18`, color, border: `0.5px solid ${color}30` }}>
      {label}
    </span>
  );
};

// ── PLAN BADGE ────────────────────────────────────────────────────────────────
const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const colors: Record<string, string> = { free: DL.muted, premium: DL.gold, vip: DL.alch };
  const c = colors[plan] ?? DL.muted;
  return (
    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${c}15`, color: c, border: `0.5px solid ${c}30`, textTransform: "uppercase", letterSpacing: ".08em" }}>
      {plan}
    </span>
  );
};

// ── FINANCE MODULE ────────────────────────────────────────────────────────────
const FinanceModule: React.FC<{ kpi: FinanceKPI | null }> = ({ kpi }) => {
  if (!kpi) return <div style={{ color: DL.muted, textAlign: "center", padding: 40 }}>Caricamento...</div>;
  return (
    <div>
      <SectionHeader title="Finanza *Live*" sub="Revenue & Costi" color={DL.gold} />

      {/* KPI principali */}
      <div className="adm-kpi-grid">
        <KPICard label="MRR" value={`€${kpi.mrr.toLocaleString()}`} sub="Monthly Recurring Revenue" color={DL.gold} delay={0} />
        <KPICard label="ARR" value={`€${kpi.arr.toLocaleString()}`} sub="Proiezione annuale" color={DL.green} delay={.06} />
        <KPICard label="Utenti paganti" value={`${kpi.totalPaying}`} sub={`+${kpi.newThisWeek} questa settimana`} color={DL.stra} delay={.12} />
        <KPICard label="Margine netto" value={`${kpi.marginPct}%`} sub={`Costi AI: €${kpi.aiCostMonth}/mese`} color={DL.alch} delay={.18} />
      </div>

      {/* Breakdown per piano */}
      <div style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: DL.muted, marginBottom: 16 }}>Breakdown per piano</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(kpi.byPlan).map(([plan, data]) => {
            const colors: Record<string, string> = { free: DL.muted, premium: DL.gold, vip: DL.alch };
            const c = colors[plan] ?? DL.muted;
            const maxUsers = Math.max(...Object.values(kpi.byPlan).map(d => d.count), 1);
            return (
              <div key={plan}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: DL.white, textTransform: "capitalize" }}>{plan}</span>
                  <span style={{ fontSize: 14, color: c }}>{data.count} utenti · €{data.revenue}/mese</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(data.count / maxUsers) * 100}%` }}
                    transition={{ duration: .8, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 2, background: c }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Costi AI */}
      <div className="adm-two-col">
        <div style={{ background: "rgba(212,96,58,0.07)", border: "0.5px solid rgba(212,96,58,0.2)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 8 }}>Costi AI stimati mese</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: DL.white, marginBottom: 4 }}>€{kpi.aiCostMonth.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: "#D4603A" }}>Budget limit: €200 · {Math.round((kpi.aiCostMonth / 200) * 100)}% usato</div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden", marginTop: 10 }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#D4603A", width: `${Math.min((kpi.aiCostMonth / 200) * 100, 100)}%` }} />
          </div>
        </div>
        <div style={{ background: "rgba(16,185,129,0.07)", border: "0.5px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 8 }}>Infrastruttura mensile</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: DL.white, marginBottom: 4 }}>€80</div>
          <div style={{ fontSize: 11, color: "#10B981" }}>Vercel + Supabase + ElevenLabs</div>
        </div>
      </div>
    </div>
  );
};

// ── CRM MODULE ────────────────────────────────────────────────────────────────
const CRMModule: React.FC<{ users: AdminUser[]; onUpgrade: (id: string, plan: string) => void }> = ({ users, onUpgrade }) => {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [riskOnly, setRiskOnly] = useState(false);

  const filtered = users.filter(u => {
    if (planFilter !== "all" && u.plan !== planFilter) return false;
    if (search && !u.fullName.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskOnly && u.riskScore < 50) return false;
    return true;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 16 }}>
      <div>
        <SectionHeader title="*CRM* — Gestione Utenti" sub="Customer Relationship" color={DL.stra} />

        {/* Filtri */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per nome..."
            style={{ flex: 1, minWidth: 180, padding: "8px 14px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 9, fontSize: 12, color: DL.white, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          {["all", "free", "premium", "vip"].map(p => (
            <button key={p} onClick={() => setPlanFilter(p)}
              style={{
                padding: "7px 14px", borderRadius: 9, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                background: planFilter === p ? DL.goldDim : "rgba(255,255,255,0.03)",
                border: `0.5px solid ${planFilter === p ? DL.goldB : "rgba(255,255,255,0.07)"}`,
                color: planFilter === p ? DL.gold : DL.muted, textTransform: "capitalize"
              }}>
              {p === "all" ? "Tutti" : p}
            </button>
          ))}
          <button onClick={() => setRiskOnly(!riskOnly)}
            style={{
              padding: "7px 14px", borderRadius: 9, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              background: riskOnly ? "rgba(212,96,58,0.15)" : "rgba(255,255,255,0.03)",
              border: `0.5px solid ${riskOnly ? "rgba(212,96,58,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: riskOnly ? "#D4603A" : DL.muted
            }}>
            ⚠ Solo a rischio
          </button>
        </div>

        {/* Tabella */}
        <div style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 70px 80px", padding: "12px 20px", background: "rgba(255,255,255,0.02)", borderBottom: `0.5px solid ${DL.glassB}` }}>
            {["Utente", "Piano", "Streak", "XP", "Rischio", "Ultima att."].map(h => (
              <div key={h} style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: DL.muted }}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {filtered.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .02 }}
                onClick={() => setSelected(selected?.id === u.id ? null : u)}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 70px 80px", padding: "14px 20px", borderBottom: `0.5px solid rgba(255,255,255,0.03)`, cursor: "pointer",
                  background: selected?.id === u.id ? DL.goldDim : "transparent"
                }}
                onMouseEnter={e => { if (selected?.id !== u.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)" }}
                onMouseLeave={e => { if (selected?.id !== u.id) (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                <div>
                  <div style={{ fontSize: 14, color: DL.white, fontWeight: 500 }}>{u.fullName}</div>
                  <div style={{ fontSize: 12, color: DL.muted }}>{u.ikigaiStage}</div>
                </div>
                <div><PlanBadge plan={u.plan} /></div>
                <div style={{ fontSize: 13, color: u.streakDays >= 7 ? "#F59E0B" : DL.muted }}>🔥 {u.streakDays}g</div>
                <div style={{ fontSize: 13, color: DL.gold }}>{u.xpTotal} xp</div>
                <div><RiskBadge score={u.riskScore} /></div>
                <div style={{ fontSize: 10, color: DL.muted }}>
                  {Math.floor((Date.now() - new Date(u.lastActiveAt).getTime()) / 86400000)}g fa
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ padding: "10px 16px", borderTop: `0.5px solid ${DL.glassB}` }}>
            <span style={{ fontSize: 13, color: DL.muted }}>{filtered.length} utenti · {users.filter(u => u.plan !== "free").length} paganti</span>
          </div>
        </div>
      </div>

      {/* Dettaglio utente */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ background: DL.surface, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "20px", height: "fit-content", position: "sticky", top: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: DL.white }}>{selected.fullName}</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: DL.muted, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Piano", value: <PlanBadge plan={selected.plan} /> },
                { label: "Streak", value: `🔥 ${selected.streakDays} giorni` },
                { label: "XP totali", value: `${selected.xpTotal} xp — Lv.${selected.level}` },
                { label: "Sessioni", value: `${selected.sessionCount}` },
                { label: "Fase Ikigai", value: selected.ikigaiStage },
                { label: "Rischio churn", value: <RiskBadge score={selected.riskScore} /> },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: DL.glass, borderRadius: 8 }}>
                  <span style={{ fontSize: 11, color: DL.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: DL.white }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Azioni */}
            <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 10 }}>Azioni admin</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(["free", "premium", "vip"] as const).filter(p => p !== selected.plan).map(plan => (
                <button key={plan} onClick={() => { onUpgrade(selected.id, plan); setSelected({ ...selected, plan }); }}
                  style={{
                    padding: "9px", borderRadius: 9, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                    background: plan === "vip" ? "rgba(155,116,224,0.1)" : plan === "premium" ? DL.goldDim : "rgba(255,255,255,0.03)",
                    border: `0.5px solid ${plan === "vip" ? "rgba(155,116,224,0.3)" : plan === "premium" ? DL.goldB : "rgba(255,255,255,0.07)"}`,
                    color: plan === "vip" ? DL.alch : plan === "premium" ? DL.gold : DL.muted
                  }}>
                  Passa a {plan.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── AI HEALTH MODULE ──────────────────────────────────────────────────────────
const AIHealthModule: React.FC<{ health: AIHealth | null }> = ({ health }) => {
  if (!health) return <div style={{ color: DL.muted, textAlign: "center", padding: 40 }}>Caricamento...</div>;
  const budgetPct = Math.min((health.costThisMonth / health.budgetLimit) * 100, 100);
  const budgetColor = budgetPct > 80 ? "#D4603A" : budgetPct > 50 ? "#F59E0B" : "#10B981";

  return (
    <div>
      <SectionHeader title="AI *Health* Monitor" sub="Anthropic API Status" color={DL.alch} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <KPICard label="Messaggi oggi" value={`${health.messagesToday}`} sub="sessioni attive" color={DL.stra} delay={0} />
        <KPICard label="Costo oggi" value={`€${health.costToday}`} sub="stime reali" color={DL.gold} delay={.06} />
        <KPICard label="Costo mese" value={`€${health.costThisMonth}`} sub={`di €${health.budgetLimit} limite`} color={budgetColor} delay={.12} />
        <KPICard label="Quest generate" value={`${health.questsGenerated}`} sub="oggi da Claude" color={DL.green} delay={.18} />
      </div>

      {/* Budget meter */}
      <div style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: DL.white }}>Budget mensile Anthropic</span>
          <span style={{ fontSize: 12, color: budgetColor }}>{budgetPct.toFixed(1)}% usato</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${budgetPct}%` }}
            transition={{ duration: .8 }} style={{ height: "100%", borderRadius: 4, background: budgetColor }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: DL.muted }}>€0</span>
          <span style={{ fontSize: 10, color: DL.muted }}>€{health.budgetLimit}</span>
        </div>
      </div>

      {/* Modelli */}
      <div style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 14 }}>Modelli usati oggi</div>
        {Object.entries(health.modelBreakdown).length > 0 ? Object.entries(health.modelBreakdown).map(([model, count]) => {
          const total = Object.values(health.modelBreakdown).reduce((a, b) => a + b, 0) || 1;
          const pct = Math.round((count / total) * 100);
          const color = model.includes("opus") ? "#9B74E0" : model.includes("sonnet") ? "#C9A84C" : "#4A9ED4";
          return (
            <div key={model} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: DL.white }}>{model.split("-")[1]} ({model.split("-")[0]})</span>
                <span style={{ fontSize: 11, color }}>{pct}% · {count} msgs</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: .6 }} style={{ height: "100%", borderRadius: 2, background: color }} />
              </div>
            </div>
          );
        }) : (
          <div style={{ fontSize: 12, color: DL.muted, textAlign: "center", padding: "20px 0" }}>
            Nessun messaggio oggi — Edge Function non ancora deployata
          </div>
        )}
      </div>
    </div>
  );
};

// ── CLSM MODULE ───────────────────────────────────────────────────────────────
const CLSMModule: React.FC<{ funnel: FunnelData | null; segments: any }> = ({ funnel, segments }) => {
  if (!funnel) return <div style={{ color: DL.muted, textAlign: "center", padding: 40 }}>Caricamento...</div>;
  const steps = [
    { label: "Signup totali", value: funnel.signups, color: DL.stra },
    { label: "Onboarding completo", value: funnel.onboarded, color: DL.gold },
    { label: "Prima sessione", value: funnel.firstSession, color: DL.alch },
    { label: "Convertiti paganti", value: funnel.converted, color: DL.green },
    { label: "VIP Sovereign", value: funnel.vip, color: "#9B74E0" },
  ];
  const maxVal = funnel.signups || 1;

  return (
    <div>
      <SectionHeader title="*CLSM* — Lifecycle" sub="Customer Lifecycle Management" color={DL.green} />

      {/* Funnel */}
      <div style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "24px", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: DL.muted, marginBottom: 18 }}>Funnel di conversione</div>
        {steps.map((s, i) => {
          const pct = Math.round((s.value / maxVal) * 100);
          const convRate = i > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : 100;
          return (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 14, color: DL.white }}>{s.label}</span>
                <span style={{ fontSize: 12, color: s.color }}>{s.value.toLocaleString()} · {pct}% {i > 0 && <span style={{ color: DL.muted }}>({convRate}% dal precedente)</span>}</span>
              </div>
              <div style={{ height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: .8, delay: i * .1 }} style={{ height: "100%", borderRadius: 5, background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Segmenti */}
      <div className="adm-seg-grid">
        {[
          { label: "🚨 A rischio churn", data: segments?.atRisk, color: "#D4603A", action: "Email riattivazione" },
          { label: "⬆️ Pronti all'upgrade", data: segments?.readyToUpgrade, color: DL.gold, action: "Mostra promo Premium" },
          { label: "💎 Candidati VIP", data: segments?.vipCandidates, color: DL.alch, action: "Invita al Consiglio" },
          { label: "⭐ Super user", data: segments?.superUsers, color: DL.green, action: "Invito Elite Sovereign" },
        ].map((seg, i) => (
          <div key={i} style={{ background: `${seg.color}08`, border: `0.5px solid ${seg.color}25`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 14, color: DL.white, marginBottom: 6 }}>{seg.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: seg.color, marginBottom: 10 }}>{seg.data?.length ?? 0}</div>
            <div style={{ fontSize: 12, color: DL.muted, marginBottom: 14 }}>utenti in questo segmento</div>
            <button style={{ width: "100%", padding: "7px", borderRadius: 8, background: `${seg.color}15`, border: `0.5px solid ${seg.color}30`, color: seg.color, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              {seg.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PROMO MODULE ──────────────────────────────────────────────────────────────
const PromoModule: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", type: "discount", target: "free", discount: 20, duration: 48, code: "" });

  const promos = [
    { name: "Black Friday 2026", type: "discount", target: "free", discount: 40, uses: 0, conversions: 0, active: false, code: "BF2026" },
    { name: "Trial VIP 7 giorni", type: "trial", target: "premium", discount: 0, uses: 12, conversions: 4, active: false, code: "VIPTRIAL" },
  ];

  return (
    <div>
      <SectionHeader title="*Promo* & Coupon" sub="Growth & Conversioni" color="#D4603A" />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={() => setShowCreate(!showCreate)}
          style={{ padding: "11px 24px", borderRadius: 10, background: DL.guer, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          + Nuova Promozione
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            style={{background:DL.glass,border:`0.5px solid ${DL.goldB}`,borderRadius:14,padding:"20px 22px",marginBottom:20}}>
            <div style={{fontSize:12,color:DL.goldBr,fontWeight:600,marginBottom:16}}>Crea nuova promozione</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {[
                {label:"Nome",     key:"name",  type:"text",  placeholder:"Es. Settembre di trasformazione"},
                {label:"Target",   key:"target",type:"text",  placeholder:"free | premium | all"},
                {label:"Sconto %", key:"discount",type:"number",placeholder:"20"},
                {label:"Durata (ore)",key:"duration",type:"number",placeholder:"48"},
              ].map(f=>(
                <div key={f.key}>
                  <div style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:DL.muted,marginBottom:5}}>{f.label}</div>
                  <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                    onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{width:"100%",padding:"8px 12px",background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:8,fontSize:12,color:DL.white,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowCreate(false)}
                style={{flex:1,padding:"10px",borderRadius:9,background:"rgba(255,255,255,0.03)",border:`0.5px solid ${DL.glassB}`,color:DL.muted,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Annulla
              </button>
              <button style={{flex:2,padding:"10px",borderRadius:9,background:DL.gold,border:"none",color:"#06060F",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Crea su Stripe & Attiva
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista promo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {promos.map((p, i) => (
          <div key={i} style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: DL.white, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: DL.muted }}>
                Target: {p.target} · {p.type === "discount" ? `-${p.discount}%` : "Trial"} · Code: <span style={{ color: DL.gold }}>{p.code}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: DL.green }}>{p.conversions} conversioni</div>
              <div style={{ fontSize: 11, color: DL.muted }}>{p.uses} utilizzi</div>
            </div>
          </div>
        ))}
        {promos.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: DL.muted, fontSize: 13 }}>
            Nessuna promozione ancora — creane una per accelerare la crescita.
          </div>
        )}
      </div>
    </div>
  );
};

// ── CONTENT MODULE ────────────────────────────────────────────────────────────
const ContentModule: React.FC = () => (
  <div>
    <SectionHeader title="*Content* & Notifiche" sub="Gestione contenuti" color={DL.gold} />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[
        { title: "Corsi attivi", value: "8", sub: "3 free · 3 premium · 2 vip", color: DL.gold, action: "Gestisci corsi →" },
        { title: "Audio caricati", value: "0", sub: "Nessun audio su Storage", color: "#D4603A", action: "Carica audio →" },
        { title: "Push notification", value: "—", sub: "Configurazione pending", color: DL.muted, action: "Configura →" },
        { title: "Email automation", value: "—", sub: "Resend/Brevo pending", color: DL.muted, action: "Configura →" },
      ].map((card, i) => (
        <div key={i} style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: DL.muted, marginBottom: 8 }}>{card.title}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: card.color, marginBottom: 4 }}>{card.value}</div>
          <div style={{ fontSize: 11, color: DL.muted, marginBottom: 14 }}>{card.sub}</div>
          <button style={{ fontSize: 11, color: card.color, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
            {card.action}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ── MAIN ADMIN DASHBOARD ──────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("finance");
  const [loading, setLoading] = useState(true);
  const [kpi, setKPI] = useState<FinanceKPI | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [health, setHealth] = useState<AIHealth | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [segments, setSegments] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    isAdmin().then(admin => {
      if (!admin) { navigate("/"); return; }
      loadAll();
    });
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [kpiData, usersData, healthData, funnelData, segData] = await Promise.all([
        getFinanceKPI(),
        getAdminUsers(),
        getAIHealth(),
        getFunnelData(),
        getUserSegments(),
      ]);
      setKPI(kpiData);
      setUsers(usersData);
      setHealth(healthData);
      setFunnel(funnelData);
      setSegments(segData);
      setLastRefresh(new Date());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpgrade = async (userId: string, plan: string) => {
    await adminUpgradePlan(userId, plan as any);
    const updated = await getAdminUsers();
    setUsers(updated);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "finance", label: "Finance", icon: <CurrencyEuroIcon className="w-4 h-4" />, color: DL.gold },
    { id: "crm", label: "CRM", icon: <UsersIcon className="w-4 h-4" />, color: DL.stra },
    { id: "clsm", label: "CLSM", icon: <ArrowTrendingUpIcon className="w-4 h-4" />, color: DL.green },
    { id: "promo", label: "Promo", icon: <MegaphoneIcon className="w-4 h-4" />, color: DL.guer },
    { id: "ai", label: "AI Health", icon: <SparklesIcon className="w-4 h-4" />, color: DL.alch },
    { id: "content", label: "Contenuti", icon: <Cog6ToothIcon className="w-4 h-4" />, color: DL.gold },
  ];

  return (
    <div style={{ minHeight: "100vh", background: DL.void, color: DL.white }}>
      <style>{adminCSS}</style>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -100, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(201,168,76,0.04)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(155,116,224,0.04)", filter: "blur(90px)" }} />
      </div>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,26,0.95)", borderBottom: `0.5px solid ${DL.glassB}`, backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheckIcon style={{ width: 16, height: 16, color: DL.gold }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: DL.white }}>Luminel Admin</div>
                <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: DL.muted }}>Control Center · Michael Jara</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 10, color: DL.muted }}>Aggiornato: {lastRefresh.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
              <button onClick={loadAll} style={{ width: 32, height: 32, borderRadius: 8, background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowPathIcon style={{ width: 14, height: 14 }} />
              </button>
              <button onClick={() => navigate("/")} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `0.5px solid ${DL.glassB}`, color: DL.muted, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
                ← App
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="adm-tabs" style={{ display: "flex", gap: 1, paddingBottom: 1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 20px", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? t.color : "transparent"}`, color: tab === t.id ? t.color : DL.muted, whiteSpace: "nowrap" }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="adm-content">
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${DL.goldDim}`, borderTopColor: DL.gold, animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 13, color: DL.muted }}>Caricamento dati in tempo reale...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === "finance" && <FinanceModule kpi={kpi} />}
              {tab === "crm" && <CRMModule users={users} onUpgrade={handleUpgrade} />}
              {tab === "clsm" && <CLSMModule funnel={funnel} segments={segments} />}
              {tab === "promo" && <PromoModule />}
              {tab === "ai" && <AIHealthModule health={health} />}
              {tab === "content" && <ContentModule />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;