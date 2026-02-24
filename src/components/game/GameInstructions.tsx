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
                        <h4 className="text-lg font-bold text-text-main/80 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-surface-mid/30 flex items-center justify-center text-sm">💡</span>
                            Örnekler
                        </h4>
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

                {instructions.scoring && (
                    <div className="my-8 space-y-4">
                        <h4 className="text-lg font-bold text-text-main/80 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">🏆</span>
                            Puanlama Sistemi
                        </h4>
                        <div className="bg-surface-mid/10 rounded-2xl border border-surface-mid/20 overflow-hidden">
                            <div className="p-4 border-b border-surface-mid/20">
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {instructions.scoring.description}
                                </p>
                            </div>
                            <div className="divide-y divide-surface-mid/10">
                                {instructions.scoring.points.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center px-4 py-3 hover:bg-surface-mid/5 transition-colors">
                                        <span className="text-sm font-medium text-text-main/90">{item.condition}</span>
                                        <span className="text-sm font-bold text-primary">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
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
