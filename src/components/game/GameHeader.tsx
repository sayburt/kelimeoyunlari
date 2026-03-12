'use client';

import React, { useState } from 'react';
import { ArrowLeft, Info, BarChart2, Share2, Save, Swords, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VisitorAuthModal } from './VisitorAuthModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AvatarMenu } from '@/components/ui/AvatarMenu';

export interface GameHeaderProps {
    title: string;
    onBack?: () => void;
    onHelp?: () => void;
    onStats?: () => void;
    onSettings?: () => void;
    onShare?: () => void;
    onSave?: () => void;
    onChallenge?: () => void;
    isLoggedIn?: boolean;
    isChallengeMode?: boolean;
    gameStatus?: string;
    onJoker?: () => void;
    jokerUsed?: boolean;
    backHref?: string;
    timerText?: string;
}

export function GameHeader({
    title,
    onBack,
    onHelp,
    onStats,
    onSettings,
    onShare,
    onSave,
    onChallenge,
    isChallengeMode,
    isLoggedIn,
    gameStatus,
    onJoker,
    jokerUsed,
    backHref = '/',
    timerText,
}: GameHeaderProps) {
    const router = useRouter();
    const [showVisitorModal, setShowVisitorModal] = useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push(backHref);
        }
    };

    const handleChallengeClick = () => {
        if (!isLoggedIn) {
            setShowVisitorModal(true);
        } else if (onChallenge) {
            onChallenge();
        }
    };

    interface MenuItem {
        icon: React.ElementType;
        label: string;
        onClick?: () => void;
        disabled?: boolean;
        colorClass?: string;
    }

    const menuItems: MenuItem[] = [
        ...(isLoggedIn && gameStatus === 'playing' && onSave ? [{ icon: Save, label: 'Sonra Devam Et', onClick: onSave, colorClass: 'text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10' }] : []),
        ...(!isChallengeMode && onChallenge ? [{ icon: Swords, label: 'Meydan Oku', onClick: handleChallengeClick, colorClass: 'text-rose-500 dark:text-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10' }] : []),
        { icon: Info, label: 'Nasıl Oynanır?', onClick: onHelp, colorClass: 'text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10' },
        { icon: BarChart2, label: 'İstatistikler', onClick: onStats, colorClass: 'text-amber-500 dark:text-amber-400 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10' },
        ...(onSettings ? [{ icon: Settings, label: 'Ayarlar', onClick: onSettings, colorClass: 'text-slate-500 dark:text-slate-400 group-hover:bg-slate-50 dark:group-hover:bg-slate-500/10' }] : []),
        { icon: Share2, label: 'Oyunu Paylaş', onClick: onShare, colorClass: 'text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10' },
    ];

    return (
        <div className="flex flex-col w-full glass-header sticky top-0 z-50 mb-2 sm:mb-4 shadow-sm">
            {/* 1. SATIR: Üst Alan (Ana Header) */}
            <header className="relative flex items-center justify-between py-2 sm:py-3 px-4 sm:px-6 w-full border-b border-surface-mid/50">
                {/* Sol: Geri Dön İkonu ve Oyun Adı */}
                <div className="flex-1 flex items-center justify-start gap-2.5 sm:gap-4 overflow-hidden pr-2">
                    <button
                        onClick={handleBack}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:text-text-main hover:bg-surface-mid transition shadow-sm active:scale-95 cursor-pointer"
                        title="Geri Dön"
                    >
                        <ArrowLeft size={18} className="sm:size-5" />
                    </button>
                    {/* Mobil için sola hizalı oyun adı */}
                    <h1 className="sm:hidden text-base font-medium tracking-wider text-text-main uppercase leading-none truncate">
                        {title}
                    </h1>
                </div>

                {/* Masaüstü için ortalı oyun adı */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <h1 className="text-xl font-medium tracking-wider text-text-main uppercase text-center leading-none truncate px-4 pointer-events-auto">
                        {title}
                    </h1>
                </div>

                {/* Sağ: Tema ve Avatar */}
                <div className="flex-shrink-0 flex justify-end items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <AvatarMenu />
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="flex flex-shrink-0 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-[0.5px] border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary hover:text-text-main dark:text-text-secondary dark:hover:text-white group"
                            aria-label="Giriş / Kayıt Ol"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </button>
                    )}
                </div>
            </header>

            {/* 2. SATIR: Oyun Araç Çubuğu (Toolbar) */}
            <div className="flex flex-wrap items-center justify-center py-2 px-2 sm:px-6 w-full gap-2 sm:gap-4 bg-surface-base/80 dark:bg-black/20 border-b border-surface-mid/50 backdrop-blur-sm">
                
                {timerText && (
                    <div className="flex-shrink-0 pointer-events-none bg-surface/50 px-3 py-1.5 rounded-lg border border-surface-mid/50">
                        <span className="text-primary font-mono text-sm sm:text-base font-bold tabular-nums tracking-tighter">
                            {timerText}
                        </span>
                    </div>
                )}

                {/* Oyun İkonları */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {/* Joker Butonu */}
                    <button
                        onClick={onJoker}
                        disabled={jokerUsed}
                        className={`relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 group cursor-pointer border border-transparent ${jokerUsed
                            ? 'opacity-40 grayscale cursor-not-allowed bg-surface/30'
                            : 'bg-yellow-50/50 dark:bg-yellow-500/10 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 text-yellow-500 dark:text-yellow-400'
                            }`}
                        title={jokerUsed ? 'İpucu Kullanıldı' : 'İpucu Kullan (💡)'}
                        aria-label="İpucu"
                    >
                        <span className={`text-base sm:text-lg ${!jokerUsed && 'group-hover:scale-125 transition-transform'}`}>💡</span>
                        {jokerUsed && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg" />}
                    </button>

                    <div className="w-px h-6 bg-surface-mid/50 mx-1"></div>

                    {/* Diğer Menü İtemleri */}
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={item.onClick}
                                disabled={item.disabled}
                                className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 group cursor-pointer border border-transparent ${item.disabled
                                    ? 'opacity-30 grayscale cursor-not-allowed text-text-muted'
                                    : `bg-surface-base/30 dark:bg-black/10 hover:border-surface-mid/30 ${item.colorClass}`
                                    }`}
                                title={item.label}
                                aria-label={item.label}
                            >
                                <Icon size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <VisitorAuthModal
                isOpen={showVisitorModal}
                onClose={() => setShowVisitorModal(false)}
            />
        </div>
    );
}

