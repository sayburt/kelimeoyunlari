'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { Heart } from 'lucide-react';
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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGameModals } from '@/hooks/useGameModals';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';

const GAME_NAME = 'adam-asmaca';

function AdamAsmacaPageContent() {
    const {
        showInfoModal, setShowInfoModal,
        showStatsModal, setShowStatsModal,
        showSettingsModal, setShowSettingsModal,
        showResultModal, setShowResultModal,
        isPaused,
    } = useGameModals();
    const [toastMessage, setToastMessage] = React.useState<string | null>(null);

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
    }, [status, setShowResultModal]);

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
                    <LoadingSpinner />
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
                <div className="flex-1 min-h-0 flex flex-col sm:flex-row w-full max-w-2xl mx-auto px-1 sm:px-2 mt-2 sm:mt-4 mb-4 sm:mb-4 gap-2 sm:gap-4 items-center justify-center">
                    {/* Sol Sütun (Figür) */}
                    <div className="w-full sm:w-1/2 h-full flex justify-center items-end bg-surface-mid/50 rounded-xl sm:rounded-2xl border border-surface-hover/30 p-2 sm:p-4 shadow-sm min-h-[220px] sm:min-h-0">
                        <div className="w-full h-full max-w-[280px] max-h-full flex items-end justify-center">
                            <HangmanDrawing wrongGuesses={wrongGuesses} />
                        </div>
                    </div>

                    {/* Sağ Sütun (Can ve Gizli Kelime) */}
                    <div className="w-full sm:w-1/2 flex flex-col justify-between bg-surface-mid/50 rounded-xl sm:rounded-2xl border border-surface-hover/30 p-3 sm:p-6 shadow-sm min-h-[90px] h-auto sm:min-h-0 sm:h-full mb-2 sm:mb-0">
                        {/* Can göstergesi (Üstte) */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center pb-2 sm:pb-0 sm:mb-auto min-h-[20px] sm:min-h-[32px]">
                            {Array.from({ length: maxLives }).map((_, i) => (
                                <Heart
                                    key={i}
                                    className={`w-4 h-4 sm:w-6 sm:h-6 ${i < maxLives - wrongGuesses
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-muted-foreground opacity-20'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Gizli Kelime (Altta) */}
                        <div className="flex justify-center items-end mt-auto pt-2 sm:mt-4">
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

            <section className="w-full max-w-2xl mx-auto px-6 py-12 md:py-16 border-t border-surface/50">
                <GameInstructions
                    instructions={GAMES.find(g => g.id === 'adam-asmaca')!.instructions}
                    title="Adam Asmaca"
                    gameId="adam-asmaca"
                />
            </section>

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
                    <LoadingSpinner />
                </div>
            </div>
        }>
            <AdamAsmacaPageContent />
        </Suspense>
    );
}
