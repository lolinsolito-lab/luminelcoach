import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SpeakerWaveIcon, SpeakerXMarkIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import CosmosBackground from './CosmosBackground';

// ─── NAVIGATION HELPER ────────────────────────────────────────────────────────
const useNavigation = () => {
  const navigate = useNavigate();
  return { navigateTo: (path: string) => navigate(path), APP_ROUTES: { DASHBOARD: '/' } };
};

// ─── DARK LUXURY TOKENS ───────────────────────────────────────────────────────
const DL = {
  void: '#06060F',
  deep: '#09091A',
  surface: '#0D0D20',
  glass: 'rgba(255,255,255,0.035)',
  glassB: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C',
  goldBr: '#EDD980',
  goldDim: 'rgba(201,168,76,0.12)',
  goldB: 'rgba(201,168,76,0.25)',
  goldGlow: 'rgba(201,168,76,0.06)',
  white: '#F0EBE0',
  muted: '#6A6560',
  alch: '#9B74E0',
  stra: '#4A9ED4',
  guer: '#D4603A',
};

// ─── VALIDATION ───────────────────────────────────────────────────────────────
const validateUserData = {
  fullName: (value: string) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    if (!value?.trim()) return 'Il nome è obbligatorio';
    if (!nameRegex.test(value)) return 'Il nome può contenere solo lettere e spazi (2-50 caratteri)';
    return null;
  },
  goals: (goals: string[]) => {
    if (!goals || goals.length === 0) return 'Seleziona almeno un obiettivo';
    if (goals.length > 3) return 'Massimo 3 obiettivi selezionabili';
    return null;
  },
  experience: (value: string) => {
    if (!value) return 'Seleziona il tuo livello di esperienza';
    if (!['beginner', 'intermediate', 'advanced'].includes(value)) return 'Livello esperienza non valido';
    return null;
  },
  privacyConsents: (consents: any) => {
    if (!consents?.dataProcessing) return 'Devi accettare il trattamento dei dati per continuare';
    return null;
  },
  preferences: (_prefs: any) => null,
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface EnhancedUserProfile {
  fullName: string;
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  stressLevel: number;
  sleepQuality: number;
  energyLevel: number;
  privacyConsents: { dataProcessing: boolean; analytics: boolean; notifications: boolean };
  sessionDuration: string;
  preferredTime: string;
  voiceGender: string;
  backgroundSound: string;
}
interface ErrorState { hasError: boolean; message: string; field?: string; retryable: boolean; }

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
const DLCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{ background: 'rgba(13,13,32,0.85)', border: '0.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
    {children}
  </div>
);

// ─── ERROR BANNER ─────────────────────────────────────────────────────────────
const ErrorBanner: React.FC<{ error: ErrorState }> = ({ error }) => {
  if (!error.hasError) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 px-4 py-3 rounded-xl text-[12px] text-center max-w-lg mx-auto"
      style={{ background: 'rgba(212,96,58,0.1)', border: '0.5px solid rgba(212,96,58,0.3)', color: '#D4603A' }}>
      {error.message}
    </motion.div>
  );
};

