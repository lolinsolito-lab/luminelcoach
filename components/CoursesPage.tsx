import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon, MagnifyingGlassIcon, LockClosedIcon,
  StarIcon, UserGroupIcon, ClockIcon, SparklesIcon,
  PlayIcon, ArrowRightIcon, FunnelIcon, XMarkIcon,
  CheckCircleIcon, FireIcon, BoltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid, FireIcon as FireSolid } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCourses } from "../hooks/useCourses";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Plan = "free" | "premium" | "vip";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  instructorBio?: string;
  plan: Plan;
  level: string;
  duration: string;
  category: string;
  rating: number;
  users: number;
  image?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  lessonsCount?: number;
  language?: string;
}

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────
const PLAN_CONFIG: Record<Plan, { label: string; color: string; border: string; bg: string; dot: string }> = {
  free: { label: "FREE", color: "#4A9ED4", border: "rgba(74,158,212,0.3)", bg: "rgba(74,158,212,0.08)", dot: "#4A9ED4" },
  premium: { label: "PREMIUM", color: "#C9A84C", border: "rgba(201,168,76,0.3)", bg: "rgba(201,168,76,0.08)", dot: "#C9A84C" },
  vip: { label: "VIP", color: "#9B74E0", border: "rgba(155,116,224,0.3)", bg: "rgba(155,116,224,0.08)", dot: "#9B74E0" },
};

const SECTION_CONFIG: Record<Plan, { icon: string; title: string; sub: string; accent: string }> = {
  free: { icon: "✦", title: "Corsi Gratuiti", sub: "Disponibili per tutti · Nessuna carta di credito", accent: "#4A9ED4" },
  premium: { icon: "⭐", title: "Corsi Premium", sub: "Sblocca con il piano Premium · €49/mese", accent: "#C9A84C" },
  vip: { icon: "♛", title: "Corsi VIP", sub: "Esclusivi per i membri Sovereign · €199/mese", accent: "#9B74E0" },
};

const CATEGORIES = ["all", "Mindfulness", "Health", "Leadership", "Relationships", "Personal Growth", "Ikigai"];
const LEVELS = ["all", "Beginner", "Intermediate", "Advanced"];

