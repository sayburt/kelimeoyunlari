'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Frown, Share2, Home } from 'lucide-react';
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
    isCustomWord?: boolean;
    isChallenge?: boolean;
    onRestart: () => void;
    onShare?: () => void;
    score?: number;
}

export function GameEndModal({
    isOpen,
    status,
    guessesCount,
    maxGuesses,
    targetWord,
    isCustomWord,
    isChallenge,
    onRestart,
    onShare,
    score = 0,
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
                        onClick={onRestart}
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 sm:px-10 max-w-sm w-full text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative glow */}
                            <div
                                className={`absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full blur-3xl opacity-40 ${status === 'won' ? 'bg-green-500' : 'bg-red-500'
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
                                className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6 ${status === 'won'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {status === 'won' ? (
                                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
                                ) : (
                                    <Frown className="w-8 h-8 sm:w-10 sm:h-10" />
                                )}
                            </motion.div>

                            {/* Title */}
                            <h2
                                className={`text-2xl sm:text-3xl font-black mb-1 sm:mb-2 ${status === 'won' ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {status === 'won' ? 'Tebrikler!' : 'Oyun Bitti'}
                            </h2>

                            {/* Message & Word Info */}
                            <div className="mb-2">
                                {status === 'won' ? (
                                    <>
                                        <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">
                                            Kelimeyi <span className="font-bold text-white">{guessesCount}</span> denemede buldun!
                                        </p>
                                        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 border border-slate-700/50">
                                            <p className="text-slate-400 max-sm:text-[10px] text-xs mb-1 uppercase tracking-widest font-bold">
                                                Bilinen Kelime
                                            </p>
                                            <p className="text-xl sm:text-2xl font-black text-white tracking-widest mb-1">
                                                {targetWord?.kelime?.toLocaleUpperCase('tr-TR')}
                                            </p>
                                            {isCustomWord ? (
                                                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-[#B8A4D4]/10 border border-[#B8A4D4]/30 rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(184,164,212,0.1)]">
                                                    <p className="text-[#B8A4D4] font-bold text-xs sm:text-sm mb-1 flex items-center justify-center gap-1 sm:gap-2">
                                                        <span>⚔️</span> Özel Meydan Okuma Kelimesi
                                                    </p>
                                                    <p className="text-slate-300 max-sm:text-[10px] text-xs">
                                                        Bu kelime rakibin tarafından özel olarak seçildi, sözlükte yer almayabilir.
                                                    </p>
                                                </div>
                                            ) : (
                                                targetWord?.anlam && (
                                                    <p className="text-xs sm:text-sm text-slate-400 italic leading-snug">
                                                        &ldquo;{targetWord.anlam}&rdquo;
                                                    </p>
                                                )
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center justify-center py-1 sm:py-2">
                                            <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Kazanılan Puan</p>
                                            <div className="text-3xl sm:text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                                +{score.toLocaleString('tr-TR')}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-slate-400 text-sm mb-1">
                                            Doğru kelime:
                                        </p>
                                        <p className="text-xl sm:text-2xl font-black text-white tracking-widest">
                                            {targetWord?.kelime?.toLocaleUpperCase('tr-TR')}
                                        </p>
                                        {isCustomWord ? (
                                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-[#B8A4D4]/10 border border-[#B8A4D4]/30 rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(184,164,212,0.1)] inline-block">
                                                <p className="text-[#B8A4D4] font-bold text-xs sm:text-sm mb-1 flex items-center justify-center gap-1 sm:gap-2">
                                                    <span>⚔️</span> Özel Meydan Okuma Kelimesi
                                                </p>
                                                <p className="text-slate-300 max-sm:text-[10px] text-xs">
                                                    Bu kelime rakibin tarafından özel olarak seçildi, sözlükte yer almayabilir.
                                                </p>
                                            </div>
                                        ) : (
                                            targetWord?.anlam && (
                                                <p className="text-xs sm:text-sm text-slate-400 mt-2 italic">
                                                    &ldquo;{targetWord.anlam}&rdquo;
                                                </p>
                                            )
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stars for win */}
                            {status === 'won' && (
                                <div className="flex justify-center gap-1 my-3 sm:my-4">
                                    {Array.from({ length: maxGuesses - guessesCount + 1 }).map(
                                        (_, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                                className="text-yellow-400 text-lg sm:text-xl"
                                            >
                                                ★
                                            </motion.span>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onRestart}
                                    className="w-full py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-bg bg-primary hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-1.5 sm:gap-2 premium-btn active:scale-[0.98]"
                                >
                                    {isChallenge ? (
                                        <>
                                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Normal Oyun
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Tekrar Oyna
                                        </>
                                    )}
                                </motion.button>

                                {onShare && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onShare}
                                        className="w-full py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-text-main bg-surface/80 backdrop-blur-sm hover:bg-surface-mid transition-all border border-surface-mid/50 flex items-center justify-center gap-1.5 sm:gap-2 premium-btn"
                                    >
                                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Paylaş
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Win confetti particles */}
            <ConfettiEffect isVisible={isOpen && status === 'won'} />
        </>
    );
}
