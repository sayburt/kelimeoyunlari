import { useCallback } from 'react';
import { useGameSettings } from '@/context/GameSettingsContext';

let globalAudioCtx: AudioContext | null = null;

function getGlobalAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!globalAudioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            globalAudioCtx = new AudioContextClass();
        }
    }
    return globalAudioCtx;
}

export function useSound() {
    const { isSoundEnabled, toggleSound } = useGameSettings();

    const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
        if (!isSoundEnabled) return;

        try {
            const ctx = getGlobalAudioContext();
            if (!ctx) return;

            // Resume context if suspended (browser auto-play policy)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            // Fix for Firefox: exponentialRampToValueAtTime cannot ramp to 0, use a very small value instead
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }, [isSoundEnabled]);

    const playKeyPress = useCallback(() => playTone(300, 'sine', 0.1, 0.05), [playTone]);
    const playEnter = useCallback(() => playTone(400, 'sine', 0.15, 0.05), [playTone]);
    const playDelete = useCallback(() => playTone(200, 'sine', 0.1, 0.05), [playTone]);
    const playError = useCallback(() => playTone(150, 'sawtooth', 0.3, 0.1), [playTone]);

    // Win is a sequence of notes
    const playWin = useCallback(() => {
        if (!isSoundEnabled) return;
        playTone(440, 'sine', 0.2, 0.1);
        setTimeout(() => playTone(554.37, 'sine', 0.2, 0.1), 150);
        setTimeout(() => playTone(659.25, 'sine', 0.4, 0.1), 300);
    }, [isSoundEnabled, playTone]);

    // Lose is a descending sequence
    const playLose = useCallback(() => {
        if (!isSoundEnabled) return;
        playTone(300, 'triangle', 0.3, 0.1);
        setTimeout(() => playTone(250, 'triangle', 0.3, 0.1), 250);
        setTimeout(() => playTone(200, 'triangle', 0.5, 0.1), 500);
    }, [isSoundEnabled, playTone]);

    return {
        isSoundEnabled,
        toggleSound,
        playKeyPress,
        playEnter,
        playDelete,
        playError,
        playWin,
        playLose
    };
}
