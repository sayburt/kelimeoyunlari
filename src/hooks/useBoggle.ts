'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { wordService } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { useSound } from '@/hooks/useSound';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useGamePersistence } from '@/hooks/useGamePersistence';

export type BoggleStatus = 'idle' | 'loading' | 'playing' | 'finished';

export interface BoggleCell {
    letter: string;
    row: number;
    col: number;
}

export interface FoundWord {
    word: string;
    points: number;
    path: number[]; // flat indices
}

export interface PersistedBoggleState {
    status: BoggleStatus;
    grid: string[];
    foundWords: FoundWord[];
    remainingTime: number;
    lastUpdated: number;
}

export interface UseBoggleOptions {
    isPaused?: boolean;
}

import { GAME_NAME, GRID_SIZE, GAME_DURATION, MIN_WORD_LENGTH } from '@/constants/boggleConstants';
import { generateGrid, getNeighbors } from '@/utils/boggleUtils';

export function useBoggle(options: UseBoggleOptions = {}) {
    const { isPaused = false } = options;

    const { difficulty } = useGameSettings();
    const [status, setStatus] = useState<BoggleStatus>('idle');
    const [grid, setGrid] = useState<string[]>([]);
    const [selectedPath, setSelectedPathState] = useState<number[]>([]);
    const selectedPathRef = useRef<number[]>([]); // Anlık path takibi (batching sorunu çözümü)
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [remainingTime, setRemainingTime] = useState(GAME_DURATION);
    const [error, setError] = useState<string | null>(null);
    const [lastWordResult, setLastWordResult] = useState<'valid' | 'invalid' | null>(null);
    const [score, setScore] = useState(0);

    // selectedPath'i hem state hem ref olarak güncelle
    const setSelectedPath = useCallback((update: number[] | ((prev: number[]) => number[])) => {
        setSelectedPathState(prev => {
            const newVal = typeof update === 'function' ? update(prev) : update;
            selectedPathRef.current = newVal;
            return newVal;
        });
    }, []);

    const { playCorrect, playWrong, playError, playWin } = useSound();
    const isProcessingRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);

    // Persistence
    const persistenceState: PersistedBoggleState = useMemo(() => ({
        status: status as BoggleStatus,
        grid,
        foundWords,
        remainingTime,
        lastUpdated: 0,
    }), [status, grid, foundWords, remainingTime]);

    const handleRestore = useCallback((saved: PersistedBoggleState) => {
        if (saved.status === 'playing' && saved.remainingTime > 0) {
            setGrid(saved.grid);
            setFoundWords(saved.foundWords);
            setRemainingTime(saved.remainingTime);
            setStatus('playing');
        }
    }, []);

    const { clearLocal, saveToCloud, loadFromCloud, deleteFromCloud } = useGamePersistence<PersistedBoggleState>(
        GAME_NAME,
        status,
        persistenceState,
        handleRestore
    );

    // --- Countdown Timer ---
    useEffect(() => {
        if (status !== 'playing' || isPaused) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (status === 'playing' && isPaused) {
                pausedTimeRef.current = remainingTime;
            }
            return;
        }

        startTimeRef.current = Date.now();
        pausedTimeRef.current = remainingTime;

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const newRemaining = Math.max(0, pausedTimeRef.current - elapsed);
            setRemainingTime(newRemaining);

            if (newRemaining <= 0) {
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 100);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [status, isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGameEnd = useCallback(async () => {
        setStatus('finished');
        playWin();

        const wordStrings = foundWords.map(fw => fw.word);
        const calculatedScore = scoreService.calculateBoggleScore(wordStrings, difficulty);
        setScore(calculatedScore);

        await scoreService.saveGameResult(GAME_NAME, true, foundWords.length, {
            calculatedScore,
            remainingLives: 0,
        });
        clearLocal();
    }, [foundWords, difficulty, playWin, clearLocal]);

    // --- Süre bittiğinde oyunu bitir ---
    useEffect(() => {
        if (status === 'playing' && remainingTime <= 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleGameEnd();
        }
    }, [remainingTime, status]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Helpers ---
    const getCurrentWord = useCallback(() => {
        return selectedPath.map(idx => grid[idx]).join('');
    }, [selectedPath, grid]);

    // --- Main Actions ---

    const startNewGame = useCallback(async () => {
        setStatus('loading');
        setError(null);
        await scoreService.recordGameStart(GAME_NAME);

        const newGrid = generateGrid();
        setGrid(newGrid);
        setFoundWords([]);
        setSelectedPath([]);
        setRemainingTime(GAME_DURATION);
        setScore(0);
        setLastWordResult(null);
        clearLocal();

        // Kısa bir gecikmeyla playing'e geç
        setTimeout(() => setStatus('playing'), 100);
    }, [clearLocal, setSelectedPath]);

    const selectCell = useCallback((index: number) => {
        if (status !== 'playing' || isProcessingRef.current) return;

        // Ref üzerinden anlık path oku (React batching sorununu önler)
        const path = selectedPathRef.current;

        setLastWordResult(null);

        // Zaten seçiliyse → son hücre ise hiçbir şey yapma
        if (path.length > 0 && path[path.length - 1] === index) {
            return;
        }

        // Önceki hücre ise geri al
        if (path.length >= 2 && path[path.length - 2] === index) {
            setSelectedPath(path.slice(0, -1));
            return;
        }

        // Zaten path'te varsa geçersiz
        if (path.includes(index)) return;

        // İlk hücre
        if (path.length === 0) {
            setSelectedPath([index]);
            return;
        }

        // Bitişik mi kontrol et
        const lastIndex = path[path.length - 1];
        const neighbors = getNeighbors(lastIndex);

        if (neighbors.includes(index)) {
            setSelectedPath([...path, index]);
        }
    }, [status, setSelectedPath]);

    const clearSelection = useCallback(() => {
        setSelectedPath([]);
        setLastWordResult(null);
    }, [setSelectedPath]);

    const submitWord = useCallback(async () => {
        if (status !== 'playing' || isProcessingRef.current || selectedPath.length < MIN_WORD_LENGTH) {
            if (selectedPath.length > 0 && selectedPath.length < MIN_WORD_LENGTH) {
                setError('En az 3 harfli kelime gerekli!');
                playError();
                setLastWordResult('invalid');
                setTimeout(() => {
                    setError(null);
                    setLastWordResult(null);
                }, 1500);
                setSelectedPath([]);
            }
            return;
        }

        isProcessingRef.current = true;

        const word = selectedPath.map(idx => grid[idx]).join('');
        const upperWord = word.toLocaleUpperCase('tr-TR');

        // Tekrar kontrolü
        if (foundWords.some(fw => fw.word === upperWord)) {
            setError('Bu kelimeyi zaten buldunuz!');
            playError();
            setLastWordResult('invalid');
            setTimeout(() => {
                setError(null);
                setLastWordResult(null);
            }, 1500);
            setSelectedPath([]);
            isProcessingRef.current = false;
            return;
        }

        // Sözlük kontrolü
        const isValid = await wordService.isValidWord(upperWord);

        if (isValid) {
            const points = scoreService.getBoggleWordPoints(upperWord.length);
            const newFoundWord: FoundWord = {
                word: upperWord,
                points,
                path: [...selectedPath],
            };
            setFoundWords(prev => [newFoundWord, ...prev]);
            playCorrect();
            setLastWordResult('valid');
            setTimeout(() => setLastWordResult(null), 800);
        } else {
            setError('Geçersiz kelime!');
            playWrong();
            setLastWordResult('invalid');
            setTimeout(() => {
                setError(null);
                setLastWordResult(null);
            }, 1500);
        }

        setSelectedPath([]);
        isProcessingRef.current = false;
    }, [status, selectedPath, grid, foundWords, playCorrect, playWrong, playError, setSelectedPath]);

    // Toplam puan hesaplama (canlı)
    const totalPoints = useMemo(() => {
        return foundWords.reduce((sum, fw) => sum + fw.points, 0);
    }, [foundWords]);

    /** Mevcut Boggle oyununu Supabase'e kaydeder (sadece giriş yapmış üyeler) */
    const saveGameToCloud = useCallback(async (): Promise<boolean> => {
        if (status !== 'playing') return false;
        return await saveToCloud(persistenceState, 0);
    }, [status, saveToCloud, persistenceState]);

    /** Supabase'deki kayıtlı Boggle oyununu yükler */
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
        grid,
        gridSize: GRID_SIZE,
        selectedPath,
        foundWords,
        remainingTime,
        gameDuration: GAME_DURATION,
        error,
        lastWordResult,
        score,
        totalPoints,
        currentWord: getCurrentWord(),

        startNewGame,
        selectCell,
        clearSelection,
        submitWord,
        saveGameToCloud,
        loadGameFromCloud,
        deleteCloudSave,
    };
}
