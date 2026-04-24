import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface ActiveCourse {
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    plan: 'free' | 'premium' | 'vip';
    lastWatched: string;
    totalLessons: number;
    completedLessons: number;
}

const ActiveCourses: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock active courses - in real app would come from user progress
    const activeCourses: ActiveCourse[] = [
        {
            id: 'mindfulness-intro',
            title: 'Introduzione alla Mindfulness',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
            progress: 65,
            plan: 'free',
            lastWatched: '2 giorni fa',
            totalLessons: 12,
            completedLessons: 8
        },
        {
            id: 'stress-management',
            title: 'Gestione dello Stress Avanzata',
            thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
            progress: 30,
            plan: 'premium',
            lastWatched: '1 settimana fa',
            totalLessons: 15,
            completedLessons: 5
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

    if (activeCourses.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
                <div className="text-center">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Inizia il tuo primo corso</h3>
                    <p className="text-slate-500 mb-6">Esplora la nostra libreria di corsi e inizia il tuo percorso</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-6 py-3 bg-luminel-gold-soft text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Esplora Corsi
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">I Tuoi Corsi in Corso</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-sm font-semibold text-luminel-gold-soft hover:text-luminel-taupe transition-colors"
                >
                    Vedi Tutti →
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCourses.map((course, index) => {
                    const unlocked = isUnlocked(course.plan);
                    return (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className={`w-full h-full object-cover transition-transform duration-300 ${unlocked ? 'group-hover:scale-105' : 'grayscale opacity-70'
                                        }`}
                                />
                                <div className={`absolute inset-0 ${unlocked ? 'bg-black/20' : 'bg-black/50'}`} />

                                {/* Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getBadgeColor(course.plan)}`}>
                                        {course.plan}
                                    </span>
                                </div>

                                {/* Lock Overlay */}
                                {!unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <LockClosedIcon className="w-10 h-10 text-white/80 mb-2 mx-auto" />
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                                                Upgrade to {course.plan}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{course.title}</h3>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                        <span>{course.completedLessons}/{course.totalLessons} lezioni</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="h-full bg-gradient-to-r from-luminel-gold-soft to-luminel-taupe rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">Ultimo: {course.lastWatched}</span>
                                    {unlocked ? (
                                        <button
                                            onClick={() => navigate(`/courses/${course.id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-luminel-gold-soft text-white text-xs font-semibold rounded-full hover:shadow-md transition-all"
                                        >
                                            <PlayCircleIcon className="w-4 h-4" />
                                            Continua
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/plans')}
                                            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full hover:bg-slate-200 transition-all"
                                        >
                                            Sblocca
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveCourses;