// ─── SLIDER ───────────────────────────────────────────────────────────────────
const DLSlider: React.FC<{ value: number; onChange: (v: number) => void; accentColor: string }> = ({ value, onChange, accentColor }) => (
  <div className="relative flex items-center gap-3">
    <span className="text-[11px] w-4 text-center" style={{ color: DL.muted }}>1</span>
    <div className="flex-1 relative h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="absolute left-0 top-0 h-full rounded-full transition-all"
        style={{ width: `${((value - 1) / 9) * 100}%`, background: accentColor }} />
      <input type="range" min="1" max="10" value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all"
        style={{ left: `calc(${((value - 1) / 9) * 100}% - 8px)`, background: DL.deep, borderColor: accentColor, boxShadow: `0 0 8px ${accentColor}50` }} />
    </div>
    <span className="text-[11px] w-4 text-center" style={{ color: DL.muted }}>10</span>
    <motion.span key={value} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[15px] font-medium flex-shrink-0"
      style={{ background: `${accentColor}18`, color: accentColor, border: `0.5px solid ${accentColor}35` }}>
      {value}
    </motion.span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — WELCOME
// ═══════════════════════════════════════════════════════════════════════════════
const WelcomeStepComponent = memo(() => (
  <div className="p-8 md:p-10 text-center">
    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180 }}
      className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
      style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
      <div className="w-10 h-10" style={{ background: `linear-gradient(135deg, ${DL.goldBr}, ${DL.gold})`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
    </motion.div>

    <div className="text-[9px] tracking-[0.28em] uppercase mb-3 opacity-70" style={{ color: DL.gold }}>
      Insolito Experiences · Metodo Jara
    </div>
    <h2 className="font-serif text-[34px] md:text-[42px] font-normal leading-tight mb-4" style={{ color: DL.white }}>
      Benvenuto in <em className="italic" style={{ color: DL.gold }}>Luminel</em>
    </h2>
    <p className="text-[14px] leading-relaxed mb-10 max-w-md mx-auto" style={{ color: DL.muted }}>
      Il tuo percorso di crescita trasformativa basato sull'Ikigai, guidato dall'intelligenza artificiale e dal metodo di Michael Jara.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
      {[
        { icon: '⬡', color: DL.gold, title: 'Ikigai', desc: 'Scopri il tuo scopo di vita autentico' },
        { icon: '♛', color: DL.alch, title: 'Il Consiglio', desc: '4 intelligenze AI che guidano la tua trasformazione' },
        { icon: '🔥', color: DL.guer, title: 'Reality Quest', desc: 'Azioni chirurgiche ogni giorno per evolvere' },
      ].map((f, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
          className="rounded-xl p-5 text-center"
          style={{ background: `${f.color}08`, border: `0.5px solid ${f.color}25` }}>
          <div className="text-[22px] mb-2" style={{ color: f.color }}>{f.icon}</div>
          <div className="text-[13px] font-medium mb-1" style={{ color: DL.white }}>{f.title}</div>
          <div className="text-[11px] leading-snug" style={{ color: DL.muted }}>{f.desc}</div>
        </motion.div>
      ))}
    </div>

    <div className="text-[11px] max-w-sm mx-auto leading-relaxed" style={{ color: DL.muted }}>
      Sviluppo personale ai sensi della Legge 4/2013 · Server EU · GDPR compliant
    </div>
  </div>
));
WelcomeStepComponent.displayName = 'WelcomeStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════════
const AssessmentStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const [data, setData] = useState({ stressLevel: initialData?.stressLevel || 5, sleepQuality: initialData?.sleepQuality || 5, energyLevel: initialData?.energyLevel || 5 });
    const handle = useCallback((field: string, value: number) => {
      const nd = { ...data, [field]: value };
      setData(nd); onUpdate(nd);
    }, [data, onUpdate]);

    const items = [
      { key: 'stressLevel', label: 'Armonia interiore', sub: 'Da tempesta a pace', icon: '🌊', color: DL.stra, lowL: 'Tempesta', highL: 'Pace' },
      { key: 'sleepQuality', label: 'Rigenerazione notturna', sub: 'Qualità del sonno', icon: '🌙', color: DL.alch, lowL: 'Esaurito', highL: 'Rigenerato' },
      { key: 'energyLevel', label: 'Fuoco vitale', sub: 'Energia disponibile', icon: '⚡', color: DL.guer, lowL: 'Spento', highL: 'Radiante' },
    ];

    return (
      <div className="p-7 md:p-10">
        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Mappa del tuo paesaggio interiore</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>Come ti senti <em className="italic" style={{ color: DL.gold }}>ora</em>?</h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>Questo calibra l'esperienza sullo stato attuale. Onestà totale.</p>
        </div>

        <div className="flex flex-col gap-4 max-w-lg mx-auto">
          {items.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl p-5" style={{ background: `${item.color}08`, border: `0.5px solid ${item.color}22` }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px]"
                  style={{ background: `${item.color}18`, color: item.color }}>{item.icon}</div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: DL.white }}>{item.label}</div>
                  <div className="text-[10px]" style={{ color: DL.muted }}>{item.sub}</div>
                </div>
              </div>
              <DLSlider value={data[item.key as keyof typeof data]} onChange={v => handle(item.key, v)} accentColor={item.color} />
              <div className="flex justify-between mt-2">
                <span className="text-[9px]" style={{ color: DL.muted }}>{item.lowL}</span>
                <span className="text-[9px]" style={{ color: DL.muted }}>{item.highL}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <ErrorBanner error={errors} />
      </div>
    );
  }
);
AssessmentStepComponent.displayName = 'AssessmentStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — PERSONAL INFO
// ═══════════════════════════════════════════════════════════════════════════════
const PersonalInfoStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const [fullName, setFullName] = useState(initialData?.fullName || '');
    const [valErr, setValErr] = useState<string | null>(null);
    const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value; setFullName(v);
      const err = validateUserData.fullName(v); setValErr(err);
      if (!err) onUpdate({ fullName: v });
    }, [onUpdate]);

    return (
      <div className="p-7 md:p-10">
        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Identità</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>
            Come vuoi essere <em className="italic" style={{ color: DL.gold }}>chiamato</em>?
          </h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>Ogni percorso trasformativo inizia con un nome.</p>
        </div>

        <div className="max-w-sm mx-auto">
          <label className="block text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: DL.muted }}>
            Il tuo nome <span style={{ color: DL.guer }}>*</span>
          </label>
          <input type="text" value={fullName} onChange={handle} placeholder="Michael..."
            maxLength={50} autoComplete="name"
            className="w-full px-5 py-3.5 rounded-xl text-[14px] outline-none transition-all"
            style={{
              background: valErr ? 'rgba(212,96,58,0.06)' : DL.glass,
              border: `0.5px solid ${valErr ? 'rgba(212,96,58,0.4)' : DL.goldB}`,
              color: DL.white,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '18px',
            }}
            onFocus={e => !valErr && (e.target.style.borderColor = DL.gold)}
            onBlur={e => !valErr && (e.target.style.borderColor = DL.goldB)}
          />
          {valErr && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[11px]" style={{ color: '#D4603A' }}>
              {valErr}
            </motion.p>
          )}
          <div className="flex items-center gap-2 mt-4" style={{ color: DL.muted }}>
            <span className="text-[12px]">🔒</span>
            <p className="text-[11px]">Crittografato · Server EU · Mai condiviso con terze parti</p>
          </div>
        </div>
        <ErrorBanner error={{ ...errors, hasError: errors.hasError && errors.field === 'personal-info' }} />
      </div>
    );
  }
);
PersonalInfoStepComponent.displayName = 'PersonalInfoStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — GOALS
// ═══════════════════════════════════════════════════════════════════════════════
const GoalsStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const goals = [
      { id: 'reduceStress', label: 'Pace Interiore', icon: '🌊', color: DL.stra },
      { id: 'improveSleep', label: 'Sonno Rigenerante', icon: '🌙', color: DL.alch },
      { id: 'increaseEnergy', label: 'Vitalità Piena', icon: '⚡', color: DL.guer },
      { id: 'improveFocus', label: 'Chiarezza Mentale', icon: '🎯', color: DL.gold },
      { id: 'mindfulness', label: 'Presenza Autentica', icon: '🧘', color: DL.stra },
      { id: 'emotionalBalance', label: 'Equilibrio Emotivo', icon: '❤️', color: '#EC4899' },
      { id: 'selfAwareness', label: 'Conoscenza del Sé', icon: '🔍', color: DL.alch },
      { id: 'betterRelationships', label: 'Relazioni Profonde', icon: '🤝', color: '#10B981' },
      { id: 'productivity', label: 'Performance Consapevole', icon: '🚀', color: DL.gold },
      { id: 'creativity', label: 'Flusso Creativo', icon: '✨', color: DL.guer },
      { id: 'ikigai', label: 'Scoprire l\'Ikigai', icon: '⭕', color: DL.gold },
      { id: 'identity', label: 'Trasformazione Identità', icon: '🦋', color: DL.alch },
    ];
    const validIds = goals.map(g => g.id);
    const [selected, setSelected] = useState<string[]>(() =>
      (initialData?.goals || []).filter((id: string) => validIds.includes(id))
    );
    const [shake, setShake] = useState<string | null>(null);
    const toggle = useCallback((id: string) => {
      let next: string[];
      if (selected.includes(id)) { next = selected.filter(g => g !== id); }
      else if (selected.length < 3) { next = [...selected, id]; }
      else { setShake(id); setTimeout(() => setShake(null), 500); return; }
      setSelected(next); onUpdate({ goals: next });
    }, [selected, onUpdate]);

    return (
      <div className="p-7 md:p-10">
        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Intenzioni</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>
            Cosa vuoi <em className="italic" style={{ color: DL.gold }}>trasformare</em>?
          </h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>
            Scegli fino a 3 obiettivi · <span style={{ color: DL.gold }}>{selected.length}/3 selezionati</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {goals.map(g => {
            const isSel = selected.includes(g.id);
            return (
              <motion.button key={g.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                animate={shake === g.id ? { x: [-4, 4, -4, 4, 0] } : {}}
                onClick={() => toggle(g.id)}
                className="rounded-xl p-4 text-center transition-all duration-200 flex flex-col items-center gap-2"
                style={{
                  background: isSel ? `${g.color}14` : DL.glass,
                  border: `0.5px solid ${isSel ? g.color : DL.glassB}`,
                  transform: isSel ? 'translateY(-2px)' : 'none',
                }}>
                {isSel && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: g.color }}>
                    <CheckIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <span className="text-[20px]">{g.icon}</span>
                <span className="text-[11px] leading-snug" style={{ color: isSel ? g.color : DL.muted }}>{g.label}</span>
              </motion.button>
            );
          })}
        </div>
        <ErrorBanner error={{ ...errors, hasError: errors.hasError && errors.field === 'goals' }} />
      </div>
    );
  }
);
GoalsStepComponent.displayName = 'GoalsStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════
const ExperienceStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const [selected, setSelected] = useState(initialData?.experience || '');
    const levels = [
      { id: 'beginner', icon: '🌱', color: '#10B981', title: 'Sono all\'inizio', sub: 'Primo approccio alla crescita personale e alla mindfulness', quote: 'Il primo passo è sempre il più coraggioso' },
      { id: 'intermediate', icon: '🌸', color: DL.gold, title: 'Sto crescendo', sub: 'Ho già qualche pratica, voglio consolidare e approfondire', quote: 'La pazienza è l\'arte di coltivare la bellezza interiore' },
      { id: 'advanced', icon: '🔥', color: DL.alch, title: 'Sto fiorendo', sub: 'Praticante esperto, cerco profondità e sfide avanzate', quote: 'La vera maestria è il viaggio, non la destinazione' },
    ];
    const handle = useCallback((id: string) => { setSelected(id); onUpdate({ experience: id }); }, [onUpdate]);

    return (
      <div className="p-7 md:p-10">
        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Esperienza</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>
            Dove sei nel tuo <em className="italic" style={{ color: DL.gold }}>viaggio</em>?
          </h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>Calibriamo il percorso al tuo livello attuale.</p>
        </div>

        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {levels.map((l, i) => {
            const isSel = selected === l.id;
            return (
              <motion.button key={l.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={!isSel ? { y: -2 } : {}} whileTap={{ scale: 0.99 }}
                onClick={() => handle(l.id)}
                className="rounded-xl p-5 text-left transition-all duration-200"
                style={{
                  background: isSel ? `${l.color}10` : DL.glass,
                  border: `0.5px solid ${isSel ? l.color : DL.glassB}`,
                }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                    style={{ background: `${l.color}18`, color: l.color }}>{l.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-medium" style={{ color: DL.white }}>{l.title}</span>
                      {isSel && <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: l.color }}><CheckIcon className="w-2.5 h-2.5 text-white" /></span>}
                    </div>
                    <p className="text-[12px] leading-snug mb-2" style={{ color: DL.muted }}>{l.sub}</p>
                    <p className="text-[11px] italic" style={{ color: `${l.color}90` }}>"{l.quote}"</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <ErrorBanner error={{ ...errors, hasError: errors.hasError && errors.field === 'experience' }} />
      </div>
    );
  }
);
ExperienceStepComponent.displayName = 'ExperienceStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — PREFERENCES
// ═══════════════════════════════════════════════════════════════════════════════
const PreferencesStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const [prefs, setPrefs] = useState({
      sessionDuration: initialData?.sessionDuration || '10',
      preferredTime: initialData?.preferredTime || 'morning',
      primaryFocus: initialData?.primaryFocus || 'mindfulness',
      learningStyle: initialData?.learningStyle || 'practical',
      practiceFrequency: initialData?.practiceFrequency || '3-4week',
    });
    const handle = useCallback((k: string, v: string) => {
      const np = { ...prefs, [k]: v }; setPrefs(np); onUpdate(np);
    }, [prefs, onUpdate]);

    const sections = [
      {
        key: 'sessionDuration', title: 'Tempo per te', sub: 'Quanto dedichi alla pratica?',
        opts: [{ id: '5', label: '5 min', icon: '⚡' }, { id: '10', label: '10 min', icon: '🎯' }, { id: '15', label: '15 min', icon: '🌿' }, { id: '20+', label: '20+ min', icon: '🧘' }],
      },
      {
        key: 'preferredTime', title: 'Momento preferito', sub: 'Quando la tua mente è più ricettiva?',
        opts: [{ id: 'morning', label: 'Mattina', icon: '🌅' }, { id: 'afternoon', label: 'Pomeriggio', icon: '☀️' }, { id: 'evening', label: 'Sera', icon: '🌙' }, { id: 'flexible', label: 'Flessibile', icon: '🔄' }],
      },
      {
        key: 'primaryFocus', title: 'Focus principale', sub: 'Quale area vuoi prioritizzare?',
        opts: [{ id: 'mindfulness', label: 'Mindfulness', icon: '🧘' }, { id: 'stress', label: 'Stress', icon: '💪' }, { id: 'growth', label: 'Crescita', icon: '🌱' }, { id: 'performance', label: 'Performance', icon: '🚀' }],
      },
      {
        key: 'practiceFrequency', title: 'Frequenza', sub: 'Con quale ritmo vuoi praticare?',
        opts: [{ id: 'daily', label: 'Ogni giorno', icon: '🌟' }, { id: '3-4week', label: '3-4/sett.', icon: '📅' }, { id: '1-2week', label: '1-2/sett.', icon: '📆' }, { id: 'on-demand', label: 'Quando serve', icon: '🔄' }],
      },
    ];

    return (
      <div className="p-7 md:p-10">
        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Personalizzazione</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>
            Il tuo <em className="italic" style={{ color: DL.gold }}>rituale</em> personale
          </h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>Modificabile in qualsiasi momento dalle impostazioni.</p>
        </div>

        <div className="flex flex-col gap-5 max-w-xl mx-auto">
          {sections.map((s, si) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}
              className="rounded-xl p-5" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
              <div className="mb-3">
                <div className="text-[13px] font-medium mb-0.5" style={{ color: DL.white }}>{s.title}</div>
                <div className="text-[11px]" style={{ color: DL.muted }}>{s.sub}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {s.opts.map(opt => {
                  const isSel = prefs[s.key as keyof typeof prefs] === opt.id;
                  return (
                    <button key={opt.id} onClick={() => handle(s.key, opt.id)}
                      className="rounded-lg p-3 text-center transition-all flex flex-col items-center gap-1"
                      style={{
                        background: isSel ? DL.goldDim : 'rgba(255,255,255,0.02)',
                        border: `0.5px solid ${isSel ? DL.goldB : DL.glassB}`,
                        color: isSel ? DL.goldBr : DL.muted,
                      }}>
                      <span className="text-[16px]">{opt.icon}</span>
                      <span className="text-[10px] leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        <ErrorBanner error={errors} />
      </div>
    );
  }
);
PreferencesStepComponent.displayName = 'PreferencesStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 7 — PRIVACY
// ═══════════════════════════════════════════════════════════════════════════════
const PrivacyStepComponent = memo<{ onUpdate: (d: any) => void; initialData: any; errors: ErrorState }>(
  ({ onUpdate, initialData, errors }) => {
    const [consents, setConsents] = useState({ dataProcessing: initialData?.privacyConsents?.dataProcessing || false, analytics: initialData?.privacyConsents?.analytics || false, notifications: initialData?.privacyConsents?.notifications || false });
    const [modal, setModal] = useState<{ title: string; content: string } | null>(null);
    const handle = useCallback((type: string, val: boolean) => {
      const nc = { ...consents, [type]: val }; setConsents(nc); onUpdate({ privacyConsents: nc });
    }, [consents, onUpdate]);

    const opts = [
      {
        id: 'dataProcessing', title: 'Trattamento dati personali', desc: 'Personalizzazione dell\'esperienza Luminel basata sui tuoi dati.', required: true, color: DL.gold,
        content: 'Utilizziamo i tuoi dati (nome, obiettivi, preferenze) solo per personalizzare le sessioni di coaching AI. Base legale: consenso esplicito (Art. 6.1.a GDPR). Dati conservati su server EU fino alla cancellazione dell\'account. Puoi richiedere esportazione o cancellazione in qualsiasi momento dalle Impostazioni.'
      },
      {
        id: 'analytics', title: 'Analytics anonimi', desc: 'Dati aggregati e anonimi per migliorare la piattaforma.', required: false, color: DL.stra,
        content: 'Raccogliamo dati anonimi e aggregati su utilizzo dell\'app (sessioni completate, durata media). I dati non possono essere ricondotti a te. Strumenti analytics GDPR-compliant con IP anonimizzato. Revocabile in qualsiasi momento.'
      },
      {
        id: 'notifications', title: 'Promemoria e notifiche', desc: 'Reminder per le sessioni, Reality Quest giornaliere e nuovi contenuti.', required: false, color: DL.alch,
        content: 'Con il tuo consenso: promemoria sessioni, Reality Quest AI giornaliera, aggiornamenti contenuti. Frequenza configurabile. Canali: email e/o push. Disattivabile istantaneamente dalle Impostazioni o dal link in ogni email.'
      },
    ];

    return (
      <div className="p-7 md:p-10">
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(6,6,15,0.88)', backdropFilter: 'blur(10px)' }}
            onClick={() => setModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: '#0D0D20', border: '0.5px solid rgba(201,168,76,0.25)' }}>
              <div className="p-6 border-b" style={{ borderColor: DL.glassB }}>
                <h3 className="font-serif text-[18px]" style={{ color: DL.white }}>{modal.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-[12px] leading-relaxed" style={{ color: DL.muted }}>{modal.content}</p>
              </div>
              <div className="px-6 pb-6">
                <button onClick={() => setModal(null)} className="w-full py-3 rounded-xl text-[13px] font-medium"
                  style={{ background: DL.gold, color: '#06060F' }}>Ho capito</button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Privacy · GDPR · EU AI Act</div>
          <h2 className="font-serif text-[28px] font-normal mb-2" style={{ color: DL.white }}>
            Il tuo spazio <em className="italic" style={{ color: DL.gold }}>sicuro</em>
          </h2>
          <p className="text-[13px]" style={{ color: DL.muted }}>La fiducia è il fondamento del nostro percorso.</p>
        </div>

        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          {opts.map((opt, i) => {
            const checked = consents[opt.id as keyof typeof consents];
            return (
              <motion.div key={opt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl p-5 transition-all"
                style={{ background: checked ? `${opt.color}08` : DL.glass, border: `0.5px solid ${checked ? opt.color + '35' : DL.glassB}` }}>
                <div className="flex items-start gap-3">
                  <button onClick={() => handle(opt.id, !checked)}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{ background: checked ? opt.color : 'transparent', border: `0.5px solid ${checked ? opt.color : DL.glassB}` }}>
                    {checked && <CheckIcon className="w-3 h-3 text-white" style={{ color: opt.id === 'analytics' ? '#fff' : '#06060F' }} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium" style={{ color: DL.white }}>
                        {opt.title}{opt.required && <span className="ml-1" style={{ color: DL.guer }}>*</span>}
                      </span>
                      <button onClick={() => setModal({ title: opt.title, content: opt.content })}
                        className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded transition-all"
                        style={{ color: opt.color, border: `0.5px solid ${opt.color}30`, background: `${opt.color}08` }}>
                        Info
                      </button>
                    </div>
                    <p className="text-[11px] leading-snug" style={{ color: DL.muted }}>{opt.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-[10px] max-w-sm mx-auto" style={{ color: DL.muted }}>
          Luminel è una piattaforma di sviluppo personale ai sensi della Legge 4/2013. Non è un servizio medico o psicologico. L'AI Coach è dichiarato come sistema automatizzato ai sensi dell'EU AI Act.
        </div>
        <ErrorBanner error={{ ...errors, hasError: errors.hasError && errors.field === 'privacy' }} />
      </div>
    );
  }
);
PrivacyStepComponent.displayName = 'PrivacyStepComponent';

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO PLAYER (intro screen)
// ═══════════════════════════════════════════════════════════════════════════════
const VideoPlayer = memo<{ onEnd: () => void; onSkip: () => void; deviceType: string }>(({ onEnd }) => (
  <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
    <CosmosBackground />
    {/* Dark overlay */}
    <div className="absolute inset-0" style={{ background: 'rgba(6,6,15,0.6)' }} />

    <div className="relative z-10 text-center px-6 max-w-2xl">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center"
        style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, boxShadow: `0 0 40px rgba(201,168,76,0.15)` }}>
        <div className="w-12 h-12" style={{ background: `linear-gradient(135deg, ${DL.goldBr}, ${DL.gold})`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="text-[9px] tracking-[0.3em] uppercase mb-3 opacity-60" style={{ color: DL.gold }}>
          Insolito Experiences · Michael Jara
        </div>
        <h1 className="font-serif text-[44px] md:text-[56px] font-normal leading-tight mb-4" style={{ color: DL.white }}>
          Luminel<br /><em className="italic" style={{ color: DL.gold }}>Coach Transformational</em>
        </h1>
        <p className="text-[15px] mb-2 leading-relaxed" style={{ color: 'rgba(240,235,224,0.6)' }}>
          Il tuo percorso di trasformazione identitaria basato sull'Ikigai
        </p>
        <p className="text-[11px] tracking-[0.18em] uppercase mb-12" style={{ color: DL.muted }}>
          Ikigai · AI Coaching · Reality Quest · Il Consiglio
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <button onClick={onEnd} className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-[14px] font-medium tracking-wide transition-all group"
          style={{ background: DL.gold, color: '#06060F', boxShadow: '0 0 30px rgba(201,168,76,0.25)' }}>
          Inizia il tuo viaggio
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="mt-6 text-[10px]" style={{ color: DL.muted }}>
        Sviluppo personale ai sensi della Legge 4/2013 · Non è un servizio medico
      </motion.p>
    </div>
  </motion.div>
));
VideoPlayer.displayName = 'VideoPlayer';

// ═══════════════════════════════════════════════════════════════════════════════
// STEPS CONFIG — identico all'originale
// ═══════════════════════════════════════════════════════════════════════════════
const getOnboardingSteps = () => [
  { id: 'welcome', type: 'intro' as const, title: 'Benvenuto', subtitle: 'Il tuo percorso inizia qui', icon: '◆', component: WelcomeStepComponent, validation: null },
  { id: 'assessment', type: 'assessment' as const, title: 'Stato attuale', subtitle: 'Come ti senti oggi?', icon: '📊', component: AssessmentStepComponent, validation: 'assessment' },
  { id: 'personal-info', type: 'personal' as const, title: 'Identità', subtitle: 'Come preferisci essere chiamato?', icon: '👤', component: PersonalInfoStepComponent, validation: 'name-required' },
  { id: 'goals', type: 'goals' as const, title: 'Intenzioni', subtitle: 'Cosa vuoi trasformare?', icon: '🎯', component: GoalsStepComponent, validation: 'goals-required' },
  { id: 'experience', type: 'experience' as const, title: 'Esperienza', subtitle: 'Dove sei nel tuo viaggio?', icon: '🌱', component: ExperienceStepComponent, validation: 'experience-required' },
  { id: 'preferences', type: 'preferences' as const, title: 'Preferenze', subtitle: 'Come vuoi praticare?', icon: '⚙️', component: PreferencesStepComponent, validation: 'preferences' },
  { id: 'privacy', type: 'privacy' as const, title: 'Privacy & Consensi', subtitle: 'I tuoi dati sono al sicuro', icon: '🔒', component: PrivacyStepComponent, validation: 'privacy-required' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — logica identica all'originale
// ═══════════════════════════════════════════════════════════════════════════════
const WelcomePage = () => {
  const { navigateTo, APP_ROUTES } = useNavigation();
  const { user, profile, loading: authLoading, isAuthenticated, updateUserProfile } = useAuth();
  const device = useDeviceDetect();
  const { deviceType } = device;

  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({ hasError: false, message: '', retryable: false });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [enhancedUserProfile, setEnhancedUserProfile] = useLocalStorage<EnhancedUserProfile>('enhancedUserProfile', {
    fullName: '', goals: [], experience: 'beginner', stressLevel: 5, sleepQuality: 5, energyLevel: 5,
    privacyConsents: { dataProcessing: false, analytics: false, notifications: false },
    sessionDuration: '10', preferredTime: 'morning', voiceGender: 'female', backgroundSound: 'nature',
  });

  const onboardingSteps = getOnboardingSteps();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && profile?.fullName) navigateTo(APP_ROUTES.DASHBOARD);
  }, [authLoading, isAuthenticated, profile, navigateTo, APP_ROUTES.DASHBOARD]);

  useEffect(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => { }); }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartJourney = () => {
    setShowVideo(false);
    if (audioRef.current && !isPlaying) audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
  };

  const normalizeData = useCallback((data: any) => ({
    ...enhancedUserProfile, ...data,
    goals: data.goals || enhancedUserProfile.goals || [],
    privacyConsents: { ...enhancedUserProfile.privacyConsents, ...(data.privacyConsents || {}) },
  }), [enhancedUserProfile]);

  const validateCurrentStep = useCallback((stepIndex: number): ErrorState => {
    const step = onboardingSteps[stepIndex];
    if (!step?.validation) return { hasError: false, message: '', retryable: false };
    let error: string | null = null; let field = step.id;
    switch (step.validation) {
      case 'name-required': error = validateUserData.fullName(enhancedUserProfile.fullName); field = 'personal-info'; break;
      case 'goals-required': error = validateUserData.goals(enhancedUserProfile.goals); field = 'goals'; break;
      case 'experience-required': error = validateUserData.experience(enhancedUserProfile.experience); field = 'experience'; break;
      case 'privacy-required': error = validateUserData.privacyConsents(enhancedUserProfile.privacyConsents); field = 'privacy'; break;
      default: error = null;
    }
    return error ? { hasError: true, message: error, field, retryable: true } : { hasError: false, message: '', retryable: false };
  }, [onboardingSteps, enhancedUserProfile]);

  const handleStepUpdate = useCallback((data: any) => {
    setEnhancedUserProfile(normalizeData(data));
    setErrors({ hasError: false, message: '', retryable: false });
  }, [normalizeData, setEnhancedUserProfile]);

  const handleNext = useCallback(() => {
    const validation = validateCurrentStep(currentStep);
    if (validation.hasError) { setErrors(validation); return; }
    if (currentStep < onboardingSteps.length - 1) { setCurrentStep(p => p + 1); setErrors({ hasError: false, message: '', retryable: false }); }
    else handleComplete();
  }, [currentStep, validateCurrentStep, onboardingSteps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) { setCurrentStep(p => p - 1); setErrors({ hasError: false, message: '', retryable: false }); }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    setIsComponentLoading(true);
    try {
      const fv = validateCurrentStep(onboardingSteps.length - 1);
      if (fv.hasError) { setErrors(fv); setIsComponentLoading(false); return; }
      await updateUserProfile(enhancedUserProfile);
      localStorage.removeItem('enhancedUserProfile');
      navigateTo(APP_ROUTES.DASHBOARD);
    } catch (e) {
      console.error('Onboarding error:', e);
      setErrors({ hasError: true, message: 'Errore durante il salvataggio. Riprova.', retryable: true });
    } finally { setIsComponentLoading(false); }
  }, [validateCurrentStep, onboardingSteps.length, updateUserProfile, enhancedUserProfile, navigateTo, APP_ROUTES.DASHBOARD]);

  if (authLoading || isComponentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: DL.void }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: `${DL.goldDim}`, borderTopColor: DL.gold }} />
          <p className="text-[13px]" style={{ color: DL.muted }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: DL.void, color: DL.white }}>
      <CosmosBackground />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(6,6,15,0.55)' }} />

      <audio ref={audioRef} loop>
        <source src="/audio/welcome.mp3" type="audio/mp3" />
      </audio>

      {/* Audio toggle */}
      <button onClick={toggleAudio}
        className="fixed top-4 right-4 z-[60] w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: DL.muted }}>
        {isPlaying ? <SpeakerWaveIcon className="w-4 h-4" /> : <SpeakerXMarkIcon className="w-4 h-4" />}
      </button>

      <AnimatePresence mode="wait">
        {showVideo ? (
          <VideoPlayer key="video" onEnd={handleStartJourney} onSkip={handleStartJourney} deviceType={deviceType} />
        ) : (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 min-h-screen flex flex-col">

            {/* Header */}
            <div className="sticky top-0 z-20 flex-shrink-0"
              style={{ background: 'rgba(9,9,26,0.85)', borderBottom: '0.5px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
              <div className="max-w-3xl mx-auto px-5 py-4">
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
                      style={{ background: `linear-gradient(90deg, ${DL.gold}, ${DL.goldBr})` }} />
                  </div>
                  <span className="text-[11px] flex-shrink-0" style={{ color: DL.muted }}>
                    {currentStep + 1}/{onboardingSteps.length}
                  </span>
                  <button onClick={() => navigateTo('/login')}
                    className="text-[11px] tracking-wide transition-all px-3 py-1 rounded-lg"
                    style={{ color: DL.muted, border: '0.5px solid rgba(255,255,255,0.07)' }}>
                    Hai già un account?
                  </button>
                </div>

                {/* Step info */}
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">{onboardingSteps[currentStep]?.icon}</span>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: DL.white }}>
                      {onboardingSteps[currentStep]?.title}
                    </div>
                    <div className="text-[10px]" style={{ color: DL.muted }}>
                      {onboardingSteps[currentStep]?.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4 py-8">
              <div className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}>
                    <DLCard>
                      {React.createElement(onboardingSteps[currentStep]?.component, {
                        onUpdate: handleStepUpdate,
                        initialData: enhancedUserProfile,
                        errors,
                      })}
                    </DLCard>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer nav */}
            <div className="sticky bottom-0 z-20 flex-shrink-0"
              style={{ background: 'rgba(9,9,26,0.85)', borderTop: '0.5px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
              <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
                <button onClick={handleBack} disabled={currentStep === 0}
                  className="px-5 py-2.5 rounded-xl text-[12px] transition-all disabled:opacity-30"
                  style={{ color: DL.muted, border: '0.5px solid rgba(255,255,255,0.07)' }}>
                  ← Indietro
                </button>

                <div className="flex items-center gap-3">
                  {errors.hasError && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[11px]" style={{ color: DL.guer }}>
                      {errors.message}
                    </motion.span>
                  )}
                  <button onClick={handleNext} disabled={isComponentLoading}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all disabled:opacity-50"
                    style={{ background: DL.gold, color: '#06060F', boxShadow: `0 0 20px rgba(201,168,76,0.2)` }}>
                    {isComponentLoading ? (
                      <><div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#06060F' }} />Salvataggio...</>
                    ) : currentStep === onboardingSteps.length - 1 ? (
                      'Completa →'
                    ) : (
                      <>Continua <ArrowRightIcon className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomePage;