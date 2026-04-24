import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MicrophoneIcon,
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  CalendarIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import AICallModal from './AICallModal';
import UpgradeModal from './UpgradeModal';

const CallPage: React.FC = () => {
  const { user } = useAuth();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleStartDemo = () => {
    if (user?.plan === 'free') {
      // Allow one demo or block? Let's allow demo but warn
      setIsCallModalOpen(true);
    } else {
      setIsCallModalOpen(true);
    }
  };

  const testimonials = [
    { name: "Elena R.", role: "Imprenditrice", text: "Parlare con Luminel è come avere un coach saggio sempre in tasca. Mi ha calmato prima di un pitch importante.", rating: 5 },
    { name: "Marco B.", role: "Studente", text: "Incredibile quanto la voce sia naturale. Mi aiuta a riflettere ad alta voce senza giudizio.", rating: 5 },
    { name: "Sofia L.", role: "Designer", text: "Le sessioni vocali sono diventate il mio rituale serale per decomprimere.", rating: 5 },
  ];

  const features = [
    { icon: <MicrophoneIcon className="w-6 h-6" />, title: "Voce Naturale", desc: "Tecnologia TTS avanzata per un'esperienza umana." },
    { icon: <SparklesIcon className="w-6 h-6" />, title: "AI Empatica", desc: "Comprende le sfumature emotive della tua voce." },
    { icon: <CalendarIcon className="w-6 h-6" />, title: "Disponibile 24/7", desc: "Nessun appuntamento necessario. Luminel è sempre lì." },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Modals */}
      {isCallModalOpen && <AICallModal onClose={() => setIsCallModalOpen(false)} />}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} planType="vip" />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-luminel-gold-soft to-luminel-taupe text-luminel-smoke p-8 md:p-16 text-center mb-16 shadow-2xl shadow-luminel-gold-soft/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-luminel-champagne rounded-full blur-3xl opacity-40 -ml-20 -mb-20"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold mb-6 uppercase tracking-wider">
            Nuova Funzionalità
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Il tuo Coach Vocale <br />
            <span className="text-white/90">Personale & Intelligente</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Supera i limiti del testo. Parla liberamente con Luminel, esplora i tuoi pensieri ad alta voce e ricevi guida immediata con una voce calda ed empatica.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartDemo}
              className="px-8 py-4 bg-white text-luminel-smoke rounded-xl font-bold text-lg hover:bg-luminel-champagne transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <PlayIcon className="w-6 h-6" /> Prova la Demo Vocale
            </button>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-8 py-4 bg-white/30 border border-luminel-gold-soft/50 text-luminel-smoke rounded-xl font-bold text-lg hover:bg-white/50 transition-colors backdrop-blur-sm"
            >
              Sblocca Accesso VIP
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-luminel-champagne p-8 rounded-3xl shadow-sm border border-luminel-taupe/20 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-luminel-gold-soft/20 rounded-2xl flex items-center justify-center text-luminel-gold-soft mb-4">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-luminel-smoke mb-2">{feat.title}</h3>
              <p className="text-slate-500">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-16 border border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Scegli il tuo livello</h2>
          <p className="text-slate-500">La chiamata vocale è un'esperienza esclusiva.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm opacity-70">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Free / Premium</h3>
            <div className="text-3xl font-bold text-slate-400 mb-6">Limitato</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-slate-500">
                <CheckCircleIcon className="w-5 h-5 text-green-500" /> 1 Demo al mese
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <CheckCircleIcon className="w-5 h-5 text-green-500" /> Qualità Standard
              </li>
            </ul>
            <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
              Incluso nel piano
            </button>
          </div>

          {/* VIP Card */}
          <div className="bg-white p-8 rounded-3xl border-2 border-luminel-gold-soft shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-luminel-gold-soft text-luminel-smoke text-xs font-bold px-3 py-1 rounded-bl-xl">CONSIGLIATO</div>
            <h3 className="text-xl font-bold text-luminel-gold-soft mb-2">VIP Pass</h3>
            <div className="text-3xl font-bold text-luminel-smoke mb-6">Illimitato</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-luminel-smoke">
                <CheckCircleIcon className="w-5 h-5 text-luminel-gold-soft" /> Chiamate Illimitate
              </li>
              <li className="flex items-center gap-3 text-luminel-smoke">
                <CheckCircleIcon className="w-5 h-5 text-luminel-gold-soft" /> Voce HD Ultra-Realistica
              </li>
              <li className="flex items-center gap-3 text-luminel-smoke">
                <CheckCircleIcon className="w-5 h-5 text-luminel-gold-soft" /> Analisi Emotiva Post-Call
              </li>
            </ul>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-3 bg-luminel-gold-soft text-luminel-smoke rounded-xl font-bold hover:bg-luminel-taupe transition-colors shadow-lg shadow-luminel-gold-soft/30"
            >
              Diventa VIP
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">Cosa dicono i nostri utenti</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(t.rating)].map((_, j) => <StarIcon key={j} className="w-4 h-4" />)}
              </div>
              <p className="text-slate-600 italic mb-4 text-sm">"{t.text}"</p>
              <div>
                <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CallPage;
