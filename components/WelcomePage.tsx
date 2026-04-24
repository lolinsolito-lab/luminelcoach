import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceDetect } from '../hooks/useDeviceDetect';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import CosmosBackground from './CosmosBackground';

// Mock contexts/hooks that were used in the original code
const useNavigation = () => {
  const navigate = useNavigate();
  return {
    navigateTo: (path: string) => navigate(path),
    APP_ROUTES: { DASHBOARD: '/' }
  };
};

// --- VALIDATION & TYPES ---

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
    if (!consents?.dataProcessing) return 'Devi accettare il trattamento dei dati personali per continuare';
    return null;
  },
  preferences: (prefs: any) => {
    return null;
  }
};

interface EnhancedUserProfile {
  fullName: string;
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  stressLevel: number;
  sleepQuality: number;
  energyLevel: number;
  privacyConsents: {
    dataProcessing: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  sessionDuration: string;
  preferredTime: string;
  voiceGender: string;
  backgroundSound: string;
}

interface ErrorState {
  hasError: boolean;
  message: string;
  field?: string;
  retryable: boolean;
}

// --- SUB-COMPONENTS ---

const WelcomeStepComponent = memo(() => {
  return (
    <div className="text-center p-4 md:p-6">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-6xl mb-4"
      >
        🌸
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
        Welcome to Coach Luminel Transformational
      </h2>

      <p className="text-slate-700 mb-3 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
        Benvenuto in una Nuova Dimensione di Esperienza Sensoriale
      </p>

      <p className="text-slate-600 mb-6 text-base leading-relaxed max-w-2xl mx-auto">
        Un percorso dove la mente si calma, il cuore si apre e l'anima evolve.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {[
          { icon: '🧘‍♀️', title: 'Viaggi Interiori', desc: 'Esplora i paesaggi della tua mente' },
          { icon: '💎', title: 'Specchio dell\'Anima', desc: 'Osserva la tua preziosa evoluzione' },
          { icon: '🌱', title: 'Fioritura del Sé', desc: 'Realizza il tuo potenziale infinito' }
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center p-4">
            <div className="text-5xl mb-3">{feature.icon}</div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 max-w-2xl mx-auto">
        <p className="text-base text-purple-800 font-medium">
          ✨ Inizia il tuo viaggio di trasformazione interiore
        </p>
      </div>
    </div>
  );
});

WelcomeStepComponent.displayName = 'WelcomeStepComponent';

const AssessmentStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const [assessmentData, setAssessmentData] = useState({
    stressLevel: initialData?.stressLevel || 5,
    sleepQuality: initialData?.sleepQuality || 5,
    energyLevel: initialData?.energyLevel || 5
  });

  const handleSliderChange = useCallback((field: string, value: number) => {
    const newData = { ...assessmentData, [field]: value };
    setAssessmentData(newData);
    onUpdate(newData);
  }, [assessmentData, onUpdate]);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl mb-5"
        >
          📊
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Riscopri la Tua Essenza
        </h2>
        <p className="text-slate-700 text-lg max-w-lg mx-auto mb-2">
          Un momento di ascolto profondo per mappare il tuo paesaggio interiore
        </p>
        <p className="text-slate-600 text-sm">
          Ascolta il tuo ritmo interiore
        </p>
      </div>

