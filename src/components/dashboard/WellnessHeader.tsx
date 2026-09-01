import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface UserStats {
    totalMinutes: number;
    currentStreak: number;
    level: number;
}

interface WellnessHeaderProps {
    greeting: string;
    userStats: UserStats;
}

const WellnessHeader: React.FC<WellnessHeaderProps> = ({ greeting, userStats }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] shadow-xl shadow-purple-200"
        >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-10 -mb-10 blur-2xl" />

            <div className="relative z-10 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        {greeting}
                    </h1>
                    <div className="flex items-center gap-2 text-purple-100 font-medium">
                        <ClockIcon className="w-5 h-5" />
                        <span>
                            {currentTime.toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-8 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                    <div className="text-center">
                        <div className="text-2xl font-bold leading-none mb-1">
                            {userStats.totalMinutes}min
                        </div>
                        <div className="text-xs text-purple-100 font-medium uppercase tracking-wider">tempo totale</div>
                    </div>

                    <div className="w-px h-8 bg-white/20" />

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 font-bold">
                                <HeartSolid className="w-4 h-4 text-pink-300" />
                                <span>{userStats.currentStreak}</span>
                            </div>
                            <span className="text-[10px] text-purple-100 uppercase">giorni</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 font-bold">
                                <StarSolid className="w-4 h-4 text-yellow-300" />
                                <span>Lv. {userStats.level}</span>
                            </div>
                            <span className="text-[10px] text-purple-100 uppercase">crescita</span>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-white/20" />

                    <div className="flex items-center gap-2">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-bold">Attivo</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WellnessHeader;
