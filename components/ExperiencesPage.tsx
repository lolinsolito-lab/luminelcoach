import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  MoonIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import CalmView from './experiences/CalmView';
import MeditationView from './experiences/MeditationView';

type ViewMode = 'selection' | 'calm' | 'meditation';

const ExperiencesPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('selection');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  if (view === 'selection') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Scegli la tua Esperienza
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Che tipo di esperienza stai cercando oggi?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Calm Space Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('calm')}
            className="group relative h-80 rounded-3xl overflow-hidden shadow-xl text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-600 opacity-90 transition-opacity group-hover:opacity-100" />
            <img
              src="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?w=800&q=80"
              alt="Calm"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                <SparklesIcon className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Calm Space</h2>
                <p className="text-teal-50 font-medium">
                  Rilassamento basato sul tuo umore. Trova equilibrio e serenità istantanea.
                </p>
              </div>

              <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
                Entra nello spazio <ArrowLeftIcon className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </motion.button>

          {/* Meditation Studio Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('meditation')}
            className="group relative h-80 rounded-3xl overflow-hidden shadow-xl text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-luminel-gold-soft to-luminel-taupe opacity-90 transition-opacity group-hover:opacity-100" />
            <img
              src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=800&q=80"
              alt="Meditation"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-white">
                <MoonIcon className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Meditation Studio</h2>
                <p className="text-luminel-champagne font-medium">
                  Libreria completa di meditazioni guidate, timer e percorsi strutturati.
                </p>
              </div>

              <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
                Inizia a meditare <ArrowLeftIcon className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={view}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button
          onClick={() => setView('selection')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Torna alla scelta
        </button>

        {view === 'calm' ? <CalmView /> : <MeditationView />}
      </motion.div>
    </AnimatePresence>
  );
};

export default ExperiencesPage;