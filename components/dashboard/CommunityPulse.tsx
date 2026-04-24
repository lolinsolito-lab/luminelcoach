import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface CommunityActivity {
    id: string;
    userName: string;
    action: string;
    detail: string;
    icon: 'streak' | 'achievement' | 'course';
    timestamp: string;
}

const CommunityPulse: React.FC = () => {
    const navigate = useNavigate();

    // Mock community activities
    const activities: CommunityActivity[] = [
        {
            id: '1',
            userName: 'Marco R.',
            action: 'ha completato',
            detail: 'Deep Transformation',
            icon: 'achievement',
            timestamp: '2 ore fa'
        },
        {
            id: '2',
            userName: 'Sofia M.',
            action: 'ha raggiunto',
            detail: '30 giorni di streak!',
            icon: 'streak',
            timestamp: '5 ore fa'
        },
        {
            id: '3',
            userName: 'Luca P.',
            action: 'ha iniziato',
            detail: 'Mindfulness Avanzata',
            icon: 'course',
            timestamp: '1 giorno fa'
        }
    ];

    const getIcon = (iconType: string) => {
        switch (iconType) {
            case 'streak':
                return <FireIcon className="w-5 h-5 text-orange-500" />;
            case 'achievement':
                return <TrophyIcon className="w-5 h-5 text-luminel-gold-soft" />;
            case 'course':
                return <UserCircleIcon className="w-5 h-5 text-blue-500" />;
            default:
                return <UserCircleIcon className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-serif font-bold text-slate-800">Community Pulse</h2>
                <button
                    onClick={() => navigate('/community')}
                    className="text-sm font-semibold text-luminel-gold-soft hover:text-luminel-taupe transition-colors"
                >
                    Vedi Tutto →
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/60">
                <div className="space-y-6">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 group"
                        >
                            {/* Icon with Ring */}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-luminel-gold-soft/30 group-hover:bg-luminel-champagne/20 transition-all duration-300">
                                    {getIcon(activity.icon)}
                                </div>
                                {index !== activities.length - 1 && (
                                    <div className="absolute top-12 left-6 w-px h-full bg-slate-100 -ml-px my-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 py-1">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <span className="font-bold text-slate-900">{activity.userName}</span>
                                    {' '}{activity.action}{' '}
                                    <span className="font-semibold text-luminel-gold-soft">{activity.detail}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{activity.timestamp}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Join Community CTA */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => navigate('/community')}
                    className="w-full mt-8 py-4 bg-slate-50 hover:bg-luminel-champagne/30 text-slate-600 hover:text-luminel-gold-dark font-semibold rounded-2xl border border-slate-100 hover:border-luminel-gold-soft/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                    <span>Unisciti alla Community</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
            </div>
        </div>
    );
};

export default CommunityPulse;
