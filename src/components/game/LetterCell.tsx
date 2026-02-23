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
            stateClasses = 'bg-slate-900 border-slate-700 text-transparent';
            break;
        case 'filled':
            stateClasses = 'bg-slate-800 border-slate-500 text-gray-200';
            break;
        case 'correct':
            stateClasses = 'bg-green-500 border-green-500 text-white';
            break;
        case 'present':
            stateClasses = 'bg-yellow-500 border-yellow-500 text-white';
            break;
        case 'absent':
            stateClasses = 'bg-slate-700 border-slate-700 text-slate-300';
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
