'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RotateCcw } from 'lucide-react';

interface SaveConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function SaveConfirmationModal({
    isOpen,
    onConfirm,
    onCancel,
}: SaveConfirmationModalProps) {
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
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center">
                                <Home size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-text-main tracking-tighter">
                                OYUN <span className="text-green-500 italic">KAYDEDİLDİ</span>
                            </h3>
                            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                                Oyun başarıyla kaydedildi! Ana sayfaya dönmek istiyor musunuz?
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={onConfirm}
                                className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-black py-4 rounded-2xl premium-btn hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 uppercase tracking-[0.15em] text-sm active:scale-[0.98]"
                            >
                                <Home size={20} />
                                Ana Sayfaya Dön
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full flex items-center justify-center gap-3 bg-surface-hover/80 backdrop-blur-sm text-text-main font-black py-4 rounded-2xl premium-btn hover:bg-surface-mid transition-all border border-[var(--theme-glass-border)] uppercase tracking-[0.15em] text-sm active:scale-[0.98]"
                            >
                                <RotateCcw size={18} />
                                Oyunda Kal
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}