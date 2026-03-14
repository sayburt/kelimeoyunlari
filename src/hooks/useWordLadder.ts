'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { getWordPair, isOneLetterAway } from '@/services/wordLadderService';
import { wordService } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useGamePersistence } from '@/hooks/useGamePersistence';

export type WordLadderStatus = 'idle' | 'loading' | 'playing' | 'won' | 'lost';

export interface WordLadderStep {
    word: string;
    changedIndex: number; // hangi index'teki harf değişti
}

export interface JokerState {
    used: boolean;
    count: number;
    hint?: string; // joker ipucu metni
}

export interface PersistedWordLadderState {
    status: WordLadderStatus;
    startWord: string;
    targetWord: string;
    optimalSteps: number;
    maxSteps: number;
    steps: WordLadderStep[];
    elapsedTime: number;
    lastUpdated: number;
}

const GAME_NAME = 'kelime-merdiveni';
export { GAME_NAME };

import { storage } from '@/lib/storage';

export function useWordLadder(options: { isPaused?: boolean } = {}) {
    const { isPaused = false } = options;
    const { difficulty } = useGameSettings();

    // LocalStorage'dan senkron başlangıç durumu al
    const localSaved = storage.getGameState<PersistedWordLadderState>(GAME_NAME);
    const hasLocalSaved = localSaved && localSaved.status === 'playing';

    const [status, setStatus] = useState<WordLadderStatus>(hasLocalSaved ? 'playing' : 'idle');
    const [startWord, setStartWord] = useState<string>(hasLocalSaved ? localSaved.startWord : '');
    const [targetWord, setTargetWord] = useState<string>(hasLocalSaved ? localSaved.targetWord : '');
    const [optimalSteps, setOptimalSteps] = useState<number>(hasLocalSaved ? localSaved.optimalSteps : 0);
    const [maxSteps, setMaxSteps] = useState<number>(hasLocalSaved ? localSaved.maxSteps : 0);
    const [steps, setSteps] = useState<WordLadderStep[]>(hasLocalSaved ? localSaved.steps : []);
    const [currentInput, setCurrentInput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState<number>(0);
    const [joker, setJoker] = useState<JokerState>({ used: false, count: 0 });

    const { elapsedTime, resetTimer, setElapsedTime } = useTimer(status === 'playing', isPaused, hasLocalSaved ? localSaved.elapsedTime : 0);
    const { playKeyPress, playDelete, playEnter, playError, playWin, playLose } = useSound();
    const isProcessingRef = useRef(false);

    // Persistence
    const persistenceState: PersistedWordLadderState = useMemo(() => ({
        status,
        startWord,
        targetWord,
        optimalSteps,
        maxSteps,
        steps,
        elapsedTime,
        lastUpdated: 0,
    }), [status, startWord, targetWord, optimalSteps, maxSteps, steps, elapsedTime]);

    const handleRestore = useCallback((saved: PersistedWordLadderState) => {
        if (saved.status === 'playing') {
            setStartWord(saved.startWord);
            setTargetWord(saved.targetWord);
            setOptimalSteps(saved.optimalSteps);
            setMaxSteps(saved.maxSteps);
            setSteps(saved.steps);
            setElapsedTime(saved.elapsedTime);
            setStatus('playing');
        }
    }, [setElapsedTime]);

    const { clearLocal, saveToCloud, loadFromCloud, deleteFromCloud } = useGamePersistence<PersistedWordLadderState>(
        GAME_NAME,
        status,
        persistenceState,
        handleRestore
    );

    // Geçerli kelimenin son harfini döner
    const getCurrentWord = useCallback((): string => {
        if (steps.length > 0) return steps[steps.length - 1].word;
        return startWord;
    }, [steps, startWord]);

    const startNewGame = useCallback(async () => {
        setStatus('loading');
        setError(null);
        setSteps([]);
        setCurrentInput('');
        setScore(0);
        setJoker({ used: false, count: 0 });
        resetTimer();
        clearLocal();

        try {
            await scoreService.recordGameStart(GAME_NAME);
            const pair = await getWordPair(4);
            if (!pair) {
                setStatus('idle');
                setError('Kelime çifti bulunamadı. Lütfen tekrar deneyin.');
                return;
            }
            setStartWord(pair.start);
            setTargetWord(pair.target);
            setOptimalSteps(pair.optimalSteps);
            setMaxSteps(pair.optimalSteps + 4);
            setCurrentInput('');
            setStatus('playing');
        } catch {
            setStatus('idle');
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }, [resetTimer, clearLocal]);

    const handleKeyPress = useCallback((key: string) => {
        if (status !== 'playing' || isProcessingRef.current) return;
        const wordLen = startWord.length;
        if (currentInput.length >= wordLen) return;
        playKeyPress();
        setCurrentInput(prev => prev + key.toLocaleUpperCase('tr-TR'));
        setError(null);
    }, [status, startWord, currentInput, playKeyPress]);

    const handleDelete = useCallback(() => {
        if (status !== 'playing' || isProcessingRef.current) return;
        playDelete();
        setCurrentInput(prev => prev.slice(0, -1));
        setError(null);
    }, [status, playDelete]);

    const handleEnter = useCallback(async () => {
        if (status !== 'playing' || isProcessingRef.current) return;
        const wordLen = startWord.length;

        if (currentInput.length !== wordLen) {
            playError();
            setError(`Kelime ${wordLen} harf olmalıdır!`);
            return;
        }

        const currentWord = getCurrentWord();
        const input = currentInput.toLocaleUpperCase('tr-TR');

        // Geçerli kelime mi?
        if (!isOneLetterAway(currentWord, input)) {
            playError();
            setError('Mevcut kelimeden yalnızca bir harf değiştirebilirsiniz!');
            return;
        }

        // Daha önce kullanıldı mı?
        const usedWords = [startWord, ...steps.map(s => s.word)];
        if (usedWords.includes(input)) {
            playError();
            setError('Bu kelimeyi daha önce kullandınız!');
            return;
        }

        isProcessingRef.current = true;
        playEnter();

        try {
            // Sözlükte var mı?
            const isValid = await wordService.isValidWord(input);
            if (!isValid) {
                playError();
                setError('Kelime sözlükte bulunamadı!');
                isProcessingRef.current = false;
                return;
            }

            // Hangi harf değişti?
            let changedIndex = -1;
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] !== input[i]) { changedIndex = i; break; }
            }

            const newStep: WordLadderStep = { word: input, changedIndex };
            const newSteps = [...steps, newStep];
            setSteps(newSteps);
            setCurrentInput('');
            setError(null);

            if (input === targetWord.toLocaleUpperCase('tr-TR')) {
                // KAZANDI
                playWin();
                const seconds = Math.floor(elapsedTime / 1000);
                const calculatedScore = scoreService.calculateWordLadderScore(
                    newSteps.length,
                    optimalSteps,
                    seconds,
                    difficulty,
                    joker.count
                );
                setScore(calculatedScore);
                await scoreService.saveGameResult(GAME_NAME, true, newSteps.length, { calculatedScore });
                clearLocal();
                setStatus('won');
            } else if (newSteps.length >= maxSteps) {
                // KAYBETTI
                playLose();
                await scoreService.saveGameResult(GAME_NAME, false, newSteps.length, { calculatedScore: 0 });
                clearLocal();
                setStatus('lost');
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            isProcessingRef.current = false;
        }
    }, [
        status, startWord, currentInput, getCurrentWord, steps, targetWord,
        maxSteps, optimalSteps, difficulty, elapsedTime, joker,
        playEnter, playError, playWin, playLose, clearLocal,
    ]);

    const useJoker = useCallback((): string | null => {
        if (status !== 'playing' || joker.used) return null;

        const currentWord = getCurrentWord();
        const target = targetWord.toLocaleUpperCase('tr-TR');

        // Henüz yanlış olan harfleri bul
        const wrongIndices: number[] = [];
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] !== target[i]) wrongIndices.push(i);
        }

        if (wrongIndices.length === 0) return null;

        // Rastgele bir yanlış harfi ipucu olarak ver
        const idx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        const hint = `${idx + 1}. harf "${target[idx]}" olmalı`;

        setJoker({ used: true, count: joker.count + 1, hint });
        return hint;
    }, [status, joker, getCurrentWord, targetWord]);

    /** Mevcut oyunu Supabase'e kaydeder (sadece giriş yapmış üyeler) */
    const saveGameToCloud = useCallback(async (): Promise<boolean> => {
        if (status !== 'playing') return false;
        return await saveToCloud(persistenceState, elapsedTime);
    }, [status, saveToCloud, persistenceState, elapsedTime]);

    /** Supabase'deki kayıtlı oyunu geri yükler */
    const loadGameFromCloud = useCallback(async (): Promise<boolean> => {
        const saved = await loadFromCloud();
        if (!saved) return false;
        handleRestore(saved.state);
        return true;
    }, [loadFromCloud, handleRestore]);

    /** Supabase'deki kayıtlı oyunu siler */
    const deleteCloudSave = useCallback(async () => {
        await deleteFromCloud();
    }, [deleteFromCloud]);

    return {
        status,
        startWord,
        targetWord,
        optimalSteps,
        maxSteps,
        steps,
        currentInput,
        error,
        score,
        joker,
        elapsedTime,
        getCurrentWord,
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
        useJoker,
        saveGameToCloud,
        loadGameFromCloud,
        deleteCloudSave,
        clearLocal,
    };
}
