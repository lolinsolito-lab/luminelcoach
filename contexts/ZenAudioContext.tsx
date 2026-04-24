import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ZenAudioContextType {
    isEnabled: boolean;
    volume: number;
    toggleAudio: () => void;
    setVolume: (volume: number) => void;
}

const ZenAudioContext = createContext<ZenAudioContextType | undefined>(undefined);

const STORAGE_KEY = 'luminel_zen_audio_enabled';
const VOLUME_KEY = 'luminel_zen_audio_volume';

export const ZenAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [volume, setVolumeState] = useState(0.3);

    // Load settings from localStorage
    useEffect(() => {
        const savedEnabled = localStorage.getItem(STORAGE_KEY);
        const savedVolume = localStorage.getItem(VOLUME_KEY);

        if (savedEnabled !== null) {
            setIsEnabled(savedEnabled === 'true');
        }
        if (savedVolume !== null) {
            setVolumeState(parseFloat(savedVolume));
        }
    }, []);

    const toggleAudio = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        localStorage.setItem(STORAGE_KEY, String(newValue));
    };

    const setVolume = (newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);
        localStorage.setItem(VOLUME_KEY, String(clampedVolume));
    };

    return (
        <ZenAudioContext.Provider value={{ isEnabled, volume, toggleAudio, setVolume }}>
            {children}
        </ZenAudioContext.Provider>
    );
};

export const useZenAudioSettings = () => {
    const context = useContext(ZenAudioContext);
    if (context === undefined) {
        throw new Error('useZenAudioSettings must be used within ZenAudioProvider');
    }
    return context;
};
