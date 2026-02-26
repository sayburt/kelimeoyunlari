'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHangman } from '@/hooks/useHangman';
import { GameHeader } from '@/components/game/GameHeader';
import { GameEndModal } from '@/components/game/GameEndModal';
import { ErrorToast } from '@/components/game/ErrorToast';
import { SettingsModal } from '@/components/game/SettingsModal';
import { InfoModal } from '@/components/game/InfoModal';
import { StatsModal } from '@/components/game/StatsModal';
import { useAuth } from '@/hooks/useAuth';
import { formatTime } from '@/utils/timeUtils';
import { shareContent } from '@/utils/shareUtils';
import { HangmanDrawing } from '@/components/game/HangmanDrawing';
import { HangmanKeyboard } from '@/components/game/HangmanKeyboard';
import { HangmanWordDisplay } from '@/components/game/HangmanWordDisplay';

const GAME_NAME = 'hangman';

function AdamAsmacaPageContent() {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const isPaused = showInfoModal || showStatsModal || showSettingsModal || showResultModal;

    const { isAuthenticated } = useAuth();

    const {
        status,
        targetWord,
        guessedLetters,
        wrongGuesses,
        maxLives,
        keyboardState,
        error,
        elapsedTime,
        joker,
        score,
        startNewGame,
        handleGuess,
        useJoker,
    } = useHangman({
        isPaused,
    });

    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!hasStartedRef.current && status === 'idle') {
            hasStartedRef.current = true;
            startNewGame();
        }
    }, [startNewGame, status]);

    useEffect(() => {
        if (status === 'won' || status === 'lost') {
            const timer = setTimeout(() => setShowResultModal(true), 1200);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleRestart = () => {
        setShowResultModal(false);
        startNewGame();
    };

    const handleResultShare = async () => {
        const resultText = status === 'won'
            ? `Adam Asmaca'yı ${elapsedTime / 1000} saniyede buldum! 🏆`
            : `Adam Asmaca'da şansım bu sefer yaver gitmedi. 🧩`;
        const result = await shareContent({
            title: 'Adam Asmaca Sonucum',
            text: resultText,
            url: window.location.href,
        });
        if (result.success && result.type === 'copy') {
            setToastMessage('Sonuç kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleShare = async () => {
        const result = await shareContent({
            title: 'Kelime Oyunları - Adam Asmaca',
            text: 'Kelime Oyunları\'nda Adam Asmaca oyna!',
            url: window.location.href,
        });
        if (result.success && result.type === 'copy') {
            setToastMessage('Bağlantı kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="ADAM ASMACA"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    onShare={handleShare}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status}
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
        <div className="h-[100dvh] flex flex-col bg-bg text-text-main overflow-hidden w-full">
            <div className="flex flex-col h-full shrink-0">
                <GameHeader
                    title="ADAM ASMACA"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    onShare={handleShare}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status}
                    onJoker={useJoker}
                    jokerUsed={joker.used}
                    timerText={formatTime(elapsedTime)}
                />

                <ErrorToast message={error || toastMessage || ''} />

                {/* Oyun İçeriği — Alt Hiza Klavyeye Dayalı (Scroll olmaması için esneyebilir) */}
                <div className="flex-1 min-h-0 flex flex-row w-full max-w-4xl mx-auto px-2 sm:px-4 mt-2 sm:mt-4 mb-2 sm:mb-4 gap-2 sm:gap-4 items-end justify-center">
                    {/* Sol Sütun (Figür) */}
                    <div className="w-1/2 h-full flex justify-end items-end pb-2">
                        <div className="w-full h-full max-w-[320px] max-h-full flex items-end">
                            <HangmanDrawing wrongGuesses={wrongGuesses} />
                        </div>
                    </div>

                    {/* Sağ Sütun (Can ve Gizli Kelime) */}
                    <div className="w-1/2 flex flex-col justify-between self-stretch py-4 sm:py-6 pl-2 sm:pl-8">
                        {/* Can göstergesi (Üstte) */}
                        <div className="flex gap-1.5 sm:gap-2 items-center mb-auto pt-4 sm:pt-8 min-h-[32px]">
                            {Array.from({ length: maxLives }).map((_, i) => (
                                <Heart
                                    key={i}
                                    className={`w-5 h-5 sm:w-7 sm:h-7 ${i < maxLives - wrongGuesses
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-muted-foreground opacity-20'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Gizli Kelime (Altta) */}
                        <div className="flex items-end mt-auto pb-4 sm:pb-6">
                            <HangmanWordDisplay
                                targetWord={targetWord}
                                guessedLetters={guessedLetters}
                                status={status}
                            />
                        </div>
                    </div>
                </div>

                {/* Klavye — Alta Sabit */}
                <div className="px-1 sm:px-2 pb-2 sm:pb-3 shrink-0">
                    <HangmanKeyboard
                        onKeyPress={handleGuess}
                        keyboardState={keyboardState}
                        disabled={status !== 'playing'}
                    />
                </div>
            </div>

            <GameEndModal
                isOpen={showResultModal}
                status={status}
                guessesCount={wrongGuesses}
                maxGuesses={maxLives}
                targetWord={targetWord}
                isChallenge={false}
                onRestart={handleRestart}
                onShare={handleResultShare}
                score={score}
            />

            {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
            {showStatsModal && <StatsModal gameName={GAME_NAME} onClose={() => setShowStatsModal(false)} />}

            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                showCategory={true}
            />
        </div>
    );
}

export default function AdamAsmacaPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                    />
                </div>
            </div>
        }>
            <AdamAsmacaPageContent />
        </Suspense>
    );
}
