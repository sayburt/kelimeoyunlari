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

const VOWELS_SET = new Set(['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü']);

function hasClumpedVowels(grid: string[]): boolean {
    const isVowel = (char: string) => VOWELS_SET.has(char);

    // Check rows for 3 adjacent vowels
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[r * 4 + c + 1]) && isVowel(grid[r * 4 + c + 2])) {
                return true;
            }
        }
    }

    // Check columns for 3 adjacent vowels
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 2; r++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[(r + 1) * 4 + c]) && isVowel(grid[(r + 2) * 4 + c])) {
                return true;
            }
        }
    }

    // Check diagonals for 3 adjacent vowels
    for (let r = 0; r < 2; r++) {
        // Top-left to bottom-right
        for (let c = 0; c < 2; c++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[(r + 1) * 4 + c + 1]) && isVowel(grid[(r + 2) * 4 + c + 2])) {
                return true;
            }
        }
        // Top-right to bottom-left
        for (let c = 2; c < 4; c++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[(r + 1) * 4 + c - 1]) && isVowel(grid[(r + 2) * 4 + c - 2])) {
                return true;
            }
        }
    }

    // Check 2x2 blocks for 3 or more vowels
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const vCount = (isVowel(grid[r * 4 + c]) ? 1 : 0) +
                (isVowel(grid[r * 4 + c + 1]) ? 1 : 0) +
                (isVowel(grid[(r + 1) * 4 + c]) ? 1 : 0) +
                (isVowel(grid[(r + 1) * 4 + c + 1]) ? 1 : 0);
            if (vCount >= 3) {
                return true;
            }
        }
    }

    return false;
}

export function generateGrid(): string[] {
    // 5-7 arası rastgele sesli harf sayısı belirle
    const vowelCount = MIN_VOWELS + Math.floor(Math.random() * (MAX_VOWELS - MIN_VOWELS + 1));
    const consonantCount = TOTAL_CELLS - vowelCount;

    const vowels = pickRandom(VOWEL_POOL, vowelCount);
    const consonants = pickRandom(CONSONANT_POOL, consonantCount);
    const letters = [...vowels, ...consonants];

    // Birleştir ve karıştır, ardından sesli harf öbekleşmesini (clumping) kontrol et
    let grid = shuffleArray(letters);
    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    // Mümkün olduğunca sesli harflerin yan yana (3'lü veya 2x2 blokta 3'ten fazla) gelmesini engelle
    while (hasClumpedVowels(grid) && attempts < MAX_ATTEMPTS) {
        grid = shuffleArray(letters);
        attempts++;
    }

    return grid;
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
