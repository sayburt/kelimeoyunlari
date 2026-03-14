'use client';

import React, { useEffect, useRef, Suspense } from 'react';
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
import { useGameSettings } from '@/context/GameSettingsContext';
import { HangmanDrawing } from '@/components/game/HangmanDrawing';
import { HangmanKeyboard } from '@/components/game/HangmanKeyboard';
import { HangmanWordDisplay } from '@/components/game/HangmanWordDisplay';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGameModals } from '@/hooks/useGameModals';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';
import { ChallengeModal } from '@/components/game/ChallengeModal';
import { SaveConfirmationModal } from '@/components/game/SaveConfirmationModal';
import { useSearchParams, useRouter } from 'next/navigation';

const GAME_NAME = 'adam-asmaca';

function AdamAsmacaPageContent() {
    const searchParams = useSearchParams();
    const challengeId = searchParams.get('challengeId');
    const {
        showInfoModal, setShowInfoModal,
        showStatsModal, setShowStatsModal,
        showSettingsModal, setShowSettingsModal,
        showResultModal, setShowResultModal,
        isPaused: baseIsPaused,
    } = useGameModals();
    const [toastMessage, setToastMessage] = React.useState<string | null>(null);
    const [showChallengeModal, setShowChallengeModal] = React.useState(false);
    const [showSaveConfirmationModal, setShowSaveConfirmationModal] = React.useState(false);

    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { category, difficulty } = useGameSettings();

    const isPaused = baseIsPaused || showChallengeModal || showSaveConfirmationModal;

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
        isChallengeMode,
        startNewGame,
        handleGuess,
        useJoker,
        saveGameToCloud,
    } = useHangman({

        isPaused,
        challengeId
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
        if (isChallengeMode && router) {
            router.push('/games/adam-asmaca');
        } else {
            startNewGame();
        }
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
    
    const handleSaveGame = async () => {
        const success = await saveGameToCloud();
        if (success) {
            setToastMessage('Oyun kaydedildi!');
            setShowSaveConfirmationModal(true);
        } else {
            setToastMessage('Oyun kaydedilemedi!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    const handleSaveConfirm = () => {
        setShowSaveConfirmationModal(false);
        setTimeout(() => router.push('/'), 300);
    };

    const handleSaveCancel = () => {
        setShowSaveConfirmationModal(false);
        setToastMessage(null);
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
                    onSave={handleSaveGame}
                    onChallenge={() => setShowChallengeModal(true)}

                    isLoggedIn={isAuthenticated}
                    isChallengeMode={isChallengeMode}
                    gameStatus={status}
                    onJoker={useJoker}
                    jokerUsed={joker.used}
                    timerText={formatTime(elapsedTime)}
                />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    {error ? (
                        <div className="max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl text-red-500">⚠️</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-2">Eyvah! Bir sorun çıktı</h3>
                            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                                {error}
                            </p>
                            <button
                                onClick={() => startNewGame()}
                                className="w-full bg-primary text-bg font-black py-3 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                            >
                                YENİDEN DENE
                            </button>
                        </div>
                    ) : (
                        <LoadingSpinner />
                    )}
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
                    onSave={handleSaveGame}
                    onChallenge={() => setShowChallengeModal(true)}

                    isLoggedIn={isAuthenticated}
                    isChallengeMode={isChallengeMode}
                    gameStatus={status}
                    onJoker={useJoker}
                    jokerUsed={joker.used}
                    timerText={formatTime(elapsedTime)}
                />

                {isChallengeMode && (
                    <div className="mx-4 mt-1 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-center">
                        <p className="text-primary text-sm font-bold flex items-center justify-center gap-2">⚔️ Bir meydan okuma oynuyorsunuz!</p>
                    </div>
                )}

                <ErrorToast message={error || toastMessage || ''} />

                {/* Oyun İçeriği — Alt Hiza Klavyeye Dayalı (Scroll olmaması için esneyebilir) */}
                <div className="flex-1 min-h-0 flex flex-col sm:flex-row w-full max-w-2xl mx-auto px-1 sm:px-2 mt-2 sm:mt-4 mb-2 sm:mb-4 gap-2 sm:gap-4 items-stretch">
                    {/* Sol Sütun (Figür) */}
                    <div className="flex-1 min-h-0 w-full sm:w-1/2 flex justify-center items-end bg-surface-mid/50 rounded-xl sm:rounded-2xl border border-surface-hover/30 p-2 sm:p-4 shadow-sm">
                        <div className="w-full h-full max-w-[280px] max-h-full flex items-end justify-center">
                            <HangmanDrawing wrongGuesses={wrongGuesses} />
                        </div>
                    </div>

                    {/* Sağ Sütun (Gizli Kelime) */}
                    <div className="shrink-0 pt-3 pb-4 sm:py-6 w-full sm:w-1/2 flex flex-col justify-center gap-4 sm:gap-16 lg:gap-20 bg-surface-mid/50 rounded-xl sm:rounded-2xl border border-surface-hover/30 px-4 sm:px-6 shadow-sm">
                        {/* Kategori ve Zorluk Bilgileri */}
                        {!isChallengeMode && (
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                <span className="text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-2.5 sm:py-1 bg-surface-hover/50 text-text-secondary rounded-full border border-surface-hover/80 capitalize tracking-wide">
                                    {category === 'rastgele' ? 'Rastgele' : category}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-surface-hover/80"></span>
                                <span className="text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-2.5 sm:py-1 bg-surface-hover/50 text-text-secondary rounded-full border border-surface-hover/80 tracking-wide">
                                    {difficulty === 1 ? 'Kolay Seviye' : difficulty === 2 ? 'Orta Seviye' : 'Zor Seviye'}
                                </span>
                            </div>
                        )}

                        {/* Gizli Kelime (Ortalanmış) */}
                        <div className="flex justify-center items-center">
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
                isChallenge={isChallengeMode}
                onRestart={handleRestart}
                onShare={handleResultShare}
                score={score}
            />

            <ChallengeModal
                isOpen={showChallengeModal}
                onClose={() => setShowChallengeModal(false)}
                gameName={GAME_NAME}
                wordLength={0}
            />

            <SaveConfirmationModal
                isOpen={showSaveConfirmationModal}
                onConfirm={handleSaveConfirm}
                onCancel={handleSaveCancel}
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

export default function AdamAsmacaClient() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        }>
            <ChallengeAuthGate />
        </Suspense>
    );
}

function ChallengeAuthGate() {
    const searchParams = useSearchParams();
    const challengeId = searchParams.get('challengeId');
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if (challengeId && !isAuthenticated) {
        const redirectUrl = `/games/adam-asmaca?challengeId=${challengeId}`;
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg items-center justify-center px-6 text-center">
                <div className="max-w-sm w-full">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚔️</span>
                    </div>
                    <h2 className="text-2xl font-black text-text-main mb-3 tracking-tight">Meydan Okuma!</h2>
                    <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                        Bir arkadaşın sana meydan okudu! Oynayabilmek için giriş yapman veya üye olman gerekiyor.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)}
                            className="w-full bg-primary text-bg font-black py-3.5 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                        >
                            GİRİŞ YAP
                        </button>
                        <button
                            onClick={() => router.push(`/register?redirect=${encodeURIComponent(redirectUrl)}`)}
                            className="w-full bg-surface-hover text-text-main font-bold py-3.5 rounded-2xl hover:bg-surface-mid transition-colors border border-surface-hover"
                        >
                            ÜYE OL
                        </button>
                        <button onClick={() => router.push('/')} className="text-text-muted text-sm mt-2 hover:text-text-main transition-colors">Ana Sayfaya Dön</button>
                    </div>
                </div>
            </div>
        );
    }
    return <AdamAsmacaPageContent />;
}
