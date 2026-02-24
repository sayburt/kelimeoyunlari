'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { GameHeader } from '@/components/game/GameHeader';
import { GameKeyboard } from '@/components/game/GameKeyboard';
import { WordleBoard } from '@/components/game/WordleBoard';
import { GameEndModal } from '@/components/game/GameEndModal';
import { ErrorToast } from '@/components/game/ErrorToast';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Türkçe harf seti (fiziksel klavye desteği)
const TURKISH_LETTERS = new Set(
    'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz'.split('')
);

export default function WordlePage() {
    const {
        status,
        targetWord,
        guesses,
        currentGuess,
        currentRow,
        keyboardState,
        error,
        maxGuesses,
        wordLength,
        isSoundEnabled,
        toggleSound,
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
    } = useGame(WORD_LENGTH, MAX_GUESSES);

    const [shakeRow, setShakeRow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // TODO: Gerçek modal bileşenleri yapıldığında bu stateler onlara bağlanacak
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Oyunu başlat
    useEffect(() => {
        startNewGame(WORD_LENGTH, MAX_GUESSES);
    }, [startNewGame]);

    // Kazanma/kaybetme durumunda modal aç
    useEffect(() => {
        if (status === 'won' || status === 'lost') {
            const timer = setTimeout(() => setShowModal(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Hata durumunda shake animasyonu
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setShakeRow(true);
            }, 0);
            const timer = setTimeout(() => setShakeRow(false), 500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Fiziksel klavye desteği
    const handlePhysicalKeyboard = useCallback(
        (e: KeyboardEvent) => {
            if (status !== 'playing') return;

            if (e.key === 'Enter') {
                e.preventDefault();
                handleEnter();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                handleDelete();
            } else if (e.key.length === 1 && TURKISH_LETTERS.has(e.key)) {
                e.preventDefault();
                handleKeyPress(e.key);
            }
        },
        [status, handleEnter, handleDelete, handleKeyPress]
    );

    useEffect(() => {
        window.addEventListener('keydown', handlePhysicalKeyboard);
        return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
    }, [handlePhysicalKeyboard]);

    // Yeni oyun başlat
    const handleRestart = () => {
        setShowModal(false);
        startNewGame(WORD_LENGTH, MAX_GUESSES);
    };

    // Yükleniyor durumu
    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="WORDLE"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    soundEnabled={isSoundEnabled}
                    onToggleSound={toggleSound}
                />
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-bg text-text-main overflow-y-auto w-full">
            {/* Oyun Alanı */}
            <div className="flex flex-col min-h-[100dvh] shrink-0">
                <GameHeader
                    title="WORDLE"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    soundEnabled={isSoundEnabled}
                    onToggleSound={toggleSound}
                />

                {/* Hata Toast */}
                <ErrorToast message={error} />

                {/* Oyun Tahtası */}
                <div className="flex-1 flex items-center justify-center px-4 py-2">
                    <WordleBoard
                        guesses={guesses}
                        currentGuess={currentGuess}
                        currentRow={currentRow}
                        wordLength={wordLength}
                        maxGuesses={maxGuesses}
                        shakeRow={shakeRow}
                        status={status}
                    />
                </div>

                {/* Klavye */}
                <div className="px-2 pb-4 sm:pb-6 shrink-0">
                    <GameKeyboard
                        onKeyPress={handleKeyPress}
                        onEnter={handleEnter}
                        onDelete={handleDelete}
                        keyStates={keyboardState}
                    />
                </div>
            </div>

            {/* SEO & Nasıl Oynanır Bölümü */}
            <section className="w-full max-w-2xl mx-auto px-6 py-12 md:py-16 border-t border-surface/50">
                <h2 className="text-2xl font-bold mb-6 text-primary">Wordle Nasıl Oynanır?</h2>

                <div className="space-y-4 text-sm sm:text-base text-text-main/90">
                    <p>
                        Amacınız 5 harfli gizli kelimeyi 6 denemede bulmaktır. Her tahmin geçerli 5 harfli bir kelime olmalıdır.
                        Tahmininizi yazdıktan sonra göndermek için <strong>Enter</strong> tuşuna basın.
                    </p>
                    <p>
                        Her tahminden sonra, harflerin rengi tahmininizin gizli kelimeye ne kadar yakın olduğunu göstermek için değişecektir:
                    </p>

                    <div className="my-6 space-y-6">
                        <div>
                            <div className="flex gap-1 mb-2">
                                <span className="w-10 h-10 flex items-center justify-center bg-correct text-white font-bold rounded-lg shrink-0">K</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">A</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">L</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">E</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">M</span>
                            </div>
                            <p><strong>K</strong> harfi kelimede var ve <strong>doğru yerde</strong>.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 mb-2">
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">S</span>
                                <span className="w-10 h-10 flex items-center justify-center bg-present text-white font-bold rounded-lg shrink-0">I</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">N</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">A</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">V</span>
                            </div>
                            <p><strong>I</strong> harfi kelimede var ama <strong>yanlış yerde</strong>.</p>
                        </div>

                        <div>
                            <div className="flex gap-1 mb-2">
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">B</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">A</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">Ş</span>
                                <span className="w-10 h-10 flex items-center justify-center bg-absent text-white font-bold rounded-lg shrink-0">A</span>
                                <span className="w-10 h-10 flex items-center justify-center border-2 border-surface-mid font-bold rounded-lg shrink-0">K</span>
                            </div>
                            <p><strong>A</strong> harfi kelimede <strong>hiç yok</strong>.</p>
                        </div>
                    </div>

                    <p className="mt-8 pt-6 border-t border-surface-hover/30 text-text-muted">
                        Kelime dağarcığınızı test edin ve zihninizi canlı tutun!
                    </p>
                </div>
            </section>

            {/* Kazanma / Kaybetme Modal */}
            <GameEndModal
                isOpen={showModal}
                status={status}
                guessesCount={guesses.length}
                maxGuesses={maxGuesses}
                targetWord={targetWord}
                onRestart={handleRestart}
            />

            {/* TODO: Placeholder Modallar - Gelecekte kendi bileşenleri ile değiştirilecek */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface p-6 rounded-xl max-w-sm w-full border border-surface-hover shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Nasıl Oynanır?</h3>
                        <p className="text-text-secondary mb-6">Detaylı oyun kuralları ve bilgi ekranı buraya gelecek.</p>
                        <button onClick={() => setShowInfoModal(false)} className="w-full bg-primary text-black font-bold py-2 rounded-lg">Kapat</button>
                    </div>
                </div>
            )}

            {showStatsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface p-6 rounded-xl max-w-sm w-full border border-surface-hover shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">İstatistikler</h3>
                        <p className="text-text-secondary mb-6">Oyuncu istatistikleri ve skor tablosu buraya gelecek.</p>
                        <button onClick={() => setShowStatsModal(false)} className="w-full bg-primary text-black font-bold py-2 rounded-lg">Kapat</button>
                    </div>
                </div>
            )}

            {showSettingsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface p-6 rounded-xl max-w-sm w-full border border-surface-hover shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Ayarlar</h3>
                        <p className="text-text-secondary mb-6">Tema, ses, renk körü modu gibi ayarlar buraya gelecek.</p>
                        <button onClick={() => setShowSettingsModal(false)} className="w-full bg-primary text-black font-bold py-2 rounded-lg">Kapat</button>
                    </div>
                </div>
            )}
        </div>
    );
}
