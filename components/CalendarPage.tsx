import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon,
    ClockIcon, UserGroupIcon, BookOpenIcon, HeartIcon,
    MoonIcon, StarIcon, PlusIcon, CheckCircleIcon,
    BellIcon, XMarkIcon, PlayIcon, LockClosedIcon,
    FireIcon, SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid, FireIcon as FireSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthContext";
import CalendarSakuraPetals from "./calendar/CalendarSakuraPetals";
import CalendarLoadingScreen from "./calendar/CalendarLoadingScreen";
import NewEventModal from "./calendar/NewEventModal";
import ProgressTracking from "./journey/ProgressTracking";

// ─── DARK LUXURY TOKENS ───────────────────────────────────────────────────────
const DL = {
    gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
    goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
    guer: "#D4603A", white: "#F0EBE0", muted: "#6A6560",
    glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)",
    dim: "#252330", deep: "#09091A", surface: "#0D0D20",
};

// ─── EVENT TYPES ─────────────────────────────────────────────────────────────
const EVENT_TYPES: Record<string, { color: string; icon: React.ReactNode; label: string; bg: string }> = {
    session: { color: "#4A9ED4", icon: <UserGroupIcon className="w-4 h-4" />, label: "Sessione Live", bg: "rgba(74,158,212,0.08)" },
    course: { color: "#C9A84C", icon: <BookOpenIcon className="w-4 h-4" />, label: "Corso", bg: "rgba(201,168,76,0.08)" },
    meditation: { color: "#9B74E0", icon: <MoonIcon className="w-4 h-4" />, label: "Meditazione", bg: "rgba(155,116,224,0.08)" },
    calm: { color: "#10B981", icon: <HeartIcon className="w-4 h-4" />, label: "Calm Space", bg: "rgba(16,185,129,0.08)" },
    quest: { color: "#D4603A", icon: <FireIcon className="w-4 h-4" />, label: "Reality Quest", bg: "rgba(212,96,58,0.08)" },
    personal: { color: "#F59E0B", icon: <StarIcon className="w-4 h-4" />, label: "Personale", bg: "rgba(245,158,11,0.08)" },
};

// ─── SAMPLE EVENTS — collegati ai dati reali dell'app ─────────────────────────
const makeEvents = () => {
    const today = new Date();
    const d = (days: number) => { const x = new Date(today); x.setDate(today.getDate() + days); return x; };
    return [
        { id: "rq-1", title: "Reality Quest · Decisione Rimasta nel Cassetto", type: "quest", date: today, time: "09:00", duration: 30, plan: "free", completed: false, booked: true, desc: "Identifica UNA decisione che rimandi. Prendila entro 3 ore.", linked: "quests" },
        { id: "med-breath", title: "Respirazione Consapevole", type: "meditation", date: today, time: "07:30", duration: 10, plan: "free", completed: true, booked: true, desc: "Tecnica 4-7-8 per iniziare la giornata con chiarezza.", linked: "experiences" },
        { id: "calm-1", title: "Gamma Wave · Focus Estremo", type: "calm", date: today, time: "15:00", duration: 25, plan: "premium", completed: false, booked: true, desc: "Frequenza 40Hz per produttività e creatività avanzata.", linked: "experiences" },
        { id: "course-ml", title: "The Art of Mindful Living · Day 18", type: "course", date: today, time: "20:00", duration: 20, plan: "free", completed: false, booked: true, desc: "Integrazione Profonda — visualizza la tua versione più alta.", linked: "courses", progress: 85 },
        { id: "session-1", title: "Sessione AI · Shadow Work", type: "session", date: d(1), time: "10:00", duration: 45, plan: "premium", completed: false, booked: false, desc: "Sessione profonda con Luminel — modalità Shadow Work.", linked: "chat" },
        { id: "course-ei", title: "Emotional Intelligence · Day 20", type: "course", date: d(1), time: "08:00", duration: 25, plan: "premium", completed: false, booked: true, desc: "Empatia Attiva: ascolta senza preparare la risposta.", linked: "courses", progress: 65 },
        { id: "council-1", title: "Il Consiglio degli Archetipi", type: "session", date: d(1), time: "18:00", duration: 60, plan: "vip", completed: false, booked: false, desc: "Convoca i 4 archetipi per analizzare la tua sfida attuale.", linked: "council" },
        { id: "rq-2", title: "Reality Quest · Lettera a Te Stesso", type: "quest", date: d(2), time: "09:00", duration: 30, plan: "free", completed: false, booked: true, desc: "Scrivi una lettera a te stesso di 3 mesi fa. Cosa ha cambiato?", linked: "quests" },
        { id: "med-zen", title: "Meditazione Zen · 45 min", type: "meditation", date: d(2), time: "21:00", duration: 45, plan: "vip", completed: false, booked: false, desc: "Pratica tradizionale Zen per meditatori avanzati.", linked: "experiences" },
        { id: "course-dt", title: "Deep Transformation · Day 23", type: "course", date: d(3), time: "08:00", duration: 30, plan: "vip", completed: false, booked: true, desc: "La Mappa delle Credenze — sfida una credenza limitante oggi.", linked: "courses", progress: 38 },
        { id: "calm-2", title: "Theta Wave · Riprogrammazione Profonda", type: "calm", date: d(3), time: "22:00", duration: 30, plan: "premium", completed: false, booked: false, desc: "6Hz — accesso all'inconscio e creatività espansa.", linked: "experiences" },
        { id: "session-call", title: "Voice Coach · Sessione Vocale", type: "session", date: d(4), time: "11:00", duration: 60, plan: "vip", completed: false, booked: false, desc: "Sessione vocale HD con Luminel — analisi emotiva post-call.", linked: "call" },
        { id: "personal-1", title: "Journaling Ikigai", type: "personal", date: d(-1), time: "20:00", duration: 20, plan: "free", completed: true, booked: true, desc: "Riflessione quotidiana sui 4 cerchi dell'Ikigai.", linked: "quests" },
        { id: "personal-2", title: "Lettura · The Power of Now", type: "personal", date: d(-2), time: "21:00", duration: 30, plan: "free", completed: true, booked: true, desc: "30 minuti di lettura contemplativa.", linked: null },
    ];
};

