export const GAME_NAME = 'kelime-arama';

export const WORD_SEARCH_GRID_SIZE = 10;

export const WORD_COUNT_BY_DIFFICULTY: Record<number, number> = {
    1: 8,
    2: 11,
    3: 14,
};

export const WORD_SEARCH_LENGTH_RANGE = { min: 4, max: 8 };

export const WORD_SEARCH_COMPLETION_BONUS = 120;

export function getWordSearchGridSize(): number {
    return WORD_SEARCH_GRID_SIZE;
}

export function getWordSearchWordCount(difficulty: number): number {
    return WORD_COUNT_BY_DIFFICULTY[difficulty] ?? WORD_COUNT_BY_DIFFICULTY[1];
}

export function getWordSearchLengthRange(): { min: number; max: number } {
    return WORD_SEARCH_LENGTH_RANGE;
}
