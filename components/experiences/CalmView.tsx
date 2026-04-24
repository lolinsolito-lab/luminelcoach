import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FireIcon,
    SparklesIcon,
    PlayCircleIcon,
    PauseCircleIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { predefinedPaths, moodBasedSuggestions, Path } from './data';
import { useAuth } from '../../contexts/AuthContext';

// Colors from beta
const colors = {
    primary: "#45597E",
    secondary: "#C7D0DA",
    accent: "#399D9E",
    accentLight: "#E5F5F5",
    light: "#F7FAFA",
    textDark: "#2D3B45",
    textLight: "#687D8C",
    highlight: "#EAD19C",
    success: "#4CB19C"
};

import { useNavigate } from 'react-router-dom';

const CalmView: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [suggestedPaths, setSuggestedPaths] = useState<Path[]>([]);
    const [playingPath, setPlayingPath] = useState<string | null>(null);

    const isUnlocked = (plan: string) => {
        const userPlan = user?.plan || 'free';
        if (plan === 'free') return true;
        if (plan === 'premium' && (userPlan === 'premium' || userPlan === 'vip')) return true;
        if (plan === 'vip' && userPlan === 'vip') return true;
        return false;
    };

    const getBadgeColor = (plan: string) => {
        switch (plan) {
            case 'free': return 'bg-luminel-sage-100 text-luminel-sage-700';
            case 'premium': return 'bg-luminel-champagne text-luminel-smoke';
            case 'vip': return 'bg-luminel-gold-soft text-white';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const moods = [
        { label: "Sereno", emoji: "😌", color: "#BEE3D4" },
        { label: "Felice", emoji: "😊", color: "#F8D49B" },
        { label: "Neutro", emoji: "😐", color: "#E0EBEF" },
        { label: "Ansioso", emoji: "😰", color: "#D1DBE3" },
        { label: "Giù", emoji: "😔", color: "#C1D3E9" }
    ];

    useEffect(() => {
        if (currentMood) {
            const categories = moodBasedSuggestions[currentMood] || [];
            const paths = categories.flatMap(cat => predefinedPaths[cat] || []);
            setSuggestedPaths(paths);
        } else {
            setSuggestedPaths([...(predefinedPaths["Mindfulness"] || []), ...(predefinedPaths["Pace"] || [])]);
        }
    }, [currentMood]);

    const togglePlay = (id: string) => {
        if (playingPath === id) {
            setPlayingPath(null);
        } else {
            setPlayingPath(id);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FireIcon className="w-6 h-6 text-teal-500" />
                        Calm Space
                    </h2>
                    <p className="text-slate-500">Trova il tuo equilibrio interiore</p>
                </div>
            </div>

            {/* Mood Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-700">Come ti senti oggi?</h3>
                <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                    {moods.map((mood) => (
                        <button
                            key={mood.label}
                            onClick={() => setCurrentMood(mood.label)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all min-w-[80px] ${currentMood === mood.label
                                ? 'bg-teal-50 ring-2 ring-teal-500 scale-105'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <span className="text-3xl">{mood.emoji}</span>
                            <span className="text-sm font-medium text-slate-600">{mood.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Suggested Paths */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                    {currentMood ? `Consigliati per "${currentMood}"` : 'Suggeriti per te'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedPaths.map((path) => (
                        <motion.div
                            key={path.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={path.imageUrl}
                                    alt={path.title}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isUnlocked(path.plan) ? 'group-hover:scale-105' : 'grayscale opacity-70'}`}
                                />
                                <div className={`absolute inset-0 transition-colors ${isUnlocked(path.plan) ? 'bg-black/20 group-hover:bg-black/30' : 'bg-black/50'}`} />

                                {isUnlocked(path.plan) ? (
                                    <button
                                        onClick={() => togglePlay(path.id)}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform hover:scale-110 transition-all">
                                            {playingPath === path.id ? (
                                                <PauseCircleIcon className="w-8 h-8 text-teal-600" />
                                            ) : (
                                                <PlayCircleIcon className="w-8 h-8 text-teal-600" />
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/plans')}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <LockClosedIcon className="w-10 h-10 text-white/80 mb-2" />
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                                                Upgrade to {path.plan}
                                            </span>
                                        </div>
                                    </button>
                                )}

                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getBadgeColor(path.plan)}`}>
                                        {path.plan}
                                    </span>
                                    <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                                        {path.duration}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                                        {path.category}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{path.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2">{path.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Categories Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-700">Esplora Categorie</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(predefinedPaths).map((category) => (
                        <button
                            key={category}
                            className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all text-left"
                        >
                            <h4 className="font-bold text-slate-800">{category}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                                {predefinedPaths[category].length} percorsi
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalmView;