const PLAN_ORDER: Record<string, number> = { free: 0, premium: 1, vip: 2 };
const canAccess = (userPlan: string, eventPlan: string) => PLAN_ORDER[userPlan] >= PLAN_ORDER[eventPlan];

// ─── STAT ROW (mini stat nel header) ─────────────────────────────────────────
const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: `${color}10`, border: `0.5px solid ${color}25` }}>
        <span style={{ color }}>{icon}</span>
        <div>
            <div className="text-[10px]" style={{ color: DL.muted }}>{label}</div>
            <div className="text-[12px] font-medium" style={{ color: DL.white }}>{value}</div>
        </div>
    </div>
);

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
const EventCard: React.FC<{ event: any; userPlan: string; onSelect: (e: any) => void; delay?: number }> = ({ event, userPlan, onSelect, delay = 0 }) => {
    const et = EVENT_TYPES[event.type];
    const ok = canAccess(userPlan, event.plan);
    return (
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
            onClick={() => onSelect(event)}
            className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
            style={{ background: event.completed ? "rgba(16,185,129,0.06)" : et.bg, border: `0.5px solid ${event.completed ? "rgba(16,185,129,0.3)" : et.color + "30"}`, opacity: ok ? 1 : 0.55 }}
            whileHover={ok ? { y: -1, borderColor: `${et.color}60` } : {}}>
            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: et.color }} />
            <div className="pl-4 pr-4 py-3.5 flex items-start gap-3">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${et.color}20`, color: et.color }}>
                    {event.completed ? <CheckSolid className="w-4 h-4" style={{ color: "#10B981" }} /> : et.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <div className="text-[13px] font-medium leading-snug truncate" style={{ color: event.completed ? "#10B981" : DL.white }}>{event.title}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="flex items-center gap-1 text-[10px]" style={{ color: DL.muted }}>
                                    <ClockIcon className="w-3 h-3" />{event.time} · {event.duration}min
                                </span>
                                {event.progress !== undefined && (
                                    <span className="text-[10px]" style={{ color: et.color }}>{event.progress}% completato</span>
                                )}
                            </div>
                            {/* Mini progress bar for courses/quests */}
                            {event.progress !== undefined && (
                                <div className="mt-1.5 h-1 rounded-full overflow-hidden w-32" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${event.progress}%`, background: et.color }} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {!ok && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${et.color}12`, color: et.color }}>{event.plan.toUpperCase()}</span>}
                            {event.booked && !event.completed && ok && (
                                <span className="text-[9px]" style={{ color: "#4A9ED4" }}>• Prenotato</span>
                            )}
                            {event.completed && <span className="text-[9px]" style={{ color: "#10B981" }}>✓ Fatto</span>}
                            {!ok && <LockClosedIcon className="w-3.5 h-3.5" style={{ color: DL.muted }} />}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── EVENT DETAIL MODAL ───────────────────────────────────────────────────────
const EventModal: React.FC<{
    event: any; userPlan: string;
    onClose: () => void;
    onToggleBook: (id: string) => void;
    onComplete: (id: string) => void;
}> = ({ event, userPlan, onClose, onToggleBook, onComplete }) => {
    const et = EVENT_TYPES[event.type];
    const ok = canAccess(userPlan, event.plan);
    const linkedLabels: Record<string, string> = {
        chat: "Apri Chat AI", courses: "Vai ai Corsi", experiences: "Vai alle Experiences",
        quests: "Vai alle Quests", council: "Vai al Consiglio", call: "Vai al Voice Coach",
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,6,15,0.88)", backdropFilter: "blur(12px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.24, ease: "easeOut" }}
                className="w-full max-w-md rounded-2xl overflow-hidden"
                style={{ background: DL.surface, border: `0.5px solid ${et.color}35` }}>
                {/* Header */}
                <div className="p-5 pb-4 relative" style={{ background: `${et.color}10` }}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${et.color}55,transparent)` }} />
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${et.color}20`, color: et.color }}>
                                {et.icon}
                            </div>
                            <div>
                                <div className="text-[9px] tracking-[0.16em] uppercase mb-0.5" style={{ color: et.color }}>{et.label}</div>
                                <div className="text-[16px] font-medium leading-tight" style={{ color: DL.white, fontFamily: "'Cormorant Garamond',serif" }}>{event.title}</div>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.05)", color: DL.muted }}>
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Body */}
                <div className="p-5">
                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                            { label: "Orario", value: event.time },
                            { label: "Durata", value: `${event.duration} min` },
                            ...(event.trainer ? [{ label: "Istruttore", value: event.trainer }] : []),
                            { label: "Piano richiesto", value: event.plan.toUpperCase() },
                        ].map((m, i) => (
                            <div key={i} className="px-3 py-2.5 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                <div className="text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: DL.muted }}>{m.label}</div>
                                <div className="text-[13px] font-medium" style={{ color: DL.white }}>{m.value}</div>
                            </div>
                        ))}
                    </div>
                    {/* Progress */}
                    {event.progress !== undefined && (
                        <div className="mb-4 px-3 py-2.5 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                            <div className="flex justify-between text-[11px] mb-2">
                                <span style={{ color: DL.muted }}>Progresso percorso</span>
                                <span style={{ color: et.color }}>{event.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                <div className="h-full rounded-full" style={{ width: `${event.progress}%`, background: et.color }} />
                            </div>
                        </div>
                    )}
                    {/* Desc */}
                    {event.desc && (
                        <p className="text-[12px] leading-relaxed mb-5" style={{ color: "rgba(240,235,224,0.65)" }}>{event.desc}</p>
                    )}
                    {/* Actions */}
                    {ok ? (
                        <div className="flex flex-col gap-2">
                            {!event.completed && (
                                <div className="flex gap-2">
                                    <button onClick={() => onToggleBook(event.id)}
                                        className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                        style={event.booked
                                            ? { background: "rgba(255,255,255,0.04)", color: DL.muted, border: `0.5px solid ${DL.glassB}` }
                                            : { background: `${et.color}18`, color: et.color, border: `0.5px solid ${et.color}35` }}>
                                        {event.booked ? "Annulla prenotazione" : "Prenota"}
                                    </button>
                                    {event.booked && (
                                        <button onClick={() => { onComplete(event.id); onClose(); }}
                                            className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                            style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "0.5px solid rgba(16,185,129,0.3)" }}>
                                            ✓ Segna completato
                                        </button>
                                    )}
                                </div>
                            )}
                            {event.completed && (
                                <div className="py-2.5 rounded-xl text-[12px] text-center"
                                    style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", border: "0.5px solid rgba(16,185,129,0.25)" }}>
                                    <CheckSolid className="w-4 h-4 inline mr-1.5 -mt-0.5" />Completato
                                </div>
                            )}
                            {event.linked && (
                                <button className="w-full py-2.5 rounded-xl text-[12px] font-medium flex items-center justify-center gap-2 transition-all"
                                    style={{ background: `${et.color}10`, color: et.color, border: `0.5px solid ${et.color}25` }}>
                                    <PlayIcon className="w-3.5 h-3.5" />
                                    {linkedLabels[event.linked] || "Apri"}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="py-4 rounded-xl text-center" style={{ background: "rgba(212,96,58,0.06)", border: "0.5px solid rgba(212,96,58,0.2)" }}>
                            <LockClosedIcon className="w-5 h-5 mx-auto mb-1.5" style={{ color: "#D4603A" }} />
                            <p className="text-[12px] font-medium" style={{ color: "#D4603A" }}>Piano {event.plan.toUpperCase()} richiesto</p>
                            <p className="text-[10px] mt-0.5" style={{ color: DL.muted }}>Aggiorna il tuo piano per accedere</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const userPlan = (user as any)?.plan ?? "vip";

    const [activeTab, setActiveTab] = useState<"calendar" | "tracking">("tracking");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [activeFilters, setActiveFilters] = useState(Object.keys(EVENT_TYPES));
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<any[]>(makeEvents);
    const [showNewEventModal, setShowNewEventModal] = useState(false);

    // ── calendar helpers ──────────────────────────────────────────────────────
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear(); const month = date.getMonth();
        const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0);
        const days: { date: Date; isCurrentMonth: boolean }[] = [];
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = 0; i < startDay; i++) days.push({ date: new Date(year, month, -startDay + i + 1), isCurrentMonth: false });
        for (let i = 1; i <= lastDay.getDate(); i++) days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        while (days.length < 42) days.push({ date: new Date(year, month + 1, days.length - startDay - lastDay.getDate() + 1), isCurrentMonth: false });
        return days;
    };

    const getEventsForDate = (date: Date) =>
        events.filter(e => activeFilters.includes(e.type) && e.date.toDateString() === date.toDateString());

    const getWeekDays = () => {
        const start = new Date(selectedDate);
        const day = start.getDay(); start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
        return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return { date: d, events: getEventsForDate(d) }; });
    };

    const navigate = (dir: number) => {
        if (viewMode === "month") { const d = new Date(currentDate); d.setMonth(d.getMonth() + dir); setCurrentDate(d); }
        else if (viewMode === "week") { const d = new Date(selectedDate); d.setDate(d.getDate() + dir * 7); setSelectedDate(d); }
        else { const d = new Date(selectedDate); d.setDate(d.getDate() + dir); setSelectedDate(d); }
    };

    const toggleBook = (id: string) => setEvents(ev => ev.map(e => e.id === id ? { ...e, booked: !e.booked } : e));
    const complete = (id: string) => setEvents(ev => ev.map(e => e.id === id ? { ...e, completed: true } : e));

    const formatTitle = () => {
        if (viewMode === "month") return currentDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
        if (viewMode === "week") {
            const w = getWeekDays(); const s = w[0].date; const end = w[6].date;
            return s.getMonth() === end.getMonth()
                ? `${s.getDate()}–${end.getDate()} ${s.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}`
                : `${s.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}`;
        }
        return selectedDate.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
    };

    // stats for mini bar
    const todayEvents = getEventsForDate(new Date());
    const completedToday = todayEvents.filter(e => e.completed).length;
    const bookedToday = todayEvents.filter(e => e.booked && !e.completed).length;
    const weekAll = getWeekDays().flatMap(d => d.events);
    const weekDone = weekAll.filter(e => e.completed).length;

    return (
        <div className="relative min-h-screen pb-24 max-w-full mx-auto overflow-hidden" style={{ background: "#06060F" }}>
            <CalendarSakuraPetals intensity="low" />
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full" style={{ background: "rgba(201,168,76,0.04)", filter: "blur(100px)" }} />
                <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full" style={{ background: "rgba(155,116,224,0.05)", filter: "blur(100px)" }} />
            </div>

            <AnimatePresence>
                {isLoading ? (
                    <CalendarLoadingScreen onComplete={() => setIsLoading(false)} />
                ) : (
                    <>
                        {/* ── STICKY HEADER ── */}
                        <div className="sticky top-0 z-20" style={{ background: "rgba(9,9,26,0.88)", borderBottom: `0.5px solid ${DL.dim}`, backdropFilter: "blur(20px)" }}>
                            <div className="px-5 py-4 max-w-7xl mx-auto">
                                {/* Title row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-[9px] tracking-[0.24em] uppercase mb-1 opacity-70" style={{ color: DL.gold }}>Metodo Jara · Percorso nel tempo</div>
                                        <h1 className="font-serif text-[28px] font-normal leading-tight mb-0.5" style={{ color: DL.white }}>
                                            My <em className="italic" style={{ color: DL.gold }}>Journey</em>
                                        </h1>
                                        <p className="text-[12px]" style={{ color: DL.muted }}>
                                            {activeTab === "calendar" ? "Organizza il tuo percorso trasformazionale" : "Segui la tua evoluzione"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {activeTab === "calendar" && (
                                            <button onClick={() => setShowNewEventModal(true)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all"
                                                style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, color: DL.gold }}>
                                                <PlusIcon className="w-4 h-4" />Evento
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Mini stats (always visible) */}
                                <div className="flex gap-2 flex-wrap mb-4">
                                    <MiniStat icon={<FireSolid className="w-3.5 h-3.5" />} label="Oggi" value={`${completedToday}/${todayEvents.length} eventi`} color={DL.guer} />
                                    <MiniStat icon={<BellIcon className="w-3.5 h-3.5" />} label="Prenotati oggi" value={`${bookedToday}`} color={DL.stra} />
                                    <MiniStat icon={<CheckSolid className="w-3.5 h-3.5" />} label="Settimana" value={`${weekDone}/${weekAll.length} completati`} color="#10B981" />
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {(["calendar", "tracking"] as const).map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)}
                                            className="px-5 py-2 rounded-xl text-[12px] font-medium transition-all border"
                                            style={activeTab === tab
                                                ? { background: DL.goldDim, borderColor: DL.goldB, color: DL.goldBr }
                                                : { background: "rgba(255,255,255,0.02)", borderColor: DL.glassB, color: DL.muted }}>
                                            {tab === "calendar" ? "📅 Calendario" : "📊 Il Mio Progresso"}
                                        </button>
                                    ))}
                                </div>

                                {/* Calendar controls */}
                                {activeTab === "calendar" && (
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        {/* View mode */}
                                        <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: `0.5px solid ${DL.glassB}` }}>
                                            {(["day", "week", "month"] as const).map(m => (
                                                <button key={m} onClick={() => setViewMode(m)}
                                                    className="px-4 py-2 text-[11px] transition-all"
                                                    style={viewMode === m
                                                        ? { background: DL.goldDim, color: DL.gold }
                                                        : { background: "transparent", color: DL.muted }}>
                                                    {m === "day" ? "Giorno" : m === "week" ? "Settimana" : "Mese"}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Nav */}
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => navigate(-1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted }}
                                                onMouseEnter={e => e.currentTarget.style.color = DL.white} onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                                                <ChevronLeftIcon className="w-4 h-4" />
                                            </button>
                                            <span className="text-[13px] font-medium min-w-[180px] text-center capitalize" style={{ color: DL.white }}>{formatTitle()}</span>
                                            <button onClick={() => navigate(1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted }}
                                                onMouseEnter={e => e.currentTarget.style.color = DL.white} onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* Filters */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(EVENT_TYPES).map(([type, cfg]) => {
                                                const on = activeFilters.includes(type);
                                                return (
                                                    <button key={type} onClick={() => setActiveFilters(f => on ? f.filter(x => x !== type) : [...f, type])}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all border"
                                                        style={on
                                                            ? { background: `${cfg.color}14`, borderColor: `${cfg.color}40`, color: cfg.color }
                                                            : { background: "rgba(255,255,255,0.02)", borderColor: DL.glassB, color: DL.muted }}>
                                                        {cfg.icon}{cfg.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── CONTENT ── */}
                        {activeTab === "tracking" ? (
                            <div className="px-4 py-8 relative z-10"><ProgressTracking /></div>
                        ) : (
                            <div className="px-5 py-8 max-w-7xl mx-auto relative z-10">

                                {/* ── WEEK VIEW ── */}
                                {viewMode === "week" && (
                                    <div className="space-y-8">
                                        {getWeekDays().map((day, i) => {
                                            const isToday = day.date.toDateString() === new Date().toDateString();
                                            return (
                                                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                                    {/* Day header */}
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                                                            style={isToday
                                                                ? { background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }
                                                                : { background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                                            <div className="text-[9px]" style={{ color: isToday ? DL.gold : DL.muted }}>
                                                                {day.date.toLocaleDateString("it-IT", { weekday: "short" }).toUpperCase()}
                                                            </div>
                                                            <div className="text-[15px] font-medium leading-tight" style={{ color: isToday ? DL.goldBr : DL.white }}>
                                                                {day.date.getDate()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-medium capitalize" style={{ color: isToday ? DL.gold : DL.white }}>
                                                                {day.date.toLocaleDateString("it-IT", { weekday: "long" })}
                                                                {isToday && <span className="ml-2 text-[11px] opacity-70">· Oggi</span>}
                                                            </div>
                                                            <div className="text-[11px]" style={{ color: DL.muted }}>
                                                                {day.events.length} {day.events.length === 1 ? "evento" : "eventi"}
                                                                {day.events.filter(e => e.completed).length > 0 && (
                                                                    <span style={{ color: "#10B981" }}> · {day.events.filter(e => e.completed).length} completati</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Events */}
                                                    {day.events.length > 0 ? (
                                                        <div className="space-y-2 pl-13 ml-13" style={{ marginLeft: "52px" }}>
                                                            {day.events.sort((a, b) => a.time.localeCompare(b.time)).map((ev, j) => (
                                                                <EventCard key={ev.id} event={ev} userPlan={userPlan}
                                                                    onSelect={setSelectedEvent} delay={i * 0.05 + j * 0.03} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="ml-13 text-center py-8 rounded-xl" style={{ marginLeft: "52px", background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                                            <CalendarDaysIcon className="w-8 h-8 mx-auto mb-2" style={{ color: DL.muted, opacity: 0.4 }} />
                                                            <p className="text-[12px]" style={{ color: DL.muted }}>Nessun evento · Giornata libera ✨</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* ── MONTH VIEW ── */}
                                {viewMode === "month" && (
                                    <div className="rounded-2xl overflow-hidden" style={{ background: DL.surface, border: `0.5px solid ${DL.glassB}` }}>
                                        {/* Header giorni */}
                                        <div className="grid grid-cols-7" style={{ borderBottom: `0.5px solid ${DL.dim}`, background: "rgba(201,168,76,0.04)" }}>
                                            {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => (
                                                <div key={d} className="py-3 text-center text-[10px] tracking-[0.12em] uppercase" style={{ color: DL.muted }}>{d}</div>
                                            ))}
                                        </div>
                                        {/* Grid */}
                                        <div className="grid grid-cols-7">
                                            {getDaysInMonth(currentDate).map((day, i) => {
                                                const dayEvs = getEventsForDate(day.date);
                                                const isSel = day.date.toDateString() === selectedDate.toDateString();
                                                const isToday = day.date.toDateString() === new Date().toDateString();
                                                return (
                                                    <motion.div key={i} whileHover={{ scale: 1.02, zIndex: 10 }} whileTap={{ scale: 0.98 }}
                                                        onClick={() => { setSelectedDate(day.date); setViewMode("day"); }}
                                                        className="min-h-[90px] p-2 cursor-pointer transition-all"
                                                        style={{
                                                            borderBottom: `0.5px solid ${DL.dim}`, borderRight: `0.5px solid ${DL.dim}`,
                                                            background: isSel ? DL.goldDim : isToday ? "rgba(201,168,76,0.04)" : day.isCurrentMonth ? "transparent" : "rgba(255,255,255,0.01)",
                                                            opacity: day.isCurrentMonth ? 1 : 0.4,
                                                        }}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full`}
                                                                style={isToday ? { background: DL.gold, color: "#06060F" } : { color: isSel ? DL.goldBr : DL.white }}>
                                                                {day.date.getDate()}
                                                            </div>
                                                            {dayEvs.length > 0 && (
                                                                <div className="flex gap-0.5">
                                                                    {[...new Set(dayEvs.slice(0, 3).map(e => e.type))].map(t => (
                                                                        <div key={t} className="w-1.5 h-1.5 rounded-full" style={{ background: EVENT_TYPES[t].color }} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {dayEvs.slice(0, 2).map(ev => (
                                                                <div key={ev.id} className="text-[9px] px-1.5 py-0.5 rounded truncate"
                                                                    style={{ background: `${EVENT_TYPES[ev.type].color}20`, color: EVENT_TYPES[ev.type].color }}>
                                                                    {ev.time} {ev.title}
                                                                </div>
                                                            ))}
                                                            {dayEvs.length > 2 && (
                                                                <div className="text-[9px] pl-1" style={{ color: DL.muted }}>+{dayEvs.length - 2}</div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* ── DAY VIEW ── */}
                                {viewMode === "day" && (
                                    <div>
                                        {/* Timeline header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="font-serif text-[22px] font-normal capitalize" style={{ color: selectedDate.toDateString() === new Date().toDateString() ? DL.gold : DL.white }}>
                                                    {selectedDate.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                                                    {selectedDate.toDateString() === new Date().toDateString() && <span className="ml-2 text-[14px] opacity-70">· Oggi</span>}
                                                </div>
                                                <div className="text-[12px]" style={{ color: DL.muted }}>
                                                    {getEventsForDate(selectedDate).length} eventi in programma
                                                </div>
                                            </div>
                                        </div>
                                        {getEventsForDate(selectedDate).length > 0 ? (
                                            <div className="relative">
                                                {/* Timeline line */}
                                                <div className="absolute left-[58px] top-0 bottom-0 w-px" style={{ background: `${DL.goldB}` }} />
                                                <div className="space-y-4">
                                                    {getEventsForDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time)).map((ev, i) => (
                                                        <motion.div key={ev.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                                            className="flex items-start gap-4">
                                                            {/* Time label */}
                                                            <div className="w-14 flex-shrink-0 text-right pt-3">
                                                                <span className="text-[11px]" style={{ color: DL.muted }}>{ev.time}</span>
                                                            </div>
                                                            {/* Dot */}
                                                            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-3.5 relative z-10"
                                                                style={{ background: EVENT_TYPES[ev.type].color, border: `2px solid #06060F`, boxShadow: `0 0 8px ${EVENT_TYPES[ev.type].color}50` }} />
                                                            {/* Card */}
                                                            <div className="flex-1">
                                                                <EventCard event={ev} userPlan={userPlan} onSelect={setSelectedEvent} />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                                <CalendarDaysIcon className="w-10 h-10 mx-auto mb-3" style={{ color: DL.muted, opacity: 0.4 }} />
                                                <p className="text-[14px] mb-1" style={{ color: DL.white }}>Giornata libera</p>
                                                <p className="text-[12px]" style={{ color: DL.muted }}>Nessun evento programmato · Goditi il riposo ✨</p>
                                                <button onClick={() => setShowNewEventModal(true)}
                                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] transition-all"
                                                    style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, color: DL.gold }}>
                                                    <PlusIcon className="w-4 h-4" />Aggiungi evento
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── MODALS ── */}
                        <AnimatePresence>
                            {showNewEventModal && (
                                <NewEventModal onClose={() => setShowNewEventModal(false)}
                                    onSave={(data: any) => {
                                        setEvents(ev => [...ev, { id: `custom-${Date.now()}`, ...data, plan: userPlan, completed: false, booked: true }]);
                                        setShowNewEventModal(false);
                                    }} />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {selectedEvent && (
                                <EventModal event={selectedEvent} userPlan={userPlan}
                                    onClose={() => setSelectedEvent(null)}
                                    onToggleBook={(id) => { toggleBook(id); setSelectedEvent((e: any) => ({ ...e, booked: !e.booked })); }}
                                    onComplete={(id) => { complete(id); setSelectedEvent(null); }} />
                            )}
                        </AnimatePresence>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalendarPage;