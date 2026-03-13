'use client';

import React from 'react';

interface WordLadderStepRowProps {
    word: string;
    wordLength: number;
    changedIndex?: number; // hangi harf değişti (confirmed adımlar için)
    variant: 'start' | 'target' | 'confirmed' | 'current' | 'empty';
    currentInput?: string; // 'current' varyantı için aktif input
}

export function WordLadderStepRow({
    word,
    wordLength,
    changedIndex,
    variant,
    currentInput = '',
}: WordLadderStepRowProps) {
    const letters = variant === 'current'
        ? Array.from({ length: wordLength }, (_, i) => currentInput[i] || '')
        : word.split('');

    return (
        <div className="flex gap-2 items-center justify-center">
            {letters.map((letter, i) => {
                let cellClass = '';

                if (variant === 'start') {
                    cellClass = 'bg-surface border-2 border-primary/40 text-primary font-black';
                } else if (variant === 'target') {
                    cellClass = 'bg-surface border-2 border-primary text-primary font-black animate-pulse';
                } else if (variant === 'confirmed') {
                    const isChanged = i === changedIndex;
                    cellClass = isChanged
                        ? 'bg-primary/20 border-2 border-primary text-primary font-black scale-110'
                        : 'bg-surface/60 border-2 border-surface-active/40 text-text-main font-bold';
                } else if (variant === 'current') {
                    const isFilled = i < currentInput.length;
                    cellClass = isFilled
                        ? 'bg-surface border-2 border-primary/60 text-text-main font-black'
                        : 'bg-surface/20 border-2 border-dashed border-surface-active/30 text-text-muted';
                } else {
                    // empty
                    cellClass = 'bg-surface/10 border-2 border-dashed border-surface-active/20 text-transparent';
                }

                return (
                    <div
                        key={i}
                        className={`
                            w-11 h-11 sm:w-12 sm:h-12
                            flex items-center justify-center
                            rounded-xl text-lg sm:text-xl
                            transition-all duration-200
                            select-none
                            ${cellClass}
                        `}
                    >
                        {letter}
                    </div>
                );
            })}
        </div>
    );
}