// ─── COURSE CARD ──────────────────────────────────────────────────────────────
function CourseCard({ course, idx, isUnlocked, onNavigate }: {
  course: Course; idx: number; isUnlocked: boolean; onNavigate: (id: string, plan: string) => void;
}) {
  const pc = PLAN_CONFIG[course.plan];
  const levelStyle: Record<string, string> = {
    Beginner: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
    Intermediate: "text-sky-400 border-sky-500/25 bg-sky-500/10",
    Advanced: "text-violet-400 border-violet-500/25 bg-violet-500/10",
    Principiante: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
    Intermedio: "text-sky-400 border-sky-500/25 bg-sky-500/10",
    Avanzato: "text-violet-400 border-violet-500/25 bg-violet-500/10",
  };
  const levelCls = levelStyle[course.level] ?? "text-[#6A6560] border-white/10 bg-white/5";

  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.28, ease: "easeOut" }}
      onClick={() => onNavigate(course.id, course.plan)}
      className="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: `0.5px solid rgba(255,255,255,0.07)`,
        opacity: isUnlocked ? 1 : 0.65,
      }}
      whileHover={isUnlocked ? { y: -3, borderColor: `${pc.color}40`, background: pc.bg } : { scale: 0.99 }}
    >
      {/* Hover accent */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${pc.color}60, transparent)` }} />

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0"
        style={{ background: course.color ?? `linear-gradient(135deg, ${pc.bg}, rgba(0,0,0,0.2))` }}>
        {course.image ? (
          <img src={course.image} alt={course.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30"
            style={{ color: pc.color }}>
            {course.icon ?? "📚"}
          </div>
        )}
        <div className={`absolute inset-0 transition-all duration-300 ${isUnlocked ? "bg-black/25 group-hover:bg-black/15" : "bg-black/65 backdrop-blur-[2px]"}`} />

        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <LockClosedIcon className="w-10 h-10 mb-2" style={{ color: "rgba(255,255,255,0.7)" }} />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Piano {pc.label}
            </span>
          </div>
        )}

        {isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.5)", border: "0.5px solid rgba(255,255,255,0.2)" }}>
              <PlayIcon className="w-5 h-5 ml-0.5" style={{ color: "#F0EBE0" }} />
            </div>
          </div>
        )}

        {/* Plan badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] tracking-[0.14em] uppercase font-medium"
          style={{ background: "rgba(0,0,0,0.5)", color: pc.color, border: `0.5px solid ${pc.color}50`, backdropFilter: "blur(8px)" }}>
          {pc.label}
        </div>

        {/* Lessons count */}
        {course.lessonsCount && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(0,0,0,0.5)", color: "rgba(240,235,224,0.8)", backdropFilter: "blur(6px)" }}>
            {course.lessonsCount} lezioni
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded border ${levelCls}`}>
            {course.level}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6A6560" }}>
            <ClockIcon className="w-3 h-3" />{course.duration}
          </span>
          {course.language && (
            <span className="text-[10px]" style={{ color: "#6A6560" }}>{course.language}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-medium mb-2 leading-snug transition-colors duration-200"
          style={{ color: "#F0EBE0", fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 400 }}>
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-[11px] leading-relaxed mb-3 line-clamp-2 flex-1" style={{ color: "#6A6560" }}>
          {course.description}
        </p>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {course.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: `${pc.color}10`, color: pc.color, border: `0.5px solid ${pc.color}20` }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
            style={{ background: `${pc.color}20`, color: pc.color, border: `0.5px solid ${pc.color}30` }}>
            {course.instructorAvatar}
          </div>
          <span className="text-[11px]" style={{ color: "#6A6560" }}>{course.instructor}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: "#6A6560" }}>
            <div className="flex items-center gap-1">
              <StarSolid className="w-3.5 h-3.5" style={{ color: pc.color }} />
              <span className="font-medium" style={{ color: pc.color }}>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-3.5 h-3.5" />
              <span>{course.users.toLocaleString()}</span>
            </div>
          </div>

          {isUnlocked ? (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
              style={{ background: `${pc.color}14`, color: pc.color, border: `0.5px solid ${pc.color}35` }}>
              Inizia <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button onClick={e => { e.stopPropagation(); onNavigate(course.id, course.plan); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#6A6560", border: "0.5px solid rgba(255,255,255,0.08)" }}>
              <LockClosedIcon className="w-3 h-3" />Sblocca
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ plan, count }: { plan: Plan; count: number }) {
  const cfg = SECTION_CONFIG[plan];
  const pc = PLAN_CONFIG[plan];
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: pc.bg, border: `0.5px solid ${pc.border}` }}>
          {cfg.icon}
        </div>
        <div>
          <h2 className="text-[18px] font-normal" style={{ color: "#F0EBE0", fontFamily: "'Cormorant Garamond', serif" }}>
            {cfg.title}
          </h2>
          <p className="text-[11px]" style={{ color: "#6A6560" }}>{cfg.sub}</p>
        </div>
      </div>
      <span className="text-[12px] px-2.5 py-1 rounded-lg"
        style={{ background: pc.bg, color: pc.color, border: `0.5px solid ${pc.border}` }}>
        {count} {count === 1 ? "corso" : "corsi"}
      </span>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const {
    filteredCourses, freeCourses, premiumCourses, vipCourses,
    isLoading, isCourseUnlocked, unlockCourse,
  } = useCourses({
    userPlan: user?.plan ?? "free",
    activeCategory,
    selectedLevel,
    searchQuery,
  });

  const handleCourseClick = (courseId: string, coursePlan: string) => {
    if (isCourseUnlocked(courseId)) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate("/plans");
    }
  };

  const hasActiveFilters = activeCategory !== "all" || selectedLevel !== "all" || searchQuery.length > 0;
  const clearFilters = () => { setActiveCategory("all"); setSelectedLevel("all"); setSearchQuery(""); };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: `rgba(201,168,76,0.3)`, borderTopColor: "#C9A84C" }} />
          <p className="text-[13px]" style={{ color: "#6A6560" }}>Caricamento corsi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24 px-0">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "rgba(201,168,76,0.03)", filter: "blur(120px)" }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full"
          style={{ background: "rgba(155,116,224,0.04)", filter: "blur(100px)" }} />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: "#C9A84C" }}>
          Metodo Jara · Biblioteca dei percorsi
        </p>
        <h1 className="font-serif font-normal leading-tight mb-2" style={{ fontSize: "clamp(28px,5vw,40px)", color: "#F0EBE0" }}>
          Course <em className="italic" style={{ color: "#C9A84C" }}>Library</em>
        </h1>
        <p className="text-[13px] leading-relaxed" style={{ color: "#6A6560" }}>
          Esplora la collezione completa di percorsi trasformativi creati da Michael Jara
        </p>
      </motion.div>

      {/* Search & Filter bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-2 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6A6560" }} />
          <input type="text" placeholder="Cerca corsi, argomenti, istruttori..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", color: "#F0EBE0" }}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.35)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <XMarkIcon className="w-4 h-4" style={{ color: "#6A6560" }} />
            </button>
          )}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] transition-all"
          style={{
            background: showFilters ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
            border: `0.5px solid ${showFilters ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
            color: showFilters ? "#C9A84C" : "#6A6560",
          }}>
          <FunnelIcon className="w-4 h-4" />Filtri
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
          )}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="px-4 py-2.5 rounded-xl text-[12px] transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", color: "#6A6560" }}>
            Resetta
          </button>
        )}
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6">
            <div className="p-4 rounded-xl mb-1" style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
              <div className="mb-4">
                <div className="text-[9px] tracking-[0.18em] uppercase mb-2.5" style={{ color: "#6A6560" }}>Categoria</div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setActiveCategory(c)}
                      className="px-3 py-1.5 rounded-lg text-[12px] transition-all border"
                      style={activeCategory === c
                        ? { background: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.35)", color: "#EDD980" }
                        : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", color: "#6A6560" }}>
                      {c === "all" ? "Tutte" : c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.18em] uppercase mb-2.5" style={{ color: "#6A6560" }}>Livello</div>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map(l => (
                    <button key={l} onClick={() => setSelectedLevel(l)}
                      className="px-3 py-1.5 rounded-lg text-[12px] transition-all border"
                      style={selectedLevel === l
                        ? { background: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.35)", color: "#EDD980" }
                        : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", color: "#6A6560" }}>
                      {l === "all" ? "Tutti" : l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category pills (quick access quando filtri chiusi) */}
      {!showFilters && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c, i) => (
            <motion.button key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => setActiveCategory(c)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-[12px] tracking-wide border transition-all"
              style={activeCategory === c
                ? { background: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.35)", color: "#EDD980" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", color: "#6A6560" }}>
              {c === "all" ? "Tutti" : c}
            </motion.button>
          ))}
        </div>
      )}

      {/* No results */}
      {filteredCourses.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20 flex flex-col items-center">
          <AcademicCapIcon className="w-12 h-12 mb-4" style={{ color: "#6A6560", opacity: 0.4 }} />
          <p className="text-[14px] mb-2" style={{ color: "#F0EBE0" }}>Nessun corso trovato</p>
          <p className="text-[12px] mb-5" style={{ color: "#6A6560" }}>Prova a modificare i filtri o la ricerca</p>
          <button onClick={clearFilters} className="px-5 py-2.5 rounded-lg text-[12px] transition-all"
            style={{ background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}>
            Mostra tutti i corsi
          </button>
        </motion.div>
      )}

      {/* FREE COURSES */}
      {freeCourses.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-14">
          <SectionHeader plan="free" count={freeCourses.length} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} idx={idx}
                isUnlocked={isCourseUnlocked(course.id)} onNavigate={handleCourseClick} />
            ))}
          </div>
        </motion.section>
      )}

      {/* PREMIUM COURSES */}
      {premiumCourses.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-14">
          <SectionHeader plan="premium" count={premiumCourses.length} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} idx={idx}
                isUnlocked={isCourseUnlocked(course.id)} onNavigate={handleCourseClick} />
            ))}
          </div>
          {/* Upgrade nudge se non ha premium */}
          {user?.plan === "free" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-5 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ background: "rgba(201,168,76,0.05)", border: "0.5px solid rgba(201,168,76,0.2)" }}>
              <div>
                <div className="text-[13px] font-medium mb-1" style={{ color: "#F0EBE0" }}>
                  Sblocca tutti i corsi Premium
                </div>
                <div className="text-[12px]" style={{ color: "#6A6560" }}>
                  Chat AI illimitata, Reality Quest AI ogni giorno, audio binaural · a partire da €49/mese
                </div>
              </div>
              <button onClick={() => navigate("/plans")}
                className="flex-shrink-0 px-5 py-2.5 rounded-lg text-[12px] font-medium whitespace-nowrap"
                style={{ background: "#C9A84C", color: "#06060F" }}>
                Vai ai piani →
              </button>
            </motion.div>
          )}
        </motion.section>
      )}

      {/* VIP COURSES */}
      {vipCourses.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-14">
          <SectionHeader plan="vip" count={vipCourses.length} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vipCourses.map((course, idx) => (
              <CourseCard key={course.id} course={course} idx={idx}
                isUnlocked={isCourseUnlocked(course.id)} onNavigate={handleCourseClick} />
            ))}
          </div>
          {/* Upgrade nudge se non ha VIP */}
          {(user?.plan === "free" || user?.plan === "premium") && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="mt-5 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ background: "rgba(155,116,224,0.05)", border: "0.5px solid rgba(155,116,224,0.2)" }}>
              <div>
                <div className="text-[13px] font-medium mb-1" style={{ color: "#F0EBE0" }}>
                  Sblocca i corsi VIP Sovereign
                </div>
                <div className="text-[12px]" style={{ color: "#6A6560" }}>
                  Include Il Consiglio degli Archetipi, Voice Coach HD, sessione mensile con Michael Jara · €199/mese
                </div>
              </div>
              <button onClick={() => navigate("/plans")}
                className="flex-shrink-0 px-5 py-2.5 rounded-lg text-[12px] font-medium whitespace-nowrap"
                style={{ background: "#9B74E0", color: "#FFFFFF" }}>
                Diventa Sovereign →
              </button>
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Stats footer */}
      {filteredCourses.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="pt-8 flex items-center justify-center gap-8 flex-wrap"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
          {[
            { val: `${filteredCourses.length}`, label: "corsi disponibili" },
            { val: "7", label: "lingue supportate" },
            { val: "4.8", label: "rating medio" },
            { val: "5.000+", label: "studenti attivi" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[20px] font-medium" style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
              <div className="text-[11px]" style={{ color: "#6A6560" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CoursesPage;