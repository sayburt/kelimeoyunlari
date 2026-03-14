'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useSound } from '@/hooks/useSound';
import { useTimer } from '@/hooks/useTimer';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { Word, wordService } from '@/services/wordService';
import { scoreService } from '@/services/scoreService';
import { JokerState } from '@/types/game';
import {
    GAME_NAME,
    getWordSearchGridSize,
    getWordSearchLengthRange,
    getWordSearchWordCount,
    WORD_SEARCH_COMPLETION_BONUS,
} from '@/constants/wordSearchConstants';
import { generateGrid, getLineIndices, WordSearchPlacement } from '@/utils/wordSearchUtils';
import {
    isWordSearchWordValid,
    normalizeWordSearchWord,
    RECENT_WORD_MEMORY_LIMIT,
    selectCandidateWords,
} from '@/utils/wordSearchSelectionUtils';

export type WordSearchStatus = 'idle' | 'loading' | 'playing' | 'won';

export interface WordSearchWord {
    word: string;
    cells: number[];
    points: number;
    found: boolean;
}

export interface PersistedWordSearchState {
    status: WordSearchStatus;
    difficulty: number;
    grid: string[];
    gridSize: number;
    words: WordSearchWord[];
    selectedCells: number[];
    hintCells: number[];
    joker: JokerState;
    score: number;
    elapsedTime: number;
    lastUpdated: number;
}

interface UseWordSearchOptions {
    isPaused?: boolean;
}

