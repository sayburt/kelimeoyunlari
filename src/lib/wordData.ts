export type {
    WordEntry,
    WordDataFile,
    WordStats,
    WordFilter,
    SuffixCandidate,
    TopSuffixOptions,
} from './wordData/types';

export { TURKISH_ALPHABET } from './wordData/constants';
export type { TurkishLetter } from './wordData/constants';

export { loadWords, clearWordCache } from './wordData/repository';

export {
    getFilteredWords,
    getWordsByFirstLetter,
    getWordsByLastLetters,
    getWordsByLength,
    getWordsExcludingLetters,
} from './wordData/filters';

export {
    calculateWordStats,
    getWordStats,
} from './wordData/stats';

export {
    getAllPilotFilters,
    getTopSuffixes,
    getWordlePseoFilters,
    getFiveLetterWordsSummary,
} from './wordData/pseoFilters';
