import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoonIcon,
    MagnifyingGlassIcon,
    PlayCircleIcon,
    ClockIcon,
    LockClosedIcon,
    SparklesIcon,
    HeartIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { MoonIcon as MoonSolid } from '@heroicons/react/24/solid';
import { meditationData, goals, durations, Meditation } from './data';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MeditationView: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [filteredMeditations, setFilteredMeditations] = useState<Meditation[]>(meditationData);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const isUnlocked = (plan: string) => {
        const userPlan = user?.plan || 'free';
        if (plan === 'free') return true;
        if (plan === 'premium' && (userPlan === 'premium' || userPlan === 'vip')) return true;
        if (plan === 'vip' && userPlan === 'vip') return true;
        return false;
    };

    const getBadgeStyle = (plan: string) => {
        switch (plan) {
            case 'free':
                return 'bg-gradient-to-r from-emerald-100 to-green-50 text-emerald-700 border border-emerald-200';
            case 'premium':
                return 'bg-gradient-to-r from-luminel-champagne to-luminel-gold-soft/50 text-luminel-taupe border border-luminel-gold-soft';
            case 'vip':
                return 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white border border-luminel-gold-dark shadow-lg';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    useEffect(() => {
        let filtered = meditationData;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                m.title.toLowerCase().includes(query) ||
                m.description.toLowerCase().includes(query)
            );
        }

        if (selectedGoal) {
            filtered = filtered.filter(m => m.goals.includes(selectedGoal));
        }

        if (selectedDuration) {
            filtered = filtered.filter(m => m.duration === selectedDuration);
        }

        setFilteredMeditations(filtered);
    }, [searchQuery, selectedGoal, selectedDuration]);

    return (
        <div className="space-y-10 pb-24 relative">
            {/* Background Decorative Elements */}
            <div className="fixed top-20 right-10 w-[400px] h-[400px] bg-luminel-gold-soft/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="fixed bottom-20 left-10 w-[300px] h-[300px] bg-luminel-champagne/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                        <MoonSolid className="w-9 h-9 text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-1">
                            Meditation Studio
                        </h2>
                        <p className="text-lg text-slate-600 font-light">Coltiva pace interiore e presenza</p>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative w-full md:w-80"
                >
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca meditazione..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-luminel-gold-soft focus:border-luminel-gold-soft transition-all shadow-sm text-slate-800 placeholder:text-slate-400"
                    />
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 relative z-10"
            >
                {/* Goals Filter */}
                <div>
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-luminel-gold-soft" />
                        Obiettivo
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                        {goals.map((goal) => {
                            const Icon = goal.icon;
                            const isSelected = selectedGoal === goal.id;
                            return (
                                <motion.button
                                    key={goal.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedGoal(isSelected ? null : goal.id)}
                                    className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.25rem] border-2 transition-all whitespace-nowrap font-semibold shadow-sm ${isSelected
                                            ? 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white border-luminel-gold-dark shadow-lg shadow-luminel-gold-soft/40'
                                            : 'bg-white/90 backdrop-blur-sm text-slate-700 border-slate-200 hover:border-luminel-gold-soft hover:shadow-md'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">{goal.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Duration Filter */}
                <div>
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-luminel-gold-soft" />
                        Durata
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                        {durations.map((duration) => (
                            <motion.button
                                key={duration.value}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDuration(selectedDuration === duration.value ? null : duration.value)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-sm ${selectedDuration === duration.value
                                        ? 'bg-luminel-champagne text-luminel-taupe border-2 border-luminel-gold-soft/50'
                                        : 'bg-white/70 backdrop-blur-sm text-slate-600 border-2 border-transparent hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                {duration.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Results Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredMeditations.map((meditation, index) => (
                        <motion.div
                            key={meditation.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            onHoverStart={() => setHoveredCard(meditation.id)}
                            onHoverEnd={() => setHoveredCard(null)}
                            className={`group relative overflow-hidden rounded-[2rem] border-2 transition-all duration-300 cursor-pointer ${isUnlocked(meditation.plan)
                                    ? 'bg-white/90 backdrop-blur-sm border-slate-100 hover:shadow-2xl hover:scale-[1.02]'
                                    : 'bg-white/60 backdrop-blur-sm border-slate-200 opacity-75'
                                }`}
                            onClick={() => !isUnlocked(meditation.plan) && navigate('/plans')}
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-luminel-champagne/30 to-luminel-gold-soft/20">
                                {/* TODO: Image will be loaded from Google Drive via Make/Sheets */}
                                {meditation.image ? (
                                    <img
                                        src={meditation.image}
                                        alt={meditation.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-6xl opacity-40">{meditation.icon}</div>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Plan Badge - Top Right */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg ${getBadgeStyle(meditation.plan)}`}>
                                        {meditation.plan === 'free' ? '🌟 Free' : meditation.plan === 'premium' ? '⭐ Premium' : '👑 VIP'}
                                    </span>
                                </div>

                                {/* Duration - Bottom Left */}
                                <div className="absolute bottom-4 left-4">
                                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                                        <ClockIcon className="w-4 h-4 text-slate-600" />
                                        <span className="text-sm font-bold text-slate-800">{meditation.duration}</span>
                                    </div>
                                </div>

                                {/* Lock Overlay */}
                                {!isUnlocked(meditation.plan) && (
                                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                                        <div className="bg-white/90 rounded-2xl p-6 text-center shadow-2xl">
                                            <LockClosedIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-slate-700">Contenuto Bloccato</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Category Badge */}
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 text-xs font-bold text-purple-700 bg-purple-50 rounded-lg border border-purple-100">
                                        {meditation.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2 group-hover:text-luminel-gold-soft transition-colors leading-tight">
                                    {meditation.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                    {meditation.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        <HeartIcon className="w-4 h-4 text-pink-400" />
                                        <span className="text-xs font-medium text-slate-500">
                                            {meditation.goals.length} obiettivi
                                        </span>
                                    </div>

                                    {isUnlocked(meditation.plan) ? (
                                        <motion.div
                                            animate={{
                                                scale: hoveredCard === meditation.id ? 1.1 : 1
                                            }}
                                            className="w-12 h-12 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-dark flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all"
                                        >
                                            <PlayCircleIcon className="w-7 h-7 text-white" />
                                        </motion.div>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-400 uppercase">Upgrade</span>
                                    )}
                                </div>
                            </div>

                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-luminel-gold-soft/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredMeditations.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 relative z-10"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <MoonIcon className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-700 mb-2">Nessuna meditazione trovata</h3>
                    <p className="text-slate-500 mb-6">Prova a modificare i filtri di ricerca</p>
                    <button
                        onClick={() => {
                            setSelectedGoal(null);
                            setSelectedDuration(null);
                            setSearchQuery('');
                        }}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        Resetta Filtri
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default MeditationView;

/* 
 * DATA INTEGRATION NOTES:
 * 
 * 1. Images from Google Drive:
 *    - Each meditation object should have: image: "https://drive.google.com/uc?id=FILE_ID"
 *    - Load via Make.com scenario that fetches from Google Sheets
 *    - Fallback to emoji icon if image not available
 * 
 * 2. Google Sheets Structure:
 *    Tab: meditations
 *    Columns: id, title, description, duration, category, plan, goals (comma-separated), image_url, icon
 * 
 * 3. Make.com Scenario:
 *    - Webhook trigger (GET /meditations)
 *    - Google Sheets: Search rows
 *    - Response: JSON array of meditation objects
 * 
 * 4. Implementation:
 *    - Replace meditationData import with API call to Make webhook
 *    - Add loading state while fetching
 *    - Cache results in localStorage for offline support
 */
