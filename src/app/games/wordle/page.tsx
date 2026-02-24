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
import { SettingsModal } from '@/components/game/SettingsModal';
import { useGameSettings } from '@/context/GameSettingsContext';
import { formatTime } from '@/utils/timeUtils';
import { shareContent } from '@/utils/shareUtils';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Türkçe harf seti (fiziksel klavye desteği)
const TURKISH_LETTERS = new Set(
    'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz'.split('')
);

export default function WordlePage() {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const isPaused = showInfoModal || showStatsModal || showSettingsModal || showModal;

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
        elapsedTime,
        joker,
        score,
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
        useJoker
    } = useGame({
        initialWordLength: WORD_LENGTH,
        initialMaxGuesses: MAX_GUESSES,
        isPaused
    });

    const [shakeRow, setShakeRow] = useState(false);

    const { difficulty } = useGameSettings();

    // Oyunu başlat veya zorluk değiştiğinde yeniden başlat
    useEffect(() => {
        startNewGame(WORD_LENGTH, MAX_GUESSES);
    }, [startNewGame, difficulty]);

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

    // Paylaşma fonksiyonları
    const handleShare = async () => {
        const result = await shareContent({
            title: 'Kelime Oyunları - Wordle',
            text: 'Kelime Oyunları\'nda Wordle oyna! Bakalım bu kelimeyi bulabilecek misin?',
            url: window.location.href,
        });

        if (result.success && result.type === 'copy') {
            setToastMessage('Bağlantı kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleResultShare = async () => {
        const resultText = status === 'won'
            ? `Wordle'ı ${guesses.length}/${maxGuesses} denemede buldum! 🏆`
            : `Wordle'da şansım bu sefer yaver gitmedi. Bir dahaki sefere artık! 🧩`;

        const result = await shareContent({
            title: 'Wordle Sonucum',
            text: resultText,
            url: window.location.href,
        });

        if (result.success && result.type === 'copy') {
            setToastMessage('Sonuç kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
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
                    onShare={handleShare}
                    onJoker={useJoker}
                    jokerUsed={joker.used}
                    timerText={formatTime(elapsedTime)}
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
                    onShare={handleShare}
                    onJoker={useJoker}
                    jokerUsed={joker.used}
                    timerText={formatTime(elapsedTime)}
                />

                {/* Hata ve Bilgi Toast */}
                <ErrorToast message={error || toastMessage || ''} />

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
                <div className="px-1 sm:px-2 pb-4 sm:pb-6 shrink-0">
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
                onShare={handleResultShare}
                score={score}
            />

            {/* TODO: Placeholder Modallar - Gelecekte kendi bileşenleri ile değiştirilecek */}
            {/* Bilgi Modalı */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-surface p-8 rounded-3xl max-w-lg w-full border border-surface-hover shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl font-black text-text-main tracking-tighter">NASIL <span className="text-primary italic">OYNANIR?</span></h3>
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover text-text-muted hover:text-primary transition-colors"
                            >
                                <span className="text-2xl">×</span>
                            </button>
                        </div>

                        <GameInstructions
                            instructions={GAMES.find(g => g.id === 'wordle')!.instructions}
                        />

                        <button
                            onClick={() => setShowInfoModal(false)}
                            className="w-full mt-10 bg-primary text-bg font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                        >
                            ANLADIM, BAŞLA!
                        </button>
                    </motion.div>
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

            {/* Ayarlar Modalı */}
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
            />
        </div>
    );
}
