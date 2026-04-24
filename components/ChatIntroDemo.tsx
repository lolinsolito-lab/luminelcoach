
import React from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, SparklesIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ChatIntroDemoProps {
  onComplete: () => void;
}

const ChatIntroDemo: React.FC<ChatIntroDemoProps> = ({ onComplete }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FDFBF7] via-[#FFF5EB] to-[#FDFBF7] rounded-[2.5rem] border border-white/50 shadow-sm relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-luminel-champagne/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-luminel-gold-soft/10 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-24 h-24 bg-gradient-to-br from-luminel-gold-soft to-luminel-champagne rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-luminel-gold-soft/20 relative z-10"
      >
        <SparklesIcon className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4 relative z-10"
      >
        Chatta con <span className="text-transparent bg-clip-text bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark">Luminel</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-600 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed relative z-10"
      >
        Il tuo coach trasformazionale personale. Uno spazio sacro per esplorare i tuoi pensieri,
        ricevere guida empatica e illuminare il tuo percorso di crescita.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16 relative z-10">
        {[
          {
            icon: <ClockIcon className="w-6 h-6 text-luminel-gold-dark" />,
            title: "Sempre Presente",
            desc: "Una guida disponibile 24/7 per ogni momento di bisogno."
          },
          {
            icon: <SparklesIcon className="w-6 h-6 text-luminel-gold-dark" />,
            title: "Intelligenza Empatica",
            desc: "Risposte profonde che risuonano con la tua anima."
          },
          {
            icon: <ShieldCheckIcon className="w-6 h-6 text-luminel-gold-dark" />,
            title: "Spazio Sicuro",
            desc: "Privacy totale per esprimerti in completa libertà."
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFF5EB] to-white rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <h3 className="font-serif font-bold text-slate-800 mb-2 text-lg">{item.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="px-10 py-5 bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white rounded-2xl font-bold text-lg shadow-xl shadow-luminel-gold-soft/30 hover:shadow-2xl hover:shadow-luminel-gold-soft/40 transition-all relative z-10 flex items-center gap-2"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        Inizia il Viaggio
      </motion.button>
    </div>
  );
};

export default ChatIntroDemo;
