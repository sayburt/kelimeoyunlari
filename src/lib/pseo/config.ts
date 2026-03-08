export const PSEO_MIN_INDEXABLE_WORD_COUNT = 3;

export const WORDLE_PSEO_TARGET_LENGTH = 5;
export const WORDLE_PSEO_TOP_SUFFIX_MIN_COUNT = 50;
export const WORDLE_PSEO_TOP_SUFFIX_LIMIT = 20;

export const PSEO_GAME_IDS = ['wordle'] as const;

export function isIndexableWordCount(wordCount: number): boolean {
    return wordCount >= PSEO_MIN_INDEXABLE_WORD_COUNT;
}
