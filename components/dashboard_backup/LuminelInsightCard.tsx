import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, LightBulbIcon, ShareIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface LuminelInsightCardProps {
    userName: string;
    className?: string;
}

const INSIGHTS = [
    "La vera trasformazione inizia quando accetti chi sei, mentre lavori per chi vuoi diventare.",
    "Oggi, concentrati non sul fare di più, ma sull'essere più presente in ciò che fai.",
    "Il tuo potenziale è come un seme: ha bisogno di pazienza e cura per fiorire.",
    "Ogni respiro è un'opportunità per ricominciare. Lascia andare ieri, abbraccia ora.",
    "La chiarezza non viene dal pensare di più, ma dal sentire più profondamente."
];

const LuminelInsightCard: React.FC<LuminelInsightCardProps> = ({ userName, className }) => {
    const [insight, setInsight] = useState("");

    useEffect(() => {
        // Select a random insight for the demo (in real app, this would be AI-generated daily)
        const randomInsight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
        setInsight(randomInsight);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
                "relative overflow-hidden rounded-3xl p-8",
                "bg-gradient-to-br from-luminel-champagne to-white dark:from-slate-900 dark:to-slate-800",
                "border border-luminel-taupe/20 dark:border-white/10",
                "shadow-xl hover:shadow-2xl transition-all duration-500",
                className
            )}
        >
            {/* Background Decorative Elements - Soft Gold Glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-luminel-gold-soft/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-luminel-taupe/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-luminel-gold-soft font-medium text-sm tracking-wider uppercase">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Luminel Daily Guidance</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-luminel-smoke dark:text-white leading-tight">
                        Bentornato/a, <span className="text-luminel-gold-soft">{userName}</span>
                    </h2>

                    <div className="relative mt-6 p-6 bg-white/80 dark:bg-black/20 rounded-2xl border border-luminel-taupe/20 dark:border-white/5 backdrop-blur-sm shadow-sm">
                        <LightBulbIcon className="absolute top-6 left-6 w-6 h-6 text-luminel-gold-soft opacity-80" />
                        <p className="pl-10 text-lg md:text-xl text-luminel-smoke dark:text-slate-200 italic font-medium leading-relaxed">
                            "{insight}"
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-luminel-gold-soft hover:bg-luminel-taupe text-luminel-smoke rounded-xl font-bold shadow-lg shadow-luminel-gold-soft/30 transition-all hover:-translate-y-1">
                        <SparklesIcon className="w-5 h-5" />
                        Inizia Sessione
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-luminel-champagne text-luminel-smoke border-2 border-luminel-gold-soft/30 hover:border-luminel-gold-soft rounded-xl font-bold transition-all">
                        <ShareIcon className="w-5 h-5" />
                        Condividi Insight
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default LuminelInsightCard;
