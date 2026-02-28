const MIN_VOWELS = 5;
const MAX_VOWELS = 7;
const TOTAL_CELLS = 16;
const VOWELS_SET = new Set(['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü']);
const VOWELS = Array.from(VOWELS_SET);
const CONSONANTS = ['B', 'C', 'Ç', 'D', 'F', 'G', 'Ğ', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'Ş', 'T', 'V', 'Y', 'Z'];

function pickRandom(pool, count) {
    const available = [...pool];
    const picked = [];
    for (let i = 0; i < count && available.length > 0; i++) {
        const idx = Math.floor(Math.random() * available.length);
        picked.push(available[idx]);
        available.splice(idx, 1);
    }
    return picked;
}

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function hasClumpedVowels(grid) {
    const isVowel = (char) => VOWELS_SET.has(char);

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

    // Check diagonals
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[(r + 1) * 4 + c + 1]) && isVowel(grid[(r + 2) * 4 + c + 2])) {
                return true;
            }
        }
    }
    for (let r = 0; r < 2; r++) {
        for (let c = 2; c < 4; c++) {
            if (isVowel(grid[r * 4 + c]) && isVowel(grid[(r + 1) * 4 + c - 1]) && isVowel(grid[(r + 2) * 4 + c - 2])) {
                return true;
            }
        }
    }

    // Check 2x2 blocks for 4 vowels
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const vCounter = (isVowel(grid[r * 4 + c]) ? 1 : 0) +
                (isVowel(grid[r * 4 + c + 1]) ? 1 : 0) +
                (isVowel(grid[(r + 1) * 4 + c]) ? 1 : 0) +
                (isVowel(grid[(r + 1) * 4 + c + 1]) ? 1 : 0);
            if (vCounter >= 4) return true;

            // To be stricter: limit 2x2 block to max 2 vowels?
            // If vCounter >= 3? That means L-shape of 3 vowels. That's also clumping.
            // Let's add that to strictly enforce 'at most 2 vowels side by side' visually.
            if (vCounter >= 3) return true;
        }
    }
    return false;
}

let attemptsSum = 0;
let successCount = 0;
for (let i = 0; i < 1000; i++) {
    const vc = MIN_VOWELS + Math.floor(Math.random() * (MAX_VOWELS - MIN_VOWELS + 1));
    const cc = TOTAL_CELLS - vc;
    const v = pickRandom(VOWELS, vc);
    const c = pickRandom(CONSONANTS, cc);
    const letters = [...v, ...c];

    let attempts = 0;
    let grid = shuffleArray(letters);
    while (hasClumpedVowels(grid) && attempts < 100) {
        grid = shuffleArray(letters);
        attempts++;
    }
    attemptsSum += attempts;
    if (attempts < 100) successCount++;
}
console.log('Success rate:', successCount / 1000, 'Average attempts:', attemptsSum / 1000);

