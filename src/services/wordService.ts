"use client";

export interface Word {
    kelime: string;
    kategoriler: string[];
    zorluk_seviyesi: number;
    harf_sayisi: number;
    anlam: string;
}

export interface WordMetadata {
    total_words_after_clean: number;
    last_updated: string;
}

export interface KelimeData {
    metadata: WordMetadata;
    words: Word[];
}

class WordService {
    private data: KelimeData | null = null;
    private dataPromise: Promise<KelimeData> | null = null;

    private async loadData(): Promise<KelimeData> {
        if (this.data) return this.data;
        if (this.dataPromise) return this.dataPromise;

        this.dataPromise = fetch('/kelime-data.json')
            .then(res => {
                if (!res.ok) throw new Error('Kelime verisi yüklenemedi');
                return res.json();
            })
            .then(json => {
                this.data = json;
                return json;
            });

        return this.dataPromise;
    }

    /**
     * Rastgele bir kelime döner. Filtreleme kriterlerine göre.
     */
    async getRandomWord(filters?: {
        length?: number;
        category?: string;
        difficulty?: number;
    }): Promise<Word | null> {
        const { words } = await this.loadData();

        let filteredWords = words;

        if (filters?.length) {
            filteredWords = filteredWords.filter(w => w.harf_sayisi === filters.length);
        }

        if (filters?.category) {
            const filterCategoryUpper = filters.category.toLocaleUpperCase('tr-TR');
            filteredWords = filteredWords.filter(w =>
                w.kategoriler.some(cat => cat.toLocaleUpperCase('tr-TR') === filterCategoryUpper)
            );
        }

        if (filters?.difficulty) {
            filteredWords = filteredWords.filter(w => w.zorluk_seviyesi === filters.difficulty);
        }

        if (filteredWords.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        return filteredWords[randomIndex];
    }

    /**
     * Kelimenin sözlükte olup olmadığını kontrol eder.
     */
    async isValidWord(word: string): Promise<boolean> {
        const { words } = await this.loadData();
        const upperWord = word.toLocaleUpperCase('tr-TR');

        return words.some(w => w.kelime.toLocaleUpperCase('tr-TR') === upperWord);
    }

    /**
     * Belirli bir uzunluktaki tüm kelimeleri döner.
     */
    async getWordsByLength(length: number): Promise<Word[]> {
        const { words } = await this.loadData();
        return words.filter(w => w.harf_sayisi === length);
    }

    /**
     * Tüm kategorileri döner.
     */
    async getCategories(): Promise<string[]> {
        const { words } = await this.loadData();
        const categories = new Set<string>();
        words.forEach(w => w.kategoriler.forEach(cat => categories.add(cat)));
        return Array.from(categories);
    }
}

export const wordService = new WordService();
