import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircleIcon, PauseCircleIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { predefinedPaths, moodBasedSuggestions, Path } from "./data";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PLAN_CFG = {
    free: { label: "FREE", color: "#4A9ED4", bg: "rgba(74,158,212,0.1)", border: "rgba(74,158,212,0.3)" },
    premium: { label: "PREMIUM", color: "#C9A84C", bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.3)" },
    vip: { label: "VIP", color: "#9B74E0", bg: "rgba(155,116,224,0.1)", border: "rgba(155,116,224,0.3)" },
};

const CALM_MOODS = [
    { label: "Sereno", emoji: "😌", color: "#4A9ED4" },
    { label: "Felice", emoji: "😊", color: "#C9A84C" },
    { label: "Neutro", emoji: "😐", color: "#6A6560" },
    { label: "Ansioso", emoji: "😰", color: "#D4603A" },
    { label: "Giù", emoji: "😔", color: "#9B74E0" },
];

const CalmView: React.FC<{ initialMood?: string }> = ({ initialMood }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentMood, setCurrentMood] = useState<string | null>(initialMood ?? null);
    const [suggestedPaths, setSuggestedPaths] = useState<Path[]>([]);
    const [playingPath, setPlayingPath] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const userPlan = (user as any)?.plan ?? "free";
    const isUnlocked = (plan: string) => {
        if (plan === "free") return true;
        if (plan === "premium" && (userPlan === "premium" || userPlan === "vip")) return true;
        if (plan === "vip" && userPlan === "vip") return true;
        return false;
    };

    useEffect(() => {
        const moodKey = currentMood ?? "calm";
        const cats = moodBasedSuggestions[moodKey] ?? ["Mindfulness", "Pace"];
        setSuggestedPaths(cats.flatMap(c => predefinedPaths[c] ?? []));
        setActiveCategory(null);
    }, [currentMood]);

    const displayPaths = activeCategory
        ? (predefinedPaths[activeCategory] ?? [])
        : suggestedPaths;

    return (
        <div className="pb-16 space-y-10">

            {/* ── HEADER ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(74,158,212,0.7)", marginBottom: 5 }}>
                    Spazio di pace
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,3.5vw,38px)", fontWeight: 400, color: "#F0EBE0", marginBottom: 6 }}>
                    Calm <em style={{ color: "#4A9ED4", fontStyle: "italic" }}>Space</em>
                </h2>
                <p style={{ fontSize: 13, color: "#6A6560" }}>Trova il tuo equilibrio interiore in questo momento</p>
            </motion.div>

            {/* ── MOOD SELECTOR ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 20px 16px" }}>
                <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 14 }}>
                    Come ti senti in questo momento?
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                    {CALM_MOODS.map(m => {
                        const on = currentMood === m.label;
                        return (
                            <motion.button key={m.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setCurrentMood(on ? null : m.label)}
                                style={{
                                    padding: "14px 8px 11px", textAlign: "center",
                                    background: on ? `${m.color}18` : "rgba(255,255,255,0.02)",
                                    border: `0.5px solid ${on ? m.color + "50" : "rgba(255,255,255,0.06)"}`,
                                    borderRadius: 12, cursor: "pointer", position: "relative", overflow: "hidden",
                                    boxShadow: on ? `0 8px 24px rgba(0,0,0,0.35), 0 0 16px ${m.color}12` : "none",
                                }}>
                                {on && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${m.color}60,transparent)` }} />}
                                <motion.div style={{ fontSize: 24, display: "block", marginBottom: 5 }}
                                    animate={on ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
                                    {m.emoji}
                                </motion.div>
                                <div style={{ fontSize: 10, color: on ? m.color : "#6A6560" }}>{m.label}</div>
                            </motion.button>
                        );
                    })}
                </div>
                {currentMood && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }}
                        style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 11, color: "#6A6560" }}>
                            Suggeriti per <strong style={{ color: "#F0EBE0" }}>{currentMood}</strong> ·{" "}
                            <span style={{ color: "#4A9ED4" }}>{displayPaths.length} percorsi disponibili</span>
                        </span>
                    </motion.div>
                )}
            </motion.div>

            {/* ── CATEGORY FILTER ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 12 }}>
                    Esplora per categoria
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {Object.keys(predefinedPaths).map(cat => {
                        const on = activeCategory === cat;
                        const count = predefinedPaths[cat].length;
                        return (
                            <motion.button key={cat} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                                onClick={() => setActiveCategory(on ? null : cat)}
                                style={{
                                    padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                                    background: on ? "rgba(74,158,212,0.1)" : "rgba(255,255,255,0.025)",
                                    border: `0.5px solid ${on ? "rgba(74,158,212,0.35)" : "rgba(255,255,255,0.07)"}`,
                                    color: on ? "#4A9ED4" : "#6A6560",
                                    transition: "all .18s",
                                }}>
                                {cat}
                                <span style={{ marginLeft: 5, fontSize: 9, opacity: 0.6 }}>({count})</span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── PATHS GRID ── */}
            <div>
                <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6560", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{activeCategory ?? (currentMood ? `Consigliati per "${currentMood}"` : "Suggeriti per te")}</span>
                    <span style={{ color: "#4A9ED4" }}>· {displayPaths.length} percorsi</span>
                </div>

                {displayPaths.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#6A6560" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🌊</div>
                        <div style={{ fontSize: 14, color: "#F0EBE0", marginBottom: 6 }}>Nessun percorso trovato</div>
                        <div style={{ fontSize: 12 }}>Prova un'altra categoria o umore</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                        <AnimatePresence mode="popLayout">
                            {displayPaths.map((path, i) => {
                                const pc = PLAN_CFG[path.plan as keyof typeof PLAN_CFG];
                                const unlocked = isUnlocked(path.plan);
                                const isPlaying = playingPath === path.id;
                                return (
                                    <motion.div key={path.id} layout
                                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={unlocked ? { y: -4, transition: { duration: 0.2 } } : {}}
                                        style={{
                                            borderRadius: 14, overflow: "hidden",
                                            background: "rgba(255,255,255,0.022)",
                                            border: `0.5px solid rgba(255,255,255,0.07)`,
                                            opacity: unlocked ? 1 : 0.6, cursor: unlocked ? "default" : "pointer",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                                        }}
                                        onClick={() => !unlocked && navigate("/plans")}>

                                        {/* Image */}
                                        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                                            <img src={path.imageUrl} alt={path.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", filter: unlocked ? "none" : "grayscale(80%)", transition: "transform 0.5s" }}
                                                onMouseEnter={e => unlocked && ((e.target as HTMLElement).style.transform = "scale(1.05)")}
                                                onMouseLeave={e => ((e.target as HTMLElement).style.transform = "scale(1)")} />
                                            <div style={{ position: "absolute", inset: 0, background: "rgba(6,6,15,0.35)" }} />

                                            {/* Play button */}
                                            {unlocked && (
                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                                    onClick={e => { e.stopPropagation(); setPlayingPath(p => p === path.id ? null : path.id); }}
                                                    style={{
                                                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                                        background: "none", border: "none", cursor: "pointer", opacity: 0,
                                                    }}
                                                    className="group"
                                                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                                                    <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,13,32,0.85)", border: `0.5px solid ${pc.color}50`, backdropFilter: "blur(8px)" }}>
                                                        {isPlaying
                                                            ? <PauseCircleIcon style={{ width: 26, height: 26, color: pc.color }} />
                                                            : <PlayCircleIcon style={{ width: 26, height: 26, color: pc.color }} />}
                                                    </div>
                                                </motion.button>
                                            )}

                                            {/* Lock overlay */}
                                            {!unlocked && (
                                                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(6,6,15,0.55)", backdropFilter: "blur(4px)" }}>
                                                    <LockClosedIcon style={{ width: 28, height: 28, color: "rgba(240,235,224,0.4)", marginBottom: 6 }} />
                                                    <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,235,224,0.4)" }}>Piano {pc.label}</span>
                                                </div>
                                            )}

                                            {/* Badges */}
                                            <div style={{ position: "absolute", top: 10, left: 10 }}>
                                                <span style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 20, background: "rgba(13,13,32,0.75)", color: pc.color, border: `0.5px solid ${pc.color}40`, backdropFilter: "blur(8px)" }}>
                                                    {pc.label}
                                                </span>
                                            </div>
                                            <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(13,13,32,0.75)", color: "rgba(240,235,224,0.7)", backdropFilter: "blur(8px)" }}>
                                                    {path.duration}
                                                </span>
                                            </div>

                                            {/* Playing wave */}
                                            {isPlaying && (
                                                <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "flex-end", gap: 2 }}>
                                                    {[3, 5, 4, 6, 3].map((h, n) => (
                                                        <motion.div key={n} style={{ width: 3, borderRadius: 2, background: pc.color }}
                                                            animate={{ height: [h * 2, h * 3, h * 2] }}
                                                            transition={{ duration: 0.5 + n * 0.1, repeat: Infinity, ease: "easeInOut" }} />
                                                    ))}
                                                    <span style={{ fontSize: 10, color: pc.color, marginLeft: 4 }}>In riproduzione</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: "14px 16px" }}>
                                            <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: pc.color, marginBottom: 5 }}>
                                                {path.category}
                                            </div>
                                            <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 400, color: "#F0EBE0", marginBottom: 5, lineHeight: 1.25 }}>
                                                {path.title}
                                            </h4>
                                            <p style={{ fontSize: 11, color: "#6A6560", lineHeight: 1.55, marginBottom: path.benefits ? 10 : 0 }}>
                                                {path.description}
                                            </p>
                                            {path.benefits && path.benefits.length > 0 && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                                    {path.benefits.slice(0, 2).map((b, bi) => (
                                                        <div key={bi} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(201,168,76,0.7)" }}>
                                                            <span>✦</span>{b}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalmView;