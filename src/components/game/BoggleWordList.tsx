'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FoundWord } from '@/hooks/useBoggle';

interface BoggleWordListProps {
    foundWords: FoundWord[];
    totalPoints: number;
}

export function BoggleWordList({ foundWords, totalPoints }: BoggleWordListProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Başlık & Skor */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-black text-text-muted uppercase tracking-wider">
                    Bulunan Kelimeler
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted font-bold">{foundWords.length} kelime</span>
                    <span className="bg-primary/10 text-primary font-black text-sm sm:text-base px-3 py-1 rounded-xl">
                        {totalPoints} puan
                    </span>
                </div>
            </div>

            {/* Kelime Listesi */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                    {foundWords.map((fw, idx) => (
                        <motion.div
                            key={fw.word}
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.25 }}
                            className={`
                                flex items-center justify-between px-3 py-2 rounded-xl
                                border transition-colors
                                ${idx === 0
                                    ? 'bg-primary/10 border-primary/30'
                                    : 'bg-surface/40 border-surface-active/30'
                                }
                            `}
                        >
                            <span className="font-bold text-sm text-text-main tracking-wide">
                                {fw.word}
                            </span>
                            <span className={`
                                text-xs font-black px-2 py-0.5 rounded-lg
                                ${fw.points >= 5
                                    ? 'bg-correct/20 text-correct'
                                    : fw.points >= 2
                                        ? 'bg-present/20 text-present'
                                        : 'bg-surface-mid text-text-muted'
                                }
                            `}>
                                +{fw.points}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {foundWords.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-text-muted/40">
                        <p className="text-sm italic font-medium">Kelime bulmak için harfleri sürükleyin...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
