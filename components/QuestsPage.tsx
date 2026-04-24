import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    RocketLaunchIcon,
    SparklesIcon,
    LockClosedIcon,
    ClockIcon,
    ChartBarIcon,
    HeartIcon,
    LightBulbIcon,
    BoltIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Quest {
    id: string;
    title: string;
    description: string;
    duration: number;
    timePerDay: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    icon: React.ReactNode;
    gradient: string;
    progress?: number;
    locked?: boolean;
}

const QuestsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const quests: Quest[] = [
        {
            id: 'featured',
            title: 'The Art of Mindful Living',
            description: 'Un percorso di 21 giorni per trasformare le tue abitudini quotidiane e coltivare la pace interiore attraverso pratiche di mindfulness.',
            duration: 21,
            timePerDay: '15-20 min',
            difficulty: 'Beginner',
            category: 'Mindfulness',
            icon: <HeartIcon className="w-6 h-6" />,
            gradient: 'from-luminel-gold-soft to-luminel-champagne',
            progress: 0
        },
        {
            id: 'emotional-intelligence',
            title: 'Emotional Intelligence Mastery',
            description: 'Sviluppa la tua intelligenza emotiva per relazioni più profonde e una leadership autentica.',
            duration: 14,
            timePerDay: '20-25 min',
            difficulty: 'Intermediate',
            category: 'Leadership',
            icon: <LightBulbIcon className="w-6 h-6" />,
            gradient: 'from-[#93C5FD] to-[#DBEAFE]',
            progress: 35
        },
        {
            id: 'energy-vitality',
            title: 'Energy & Vitality Renewal',
            description: 'Ricarica il tuo corpo e la tua mente con pratiche di respirazione, movimento e nutrizione consapevole.',
            duration: 7,
            timePerDay: '10-15 min',
            difficulty: 'Beginner',
            category: 'Health',
            icon: <BoltIcon className="w-6 h-6" />,
            gradient: 'from-[#6EE7B7] to-[#D1FAE5]',
            progress: 0
        },
        {
            id: 'authentic-communication',
            title: 'Authentic Communication',
            description: 'Impara a comunicare con autenticità e presenza per costruire relazioni significative.',
            duration: 10,
            timePerDay: '15 min',
            difficulty: 'Intermediate',
            category: 'Relationships',
            icon: <ChartBarIcon className="w-6 h-6" />,
            gradient: 'from-[#DDA0DD] to-[#FAF5FF]',
            progress: 60
        },
        {
            id: 'leadership-presence',
            title: 'Leadership Through Presence',
            description: 'Diventa un leader più consapevole e influente attraverso la pratica della presenza.',
            duration: 30,
            timePerDay: '20-30 min',
            difficulty: 'Advanced',
            category: 'Leadership',
            icon: <RocketLaunchIcon className="w-6 h-6" />,
            gradient: 'from-[#FDBA74] to-[#FED7AA]',
            locked: true
        }
    ];

    const categories = ['All', 'Mindfulness', 'Leadership', 'Health', 'Relationships'];

    const filteredQuests = selectedCategory === 'All'
        ? quests
        : quests.filter(q => q.category === selectedCategory);

    const activeQuests = quests.filter(q => q.progress && q.progress > 0);

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-luminel-champagne/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-luminel-gold-soft/10 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">
                    Le Tue Quest Trasformazionali
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                    Percorsi guidati per sbloccare il tuo pieno potenziale e vivere la tua migliore versione
                </p>
            </motion.div>

            {/* Active Quests Section */}
            {activeQuests.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">Le Tue Quest Attive</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeQuests.map((quest, idx) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${quest.gradient} flex items-center justify-center text-white shadow-md`}>
                                        {quest.icon}
                                    </div>
                                    <span className="text-xs font-bold text-luminel-gold-soft bg-luminel-champagne/30 px-3 py-1 rounded-full">
                                        {quest.progress}% Completato
                                    </span>
                                </div>
                                <h3 className="font-serif font-bold text-lg text-slate-800 mb-2">{quest.title}</h3>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${quest.gradient} transition-all duration-500`}
                                        style={{ width: `${quest.progress}%` }}
                                    />
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white rounded-xl font-bold hover:shadow-lg hover:shadow-luminel-gold-soft/30 transition-all">
                                    Continua Quest
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Featured Quest */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-luminel-gold-soft via-luminel-champagne to-luminel-gold-soft/80 p-8 md:p-12 mb-12 shadow-xl shadow-luminel-gold-soft/20 border border-white/50"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-luminel-gold-dark/10 rounded-full -ml-20 -mb-20 blur-3xl" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-slate-800 text-sm font-bold mb-6 shadow-sm">
                        <SparklesIcon className="w-4 h-4" />
                        QUEST IN EVIDENZA
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        The Art of Mindful Living
                    </h2>
                    <p className="text-white/95 text-lg mb-6 leading-relaxed">
                        Un viaggio di 21 giorni per trasformare le tue abitudini quotidiane e coltivare la pace interiore attraverso pratiche di mindfulness profonde e accessibili.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold shadow-sm">
                                21
                            </div>
                            <span className="text-sm font-medium">Giorni</span>
                        </div>
                        <div className="w-px h-6 bg-white/30" />
                        <div className="text-white text-sm font-medium">Beginner Friendly</div>
                        <div className="w-px h-6 bg-white/30" />
                        <div className="text-white text-sm font-medium">15-20 min/giorno</div>
                    </div>

                    <button className="px-10 py-4 bg-white text-slate-800 rounded-2xl font-bold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2">
                        <RocketLaunchIcon className="w-5 h-5" />
                        Inizia il Tuo Viaggio
                    </button>
                </div>
            </motion.div>

            {/* Quest Categories */}
            <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Esplora per Categoria</h3>
                <div className="flex flex-wrap gap-3">
                    {categories.map((category, idx) => (
                        <motion.button
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white shadow-lg shadow-luminel-gold-soft/30'
                                    : 'bg-white text-slate-700 border border-slate-100 hover:shadow-md'
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuests.slice(1).map((quest, i) => (
                    <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group ${quest.locked ? 'opacity-75' : ''
                            }`}
                    >
                        <div className={`aspect-video bg-gradient-to-br ${quest.gradient} flex items-center justify-center relative overflow-hidden`}>
                            {quest.locked ? (
                                <LockClosedIcon className="w-12 h-12 text-white/80" />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                                    {quest.icon}
                                </div>
                            )}
                            {quest.progress !== undefined && quest.progress > 0 && (
                                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800 shadow-sm">
                                    {quest.progress}%
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${quest.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        quest.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                            'bg-purple-100 text-purple-700'
                                    }`}>
                                    {quest.difficulty}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">{quest.category}</span>
                            </div>
                            <h4 className="font-serif font-bold text-lg text-slate-800 mb-2">{quest.title}</h4>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{quest.description}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <ClockIcon className="w-4 h-4" />
                                    {quest.duration} giorni
                                </div>
                                <div className="flex items-center gap-1">
                                    <BoltIcon className="w-4 h-4" />
                                    {quest.timePerDay}
                                </div>
                            </div>

                            <button
                                disabled={quest.locked}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${quest.locked
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : quest.progress && quest.progress > 0
                                            ? 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white hover:shadow-lg hover:shadow-luminel-gold-soft/30'
                                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg'
                                    }`}
                            >
                                {quest.locked ? 'Bloccata' : quest.progress && quest.progress > 0 ? 'Continua' : 'Inizia Quest'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QuestsPage;
