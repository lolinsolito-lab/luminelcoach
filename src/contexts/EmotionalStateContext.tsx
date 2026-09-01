import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EmotionalState = 'alegre' | 'ispirato' | 'calmo' | 'ansioso' | 'depresso' | 'stanco' | 'triste' | null;

interface EmotionalStateContextType {
    currentState: EmotionalState;
    setEmotionalState: (state: EmotionalState) => void;
    hasCheckedInToday: boolean;
    lastCheckInDate: string | null;
}

const EmotionalStateContext = createContext<EmotionalStateContextType | undefined>(undefined);

const STORAGE_KEY = 'luminel_emotional_state';
const DATE_KEY = 'luminel_emotional_date';

export const EmotionalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentState, setCurrentState] = useState<EmotionalState>(null);
    const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY) as EmotionalState;
        const savedDate = localStorage.getItem(DATE_KEY);

        if (savedState && savedDate) {
            // Check if it's the same day
            const today = new Date().toDateString();
            if (savedDate === today) {
                setCurrentState(savedState);
                setLastCheckInDate(savedDate);
            } else {
                // Reset if it's a new day
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(DATE_KEY);
            }
        }
    }, []);

    const setEmotionalState = (state: EmotionalState) => {
        const today = new Date().toDateString();
        setCurrentState(state);
        setLastCheckInDate(today);

        if (state) {
            localStorage.setItem(STORAGE_KEY, state);
            localStorage.setItem(DATE_KEY, today);
        }
    };

    const hasCheckedInToday = currentState !== null && lastCheckInDate === new Date().toDateString();

    return (
        <EmotionalStateContext.Provider
            value={{
                currentState,
                setEmotionalState,
                hasCheckedInToday,
                lastCheckInDate
            }}
        >
            {children}
        </EmotionalStateContext.Provider>
    );
};

export const useEmotionalState = () => {
    const context = useContext(EmotionalStateContext);
    if (context === undefined) {
        throw new Error('useEmotionalState must be used within EmotionalStateProvider');
    }
    return context;
};
