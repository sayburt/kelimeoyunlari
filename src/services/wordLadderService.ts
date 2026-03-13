'use client';

import { wordService } from './wordService';

export interface WordPair {
    start: string;
    target: string;
    optimalSteps: number;
}

/**
 * İki kelime arasında sadece 1 harf farkı olup olmadığını kontrol eder.
 */
export function isOneLetterAway(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diffCount = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            diffCount++;
            if (diffCount > 1) return false;
        }
    }
    return diffCount === 1;
}

/**
 * BFS ile start → target arasındaki en kısa kelime yolunu bulur.
 * Boş dizi döndürürse yol bulunamadı demektir.
 */
export function findShortestPath(
    start: string,
    target: string,
    wordSet: Set<string>
): string[] {
    const startUpper = start.toLocaleUpperCase('tr-TR');
    const targetUpper = target.toLocaleUpperCase('tr-TR');

    if (startUpper === targetUpper) return [startUpper];
    if (!wordSet.has(startUpper) || !wordSet.has(targetUpper)) return [];

    const queue: string[][] = [[startUpper]];
    const visited = new Set<string>([startUpper]);

    while (queue.length > 0) {
        const path = queue.shift()!;
        const current = path[path.length - 1];

        for (const word of wordSet) {
            if (!visited.has(word) && isOneLetterAway(current, word)) {
                const newPath = [...path, word];
                if (word === targetUpper) {
                    return newPath;
                }
                visited.add(word);
                queue.push(newPath);
            }
        }
    }

    return [];
}

/**
 * Bir kelime uzunluğuna göre word set döner.
 */
async function getWordSetByLength(length: number): Promise<Set<string>> {
    const words = await wordService.getWordsByLength(length);
    return new Set(words.map(w => w.kelime.toLocaleUpperCase('tr-TR')));
}

/**
 * Optimal adım sayısını döner (BFS path length - 1).
 */
export async function getOptimalSteps(start: string, target: string): Promise<number> {
    const wordSet = await getWordSetByLength(start.length);
    const path = findShortestPath(start, target, wordSet);
    return path.length > 0 ? path.length - 1 : -1;
}

/**
 * Belirlenen kelime uzunluğunda, aralarında BFS yolu olan rastgele bir başlangıç/hedef çifti döner.
 * Min 2, Max 6 optimal adım olan çift aranır.
 */
export async function getWordPair(length: number = 4): Promise<WordPair | null> {
    const words = await wordService.getWordsByLength(length);
    if (words.length < 10) return null;

    const wordList = words.map(w => w.kelime.toLocaleUpperCase('tr-TR'));
    const wordSet = new Set(wordList);

    const MAX_ATTEMPTS = 80;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const startIdx = Math.floor(Math.random() * wordList.length);
        const targetIdx = Math.floor(Math.random() * wordList.length);
        if (startIdx === targetIdx) continue;

        const start = wordList[startIdx];
        const target = wordList[targetIdx];

        const path = findShortestPath(start, target, wordSet);
        const optimalSteps = path.length - 1;

        if (optimalSteps >= 2 && optimalSteps <= 6) {
            return { start, target, optimalSteps };
        }
    }

    return null;
}
