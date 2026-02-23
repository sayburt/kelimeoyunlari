import { LetterState } from '@/components/game/LetterCell';

/**
 * Bir tahmin kelimesini hedef kelimeyle karşılaştırarak
 * her harf için durum (correct / present / absent) döner.
 *
 * Pure function — herhangi bir dış state'e bağımlı değildir.
 */
export function evaluateGuess(guess: string, target: string): LetterState[] {
    const guessArr = guess.split('');
    const targetArr = target.split('');
    const states: LetterState[] = new Array(guess.length).fill('absent');

    // Önce doğrudan doğru olan harfleri (yeşil) bul
    for (let i = 0; i < guessArr.length; i++) {
        if (guessArr[i] === targetArr[i]) {
            states[i] = 'correct';
            targetArr[i] = '*'; // Kullanılmış olarak işaretle
            guessArr[i] = '*';  // Değerlendirilmiş olarak işaretle
        }
    }

    // Sonra yanlış yerde ama olan harfleri (sarı) bul
    for (let i = 0; i < guessArr.length; i++) {
        if (guessArr[i] !== '*') {
            const targetIndex = targetArr.indexOf(guessArr[i]);
            if (targetIndex !== -1) {
                states[i] = 'present';
                targetArr[targetIndex] = '*'; // Kullanılmış olarak işaretle
            }
        }
    }

    return states;
}
