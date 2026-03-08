import { loadWords } from './repository';
import type { WordEntry, WordFilter } from './types';

export function getFilteredWords(filter: WordFilter): WordEntry[] {
    let words = loadWords();

    if (filter.length) {
        words = words.filter((word) => word.harf_sayisi === filter.length);
    }

    if (filter.startsWith) {
        const prefix = filter.startsWith.toLocaleLowerCase('tr-TR');
        words = words.filter((word) =>
            word.kelime.toLocaleLowerCase('tr-TR').startsWith(prefix)
        );
    }

    if (filter.endsWith) {
        const suffix = filter.endsWith.toLocaleLowerCase('tr-TR');
        words = words.filter((word) =>
            word.kelime.toLocaleLowerCase('tr-TR').endsWith(suffix)
        );
    }

    if (filter.excludeLetters && filter.excludeLetters.length > 0) {
        const excluded = filter.excludeLetters.map((letter) => letter.toLocaleLowerCase('tr-TR'));
        words = words.filter((word) => {
            const lower = word.kelime.toLocaleLowerCase('tr-TR');
            return !excluded.some((letter) => lower.includes(letter));
        });
    }

    const category = filter.category;
    if (category) {
        words = words.filter((word) => word.kategoriler.includes(category));
    }

    return words;
}

export function getWordsByFirstLetter(letter: string, length?: number): WordEntry[] {
    return getFilteredWords({ startsWith: letter, length });
}

export function getWordsByLastLetters(suffix: string, length?: number): WordEntry[] {
    return getFilteredWords({ endsWith: suffix, length });
}

export function getWordsByLength(length: number): WordEntry[] {
    return getFilteredWords({ length });
}

export function getWordsExcludingLetters(excludeLetters: string[], length?: number): WordEntry[] {
    return getFilteredWords({ excludeLetters, length });
}
