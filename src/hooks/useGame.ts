import { useState, useCallback, useRef } from 'react';
import { wordService, Word } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { LetterState } from '@/components/game/LetterCell';
import { evaluateGuess } from '@/services/gameService';
import { useSound } from '@/hooks/useSound';

export interface GuessResult {
    guess: string;
    states: LetterState[];
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'won' | 'lost';

export function useGame(initialWordLength: number = 5, initialMaxGuesses: number = 6) {
    const [status, setStatus] = useState<GameStatus>('idle');
    const [targetWord, setTargetWord] = useState<Word | null>(null);
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({});
    const [error, setError] = useState<string | null>(null);
    const [wordLength, setWordLength] = useState(initialWordLength);
    const [maxGuesses, setMaxGuesses] = useState(initialMaxGuesses);
    const { playKeyPress, playDelete, playEnter, playError, playWin, playLose, isSoundEnabled, toggleSound } = useSound();

    // İşlem devam ederken yeni harf girişini veya enter tuşunu engellemek için
    const isProcessingRef = useRef(false);

    const startNewGame = useCallback(async (length: number = wordLength, max: number = maxGuesses) => {
        setStatus('loading');
        setError(null);
        setWordLength(length);
        setMaxGuesses(max);
        try {
            const word = await wordService.getRandomWord({ length });
            if (!word) {
                setStatus('idle');
                setError('Seçilen kriterlere uygun kelime bulunamadı.');
                return;
            }
            setTargetWord(word);
            setGuesses([]);
            setCurrentGuess('');
            setKeyboardState({});
            setStatus('playing');
        } catch (err) {
            console.error('Kelime yüklenirken hata:', err);
            setStatus('idle');
            setError('Kelime yüklenirken bir hata oluştu.');
        }
    }, [wordLength, maxGuesses]);

    const handleKeyPress = useCallback((key: string) => {
        if (status !== 'playing' || isProcessingRef.current) return;

        playKeyPress();

        setCurrentGuess(prev => {
            if (prev.length >= wordLength) return prev;
            return prev + key.toLocaleUpperCase('tr-TR');
        });
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
            const isValid = await wordService.isValidWord(currentGuess);
            if (!isValid) {
                playError();
                setError('Kelime sözlükte bulunamadı!');
                isProcessingRef.current = false;
                return;
            }

            const target = targetWord!.kelime.toLocaleUpperCase('tr-TR');
            const states = evaluateGuess(currentGuess, target);

            const newGuessResult: GuessResult = {
                guess: currentGuess,
                states
            };

            const newGuesses = [...guesses, newGuessResult];
            setGuesses(newGuesses);
            setCurrentGuess('');
            setError(null);

            // Klavye durumunu güncelle — fonksiyonel updater ile keyboardState bağımlılığı kalkar
            setKeyboardState(prev => {
                const next = { ...prev };
                for (let i = 0; i < currentGuess.length; i++) {
                    const letter = currentGuess[i];
                    const state = states[i];
                    const currentState = next[letter];

                    // Durumu daha "iyi" bir state ile güncelle (Kötüye doğru gitmemesi için)
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

            // Kazanma / Kaybetme durumlarını kontrol et
            if (currentGuess === target) {
                playWin();
                setStatus('won');
                scoreService.saveGameResult('wordle', true, newGuesses.length).catch(console.error);
            } else if (newGuesses.length >= maxGuesses) {
                playLose();
                setStatus('lost');
                scoreService.saveGameResult('wordle', false, newGuesses.length).catch(console.error);
            }
        } catch (err) {
            console.error('Kelime kontrol hatası:', err);
            setError('Kelime kontrol edilirken bir hata oluştu.');
        } finally {
            isProcessingRef.current = false;
        }
    }, [status, currentGuess, wordLength, targetWord, guesses, maxGuesses, playEnter, playError, playWin, playLose]);


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
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter
    };
}
