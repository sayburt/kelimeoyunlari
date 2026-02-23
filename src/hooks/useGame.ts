import { useState, useCallback, useRef } from 'react';
import { wordService, Word } from '@/services/wordService';
import { LetterState } from '@/components/game/LetterCell';

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

        setCurrentGuess(prev => {
            if (prev.length >= wordLength) return prev;
            return prev + key.toLocaleUpperCase('tr-TR');
        });
        setError(null);
    }, [status, wordLength]);

    const handleDelete = useCallback(() => {
        if (status !== 'playing' || isProcessingRef.current) return;

        setCurrentGuess(prev => prev.slice(0, -1));
        setError(null);
    }, [status]);

    const evaluateGuess = (guess: string, target: string): LetterState[] => {
        const guessArr = guess.split('');
        const targetArr = target.split('');
        const states: LetterState[] = new Array(guess.length).fill('absent');

        // Önce doğrudan doğru olan harfleri (yeşil) bul
        for (let i = 0; i < guessArr.length; i++) {
            if (guessArr[i] === targetArr[i]) {
                states[i] = 'correct';
                targetArr[i] = '*'; // Kullanılmış olarak işaretle
                guessArr[i] = '*';  // Değerlendirilmiş olarak işaretle
            }
        }

        // Sonra yanlış yerde ama olan harfleri (sarı) bul
        for (let i = 0; i < guessArr.length; i++) {
            if (guessArr[i] !== '*') {
                const targetIndex = targetArr.indexOf(guessArr[i]);
                if (targetIndex !== -1) {
                    states[i] = 'present';
                    targetArr[targetIndex] = '*'; // Kullanılmış olarak işaretle
                }
            }
        }

        return states;
    };

    const handleEnter = useCallback(async () => {
        if (status !== 'playing' || isProcessingRef.current) return;
        if (currentGuess.length !== wordLength) {
            setError('Yetersiz harf!');
            return;
        }

        isProcessingRef.current = true;
        try {
            const isValid = await wordService.isValidWord(currentGuess);
            if (!isValid) {
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

            // Klavye durumunu güncelle
            const newKeyboardState = { ...keyboardState };
            for (let i = 0; i < currentGuess.length; i++) {
                const letter = currentGuess[i];
                const state = states[i];
                const currentState = newKeyboardState[letter];

                // Durumu daha "iyi" bir state ile güncelle (Kötüye doğru gitmemesi için)
                if (state === 'correct') {
                    newKeyboardState[letter] = 'correct';
                } else if (state === 'present' && currentState !== 'correct') {
                    newKeyboardState[letter] = 'present';
                } else if (state === 'absent' && currentState !== 'correct' && currentState !== 'present') {
                    newKeyboardState[letter] = 'absent';
                }
            }
            setKeyboardState(newKeyboardState);

            // Kazanma / Kaybetme durumlarını kontrol et
            if (currentGuess === target) {
                setStatus('won');
            } else if (newGuesses.length >= maxGuesses) {
                setStatus('lost');
            }
        } catch (err) {
            console.error('Kelime kontrol hatası:', err);
            setError('Kelime kontrol edilirken bir hata oluştu.');
        } finally {
            isProcessingRef.current = false;
        }
    }, [status, currentGuess, wordLength, targetWord, guesses, maxGuesses, keyboardState]);

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
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter
    };
}
