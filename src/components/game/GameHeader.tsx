'use client';

import React from 'react';
import { ArrowLeft, Info, BarChart2, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface GameHeaderProps {
    title: string;
    onBack?: () => void;
    onHelp?: () => void;
    onStats?: () => void;
    onSettings?: () => void;
    backHref?: string;
    timerText?: string;
}

export function GameHeader({
    title,
    onBack,
    onHelp,
    onStats,
    onSettings,
    backHref = '/',
    timerText,
}: GameHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push(backHref);
        }
    };

    return (
        <header className="flex items-center justify-between py-2 sm:py-3 px-4 sm:px-6 border-b border-surface-mid/80 bg-bg/50 backdrop-blur-md sticky top-0 z-10 w-full mb-2 sm:mb-4">
            {/* Sol: Geri Dön İkonu */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={handleBack}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:text-text-main hover:bg-surface-mid transition shadow-sm active:scale-95"
                    title="Geri Dön"
                >
                    <ArrowLeft size={18} className="sm:size-5" />
                </button>
            </div>

            {/* Orta: Oyun Adı */}
            <div className="flex-1 flex justify-center">
                <h1 className="text-lg sm:text-2xl font-black tracking-widest text-text-main uppercase text-center leading-none">
                    {title}
                </h1>
            </div>

            {/* Sağ: Sayaç ve İkonlar */}
            <div className="flex-1 flex justify-end items-center gap-0.5 sm:gap-1.5">
                {timerText && (
                    <div className="mr-1 sm:mr-2 pointer-events-none">
                        <span className="text-primary font-mono text-sm sm:text-base font-bold tabular-nums opacity-80 tracking-tighter">
                            {timerText}
                        </span>
                    </div>
                )}

                <button
                    onClick={onHelp}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-primary hover:bg-surface transition-all active:scale-95 group"
                    title="Nasıl Oynanır?"
                    aria-label="Nasıl Oynanır?"
                >
                    <Info size={18} className="sm:size-5 group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={onStats}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-primary hover:bg-surface transition-all active:scale-95 group"
                    title="İstatistikler"
                    aria-label="İstatistikler"
                >
                    <BarChart2 size={18} className="sm:size-5 group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={onSettings}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-text-secondary hover:text-primary hover:bg-surface transition-all active:scale-95 group"
                    title="Ayarlar"
                    aria-label="Ayarlar"
                >
                    <Settings size={18} className="sm:size-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </header>
    );
}
