'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { useBoggle } from '@/hooks/useBoggle';
import { GameHeader } from '@/components/game/GameHeader';
import { GameEndModal } from '@/components/game/GameEndModal';
import { ErrorToast } from '@/components/game/ErrorToast';
import { SettingsModal } from '@/components/game/SettingsModal';
import { InfoModal } from '@/components/game/InfoModal';
import { StatsModal } from '@/components/game/StatsModal';
import { BoggleGrid } from '@/components/game/BoggleGrid';
import { BoggleWordList } from '@/components/game/BoggleWordList';
import { BoggleTimer } from '@/components/game/BoggleTimer';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';
import { useAuth } from '@/hooks/useAuth';
import { shareContent } from '@/utils/shareUtils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGameModals } from '@/hooks/useGameModals';

const GAME_NAME = 'boggle';

function BogglePageContent() {
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
        grid,
        gridSize,
        selectedPath,
        foundWords,
        remainingTime,
        gameDuration,
        error,
        lastWordResult,
        score,
        totalPoints,
        currentWord,
        startNewGame,
        selectCell,
        clearSelection,
        submitWord,
    } = useBoggle({
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
        if (status === 'finished') {
            const timer = setTimeout(() => setShowResultModal(true), 800);
            return () => clearTimeout(timer);
        }
    }, [status, setShowResultModal]);

    const handleRestart = () => {
        setShowResultModal(false);
        startNewGame();
    };

    const handleResultShare = async () => {
        const resultText = `Boggle'da ${foundWords.length} kelime bularak ${score} puan aldım! 🧩`;
        const result = await shareContent({
            title: 'Boggle Sonucum',
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
            title: 'Kelime Oyunları - Boggle',
            text: 'Kelime Oyunları\'nda Boggle oyna!',
            url: window.location.href,
        });
        if (result.success && result.type === 'copy') {
            setToastMessage('Bağlantı kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    // Timer text for header
    const seconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerText = `${minutes}:${secs.toString().padStart(2, '0')}`;

    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="BOGGLE"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    onShare={handleShare}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status === 'loading' ? 'loading' : 'idle'}
                    timerText={timerText}
                />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-bg text-text-main overflow-y-auto w-full">
            <div className="flex flex-col h-[100dvh] lg:h-auto lg:min-h-[100dvh] shrink-0">
                <GameHeader
                    title="BOGGLE"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                    onShare={handleShare}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status === 'finished' ? 'won' : status === 'playing' ? 'playing' : 'idle'}
                    timerText={timerText}
                />

                <ErrorToast message={error || toastMessage || ''} />

                {/* Oyun içeriği */}
                <div className="flex-1 flex flex-col lg:flex-row items-stretch justify-start lg:justify-center gap-4 lg:gap-6 px-3 sm:px-4 py-2 sm:py-3 max-w-4xl mx-auto w-full min-h-0 pb-4 lg:pb-8">

                    {/* Sol/Üst: Seçili Kelime, Izgara & Timer */}
                    <div className="w-full max-w-[320px] sm:max-w-[360px] flex-shrink-0 flex flex-col justify-between">
                        {/* Seçili kelime göstergesi — sabit yükseklik */}
                        <div className="h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 mb-3 lg:mb-4">
                            {currentWord ? (
                                <span className="text-primary font-black text-lg tracking-widest">
                                    {currentWord}
                                </span>
                            ) : (
                                <span className="text-text-muted/30 text-sm font-medium italic">
                                    Harfleri sürükleyin...
                                </span>
                            )}
                        </div>

                        <div className="my-auto">
                            <BoggleGrid
                                grid={grid}
                                gridSize={gridSize}
                                selectedPath={selectedPath}
                                lastWordResult={lastWordResult}
                                onSelectCell={selectCell}
                                onSubmitWord={submitWord}
                                onClearSelection={clearSelection}
                                disabled={status !== 'playing'}
                            />
                        </div>

                        <div className="w-full shrink-0 mt-3 lg:mt-4">
                            <BoggleTimer
                                remainingTime={remainingTime}
                                gameDuration={gameDuration}
                            />
                        </div>
                    </div>

                    {/* Sağ/Alt: Bulunan Kelimeler Listesi */}
                    <div className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-none lg:w-72 flex-1 lg:flex-none min-h-0 flex flex-col items-stretch">
                        {/* Bulunan kelimeler kutusu: mobilde min-h, desktop'taki items-stretch divi içinde h-full ile dış konteynıra yapışır */}
                        <div className="flex-1 lg:h-full flex flex-col min-h-[140px] sm:min-h-[200px] overflow-hidden bg-surface/20 rounded-2xl border border-surface-active/20 p-2 sm:p-3">
                            <div className="flex-1 overflow-y-auto pr-1">
                                <BoggleWordList
                                    foundWords={foundWords}
                                    totalPoints={totalPoints}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Section */}
            <section className="w-full max-w-2xl mx-auto px-6 py-12 md:py-16 border-t border-surface/50">
                <GameInstructions
                    instructions={GAMES.find(g => g.id === 'boggle')!.instructions}
                    title="Boggle"
                    gameId="boggle"
                />
            </section>

            {/* Game End Modal */}
            <GameEndModal
                isOpen={showResultModal}
                status="won"
                guessesCount={foundWords.length}
                maxGuesses={0}
                targetWord={null}
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
            />
        </div>
    );
}

export default function BogglePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        }>
            <BogglePageContent />
        </Suspense>
    );
}
