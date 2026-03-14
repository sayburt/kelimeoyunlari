'use client';

import React, { useEffect, useCallback, useState, useRef, Suspense } from 'react';
import { useGame } from '@/hooks/useGame';
import { GameHeader } from '@/components/game/GameHeader';
import { GameKeyboard } from '@/components/game/GameKeyboard';
import { WordleBoard } from '@/components/game/WordleBoard';
import { GameEndModal } from '@/components/game/GameEndModal';
import { ErrorToast } from '@/components/game/ErrorToast';
import { GAMES } from '@/data/games';
import { GameInstructions } from '@/components/game/GameInstructions';
import { SettingsModal } from '@/components/game/SettingsModal';
import { ResumeGameModal } from '@/components/game/ResumeGameModal';
import { ChallengeModal } from '@/components/game/ChallengeModal';
import { InfoModal } from '@/components/game/InfoModal';
import { StatsModal } from '@/components/game/StatsModal';
import { SaveConfirmationModal } from '@/components/game/SaveConfirmationModal';
import { useGameSettings } from '@/context/GameSettingsContext';
import { useAuth } from '@/hooks/useAuth';
import { savedGameService, WordleSavedGameState } from '@/services/savedGameService';
import { challengeService } from '@/services/challengeService';
import { formatTime } from '@/utils/timeUtils';
import { shareContent } from '@/utils/shareUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGameModals } from '@/hooks/useGameModals';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const GAME_NAME = 'wordle';

const TURKISH_LETTERS = new Set(
    'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz'.split('')
);

