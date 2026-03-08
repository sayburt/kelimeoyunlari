'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WordSearchWord } from '@/hooks/useWordSearch';

interface WordSearchWordListProps {
    words: WordSearchWord[];
}

const GROUP_STYLES = [
    {
        container: 'bg-sky-500/10 border-sky-400/25',
        badge: 'bg-sky-400/15 text-sky-200 border-sky-300/30',
        row: 'bg-sky-500/10 border-sky-300/30',
    },
    {
        container: 'bg-emerald-500/10 border-emerald-400/25',
        badge: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/30',
        row: 'bg-emerald-500/10 border-emerald-300/30',
    },
    {
        container: 'bg-amber-500/10 border-amber-400/25',
        badge: 'bg-amber-400/15 text-amber-200 border-amber-300/30',
        row: 'bg-amber-500/10 border-amber-300/30',
    },
    {
        container: 'bg-violet-500/10 border-violet-400/25',
        badge: 'bg-violet-400/15 text-violet-200 border-violet-300/30',
        row: 'bg-violet-500/10 border-violet-300/30',
    },
    {
        container: 'bg-rose-500/10 border-rose-400/25',
        badge: 'bg-rose-400/15 text-rose-200 border-rose-300/30',
        row: 'bg-rose-500/10 border-rose-300/30',
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