function sameCells(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function useWordSearch(options: UseWordSearchOptions = {}) {
    const { isPaused = false } = options;

    const { difficulty } = useGameSettings();
    const [status, setStatus] = useState<WordSearchStatus>('idle');
    const [puzzleDifficulty, setPuzzleDifficulty] = useState(difficulty);
    const [grid, setGrid] = useState<string[]>([]);
    const [gridSize, setGridSize] = useState(getWordSearchGridSize());
    const [words, setWords] = useState<WordSearchWord[]>([]);
    const [selectedCells, setSelectedCells] = useState<number[]>([]);
    const [hintCells, setHintCells] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [joker, setJoker] = useState<JokerState>({ used: false, count: 0, max: 1 });
    const [score, setScore] = useState(0);

    const { elapsedTime, resetTimer, setElapsedTime } = useTimer(status === 'playing', isPaused);
    const { playCorrect, playWrong, playError, playWin } = useSound();
    const isProcessingRef = useRef(false);
    const clearHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recentWordsRef = useRef<string[]>([]);
    const wordsByLengthCacheRef = useRef<Map<number, string[]>>(new Map());

    const persistenceState: PersistedWordSearchState = useMemo(() => ({
        status,
        difficulty,
        grid,
        gridSize,
        words,
        selectedCells,
        hintCells,
        joker,
        score,
        elapsedTime,
        lastUpdated: 0,
    }), [status, difficulty, grid, gridSize, words, selectedCells, hintCells, joker, score, elapsedTime]);

    const handleRestore = useCallback((saved: PersistedWordSearchState) => {
        if (saved.status !== 'playing') return;
        if (saved.difficulty !== difficulty) return;

        setStatus('playing');
        setPuzzleDifficulty(saved.difficulty);
        setGrid(saved.grid);
        setGridSize(saved.gridSize);
        setWords(saved.words);
        setSelectedCells(saved.selectedCells ?? []);
        setHintCells(saved.hintCells ?? []);
        setJoker(saved.joker);
        setScore(saved.score);
        setElapsedTime(saved.elapsedTime);
    }, [difficulty, setElapsedTime]);

    const { clearLocal, saveToCloud, loadFromCloud, deleteFromCloud } = useGamePersistence<PersistedWordSearchState>(
        GAME_NAME,
        status,
        persistenceState,
        handleRestore
    );

    const clearTransientStates = useCallback(() => {
        setSelectedCells([]);
        setHintCells([]);
        if (clearHintTimeoutRef.current) {
            clearTimeout(clearHintTimeoutRef.current);
            clearHintTimeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (clearHintTimeoutRef.current) {
                clearTimeout(clearHintTimeoutRef.current);
            }
        };
    }, []);

    const getWordsByLengthCached = useCallback(async (length: number): Promise<string[]> => {
        const cached = wordsByLengthCacheRef.current.get(length);
        if (cached) {
            return cached;
        }

        const rawWords: Word[] = await wordService.getWordsByLength(length);
        const normalized = Array.from(
            new Set(
                rawWords
                    .map(word => normalizeWordSearchWord(word.kelime))
                    .filter(word => isWordSearchWordValid(word, length, length, length))
            )
        );

        wordsByLengthCacheRef.current.set(length, normalized);
        return normalized;
    }, []);

    const rememberUsedWords = useCallback((usedWords: string[]) => {
        if (usedWords.length === 0) {
            return;
        }

        const uniqueNewWords = Array.from(new Set(usedWords));
        const existingWords = recentWordsRef.current.filter(word => !uniqueNewWords.includes(word));
        recentWordsRef.current = [...uniqueNewWords, ...existingWords].slice(0, RECENT_WORD_MEMORY_LIMIT);
    }, []);

    // Oyun için kelime havuzundan yeni oyunlarda tekrar etmeyi azaltarak seçim yapar.
    const pickWords = useCallback(async (size: number, desiredCount: number): Promise<string[]> => {
        const { min, max } = getWordSearchLengthRange();
        const maxLengthForThisGame = desiredCount >= 14 ? Math.min(max, 7) : max;
        const lengthUpperBound = Math.min(maxLengthForThisGame, size);
        const wordsByLength = new Map<number, string[]>();

        for (let length = min; length <= lengthUpperBound; length++) {
            wordsByLength.set(length, await getWordsByLengthCached(length));
        }

        return selectCandidateWords({
            wordsByLength,
            minLength: min,
            maxLength: lengthUpperBound,
            desiredCount,
            recentWords: recentWordsRef.current,
        });
    }, [getWordsByLengthCached]);

    const buildPuzzle = useCallback(async (): Promise<{
        gridSize: number;
        grid: string[];
        placements: WordSearchPlacement[];
    }> => {
        const size = getWordSearchGridSize();
        const desiredCount = getWordSearchWordCount(difficulty);
        const minimumAcceptableCount = Math.max(6, desiredCount - 3);
        let bestPuzzle: { grid: string[]; placements: WordSearchPlacement[] } | null = null;

        for (let targetCount = desiredCount; targetCount >= minimumAcceptableCount; targetCount--) {
            for (let attempt = 0; attempt < 36; attempt++) {
                const candidateWords = await pickWords(size, targetCount);
                if (candidateWords.length < targetCount) {
                    continue;
                }

                const generated = generateGrid(size, candidateWords, targetCount);

                if (!bestPuzzle || generated.placements.length > bestPuzzle.placements.length) {
                    bestPuzzle = generated;
                }

                if (generated.placements.length === targetCount) {
                    return {
                        gridSize: size,
                        grid: generated.grid,
                        placements: generated.placements,
                    };
                }
            }
        }

        if (bestPuzzle && bestPuzzle.placements.length > 0) {
            return {
                gridSize: size,
                grid: bestPuzzle.grid,
                placements: bestPuzzle.placements,
            };
        }

        throw new Error('Bulmaca üretilemedi.');
    }, [difficulty, pickWords]);

    const finishGame = useCallback(async (currentWords?: WordSearchWord[]) => {
        const activeWords = currentWords ?? words;
        const foundWords = activeWords.filter(w => w.found).map(w => w.word);
        if (foundWords.length === 0) {
            return;
        }

        setStatus('won');
        playWin();

        const calculatedScore = scoreService.calculateWordSearchScore(
            foundWords,
            difficulty,
            joker.count,
            WORD_SEARCH_COMPLETION_BONUS
        );

        setScore(calculatedScore);

        await scoreService.saveGameResult(GAME_NAME, true, foundWords.length, {
            jokersUsed: joker.count,
            calculatedScore,
            completionBonus: WORD_SEARCH_COMPLETION_BONUS,
        });

        clearLocal();
    }, [words, playWin, difficulty, joker.count, clearLocal]);

    const startNewGame = useCallback(async () => {
        setStatus('loading');
        setError(null);
        setScore(0);
        setJoker({ used: false, count: 0, max: 1 });
        clearTransientStates();
        resetTimer();
        clearLocal();

        try {
            await scoreService.recordGameStart(GAME_NAME);
            const puzzle = await buildPuzzle();
            const initialWords: WordSearchWord[] = puzzle.placements.map((placement) => ({
                word: placement.word,
                cells: placement.cells,
                points: scoreService.getWordSearchWordPoints(placement.word.length),
                found: false,
            }));

            setGridSize(puzzle.gridSize);
            setGrid(puzzle.grid);
            setWords(initialWords);
            rememberUsedWords(initialWords.map(word => word.word));
            setPuzzleDifficulty(difficulty);
            setStatus('playing');
        } catch (err) {
            console.error('Word Search start error:', err);
            setStatus('idle');
            setError('Bulmaca hazırlanamadı, lütfen tekrar deneyin.');
        }
    }, [buildPuzzle, clearLocal, clearTransientStates, difficulty, rememberUsedWords, resetTimer]);

    useEffect(() => {
        if (status === 'loading' || status === 'idle') {
            return;
        }

        if (puzzleDifficulty !== difficulty) {
            startNewGame();
        }
    }, [difficulty, puzzleDifficulty, startNewGame, status]);

    const checkWordMatch = useCallback((lineCells: number[]): WordSearchWord | null => {
        for (const target of words) {
            if (target.found) {
                continue;
            }

            if (sameCells(target.cells, lineCells) || sameCells([...target.cells].reverse(), lineCells)) {
                return target;
            }
        }

        return null;
    }, [words]);

    const previewSelection = useCallback((startIndex: number, endIndex: number) => {
        const line = getLineIndices(startIndex, endIndex, gridSize);
        if (!line) {
            setSelectedCells([]);
            return;
        }
        setSelectedCells(line);
    }, [gridSize]);

    const clearSelection = useCallback(() => {
        setSelectedCells([]);
    }, []);

    const handleSelection = useCallback(async (startIndex: number, endIndex: number) => {
        if (status !== 'playing' || isProcessingRef.current) {
            return;
        }

        const line = getLineIndices(startIndex, endIndex, gridSize);
        if (!line || line.length < 2) {
            setSelectedCells([]);
            return;
        }

        setSelectedCells(line);
        isProcessingRef.current = true;

        try {
            const matchedWord = checkWordMatch(line);

            if (!matchedWord) {
                playWrong();
                setError('Seçilen harfler listede bir kelime oluşturmuyor.');
                setTimeout(() => {
                    setError(null);
                    setSelectedCells([]);
                }, 1100);
                return;
            }

            const nextWords = words.map((word) => {
                if (word.word === matchedWord.word) {
                    return { ...word, found: true };
                }
                return word;
            });

            setWords(nextWords);
            playCorrect();

            const foundWords = nextWords.filter(w => w.found).map(w => w.word);
            const liveScore = scoreService.calculateWordSearchScore(foundWords, difficulty, joker.count, 0);
            setScore(liveScore);

            if (foundWords.length === nextWords.length && nextWords.length > 0) {
                await finishGame(nextWords);
                return;
            }

            setTimeout(() => setSelectedCells([]), 350);
        } finally {
            isProcessingRef.current = false;
        }
    }, [status, gridSize, checkWordMatch, words, playWrong, playCorrect, difficulty, joker.count, finishGame]);

    const useJoker = useCallback(() => {
        if (status !== 'playing' || joker.used) {
            return false;
        }

        const remainingWords = words.filter(word => !word.found);
        if (remainingWords.length === 0) {
            playError();
            return false;
        }

        const randomTarget = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        const firstLetterCell = randomTarget.cells[0];
        setJoker(prev => ({ ...prev, used: true, count: prev.count + 1 }));
        setHintCells([firstLetterCell]);
        setSelectedCells([]);
        setError(`İpucu: Bir kelimenin ilk harfi (${randomTarget.word[0]}) vurgulandı.`);

        clearHintTimeoutRef.current = setTimeout(() => {
            setHintCells([]);
            setSelectedCells([]);
            setError(null);
        }, 2200);

        const currentFound = words.filter(w => w.found).map(w => w.word);
        const newScore = scoreService.calculateWordSearchScore(currentFound, difficulty, joker.count + 1, 0);
        setScore(newScore);

        return true;
    }, [status, joker.used, joker.count, words, playError, difficulty]);

    const foundWordCount = useMemo(() => words.filter(word => word.found).length, [words]);
    const foundPaths = useMemo(() => words.filter(word => word.found).map(word => word.cells), [words]);

    /** Mevcut oyunu Supabase'e kaydeder (sadece giriş yapmış üyeler) */
    const saveGameToCloud = useCallback(async (): Promise<boolean> => {
        if (status !== 'playing') return false;
        return await saveToCloud(persistenceState, elapsedTime);
    }, [status, saveToCloud, persistenceState, elapsedTime]);

    /** Supabase'deki kayıtlı oyunu yükler */
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
        gridSize,
        words,
        selectedCells,
        hintCells,
        foundPaths,
        foundWordCount,
        totalWordCount: words.length,
        error,
        joker,
        score,
        elapsedTime,
        startNewGame,
        previewSelection,
        clearSelection,
        handleSelection,
        checkWordMatch,
        finishGame,
        useJoker,
        saveGameToCloud,
        loadGameFromCloud,
        deleteCloudSave,
    };
}
