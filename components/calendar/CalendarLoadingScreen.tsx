import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

const motivationalQuotes = [
    {
        text: "Ogni momento è un nuovo inizio per costruire il futuro che desideri.",
        author: "Coach Luminel"
    },
    {
        text: "La pianificazione è il ponte tra i tuoi sogni e la loro realizzazione.",
        author: "Coach Luminel"
    },
    {
        text: "Il tempo dedicato al tuo benessere è sempre tempo ben investito.",
        author: "Coach Luminel"
    }
];

interface CalendarLoadingScreenProps {
    onComplete: () => void;
}

const CalendarLoadingScreen: React.FC<CalendarLoadingScreenProps> = ({ onComplete }) => {
    const [currentQuote, setCurrentQuote] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => onComplete(), 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 120);

        const quoteInterval = setInterval(() => {
            setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
        }, 4000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(quoteInterval);
        };
    }, [onComplete]);

    const quote = motivationalQuotes[currentQuote];

    // Generate floating particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 6,
        x: Math.random() * 100,
        scale: 0.3 + Math.random() * 0.7
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #F5EFE6 0%, #FFFFFF 25%, #FDF8F3 50%, #F5EFE6 75%, #FDFAF5 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite'
            }}
        >
            {/* Animated Background Gradient */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            {/* Large Decorative Blurred Orbs */}
            <motion.div
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(214,194,155,0.3) 0%, rgba(214,194,155,0.1) 50%, transparent 100%)'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 30, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(245,239,230,0.5) 0%, rgba(245,239,230,0.2) 50%, transparent 100%)'
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.6, 0.4],
                    x: [0, -30, 0],
                    y: [0, 20, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(214,194,155,0.2) 0%, transparent 70%)'
                }}
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        background: 'radial-gradient(circle, rgba(214,194,155,0.6), rgba(214,194,155,0.2))',
                        boxShadow: '0 0 10px rgba(214,194,155,0.5)'
                    }}
                    initial={{ y: '100vh', opacity: 0, scale: 0 }}
                    animate={{
                        y: '-100vh',
                        opacity: [0, 1, 1, 0],
                        scale: particle.scale,
                        x: [0, Math.sin(particle.id) * 50, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

                {/* Glowing Icon Container */}
                <motion.div
                    className="relative mb-12"
                    animate={{
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Outer Glow Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(214,194,155,0.4) 0%, transparent 70%)',
                            filter: 'blur(30px)',
                            width: '200px',
                            height: '200px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Icon Container with Multiple Layers */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {/* Outer Ring */}
                        <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-luminel-gold-soft/30" style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />

                        {/* Middle Ring */}
                        <motion.div
                            className="absolute inset-0 w-28 h-28 rounded-full border border-luminel-gold-soft/20"
                            style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
                            animate={{ rotate: [0, -360] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>

                    {/* Main Icon */}
                    <motion.div
                        className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #D6C29B 0%, #E8DCC4 100%)',
                            boxShadow: '0 20px 60px rgba(214,194,155,0.4), 0 0 40px rgba(214,194,155,0.3) inset'
                        }}
                        animate={{
                            boxShadow: [
                                '0 20px 60px rgba(214,194,155,0.4), 0 0 40px rgba(214,194,155,0.3) inset',
                                '0 20px 80px rgba(214,194,155,0.6), 0 0 60px rgba(214,194,155,0.5) inset',
                                '0 20px 60px rgba(214,194,155,0.4), 0 0 40px rgba(214,194,155,0.3) inset'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <CalendarDaysIcon className="w-12 h-12 text-white drop-shadow-lg" />

                        {/* Corner Sparkles */}
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    top: i < 2 ? '-8px' : 'auto',
                                    bottom: i >= 2 ? '-8px' : 'auto',
                                    left: i % 2 === 0 ? '-8px' : 'auto',
                                    right: i % 2 === 1 ? '-8px' : 'auto',
                                }}
                                animate={{
                                    scale: [0, 1.2, 0],
                                    rotate: [0, 180, 360],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <SparklesIcon className="w-5 h-5 text-luminel-gold-soft" />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Title with Gradient */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <h1
                        className="text-6xl md:text-7xl font-serif font-bold mb-3 tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #8B7355 0%, #D6C29B 50%, #8B7355 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 2px 20px rgba(214,194,155,0.3))'
                        }}
                    >
                        My Journey
                    </h1>
                    <motion.p
                        className="text-xl text-slate-600 font-light tracking-wide"
                        animate={{
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        Preparando il tuo percorso trasformazionale...
                    </motion.p>
                </motion.div>

                {/* Elegant Quote Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuote}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto mb-12"
                    >
                        <div
                            className="relative rounded-[2.5rem] p-10 backdrop-blur-xl border border-white/40"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 1px rgba(255,255,255,0.5) inset'
                            }}
                        >
                            {/* Decorative Corner Elements */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-luminel-gold-soft/30 rounded-tl-xl" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-luminel-gold-soft/30 rounded-br-xl" />

                            <div className="flex items-start gap-4 mb-6">
                                <SparklesIcon className="w-8 h-8 text-luminel-gold-soft flex-shrink-0 mt-1" />
                                <p
                                    className="text-2xl font-serif italic leading-relaxed text-slate-700"
                                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                                >
                                    "{quote.text}"
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-luminel-gold-soft/50" />
                                <p className="text-base font-semibold text-luminel-gold-soft">
                                    {quote.author}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Premium Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="relative h-2 bg-white/60 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            animate={{
                                x: ['-100%', '200%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        {/* Progress Fill */}
                        <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, #D6C29B 0%, #E8DCC4 50%, #D6C29B 100%)',
                                boxShadow: '0 0 20px rgba(214,194,155,0.6)'
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>

                    {/* Percentage Text */}
                    <motion.div
                        className="mt-4 text-center"
                        animate={{
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-lg font-semibold text-slate-600">
                            {Math.round(loadingProgress)}%
                        </span>
                        <span className="text-sm text-slate-400 ml-2">completato</span>
                    </motion.div>
                </motion.div>

                {/* Floating Stars */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + Math.sin(i) * 20}%`
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <StarIcon className="w-4 h-4 text-luminel-gold-soft" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default CalendarLoadingScreen;
