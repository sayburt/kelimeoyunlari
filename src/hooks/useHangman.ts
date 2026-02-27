'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { wordService, Word } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { useSound } from '@/hooks/useSound';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useTimer } from '@/hooks/useTimer';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { GameStatus, JokerState } from '@/types/game';
import { challengeService } from '@/services/challengeService';

export type { GameStatus, JokerState } from '@/types/game';
export type LetterState = 'correct' | 'absent' | 'idle';

export interface PersistedHangmanState {
    status: GameStatus;
    targetWord: Word | null;
    guessedLetters: string[];
    wrongGuesses: number;
    joker: JokerState;
    elapsedTime: number;
    lastUpdated: number;
}

export interface UseHangmanOptions {
    isPaused?: boolean;
    challengeId?: string | null;
}

import { GAME_NAME, MAX_LIVES } from '@/constants/hangmanConstants';

export function useHangman(options: UseHangmanOptions = {}) {
    const { isPaused = false, challengeId = null } = options;

    const { difficulty, category } = useGameSettings();
    const [status, setStatus] = useState<GameStatus>('idle');
    const [targetWord, setTargetWord] = useState<Word | null>(null);
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [wrongGuesses, setWrongGuesses] = useState<number>(0);
    const [joker, setJoker] = useState<JokerState>({ used: false, count: 0, max: 1 });
    const [score, setScore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
    const [isCustomWord, setIsCustomWord] = useState<boolean>(false);

    const { elapsedTime, resetTimer, setElapsedTime } = useTimer(status === 'playing', isPaused);
    const { playCorrect, playWrong, playError, playWin, playLose, isSoundEnabled, toggleSound } = useSound();
    const isProcessingRef = useRef(false);

    // Persistence Hook
    const persistenceState: PersistedHangmanState = useMemo(() => ({
        status,
        targetWord,
        guessedLetters: Array.from(guessedLetters),
        wrongGuesses,
        joker,
        elapsedTime,
        lastUpdated: 0
    }), [status, targetWord, guessedLetters, wrongGuesses, joker, elapsedTime]);

    const handleRestore = useCallback((saved: PersistedHangmanState) => {
        if (saved.status === 'playing') {
            setStatus(saved.status);
            setTargetWord(saved.targetWord);
            setGuessedLetters(new Set(saved.guessedLetters));
            setWrongGuesses(saved.wrongGuesses);
            setJoker(saved.joker);
            setElapsedTime(saved.elapsedTime);
        }
    }, [setElapsedTime]);

    const { clearLocal } = useGamePersistence<PersistedHangmanState>(
        GAME_NAME,
        status,
        persistenceState,
        handleRestore
    );

    // --- Helpers ---

    const getKeyboardState = useCallback((): Record<string, LetterState> => {
        const state: Record<string, LetterState> = {};
        if (!targetWord) return state;

        const targetWordUpper = targetWord.kelime.toLocaleUpperCase('tr-TR');
        guessedLetters.forEach(letter => {
            if (targetWordUpper.includes(letter)) {
                state[letter] = 'correct';
            } else {
                state[letter] = 'absent';
            }
        });
        return state;
    }, [targetWord, guessedLetters]);

    const handleGameEnd = useCallback(async (isWin: boolean) => {
        if (!targetWord) return;

        if (isWin) {
            playWin();
            setStatus('won');
            const seconds = Math.floor(elapsedTime / 1000);
            const remainingLives = MAX_LIVES - wrongGuesses;
            const calculatedScore = scoreService.calculateHangmanScore(remainingLives, seconds, difficulty, targetWord.harf_sayisi, joker.count);
            setScore(calculatedScore);

            if (isChallengeMode && activeChallengeId) {
                await challengeService.updateChallengeResult(activeChallengeId, calculatedScore, MAX_LIVES - wrongGuesses, undefined, GAME_NAME, true);
            } else {
                await scoreService.saveGameResult(GAME_NAME, true, wrongGuesses, {
                    jokersUsed: joker.used ? 1 : 0,
                    calculatedScore,
                    remainingLives
                });
            }
        } else {
            playLose();
            setStatus('lost');
            if (isChallengeMode && activeChallengeId) {
                await challengeService.updateChallengeResult(activeChallengeId, 0, MAX_LIVES, undefined, GAME_NAME, false);
            } else {
                await scoreService.saveGameResult(GAME_NAME, false, MAX_LIVES, {
                    jokersUsed: joker.used ? 1 : 0,
                    calculatedScore: 0,
                    remainingLives: 0
                });
            }
        }
        clearLocal();
    }, [playWin, playLose, elapsedTime, difficulty, joker, wrongGuesses, targetWord, clearLocal, isChallengeMode, activeChallengeId]);

    // --- Main Actions ---

    const startNewGame = useCallback(async () => {
        setStatus('loading');
        setError(null);
        try {
            setGuessedLetters(new Set());
            setWrongGuesses(0);
            setJoker({ used: false, count: 0, max: 1 });
            setScore(0);
            resetTimer();
            clearLocal();

            if (challengeId) {
                const challengeData = await challengeService.getChallenge(challengeId);
                if (challengeData) {
                    const { challenge, decodedWord } = challengeData;
                    setTargetWord({
                        kelime: decodedWord,
                        harf_sayisi: decodedWord.length,
                        kategoriler: ['Meydan Okuma'],
                        zorluk_seviyesi: 1,
                        anlam: ''
                    });
                    setIsChallengeMode(true);
                    setActiveChallengeId(challenge.id);
                    setIsCustomWord(challenge.target_word_type === 'custom');
                    setStatus('playing');
                    return;
                } else {
                    setError('Meydan okuma bulunamadı veya süresi dolmuş.');
                    // Fall back to normal game
                    setIsChallengeMode(false);
                    setActiveChallengeId(null);
                    setIsCustomWord(false);
                }
            } else {
                setIsChallengeMode(false);
                setActiveChallengeId(null);
                setIsCustomWord(false);
            }

            // Sadece zorluk seviyesine veya seçilen kategoriye göre kelime çekiyoruz
            const word = await wordService.getRandomWord({
                difficulty,
                category: category === 'rastgele' ? undefined : category
            });

            if (!word) {
                setStatus('idle');
                setError('Kelime bulunamadı.');
                return;
            }

            setTargetWord(word);
            setStatus('playing');
        } catch (err) {
            console.error('Start error:', err);
            setStatus('idle');
            setError('Bir hata oluştu.');
        }
    }, [difficulty, category, resetTimer, clearLocal, challengeId]);

    const handleGuess = useCallback(async (letter: string) => {
        if (status !== 'playing' || isProcessingRef.current || !targetWord) return;

        const upperLetter = letter.toLocaleUpperCase('tr-TR');
        if (guessedLetters.has(upperLetter)) return; // Zaten tahmin edilmiş harf

        isProcessingRef.current = true;

        const newGuessedLetters = new Set(guessedLetters);
        newGuessedLetters.add(upperLetter);
        setGuessedLetters(newGuessedLetters);

        const targetUpper = targetWord.kelime.toLocaleUpperCase('tr-TR');
        let newWrongGuesses = wrongGuesses;

        if (!targetUpper.includes(upperLetter)) {
            newWrongGuesses += 1;
            setWrongGuesses(newWrongGuesses);
            playWrong();
        } else {
            playCorrect();
        }

        // Oyun Bitiş Kontrolü
        if (newWrongGuesses >= MAX_LIVES) {
            await handleGameEnd(false);
        } else {
            // Kazanma Kontrolü
            const isWin = targetUpper.split('').every(char =>
                char === ' ' || char === '-' || newGuessedLetters.has(char)
            );
            if (isWin) {
                await handleGameEnd(true);
            }
        }

        isProcessingRef.current = false;
    }, [status, guessedLetters, targetWord, wrongGuesses, handleGameEnd, playCorrect, playWrong]);

    const useJoker = useCallback(() => {
        if (status !== 'playing' || joker.used || !targetWord) return false;

        const target = targetWord.kelime.toLocaleUpperCase('tr-TR');
        const correctLetters = Array.from(new Set(target.split(''))).filter(char => char !== ' ' && char !== '-');
        const remainingLetters = correctLetters.filter(l => !guessedLetters.has(l));

        if (remainingLetters.length > 0) {
            const randomLetter = remainingLetters[Math.floor(Math.random() * remainingLetters.length)];

            setJoker(prev => ({ ...prev, used: true, count: prev.count + 1 }));
            // Joker bir tahmin olarak sayılır, handleGuess içindeki gibi işlemleri yapalım
            handleGuess(randomLetter);

            return true;
        } else {
            playError();
            return false;
        }
    }, [status, joker.used, targetWord, guessedLetters, handleGuess, playError]);

    return {
        status,
        targetWord,
        guessedLetters,
        wrongGuesses,
        maxLives: MAX_LIVES,
        keyboardState: getKeyboardState(),
        error,
        isSoundEnabled,
        toggleSound,
        elapsedTime,
        joker,
        score,
        isChallengeMode,
        activeChallengeId,
        isCustomWord,
        startNewGame,
        handleGuess,
        useJoker,
    };
}
