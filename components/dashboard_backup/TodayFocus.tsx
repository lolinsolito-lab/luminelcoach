import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const TodayFocus: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative h-full min-h-[300px] rounded-3xl overflow-hidden group cursor-pointer"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="mb-auto">
                    <span className="inline-block px-3 py-1 bg-luminel-gold-soft/30 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-3 border border-luminel-gold-soft/50">
                        Consigliato per te
                    </span>
                </div>

                <h3 className="text-2xl font-bold mb-2 leading-tight group-hover:text-luminel-gold-soft transition-colors">
                    Ritrova la Calma Interiore
                </h3>

                <p className="text-white/80 mb-6 line-clamp-2">
                    Una sessione guidata per riconnetterti con il tuo centro e lasciar andare lo stress della giornata.
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4 text-luminel-gold-soft" />
                            <span>15 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-luminel-gold-soft" />
                            <span>Mindfulness</span>
                        </div>
                    </div>

                    <button className="w-12 h-12 bg-luminel-gold-soft text-luminel-smoke rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-luminel-gold-soft/30">
                        <PlayCircleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TodayFocus;