function WordlePageContent() {
    const searchParams = useSearchParams();
    const challengeId = searchParams.get('challengeId');
    const {
        showInfoModal, setShowInfoModal,
        showStatsModal, setShowStatsModal,
        showSettingsModal, setShowSettingsModal,
        showResultModal, setShowResultModal,
        isPaused: baseIsPaused,
    } = useGameModals();
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [savedElapsedTime, setSavedElapsedTime] = useState(0);
    const [savedGuessesCount, setSavedGuessesCount] = useState(0);

    const cloudCheckDoneRef = useRef(false);
    const savedCloudStateRef = useRef<{ state: WordleSavedGameState; elapsedTime: number } | null>(null);

    const isPaused = baseIsPaused || showResumeModal || showChallengeModal || showSaveConfirmationModal;

    const { isAuthenticated } = useAuth();
    const router = useRouter();

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
        isChallengeMode,
        activeChallengeId,
        isCustomWord,
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
        useJoker,
        saveGameToCloud,
        loadGameFromCloud,
        deleteCloudSave,
        clearLocal,
    } = useGame({
        initialWordLength: WORD_LENGTH,
        initialMaxGuesses: MAX_GUESSES,
        isPaused,
        challengeId,
    });

    const [shakeRow, setShakeRow] = useState(false);
    const { difficulty } = useGameSettings();

    // Yerel kayıt kontrolü (Sadece mount olduğunda bir kez çalışır)
    useEffect(() => {
        const checkLocalSave = () => {
            if (status === 'playing' && !cloudCheckDoneRef.current && guesses.length > 0) {
                // useGame yerel kaydı zaten yükledi ve status playing oldu
                setSavedElapsedTime(elapsedTime);
                setSavedGuessesCount(guesses.length);
                setShowResumeModal(true);
            }
        };
        checkLocalSave();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (cloudCheckDoneRef.current || !isAuthenticated) {
            // Sadece status idle ise ve yerel kayıt yoksa yeni oyun başlat
            if (status === 'idle') {
                startNewGame(WORD_LENGTH, MAX_GUESSES);
            }
        }
    }, [startNewGame, difficulty, isAuthenticated, status]);

    useEffect(() => {
        if (!isAuthenticated || cloudCheckDoneRef.current) return;

        const checkCloudSave = async () => {
            try {
                const savedGame = await savedGameService.getSavedGame<WordleSavedGameState>(GAME_NAME);
                if (savedGame) {
                    // Yerel kayıt zaten yüklendiyse (status playing), cloud save'i sormaya gerek olmayabilir.
                    // Ya da ikisini karşılaştırabiliriz (lastUpdated ile hangisi yeniyse).
                    // Basitlik için: status halen idle ise cloud sormaya devam et.
                    if (status === 'idle' && savedGame.state.guesses.length > 0) {
                        setSavedElapsedTime(savedGame.elapsed_time);
                        setSavedGuessesCount(savedGame.state.guesses.length);
                        savedCloudStateRef.current = {
                            state: savedGame.state,
                            elapsedTime: savedGame.elapsed_time,
                        };
                        setShowResumeModal(true);
                    }
                } else if (status === 'idle') {
                    startNewGame(WORD_LENGTH, MAX_GUESSES);
                }
            } catch {
                if (status === 'idle') {
                    startNewGame(WORD_LENGTH, MAX_GUESSES);
                }
            }
            cloudCheckDoneRef.current = true;
        };

        checkCloudSave();
    }, [isAuthenticated, startNewGame, status]);

    useEffect(() => {
        if (status === 'won' || status === 'lost') {
            const timer = setTimeout(() => setShowResultModal(true), 1200);
            if (isAuthenticated) {
                deleteCloudSave().catch(console.error);
            }
            if (isChallengeMode && activeChallengeId) {
                challengeService.updateChallengeResult(activeChallengeId, score, guesses.length).catch(console.error);
            }
            return () => clearTimeout(timer);
        }
    }, [status, isAuthenticated, deleteCloudSave, isChallengeMode, activeChallengeId, score, guesses.length, setShowResultModal]);

    useEffect(() => {
        if (error) {
            // Error durumunda shakeRow'u asenkron tetikleyerek cascading render uyarısını gideriyoruz
            const shakeTimer = setTimeout(() => setShakeRow(true), 0);
            const resetTimer = setTimeout(() => setShakeRow(false), 500);
            return () => {
                clearTimeout(shakeTimer);
                clearTimeout(resetTimer);
            };
        }
    }, [error]);

    const handlePhysicalKeyboard = useCallback((e: KeyboardEvent) => {
        if (status !== 'playing' || isPaused) return;
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
    }, [status, handleEnter, handleDelete, handleKeyPress, isPaused]);

    useEffect(() => {
        window.addEventListener('keydown', handlePhysicalKeyboard);
        return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
    }, [handlePhysicalKeyboard]);

    const handleRestart = () => {
        setShowResultModal(false);
        if (isChallengeMode) {
            router.push('/games/wordle');
        } else {
            startNewGame(WORD_LENGTH, MAX_GUESSES);
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

    const handleResumeGame = () => {
        setShowResumeModal(false);
        if (savedCloudStateRef.current) {
            const { state, elapsedTime: savedElapsed } = savedCloudStateRef.current;
            loadGameFromCloud(state as import('@/services/savedGameService').WordleSavedGameState, savedElapsed);
            savedCloudStateRef.current = null;
        }
    };

    const handleNewGameFromModal = async () => {
        setShowResumeModal(false);
        savedCloudStateRef.current = null;
        if (isAuthenticated) {
            await deleteCloudSave();
        }
        clearLocal();
        startNewGame(WORD_LENGTH, MAX_GUESSES);
    };

    const handleShare = async () => {
        const result = await shareContent({
            title: 'Kelime Oyunları - Wordle',
            text: 'Kelime Oyunları\'nda Wordle oyna!',
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
            : `Wordle'da şansım bu sefer yaver gitmedi. 🧩`;
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

    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="WORDLE"
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
                    title="WORDLE"
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

                <div className="px-1 sm:px-2 pb-4 sm:pb-6 shrink-0">
                    <GameKeyboard
                        onKeyPress={handleKeyPress}
                        onEnter={handleEnter}
                        onDelete={handleDelete}
                        keyStates={keyboardState}
                    />
                </div>
            </div>

            <section className="w-full max-w-2xl mx-auto px-6 py-12 md:py-16 border-t border-surface/50">
                <GameInstructions
                    instructions={GAMES.find(g => g.id === 'wordle')!.instructions}
                    title="Wordle"
                    gameId="wordle"
                />
            </section>

            <GameEndModal
                isOpen={showResultModal}
                status={status}
                guessesCount={guesses.length}
                maxGuesses={maxGuesses}
                targetWord={targetWord}
                isCustomWord={isCustomWord}
                isChallenge={isChallengeMode}
                onRestart={handleRestart}
                onShare={handleResultShare}
                score={score}
            />

            <ResumeGameModal
                isOpen={showResumeModal}
                elapsedTime={savedElapsedTime}
                guessesCount={savedGuessesCount}
                onResume={handleResumeGame}
                onNewGame={handleNewGameFromModal}
            />

            {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
            {showStatsModal && <StatsModal gameName={GAME_NAME} onClose={() => setShowStatsModal(false)} />}

            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
            />

            <ChallengeModal
                isOpen={showChallengeModal}
                onClose={() => setShowChallengeModal(false)}
                gameName={GAME_NAME}
                wordLength={WORD_LENGTH}
            />

            <SaveConfirmationModal
                isOpen={showSaveConfirmationModal}
                onConfirm={handleSaveConfirm}
                onCancel={handleSaveCancel}
            />
        </div>
    );
}

function ChallengeAuthGate() {
    const searchParams = useSearchParams();
    const challengeId = searchParams.get('challengeId');
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if (challengeId && !isAuthenticated) {
        const redirectUrl = `/games/wordle?challengeId=${challengeId}`;
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
    return <WordlePageContent />;
}

export default function WordleClient() {
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
