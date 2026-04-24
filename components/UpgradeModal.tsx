import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'premium' | 'vip';
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, planType }) => {
  if (!isOpen) return null;

  const isVip = planType === 'vip';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header with Gradient */}
            <div className={`relative px-6 py-8 text-center text-white ${
              isVip 
                ? 'bg-gradient-to-br from-red-500 via-rose-500 to-purple-600' 
                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
            }`}>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>

              <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4 backdrop-blur-md border border-white/30 shadow-lg">
                {isVip ? <SparklesIcon className="w-8 h-8 text-yellow-300" /> : <StarIcon className="w-8 h-8 text-yellow-300" />}
              </div>
              
              <h2 className="text-3xl font-bold mb-2">
                Diventa {isVip ? 'VIP' : 'Premium'}
              </h2>
              <p className="text-white/90 text-sm font-medium">
                Sblocca il tuo pieno potenziale e accelera la tua crescita.
              </p>
            </div>

            {/* Pricing Body */}
            <div className="p-8">
              <div className="flex items-end justify-center gap-1 mb-8">
                <span className="text-4xl font-bold text-slate-800">
                  {isVip ? '€19.99' : '€9.99'}
                </span>
                <span className="text-slate-500 mb-1">/mese</span>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Accesso illimitato a tutti i corsi',
                  'Certificati di completamento',
                  isVip ? 'Coaching 1-on-1 mensile' : 'Sessioni live settimanali',
                  'Download materiali offline',
                  'Nessuna pubblicità'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      isVip ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      <CheckIcon className="w-3 h-3" />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-transform active:scale-95 ${
                 isVip 
                 ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-rose-200' 
                 : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-200'
              }`}>
                Inizia la Prova Gratuita
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                7 giorni gratis, poi {isVip ? '€19.99' : '€9.99'}/mese. Cancella quando vuoi.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;