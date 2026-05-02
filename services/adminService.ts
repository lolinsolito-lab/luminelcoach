// src/services/adminService.ts
// Servizio dati per Admin Dashboard — solo per ruolo 'admin'

import { supabase } from "./supabase";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface FinanceKPI {
  mrr:              number;
  arr:              number;
  totalPaying:      number;
  byPlan:           Record<string, { count: number; revenue: number }>;
  aiCostMonth:      number;
  marginPct:        number;
  newThisWeek:      number;
  churnThisMonth:   number;
}

export interface AdminUser {
  id:            string;
  email:         string;
  fullName:      string;
  plan:          string;
  streakDays:    number;
  xpTotal:       number;
  level:         number;
  sessionCount:  number;
  lastActiveAt:  string;
  createdAt:     string;
  ikigaiStage:   string;
  questCompleted:boolean;
  riskScore:     number; // 0-100, calcolato
}

export interface AIHealth {
  messagesToday:    number;
  costToday:        number;
  costThisMonth:    number;
  budgetLimit:      number;
  avgLatency:       number;
  errorRate:        number;
  modelBreakdown:   Record<string, number>;
  questsGenerated:  number;
  avgMsgsPerSession:number;
}

export interface Promotion {
  id:          string;
  name:        string;
  type:        "discount" | "trial" | "feature";
  target:      string;
  couponCode:  string;
  discountPct: number;
  startDate:   string;
  endDate:     string;
  uses:        number;
  conversions: number;
  active:      boolean;
}

export interface FunnelData {
  signups:       number;
  onboarded:     number;
  firstSession:  number;
  converted:     number;
  vip:           number;
}

// ─── VERIFICA ADMIN ───────────────────────────────────────────────────────────
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return data?.role === "admin";
}

// ─── FINANCE KPI ─────────────────────────────────────────────────────────────
export async function getFinanceKPI(): Promise<FinanceKPI> {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("plan, created_at, last_active_at");

  const all = profiles ?? [];
  const starter = all.filter(p => p.plan === "starter");
  const premium = all.filter(p => p.plan === "premium");
  const vip     = all.filter(p => p.plan === "vip");
  const free    = all.filter(p => p.plan === "free");

  const starterRevenue = starter.length * 9.99;
  const premiumRevenue = premium.length * 49;
  const vipRevenue     = vip.length * 199;
  const mrr            = starterRevenue + premiumRevenue + vipRevenue;

  // Stima costo AI (approssimazione)
  const aiCostMonth = (free.length * 0.06) + (starter.length * 0.15) + (premium.length * 0.35) + (vip.length * 1.80);

  // Nuovi utenti questa settimana
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const newThisWeek = all.filter(p => p.created_at > weekAgo).length;

  return {
    mrr,
    arr:            mrr * 12,
    totalPaying:    premium.length + vip.length,
    byPlan: {
      free:    { count: free.length,    revenue: 0 },
      starter: { count: starter.length, revenue: starterRevenue },
      premium: { count: premium.length, revenue: premiumRevenue },
      vip:     { count: vip.length,     revenue: vipRevenue },
    },
    aiCostMonth:    Math.round(aiCostMonth * 100) / 100,
    marginPct:      mrr > 0 ? Math.round(((mrr - aiCostMonth - 80) / mrr) * 100) : 0,
    newThisWeek,
    churnThisMonth: 0, // da implementare con storico subscriptions
  };
}

// ─── LISTA UTENTI ADMIN ───────────────────────────────────────────────────────
export async function getAdminUsers(
  filter?: { plan?: string; search?: string; riskOnly?: boolean }
): Promise<AdminUser[]> {
  let query = supabase
    .from("profiles")
    .select(`
      id, full_name, plan, streak_days, xp_total, level,
      session_count, last_active_at, created_at, ikigai_stage
    `)
    .order("created_at", { ascending: false });

  if (filter?.plan && filter.plan !== "all") {
    query = query.eq("plan", filter.plan);
  }
  if (filter?.search) {
    query = query.ilike("full_name", `%${filter.search}%`);
  }

  const { data: profiles } = await query;
  if (!profiles) return [];

  // Arricchisci con dati auth (email) e user_context
  const { data: contexts } = await supabase
    .from("user_context")
    .select("user_id, quest_completed, session_count");

  const contextMap = new Map(contexts?.map(c => [c.user_id, c]) ?? []);

  return profiles.map(p => {
    const ctx = contextMap.get(p.id);
    const daysSinceActive = p.last_active_at
      ? Math.floor((Date.now() - new Date(p.last_active_at).getTime()) / 86400000)
      : 999;

    // Risk score: 0 (safe) → 100 (alto rischio churn)
    let riskScore = 0;
    if (daysSinceActive > 14) riskScore += 40;
    if (daysSinceActive > 30) riskScore += 30;
    if ((p.streak_days ?? 0) === 0) riskScore += 20;
    if ((p.session_count ?? 0) < 3) riskScore += 10;

    return {
      id:             p.id,
      email:          "",  // caricato separatamente se necessario
      fullName:       p.full_name ?? "Utente",
      plan:           p.plan ?? "free",
      streakDays:     p.streak_days ?? 0,
      xpTotal:        p.xp_total ?? 0,
      level:          p.level ?? 1,
      sessionCount:   p.session_count ?? 0,
      lastActiveAt:   p.last_active_at ?? p.created_at,
      createdAt:      p.created_at,
      ikigaiStage:    p.ikigai_stage ?? "scoperta",
      questCompleted: ctx?.quest_completed ?? false,
      riskScore:      Math.min(riskScore, 100),
    };
  }).filter(u => !filter?.riskOnly || u.riskScore >= 50);
}

