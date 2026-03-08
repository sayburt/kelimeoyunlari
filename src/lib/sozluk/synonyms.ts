import { loadWords } from '@/lib/wordData/repository';

const REFERENCE_PREFIX = '►';
const TRAILING_PARENS_REGEX = /\s*\([^)]*\)\s*$/;
const EDGE_PUNCTUATION_REGEX = /^[\s:;,.\-]+|[\s:;,.\-]+$/g;

export interface SynonymPair {
    word: string;
    synonym: string;
}

export interface SynonymSummary {
    totalPairs: number;
    totalSourceWords: number;
    totalTargetWords: number;
}

let cachedPairs: SynonymPair[] | null = null;

function normalizeTurkishWord(value: string): string {
    return value
        .toLocaleLowerCase('tr-TR')
        .replace(TRAILING_PARENS_REGEX, '')
        .replace(EDGE_PUNCTUATION_REGEX, '')
        .trim();
}

function parseSynonymReference(meaning: string): string | null {
    const trimmed = meaning.trim();
    if (!trimmed.startsWith(REFERENCE_PREFIX)) return null;

    const target = trimmed.slice(REFERENCE_PREFIX.length).trim();
    if (!target) return null;

    const normalized = normalizeTurkishWord(target);
    return normalized || null;
}

export function getSynonymPairs(): SynonymPair[] {
    if (cachedPairs) return cachedPairs;

    const words = loadWords();
    const seen = new Set<string>();
    const pairs: SynonymPair[] = [];

    for (const entry of words) {
        const sourceWord = normalizeTurkishWord(entry.kelime);
        const targetWord = parseSynonymReference(entry.anlam);

        if (!sourceWord || !targetWord) continue;
        if (sourceWord === targetWord) continue;

        const dedupeKey = `${sourceWord}|${targetWord}`;
        if (seen.has(dedupeKey)) continue;

        seen.add(dedupeKey);
        pairs.push({
            word: sourceWord,
            synonym: targetWord,
        });
    }

    pairs.sort(
        (a, b) =>
            a.word.localeCompare(b.word, 'tr') ||
            a.synonym.localeCompare(b.synonym, 'tr')
    );

    cachedPairs = pairs;
    return cachedPairs;
}

export function getSynonymSummary(): SynonymSummary {
    const pairs = getSynonymPairs();
    const sourceWords = new Set<string>();
    const targetWords = new Set<string>();

    for (const pair of pairs) {
        sourceWords.add(pair.word);
        targetWords.add(pair.synonym);
    }

    return {
        totalPairs: pairs.length,
        totalSourceWords: sourceWords.size,
        totalTargetWords: targetWords.size,
    };
}