      <div className="space-y-5 max-w-2xl mx-auto">
        {[
          {
            key: 'stressLevel',
            label: 'Armonia Interiore',
            icon: '😌',
            lowLabel: 'In Tempesta',
            highLabel: 'In Pace',
            color: 'from-green-400 to-red-500',
            bgColor: 'bg-gradient-to-r from-green-50/50 to-red-50/50'
          },
          {
            key: 'sleepQuality',
            label: 'Rigenerazione Notturna',
            icon: '🌙',
            lowLabel: 'Esaurito',
            highLabel: 'Rinato',
            color: 'from-red-400 to-blue-500',
            bgColor: 'bg-gradient-to-r from-red-50/50 to-blue-50/50'
          },
          {
            key: 'energyLevel',
            label: 'Fuoco Vitale',
            icon: '🔥',
            lowLabel: 'Spento',
            highLabel: 'Radioso',
            color: 'from-orange-400 to-yellow-500',
            bgColor: 'bg-gradient-to-r from-orange-50/50 to-yellow-50/50'
          }
        ].map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${item.bgColor} p-6 md:p-8 rounded-2xl border-2 border-slate-200 shadow-sm`}
          >
            <div className="flex items-center mb-5">
              <span className="text-3xl mr-3">{item.icon}</span>
              <label className="text-base md:text-lg font-semibold text-slate-800">
                {item.label}
              </label>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 mb-4">
              <span className="text-sm font-medium text-slate-600 min-w-[20px]">1</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessmentData[item.key as keyof typeof assessmentData]}
                  onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                  className={`w-full h-4 bg-gradient-to-r ${item.color} rounded-lg appearance-none cursor-pointer hover:opacity-90 transition-opacity`}
                />
              </div>
              <span className="text-sm font-medium text-slate-600 min-w-[20px]">10</span>
              <motion.span
                key={assessmentData[item.key as keyof typeof assessmentData]}
                initial={{ scale: 1.3, color: '#8b5cf6' }}
                animate={{ scale: 1, color: '#1e293b' }}
                className="font-black text-2xl md:text-3xl ml-2 min-w-[40px] text-center text-slate-800 bg-white px-3 py-1 rounded-lg shadow"
              >
                {assessmentData[item.key as keyof typeof assessmentData]}
              </motion.span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium text-slate-600">{item.lowLabel}</span>
              <span className="text-sm font-medium text-slate-600">{item.highLabel}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-purple-50 rounded-xl border border-purple-200 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-base text-purple-900 font-semibold mb-1">
              Perché queste informazioni?
            </p>
            <p className="text-sm text-purple-800">
              Questi dati ci aiutano a sintonizzare la tua esperienza, offrendoti pratiche che risuonano con il tuo stato attuale e i tuoi desideri più profondi.
            </p>
          </div>
        </div>
      </div>

      {errors.hasError && errors.field === 'assessment' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-800">{errors.message}</p>
        </motion.div>
      )}
    </div>
  );
});
AssessmentStepComponent.displayName = 'AssessmentStepComponent';

const PersonalInfoStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);

    const error = validateUserData.fullName(value);
    setValidationError(error);

    if (!error) {
      onUpdate({ fullName: value });
    }
  }, [onUpdate]);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-5"
        >
          👋
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Iniziamo a Conoscerci
        </h2>
        <p className="text-slate-700 text-lg max-w-lg mx-auto">
          Ogni relazione autentica inizia con un nome.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-base font-semibold text-slate-800 mb-3">
          Come desideri essere chiamato/a nel tuo viaggio? <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={handleNameChange}
          placeholder="Il tuo nome..."
          className={`w-full px-5 py-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-800 placeholder-slate-400 transition-all duration-300 ${validationError
            ? 'border-red-400 bg-red-50'
            : 'border-slate-300 hover:border-slate-400'
            }`}
          maxLength={50}
          autoComplete="name"
        />
        <p className="text-xs text-slate-500 mt-2 flex items-center">
          <span className="mr-1">🔒</span> Il tuo nome è al sicuro qui, custodito con rispetto.
        </p>

        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <p className="text-sm font-medium text-red-800">{validationError}</p>
          </motion.div>
        )}

        <div className="mt-6 p-5 bg-purple-50 rounded-xl border-2 border-purple-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-base text-purple-900 font-semibold mb-1">
                Privacy garantita
              </p>
              <p className="text-sm text-purple-800">
                Le tue informazioni sono crittografate e vengono utilizzate solo per personalizzare
                la tua esperienza. Non le condividiamo mai con terze parti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
PersonalInfoStepComponent.displayName = 'PersonalInfoStepComponent';

const GoalsStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const availableGoals = [
    { id: 'reduceStress', label: 'Ritrovare la Pace Interiore', icon: '😌' },
    { id: 'improveSleep', label: 'Risvegliarsi Rigenerato', icon: '🌙' },
    { id: 'increaseEnergy', label: 'Accendere la Vitalità', icon: '⚡' },
    { id: 'improveFocus', label: 'Chiarezza Mentale Cristallina', icon: '💎' },
    { id: 'mindfulness', label: 'Vivere nel Qui e Ora', icon: '🧘‍♀️' },
    { id: 'emotionalBalance', label: 'Armonia del Cuore', icon: '❤️' },
    { id: 'selfAwareness', label: 'Incontro con il Sé Profondo', icon: '🪞' },
    { id: 'betterRelationships', label: 'Connessioni Autentiche', icon: '🤝' },
    { id: 'productivity', label: 'Realizzazione Consapevole', icon: '🚀' },
    { id: 'creativity', label: 'Flusso Creativo Libero', icon: '🎨' },
    { id: 'anxiety', label: 'Trasformare l\'Ansia in Forza', icon: '🌿' },
    { id: 'physicalHealth', label: 'Onorare il Proprio Corpo', icon: '💪' }
  ];

  // Validate initial data to ensure we don't have invalid IDs from previous versions
  const [selectedGoals, setSelectedGoals] = useState<string[]>(() => {
    const initial = initialData?.goals || [];
    const validIds = availableGoals.map(g => g.id);
    return initial.filter((id: string) => validIds.includes(id));
  });

  const [shakeId, setShakeId] = useState<string | null>(null);

  const handleGoalToggle = useCallback((goalId: string) => {
    let newGoals: string[];
    if (selectedGoals.includes(goalId)) {
      newGoals = selectedGoals.filter(g => g !== goalId);
    } else if (selectedGoals.length < 3) {
      newGoals = [...selectedGoals, goalId];
    } else {
      // Limit reached feedback
      setShakeId(goalId);
      setTimeout(() => setShakeId(null), 500);
      return;
    }
    setSelectedGoals(newGoals);
    onUpdate({ goals: newGoals });
  }, [selectedGoals, onUpdate]);

  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl mb-4"
        >
          🎯
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Quali Semi Vuoi Piantare?
        </h2>
        <p className="text-slate-700 text-lg max-w-lg mx-auto">
          Scegli le intenzioni che guideranno la tua trasformazione
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Seleziona fino a 3 semi ({selectedGoals.length}/3)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {availableGoals.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          const isShaking = shakeId === goal.id;

          return (
            <motion.button
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => handleGoalToggle(goal.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden flex flex-col items-center gap-2 ${isSelected
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-purple-300 cursor-pointer'
                }`}
            >
              <div className="text-3xl mb-1">{goal.icon}</div>
              <span className={`text-sm font-medium ${isSelected ? 'text-purple-700' : 'text-slate-700'}`}>
                {goal.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
          <span className="text-base font-semibold text-purple-700">
            Selezionati: {selectedGoals.length}/3
          </span>
        </div>
      </div>

      {errors.hasError && errors.field === 'goals' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-center"
        >
          <p className="text-sm">{errors.message}</p>
        </motion.div>
      )}
    </div>
  );
});
GoalsStepComponent.displayName = 'GoalsStepComponent';

const ExperienceStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const [selectedExperience, setSelectedExperience] = useState<string>(initialData?.experience || '');

  const journeyLevels = [
    {
      id: 'beginner',
      title: 'Sono all\'inizio - Ho bisogno di guida',
      description: 'Mi sento come un germoglio che sta per sbocciare. Cerco qualcuno che mi accompagni nei primi passi verso una versione migliore di me.',
      icon: '🌱',
      quote: 'Il primo passo è sempre il più coraggioso',
      gradient: 'from-green-100 to-emerald-100',
      iconBg: 'bg-green-50'
    },
    {
      id: 'intermediate',
      title: 'Sto crescendo - Voglio consolidare',
      description: 'Come un fiore che si apre al sole, sento che sto iniziando a fiorire. Voglio nutrire questa crescita e renderla solida.',
      icon: '🌸',
      quote: 'La pazienza è l\'arte di coltivare la bellezza interiore',
      gradient: 'from-pink-100 to-rose-100',
      iconBg: 'bg-pink-50'
    },
    {
      id: 'advanced',
      title: 'Sto fiorendo - Cerco profondità',
      description: 'Sono in piena fioritura e voglio continuare ad espandermi. Cerco saggezza e tecniche avanzate per la mia evoluzione.',
      icon: '🌺',
      quote: 'La vera maestria è il viaggio, non la destinazione',
      gradient: 'from-purple-100 to-violet-100',
      iconBg: 'bg-purple-50'
    }
  ];

  const handleExperienceSelect = useCallback((experienceId: string) => {
    setSelectedExperience(experienceId);
    onUpdate({ experience: experienceId });
  }, [onUpdate]);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-5xl mb-3"
        >
          🌸
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Dove Sei Nel Tuo Viaggio di Trasformazione?
        </h2>
        <p className="text-slate-700 text-base md:text-lg max-w-2xl mx-auto">
          Ogni percorso è unico - raccontaci il tuo
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {journeyLevels.map((level, index) => {
          const isSelected = selectedExperience === level.id;
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExperienceSelect(level.id)}
              className={`w-full p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden ${isSelected
                ? 'border-purple-400 bg-gradient-to-br shadow-xl ring-2 ring-purple-200 ' + level.gradient
                : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  className={`text-5xl p-3 rounded-xl ${isSelected ? level.iconBg : 'bg-slate-50'}`}
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {level.icon}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                    {level.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-3">
                    {level.description}
                  </p>
                  <div className="flex items-start space-x-2 text-slate-600">
                    <span className="text-lg">💭</span>
                    <p className="text-xs md:text-sm italic">
                      "{level.quote}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {errors.hasError && errors.field === 'experience' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-center"
        >
          <p className="text-sm">{errors.message}</p>
        </motion.div>
      )}
    </div>
  );
});
ExperienceStepComponent.displayName = 'ExperienceStepComponent';

const PreferencesStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const [preferences, setPreferences] = useState({
    sessionDuration: initialData?.sessionDuration || '10',
    preferredTime: initialData?.preferredTime || 'morning',
    primaryFocus: initialData?.primaryFocus || 'mindfulness',
    learningStyle: initialData?.learningStyle || 'practical',
    practiceFrequency: initialData?.practiceFrequency || '3-4week'
  });

  const handlePreferenceChange = useCallback((key: string, value: string) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onUpdate(newPreferences);
  }, [preferences, onUpdate]);

  const preferenceOptions = {
    sessionDuration: [
      { id: '5', label: '5 min', icon: '⚡' },
      { id: '10', label: '10 min', icon: '🎯' },
      { id: '15', label: '15 min', icon: '🌿' },
      { id: '20+', label: '20+ min', icon: '🧘‍♀️' }
    ],
    preferredTime: [
      { id: 'morning', label: 'Mattina', icon: '🌅' },
      { id: 'afternoon', label: 'Pomeriggio', icon: '☀️' },
      { id: 'evening', label: 'Sera', icon: '🌙' },
      { id: 'flexible', label: 'Flessibile', icon: '🔄' }
    ],
    primaryFocus: [
      { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
      { id: 'stress', label: 'Gestione Stress', icon: '💪' },
      { id: 'growth', label: 'Crescita Personale', icon: '🌱' },
      { id: 'performance', label: 'Performance', icon: '💼' }
    ],
    learningStyle: [
      { id: 'visual', label: 'Visivo', icon: '👁️' },
      { id: 'practical', label: 'Pratico', icon: '🎯' },
      { id: 'reflective', label: 'Riflessivo', icon: '💭' },
      { id: 'auditory', label: 'Uditivo', icon: '🎧' }
    ],
    practiceFrequency: [
      { id: 'daily', label: 'Quotidiana', icon: '🌟' },
      { id: '3-4week', label: '3-4/settimana', icon: '📅' },
      { id: '1-2week', label: '1-2/settimana', icon: '📆' },
      { id: 'on-demand', label: 'Quando serve', icon: '🔄' }
    ]
  };

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl mb-3"
        >
          ⚙️
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Il Tuo Rituale Personale
        </h2>
        <p className="text-slate-700 text-base md:text-lg max-w-2xl mx-auto mb-1">
          Disegniamo insieme i contorni della tua pratica sacra
        </p>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Potrai modificare queste preferenze in qualsiasi momento
        </p>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {Object.entries(preferenceOptions).map(([category, options], categoryIndex) => {
          const categoryTitles = {
            sessionDuration: 'Il Tempo per Te',
            preferredTime: 'Il Tuo Momento Sacro',
            primaryFocus: 'La Tua Stella Polare',
            learningStyle: 'La Tua Via di Accesso',
            practiceFrequency: 'Il Ritmo del Tuo Impegno'
          };
          const categoryDescriptions = {
            sessionDuration: 'Quanto spazio vuoi dedicare alla tua crescita?',
            preferredTime: 'Quando la tua energia è più ricettiva?',
            primaryFocus: 'Quale orizzonte vuoi esplorare?',
            learningStyle: 'Come la tua anima apprende meglio?',
            practiceFrequency: 'Quale cadenza risuona con te?'
          };
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white p-5 md:p-6 rounded-2xl border-2 border-slate-200 shadow-sm"
            >
              <div className="mb-4">
                <h3 className="text-base md:text-lg font-bold text-slate-800">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                </p>
              </div>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {options.map((option) => {
                  const isSelected = preferences[category as keyof typeof preferences] === option.id;
                  const isShaking = errors.hasError && errors.field === category && !isSelected; // Assuming shake if error for this category and option not selected
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      onClick={() => handlePreferenceChange(category, option.id)}
                      className={`min-h-[70px] p-3 rounded-xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center ${isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200'
                        : 'border-slate-200 bg-slate-50 hover:border-purple-300'
                        }`}
                    >
                      <span className="text-2xl mb-1">{option.icon}</span>
                      <span className="text-sm font-semibold text-slate-800">{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
PreferencesStepComponent.displayName = 'PreferencesStepComponent';

const PrivacyStepComponent = memo<{
  onUpdate: (data: any) => void;
  initialData: any;
  errors: ErrorState;
}>(({ onUpdate, initialData, errors }) => {
  const [consents, setConsents] = useState({
    dataProcessing: initialData?.privacyConsents?.dataProcessing || false,
    analytics: initialData?.privacyConsents?.analytics || false,
    notifications: initialData?.privacyConsents?.notifications || false
  });

  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const handleConsentChange = useCallback((consentType: string, value: boolean) => {
    const newConsents = { ...consents, [consentType]: value };
    setConsents(newConsents);
    onUpdate({ privacyConsents: newConsents });
  }, [consents, onUpdate]);

  const privacyInfoContent = {
    dataProcessing: {
      title: 'Trattamento dei Dati Personali',
      content: `**Finalità del Trattamento**

Luminel Transformational Coach tratta i tuoi dati personali (nome, obiettivi, livello di esperienza, preferenze di pratica) esclusivamente per:
• Personalizzare le sessioni di meditazione e mindfulness
• Adattare i contenuti al tuo livello e obiettivi
• Monitorare i tuoi progressi nel tempo

**Base Legale**
Consenso esplicito (Art. 6.1.a GDPR)

**Conservazione**
I dati vengono conservati fino alla cancellazione del tuo account.

**I Tuoi Diritti**
Hai diritto ad accedere, rettificare, cancellare i tuoi dati in qualsiasi momento dalle impostazioni del profilo.

**Sicurezza**
Utilizziamo crittografia end-to-end per proteggere le tue informazioni.`
    },
    analytics: {
      title: 'Analytics e Miglioramenti',
      content: `**Dati Raccolti**

Con il tuo consenso, raccogliamo dati anonimi e aggregati su:
• Utilizzo delle funzionalità (sessioni completate, durata media)
• Performance tecnica (tempi di caricamento, errori)
• Percorsi di navigazione nell'app

**Finalità**
Migliorare l'esperienza utente e sviluppare nuove funzionalità basate su dati reali.

**Anonimizzazione**
I dati sono completamente anonimi e non possono essere ricondotti a te personalmente.

**Terze Parti**
Utilizziamo strumenti analytics con IP anonimizzato e conformi al GDPR.

**Opt-out**
Puoi revocare questo consenso in qualsiasi momento dalle impostazioni.`
    },
    notifications: {
      title: 'Notifiche e Promemoria',
      content: `**Tipologia di Notifiche**

Con il tuo consenso, ti invieremo:
• Promemoria per le sessioni di meditazione programmate
• Aggiornamenti su nuovi contenuti e percorsi
• Consigli personalizzati basati sui tuoi progressi
• Motivazioni e incoraggiamenti

**Frequenza**
Configurabile nelle impostazioni (predefinito: 1-2 volte a settimana)

**Canali**
Email e/o notifiche push (in base alle tue preferenze del dispositivo)

**Opt-out Immediato**
Puoi disattivare le notifiche in qualsiasi momento:
• Dalle impostazioni dell'app
• Dalle impostazioni del dispositivo
• Dal link "Disiscriviti" in ogni email`
    }
  };

  const consentOptions = [
    {
      id: 'dataProcessing',
      title: 'Patto di Riservatezza',
      description: 'Acconsento al trattamento dei miei dati per personalizzare l\'esperienza.',
      required: true,
      icon: '🔒'
    },
    {
      id: 'analytics',
      title: 'Evoluzione Condivisa',
      description: 'Acconsento alla raccolta di dati anonimi di utilizzo.',
      required: false,
      icon: '📊'
    },
    {
      id: 'notifications',
      title: 'Il Richiamo Gentile',
      description: 'Desidero ricevere promemoria per le pratiche.',
      required: false,
      icon: '🔔'
    }
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Privacy Info Modal */}
      {modalContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalContent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{modalContent.title}</h3>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-slate max-w-none">
                {modalContent.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h4 key={idx} className="text-lg font-bold text-slate-800 mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h4>
                    );
                  } else if (paragraph.startsWith('•')) {
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-1 text-slate-700 mb-4">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="ml-2">{item.replace('• ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return <p key={idx} className="text-slate-700 leading-relaxed mb-3">{paragraph}</p>;
                  }
                })}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setModalContent(null)}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                Ho capito
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl mb-3"
        >
          🔒
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Il Tuo Spazio Sicuro
        </h2>
        <p className="text-slate-700 text-lg max-w-lg mx-auto">
          La fiducia è il fondamento del nostro cammino insieme.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {consentOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 md:p-7 border-2 rounded-2xl transition-all duration-300 ${consents[option.id as keyof typeof consents]
              ? 'border-purple-400 bg-purple-50 shadow-lg'
              : 'border-slate-200 bg-white'
              }`}
          >
            <label className="flex items-start space-x-4 cursor-pointer">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={consents[option.id as keyof typeof consents]}
                  onChange={(e) => handleConsentChange(option.id, e.target.checked)}
                  className="w-6 h-6 text-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 border-2 border-slate-300"
                  required={option.required}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{option.icon}</span>
                    <h3 className="text-lg font-bold text-slate-800">
                      {option.title}
                      {option.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setModalContent(privacyInfoContent[option.id as keyof typeof privacyInfoContent]);
                    }}
                    className="flex-shrink-0 ml-2 p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors"
                    title="Maggiori informazioni"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-base text-slate-700 leading-relaxed">{option.description}</p>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {errors.hasError && errors.field === 'privacy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 text-red-800 border-2 border-red-200 rounded-xl text-center max-w-2xl mx-auto"
        >
          <p className="text-sm font-medium">{errors.message}</p>
        </motion.div>
      )}
    </div>
  );
});
PrivacyStepComponent.displayName = 'PrivacyStepComponent';


