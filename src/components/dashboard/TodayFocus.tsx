import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const TodayFocus: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-slate-100 bg-white"
        >
            <div className="flex flex-col lg:flex-row h-full lg:h-[280px]">
                {/* Image Section - Full height on mobile, Left side on Desktop */}
                <div className="relative h-64 lg:h-full lg:w-5/12 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}
                    />
                    <div className="absolute inset-0 bg-black/20 lg:bg-transparent" />

                    {/* Mobile Overlay Content */}
                    <div className="absolute top-4 left-4 lg:hidden">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wider uppercase border border-white/30">
                            Consigliato per te
                        </span>
                    </div>
                </div>

                {/* Content Section - Bottom on mobile, Right side on Desktop */}
                <div className="p-6 lg:p-8 lg:w-7/12 flex flex-col justify-center bg-white relative">
                    {/* Desktop Badge */}
                    <div className="hidden lg:block mb-4">
                        <span className="inline-block px-3 py-1 bg-luminel-champagne text-luminel-gold-soft text-xs font-bold tracking-wider uppercase rounded-full">
                            Consigliato per te
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-slate-800 leading-tight group-hover:text-luminel-gold-soft transition-colors">
                        Ritrova la Calma Interiore
                    </h3>

                    <p className="text-slate-600 mb-6 line-clamp-2 lg:line-clamp-none">
                        Una sessione guidata per riconnetterti con il tuo centro e lasciar andare lo stress della giornata.
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4 text-luminel-gold-soft" />
                                <span>15 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-luminel-gold-soft" />
                                <span>Mindfulness</span>
                            </div>
                        </div>

                        <button className="w-12 h-12 bg-luminel-gold-soft text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-luminel-gold-soft/30">
                            <PlayCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TodayFocus;
