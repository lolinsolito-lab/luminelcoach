import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LuxuryTransitionsProps {
    children: ReactNode;
}

/**
 * Luxury Page Transitions
 * Apple-inspired fluid transitions between pages
 */
const LuxuryTransitions: React.FC<LuxuryTransitionsProps> = ({ children }) => {
    const location = useLocation();

    // Elegant transition variants
    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.98,
            y: 10
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] // Custom easing for luxury feel
            }
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            y: -10,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default LuxuryTransitions;
