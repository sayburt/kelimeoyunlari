export const TURKISH_ALPHABET = [
    'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h',
    'i', 'ı', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p',
    'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z',
] as const;

export type TurkishLetter = typeof TURKISH_ALPHABET[number];
