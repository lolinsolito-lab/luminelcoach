import React from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    FireIcon,
    TrophyIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useProgress } from '../contexts/ProgressContext';

const ProgressPage: React.FC = () => {
    const { streak, xp, level, weeklyProgress, weeklyGoal } = useProgress();

    const totalMinutes = Math.floor(xp / 2);
    const questsCompleted = 0; // Mock for now

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Your Progress</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Track your transformational journey
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <FireIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Streak</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{streak} days</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-luminel-champagne dark:bg-indigo-900/30 flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-luminel-gold-soft dark:text-luminel-gold-soft" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Time</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalMinutes} min</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quests Done</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{questsCompleted}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-luminel-champagne dark:bg-luminel-smoke/30 flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6 text-luminel-gold-soft dark:text-luminel-gold-soft" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Level</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{level}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Weekly Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 mb-12"
            >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Weekly Goal</h3>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600 dark:text-slate-300">Meditation Sessions</span>
                    <span className="font-bold text-luminel-gold-soft dark:text-luminel-gold-soft">{weeklyProgress}/{weeklyGoal}</span>
                </div>

                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-soft"
                    />
                </div>
            </motion.div>

            {/* Achievements - Coming Soon */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Achievements</h3>
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 border border-slate-200 dark:border-slate-700 text-center">
                    <TrophyIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Your achievements will appear here as you progress</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
