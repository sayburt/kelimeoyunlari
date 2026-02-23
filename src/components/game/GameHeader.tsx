'use client';

import React from 'react';
import { ArrowLeft, Volume2, VolumeX, CircleHelp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface GameHeaderProps {
    title: string;
    onBack?: () => void;
    onHelp?: () => void;
    soundEnabled?: boolean;
    onToggleSound?: () => void;
    backHref?: string;
}

export function GameHeader({
    title,
    onBack,
    onHelp,
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
        <header className="flex items-center justify-between py-4 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 w-full mb-4 sm:mb-8">
            <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition shadow-sm active:scale-95"
                title="Geri Dön"
            >
                <ArrowLeft size={20} />
            </button>

            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-gray-200 uppercase">
                {title}
            </h1>

            <div className="flex items-center gap-1 sm:gap-2">
                {onToggleSound && (
                    <button
                        onClick={onToggleSound}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition active:scale-95"
                        title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                )}

                {onHelp && (
                    <button
                        onClick={onHelp}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition active:scale-95"
                        title="Nasıl Oynanır?"
                    >
                        <CircleHelp size={20} />
                    </button>
                )}
            </div>
        </header>
    );
}
