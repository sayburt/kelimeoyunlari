'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LetterCell, LetterState } from './LetterCell';
import { GuessResult } from '@/hooks/useGame';

export interface WordleBoardProps {
    guesses: GuessResult[];
    currentGuess: string;
    currentRow: number;
    wordLength: number;
    maxGuesses: number;
    shakeRow: boolean;
}

export function WordleBoard({
    guesses,
    currentGuess,
    currentRow,
    wordLength,
    maxGuesses,
    shakeRow,
}: WordleBoardProps) {
    const rows = [];

    for (let rowIdx = 0; rowIdx < maxGuesses; rowIdx++) {
        const cells = [];

        for (let colIdx = 0; colIdx < wordLength; colIdx++) {
            let letter = '';
            let state: LetterState = 'empty';

            if (rowIdx < guesses.length) {
                // Tahmin edilmiş satır
                letter = guesses[rowIdx].guess[colIdx];
                state = guesses[rowIdx].states[colIdx];
            } else if (rowIdx === currentRow) {
                // Aktif satır
                letter = currentGuess[colIdx] || '';
                state = letter ? 'filled' : 'empty';
            }

            const isRevealed = rowIdx < guesses.length;
            const delay = colIdx * 0.15;

            cells.push(
                <motion.div
                    key={`${rowIdx}-${colIdx}`}
                    initial={false}
                    animate={
                        isRevealed
                            ? {
                                rotateX: [0, 90, 0],
                                transition: {
                                    duration: 0.5,
                                    delay,
                                    times: [0, 0.5, 1],
                                },
                            }
                            : letter && rowIdx === currentRow
                                ? { scale: [1, 1.12, 1], transition: { duration: 0.1 } }
                                : {}
                    }
                    style={{ perspective: 600 }}
                >
                    <LetterCell letter={letter} state={state} />
                </motion.div>
            );
        }

        rows.push(
            <motion.div
                key={rowIdx}
                className="flex gap-1.5 sm:gap-2 justify-center"
                animate={
                    shakeRow && rowIdx === currentRow
                        ? { x: [0, -8, 8, -8, 8, -4, 4, 0] }
                        : {}
                }
                transition={{ duration: 0.4 }}
            >
                {cells}
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5 sm:gap-2">
            {rows}
        </div>
    );
}
