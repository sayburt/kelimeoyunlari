import React from 'react';

export type LetterState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface LetterCellProps {
    letter?: string;
    state?: LetterState;
}

export function LetterCell({ letter, state = 'empty' }: LetterCellProps) {
    let stateClasses = '';

    switch (state) {
        case 'empty':
            stateClasses = 'bg-surface-dark border-surface-mid text-transparent';
            break;
        case 'filled':
            stateClasses = 'bg-surface border-surface-hover text-text-main';
            break;
        case 'correct':
            stateClasses = 'bg-correct border-correct text-text-on-state';
            break;
        case 'present':
            stateClasses = 'bg-present border-present text-text-on-state';
            break;
        case 'absent':
            stateClasses = 'bg-absent border-absent text-text-secondary';
            break;
    }

    return (
        <div
            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-xl text-3xl font-bold uppercase transition-all duration-300 select-none ${stateClasses}`}
        >
            {letter}
        </div>
    );
}
