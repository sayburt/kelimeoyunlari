'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, Check, Sparkles, BookOpen } from 'lucide-react';
import { wordService } from '@/services/wordService';
import { challengeService } from '@/services/challengeService';
import { shareContent } from '@/utils/shareUtils';

interface ChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameName: string;
    wordLength: number;
}

type TabType = 'dictionary' | 'custom';

export function ChallengeModal({ isOpen, onClose, gameName, wordLength }: ChallengeModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('dictionary');
    const [dictionaryWord, setDictionaryWord] = useState('');
    const [customWord, setCustomWord] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState<'select' | 'share'>('select');

    // Kelime input handler (sadece harf, büyük harf)
    const sanitizeInput = (value: string) => {
        return value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ]/g, '').toLocaleUpperCase('tr-TR');
    };

    // Challenge oluştur
    const handleCreate = useCallback(async () => {
        const word = activeTab === 'dictionary' ? dictionaryWord : customWord;
        const wordType = activeTab;

        if (!word || word.length !== wordLength) {
            setErrorMessage(`Kelime tam olarak ${wordLength} harf olmalıdır.`);
            return;
        }

        // Sözlük sekmesinde kelime sözlükte var mı kontrol et
        if (activeTab === 'dictionary') {
            const isValid = await wordService.isValidWord(word);
            if (!isValid) {
                setErrorMessage('Bu kelime sözlükte bulunamadı. "Özel Kelime" sekmesini deneyin.');
                return;
            }
        }

        setIsCreating(true);
        setErrorMessage(null);
        try {
            const challengeId = await challengeService.createChallenge(gameName, word, wordType, wordLength);
            if (challengeId) {
                const url = `${window.location.origin}/games/${gameName}?challengeId=${challengeId}`;
                setChallengeUrl(url);
                setStep('share');
            }
        } catch (error) {
            console.error('Challenge oluşturma hatası:', error);
        } finally {
            setIsCreating(false);
        }
    }, [activeTab, dictionaryWord, customWord, wordLength, gameName]);

    // URL kopyala
    const handleCopy = useCallback(async () => {
        if (!challengeUrl) return;
        await navigator.clipboard.writeText(challengeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [challengeUrl]);

    // Paylaş
    const handleShare = useCallback(async () => {
        if (!challengeUrl) return;
        await shareContent({
            title: 'Meydan Okuma! ⚔️',
            text: `Sana bir meydan okuma gönderiyorum! Bu kelimeyi bulabilecek misin? 🧩`,
            url: challengeUrl,
        });
    }, [challengeUrl]);

    // Modal kapandığında sıfırla
    useEffect(() => {
        if (!isOpen) {
            setActiveTab('dictionary');
            setDictionaryWord('');
            setCustomWord('');
            setErrorMessage(null);
            setChallengeUrl(null);
            setCopied(false);
            setStep('select');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-[var(--theme-card-glass)] backdrop-blur-xl p-6 sm:p-8 rounded-3xl max-w-md w-full border border-[var(--theme-glass-border)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl sm:text-3xl font-black text-text-main tracking-tighter">
                            MEYDAN <span className="text-primary italic">OKUMA</span> ⚔️
                        </h3>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover text-text-muted hover:text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {step === 'select' ? (
                        <>
                            {/* Tab Seçimi */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setActiveTab('dictionary')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'dictionary'
                                        ? 'bg-primary text-bg shadow-lg shadow-primary/20'
                                        : 'bg-surface-hover text-text-secondary hover:text-text-main'
                                        }`}
                                >
                                    <BookOpen size={16} />
                                    Sözlükten Seç
                                </button>
                                <button
                                    onClick={() => setActiveTab('custom')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'custom'
                                        ? 'bg-primary text-bg shadow-lg shadow-primary/20'
                                        : 'bg-surface-hover text-text-secondary hover:text-text-main'
                                        }`}
                                >
                                    <Sparkles size={16} />
                                    Özel Kelime
                                </button>
                            </div>

                            {activeTab === 'dictionary' ? (
                                /* Sözlükten Kelime */
                                <div>
                                    <p className="text-text-secondary text-sm mb-4">
                                        Sözlükteki {wordLength} harfli bir kelime yaz. Sistem kelimeyi kontrol edecek.
                                    </p>
                                    <input
                                        type="text"
                                        value={dictionaryWord}
                                        onChange={(e) => {
                                            setDictionaryWord(sanitizeInput(e.target.value).slice(0, wordLength));
                                            setErrorMessage(null);
                                        }}
                                        placeholder={`${wordLength} harfli kelime yaz...`}
                                        maxLength={wordLength}
                                        className="w-full bg-bg border border-surface-hover rounded-xl px-4 py-3 text-text-main text-center font-mono font-bold text-xl tracking-[0.3em] uppercase placeholder:text-text-muted placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-xs ${dictionaryWord.length === wordLength ? 'text-green-500' : 'text-text-muted'}`}>
                                            {dictionaryWord.length}/{wordLength} harf
                                        </span>
                                        {errorMessage && (
                                            <span className="text-xs text-red-400">{errorMessage}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Özel Kelime */
                                <div>
                                    <p className="text-text-secondary text-sm mb-4">
                                        Kendi kelimeni gir! Özel isim, İngilizce veya argo kelime de olabilir.
                                    </p>
                                    <input
                                        type="text"
                                        value={customWord}
                                        onChange={(e) => {
                                            setCustomWord(sanitizeInput(e.target.value).slice(0, wordLength));
                                            setErrorMessage(null);
                                        }}
                                        placeholder={`${wordLength} harfli kelime gir...`}
                                        maxLength={wordLength}
                                        className="w-full bg-bg border border-surface-hover rounded-xl px-4 py-3 text-text-main text-center font-mono font-bold text-xl tracking-[0.3em] uppercase placeholder:text-text-muted placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition"
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-xs ${customWord.length === wordLength ? 'text-green-500' : 'text-text-muted'}`}>
                                            {customWord.length}/{wordLength} harf
                                        </span>
                                        {errorMessage && (
                                            <span className="text-xs text-red-400">{errorMessage}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Oluştur Butonu */}
                            <button
                                onClick={handleCreate}
                                disabled={
                                    isCreating ||
                                    (activeTab === 'dictionary' && dictionaryWord.length !== wordLength) ||
                                    (activeTab === 'custom' && customWord.length !== wordLength)
                                }
                                className="w-full mt-6 bg-primary text-bg font-black py-4 rounded-2xl premium-btn hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.98]"
                            >
                                {isCreating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="inline-block w-5 h-5 border-2 border-bg border-t-transparent rounded-full"
                                        />
                                        Oluşturuluyor...
                                    </span>
                                ) : (
                                    'MEYDAN OKUMA OLUŞTUR ⚔️'
                                )}
                            </button>
                        </>
                    ) : (
                        /* Share Step */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚔️</span>
                            </div>
                            <h4 className="text-xl font-bold text-text-main mb-2">Meydan Okuma Hazır!</h4>
                            <p className="text-text-secondary text-sm mb-6">
                                Bu linki arkadaşınla paylaş ve kelimeyi bulmasını izle!
                            </p>

                            {/* URL Gösterimi */}
                            <div className="bg-bg rounded-xl p-3 mb-6 border border-surface-hover">
                                <p className="text-xs text-text-muted font-mono break-all leading-relaxed">
                                    {challengeUrl}
                                </p>
                            </div>

                            {/* Aksiyon Butonları */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={handleCopy}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${copied
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-surface-hover text-text-main hover:bg-surface-mid'
                                        }`}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-primary text-bg premium-btn hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                >
                                    <Share2 size={18} />
                                    Paylaş
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl text-text-muted text-sm hover:text-text-main transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
