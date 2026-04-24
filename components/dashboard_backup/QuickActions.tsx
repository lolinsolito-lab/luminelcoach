import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    PlayCircleIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    route: string;
}

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    const actions: QuickAction[] = [
        {
            id: 'meditate',
            title: 'Inizia Meditazione',
            subtitle: 'Trova la tua pace',
            icon: <PlayCircleIcon className="w-8 h-8" />,
            color: 'text-emerald-600',
            bgColor: 'from-emerald-50 to-teal-50',
            route: '/experiences'
        },
        {
            id: 'courses',
            title: 'Esplora Corsi',
            subtitle: 'Continua a crescere',
            icon: <AcademicCapIcon className="w-8 h-8" />,
            color: 'text-luminel-gold-soft',
            bgColor: 'from-luminel-champagne to-yellow-50',
            route: '/courses'
        },
        {
            id: 'community',
            title: 'Community',
            subtitle: 'Connettiti con altri',
            icon: <UserGroupIcon className="w-8 h-8" />,
            color: 'text-blue-600',
            bgColor: 'from-blue-50 to-indigo-50',
            route: '/community'
        },
        {
            id: 'progress',
            title: 'I Tuoi Progressi',
            subtitle: 'Vedi i risultati',
            icon: <ChartBarIcon className="w-8 h-8" />,
            color: 'text-purple-600',
            bgColor: 'from-purple-50 to-pink-50',
            route: '/progress'
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Azioni Rapide</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {actions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(action.route)}
                        className={`relative p-6 rounded-2xl bg-gradient-to-br ${action.bgColor} border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden text-left`}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Icon */}
                        <div className={`${action.color} mb-3 relative z-10`}>
                            {action.icon}
                        </div>

                        {/* Text */}
                        <div className="relative z-10">
                            <h3 className="font-bold text-slate-800 text-sm mb-0.5">
                                {action.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {action.subtitle}
                            </p>
                        </div>

                        {/* Arrow on hover */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
