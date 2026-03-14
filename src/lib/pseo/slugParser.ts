import type { WordFilter } from '@/lib/wordData';
import { getDisplayLetter, parseSlugWithRules } from './slugRules';

export interface ParsedSlug {
    filter: WordFilter;
    displayTitle: string;
    gameId: string;
    isValid: boolean;
}

const VALID_GAME_IDS = ['wordle', 'adam-asmaca', 'boggle', 'kelime-arama', 'kelime-merdiveni'] as const;
export type ValidGameId = typeof VALID_GAME_IDS[number];

export function isValidGameId(id: string): id is ValidGameId {
    return (VALID_GAME_IDS as readonly string[]).includes(id);
}

export function parseSlug(slug: string, gameId: string): ParsedSlug {
    const invalid: ParsedSlug = {
        filter: {},
        displayTitle: '',
        gameId,
        isValid: false,
    };

    if (!isValidGameId(gameId)) {
        return invalid;
    }

    const parsed = parseSlugWithRules(slug);
    if (!parsed) return invalid;

    // Slug icerigine gore gameId belirle
    let detectedGameId = gameId;
    if (slug.includes('merdiveni')) {
        detectedGameId = 'kelime-merdiveni';
    }

    return {
        filter: parsed.filter,
        displayTitle: parsed.displayTitle,
        gameId: detectedGameId,
        isValid: true,
    };
}

export { getDisplayLetter };