const VideoPlayer = memo<{ onEnd: () => void; onSkip: () => void; deviceType: string }>(({
  onEnd,
  onSkip
}) => {
  return (
    <motion.div
      key="mobile-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen flex flex-col items-center justify-center text-slate-800 overflow-hidden"
    >
      {/* Cosmos Background */}
      <CosmosBackground />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center z-10 px-6"
      >
        <div className="text-8xl mb-6 drop-shadow-sm">🌸</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 font-serif max-w-3xl mx-auto leading-tight drop-shadow-sm">
          Welcome to Coach Luminel Transformational
        </h1>
        <p className="text-xl mb-2 text-slate-700 max-w-md mx-auto leading-relaxed font-medium">
          Il tuo percorso di crescita personale e mindfulness
        </p>
        <p className="text-sm text-slate-600 mb-12 max-w-sm mx-auto uppercase tracking-widest font-semibold">
          Meditation • Wellness • Personal Growth
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="z-10"
      >
        <motion.button
          onClick={onEnd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/80 backdrop-blur-md border border-white/50 text-slate-800 px-12 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 min-w-[280px]"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">✨</span>
            <span>Inizia il tuo viaggio</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
});
VideoPlayer.displayName = 'VideoPlayer';

// --- MAIN COMPONENT ---

const getOnboardingSteps = () => [
  {
    id: 'welcome',
    type: 'intro' as const,
    title: 'Benvenuto',
    subtitle: 'Il tuo percorso inizia qui',
    icon: '🌸',
    component: WelcomeStepComponent,
    validation: null
  },
  {
    id: 'assessment',
    type: 'assessment' as const,
    title: 'Valutazione Benessere',
    subtitle: 'Come ti senti oggi?',
    icon: '📊',
    component: AssessmentStepComponent,
    validation: 'assessment'
  },
  {
    id: 'personal-info',
    type: 'personal' as const,
    title: 'Informazioni Personali',
    subtitle: 'Come preferisci essere chiamato?',
    icon: '👋',
    component: PersonalInfoStepComponent,
    validation: 'name-required'
  },
  {
    id: 'goals',
    type: 'goals' as const,
    title: 'I Tuoi Obiettivi',
    subtitle: 'Cosa vorresti migliorare?',
    icon: '🎯',
    component: GoalsStepComponent,
    validation: 'goals-required'
  },
  {
    id: 'experience',
    type: 'experience' as const,
    title: 'La Tua Esperienza',
    subtitle: 'Quanto conosci la meditazione?',
    icon: '🌱',
    component: ExperienceStepComponent,
    validation: 'experience-required'
  },
  {
    id: 'preferences',
    type: 'preferences' as const,
    title: 'Preferenze di Pratica',
    subtitle: 'Come preferisci praticare?',
    icon: '⚙️',
    component: PreferencesStepComponent,
    validation: 'preferences'
  },
  {
    id: 'privacy',
    type: 'privacy' as const,
    title: 'Privacy e Consensi',
    subtitle: 'I tuoi dati sono al sicuro',
    icon: '🔒',
    component: PrivacyStepComponent,
    validation: 'privacy-required'
  }
];

const WelcomePage = () => {
  const { navigateTo, APP_ROUTES } = useNavigation();
  const {
    user,
    profile,
    loading: authLoading,
    isAuthenticated,
    updateUserProfile,
    signOut
  } = useAuth();

  const device = useDeviceDetect();
  const { deviceType } = device;

  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({ hasError: false, message: '', retryable: false });

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [enhancedUserProfile, setEnhancedUserProfile] = useLocalStorage<EnhancedUserProfile>('enhancedUserProfile', {
    fullName: '',
    goals: [],
    experience: 'beginner',
    stressLevel: 5,
    sleepQuality: 5,
    energyLevel: 5,
    privacyConsents: {
      dataProcessing: false,
      analytics: false,
      notifications: false
    },
    sessionDuration: '10',
    preferredTime: 'morning',
    voiceGender: 'female',
    backgroundSound: 'nature'
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const onboardingSteps = getOnboardingSteps();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && profile?.fullName) {
      navigateTo(APP_ROUTES.DASHBOARD);
    }
  }, [authLoading, isAuthenticated, profile, navigateTo, APP_ROUTES.DASHBOARD]);

  // Attempt autoplay whenever component mounts or updates
  useEffect(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.log("Autoplay prevented by browser, waiting for interaction");
        });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartJourney = () => {
    setShowVideo(false);
    // Explicitly play music on user interaction (skip/start button click)
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const normalizeData = useCallback((data: any) => {
    return {
      ...enhancedUserProfile,
      ...data,
      goals: data.goals || enhancedUserProfile.goals || [],
      privacyConsents: {
        ...enhancedUserProfile.privacyConsents,
        ...(data.privacyConsents || {})
      }
    };
  }, [enhancedUserProfile]);

  const validateCurrentStep = useCallback((stepIndex: number): ErrorState => {
    const step = onboardingSteps[stepIndex];
    if (!step?.validation) return { hasError: false, message: '', retryable: false };

    let error: string | null = null;
    let field = step.id;

    switch (step.validation) {
      case 'name-required':
        error = validateUserData.fullName(enhancedUserProfile.fullName);
        field = 'personal-info';
        break;
      case 'goals-required':
        error = validateUserData.goals(enhancedUserProfile.goals);
        field = 'goals';
        break;
      case 'experience-required':
        error = validateUserData.experience(enhancedUserProfile.experience);
        field = 'experience';
        break;
      case 'privacy-required':
        error = validateUserData.privacyConsents(enhancedUserProfile.privacyConsents);
        field = 'privacy';
        break;
      case 'preferences':
        error = null;
        break;
      default:
        error = null;
    }

    return error
      ? { hasError: true, message: error, field, retryable: true }
      : { hasError: false, message: '', retryable: false };
  }, [onboardingSteps, enhancedUserProfile]);

  const handleStepUpdate = useCallback((data: any) => {
    const normalizedData = normalizeData(data);
    setEnhancedUserProfile(normalizedData);
    setErrors({ hasError: false, message: '', retryable: false });
  }, [normalizeData, setEnhancedUserProfile]);

  const handleNext = useCallback(() => {
    const validation = validateCurrentStep(currentStep);
    if (validation.hasError) {
      setErrors(validation);
      return;
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setErrors({ hasError: false, message: '', retryable: false });
    } else {
      handleComplete();
    }
  }, [currentStep, validateCurrentStep, onboardingSteps.length]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({ hasError: false, message: '', retryable: false });
    }
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    setIsComponentLoading(true);

    try {
      const finalValidation = validateCurrentStep(onboardingSteps.length - 1);
      if (finalValidation.hasError) {
        setErrors(finalValidation);
        setIsComponentLoading(false);
        return;
      }

      await updateUserProfile(enhancedUserProfile);
      localStorage.removeItem('enhancedUserProfile');
      navigateTo(APP_ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Errore durante il completamento onboarding:', error);
      setErrors({
        hasError: true,
        message: 'Si è verificato un errore durante il salvataggio. Riprova.',
        retryable: true
      });
    } finally {
      setIsComponentLoading(false);
    }
  }, [validateCurrentStep, onboardingSteps.length, updateUserProfile, enhancedUserProfile, navigateTo, APP_ROUTES.DASHBOARD]);

  if (authLoading || isComponentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luminel-champagne to-luminel-champagne">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luminel-gold-soft mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <CosmosBackground />

      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="/audio/welcome.mp3" type="audio/mp3" />
      </audio>

      {/* Audio Toggle Button */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-[60] p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all shadow-lg border border-white/20"
        title={isPlaying ? "Disattiva musica" : "Attiva musica"}
      >
        {isPlaying ? (
          <SpeakerWaveIcon className="w-6 h-6" />
        ) : (
          <SpeakerXMarkIcon className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {showVideo ? (
          <VideoPlayer
            key="video"
            onEnd={handleStartJourney}
            onSkip={handleStartJourney}
            deviceType={deviceType}
          />
        ) : (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-2/3 bg-gray-200/50 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <button
                    onClick={() => navigateTo('/login')}
                    className="text-sm font-bold text-purple-700 hover:text-purple-900 bg-white/50 hover:bg-white/80 px-4 py-1.5 rounded-full transition-colors border border-purple-100"
                  >
                    Hai già un account? Accedi
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl drop-shadow-sm">{onboardingSteps[currentStep]?.icon}</span>
                    <div>
                      <h1 className="text-lg font-bold text-slate-800">
                        {onboardingSteps[currentStep]?.title}
                      </h1>
                      <p className="text-sm text-slate-600 font-medium">
                        {onboardingSteps[currentStep]?.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-medium bg-white/40 px-3 py-1 rounded-full">
                    {currentStep + 1} di {onboardingSteps.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60"
                  >
                    {React.createElement(onboardingSteps[currentStep]?.component, {
                      onUpdate: handleStepUpdate,
                      initialData: enhancedUserProfile,
                      errors: errors
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 z-20 bg-white/60 backdrop-blur-md border-t border-white/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Indietro
                  </button>

                  <div className="flex items-center space-x-3">
                    {errors.hasError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-800 rounded-lg border border-red-200"
                      >
                        <span className="text-sm font-medium">{errors.message}</span>
                      </motion.div>
                    )}

                    <motion.button
                      onClick={handleNext}
                      disabled={isComponentLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isComponentLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Salvataggio...</span>
                        </div>
                      ) : currentStep === onboardingSteps.length - 1 ? (
                        'Completa Configurazione'
                      ) : (
                        'Continua'
                      )}
                    </motion.button>
                  </div>
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