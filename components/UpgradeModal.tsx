import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'premium' | 'vip';
}

const DL = {
  gold: '#C9A84C',
  goldBr: '#EDD980',
  goldDim: 'rgba(201,168,76,0.10)',
  goldB: 'rgba(201,168,76,0.25)',
  alch: '#9B74E0',
  white: '#F0EBE0',
  muted: '#6A6560',
  bg: '#0B0A12',
  glass: 'rgba(255,255,255,0.03)',
  glassB: 'rgba(255,255,255,0.07)',
};

const planData = {
  premium: {
    label: 'Premium',
    sublabel: 'Illuminated',
    price: '€29',
    period: '/mese',
    annualNote: 'oppure €290/anno (risparmi 2 mesi)',
    color: DL.gold,
    colorDim: DL.goldDim,
    colorB: DL.goldB,
    icon: <StarIcon className="w-7 h-7" style={{ color: DL.gold }} />,
    gradient: 'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))',
    border: 'rgba(201,168,76,0.35)',
    topLine: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)',
    features: [
      'Accesso completo a tutti i corsi',
      'Sessioni live settimanali',
      'Certificati di completamento',
      '1 Demo Voice Coach al mese',
      'Comunità privata Luminel',
      'Report mensile del percorso',
    ],
    cta: 'Passa a Premium →',
    note: '7 giorni di prova gratuita · Cancella quando vuoi',
  },
  vip: {
    label: 'VIP Sovereign',
    sublabel: 'Il massimo del percorso Luminel',
    price: '€99',
    period: '/mese',
    annualNote: 'oppure €990/anno (risparmi 2 mesi)',
    color: '#9B74E0',
    colorDim: 'rgba(155,116,224,0.10)',
    colorB: 'rgba(155,116,224,0.30)',
    icon: <SparklesIcon className="w-7 h-7" style={{ color: '#9B74E0' }} />,
    gradient: 'linear-gradient(135deg,rgba(155,116,224,0.12),rgba(201,168,76,0.06))',
    border: 'rgba(155,116,224,0.40)',
    topLine: 'linear-gradient(90deg,transparent,rgba(155,116,224,0.65),transparent)',
    features: [
      'Tutto il piano Premium incluso',
      'Voice Coach illimitato HD (ElevenLabs)',
      'Analisi emotiva post-call con AI',
      '1 sessione mensile 1:1 con Michael Jara',
      'Report settimanale del percorso vocale',
      'Accesso prioritario alle nuove funzioni',
    ],
    cta: 'Diventa VIP Sovereign →',
    note: 'Accesso immediato · Nessun vincolo · Cancella quando vuoi',
  },
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, planType }) => {
  const navigate = useNavigate();
  const plan = planData[planType];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: 'rgba(6,6,15,0.80)', backdropFilter: 'blur(6px)' }}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0E0C1A',
              border: `0.5px solid ${plan.border}`,
              borderRadius: '1.5rem',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Gradient overlay on top of solid bg */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: plan.gradient, opacity: 0.6 }} />
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: plan.topLine }} />
            {/* Ambient glow */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: plan.colorDim, filter: 'blur(40px)' }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all"
              style={{ background: DL.glassB, color: DL.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = DL.white)}
              onMouseLeave={e => (e.currentTarget.style.color = DL.muted)}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="relative z-10 px-8 pt-8 pb-6 text-center">
              {/* Icon bubble */}
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                style={{ background: plan.colorDim, border: `0.5px solid ${plan.colorB}` }}
              >
                {plan.icon}
              </div>

              <div className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: plan.color }}>
                {plan.sublabel}
              </div>
              <h2 className="font-serif text-[26px] font-normal mb-1" style={{ color: DL.white }}>
                {plan.label}
              </h2>

              {/* Price */}
              <div className="flex items-end justify-center gap-1 mt-4 mb-1">
                <span className="font-serif text-[42px] font-normal leading-none" style={{ color: DL.white }}>
                  {plan.price}
                </span>
                <span className="text-[14px] mb-2" style={{ color: DL.muted }}>
                  {plan.period}
                </span>
              </div>
              <p className="text-[11px]" style={{ color: DL.muted }}>
                {plan.annualNote}
              </p>
            </div>

            {/* Divider */}
            <div className="mx-8 h-px" style={{ background: DL.glassB }} />

            {/* Features */}
            <div className="px-8 py-6 flex flex-col gap-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[12px]">
                  <CheckCircleIcon
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: plan.color }}
                  />
                  <span style={{ color: i < 3 ? DL.white : DL.muted, fontWeight: i < 3 ? 500 : 400 }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8 flex flex-col gap-3">
              <motion.button
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onClose(); navigate('/plans'); }}
                className="w-full py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all"
                style={{
                  background: plan.color,
                  color: planType === 'vip' ? '#FFFFFF' : '#06060F',
                  boxShadow: `0 0 24px ${plan.colorDim}`,
                }}
              >
                {plan.cta}
              </motion.button>

              <button
                onClick={onClose}
                className="w-full py-2 text-[11px] transition-all"
                style={{ color: DL.muted, background: 'transparent', border: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = DL.white)}
                onMouseLeave={e => (e.currentTarget.style.color = DL.muted)}
              >
                Continua con il piano attuale
              </button>

              <p className="text-center text-[10px]" style={{ color: DL.muted }}>
                {plan.note}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;