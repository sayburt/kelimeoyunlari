import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { useGameSettings, DifficultyLevel, CategoryOption } from '@/context/GameSettingsContext';
import { useTheme } from 'next-themes';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    showCategory?: boolean;
}

export function SettingsModal({ isOpen, onClose, showCategory }: SettingsModalProps) {
    const { difficulty, setDifficulty, category, setCategory, isSoundEnabled, toggleSound } = useGameSettings();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'game' | 'system'>('game');
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

    const categoryOptions: { id: CategoryOption; label: string }[] = [
        { id: 'rastgele', label: 'RASTGELE' },
        { id: 'Bitkiler', label: 'BİTKİLER' },
        { id: 'Coğrafya & Yerler', label: 'COĞRAFYA' },
        { id: 'Eşyalar', label: 'EŞYALAR' },
        { id: 'Hayvanlar', label: 'HAYVANLAR' },
        { id: 'İsimler', label: 'İSİMLER' },
        { id: 'Giyim & Moda', label: 'MODA' },
        { id: 'Yiyecek & İçecek', label: 'MUTFAK' },
        { id: 'Vücut & Sağlık', label: 'SAĞLIK' },
        { id: 'Sanat & Kültür', label: 'SANAT' },
        { id: 'Spor', label: 'SPOR' },
        { id: 'Bilim & Teknoloji', label: 'TEKNOLOJİ' },
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

                    {/* Tab Navigation */}
                    <div className="flex bg-surface-hover/30 p-1 rounded-2xl mb-6 relative z-10 border border-surface-mid/50">
                        <button
                            onClick={() => setActiveTab('game')}
                            className={`flex-1 py-2.5 text-xs font-black tracking-widest uppercase transition-all rounded-xl relative ${activeTab === 'game' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Oyun
                            {activeTab === 'game' && (
                                <motion.div
                                    layoutId="settings-tab"
                                    className="absolute inset-0 bg-surface rounded-xl shadow-sm border border-surface-mid/50 -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`flex-1 py-2.5 text-xs font-black tracking-widest uppercase transition-all rounded-xl relative ${activeTab === 'system' ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Sistem
                            {activeTab === 'system' && (
                                <motion.div
                                    layoutId="settings-tab"
                                    className="absolute inset-0 bg-surface rounded-xl shadow-sm border border-surface-mid/50 -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    </div>

                    <div className="space-y-6 relative max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'game' ? (
                                <motion.div
                                    key="game-settings"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Zorluk Ayarı */}
                                    <div>
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block opacity-80">
                                            Oyun Zorluk Seviyesi
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {difficultyOptions.map((option) => (
                                                <button
                                                    key={option.level}
                                                    onClick={() => setDifficulty(option.level)}
                                                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 transition-all relative group ${difficulty === option.level
                                                        ? 'border-primary bg-primary/10 shadow-[0_4px_12px_-4px_rgba(34,211,238,0.3)]'
                                                        : 'border-surface-mid bg-surface-hover/50 hover:border-surface-hover text-text-secondary'
                                                        }`}
                                                >
                                                    <span className={`text-[11px] font-black tracking-tight ${difficulty === option.level ? 'text-primary' : ''}`}>
                                                        {option.label}
                                                    </span>
                                                    {difficulty === option.level && (
                                                        <motion.div
                                                            layoutId="active-difficulty"
                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-bg shadow-md"
                                                        >
                                                            <Check size={12} strokeWidth={4} />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Kategoriler */}
                                    {showCategory && (
                                        <div>
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block opacity-80">
                                                Oyun Kategorisi
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {categoryOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setCategory(option.id)}
                                                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 transition-all relative group ${category === option.id
                                                            ? 'border-primary bg-primary/10 shadow-[0_4px_12px_-4px_rgba(34,211,238,0.3)]'
                                                            : 'border-surface-mid bg-surface-hover/50 hover:border-surface-hover text-text-secondary'
                                                            }`}
                                                    >
                                                        <span className={`text-[11px] font-black tracking-tight text-center leading-tight ${category === option.id ? 'text-primary' : ''}`}>
                                                            {option.label}
                                                        </span>
                                                        {category === option.id && (
                                                            <motion.div
                                                                layoutId="active-category"
                                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-bg shadow-md"
                                                            >
                                                                <Check size={12} strokeWidth={4} />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="system-settings"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Diğer Ayarlar */}
                                    <div className="bg-surface-hover/30 border border-surface-mid/50 rounded-2xl divide-y divide-surface-mid/50 overflow-hidden">
                                        {/* Ses Ayarı */}
                                        <div className="flex items-center justify-between p-4 px-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSoundEnabled ? 'bg-primary/20 text-primary' : 'bg-surface-mid text-text-muted'}`}>
                                                    {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main text-sm">Oyun Sesleri</h4>
                                                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">Efektler ve Uyarılar</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleSound}
                                                className={`w-12 h-7 rounded-full p-1 transition-all relative ${isSoundEnabled ? 'bg-primary shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-surface-mid'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: isSoundEnabled ? 20 : 0 }}
                                                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                                                />
                                            </button>
                                        </div>

                                        {/* Tema Ayarı */}
                                        <div className="flex items-center justify-between p-4 px-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-surface-mid/50 flex items-center justify-center text-primary">
                                                    {mounted && (theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main text-sm">Görünüm</h4>
                                                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">Koyu / Açık Tema</p>
                                                </div>
                                            </div>
                                            <div className="flex bg-surface border border-surface-mid/50 rounded-lg p-1 gap-1">
                                                <button
                                                    onClick={() => setTheme('light')}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                                    title="Açık Tema"
                                                >
                                                    <Sun size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setTheme('dark')}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${theme === 'dark' ? 'bg-surface-hover text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                                                    title="Koyu Tema"
                                                >
                                                    <Moon size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 bg-text-main text-bg font-black py-4 rounded-xl hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 uppercase tracking-[0.2em] text-sm active:scale-[0.98]"
                    >
                        TAMAM
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
