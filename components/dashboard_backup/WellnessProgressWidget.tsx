import React from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    HeartIcon as HeartSolid,
    StarIcon
} from '@heroicons/react/24/solid';

interface UserStats {
    weeklyGoal: number;
    weeklyProgress: number;
    currentStreak: number;
    level: number;
    experience: number;
    experienceToNext: number;
}

interface WellnessProgressWidgetProps {
    userStats: UserStats;
}

const WellnessProgressWidget: React.FC<WellnessProgressWidgetProps> = ({ userStats }) => {
    const progressPercentage = (userStats.weeklyProgress / userStats.weeklyGoal) * 100;
    const experiencePercentage = (userStats.experience / userStats.experienceToNext) * 100;

    return (
        <div className="space-y-6">
            {/* Weekly Progress - Dark Card */}
            <div className="bg-[#334155] rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <ChartBarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">
                                    Progresso<br />Settimanale
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">La tua crescita personale</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-[#818CF8]">
                                {userStats.weeklyProgress}/{userStats.weeklyGoal}
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">sessioni</p>
                        </div>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>

                    <div className="text-center">
                        {progressPercentage >= 100 ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-400">
                                <StarIcon className="w-5 h-5 fill-current" />
                                <span className="font-bold text-sm">Obiettivo raggiunto! 🎉</span>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm font-medium">
                                Ancora <span className="text-white font-bold">{userStats.weeklyGoal - userStats.weeklyProgress} sessioni</span> per raggiungere l'obiettivo
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Small Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Streak Card - Dark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#334155] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden group"
                >
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mb-8 transition-transform group-hover:scale-110 duration-500" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                                <HeartSolid className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight">Streak<br />Attuale</h4>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-[#FCD34D]">{userStats.currentStreak}</span>
                            <span className="text-xs text-slate-400 mb-1.5 font-medium">
                                {userStats.currentStreak === 1 ? 'giorno' : 'giorni'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Level Card - Dark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#334155] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden group"
                >
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mb-8 transition-transform group-hover:scale-110 duration-500" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <StarIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight">Livello<br />Attuale</h4>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-4xl font-bold text-[#34D399]">{userStats.level}</span>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <motion.div
                                    className="h-full bg-[#34D399] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${experiencePercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WellnessProgressWidget;
