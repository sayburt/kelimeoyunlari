import React from 'react';
import { GameInstructions as GameInstructionsType } from '@/data/games';

interface GameInstructionsProps {
    instructions: GameInstructionsType;
    title?: string;
}

export function GameInstructions({ instructions, title }: GameInstructionsProps) {
    return (
        <div className="space-y-6 text-text-main/90">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-primary">{title} Nasıl Oynanır?</h2>
            )}

            <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                    {instructions.basic}
                </p>

                {instructions.rules.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-1">
                        {instructions.rules.map((rule, index) => (
                            <li key={index} className="leading-relaxed">{rule}</li>
                        ))}
                    </ul>
                )}

                {instructions.examples && instructions.examples.length > 0 && (
                    <div className="my-8 space-y-8">
                        {instructions.examples.map((example, index) => (
                            <div key={index} className="bg-surface-mid/20 p-4 rounded-xl border border-surface-mid/30">
                                <div className="flex gap-1.5 mb-3">
                                    {example.word.split('').map((char, charIndex) => {
                                        const color = example.colors[charIndex];
                                        let bgClass = 'border-2 border-surface-mid';
                                        let textClass = 'text-text-main';

                                        if (color === 'correct') {
                                            bgClass = 'bg-correct border-correct';
                                            textClass = 'text-white';
                                        } else if (color === 'present') {
                                            bgClass = 'bg-present border-present';
                                            textClass = 'text-white';
                                        } else if (color === 'absent') {
                                            bgClass = 'bg-absent border-absent';
                                            textClass = 'text-white';
                                        }

                                        return (
                                            <span
                                                key={charIndex}
                                                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold rounded-lg shrink-0 transition-colors ${bgClass} ${textClass}`}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                </div>
                                <p className="text-sm sm:text-base">
                                    <strong>{example.highlightLetter}</strong> {example.description.split(example.highlightLetter).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && <strong>{example.highlightLetter}</strong>}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {instructions.footer && (
                    <p className="mt-8 pt-6 border-t border-surface-hover/30 text-text-muted italic text-sm">
                        {instructions.footer}
                    </p>
                )}
            </div>
        </div>
    );
}
