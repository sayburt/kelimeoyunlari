'use client';

import React, { useState } from 'react';
import { ArrowLeft, Info, BarChart2, Settings, Share2, Menu, X, Save, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { VisitorAuthModal } from './VisitorAuthModal';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showVisitorModal, setShowVisitorModal] = useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push(backHref);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    }

    const menuItems: MenuItem[] = [
        ...(isLoggedIn && gameStatus === 'playing' && onSave ? [{ icon: Save, label: 'Sonra Devam Et', onClick: onSave }] : []),
        ...(!isChallengeMode && onChallenge ? [{ icon: Swords, label: 'Meydan Oku', onClick: handleChallengeClick }] : []),
        { icon: Info, label: 'Nasıl Oynanır?', onClick: onHelp },
        { icon: BarChart2, label: 'İstatistikler', onClick: onStats },
        { icon: Settings, label: 'Ayarlar', onClick: onSettings },
        { icon: Share2, label: 'Oyunu Paylaş', onClick: onShare },
    ];


    return (
        <header className="flex items-center justify-between py-2 sm:py-3 px-4 sm:px-6 glass-header sticky top-0 z-50 w-full mb-2 sm:mb-4">
            {/* Sol: Geri Dön İkonu */}
            <div className="flex-1 flex justify-start">
                <button
                    onClick={handleBack}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface text-text-secondary hover:text-text-main hover:bg-surface-mid transition shadow-sm active:scale-95 cursor-pointer"
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
            <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
                {timerText && (
                    <div className="mr-0.5 sm:mr-1 pointer-events-none">
                        <span className="text-primary font-mono text-sm sm:text-base font-bold tabular-nums opacity-80 tracking-tighter">
                            {timerText}
                        </span>
                    </div>
                )}

                {/* Joker Butonu (Her zaman dışarıda) */}
                <button
                    onClick={onJoker}
                    disabled={jokerUsed}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 group cursor-pointer ${jokerUsed
                        ? 'opacity-40 grayscale cursor-not-allowed bg-surface/30'
                        : 'bg-surface text-text-secondary hover:text-primary hover:bg-surface-mid shadow-sm'
                        }`}
                    title={jokerUsed ? 'İpucu Kullanıldı' : 'İpucu Kullan (💡)'}
                    aria-label="İpucu"
                >
                    <span className={`text-base sm:text-xl ${!jokerUsed && 'group-hover:scale-125 transition-transform'}`}>💡</span>
                    {jokerUsed && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg" />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={item.onClick}
                                disabled={item.disabled}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 group cursor-pointer ${item.disabled
                                    ? 'opacity-30 grayscale cursor-not-allowed'
                                    : 'text-text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                                title={item.label}
                                aria-label={item.label}
                            >
                                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        );
                    })}
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden relative">
                    <button
                        onClick={toggleMenu}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-surface/50 transition-all active:scale-95 cursor-pointer"
                        aria-label="Menü"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setIsMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl glass-surface p-2 z-50 flex flex-col gap-1"
                                >
                                    {menuItems.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (!item.disabled) {
                                                        item.onClick?.();
                                                        setIsMenuOpen(false);
                                                    }
                                                }}
                                                disabled={item.disabled}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${item.disabled
                                                    ? 'opacity-30 grayscale cursor-not-allowed text-text-muted'
                                                    : 'text-text-main hover:bg-surface hover:text-primary'
                                                    }`}
                                            >
                                                <Icon size={18} />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <VisitorAuthModal
                isOpen={showVisitorModal}
                onClose={() => setShowVisitorModal(false)}
            />
        </header>
    );
}

