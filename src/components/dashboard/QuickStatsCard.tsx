import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

interface QuickStatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'gold' | 'champagne' | 'taupe';
    delay?: number;
    className?: string;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    color = 'gold',
    delay = 0,
    className
}) => {
    const colorStyles = {
        gold: "bg-luminel-gold-soft/20 text-luminel-gold-soft dark:bg-luminel-gold-soft/10",
        champagne: "bg-luminel-champagne text-luminel-taupe dark:bg-luminel-champagne/10",
        taupe: "bg-luminel-taupe/20 text-luminel-taupe dark:bg-luminel-taupe/10",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "bg-white dark:bg-slate-900 p-6 rounded-2xl border border-luminel-taupe/20 dark:border-slate-800",
                "shadow-sm hover:shadow-md transition-all duration-300",
                "flex flex-col justify-between h-full",
                className
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", colorStyles[color])}>
                    {icon}
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                        trend.isPositive
                            ? "bg-luminel-sage-50 text-luminel-sage-600 dark:bg-luminel-sage-900/30 dark:text-luminel-sage-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {trend.isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-luminel-taupe dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-2xl font-bold text-luminel-smoke dark:text-white">{value}</div>
            </div>
        </motion.div>
    );
};

export default QuickStatsCard;
