import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface RecommendedItem {
    id: string;
    title: string;
    type: 'course' | 'meditation' | 'experience';
    thumbnail: string;
    plan: 'free' | 'premium' | 'vip';
    duration: string;
    category: string;
}

const RecommendedContent: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mix of free and locked content to drive conversions
    const recommended: RecommendedItem[] = [
        {
            id: 'deep-sleep',
            title: 'Sonno Profondo e Rigenerante',
            type: 'meditation',
            thumbnail: 'https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=400&q=80',
            plan: 'vip',
            duration: '20 min',
            category: 'Notte'
        },
        {
            id: 'morning-energy',
            title: 'Energia del Mattino',
            type: 'meditation',
            thumbnail: 'https://images.unsplash.com/photo-1502086223501-68119136a64b?w=400&q=80',
            plan: 'free',
            duration: '10 min',
            category: 'Mattina'
        },
        {
            id: 'stress-relief',
            title: 'Gestione Stress Avanzata',
            type: 'course',
            thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
            plan: 'premium',
            duration: '14 giorni',
            category: 'Benessere'
        },
        {
            id: 'self-love',
            title: 'Accettazione e Compassione',
            type: 'experience',
            thumbnail: 'https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=400&q=80',
            plan: 'vip',
            duration: '15 min',
            category: 'Self-Love'
        }
    ];

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

    const handleItemClick = (item: RecommendedItem) => {
        if (!isUnlocked(item.plan)) {
            navigate('/plans');
            return;
        }

        switch (item.type) {
            case 'course':
                navigate('/courses');
                break;
            case 'meditation':
            case 'experience':
                navigate('/experiences');
                break;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-luminel-gold-soft" />
                    <h2 className="text-xl font-bold text-slate-800">Consigliati per Te</h2>
                </div>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-sm font-semibold text-luminel-gold-soft hover:text-luminel-taupe transition-colors"
                >
                    Vedi Tutti →
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((item, index) => {
                    const unlocked = isUnlocked(item.plan);
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleItemClick(item)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${unlocked ? 'group-hover:scale-110' : 'grayscale opacity-60'
                                        }`}
                                />
                                <div className={`absolute inset-0 transition-all ${unlocked ? 'bg-black/20 group-hover:bg-black/30' : 'bg-black/60'
                                    }`} />

                                {/* Badges */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getBadgeColor(item.plan)}`}>
                                        {item.plan}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
                                        {item.duration}
                                    </span>
                                </div>

                                {/* Lock Overlay */}
                                {!unlocked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <LockClosedIcon className="w-10 h-10 text-white/90 mb-2" />
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                                            Unlock {item.plan}
                                        </span>
                                    </div>
                                )}

                                {/* Play Icon for unlocked */}
                                {unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                                            <PlayCircleIcon className="w-8 h-8 text-luminel-gold-soft" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                <span className="text-xs font-semibold text-luminel-gold-soft uppercase tracking-wider">
                                    {item.category}
                                </span>
                                <h3 className="font-bold text-slate-800 text-sm mt-1 line-clamp-2">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecommendedContent;
