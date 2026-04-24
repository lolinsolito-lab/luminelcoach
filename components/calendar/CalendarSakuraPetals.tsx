import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalendarSakuraPetalsProps {
    intensity?: 'high' | 'medium' | 'low';
}

interface Petal {
    id: number;
    left: string;
    delay: string;
    duration: string;
    size: number;
    rotate: number;
    opacity: number;
    color: string;
}

/**
 * Calendar Sakura Petals - Advanced physics-based animation from Beta
 * More sophisticated than SakuraEffect with configurable intensity
 */
const CalendarSakuraPetals: React.FC<CalendarSakuraPetalsProps> = ({ intensity = 'medium' }) => {
    const [petals, setPetals] = useState<Petal[]>([]);

    const petalColors = ['#FBCFE8', '#F3E8FF', '#E0E7FF', '#DBEAFE', '#CCFBF1'];

    useEffect(() => {
        const petalCount = intensity === 'high' ? 25 : intensity === 'medium' ? 15 : 8;

        const generatePetals = () => {
            const newPetals: Petal[] = [];
            for (let i = 0; i < petalCount; i++) {
                newPetals.push({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    delay: `${Math.random() * 8}s`,
                    duration: `${Math.random() * 4 + 8}s`,
                    size: Math.random() * 12 + 8,
                    rotate: Math.random() * 360,
                    opacity: 0.4 + Math.random() * 0.4,
                    color: petalColors[Math.floor(Math.random() * petalColors.length)]
                });
            }
            setPetals(newPetals);
        };

        generatePetals();
        const interval = setInterval(generatePetals, 25000);

        return () => clearInterval(interval);
    }, [intensity]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute"
                    style={{
                        left: petal.left,
                        top: '-50px',
                    }}
                    animate={{
                        y: ['0vh', '105vh'],
                        x: [0, -15, 15, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0.8, 0]
                    }}
                    transition={{
                        duration: parseFloat(petal.duration),
                        delay: parseFloat(petal.delay),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg
                        width={petal.size}
                        height={petal.size}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ opacity: petal.opacity }}
                    >
                        <path
                            d="M10 0C7.5 5 5 7.5 0 10C5 12.5 7.5 15 10 20C12.5 15 15 12.5 20 10C15 7.5 12.5 5 10 0Z"
                            fill={petal.color}
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

export default CalendarSakuraPetals;
