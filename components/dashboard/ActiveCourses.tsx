import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon, LockClosedIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
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
    nextLessonTitle: string;
    nextLessonDuration: string;
    quote?: string;
}

const ActiveCourses: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Mock active courses - in real app would come from user progress
    const activeCourses: ActiveCourse[] = [
        {
            id: 'mindfulness-intro',
            title: 'Introduzione alla Mindfulness',
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
            progress: 65,
            plan: 'free',
            lastWatched: '2 giorni fa',
            totalLessons: 12,
            completedLessons: 8,
            nextLessonTitle: 'Il Potere del Respiro Consapevole',
            nextLessonDuration: '15 min',
            quote: 'Il respiro è l\'ancora che ci riporta al momento presente.'
        },
        {
            id: 'stress-management',
            title: 'Gestione dello Stress Avanzata',
            thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
            progress: 30,
            plan: 'premium',
            lastWatched: '1 settimana fa',
            totalLessons: 15,
            completedLessons: 5,
            nextLessonTitle: 'Riconoscere i Trigger Emotivi',
            nextLessonDuration: '20 min'
        }
    ];

    const isUnlocked = (plan: string) => {
        const userPlan = user?.plan || 'free';
        if (plan === 'free') return true;
        if (plan === 'premium' && (userPlan === 'premium' || userPlan === 'vip')) return true;
        if (plan === 'vip' && userPlan === 'vip') return true;
        return false;
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

    const heroCourse = activeCourses[0];
    const otherCourses = activeCourses.slice(1);
    const heroUnlocked = isUnlocked(heroCourse.plan);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    Continua il Tuo Percorso
                </h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-sm font-semibold text-luminel-gold-soft hover:text-luminel-taupe transition-colors"
                >
                    Vedi Tutti →
                </button>
            </div>

            {/* HERO CARD - Main Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-auto lg:max-h-[300px] overflow-hidden">
                        <img
                            src={heroCourse.thumbnail}
                            alt={heroCourse.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ${heroUnlocked ? 'group-hover:scale-105' : 'grayscale opacity-70'}`}
                        />
                        <div className={`absolute inset-0 ${heroUnlocked ? 'bg-gradient-to-r from-black/60 to-transparent' : 'bg-black/50'}`} />

                        {/* Play Button Overlay */}
                        {heroUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-12">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(`/courses/${heroCourse.id}`)}
                                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:bg-white/30 transition-all"
                                >
                                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                                </motion.button>
                            </div>
                        )}

                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 uppercase tracking-wider">
                                In Corso
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-white to-luminel-champagne/20">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-luminel-gold-soft text-sm font-bold uppercase tracking-wider mb-2">
                                <SparklesIcon className="w-4 h-4" />
                                Prossima Lezione
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2 leading-tight">
                                {heroCourse.nextLessonTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-slate-500 text-sm">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-4 h-4" />
                                    {heroCourse.nextLessonDuration}
                                </span>
                                <span>•</span>
                                <span>{heroCourse.title}</span>
                            </div>
                        </div>

                        {heroCourse.quote && (
                            <div className="mb-8 p-4 bg-luminel-champagne/30 rounded-xl border border-luminel-taupe/10 italic text-slate-600 text-sm">
                                "{heroCourse.quote}"
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-slate-700">Il tuo progresso</span>
                                <span className="text-luminel-gold-soft">{heroCourse.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${heroCourse.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-luminel-gold-soft to-luminel-taupe rounded-full relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => navigate(`/courses/${heroCourse.id}`)}
                                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <PlayCircleIcon className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                Riprendi Lezione
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Other Active Courses (Grid) */}
            {otherCourses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {otherCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{course.title}</h4>
                                <p className="text-xs text-slate-500 mb-2">Prossima: {course.nextLessonTitle}</p>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-luminel-gold-soft rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-luminel-champagne hover:text-luminel-gold-soft transition-colors">
                                <PlayIcon className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveCourses;
