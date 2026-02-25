'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoModalProps {
    onClose: () => void;
}

export function InfoModal({ onClose }: InfoModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border-2 border-surface-mid rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-main transition-colors p-1"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-black text-text-main mb-4">Nasıl Oynanır?</h2>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                    <p>6 denemede gizli kelimeyi bulmaya çalışın.</p>
                    <p>Her tahminden sonra kutucukların renkleri değişerek ne kadar yaklaştığınızı gösterecektir.</p>
                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 bg-correct rounded flex items-center justify-center text-bg font-bold">Y</div>
                            <span>Harf kelimede var ve yeri doğru.</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 bg-present rounded flex items-center justify-center text-bg font-bold">A</div>
                            <span>Harf kelimede var ama yeri yanlış.</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 bg-absent rounded flex items-center justify-center text-bg font-bold">K</div>
                            <span>Harf kelimede yok.</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-primary text-bg font-black py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-transform"
                >
                    ANLADIM
                </button>
            </motion.div>
        </div>
    );
}
