import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ChartBarIcon, FireIcon, TrophyIcon, ClockIcon, SparklesIcon,
} from "@heroicons/react/24/outline";
import { FireIcon as FireSolid } from "@heroicons/react/24/solid";
import { useProgress } from "../../contexts/ProgressContext";
import { useAuth } from "../../contexts/AuthContext";
import { dataService, TimelineEvent, Achievement } from "../../services/DataService";

const DL = {
    gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
    goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4", guer: "#D4603A",
    white: "#F0EBE0", muted: "#6A6560", glass: "rgba(255,255,255,0.035)",
    glassB: "rgba(255,255,255,0.07)", dim: "#252330",
};

const ICON_MAP: Record<string, { icon: React.ElementType; color: string }> = {
    fire: { icon: FireIcon, color: "#F59E0B" },
    trophy: { icon: TrophyIcon, color: "#10B981" },
    sparkles: { icon: SparklesIcon, color: "#9B74E0" },
};

const StatCard: React.FC<{ label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode; delay: number }> =
    ({ label, value, sub, color, icon, delay }) => (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="rounded-xl p-5 transition-all"
            style={{ background: `${color}08`, border: `0.5px solid ${color}25` }}
            whileHover={{ y: -2, borderColor: `${color}50` }}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, color }}>{icon}</div>
                <div className="text-[10px] tracking-[0.14em] uppercase" style={{ color: DL.muted }}>{label}</div>
            </div>
            <div className="font-serif text-[32px] font-normal leading-none mb-1" style={{ color: DL.white }}>{value}</div>
            {sub && <div className="text-[11px]" style={{ color }}>{sub}</div>}
        </motion.div>
    );

