import React from 'react';
import { LetterState } from '@/hooks/useHangman';

interface HangmanKeyboardProps {
    onKeyPress: (key: string) => void;
    keyboardState: Record<string, LetterState>;
    disabled?: boolean;
}

const KEYBOARD_ROWS = [
    ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H'],
    ['I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P'],
    ['R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'],
];

export function HangmanKeyboard({ onKeyPress, keyboardState, disabled = false }: HangmanKeyboardProps) {
    const handleKeyClick = (key: string) => {
        if (!disabled && keyboardState[key] !== 'correct' && keyboardState[key] !== 'absent') {
            onKeyPress(key);
        }
    };

    const getKeyClasses = (key: string, isLastRow: boolean) => {
        const state = keyboardState[key];

        let base =
            'flex items-center justify-center font-bold rounded-lg transition-all duration-150 select-none shadow-sm flex-1';

        // Tuş boyutu: 3. satır biraz daha geniş/yüksek
        base += isLastRow
            ? ' px-1 py-3.5 sm:p-4 text-sm sm:text-base min-w-[2rem] sm:min-w-[3rem]'
            : ' px-1 py-3 sm:p-4 text-xs sm:text-sm min-w-[1.4rem] sm:min-w-[2.5rem]';

        if (state === 'correct') {
            base += ' bg-correct text-text-on-state opacity-90 cursor-default';
        } else if (state === 'absent') {
            base += ' bg-absent text-text-muted opacity-60 cursor-default shadow-none';
        } else if (disabled) {
            base += ' bg-surface-mid text-text-main opacity-50 cursor-not-allowed shadow-none';
        } else {
            base += ' bg-surface-mid hover:bg-surface-hover text-text-main active:translate-y-px active:shadow-none cursor-pointer';
        }

        return base;
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-1.5 sm:gap-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => {
                const isLastRow = rowIndex === KEYBOARD_ROWS.length - 1;
                return (
                    <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 w-full px-0.5">
                        {row.map((key) => (
                            <button
                                key={key}
                                disabled={disabled || keyboardState[key] === 'correct' || keyboardState[key] === 'absent'}
                                onClick={() => handleKeyClick(key)}
                                className={getKeyClasses(key, isLastRow)}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
