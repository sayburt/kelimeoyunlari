'use client';

import React, { useState } from 'react';
import { ArrowLeft, BarChart2, Share2, Save, Swords, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { VisitorAuthModal } from './VisitorAuthModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AvatarMenu } from '@/components/ui/AvatarMenu';

export interface GameHeaderProps {
    title: string;
    onBack?: () => void;
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
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

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
        ...(gameStatus === 'playing' && onSave ? [{ 
            icon: Save, 
            label: 'Sonra Devam Et', 
            onClick: onSave, 
            colorClass: 'text-accent-indigo' 
        }] : []),
        ...(!isChallengeMode && onChallenge ? [{ 
            icon: Swords, 
            label: 'Meydan Oku', 
            onClick: handleChallengeClick, 
            colorClass: 'text-accent-rose' 
        }] : []),
        { 
            icon: BarChart2, 
            label: 'İstatistikler', 
            onClick: onStats,
            colorClass: 'text-accent-emerald'
        },
        ...(onSettings ? [{ 
            icon: Settings, 
            label: 'Ayarlar', 
            onClick: onSettings,
            colorClass: 'text-accent-cyan'
        }] : []),
        { 
            icon: Share2, 
            label: 'Oyunu Paylaş', 
            onClick: onShare,
            colorClass: 'text-accent-violet'
        },
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
                    {isMounted && (
                        isLoggedIn ? (
                            <AvatarMenu />
                        ) : (
                            <button
                                onClick={() => router.push('/login')}
                                className="flex flex-shrink-0 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-[0.5px] border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary hover:text-text-main dark:text-text-secondary dark:hover:text-white group"
                                aria-label="Giriş / Kayıt Ol"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </button>
                        )
                    )}
                </div>
            </header>

            {/* 2. SATIR: Oyun Araç Çubuğu (Toolbar) */}
            <div className="flex flex-wrap items-center justify-center py-2.5 sm:py-3.5 px-2 sm:px-6 w-full gap-3 sm:gap-6 bg-bg/80 dark:bg-black/20 backdrop-blur-md border-b border-surface-mid/30">
                
                {isMounted && timerText && (
                    <div className="flex-shrink-0 bg-surface-dark px-3.5 py-1.5 rounded-2xl border border-surface-mid/50 shadow-sm ring-1 ring-black/5">
                        <span className="text-text-main font-mono text-base sm:text-lg font-black tabular-nums tracking-tight">
                            {timerText}
                        </span>
                    </div>
                )}

                {/* Oyun İkonları */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {/* Joker Butonu — sadece onJoker geçildiyse göster */}
                    {onJoker !== undefined && (
                        <div className="flex items-center">
                            <button
                                onClick={onJoker}
                                disabled={jokerUsed}
                                className={`relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-90 group cursor-pointer border shadow-sm ${jokerUsed
                                    ? 'opacity-30 grayscale cursor-not-allowed bg-surface-mid/20 border-surface-mid/30'
                                    : 'bg-surface-dark dark:bg-white/5 border-surface-mid/50 text-text-secondary hover:text-primary hover:border-primary/30 hover:shadow-md'
                                    }`}
                                title={jokerUsed ? 'İpucu Kullanıldı' : 'İpucu Kullan (💡)'}
                                aria-label="İpucu"
                            >
                                <span className={`text-lg sm:text-xl ${!jokerUsed && 'group-hover:scale-110 transition-transform'}`}>💡</span>
                                {jokerUsed && <div className="absolute -top-1 -right-1 w-3 h-3 bg-text-muted rounded-full border-2 border-white shadow-sm" />}
                            </button>
                        </div>
                    )}

                    {/* Diğer Menü İtemleri */}
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={item.onClick}
                                disabled={item.disabled}
                                className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-90 group cursor-pointer border shadow-sm ${item.disabled
                                    ? 'opacity-30 grayscale cursor-not-allowed bg-surface-mid/20 border-surface-mid/30'
                                    : `bg-surface-dark dark:bg-white/5 border-surface-mid/50 ${item.colorClass || 'text-text-secondary'} hover:text-text-main hover:border-surface-mid hover:shadow-md`
                                    }`}
                                title={item.label}
                                aria-label={item.label}
                            >
                                <Icon size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
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

