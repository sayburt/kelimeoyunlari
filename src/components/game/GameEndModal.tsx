'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Frown } from 'lucide-react';
import { ConfettiEffect } from './ConfettiEffect';

export interface GameEndModalProps {
    isOpen: boolean;
    status: 'won' | 'lost' | 'playing' | 'idle' | 'loading';
    guessesCount: number;
    maxGuesses: number;
    targetWord?: {
        kelime: string;
        anlam?: string | null;
    } | null;
    onRestart: () => void;
}

export function GameEndModal({
    isOpen,
    status,
    guessesCount,
    maxGuesses,
    targetWord,
    onRestart,
}: GameEndModalProps) {
    // Confetti Effect
    return (
        <>
            {/* Kazanma / Kaybetme Modal */}
            <AnimatePresence>
                {isOpen && (status === 'won' || status === 'lost') && (
                    <motion.div
                        key="game-end-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                        onClick={onRestart}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative glow */}
                            <div
                                className={`absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-3xl opacity-40 ${status === 'won' ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            />

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                                transition={{
                                    delay: 0.2,
                                    scale: { type: 'spring', stiffness: 400 },
                                    rotate: { type: 'tween', duration: 0.4, ease: 'easeInOut' }
                                }}
                                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${status === 'won'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {status === 'won' ? (
                                    <Trophy size={40} />
                                ) : (
                                    <Frown size={40} />
                                )}
                            </motion.div>

                            {/* Title */}
                            <h2
                                className={`text-3xl font-black mb-2 ${status === 'won' ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {status === 'won' ? 'Tebrikler!' : 'Oyun Bitti'}
                            </h2>

                            {/* Message */}
                            {status === 'won' ? (
                                <p className="text-slate-300 mb-2">
                                    Kelimeyi <span className="font-bold text-white">{guessesCount}</span> denemede buldun!
                                </p>
                            ) : (
                                <div className="mb-2">
                                    <p className="text-slate-400 text-sm mb-1">
                                        Doğru kelime:
                                    </p>
                                    <p className="text-2xl font-black text-white tracking-widest">
                                        {targetWord?.kelime?.toLocaleUpperCase('tr-TR')}
                                    </p>
                                    {targetWord?.anlam && (
                                        <p className="text-sm text-slate-400 mt-2 italic">
                                            &ldquo;{targetWord.anlam}&rdquo;
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Stars for win */}
                            {status === 'won' && (
                                <div className="flex justify-center gap-1 my-4">
                                    {Array.from({ length: maxGuesses - guessesCount + 1 }).map(
                                        (_, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                                className="text-yellow-400 text-xl"
                                            >
                                                ★
                                            </motion.span>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Restart Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onRestart}
                                className="mt-4 w-full py-3.5 rounded-xl font-bold text-bg bg-primary hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} />
                                Tekrar Oyna
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Win confetti particles */}
            <ConfettiEffect isVisible={isOpen && status === 'won'} />
        </>
    );
}
