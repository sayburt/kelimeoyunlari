'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { wordService, Word } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { GameStatus, JokerState } from '@/types/game';
import { challengeService } from '@/services/challengeService';
import { LetterState } from '@/components/game/LetterCell';
import { evaluateGuess } from '@/services/gameService';
import { useSound } from '@/hooks/useSound';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useTimer } from '@/hooks/useTimer';
import { WordleSavedGameState } from '@/services/savedGameService';
import { useGamePersistence } from '@/hooks/useGamePersistence';

export interface PersistedGameState {
    status: GameStatus;
    targetWord: Word | null;
    guesses: GuessResult[];
    keyboardState: Record<string, LetterState>;
    joker: JokerState;
    elapsedTime: number;
    lastUpdated: number;
}

export interface GuessResult {
    guess: string;
    states: LetterState[];
}

export type { GameStatus, JokerState } from '@/types/game';

export interface UseGameOptions {
    initialWordLength?: number;
    initialMaxGuesses?: number;
    isPaused?: boolean;
    challengeId?: string | null;
}

import { GAME_NAME } from '@/constants/wordleConstants';
import { storage } from '@/lib/storage';

export function useGame(options: UseGameOptions = {}) {
    const {
        initialWordLength = 5,
        initialMaxGuesses = 6,
        isPaused = false,
        challengeId = null
    } = options;

    const { difficulty } = useGameSettings();

    // LocalStorage'dan senkron başlangıç durumu al
    const localSaved = storage.getGameState<PersistedGameState>(GAME_NAME);
    const hasLocalSaved = localSaved && localSaved.status === 'playing';

    const [status, setStatus] = useState<GameStatus>(hasLocalSaved ? 'playing' : 'idle');
    const [targetWord, setTargetWord] = useState<Word | null>(hasLocalSaved ? localSaved.targetWord : null);
    const [guesses, setGuesses] = useState<GuessResult[]>(hasLocalSaved ? localSaved.guesses : []);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>(hasLocalSaved ? localSaved.keyboardState : {});
    const [error, setError] = useState<string | null>(null);
    const [wordLength, setWordLength] = useState(initialWordLength);
    const [maxGuesses, setMaxGuesses] = useState(initialMaxGuesses);
    const [joker, setJoker] = useState<JokerState>(hasLocalSaved ? localSaved.joker : { used: false, count: 0, max: 1 });
    const [score, setScore] = useState<number>(0);
    const [isChallengeMode, setIsChallengeMode] = useState(false);
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
    const [isCustomWord, setIsCustomWord] = useState(false);

    const { elapsedTime, resetTimer, setElapsedTime } = useTimer(status === 'playing', isPaused, hasLocalSaved ? localSaved.elapsedTime : 0);
    const { playKeyPress, playDelete, playEnter, playError, playWin, playLose, isSoundEnabled, toggleSound } = useSound();
    const isProcessingRef = useRef(false);

    // Persistence Hook
    const persistenceState = useMemo(() => ({
        status,
        targetWord,
        guesses,
        keyboardState,
        joker,
        elapsedTime
    }), [status, targetWord, guesses, keyboardState, joker, elapsedTime]);

    const handleRestore = useCallback((saved: PersistedGameState) => {
        if (saved.status === 'playing') {
            setStatus(saved.status);
            setTargetWord(saved.targetWord);
            setGuesses(saved.guesses);
            setKeyboardState(saved.keyboardState);
            setJoker(saved.joker);
            setElapsedTime(saved.elapsedTime);
        }
    }, [setElapsedTime]);

    const { saveToCloud, deleteFromCloud, clearLocal } = useGamePersistence<PersistedGameState>(
        GAME_NAME,
        status,
        persistenceState as unknown as PersistedGameState,
        handleRestore
    );

    // --- Helpers ---

    const updateKeyboardState = (guess: string, states: LetterState[]) => {
        setKeyboardState(prev => {
            const next = { ...prev };
            for (let i = 0; i < guess.length; i++) {
                const letter = guess[i];
                const state = states[i];
                const currentState = next[letter];

                if (state === 'correct') {
                    next[letter] = 'correct';
                } else if (state === 'present' && currentState !== 'correct') {
                    next[letter] = 'present';
                } else if (state === 'absent' && currentState !== 'correct' && currentState !== 'present') {
                    next[letter] = 'absent';
                }
            }
            return next;
        });
    };

    const handleGameEnd = useCallback(async (isWin: boolean, newGuesses: GuessResult[]) => {
        if (isWin) {
            playWin();
            setStatus('won');
            const seconds = Math.floor(elapsedTime / 1000);
            const calculatedScore = scoreService.calculateWordleScore(newGuesses.length, seconds, difficulty, joker.count);
            setScore(calculatedScore);

            if (!isChallengeMode) {
                await scoreService.saveGameResult(GAME_NAME, true, newGuesses.length, {
                    jokersUsed: joker.used ? 1 : 0,
                    calculatedScore
                });
            }
        } else {
            playLose();
            setStatus('lost');
            if (!isChallengeMode) {
                await scoreService.saveGameResult(GAME_NAME, false, newGuesses.length, {
                    jokersUsed: joker.used ? 1 : 0,
                    calculatedScore: 0
                });
            }
        }
        clearLocal();
    }, [playWin, playLose, elapsedTime, difficulty, joker, isChallengeMode, clearLocal]);

    // --- Main Actions ---

    const startNewGame = useCallback(async (length: number = initialWordLength, max: number = initialMaxGuesses) => {
        setStatus('loading');
        setError(null);
        setWordLength(length);
        setMaxGuesses(max);
        try {
            await scoreService.recordGameStart(GAME_NAME);
            let word: Word | null = null;

            if (challengeId) {
                const challengeData = await challengeService.getChallenge(challengeId);
                if (challengeData) {
                    word = {
                        kelime: challengeData.decodedWord,
                        kategoriler: [],
                        zorluk_seviyesi: 1,
                        harf_sayisi: challengeData.challenge.word_length,
                        anlam: '',
                    };
                    setIsChallengeMode(true);
                    setActiveChallengeId(challengeId);
                    setWordLength(challengeData.challenge.word_length);
                    setIsCustomWord(challengeData.challenge.target_word_type === 'custom');
                } else {
                    setStatus('idle');
                    setError('Meydan okuma bulunamadı veya süresi dolmuş.');
                    return;
                }
            } else {
                word = await wordService.getRandomWord({ length, difficulty });
                setIsChallengeMode(false);
                setActiveChallengeId(null);
                setIsCustomWord(false);
            }

            if (!word) {
                setStatus('idle');
                setError('Kelime bulunamadı.');
                return;
            }

            setTargetWord(word);
            setGuesses([]);
            setCurrentGuess('');
            setKeyboardState({});
            setJoker({ used: false, count: 0, max: 1 });
            setScore(0);
            resetTimer();
            clearLocal();
            setStatus('playing');
        } catch (err) {
            console.error('Start error:', err);
            setStatus('idle');
            setError('Bir hata oluştu.');
        }
    }, [difficulty, initialWordLength, initialMaxGuesses, resetTimer, challengeId, clearLocal]);

    const handleKeyPress = useCallback((key: string) => {
        if (status !== 'playing' || isProcessingRef.current) return;
        playKeyPress();
        setCurrentGuess(prev => prev.length >= wordLength ? prev : prev + key.toLocaleUpperCase('tr-TR'));
        setError(null);
    }, [status, wordLength, playKeyPress]);

    const handleDelete = useCallback(() => {
        if (status !== 'playing' || isProcessingRef.current) return;
        playDelete();
        setCurrentGuess(prev => prev.slice(0, -1));
        setError(null);
    }, [status, playDelete]);

    const handleEnter = useCallback(async () => {
        if (status !== 'playing' || isProcessingRef.current) return;
        if (currentGuess.length !== wordLength) {
            playError();
            setError('Yetersiz harf!');
            return;
        }

        playEnter();
        isProcessingRef.current = true;
        try {
            if (!isChallengeMode) {
                const isValid = await wordService.isValidWord(currentGuess);
                if (!isValid) {
                    playError();
                    setError('Kelime sözlükte bulunamadı!');
                    isProcessingRef.current = false;
                    return;
                }
            }

            const target = targetWord!.kelime.toLocaleUpperCase('tr-TR');
            const states = evaluateGuess(currentGuess, target);
            const newGuessResult: GuessResult = { guess: currentGuess, states };
            const newGuesses = [...guesses, newGuessResult];

            setGuesses(newGuesses);
            setCurrentGuess('');
            setError(null);
            updateKeyboardState(currentGuess, states);

            if (currentGuess === target) {
                await handleGameEnd(true, newGuesses);
            } else if (newGuesses.length >= maxGuesses) {
                await handleGameEnd(false, newGuesses);
            }
        } catch (err) {
            console.error('Check error:', err);
            setError('Bir hata oluştu.');
        } finally {
            isProcessingRef.current = false;
        }
    }, [status, currentGuess, wordLength, targetWord, guesses, maxGuesses, playEnter, playError, isChallengeMode, handleGameEnd]);

    const useJoker = useCallback(() => {
        if (status !== 'playing' || joker.used || !targetWord) return false;

        const target = targetWord.kelime.toLocaleUpperCase('tr-TR');
        const correctLetters = Array.from(new Set(target.split('')));
        const remainingLetters = correctLetters.filter(l => keyboardState[l] !== 'correct');

        if (remainingLetters.length > 0) {
            const randomLetter = remainingLetters[Math.floor(Math.random() * remainingLetters.length)];
            setKeyboardState(prev => ({ ...prev, [randomLetter]: 'correct' }));
            setJoker(prev => ({ ...prev, used: true, count: prev.count + 1 }));
            playEnter();
            return true;
        } else {
            playError();
            return false;
        }
    }, [status, joker.used, targetWord, keyboardState, playEnter, playError]);

    const saveGameToCloud = useCallback(async (): Promise<boolean> => {
        if (status !== 'playing' || !targetWord) return false;
        const stateToSave: WordleSavedGameState = {
            guesses,
            keyboardState,
            joker,
            targetWord,
            difficulty,
            wordLength,
            maxGuesses,
        };
        return await saveToCloud(stateToSave as unknown as PersistedGameState, elapsedTime);
    }, [status, targetWord, guesses, keyboardState, joker, difficulty, wordLength, maxGuesses, elapsedTime, saveToCloud]);

    const loadGameFromCloud = useCallback((cloudState: WordleSavedGameState, savedElapsedTime: number) => {
        setTargetWord(cloudState.targetWord);
        setGuesses(cloudState.guesses as GuessResult[]);
        setKeyboardState(cloudState.keyboardState as Record<string, LetterState>);
        setJoker(cloudState.joker);
        setWordLength(cloudState.wordLength);
        setMaxGuesses(cloudState.maxGuesses);
        setElapsedTime(savedElapsedTime);
        setCurrentGuess('');
        setScore(0);
        setError(null);
        clearLocal();
        setStatus('playing');
    }, [setElapsedTime, clearLocal]);

    const deleteCloudSave = useCallback(async () => {
        await deleteFromCloud();
    }, [deleteFromCloud]);

    return {
        status,
        targetWord,
        guesses,
        currentGuess,
        currentRow: guesses.length,
        keyboardState,
        error,
        maxGuesses,
        wordLength,
        isSoundEnabled,
        toggleSound,
        elapsedTime,
        joker,
        score,
        isChallengeMode,
        activeChallengeId,
        isCustomWord,
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
