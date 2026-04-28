import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, MoonIcon, ArrowLeftIcon, ArrowRightIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import CalmView from "./experiences/CalmView";
import MeditationView from "./experiences/MeditationView";

type ViewMode = "selection" | "calm" | "meditation";

const ExperiencesPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>("selection");

  if (view === "selection") {
    return (
      <div className="min-h-[80vh] flex flex-col pb-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: "#C9A84C" }}>
            Luminel · Spazi Immersivi
          </p>
          <h1 className="font-serif text-[38px] font-normal leading-tight mb-2" style={{ color: "#F0EBE0" }}>
            Scegli la tua <em className="italic" style={{ color: "#C9A84C" }}>Esperienza</em>
          </h1>
          <p className="text-[13px]" style={{ color: "#6A6560" }}>Che tipo di esperienza stai cercando oggi?</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* CALM SPACE */}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => setView("calm")}
            className="group relative h-72 rounded-2xl overflow-hidden text-left cursor-pointer"
            style={{ border: "0.5px solid rgba(74,158,212,0.3)" }}>
            {/* bg image */}
            <img src="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?w=800&q=80"
              alt="Calm" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,6,15,0.7) 0%, rgba(74,158,212,0.3) 100%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(74,158,212,0.6),transparent)" }} />

            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(74,158,212,0.2)", border: "0.5px solid rgba(74,158,212,0.4)" }}>
                <SparklesIcon className="w-5 h-5" style={{ color: "#4A9ED4" }} />
              </div>
              <div>
                <div className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(74,158,212,0.8)" }}>Rilassamento guidato</div>
                <h2 className="font-serif text-[26px] font-normal mb-2" style={{ color: "#F0EBE0" }}>Calm Space</h2>
                <p className="text-[12px] leading-relaxed mb-4" style={{ color: "rgba(240,235,224,0.6)" }}>
                  Rilassamento basato sul tuo umore. Percorsi sonori, meditazioni guidate e pratiche di pace istantanea.
                </p>
                <div className="flex items-center gap-2 text-[12px] font-medium transition-all group-hover:gap-3" style={{ color: "#4A9ED4" }}>
                  Entra nello spazio <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </motion.button>

          {/* MEDITATION STUDIO */}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => setView("meditation")}
            className="group relative h-72 rounded-2xl overflow-hidden text-left cursor-pointer"
            style={{ border: "0.5px solid rgba(201,168,76,0.3)" }}>
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
              alt="Meditation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(6,6,15,0.7) 0%, rgba(201,168,76,0.25) 100%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)" }} />

            <div className="relative z-10 p-7 h-full flex flex-col justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.15)", border: "0.5px solid rgba(201,168,76,0.4)" }}>
                <MoonIcon className="w-5 h-5" style={{ color: "#C9A84C" }} />
              </div>
              <div>
                <div className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(201,168,76,0.8)" }}>Libreria completa</div>
                <h2 className="font-serif text-[26px] font-normal mb-2" style={{ color: "#F0EBE0" }}>Meditation Studio</h2>
                <p className="text-[12px] leading-relaxed mb-4" style={{ color: "rgba(240,235,224,0.6)" }}>
                  Meditazioni guidate, timer personalizzabile e percorsi strutturati per ogni livello e obiettivo.
                </p>
                <div className="flex items-center gap-2 text-[12px] font-medium transition-all group-hover:gap-3" style={{ color: "#C9A84C" }}>
                  Inizia a meditare <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Coming soon */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 rounded-xl p-5 flex items-center gap-4"
          style={{ background: "rgba(155,116,224,0.06)", border: "0.5px solid rgba(155,116,224,0.18)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(155,116,224,0.12)", border: "0.5px solid rgba(155,116,224,0.25)" }}>
            <MusicalNoteIcon className="w-5 h-5" style={{ color: "#9B74E0" }} />
          </div>
          <div>
            <div className="text-[12px] font-medium mb-0.5" style={{ color: "#F0EBE0" }}>Audio Binaural — in arrivo</div>
            <div className="text-[11px]" style={{ color: "#6A6560" }}>Frequenze Theta e Gamma generate in tempo reale durante le sessioni · disponibile con piano VIP</div>
          </div>
          <span className="flex-shrink-0 text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: "rgba(155,116,224,0.12)", color: "#9B74E0", border: "0.5px solid rgba(155,116,224,0.3)" }}>Presto</span>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <button onClick={() => setView("selection")}
          className="mb-6 flex items-center gap-2 text-[12px] transition-all"
          style={{ color: "#6A6560" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#F0EBE0")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6A6560")}>
          <ArrowLeftIcon className="w-4 h-4" />
          Torna alla scelta
        </button>
        {view === "calm" ? <CalmView /> : <MeditationView />}
      </motion.div>
    </AnimatePresence>
  );
};

export default ExperiencesPage;