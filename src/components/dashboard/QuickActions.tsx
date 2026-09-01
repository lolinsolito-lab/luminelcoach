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
        <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-slate-800 px-1">Azioni Rapide</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(action.route)}
                        className={`relative p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden text-left flex items-center gap-4`}
                    >
                        {/* Background Gradient on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                        {/* Icon Container */}
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.bgColor} ${action.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                            {React.cloneElement(action.icon as React.ReactElement, { className: "w-6 h-6" })}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 z-10">
                            <h3 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-slate-900 transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                                {action.subtitle}
                            </p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
