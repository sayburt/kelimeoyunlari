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
        startNewGame,
        handleKeyPress,
        handleDelete,
        handleEnter,
    } = useGame(WORD_LENGTH, MAX_GUESSES);

    const [shakeRow, setShakeRow] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
                <GameHeader title="Wordle" backHref="/" />
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
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-bg">
            <GameHeader title="Wordle" backHref="/" />

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
                />
            </div>

            {/* Klavye */}
            <div className="px-2 pb-4 sm:pb-6">
                <GameKeyboard
                    onKeyPress={handleKeyPress}
                    onEnter={handleEnter}
                    onDelete={handleDelete}
                    keyStates={keyboardState}
                />
            </div>

            {/* Kazanma / Kaybetme Modal */}
            <GameEndModal
                isOpen={showModal}
                status={status}
                guessesCount={guesses.length}
                maxGuesses={maxGuesses}
                targetWord={targetWord}
                onRestart={handleRestart}
            />
        </div>
    );
}
