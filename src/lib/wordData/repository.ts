import fs from 'fs';
import path from 'path';
import type { WordDataFile, WordEntry } from './types';

let cachedWords: WordEntry[] | null = null;

export function loadWords(): WordEntry[] {
    if (cachedWords) return cachedWords;

    const filePath = path.join(process.cwd(), 'public', 'kelime-data.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: WordDataFile = JSON.parse(raw);
    cachedWords = data.words;
    return cachedWords;
}

export function clearWordCache() {
    cachedWords = null;
}
