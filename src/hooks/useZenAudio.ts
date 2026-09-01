import { useCallback, useRef, useEffect } from 'react';

export type ZenSoundType = 'click' | 'success' | 'error' | 'subtle' | 'dismiss';

interface ZenAudioOptions {
    enabled?: boolean;
    volume?: number;
}

/**
 * Hook for playing zen ambient sounds
 * Provides subtle audio feedback for interactions
 */
export const useZenAudio = (options: ZenAudioOptions = {}) => {
    const { enabled = true, volume = 0.3 } = options;
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize Web Audio API context
    useEffect(() => {
        if (enabled && typeof window !== 'undefined') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [enabled]);

    /**
     * Generate a soft chime sound using Web Audio API
     */
    const playChime = useCallback((frequency: number, duration: number) => {
        if (!enabled || !audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        // ADSR envelope (soft attack, gentle decay)
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }, [enabled, volume]);

    /**
     * Play a subtle click sound (soft chime)
     */
    const playClick = useCallback(() => {
        playChime(880, 0.1); // A5 note, 100ms
    }, [playChime]);

    /**
     * Play a success sound (pleasant two-note chime)
     */
    const playSuccess = useCallback(() => {
        playChime(659.25, 0.15); // E5
        setTimeout(() => playChime(783.99, 0.2), 80); // G5
    }, [playChime]);

    /**
     * Play an error/dismiss sound (low soft whoosh)
     */
    const playError = useCallback(() => {
        playChime(329.63, 0.15); // E4, lower tone
    }, [playChime]);

    /**
     * Play a subtle ambient sound
     */
    const playSubtle = useCallback(() => {
        playChime(523.25, 0.08); // C5, very short
    }, [playChime]);

    /**
     * Play dismiss/close sound
     */
    const playDismiss = useCallback(() => {
        playChime(440, 0.12); // A4
    }, [playChime]);

    /**
     * Generic play function
     */
    const play = useCallback((soundType: ZenSoundType) => {
        switch (soundType) {
            case 'click':
                playClick();
                break;
            case 'success':
                playSuccess();
                break;
            case 'error':
                playError();
                break;
            case 'subtle':
                playSubtle();
                break;
            case 'dismiss':
                playDismiss();
                break;
        }
    }, [playClick, playSuccess, playError, playSubtle, playDismiss]);

    return {
        play,
        playClick,
        playSuccess,
        playError,
        playSubtle,
        playDismiss,
        isEnabled: enabled
    };
};
