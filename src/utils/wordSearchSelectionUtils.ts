export const WORD_SEARCH_WORD_REGEX = /^[A-ZÇĞİIÖŞÜ]+$/;
export const RECENT_WORD_MEMORY_LIMIT = 80;
export const CANDIDATE_WORD_BUFFER = 8;

export function shuffleWords<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function normalizeWordSearchWord(word: string): string {
    return word.toLocaleUpperCase('tr-TR');
}

export function isWordSearchWordValid(word: string, min: number, max: number, size: number): boolean {
    return WORD_SEARCH_WORD_REGEX.test(word) && word.length >= min && word.length <= Math.min(max, size);
}

interface SelectCandidateWordsParams {
    wordsByLength: Map<number, string[]>;
    minLength: number;
    maxLength: number;
    desiredCount: number;
    recentWords: string[];
}

export function selectCandidateWords({
    wordsByLength,
    minLength,
    maxLength,
    desiredCount,
    recentWords,
}: SelectCandidateWordsParams): string[] {
    const recentSet = new Set(recentWords);
    const freshPool: string[] = [];
    const fallbackPool: string[] = [];

    for (let length = minLength; length <= maxLength; length++) {
        const words = wordsByLength.get(length) ?? [];
        const shuffledWords = shuffleWords(words);

        for (const word of shuffledWords) {
            if (recentSet.has(word)) {
                fallbackPool.push(word);
            } else {
                freshPool.push(word);
            }
        }
    }

    const mergedPool = [...shuffleWords(freshPool), ...shuffleWords(fallbackPool)];
    const targetPoolSize = desiredCount + CANDIDATE_WORD_BUFFER;
    const selected: string[] = [];
    const seen = new Set<string>();

    for (const word of mergedPool) {
        if (seen.has(word)) {
            continue;
        }

        selected.push(word);
        seen.add(word);

        if (selected.length >= targetPoolSize) {
            break;
        }
    }

    return selected;
}
