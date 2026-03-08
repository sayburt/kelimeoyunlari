import { type WordFilter, getAllPilotFilters } from '@/lib/wordData';
import type { ValidGameId } from './slugParser';
import { generateSlugFromRules } from './slugRules';

/**
 * WordFilter'dan URL slug'i uretir.
 *
 * Ornekler:
 *  { startsWith: 'a', length: 5 } -> "a-ile-baslayan-5-harfli-kelimeler"
 *  { startsWith: 'ç' }            -> "ç-ile-baslayan-kelimeler"
 *  { endsWith: 'et', length: 5 }  -> "sonu-et-ile-biten-5-harfli-kelimeler"
 *  { excludeLetters: ['j', 'z'], length: 5 } -> "icinde-j-ve-z-olmayan-5-harfli-kelimeler"
 *  { endsWith: 'et' }             -> "sonu-et-ile-biten-kelimeler"
 *  { length: 5 }                  -> "5-harfli-kelimeler"
 */
export function generateSlug(filter: WordFilter): string {
    const slug = generateSlugFromRules(filter);
    if (!slug) {
        throw new Error(`Unsupported pSEO filter format: ${JSON.stringify(filter)}`);
    }

    return slug;
}

/**
 * Tam pSEO URL path'ini uretir.
 * Ornek: generatePseoPath('wordle', { startsWith: 'a', length: 5 })
 *        -> "/games/wordle/p/a-ile-baslayan-5-harfli-kelimeler"
 */
export function generatePseoPath(gameId: ValidGameId, filter: WordFilter): string {
    const slug = generateSlug(filter);
    return `/games/${gameId}/p/${slug}`;
}

/**
 * Pilot kapsam icin tum slug'lari uretir.
 * Her Turk harfi icin "X-ile-baslayan-5-harfli-kelimeler" slugi.
 */
export function generatePilotSlugs(): string[] {
    return getAllPilotFilters().map((filter) => generateSlug(filter));
}