// ─── UPGRADE MANUALE PIANO ────────────────────────────────────────────────────
export async function adminUpgradePlan(
  userId: string,
  newPlan: "free" | "starter" | "premium" | "vip"
): Promise<void> {
  await supabase
    .from("profiles")
    .update({ plan: newPlan, updated_at: new Date().toISOString() })
    .eq("id", userId);
}

// ─── NOTA INTERNA ─────────────────────────────────────────────────────────────
export async function addAdminNote(userId: string, note: string): Promise<void> {
  // Salva in user_context come campo extra
  await supabase.from("user_context").upsert({
    user_id:    userId,
    updated_at: new Date().toISOString(),
  });
  // Per ora log — implementare tabella admin_notes se necessario
  console.log(`Admin note for ${userId}: ${note}`);
}

// ─── AI HEALTH ────────────────────────────────────────────────────────────────
export async function getAIHealth(): Promise<AIHealth> {
  const today = new Date().toISOString().split("T")[0];

  // Messaggi oggi
  const { count: messagesToday } = await supabase
    .from("session_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", today);

  // Modelli usati oggi
  const { data: modelData } = await supabase
    .from("session_messages")
    .select("model")
    .eq("role", "assistant")
    .gte("created_at", today);

  const modelBreakdown: Record<string, number> = {};
  modelData?.forEach(m => {
    const model = m.model ?? "unknown";
    modelBreakdown[model] = (modelBreakdown[model] ?? 0) + 1;
  });

  // Quest generate oggi
  const { count: questsToday } = await supabase
    .from("daily_reality_quests")
    .select("id", { count: "exact", head: true })
    .eq("date", today);

  // Stima costo giornaliero
  const msgs = messagesToday ?? 0;
  const costToday = msgs * 0.005; // stima media

  // Costo mese corrente (stima)
  const monthStart = new Date();
  monthStart.setDate(1);
  const { count: msgsMonth } = await supabase
    .from("session_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", monthStart.toISOString());

  return {
    messagesToday:     msgs,
    costToday:         Math.round(costToday * 100) / 100,
    costThisMonth:     Math.round(((msgsMonth ?? 0) * 0.005) * 100) / 100,
    budgetLimit:       200,
    avgLatency:        1200,  // ms — da implementare con real monitoring
    errorRate:         0.2,   // % — da implementare
    modelBreakdown,
    questsGenerated:   questsToday ?? 0,
    avgMsgsPerSession: 8.4,   // da calcolare
  };
}

// ─── FUNNEL DATI ─────────────────────────────────────────────────────────────
export async function getFunnelData(): Promise<FunnelData> {
  const { count: signups } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: withSessions } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gt("session_count", 0);

  const { count: premium } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .in("plan", ["starter", "premium", "vip"]);

  const { count: vip } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("plan", "vip");

  const total = signups ?? 1;
  return {
    signups:      total,
    onboarded:    Math.floor(total * 0.72),
    firstSession: withSessions ?? 0,
    converted:    premium ?? 0,
    vip:          vip ?? 0,
  };
}

// ─── SEGMENTI UTENTI ─────────────────────────────────────────────────────────
export async function getUserSegments() {
  const users = await getAdminUsers();
  const now = new Date();

  return {
    atRisk: users.filter(u => {
      const days = Math.floor((now.getTime() - new Date(u.lastActiveAt).getTime()) / 86400000);
      return u.plan === "free" && days > 14;
    }),
    readyToUpgrade: users.filter(u => u.plan === "free" && u.streakDays >= 7),
    vipCandidates:  users.filter(u => u.plan === "premium" && u.streakDays >= 14),
    superUsers:     users.filter(u => u.xpTotal >= 1000),
  };
}
