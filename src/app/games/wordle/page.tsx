'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { GameHeader } from '@/components/game/GameHeader';
import { GameKeyboard } from '@/components/game/GameKeyboard';
import { WordleBoard } from '@/components/game/WordleBoard';
import { GameEndModal } from '@/components/game/GameEndModal';
import { ErrorToast } from '@/components/game/ErrorToast';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';

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
                <GameInstructions
                    instructions={GAMES.find(g => g.id === 'wordle')!.instructions}
                    title="Wordle"
                />
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
