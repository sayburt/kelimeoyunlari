import { TURKISH_ALPHABET } from './constants';
import {
    isIndexableWordCount,
    WORDLE_PSEO_TARGET_LENGTH,
    WORDLE_PSEO_TOP_SUFFIX_LIMIT,
    WORDLE_PSEO_TOP_SUFFIX_MIN_COUNT,
} from '@/lib/pseo/config';
import {
    getFilteredWords,
    getWordsByLength,
    getWordsExcludingLetters,
} from './filters';
import type { SuffixCandidate, TopSuffixOptions, WordFilter } from './types';

function getFilterCacheKey(filter: WordFilter): string {
    return JSON.stringify({
        startsWith: filter.startsWith || '',
        endsWith: filter.endsWith || '',
        length: filter.length || 0,
        excludeLetters: (filter.excludeLetters || []).join(','),
        category: filter.category || '',
    });
}

export function getAllPilotFilters(): WordFilter[] {
    const filters: WordFilter[] = [];

    for (const letter of TURKISH_ALPHABET) {
        const words = getFilteredWords({ startsWith: letter, length: WORDLE_PSEO_TARGET_LENGTH });
        if (isIndexableWordCount(words.length)) {
            filters.push({ startsWith: letter, length: WORDLE_PSEO_TARGET_LENGTH });
        }
    }

    return filters;
}

export function getTopSuffixes(options: TopSuffixOptions): SuffixCandidate[] {
    const {
        length,
        suffixLength = 2,
        minCount = 1,
        limit = 20,
    } = options;

    const words = getWordsByLength(length);
    const counter: Record<string, number> = {};

    for (const word of words) {
        const lower = word.kelime.toLocaleLowerCase('tr-TR');
        if (lower.length < suffixLength) continue;

        const suffix = lower.slice(-suffixLength);
        counter[suffix] = (counter[suffix] || 0) + 1;
    }

    return Object.entries(counter)
        .map(([suffix, count]) => ({ suffix, count }))
        .filter((item) => item.count >= minCount)
        .sort((a, b) => b.count - a.count || a.suffix.localeCompare(b.suffix, 'tr'))
        .slice(0, limit);
}

export function getWordlePseoFilters(): WordFilter[] {
    const filters: WordFilter[] = [...getAllPilotFilters()];

    if (isIndexableWordCount(getWordsByLength(WORDLE_PSEO_TARGET_LENGTH).length)) {
        filters.push({ length: WORDLE_PSEO_TARGET_LENGTH });
    }

    const topSuffixes = getTopSuffixes({
        length: WORDLE_PSEO_TARGET_LENGTH,
        suffixLength: 2,
        minCount: WORDLE_PSEO_TOP_SUFFIX_MIN_COUNT,
        limit: WORDLE_PSEO_TOP_SUFFIX_LIMIT,
    });

    for (const item of topSuffixes) {
        filters.push({ endsWith: item.suffix, length: WORDLE_PSEO_TARGET_LENGTH });
    }

    if (isIndexableWordCount(getWordsExcludingLetters(['j', 'z'], WORDLE_PSEO_TARGET_LENGTH).length)) {
        filters.push({ excludeLetters: ['j', 'z'], length: WORDLE_PSEO_TARGET_LENGTH });
    }

    const seen = new Set<string>();
    return filters.filter((filter) => {
        const key = getFilterCacheKey(filter);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export function getFiveLetterWordsSummary(): {
    total: number;
    byLetter: { letter: string; count: number }[];
} {
    const allFiveLetterWords = getWordsByLength(WORDLE_PSEO_TARGET_LENGTH);
    const byLetter: { letter: string; count: number }[] = [];

    for (const letter of TURKISH_ALPHABET) {
        const count = allFiveLetterWords.filter((word) =>
            word.kelime.toLocaleLowerCase('tr-TR').startsWith(letter)
        ).length;

        if (count > 0) {
            byLetter.push({ letter, count });
        }
    }

    byLetter.sort((a, b) => b.count - a.count);

    return {
        total: allFiveLetterWords.length,
        byLetter,
    };
}
