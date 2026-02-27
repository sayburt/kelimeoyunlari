import { GRID_SIZE, MIN_VOWELS, MAX_VOWELS, TOTAL_CELLS, VOWEL_POOL, CONSONANT_POOL } from '../constants/boggleConstants';

export function pickRandom<T>(pool: T[], count: number): T[] {
    const available = [...pool];
    const picked: T[] = [];
    for (let i = 0; i < count && available.length > 0; i++) {
        const idx = Math.floor(Math.random() * available.length);
        picked.push(available[idx]);
        available.splice(idx, 1);
    }
    return picked;
}

export function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function generateGrid(): string[] {
    // 5-7 arası rastgele sesli harf sayısı belirle
    const vowelCount = MIN_VOWELS + Math.floor(Math.random() * (MAX_VOWELS - MIN_VOWELS + 1));
    const consonantCount = TOTAL_CELLS - vowelCount;

    const vowels = pickRandom(VOWEL_POOL, vowelCount);
    const consonants = pickRandom(CONSONANT_POOL, consonantCount);

    // Birleştir ve karıştır
    return shuffleArray([...vowels, ...consonants]);
}

export function getNeighbors(index: number): number[] {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors: number[] = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                neighbors.push(nr * GRID_SIZE + nc);
            }
        }
    }

    return neighbors;
}
