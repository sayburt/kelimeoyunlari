import type { WordFilter } from '@/lib/wordData';

const LETTER_DISPLAY_MAP: Record<string, string> = {
    a: 'A', b: 'B', c: 'C', 'ç': 'Ç', d: 'D',
    e: 'E', f: 'F', g: 'G', 'ğ': 'Ğ', h: 'H',
    i: 'İ', 'ı': 'I', j: 'J', k: 'K', l: 'L',
    m: 'M', n: 'N', o: 'O', 'ö': 'Ö', p: 'P',
    r: 'R', s: 'S', 'ş': 'Ş', t: 'T', u: 'U',
    'ü': 'Ü', v: 'V', y: 'Y', z: 'Z',
};

export function getDisplayLetter(letter: string): string {
    return LETTER_DISPLAY_MAP[letter] || letter.toLocaleUpperCase('tr-TR');
}

export interface SlugParseResult {
    filter: WordFilter;
    displayTitle: string;
}

interface SlugRule {
    id: string;
    parse: (slug: string) => SlugParseResult | null;
    match: (filter: WordFilter) => boolean;
    build: (filter: WordFilter) => string;
}

function normalizeExcludeLetters(letters: string[]): string[] {
    return [...letters]
        .map((letter) => letter.toLocaleLowerCase('tr-TR'))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'tr'));
}

function parseExcludeLetters(part: string): string[] {
    return part
        .split('-ve-')
        .map((letter) => letter.toLocaleLowerCase('tr-TR'))
        .filter(Boolean);
}

function formatDisplayLetters(letters: string[]): string {
    return letters.map((letter) => getDisplayLetter(letter)).join(' ve ');
}

const SLUG_RULES: SlugRule[] = [
    {
        id: 'exclude-length',
        parse: (slug) => {
            const match = slug.match(/^icinde-(.+)-olmayan-(\d+)-harfli-kelimeler$/);
            if (!match) return null;

            const excludeLetters = parseExcludeLetters(match[1]);
            const length = Number.parseInt(match[2], 10);
            if (!excludeLetters.length || Number.isNaN(length)) return null;

            const normalized = normalizeExcludeLetters(excludeLetters);
            return {
                filter: { excludeLetters: normalized, length },
                displayTitle: `Icinde ${formatDisplayLetters(normalized)} Olmayan ${length} Harfli Kelimeler`,
            };
        },
        match: (filter) =>
            !filter.startsWith
            && !filter.endsWith
            && !!filter.length
            && !!filter.excludeLetters?.length,
        build: (filter) => {
            const letters = normalizeExcludeLetters(filter.excludeLetters || []);
            return `icinde-${letters.join('-ve-')}-olmayan-${filter.length}-harfli-kelimeler`;
        },
    },
    {
        id: 'exclude-only',
        parse: (slug) => {
            const match = slug.match(/^icinde-(.+)-olmayan-kelimeler$/);
            if (!match) return null;

            const excludeLetters = parseExcludeLetters(match[1]);
            if (!excludeLetters.length) return null;

            const normalized = normalizeExcludeLetters(excludeLetters);
            return {
                filter: { excludeLetters: normalized },
                displayTitle: `Icinde ${formatDisplayLetters(normalized)} Olmayan Kelimeler`,
            };
        },
        match: (filter) =>
            !filter.startsWith
            && !filter.endsWith
            && !filter.length
            && !!filter.excludeLetters?.length,
        build: (filter) => {
            const letters = normalizeExcludeLetters(filter.excludeLetters || []);
            return `icinde-${letters.join('-ve-')}-olmayan-kelimeler`;
        },
    },
    {
        id: 'starts-length',
        parse: (slug) => {
            const match = slug.match(/^(.+?)-ile-baslayan-(\d+)-harfli-kelimeler$/);
            if (!match) return null;

            const startsWith = match[1];
            const length = Number.parseInt(match[2], 10);
            if (Number.isNaN(length)) return null;

            return {
                filter: { startsWith, length },
                displayTitle: `${getDisplayLetter(startsWith)} ile Başlayan ${length} Harfli Kelimeler`,
            };
        },
        match: (filter) =>
            !!filter.startsWith
            && !!filter.length
            && !filter.endsWith
            && !filter.excludeLetters?.length,
        build: (filter) => `${filter.startsWith}-ile-baslayan-${filter.length}-harfli-kelimeler`,
    },
    {
        id: 'starts-only',
        parse: (slug) => {
            const match = slug.match(/^(.+?)-ile-baslayan-kelimeler$/);
            if (!match) return null;

            const startsWith = match[1];
            return {
                filter: { startsWith },
                displayTitle: `${getDisplayLetter(startsWith)} ile Başlayan Kelimeler`,
            };
        },
        match: (filter) =>
            !!filter.startsWith
            && !filter.length
            && !filter.endsWith
            && !filter.excludeLetters?.length,
        build: (filter) => `${filter.startsWith}-ile-baslayan-kelimeler`,
    },
    {
        id: 'ends-length',
        parse: (slug) => {
            const match = slug.match(/^sonu-(.+?)-ile-biten-(\d+)-harfli-kelimeler$/);
            if (!match) return null;

            const endsWith = match[1];
            const length = Number.parseInt(match[2], 10);
            if (Number.isNaN(length)) return null;

            return {
                filter: { endsWith, length },
                displayTitle: `Sonu ${endsWith.toLocaleUpperCase('tr-TR')} ile Biten ${length} Harfli Kelimeler`,
            };
        },
        match: (filter) =>
            !filter.startsWith
            && !!filter.endsWith
            && !!filter.length
            && !filter.excludeLetters?.length,
        build: (filter) => `sonu-${filter.endsWith}-ile-biten-${filter.length}-harfli-kelimeler`,
    },
    {
        id: 'ends-only',
        parse: (slug) => {
            const match = slug.match(/^sonu-(.+?)-ile-biten-kelimeler$/);
            if (!match) return null;

            const endsWith = match[1];
            return {
                filter: { endsWith },
                displayTitle: `Sonu ${endsWith.toLocaleUpperCase('tr-TR')} ile Biten Kelimeler`,
            };
        },
        match: (filter) =>
            !filter.startsWith
            && !!filter.endsWith
            && !filter.length
            && !filter.excludeLetters?.length,
        build: (filter) => `sonu-${filter.endsWith}-ile-biten-kelimeler`,
    },
    {
        id: 'length-only',
        parse: (slug) => {
            const match = slug.match(/^(\d+)-harfli-kelimeler$/);
            if (!match) return null;

            const length = Number.parseInt(match[1], 10);
            if (Number.isNaN(length)) return null;

            return {
                filter: { length },
                displayTitle: `${length} Harfli Kelimeler`,
            };
        },
        match: (filter) =>
            !filter.startsWith
            && !filter.endsWith
            && !!filter.length
            && !filter.excludeLetters?.length,
        build: (filter) => `${filter.length}-harfli-kelimeler`,
    },
];

export function parseSlugWithRules(slug: string): SlugParseResult | null {
    for (const rule of SLUG_RULES) {
        const parsed = rule.parse(slug);
        if (parsed) return parsed;
    }

    return null;
}

export function generateSlugFromRules(filter: WordFilter): string | null {
    const matchedRule = SLUG_RULES.find((rule) => rule.match(filter));
    return matchedRule ? matchedRule.build(filter) : null;
}
