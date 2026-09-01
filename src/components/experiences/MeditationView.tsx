import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MagnifyingGlassIcon, PlayCircleIcon, ClockIcon,
    LockClosedIcon, SparklesIcon, HeartIcon, XMarkIcon, PauseIcon,
} from "@heroicons/react/24/outline";
import { meditationData, goals, durations, Meditation } from "./data";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PLAN_CFG = {
    free: { label: "FREE", color: "#4A9ED4" },
    premium: { label: "PREMIUM", color: "#C9A84C" },
    vip: { label: "VIP", color: "#9B74E0" },
};

const MeditationView: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userPlan = (user as any)?.plan ?? "free";

    const [search, setSearch] = useState("");
    const [selGoal, setSelGoal] = useState<string | null>(null);
    const [selDuration, setSelDuration] = useState<string | null>(null);
    const [filtered, setFiltered] = useState<Meditation[]>(meditationData);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [timerSecs, setTimerSecs] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [selCategory, setSelCategory] = useState<string | null>(null);

    const isUnlocked = (plan: string) => {
        if (plan === "free") return true;
        if (plan === "premium" && (userPlan === "premium" || userPlan === "vip")) return true;
        if (plan === "vip" && userPlan === "vip") return true;
        return false;
    };

    // Filter
    useEffect(() => {
        let f = meditationData;
        if (search) { const q = search.toLowerCase(); f = f.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)); }
        if (selGoal) f = f.filter(m => m.goals.includes(selGoal));
        if (selDuration) f = f.filter(m => m.duration === selDuration);
        if (selCategory) f = f.filter(m => m.category === selCategory);
        setFiltered(f);
    }, [search, selGoal, selDuration, selCategory]);

    // Timer
    useEffect(() => {
        let t: number;
        if (timerRunning) t = window.setInterval(() => setTimerSecs(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [timerRunning]);

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const categories = [...new Set(meditationData.map(m => m.category))];
    const hasFilters = search || selGoal || selDuration || selCategory;
    const clearAll = () => { setSearch(""); setSelGoal(null); setSelDuration(null); setSelCategory(null); };

    return (
        <div className="pb-20 space-y-8">

            {/* ── HEADER ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)" }}>
                    Libreria completa
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,3.5vw,38px)", fontWeight: 400, color: "#F0EBE0" }}>
                    Meditation <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Studio</em>
                </h2>
                <p style={{ fontSize: 13, color: "#6A6560" }}>Coltiva pace interiore e presenza · {meditationData.length} meditazioni disponibili</p>
            </motion.div>

            {/* ── SEARCH ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{ position: "relative" }}>
                <MagnifyingGlassIcon style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6A6560" }} />
                <input type="text" placeholder="Cerca meditazione, tecnica, obiettivo..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", paddingLeft: 42, paddingRight: 36, paddingTop: 11, paddingBottom: 11, borderRadius: 12, fontSize: 13, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", color: "#F0EBE0", outline: "none", fontFamily: "'DM Sans',sans-serif", transition: "border-color .15s" }}
                    onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.35)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                {search && (
                    <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                        <XMarkIcon style={{ width: 16, height: 16, color: "#6A6560" }} />
                    </button>
                )}
            </motion.div>

            {/* ── TIMER WIDGET ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                style={{ padding: "18px 22px", borderRadius: 14, background: "rgba(201,168,76,0.06)", border: "0.5px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: 5 }}>Timer meditazione</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 400, color: "#F0EBE0", lineHeight: 1 }}>{fmt(timerSecs)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setTimerRunning(r => !r)}
                        style={{ padding: "9px 20px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: timerRunning ? "rgba(212,96,58,0.12)" : "rgba(201,168,76,0.12)", color: timerRunning ? "#D4603A" : "#C9A84C", border: `0.5px solid ${timerRunning ? "rgba(212,96,58,0.3)" : "rgba(201,168,76,0.3)"}` }}>
                        {timerRunning ? "⏸ Pausa" : "▶ Avvia"}
                    </motion.button>
                    <button onClick={() => { setTimerSecs(0); setTimerRunning(false); }}
                        style={{ padding: "9px 14px", borderRadius: 10, fontSize: 12, cursor: "pointer", background: "rgba(255,255,255,0.03)", color: "#6A6560", border: "0.5px solid rgba(255,255,255,0.07)", fontFamily: "'DM Sans',sans-serif" }}>
                        Reset
                    </button>
                </div>
            </motion.div>

            {/* ── CATEGORY TABS ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 10 }}>Categorie</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {categories.map(cat => {
                        const on = selCategory === cat;
                        return (
                            <motion.button key={cat} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setSelCategory(on ? null : cat)}
                                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: on ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.025)", border: `0.5px solid ${on ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`, color: on ? "#EDD980" : "#6A6560", transition: "all .15s" }}>
                                {cat}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── FILTERS ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Goals */}
                <div>
                    <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <SparklesIcon style={{ width: 13, height: 13, color: "#C9A84C" }} />Obiettivo
                    </div>
                    <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4 }}>
                        {goals.map(g => {
                            const Icon = g.icon;
                            const on = selGoal === g.id;
                            return (
                                <motion.button key={g.id} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => setSelGoal(on ? null : g.id)}
                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: on ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)", border: `0.5px solid ${on ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`, color: on ? "#EDD980" : "#6A6560", transition: "all .15s" }}>
                                    <Icon style={{ width: 13, height: 13 }} />{g.name}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <ClockIcon style={{ width: 13, height: 13, color: "#C9A84C" }} />Durata
                    </div>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                        {durations.map(d => {
                            const on = selDuration === d.value;
                            return (
                                <button key={d.value} onClick={() => setSelDuration(on ? null : d.value)}
                                    style={{ padding: "6px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: on ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)", border: `0.5px solid ${on ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`, color: on ? "#EDD980" : "#6A6560", transition: "all .15s" }}>
                                    {d.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Clear */}
                {hasFilters && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={clearAll}
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6A6560", background: "none", border: "none", cursor: "pointer", width: "fit-content" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#F0EBE0")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#6A6560")}>
                        <XMarkIcon style={{ width: 14, height: 14 }} />
                        Resetta filtri
                        <span style={{ color: "#C9A84C" }}>({filtered.length} risultati)</span>
                    </motion.button>
                )}
            </motion.div>

            {/* ── GRID ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                        <div style={{ fontSize: 14, color: "#F0EBE0", marginBottom: 6 }}>Nessuna meditazione trovata</div>
                        <div style={{ fontSize: 12, color: "#6A6560", marginBottom: 20 }}>Prova a modificare i filtri</div>
                        <button onClick={clearAll} style={{ padding: "9px 20px", borderRadius: 10, fontSize: 12, cursor: "pointer", background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.3)", color: "#C9A84C", fontFamily: "'DM Sans',sans-serif" }}>
                            Mostra tutto
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((m, i) => {
                                const pc = PLAN_CFG[m.plan as keyof typeof PLAN_CFG];
                                const unlocked = isUnlocked(m.plan);
                                const isPlay = playingId === m.id;
                                return (
                                    <motion.div key={m.id} layout
                                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.04 }}
                                        whileHover={unlocked ? { y: -4, transition: { duration: 0.2 } } : {}}
                                        style={{ borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.022)", border: `0.5px solid rgba(255,255,255,0.07)`, opacity: unlocked ? 1 : 0.6, cursor: unlocked ? "default" : "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
                                        onClick={() => !unlocked && navigate("/plans")}>

                                        {/* Image */}
                                        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                                            {m.image ? (
                                                <img src={m.image} alt={m.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: unlocked ? "none" : "grayscale(80%)" }} />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: `${pc.color}08` }}>
                                                    {m.icon}
                                                </div>
                                            )}
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(13,13,32,0.85) 0%,rgba(13,13,32,0.1) 60%)" }} />

                                            {/* Badges */}
                                            <div style={{ position: "absolute", top: 10, left: 10 }}>
                                                <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 20, background: "rgba(13,13,32,0.8)", color: pc.color, border: `0.5px solid ${pc.color}40`, backdropFilter: "blur(8px)" }}>
                                                    {m.plan === "free" ? "✦ FREE" : m.plan === "premium" ? "⭐ PREMIUM" : "♛ VIP"}
                                                </span>
                                            </div>
                                            <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(13,13,32,0.8)", color: "rgba(240,235,224,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 3 }}>
                                                    <ClockIcon style={{ width: 11, height: 11 }} />{m.duration}
                                                </span>
                                            </div>
                                            {m.isNew && (
                                                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                                                    <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, background: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "0.5px solid rgba(201,168,76,0.4)" }}>Nuovo</span>
                                                </div>
                                            )}

                                            {/* Lock */}
                                            {!unlocked && (
                                                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(6,6,15,0.5)", backdropFilter: "blur(4px)" }}>
                                                    <LockClosedIcon style={{ width: 28, height: 28, color: "rgba(240,235,224,0.4)", marginBottom: 6 }} />
                                                    <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,235,224,0.4)" }}>Piano {pc.label}</span>
                                                </div>
                                            )}

                                            {/* Play hover */}
                                            {unlocked && (
                                                <motion.button
                                                    initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                                                    onClick={e => { e.stopPropagation(); setPlayingId(p => p === m.id ? null : m.id); }}
                                                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
                                                    <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,13,32,0.85)", border: `0.5px solid ${pc.color}50`, backdropFilter: "blur(8px)" }}>
                                                        {isPlay
                                                            ? <PauseIcon style={{ width: 22, height: 22, color: pc.color }} />
                                                            : <PlayCircleIcon style={{ width: 24, height: 24, color: pc.color }} />}
                                                    </div>
                                                </motion.button>
                                            )}

                                            {/* Playing waveform */}
                                            {isPlay && (
                                                <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "flex-end", gap: 2 }}>
                                                    {[3, 5, 4, 6, 3].map((h, n) => (
                                                        <motion.div key={n} style={{ width: 3, borderRadius: 2, background: pc.color }}
                                                            animate={{ height: [h * 2, h * 4, h * 2] }}
                                                            transition={{ duration: 0.45 + n * 0.08, repeat: Infinity, ease: "easeInOut" }} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                                <span style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: `${pc.color}10`, color: pc.color, border: `0.5px solid ${pc.color}25` }}>
                                                    {m.category}
                                                </span>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6A6560" }}>
                                                    <HeartIcon style={{ width: 12, height: 12 }} />{m.goals.length} obiettivi
                                                </div>
                                            </div>
                                            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 400, color: "#F0EBE0", marginBottom: 5, lineHeight: 1.25 }}>
                                                {m.title}
                                            </h3>
                                            <p style={{ fontSize: 11, color: "#6A6560", lineHeight: 1.55 }}>{m.description}</p>
                                            {m.instructor && (
                                                <div style={{ fontSize: 10, color: "rgba(201,168,76,0.6)", marginTop: 8 }}>
                                                    by {m.instructor}
                                                </div>
                                            )}
                                            {m.popularity >= 90 && (
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 10, color: "#C9A84C" }}>
                                                    <SparklesIcon style={{ width: 12, height: 12 }} />
                                                    Molto popolare · {m.popularity}% rating
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MeditationView;