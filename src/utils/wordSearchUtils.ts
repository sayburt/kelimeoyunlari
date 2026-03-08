export interface WordSearchDirection {
    dr: number;
    dc: number;
}

export interface WordSearchPlacement {
    word: string;
    cells: number[];
    start: { row: number; col: number };
    end: { row: number; col: number };
    direction: WordSearchDirection;
}

export interface WordSearchGridResult {
    grid: string[];
    placements: WordSearchPlacement[];
}

const TURKISH_UPPERCASE_LETTERS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

const WORD_DIRECTIONS: WordSearchDirection[] = [
    { dr: 0, dc: 1 },
    { dr: 0, dc: -1 },
    { dr: 1, dc: 0 },
    { dr: -1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: -1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: -1 },
];

const MAX_PLACEMENT_ATTEMPTS = 1200;

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function isInsideGrid(row: number, col: number, size: number): boolean {
    return row >= 0 && row < size && col >= 0 && col < size;
}

function canPlaceWord(
    matrix: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: WordSearchDirection
): boolean {
    const size = matrix.length;

    for (let i = 0; i < word.length; i++) {
        const row = startRow + direction.dr * i;
        const col = startCol + direction.dc * i;

        if (!isInsideGrid(row, col, size)) {
            return false;
        }

        const currentCell = matrix[row][col];
        if (currentCell !== '' && currentCell !== word[i]) {
            return false;
        }
    }

    return true;
}

function writeWord(
    matrix: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: WordSearchDirection
): number[] {
    const size = matrix.length;
    const cells: number[] = [];

    for (let i = 0; i < word.length; i++) {
        const row = startRow + direction.dr * i;
        const col = startCol + direction.dc * i;
        matrix[row][col] = word[i];
        cells.push(row * size + col);
    }

    return cells;
}

export function placeWords(matrix: string[][], words: string[], targetCount?: number): WordSearchPlacement[] {
    const size = matrix.length;
    const placements: WordSearchPlacement[] = [];

    // Önce uzun kelimeleri yerleştirmek başarım oranını artırır.
    const orderedWords = shuffle(words).sort((a, b) => b.length - a.length);

    for (const word of orderedWords) {
        if (typeof targetCount === 'number' && placements.length >= targetCount) {
            break;
        }

        let placed = false;

        for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
            const direction = WORD_DIRECTIONS[randomInt(WORD_DIRECTIONS.length)];
            const startRow = randomInt(size);
            const startCol = randomInt(size);

            if (!canPlaceWord(matrix, word, startRow, startCol, direction)) {
                continue;
            }

            const cells = writeWord(matrix, word, startRow, startCol, direction);
            const endRow = startRow + direction.dr * (word.length - 1);
            const endCol = startCol + direction.dc * (word.length - 1);

            placements.push({
                word,
                cells,
                start: { row: startRow, col: startCol },
                end: { row: endRow, col: endCol },
                direction,
            });

            placed = true;
            break;
        }

        if (!placed) {
            continue;
        }
    }

    return placements;
}

export function fillRandomLetters(matrix: string[][]): void {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === '') {
                matrix[row][col] = TURKISH_UPPERCASE_LETTERS[randomInt(TURKISH_UPPERCASE_LETTERS.length)];
            }
        }
    }
}

export function generateGrid(size: number, words: string[], targetCount?: number): WordSearchGridResult {
    const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));

    const placements = placeWords(matrix, words, targetCount);
    fillRandomLetters(matrix);

    return {
        grid: matrix.flat(),
        placements,
    };
}

export function getLineIndices(startIndex: number, endIndex: number, gridSize: number): number[] | null {
    const startRow = Math.floor(startIndex / gridSize);
    const startCol = startIndex % gridSize;
    const endRow = Math.floor(endIndex / gridSize);
    const endCol = endIndex % gridSize;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    if (rowDiff === 0 && colDiff === 0) {
        return [startIndex];
    }

    const isStraightLine = rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);
    if (!isStraightLine) {
        return null;
    }

    const stepRow = Math.sign(rowDiff);
    const stepCol = Math.sign(colDiff);
    const stepCount = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

    const indices: number[] = [];
    for (let i = 0; i <= stepCount; i++) {
        const row = startRow + stepRow * i;
        const col = startCol + stepCol * i;
        indices.push(row * gridSize + col);
    }

    return indices;
}
