'use client';

import React from 'react';
import { ArrowLeft, Info, BarChart2, Settings, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface GameHeaderProps {
    title: string;
    onBack?: () => void;
    onHelp?: () => void;
    onStats?: () => void;
    onSettings?: () => void;
    soundEnabled?: boolean;
    onToggleSound?: () => void;
    backHref?: string;
}

export function GameHeader({
    title,
    onBack,
    onHelp,
    onStats,
    onSettings,
    soundEnabled = true,
    onToggleSound,
    backHref = '/',
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
        <header className="flex items-center justify-between py-4 px-4 sm:px-6 border-b border-surface-mid/80 bg-bg/50 backdrop-blur-md sticky top-0 z-10 w-full mb-4 sm:mb-8">
            {/* Sol: Geri Dön İkonu */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:text-text-main hover:bg-surface-mid transition shadow-sm active:scale-95"
                    title="Geri Dön"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Orta: Oyun Adı */}
            <div className="flex-1 flex justify-center">
                <h1 className="text-xl sm:text-2xl font-black tracking-widest text-text-main uppercase text-center">
                    {title}
                </h1>
            </div>

            {/* Sağ: İkonlar (Ses, Bilgi, İstatistik, Ayarlar) */}
            <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2">
                {onToggleSound && (
                    <button
                        onClick={onToggleSound}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-surface transition active:scale-95"
                        title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                )}

                <button
                    onClick={onHelp}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-surface transition active:scale-95"
                    title="Nasıl Oynanır?"
                >
                    <Info size={20} />
                </button>

                <button
                    onClick={onStats}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-surface transition active:scale-95"
                    title="İstatistikler"
                >
                    <BarChart2 size={20} />
                </button>

                <button
                    onClick={onSettings}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-surface transition active:scale-95"
                    title="Ayarlar"
                >
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
