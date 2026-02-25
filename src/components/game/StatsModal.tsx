'use client';

import React from 'react';

interface StatsModalProps {
    onClose: () => void;
}

export function StatsModal({ onClose }: StatsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface p-6 rounded-2xl max-w-sm w-full border border-surface-mid shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-text-main">İstatistikler</h3>
                <p className="text-text-secondary mb-6 text-sm">
                    Oyuncu istatistikleri ve skor tablosu yakında burada olacak.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-primary text-bg font-bold py-2.5 rounded-xl hover:scale-[1.02] transition-transform"
                >
                    Kapat
                </button>
            </div>
        </div>
    );
}
