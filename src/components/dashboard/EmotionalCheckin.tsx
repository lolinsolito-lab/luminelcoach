import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotionalState, EmotionalState } from '../../contexts/EmotionalStateContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EmotionalOption {
    id: EmotionalState;
    label: string;
    emoji: string;
    color: string;
    bgGradient: string;
    message: string;
}

const EmotionalCheckin: React.FC = () => {
    const { setEmotionalState, hasCheckedInToday } = useEmotionalState();
    const [selectedState, setSelectedState] = useState<EmotionalState>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // Don't show if already checked in today or dismissed
    if (hasCheckedInToday || isDismissed) {
        return null;
    }

    const emotionalOptions: EmotionalOption[] = [
        {
            id: 'alegre',
            label: 'Alegre',
            emoji: '😊',
            color: 'text-yellow-600',
            bgGradient: 'from-yellow-50 to-orange-50',
            message: 'Che meraviglia! Sfruttiamo questa energia positiva con contenuti energizzanti!'
        },
        {
            id: 'ispirato',
            label: 'Ispirato',
            emoji: '✨',
            color: 'text-purple-600',
            bgGradient: 'from-purple-50 to-pink-50',
            message: 'Fantastico! Ti suggerirò contenuti creativi per alimentare la tua ispirazione!'
        },
        {
            id: 'calmo',
            label: 'Calmo',
            emoji: '😌',
            color: 'text-green-600',
            bgGradient: 'from-green-50 to-emerald-50',
            message: 'Perfetto. Manteniamo questo stato di serenità con pratiche rilassanti.'
        },
        {
            id: 'ansioso',
            label: 'Ansioso',
            emoji: '😰',
            color: 'text-orange-600',
            bgGradient: 'from-orange-50 to-red-50',
            message: 'Ti capisco. Ho preparato tecniche di respirazione e mindfulness per te.'
        },
        {
            id: 'depresso',
            label: 'Depresso',
            emoji: '😔',
            color: 'text-gray-600',
            bgGradient: 'from-gray-50 to-slate-100',
            message: 'Sei coraggioso a riconoscerlo. Ti guiderò verso pratiche di auto-compassione.'
        },
        {
            id: 'stanco',
            label: 'Stanco',
            emoji: '😴',
            color: 'text-blue-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            message: 'Riposo e rigenerazione. Ti suggerirò meditazioni per il sonno e rilassamento.'
        },
        {
            id: 'triste',
            label: 'Triste',
            emoji: '😢',
            color: 'text-cyan-600',
            bgGradient: 'from-cyan-50 to-blue-100',
            message: 'Va bene sentirsi così. Praticheremo insieme tecniche per sollevare lo spirito.'
        }
    ];

    const handleStateSelect = (state: EmotionalState) => {
        setSelectedState(state);
        setEmotionalState(state);
        setShowConfirmation(true);

        // Auto-hide confirmation after 4 seconds
        setTimeout(() => {
            setShowConfirmation(false);
        }, 4000);
    };

    const handleDismiss = () => {
        setIsDismissed(true);
    };

    const selectedOption = emotionalOptions.find(opt => opt.id === selectedState);

    return (
        <AnimatePresence>
            {!showConfirmation ? (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative bg-gradient-to-br from-white to-luminel-champagne rounded-3xl p-6 md:p-8 shadow-lg border border-luminel-gold-soft/20 overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-luminel-gold-soft/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-luminel-champagne rounded-full blur-2xl -ml-16 -mb-16" />

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
                    >
                        <XMarkIcon className="w-5 h-5 text-slate-400" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="text-4xl mb-3"
                            >
                                💭
                            </motion.div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Come ti senti oggi?
                            </h2>
                            <p className="text-slate-600">
                                Scegli il tuo stato emotivo per personalizzare la tua esperienza
                            </p>
                        </div>

                        {/* Emotional States Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-5xl mx-auto">
                            {emotionalOptions.map((option, index) => (
                                <motion.button
                                    key={option.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStateSelect(option.id)}
                                    className={`relative p-4 rounded-2xl bg-gradient-to-br ${option.bgGradient} border-2 border-transparent hover:border-luminel-gold-soft transition-all group`}
                                >
                                    {/* Emoji */}
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                        {option.emoji}
                                    </div>

                                    {/* Label */}
                                    <div className={`text-sm font-semibold ${option.color}`}>
                                        {option.label}
                                    </div>

                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-luminel-gold-soft/0 group-hover:bg-luminel-gold-soft/5 transition-all" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Helper text */}
                        <p className="text-xs text-slate-400 text-center mt-6">
                            Puoi cambiare il tuo stato emotivo domani
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`relative bg-gradient-to-br ${selectedOption?.bgGradient} rounded-3xl p-8 shadow-lg border-2 border-luminel-gold-soft overflow-hidden`}
                >
                    {/* Success Animation */}
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-6xl mb-4"
                        >
                            {selectedOption?.emoji}
                        </motion.div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            Grazie per aver condiviso!
                        </h3>

                        <p className={`text-lg font-medium ${selectedOption?.color} mb-4`}>
                            {selectedOption?.message}
                        </p>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 4 }}
                            className="h-1 bg-luminel-gold-soft rounded-full mx-auto max-w-xs"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmotionalCheckin;
