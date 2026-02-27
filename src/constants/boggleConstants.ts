export const GAME_NAME = 'boggle';
export const GRID_SIZE = 4;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
export const GAME_DURATION = 180_000; // 3 dakika (ms)
export const MIN_WORD_LENGTH = 3;
export const MIN_VOWELS = 5;
export const MAX_VOWELS = 7;

// Türkçe sesli harfler — gerçek frekansa yakın ağırlıklar
export const VOWEL_POOL = [
    ...'AAAAAAA'.split(''),    // 7  — en sık sesli
    ...'EEEEEEE'.split(''),    // 7
    ...'İİİİİ'.split(''),      // 5
    ...'IIII'.split(''),        // 4  (ı harfi büyük hali)
    ...'UUU'.split(''),         // 3
    ...'ÜÜÜ'.split(''),        // 3
    ...'OOO'.split(''),         // 3
    ...'ÖÖ'.split(''),          // 2
];

// Türkçe sessiz harfler — gerçek frekansa yakın ağırlıklar
export const CONSONANT_POOL = [
    ...'RRRRR'.split(''),       // 5
    ...'NNNNN'.split(''),       // 5
    ...'LLLLL'.split(''),       // 5
    ...'KKKK'.split(''),        // 4
    ...'TTTT'.split(''),        // 4
    ...'SSSS'.split(''),        // 4
    ...'DDDD'.split(''),        // 4
    ...'MMMM'.split(''),        // 4
    ...'YYY'.split(''),         // 3
    ...'BBB'.split(''),         // 3
    ...'ŞŞ'.split(''),          // 2
    ...'ÇÇ'.split(''),          // 2
    ...'HH'.split(''),          // 2
    ...'GG'.split(''),          // 2
    ...'ZZ'.split(''),          // 2
    ...'VV'.split(''),          // 2
    'P',                        // 1
    'Ğ',                        // 1
    'C',                        // 1
    'F',                        // 1
];
