import React from 'react';
import { Delete } from 'lucide-react';
import { LetterState } from './LetterCell';

export interface GameKeyboardProps {
    onKeyPress: (key: string) => void;
    onEnter: () => void;
    onDelete: () => void;
    keyStates: Record<string, LetterState>;
}

const KEYBOARD_ROWS = [
    ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H'],
    ['I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P'],
    ['ENTER', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z', 'DEL'],
];

export function GameKeyboard({
    onKeyPress,
    onEnter,
    onDelete,
    keyStates,
}: GameKeyboardProps) {
    const getKeyClasses = (key: string) => {
        const state = keyStates[key];

        let baseClasses =
            'flex items-center justify-center font-bold rounded-lg cursor-pointer transition-all duration-150 select-none px-1 py-3 sm:p-4 text-xs sm:text-sm flex-1 shadow-sm';

        if (key === 'ENTER' || key === 'DEL') {
            baseClasses += ' bg-surface-accent hover:bg-surface-accent-hover text-text-on-state min-w-[3.5rem] sm:min-w-[4rem] active:scale-95 active:shadow-none';
            return baseClasses;
        }

        baseClasses += ' min-w-[1.4rem] sm:min-w-[2.5rem]';

        switch (state) {
            case 'correct':
                baseClasses += ' bg-correct hover:bg-correct-hover text-text-on-state active:scale-95';
                break;
            case 'present':
                baseClasses += ' bg-present hover:bg-present-hover text-text-on-state active:scale-95';
                break;
            case 'absent':
                baseClasses += ' bg-absent hover:bg-surface-hover text-text-muted';
                break;
            default:
                baseClasses += ' bg-surface-mid hover:bg-surface-hover text-text-main active:scale-95 active:shadow-none';
                break;
        }

        return baseClasses;
    };


    const handleKeyClick = (key: string) => {
        if (key === 'ENTER') {
            onEnter();
        } else if (key === 'DEL') {
            onDelete();
        } else {
            onKeyPress(key);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-1.5 sm:gap-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 w-full px-0.5">
                    {row.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleKeyClick(key)}
                            className={getKeyClasses(key)}
                        >
                            {key === 'DEL' ? <Delete size={20} /> : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
