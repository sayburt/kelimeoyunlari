'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Clock } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';

interface ResumeGameModalProps {
    isOpen: boolean;
    elapsedTime: number;
    guessesCount: number;
    onResume: () => void;
    onNewGame: () => void;
}

export function ResumeGameModal({
    isOpen,
    elapsedTime,
    guessesCount,
    onResume,
    onNewGame,
}: ResumeGameModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-[var(--theme-card-glass)] backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] max-w-md w-full border border-[var(--theme-glass-border)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
                >
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                    <div className="relative">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Play size={32} className="text-primary ml-1" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-text-main tracking-tighter">
                                KAYITLI <span className="text-primary italic">OYUN</span>
                            </h3>
                            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                                Kayıtlı bir oyunun var. Devam edersen kaldığın yerden başlayacaksın ve süre o noktadan işlemeye devam edecek.
                            </p>
                        </div>

                        {/* Saved Game Info */}
                        <div className="flex items-center justify-center gap-6 mb-8 p-4 rounded-2xl bg-surface-hover/30 border border-surface-mid/50">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Clock size={16} className="text-primary" />
                                <span className="text-sm font-bold">{formatTime(elapsedTime)}</span>
                            </div>
                            <div className="w-px h-6 bg-surface-mid" />
                            <div className="text-text-secondary text-sm">
                                <span className="font-bold text-text-main">{guessesCount}</span> tahmin yapıldı
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={onResume}
                                className="w-full flex items-center justify-center gap-3 bg-primary text-bg font-black py-4 rounded-2xl premium-btn hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 uppercase tracking-[0.15em] text-sm active:scale-[0.98]"
                            >
                                <Play size={20} />
                                Kaldığım Yerden Devam Et
                            </button>
                            <button
                                onClick={onNewGame}
                                className="w-full flex items-center justify-center gap-3 bg-surface-hover/80 backdrop-blur-sm text-text-main font-black py-4 rounded-2xl premium-btn hover:bg-surface-mid transition-all border border-[var(--theme-glass-border)] uppercase tracking-[0.15em] text-sm active:scale-[0.98]"
                            >
                                <RotateCcw size={18} />
                                Yeni Oyun Başlat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
