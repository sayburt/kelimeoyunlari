'use client';

import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useWordLadder, GAME_NAME } from '@/hooks/useWordLadder';
import { GameHeader } from '@/components/game/GameHeader';
import { GameKeyboard } from '@/components/game/GameKeyboard';
import { GameEndModal } from '@/components/game/GameEndModal';
import { InfoModal } from '@/components/game/InfoModal';
import { StatsModal } from '@/components/game/StatsModal';
import { GameInstructions } from '@/components/game/GameInstructions';
import { WordLadderGuessArea, FixedWordRow } from '@/components/game/WordLadderGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GAMES } from '@/data/games';
import { useAuth } from '@/hooks/useAuth';
import { useGameModals } from '@/hooks/useGameModals';
import { shareContent } from '@/utils/shareUtils';
import { formatTime } from '@/utils/timeUtils';
import { ChevronDown } from 'lucide-react';

const TURKISH_LETTERS = new Set(
    'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz'.split('')
);

function WordLadderPageContent() {
    const {
        showInfoModal, setShowInfoModal,
        showStatsModal, setShowStatsModal,
        showResultModal, setShowResultModal,
        isPaused,
    } = useGameModals();

    const { isAuthenticated } = useAuth();

    const {
        status,
        startWord,
        targetWord,
        maxSteps,
        steps,
        currentInput,
        error,
        score,
        elapsedTime,
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
    } = useWordLadder({ isPaused });

    // Inline error toast: 2 saniye sonra otomatik kaybolur
    const [inlineError, setInlineError] = useState<string | null>(null);
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (error) {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
            // setState'i mikro-görev olarak zamanla → senkron effect setState lint hatasını önler
            Promise.resolve().then(() => {
                setInlineError(error);
                errorTimerRef.current = setTimeout(() => setInlineError(null), 2000);
            });
        }
    }, [error]);

    useEffect(() => () => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    }, []);

    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!hasStartedRef.current && status === 'idle') {
            hasStartedRef.current = true;
            startNewGame();
        }
    }, [startNewGame, status]);

    useEffect(() => {
        if (status === 'won' || status === 'lost') {
            const timer = setTimeout(() => setShowResultModal(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [status, setShowResultModal]);

    const handleRestart = () => {
        setShowResultModal(false);
        hasStartedRef.current = false;
        startNewGame();
    };

    const handleShare = async () => {
        await shareContent({
            title: 'Kelime Oyunları - Kelime Merdiveni',
            text: 'Kelime Merdiveni\'nde başlangıçtan hedefe tek harf değiştirerek ulaş!',
            url: window.location.href,
        });
    };

    const handleResultShare = async () => {
        const resultText = status === 'won'
            ? `Kelime Merdiveni'nde ${startWord} → ${targetWord} yolunu ${steps.length} adımda tamamladım! 🏆`
            : `Kelime Merdiveni'nde ${startWord} → ${targetWord} yolunu bulamadım. 🧩`;
        await shareContent({ title: 'Kelime Merdiveni Sonucum', text: resultText, url: window.location.href });
    };

    // Fiziksel klavye
    const handlePhysicalKeyboard = useCallback((e: KeyboardEvent) => {
        if (status !== 'playing' || isPaused) return;
        if (e.key === 'Enter') { e.preventDefault(); handleEnter(); }
        else if (e.key === 'Backspace') { e.preventDefault(); handleDelete(); }
        else if (e.key.length === 1 && TURKISH_LETTERS.has(e.key)) { e.preventDefault(); handleKeyPress(e.key); }
    }, [status, isPaused, handleEnter, handleDelete, handleKeyPress]);

    useEffect(() => {
        window.addEventListener('keydown', handlePhysicalKeyboard);
        return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
    }, [handlePhysicalKeyboard]);

    const wordLength = startWord?.length || 4;
    const gameData = GAMES.find(g => g.id === 'kelime-merdiveni')!;

    // YÜKLENİYOR hali
    if (status === 'loading' || status === 'idle') {
        return (
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <GameHeader
                    title="KELİME MERDİVENİ"
                    onHelp={() => setShowInfoModal(true)}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status}
                />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <>
            {/*
             * ┌─────────────────────────────┐
             * │  HEADER (sabit üst)         │
             * │  BAŞLANGIÇ label            │
             * │  BAŞLANGIÇ kutuları         │
             * │  ─────── SCROLL ALANI ────  │
             * │  tahminler + aktif satır    │
             * │  ─────────────────────────  │
             * │  ↓ (tek ok sabit)           │
             * │  HEDEF kutuları             │
             * │  HEDEF label                │
             * │  KLAVYE (sabit alt)         │
             * └─────────────────────────────┘
             *
             * h-[100dvh] overflow-hidden → sayfa DİKEY SCROLL YAPMAZ
             */}
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg text-text-main">

                {/* ── 1. HEADER ── */}
                <GameHeader
                    title="KELİME MERDİVENİ"
                    onHelp={() => setShowInfoModal(true)}
                    onStats={() => setShowStatsModal(true)}
                    onShare={handleShare}
                    isLoggedIn={isAuthenticated}
                    gameStatus={status}
                    timerText={formatTime(elapsedTime)}
                />

                {/* ── 2. ORTA İÇERİK (SABIT çerçeve + KAYAN orta) ── */}
                <div className="flex flex-col flex-1 min-h-0 items-center px-4 pt-3 pb-1 gap-y-1.5">

                    {/* BAŞLANGIÇ etiketi */}
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/90 leading-none">
                        Başlangıç
                    </span>

                    {/* BAŞLANGIÇ kutuları (sabit) */}
                    <FixedWordRow
                        word={startWord}
                        wordLength={wordLength}
                        type="start"
                    />

                    {/* ── SCROLL ALANI: tahminler + aktif satır ── */}
                    <WordLadderGuessArea
                        steps={steps}
                        currentInput={currentInput}
                        wordLength={wordLength}
                        maxSteps={maxSteps}
                        status={status}
                        errorMessage={inlineError}
                    />

                    {/* Tek ↓ ok (sabit) */}
                    <ChevronDown
                        className="w-4 h-4 shrink-0 text-primary/40"
                        strokeWidth={2.5}
                    />

                    {/* HEDEF kutuları (sabit) */}
                    <FixedWordRow
                        word={targetWord}
                        wordLength={wordLength}
                        type="target"
                    />

                    {/* HEDEF etiketi */}
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400/90 leading-none">
                        Hedef
                    </span>

                </div>

                {/* ── 3. KLAVYE (sabit alt) ── */}
                <div className="shrink-0 px-1 pb-3">
                    <GameKeyboard
                        onKeyPress={handleKeyPress}
                        onEnter={handleEnter}
                        onDelete={handleDelete}
                        keyStates={{}}
                    />
                </div>
            </div>

            {/* ── SEO bölümü: 100dvh dışına çıkıyor — scroll yalnızca buraya gidince olur ── */}
            <section className="w-full max-w-2xl mx-auto px-6 py-12 border-t border-surface/50">
                <GameInstructions
                    instructions={gameData.instructions}
                    title="Kelime Merdiveni"
                    gameId="kelime-merdiveni"
                />
            </section>

            {/* Modaller */}
            <GameEndModal
                isOpen={showResultModal}
                status={status === 'won' ? 'won' : 'lost'}
                guessesCount={steps.length}
                maxGuesses={maxSteps}
                targetWord={null}
                isChallenge={false}
                onRestart={handleRestart}
                onShare={handleResultShare}
                score={score}
            />

            {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
            {showStatsModal && <StatsModal gameName={GAME_NAME} onClose={() => setShowStatsModal(false)} />}
        </>
    );
}

export default function WordLadderPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        }>
            <WordLadderPageContent />
        </Suspense>
    );
}