const ProgressTracking: React.FC = () => {
    const { streak, xp, level, weeklyProgress, weeklyGoal } = useProgress();
    const { user } = useAuth();
    const [questsCompleted, setQuestsCompleted] = useState(0);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    const totalMinutes = Math.floor(xp / 2);
    const weeklyPct = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const progressData = await dataService.fetchUserProgress(user.id);
                setQuestsCompleted(progressData.questsCompleted);
                const timeline = await dataService.fetchTimelineEvents(user.id);
                setTimelineEvents(timeline);
                const achievementsList = await dataService.fetchAchievements(user.id);
                setAchievements(achievementsList);
            } catch (e) {
                console.error("Error fetching progress data:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    return (
        <div className="max-w-5xl mx-auto pb-16">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>
                    Metodo Jara · Evoluzione nel tempo
                </div>
                <h1 className="font-serif text-[38px] font-normal leading-tight mb-2" style={{ color: DL.white }}>
                    Il tuo <em className="italic" style={{ color: DL.gold }}>Progresso</em>
                </h1>
                <p className="text-[13px]" style={{ color: DL.muted }}>Segui la tua evoluzione trasformazionale</p>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Streak" value={`${streak}g`} sub="giorni consecutivi" color="#F59E0B"
                    icon={<FireSolid className="w-5 h-5" />} delay={0} />
                <StatCard label="Tempo totale" value={`${totalMinutes}`} sub="minuti di pratica" color={DL.stra}
                    icon={<ClockIcon className="w-5 h-5" />} delay={0.08} />
                <StatCard label="Quest completate" value={loading ? "…" : questsCompleted} sub="percorsi finiti" color="#10B981"
                    icon={<TrophyIcon className="w-5 h-5" />} delay={0.16} />
                <StatCard label="Livello" value={level} sub={`${xp} xp totali`} color={DL.gold}
                    icon={<ChartBarIcon className="w-5 h-5" />} delay={0.24} />
            </div>

            {/* Weekly goal */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-xl p-6 mb-10"
                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[10px] tracking-[0.16em] uppercase mb-0.5" style={{ color: DL.muted }}>Obiettivo settimanale</div>
                        <div className="text-[14px] font-medium" style={{ color: DL.white }}>Sessioni di meditazione</div>
                    </div>
                    <div className="text-right">
                        <div className="font-serif text-[28px] font-normal leading-none" style={{ color: DL.gold }}>
                            {weeklyProgress}<span className="text-[16px] opacity-50">/{weeklyGoal}</span>
                        </div>
                        <div className="text-[10px]" style={{ color: DL.muted }}>{Math.round(weeklyPct)}% completato</div>
                    </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${DL.gold}, ${DL.goldBr})` }}
                        initial={{ width: 0 }} animate={{ width: `${weeklyPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }} />
                </div>
                {weeklyProgress >= weeklyGoal && (
                    <div className="mt-3 text-[11px] flex items-center gap-1.5" style={{ color: DL.gold }}>
                        <SparklesIcon className="w-3.5 h-3.5" />Obiettivo settimanale raggiunto! +50 XP bonus
                    </div>
                )}
            </motion.div>

            {/* XP Level bar */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="rounded-xl p-6 mb-10"
                style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-[10px] tracking-[0.16em] uppercase mb-0.5" style={{ color: DL.gold }}>Livello {level}</div>
                        <div className="text-[14px] font-medium" style={{ color: DL.white }}>
                            {level === 1 ? "Esploratore" : level === 2 ? "Cercatore" : level === 3 ? "Discepolo" : level === 4 ? "Guerriero" : level === 5 ? "Alchimista" : level === 6 ? "Stratega" : level === 7 ? "Maestro" : "Sovrano"}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-serif text-[22px] font-normal" style={{ color: DL.goldBr }}>{xp.toLocaleString()} xp</div>
                        <div className="text-[10px]" style={{ color: DL.muted }}>prossimo livello: {(level * 500 - xp % 500)} xp</div>
                    </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: DL.gold }}
                        initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} />
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="mb-10">
                <div className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: DL.muted }}>Cronologia</div>
                <h3 className="font-serif text-[24px] font-normal mb-6" style={{ color: DL.white }}>
                    La tua <em className="italic" style={{ color: DL.gold }}>Timeline</em>
                </h3>
                {loading ? (
                    <div className="text-center py-10 text-[13px]" style={{ color: DL.muted }}>
                        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
                            style={{ borderColor: DL.goldDim, borderTopColor: DL.gold }} />
                        Caricamento…
                    </div>
                ) : timelineEvents.length > 0 ? (
                    <div className="space-y-4">
                        {timelineEvents.map((ev, i) => (
                            <motion.div key={ev.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                                className="relative pl-8 pb-6 last:pb-0"
                                style={{ borderLeft: `0.5px solid rgba(201,168,76,0.25)` }}>
                                <div className="absolute left-[-10px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
                                    style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
                                    {ev.icon}
                                </div>
                                <div className="rounded-xl p-4" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="text-[13px] font-medium" style={{ color: DL.white }}>{ev.title}</span>
                                        <span className="text-[10px] flex-shrink-0 ml-3" style={{ color: DL.muted }}>
                                            {new Date(ev.date).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                                        </span>
                                    </div>
                                    {ev.progress !== undefined && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] mb-1" style={{ color: DL.muted }}>
                                                <span>Progresso</span><span style={{ color: DL.gold }}>{ev.progress}%</span>
                                            </div>
                                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                <div className="h-full rounded-full" style={{ width: `${ev.progress}%`, background: DL.gold }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl p-10 text-center" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                        <SparklesIcon className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: DL.muted }} />
                        <p className="text-[13px]" style={{ color: DL.muted }}>Nessun evento — inizia una sessione per popolare la timeline</p>
                    </div>
                )}
            </div>

            {/* Achievements */}
            <div>
                <div className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: DL.muted }}>Conquiste</div>
                <h3 className="font-serif text-[24px] font-normal mb-6" style={{ color: DL.white }}>
                    I tuoi <em className="italic" style={{ color: DL.gold }}>Traguardi</em>
                </h3>
                {loading ? (
                    <div className="text-center py-6 text-[13px]" style={{ color: DL.muted }}>Caricamento…</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {achievements.map((ach, i) => {
                            const cfg = ICON_MAP[ach.icon] ?? ICON_MAP.sparkles;
                            const Icon = cfg.icon;
                            return (
                                <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="rounded-xl p-5 text-center transition-all"
                                    style={{ background: ach.unlocked ? `${cfg.color}08` : "rgba(255,255,255,0.015)", border: `0.5px solid ${ach.unlocked ? cfg.color + "30" : DL.glassB}`, opacity: ach.unlocked ? 1 : 0.45 }}
                                    whileHover={ach.unlocked ? { y: -2 } : {}}>
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                                        style={{ background: ach.unlocked ? `${cfg.color}18` : "rgba(255,255,255,0.03)" }}>
                                        <Icon className="w-7 h-7" style={{ color: ach.unlocked ? cfg.color : DL.muted }} />
                                    </div>
                                    <div className="text-[14px] font-medium mb-1" style={{ color: ach.unlocked ? DL.white : DL.muted }}>{ach.title}</div>
                                    <p className="text-[11px] leading-snug" style={{ color: DL.muted }}>{ach.description}</p>
                                    {ach.unlocked && (
                                        <div className="mt-2 text-[9px] tracking-[0.12em] uppercase" style={{ color: cfg.color }}>Sbloccato ✓</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressTracking;

