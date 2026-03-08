import { getFilteredWords } from './filters';
import type { WordEntry, WordFilter, WordStats } from './types';

export function calculateWordStats(words: WordEntry[]): WordStats {
    const difficultyDistribution: Record<number, number> = {};
    const categoryDistribution: Record<string, number> = {};
    let totalDifficulty = 0;

    for (const word of words) {
        difficultyDistribution[word.zorluk_seviyesi] =
            (difficultyDistribution[word.zorluk_seviyesi] || 0) + 1;
        totalDifficulty += word.zorluk_seviyesi;

        for (const category of word.kategoriler) {
            categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
        }
    }

    return {
        totalCount: words.length,
        difficultyDistribution,
        categoryDistribution,
        averageDifficulty: words.length > 0 ? totalDifficulty / words.length : 0,
    };
}

export function getWordStats(filter: WordFilter): WordStats {
    return calculateWordStats(getFilteredWords(filter));
}
