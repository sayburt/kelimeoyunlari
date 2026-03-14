'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WordSearchWord } from '@/hooks/useWordSearch';

interface WordSearchWordListProps {
    words: WordSearchWord[];
}

const GROUP_STYLES = [
    {
        container: 'bg-accent-cyan/10 border-accent-cyan/25',
        badge: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30',
        row: 'bg-accent-cyan/10 border-accent-cyan/30',
    },
    {
        container: 'bg-accent-emerald/10 border-accent-emerald/25',
        badge: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30',
        row: 'bg-accent-emerald/10 border-accent-emerald/30',
    },
    {
        container: 'bg-accent-amber/10 border-accent-amber/25',
        badge: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
        row: 'bg-accent-amber/10 border-accent-amber/30',
    },
    {
        container: 'bg-accent-violet/10 border-accent-violet/25',
        badge: 'bg-accent-violet/15 text-accent-violet border-accent-violet/30',
        row: 'bg-accent-violet/10 border-accent-violet/30',
    },
    {
        container: 'bg-accent-rose/10 border-accent-rose/25',
        badge: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
        row: 'bg-accent-rose/10 border-accent-rose/30',
    },
];

export function WordSearchWordList({ words }: WordSearchWordListProps) {
    const sortedWords = React.useMemo(
        () => [...words].sort((a, b) => {
            const lengthDiff = a.word.length - b.word.length;
            if (lengthDiff !== 0) {
                return lengthDiff;
            }

            return a.word.localeCompare(b.word, 'tr-TR');
        }),
        [words]
    );
    const groupedWords = React.useMemo(() => {
        const groups = new Map<number, WordSearchWord[]>();

        sortedWords.forEach((word) => {
            const length = word.word.length;
            if (!groups.has(length)) {
                groups.set(length, []);
            }
            groups.get(length)!.push(word);
        });

        return Array.from(groups.entries()).map(([length, groupWords]) => ({
            length,
            words: groupWords,
        }));
    }, [sortedWords]);

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-black text-text-muted uppercase tracking-wider">
                    Bulunacak Kelimeler
                </h3>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {groupedWords.map((group, groupIdx) => {
                    const style = GROUP_STYLES[groupIdx % GROUP_STYLES.length];

                    return (
                        <div
                            key={group.length}
                            className={`rounded-xl border p-2 ${style.container}`}
                        >
                            <div className="flex items-center justify-between mb-2 px-1">
                                <span className={`text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-lg border ${style.badge}`}>
                                    {group.length} Harf
                                </span>
                                <span className="text-[11px] sm:text-xs font-bold text-text-muted">
                                    {group.words.length} kelime
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {group.words.map((word, idx) => (
                                    <motion.div
                                        key={`${group.length}-${word.word}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: (groupIdx * 0.04) + (idx * 0.01) }}
                                        className={`
                                            flex items-center justify-between px-3 py-2 rounded-xl
                                            border transition-colors
                                            ${style.row}
                                            ${word.found ? 'bg-correct/15 border-correct/35' : ''}
                                        `}
                                    >
                                        <span className={`font-bold text-sm tracking-wide ${word.found ? 'text-correct line-through' : 'text-text-main'}`}>
                                            {word.word}
                                        </span>
                                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${word.found ? 'bg-correct/20 text-correct' : 'bg-surface-mid text-text-muted'}`}>
                                            +{word.points}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
