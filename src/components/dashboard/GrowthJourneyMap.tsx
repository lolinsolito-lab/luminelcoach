import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface Milestone {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    completed: boolean;
    icon: string;
    x: number;
    y: number;
}

const GrowthJourneyMap: React.FC = () => {
    const { user } = useAuth();
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

    const milestones: Milestone[] = [
        { id: 'first-meditation', title: 'Prima Meditazione', description: 'Hai completato la tua prima sessione di meditazione guidata', level: 'beginner', completed: true, icon: '🌱', x: 300, y: 450 },
        { id: '7-day-streak', title: '7 Giorni Consecutivi', description: 'Hai meditato per 7 giorni di fila', level: 'beginner', completed: true, icon: '🔥', x: 250, y: 380 },
        { id: 'first-course', title: 'Primo Corso Completato', description: 'Hai terminato il tuo primo percorso di crescita', level: 'beginner', completed: true, icon: '📚', x: 350, y: 380 },
        { id: '30-day-transform', title: '30 Giorni di Trasformazione', description: 'Un mese intero di pratica costante', level: 'intermediate', completed: false, icon: '👑', x: 200, y: 280 },
        { id: 'mindfulness-master', title: 'Maestro di Mindfulness', description: 'Hai completato 3 corsi avanzati', level: 'intermediate', completed: false, icon: '🧘', x: 300, y: 250 },
        { id: 'community-helper', title: 'Pilastro della Community', description: 'Hai aiutato 10 altri membri', level: 'intermediate', completed: false, icon: '💖', x: 400, y: 280 },
        { id: 'zen-master', title: 'Maestro Zen', description: '100 giorni di pratica ininterrotta', level: 'advanced', completed: false, icon: '🏔️', x: 250, y: 150 },
        { id: 'transformation-complete', title: 'Trasformazione Completa', description: 'Hai raggiunto tutti i tuoi obiettivi iniziali', level: 'advanced', completed: false, icon: '✨', x: 350, y: 120 }
    ];

    const completedCount = milestones.filter(m => m.completed).length;
    const progress = (completedCount / milestones.length) * 100;

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return '#10b981';
            case 'intermediate': return '#D6C29B';
            case 'advanced': return '#8b5cf6';
            default: return '#64748b';
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress badge */}
            <div className="flex justify-end">
                <div className="px-4 py-2 bg-luminel-champagne rounded-full border border-luminel-gold-soft/30">
                    <span className="text-sm font-bold text-luminel-smoke">{completedCount}/{milestones.length} Milestone</span>
                </div>
            </div>

            {/* SVG Tree */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-white to-luminel-champagne/30 rounded-3xl p-6 shadow-sm border border-slate-100">
                <svg viewBox="0 0 600 500" className="w-full h-auto" style={{ minHeight: '350px', maxHeight: '550px' }} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e0f2fe" />
                            <stop offset="100%" stopColor="#f0fdf4" />
                        </linearGradient>
                    </defs>
                    <rect width="600" height="500" fill="url(#skyGradient)" />
                    <motion.path d="M 280 500 Q 285 450, 290 400 L 310 400 Q 315 450, 320 500 Z" fill="#78350f" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
                    {milestones.map((milestone, index) => milestone.level !== 'beginner' && (
                        <motion.line key={`branch-${milestone.id}`} x1="300" y1="400" x2={milestone.x} y2={milestone.y}
                            stroke={milestone.completed ? getLevelColor(milestone.level) : '#cbd5e1'} strokeWidth={milestone.completed ? 4 : 2}
                            opacity={milestone.completed ? 1 : 0.3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: index * 0.1 }} />
                    ))}
                    <motion.path d="M 240 400 Q 180 300, 200 200 Q 220 150, 250 140 Q 280 100, 300 80 Q 320 100, 350 140 Q 380 150, 400 200 Q 420 300, 360 400 Z"
                        fill={`rgba(16, 185, 129, ${progress / 400})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} />
                    <motion.circle cx="250" cy="150" r="50" fill="#10b981" opacity="0.2" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                    <motion.circle cx="350" cy="120" r="60" fill="#10b981" opacity="0.2" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity }} />
                    <motion.circle cx="300" cy="180" r="55" fill="#10b981" opacity="0.2" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4.5, repeat: Infinity }} />
                    {milestones.map((milestone, index) => (
                        <g key={milestone.id}>
                            <motion.circle cx={milestone.x} cy={milestone.y} r="28" fill="white" stroke={getLevelColor(milestone.level)} strokeWidth="4"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1, type: "spring" }}
                                className="cursor-pointer" onClick={() => setSelectedMilestone(milestone)} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }} />
                            <text x={milestone.x} y={milestone.y + 8} textAnchor="middle" fontSize="22" className="cursor-pointer select-none pointer-events-none">
                                {milestone.completed ? '✓' : '🔒'}
                            </text>
                            <motion.text x={milestone.x} y={milestone.y - 38} textAnchor="middle" fontSize="30"
                                initial={{ y: milestone.y - 28, opacity: 0 }} animate={{ y: milestone.y - 38, opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }} className="pointer-events-none">{milestone.icon}</motion.text>
                        </g>
                    ))}
                    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <text x="300" y="480" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#D6C29B">↑ Sei qui</text>
                    </motion.g>
                </svg>
            </motion.div>

            {/* Details Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Milestone</h3>
                <AnimatePresence mode="wait">
                    {selectedMilestone ? (
                        <motion.div key={selectedMilestone.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                            <div className="text-5xl text-center mb-3">{selectedMilestone.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">{selectedMilestone.title}</h4>
                                <p className="text-sm text-slate-500">{selectedMilestone.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                                    style={{ backgroundColor: `${getLevelColor(selectedMilestone.level)}20`, color: getLevelColor(selectedMilestone.level) }}>
                                    {selectedMilestone.level}
                                </span>
                                {selectedMilestone.completed ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                        <CheckCircleIcon className="w-4 h-4" />Completata
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-slate-400 text-sm">
                                        <LockClosedIcon className="w-4 h-4" />Bloccata
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 py-12">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Tocca una milestone<br />per vedere i dettagli</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Progress Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700">Progresso Totale</span>
                    <span className="text-sm font-bold text-luminel-gold-soft">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-green-400 via-luminel-gold-soft to-purple-400 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
};

export default GrowthJourneyMap;
