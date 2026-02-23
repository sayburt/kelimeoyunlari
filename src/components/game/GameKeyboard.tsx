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
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'DEL'],
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
            'flex items-center justify-center font-bold rounded-lg cursor-pointer transition-colors duration-150 select-none px-2 py-4 sm:p-4 text-xs sm:text-sm';

        if (key === 'ENTER' || key === 'DEL') {
            baseClasses += ' bg-surface-accent hover:bg-surface-accent-hover text-text-on-state min-w-[3.5rem]';
            return baseClasses;
        }

        baseClasses += ' min-w-[2rem] sm:min-w-[2.5rem]';

        switch (state) {
            case 'correct':
                baseClasses += ' bg-correct hover:bg-correct-hover text-text-on-state';
                break;
            case 'present':
                baseClasses += ' bg-present hover:bg-present-hover text-text-on-state';
                break;
            case 'absent':
                baseClasses += ' bg-absent hover:bg-surface-hover text-text-muted';
                break;
            default:
                baseClasses += ' bg-surface-mid hover:bg-surface-hover text-text-main';
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
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
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
