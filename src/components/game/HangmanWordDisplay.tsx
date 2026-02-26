import React from 'react';
import { motion } from 'framer-motion';
import { Word } from '@/services/wordService';
import { GameStatus } from '@/hooks/useHangman';

interface HangmanWordDisplayProps {
    targetWord: Word | null;
    guessedLetters: Set<string>;
    status: GameStatus;
}

export function HangmanWordDisplay({ targetWord, guessedLetters, status }: HangmanWordDisplayProps) {
    if (!targetWord) return null;

    const targetUpper = targetWord.kelime.toLocaleUpperCase('tr-TR');
    // For visual spacing if there are multiple words
    const words = targetUpper.split(' ');

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            {words.map((word, wordIndex) => (
                <div key={wordIndex} className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
                    {word.split('').map((char, charIndex) => {
                        const isGuessed = guessedLetters.has(char);
                        const isLetter = char !== '-';
                        // Eger oyun kaybedilmisse gosterilmeyen harfleri gosterelim ama kirmizi renk vs. yapabiliriz.
                        const showMissed = status === 'lost' && !isGuessed && isLetter;

                        return (
                            <div
                                key={charIndex}
                                className={`flex items-center justify-center font-bold text-xl sm:text-3xl w-8 h-10 sm:w-10 sm:h-12 border-b-[3px] ${isLetter ? "border-foreground" : "border-transparent w-3 sm:w-6"} ${showMissed ? "text-destructive" : "text-foreground"}`}
                            >
                                {isLetter && (isGuessed || showMissed) ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {char}
                                    </motion.span>
                                ) : null}
                                {!isLetter && <span>{char}</span>}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
