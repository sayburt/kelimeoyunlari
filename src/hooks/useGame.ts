import { useState, useCallback, useRef, useEffect } from 'react';
import { wordService, Word } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { challengeService } from '@/services/challengeService';
import { LetterState } from '@/components/game/LetterCell';
import { evaluateGuess } from '@/services/gameService';
import { useSound } from '@/hooks/useSound';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useTimer } from '@/hooks/useTimer';
import { storage } from '@/lib/storage';
import { savedGameService, SavedGameState } from '@/services/savedGameService';

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

export interface JokerState {
    used: boolean;
    count: number;
    max: number;
}

export type GameStatus = 'idle' | 'loading' | 'playing' | 'won' | 'lost';

export interface UseGameOptions {
    initialWordLength?: number;
    initialMaxGuesses?: number;
    isPaused?: boolean;
    challengeId?: string | null;
}

export function useGame(options: UseGameOptions = {}) {
    const {
        initialWordLength = 5,
        initialMaxGuesses = 6,
        isPaused = false,
        challengeId = null
    } = options;
    const { difficulty } = useGameSettings();
    const [status, setStatus] = useState<GameStatus>('idle');
    const [targetWord, setTargetWord] = useState<Word | null>(null);
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({});
    const [error, setError] = useState<string | null>(null);
    const [wordLength, setWordLength] = useState(initialWordLength);
    const [maxGuesses, setMaxGuesses] = useState(initialMaxGuesses);
    const [joker, setJoker] = useState<JokerState>({ used: false, count: 0, max: 1 });
    const [score, setScore] = useState<number>(0);
    const [isChallengeMode, setIsChallengeMode] = useState(false);
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

    const { elapsedTime, resetTimer, setElapsedTime } = useTimer(status === 'playing', isPaused);

    // Persisted durumu yükle
    useEffect(() => {
        const savedState = storage.getGameState<PersistedGameState>('wordle');
        if (savedState && savedState.status === 'playing') {
            setStatus(savedState.status);
            setTargetWord(savedState.targetWord);
            setGuesses(savedState.guesses);
            setKeyboardState(savedState.keyboardState);
            setJoker(savedState.joker);
            setElapsedTime(savedState.elapsedTime);
        }
    }, [setElapsedTime]);

    // Durumu kaydet
    useEffect(() => {
        if (status === 'playing' && targetWord) {
            const stateToSave: PersistedGameState = {
                status,
                targetWord,
                guesses,
                keyboardState,
                joker,
                elapsedTime,
                lastUpdated: Date.now()
            };
            storage.setGameState('wordle', stateToSave);
        }
    }, [status, targetWord, guesses, keyboardState, joker, elapsedTime]);

    const { playKeyPress, playDelete, playEnter, playError, playWin, playLose, isSoundEnabled, toggleSound } = useSound();

    // İşlem devam ederken yeni harf girişini veya enter tuşunu engellemek için
    const isProcessingRef = useRef(false);

    const startNewGame = useCallback(async (length: number = initialWordLength, max: number = initialMaxGuesses) => {
        setStatus('loading');
        setError(null);
        setWordLength(length);
        setMaxGuesses(max);
        try {
            let word: Word | null = null;

            // Challenge modu: kelimeyi Supabase'den çek
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
                } else {
                    setStatus('idle');
                    setError('Meydan okuma bulunamadı veya süresi dolmuş.');
                    return;
                }
            } else {
                word = await wordService.getRandomWord({
                    length,
                    difficulty: difficulty
                });
                setIsChallengeMode(false);
                setActiveChallengeId(null);
            }

            if (!word) {
                setStatus('idle');
                setError('Seçilen kriterlere uygun kelime bulunamadı.');
                return;
            }
            setTargetWord(word);
            setGuesses([]);
            setCurrentGuess('');
            setKeyboardState({});
            setJoker({ used: false, count: 0, max: 1 });
            setScore(0);
            resetTimer();
            storage.clearGameState('wordle'); // Yeni oyun başlarken eski state'i temizle
            setStatus('playing');
        } catch (err) {
            console.error('Kelime yüklenirken hata:', err);
            setStatus('idle');
            setError('Kelime yüklenirken bir hata oluştu.');
        }
    }, [difficulty, initialWordLength, initialMaxGuesses, resetTimer, challengeId]);

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
            // Challenge modunda sözlük kontrolü yapılmaz
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

                // Puan hesapla
                const seconds = Math.floor(elapsedTime / 1000);
                const calculatedScore = scoreService.calculateWordleScore(newGuesses.length, seconds, difficulty, joker.count);
                setScore(calculatedScore);

                // Challenge modunda normal istatistiklere işlenmez (manipülasyon önlemi)
                if (!isChallengeMode) {
                    scoreService.saveGameResult('wordle', true, newGuesses.length, {
                        jokersUsed: joker.used ? 1 : 0,
                        calculatedScore
                    }).catch(console.error);
                }
            } else if (newGuesses.length >= maxGuesses) {
                playLose();
                setStatus('lost');
                // Challenge modunda normal istatistiklere işlenmez
                if (!isChallengeMode) {
                    scoreService.saveGameResult('wordle', false, newGuesses.length, {
                        jokersUsed: joker.used ? 1 : 0,
                        calculatedScore: 0
                    }).catch(console.error);
                }
            }

            // Oyun bittiyse state'i temizle
            if (currentGuess === target || newGuesses.length >= maxGuesses) {
                storage.clearGameState('wordle');
            }
        } catch (err) {
            console.error('Kelime kontrol hatası:', err);
            setError('Kelime kontrol edilirken bir hata oluştu.');
        } finally {
            isProcessingRef.current = false;
        }
    }, [status, currentGuess, wordLength, targetWord, guesses, maxGuesses, playEnter, playError, playWin, playLose, joker.used, joker.count, difficulty, elapsedTime, isChallengeMode]);

    const useJoker = useCallback(() => {
        if (status !== 'playing' || joker.used || !targetWord) return;

        // Wordle İpucu: Henüz bulunmamış doğru bir harfi klavye durumuna ekle
        const target = targetWord.kelime.toLocaleUpperCase('tr-TR');
        const correctLetters = Array.from(new Set(target.split('')));

        // Henüz klavyede 'correct' olarak işaretlenmemiş doğru harfleri bul
        const remainingLetters = correctLetters.filter(l => keyboardState[l] !== 'correct');

        if (remainingLetters.length > 0) {
            const randomLetter = remainingLetters[Math.floor(Math.random() * remainingLetters.length)];

            setKeyboardState(prev => ({
                ...prev,
                [randomLetter]: 'correct'
            }));

            setJoker(prev => ({
                ...prev,
                used: true,
                count: prev.count + 1
            }));

            playEnter(); // İpucu verildiğinde bir ses çal
            return true;
        } else {
            playError(); // İpucu verilecek harf kalmadıysa hata sesi çal
        }

        return false;
    }, [status, joker.used, targetWord, keyboardState, playEnter, playError]);


    // Bulut kaydetme fonksiyonu
    const saveGameToCloud = useCallback(async (gameName: string): Promise<boolean> => {
        if (status !== 'playing' || !targetWord) return false;

        const stateToSave: SavedGameState = {
            guesses,
            keyboardState,
            joker,
            targetWord,
            difficulty,
            wordLength,
            maxGuesses,
        };

        const success = await savedGameService.saveGame(gameName, stateToSave, elapsedTime);
        return success;
    }, [status, targetWord, guesses, keyboardState, joker, difficulty, wordLength, maxGuesses, elapsedTime]);

    // Buluttan oyun yükleme
    const loadGameFromCloud = useCallback((cloudState: SavedGameState, savedElapsedTime: number) => {
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
        storage.clearGameState('wordle'); // localStorage'dan temizle, buluttan yükleniyor
        setStatus('playing');
    }, [setElapsedTime]);

    // Bulut kaydını silme
    const deleteCloudSave = useCallback(async (gameName: string) => {
        await savedGameService.deleteSavedGame(gameName);
    }, []);

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
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
        useJoker,
        saveGameToCloud,
        loadGameFromCloud,
        deleteCloudSave,
    };
}
