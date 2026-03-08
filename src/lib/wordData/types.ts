export interface WordEntry {
    kelime: string;
    kategoriler: string[];
    zorluk_seviyesi: number;
    harf_sayisi: number;
    anlam: string;
}

export interface WordDataFile {
    metadata: {
        total_words_after_clean: number;
        last_updated: string;
    };
    words: WordEntry[];
}

export interface WordStats {
    totalCount: number;
    difficultyDistribution: Record<number, number>;
    categoryDistribution: Record<string, number>;
    averageDifficulty: number;
}

export interface WordFilter {
    startsWith?: string;
    endsWith?: string;
    length?: number;
    excludeLetters?: string[];
    category?: string;
}

export interface SuffixCandidate {
    suffix: string;
    count: number;
}

export interface TopSuffixOptions {
    length: number;
    suffixLength?: number;
    minCount?: number;
    limit?: number;
}
