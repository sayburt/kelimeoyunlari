'use client';

import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { useWordSearch } from '@/hooks/useWordSearch';
import { useGameModals } from '@/hooks/useGameModals';
import { useAuth } from '@/hooks/useAuth';
import { useGameSettings } from '@/context/GameSettingsContext';
import { formatTime } from '@/utils/timeUtils';
import { shareContent } from '@/utils/shareUtils';
import { GameHeader } from '@/components/game/GameHeader';
import { ErrorToast } from '@/components/game/ErrorToast';
import { SettingsModal } from '@/components/game/SettingsModal';
import { InfoModal } from '@/components/game/InfoModal';
import { StatsModal } from '@/components/game/StatsModal';
import { GameEndModal } from '@/components/game/GameEndModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WordSearchGrid } from '@/components/game/WordSearchGrid';
import { WordSearchWordList } from '@/components/game/WordSearchWordList';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';
import { useSyncedElementHeight } from '@/hooks/useSyncedElementHeight';

const GAME_NAME = 'kelime-arama';

function getDifficultyLabel(difficulty: number): string {
    if (difficulty === 2) return 'Orta';
    if (difficulty === 3) return 'Zor';
    return 'Kolay';
}

function WordSearchPageContent() {
    const {
        showInfoModal, setShowInfoModal,
        showStatsModal, setShowStatsModal,
        showSettingsModal, setShowSettingsModal,
        showResultModal, setShowResultModal,
        isPaused,
    } = useGameModals();
    const [toastMessage, setToastMessage] = React.useState<string | null>(null);
    const { difficulty } = useGameSettings();

    const { isAuthenticated } = useAuth();
    const {
        status,
        grid,
        gridSize,
        words,
        selectedCells,
        hintCells,
        foundPaths,
        foundWordCount,
        totalWordCount,
        error,
        joker,
        score,
        elapsedTime,
        startNewGame,
        previewSelection,
        clearSelection,
        handleSelection,
        useJoker,
    } = useWordSearch({ isPaused });
    const { elementRef: gridPanelRef, height: gridPanelHeight } = useSyncedElementHeight<HTMLDivElement>(status === 'playing' || status === 'won');

    const hasStartedRef = useRef(false);
    const rightPanelStyle = useMemo(
        () => ({
            '--grid-panel-height': gridPanelHeight ? `${gridPanelHeight}px` : undefined,
        } as React.CSSProperties),
        [gridPanelHeight]
    );

    useEffect(() => {
        if (!hasStartedRef.current && status === 'idle') {
            hasStartedRef.current = true;
            startNewGame();
        }
    }, [status, startNewGame]);

    useEffect(() => {
        if (status === 'won') {
            const timer = setTimeout(() => setShowResultModal(true), 800);
            return () => clearTimeout(timer);
        }
    }, [status, setShowResultModal]);

    const handleRestart = () => {
        setShowResultModal(false);
        startNewGame();
    };

    const handleShare = async () => {
        const result = await shareContent({
            title: 'Kelime Oyunları - Kelime Arama',
            text: 'Kelime Oyunları\'nda Kelime Arama oyna!',
            url: window.location.href,
        });

        if (result.success && result.type === 'copy') {
            setToastMessage('Bağlantı kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleResultShare = async () => {
        const result = await shareContent({
            title: 'Kelime Arama Sonucum',
            text: `Kelime Arama'da ${foundWordCount} kelime bulup ${score} puan aldım! 🔎`,
            url: window.location.href,
        });

        if (result.success && result.type === 'copy') {
            setToastMessage('Sonuç kopyalandı!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="KELIME ARAMA"
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
        <div className="min-h-[100dvh] flex flex-col bg-bg text-text-main overflow-y-auto w-full">
            <div className="flex flex-col min-h-[100dvh] shrink-0">
                <GameHeader
                    title="KELIME ARAMA"
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

                <div className="flex-1 flex flex-col gap-3 px-3 sm:px-4 py-2 sm:py-3 max-w-6xl mx-auto w-full min-h-0 pb-4 lg:pb-8">
                    <div className="w-full max-w-[680px] rounded-2xl border border-surface-active/30 bg-surface/25 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2">
                        <div className="text-xs sm:text-sm text-text-muted font-bold uppercase tracking-wider">
                            Oyun Durumu
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide px-2 py-1 rounded-lg border border-surface-active/40 bg-surface/40 text-text-muted">
                                Zorluk: {getDifficultyLabel(difficulty)}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-text-main">{foundWordCount}/{totalWordCount} bulundu</span>
                            <span className="text-sm sm:text-base font-black text-primary">{score} puan</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col lg:flex-row items-stretch justify-start lg:justify-start gap-4 lg:gap-6 w-full min-h-0">
                        <div className="w-full max-w-[680px] flex-none lg:self-stretch min-h-0">
                            <div ref={gridPanelRef} className="w-full rounded-2xl border border-surface-active/20 bg-surface/20 p-2 sm:p-3 overflow-hidden">
                                <div className="w-full max-w-[420px] sm:max-w-[540px] lg:max-w-none mx-auto">
                                    <WordSearchGrid
                                        grid={grid}
                                        gridSize={gridSize}
                                        selectedCells={selectedCells}
                                        foundPaths={foundPaths}
                                        hintCells={hintCells}
                                        disabled={status !== 'playing'}
                                        onPreviewSelection={previewSelection}
                                        onHandleSelection={handleSelection}
                                        onClearPreview={clearSelection}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            className="w-full lg:w-80 flex-none lg:self-stretch min-h-0 flex flex-col items-stretch"
                            style={rightPanelStyle}
                        >
                            <div className="h-[240px] sm:h-[300px] lg:h-[var(--grid-panel-height,300px)] lg:max-h-[var(--grid-panel-height,300px)] flex flex-col min-h-0 overflow-hidden bg-surface/20 rounded-2xl border border-surface-active/20 p-2 sm:p-3">
                                <WordSearchWordList words={words} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="w-full max-w-2xl mx-auto px-6 py-12 md:py-16 border-t border-surface/50">
                <GameInstructions
                    instructions={GAMES.find(g => g.id === GAME_NAME)!.instructions}
                    title="Kelime Arama"
                    gameId={GAME_NAME}
                />
            </section>

            <GameEndModal
                isOpen={showResultModal}
                status={status === 'won' ? 'won' : 'playing'}
                guessesCount={foundWordCount}
                maxGuesses={Math.max(totalWordCount, 1)}
                targetWord={{ kelime: `${foundWordCount}/${totalWordCount}` }}
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

export default function WordSearchPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        }>
            <WordSearchPageContent />
        </Suspense>
    );
}
