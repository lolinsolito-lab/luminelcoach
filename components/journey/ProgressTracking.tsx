import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    FireIcon,
    TrophyIcon,
    ClockIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import { dataService, TimelineEvent, Achievement } from '../../services/DataService';

const ProgressTracking: React.FC = () => {
    const { streak, xp, level, weeklyProgress, weeklyGoal } = useProgress();
    const { user } = useAuth();

    // State for data from DataService
    const [questsCompleted, setQuestsCompleted] = useState(0);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    const totalMinutes = Math.floor(xp / 2);

    // Fetch data from Make/Sheets via DataService
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);

                // Fetch progress data (includes questsCompleted)
                const progressData = await dataService.fetchUserProgress(user.id);
                setQuestsCompleted(progressData.questsCompleted);

                // Fetch timeline events
                const timeline = await dataService.fetchTimelineEvents(user.id);
                setTimelineEvents(timeline);

                // Fetch achievements
                const achievementsList = await dataService.fetchAchievements(user.id);
                setAchievements(achievementsList);
            } catch (error) {
                console.error('Error fetching progress data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">
                    Il Tuo Progresso
                </h1>
                <p className="text-lg text-slate-600">
                    Segui la tua evoluzione trasformazionale
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <FireIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Current Streak</p>
                            <p className="text-2xl font-bold text-slate-800">{streak} giorni</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-luminel-champagne flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-luminel-gold-soft" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Tempo Totale</p>
                            <p className="text-2xl font-bold text-slate-800">{totalMinutes} min</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                            <TrophyIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Quest Completate</p>
                            <p className="text-2xl font-bold text-slate-800">{questsCompleted}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-luminel-champagne flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6 text-luminel-gold-soft" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Livello</p>
                            <p className="text-2xl font-bold text-slate-800">{level}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Weekly Goal */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-12"
            >
                <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Obiettivo Settimanale</h3>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600">Sessioni di Meditazione</span>
                    <span className="font-bold text-luminel-gold-soft">{weeklyProgress}/{weeklyGoal}</span>
                </div>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark"
                    />
                </div>
            </motion.div>

            {/* Timeline Visuale */}
            <div className="mb-12">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">La Tua Timeline</h3>
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Caricamento timeline...</div>
                ) : timelineEvents.length > 0 ? (
                    <div className="space-y-4">
                        {timelineEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="relative pl-8 pb-8 border-l-2 border-luminel-champagne last:border-0 last:pb-0"
                            >
                                <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-champagne flex items-center justify-center text-white shadow-md">
                                    <span className="text-xs">{event.icon}</span>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-serif font-bold text-slate-800">{event.title}</h4>
                                        <span className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    {event.progress !== undefined && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                <span>Progresso</span>
                                                <span>{event.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark"
                                                    style={{ width: `${event.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">Nessun evento nella timeline</div>
                )}
            </div>

            {/* Achievements */}
            <div>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">I Tuoi Traguardi</h3>
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Caricamento achievements...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {achievements.map((achievement, idx) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + idx * 0.1 }}
                                className={`rounded-2xl p-6 border shadow-sm text-center ${achievement.unlocked
                                        ? 'bg-white border-slate-100'
                                        : 'bg-slate-50 border-slate-100 opacity-50'
                                    }`}
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${achievement.unlocked
                                        ? achievement.icon === 'fire' ? 'bg-gradient-to-br from-amber-100 to-amber-50' :
                                            achievement.icon === 'trophy' ? 'bg-gradient-to-br from-green-100 to-green-50' :
                                                'bg-gradient-to-br from-purple-100 to-purple-50'
                                        : 'bg-slate-100'
                                    }`}>
                                    {achievement.icon === 'fire' ? <FireIcon className={`w-8 h-8 ${achievement.unlocked ? 'text-amber-600' : 'text-slate-400'}`} /> :
                                        achievement.icon === 'trophy' ? <TrophyIcon className={`w-8 h-8 ${achievement.unlocked ? 'text-green-600' : 'text-slate-400'}`} /> :
                                            <SparklesIcon className={`w-8 h-8 ${achievement.unlocked ? 'text-purple-600' : 'text-slate-400'}`} />}
                                </div>
                                <h4 className={`font-serif font-bold mb-1 ${achievement.unlocked ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {achievement.title}
                                </h4>
                                <p className={`text-sm ${achievement.unlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {achievement.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressTracking;
