import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useEmotionalState } from '../../contexts/EmotionalStateContext';
import { AIInsightsEngine, AIInsight } from '../../utils/aiInsights';
import { useZenAudio } from '../../hooks/useZenAudio';

const AICompanion: React.FC = () => {
    const { user } = useAuth();
    const { currentState } = useEmotionalState();
    const { playSubtle } = useZenAudio();
    const [isVisible, setIsVisible] = useState(false);
    const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Show companion after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
            playSubtle();
        }, 3000);

        return () => clearTimeout(timer);
    }, [playSubtle]);

    useEffect(() => {
        // Generate insight based on user data
        if (isVisible) {
            const insight = AIInsightsEngine.getTopInsight({
                emotionalState: currentState,
                streak: user?.streak || 0,
                completedCourses: 2,
                favoriteTime: 'morning'
            });
            setCurrentInsight(insight);
        }
    }, [isVisible, currentState, user]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
        playSubtle();
    };

    if (!isVisible || !currentInsight) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed bottom-6 right-6 z-50"
            >
                {/* Collapsed State: Floating Avatar */}
                {!isExpanded && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleExpand}
                        className="relative cursor-pointer group"
                    >
                        {/* Pulsing Ring */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.2, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentInsight.color} opacity-30 blur-md`}
                        />

                        {/* Avatar */}
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-champagne shadow-xl flex items-center justify-center border-2 border-white">
                            {/* Breathing Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-3xl"
                            >
                                🪷
                            </motion.div>

                            {/* Notification Dot */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-full h-full bg-red-500 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                                Ho un messaggio per te
                                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Expanded State: Message Card */}
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`relative w-80 bg-gradient-to-br ${currentInsight.color} rounded-3xl p-6 shadow-2xl border border-white/30`}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />

                        {/* Header */}
                        <div className="relative flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">🪷</div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Luminel AI</h3>
                                    <p className="text-white/80 text-xs capitalize">{currentInsight.type}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Message */}
                        <div className="relative mb-4">
                            <div className="flex items-start gap-2">
                                <span className="text-2xl">{currentInsight.icon}</span>
                                <p className="text-white font-medium leading-relaxed">
                                    {currentInsight.message}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="relative flex gap-2">
                            <button
                                onClick={handleToggleExpand}
                                className="flex-1 py-2 bg-white/90 hover:bg-white text-slate-800 font-semibold rounded-xl transition-all"
                            >
                                Grazie!
                            </button>
                            <button
                                onClick={() => {
                                    // Navigate to relevant content
                                    handleToggleExpand();
                                }}
                                className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl backdrop-blur-sm transition-all"
                            >
                                Vai
                            </button>
                        </div>

                        {/* Minimize hint */}
                        <div className="relative mt-3 text-center">
                            <button
                                onClick={handleToggleExpand}
                                className="text-white/60 text-xs hover:text-white/90 transition-colors"
                            >
                                Minimizza
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default AICompanion;
