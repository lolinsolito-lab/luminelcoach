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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Community Pulse</h2>
                <button
                    onClick={() => navigate('/community')}
                    className="text-sm font-semibold text-luminel-gold-soft hover:text-luminel-taupe transition-colors"
                >
                    Vedi Tutto →
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-b-0 border-slate-100"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                {getIcon(activity.icon)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700">
                                    <span className="font-bold text-slate-800">{activity.userName}</span>
                                    {' '}{activity.action}{' '}
                                    <span className="font-semibold text-luminel-gold-soft">{activity.detail}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{activity.timestamp}</p>
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
                    className="w-full mt-4 py-3 bg-gradient-to-r from-luminel-champagne to-luminel-gold-soft/20 text-luminel-smoke font-semibold rounded-xl hover:shadow-md transition-all"
                >
                    Unisciti alla Community →
                </motion.button>
            </div>
        </div>
    );
};

export default CommunityPulse;
