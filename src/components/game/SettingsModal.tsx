import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { useGameSettings, DifficultyLevel } from '@/context/GameSettingsContext';
import { useTheme } from 'next-themes';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { difficulty, setDifficulty, isSoundEnabled, toggleSound } = useGameSettings();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Use a microtask to avoid the synchronous setState warning if needed,
        // or just accept that this might trigger an extra render for hydration.
        // In this case, it's safer to use requestAnimationFrame or similar to ensure it's not synchronous.
        const timer = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(timer);
    }, []);

    const difficultyOptions: { level: DifficultyLevel; label: string; description: string }[] = [
        { level: 1, label: 'KOLAY', description: 'Yaygın kelimeler.' },
        { level: 2, label: 'ORTA', description: 'Standart zorluk.' },
        { level: 3, label: 'ZOR', description: 'Nadir ve zorlayıcı.' },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[var(--theme-card-glass)] backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] max-w-md w-full border border-[var(--theme-glass-border)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
                >
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex justify-between items-center mb-10 relative">
                        <div>
                            <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">
                                AYAR<span className="text-primary italic">LAR</span>
                            </h3>
                            <p className="text-text-muted text-xs font-bold mt-1 tracking-widest uppercase opacity-70">Oyun Deneyimi</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-hover text-text-muted hover:text-primary transition-all active:scale-95 border border-surface-mid/50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-8 relative">
                        {/* Zorluk Ayarı */}
                        <div>
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block opacity-80">
                                Oyun Zorluk Seviyesi
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {difficultyOptions.map((option) => (
                                    <button
                                        key={option.level}
                                        onClick={() => setDifficulty(option.level)}
                                        className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border-2 transition-all relative group ${difficulty === option.level
                                            ? 'border-primary bg-primary/10 shadow-[0_8px_20px_-4px_rgba(34,211,238,0.3)]'
                                            : 'border-surface-mid bg-surface-hover/50 hover:border-surface-hover text-text-secondary'
                                            }`}
                                    >
                                        <span className={`text-xs font-black tracking-tight mb-1 ${difficulty === option.level ? 'text-primary' : ''}`}>
                                            {option.label}
                                        </span>
                                        {difficulty === option.level && (
                                            <motion.div
                                                layoutId="active-difficulty"
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-bg shadow-lg"
                                            >
                                                <Check size={14} strokeWidth={4} />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ses Ayarı */}
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-surface-hover/30 border border-surface-mid/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSoundEnabled ? 'bg-primary/20 text-primary' : 'bg-surface-mid text-text-muted'}`}>
                                    {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-text-main text-sm">Oyun Sesleri</h4>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Efektler ve Uyarılar</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleSound}
                                className={`w-14 h-8 rounded-full p-1 transition-all relative ${isSoundEnabled ? 'bg-primary shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-surface-mid'}`}
                            >
                                <motion.div
                                    animate={{ x: isSoundEnabled ? 24 : 0 }}
                                    className="w-6 h-6 rounded-full bg-white shadow-md"
                                />
                            </button>
                        </div>

                        {/* Tema Ayarı */}
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-surface-hover/30 border border-surface-mid/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-surface-mid/50 flex items-center justify-center text-primary">
                                    {mounted && (theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />)}
                                </div>
                                <div>
                                    <h4 className="font-black text-text-main text-sm">Görünüm</h4>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Koyu / Açık Tema</p>
                                </div>
                            </div>
                            <div className="flex bg-surface-mid rounded-xl p-1 gap-1">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                    title="Açık Tema"
                                >
                                    <Sun size={18} />
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${theme === 'dark' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                    title="Koyu Tema"
                                >
                                    <Moon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-10 bg-text-main text-bg font-black py-5 rounded-2xl hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 uppercase tracking-[0.2em] text-sm active:scale-[0.98]"
                    >
                        TAMAM
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
