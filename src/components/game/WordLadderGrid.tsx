'use client';

import React, { useRef, useEffect } from 'react';
import { WordLadderStep } from '@/hooks/useWordLadder';

/* ── Inline harf kutusu ── */
interface LetterBoxProps {
    letter?: string;
    isStart?: boolean;
    isTarget?: boolean;
    isChanged?: boolean;
    isInput?: boolean;   // aktif giriş satırı
    isEmpty?: boolean;   // boş (input) kutu
}

function LetterBox({ letter = '', isStart, isTarget, isChanged, isInput, isEmpty }: LetterBoxProps) {
    // Inline style kullan — Tailwind JIT dynamic class sorununu bypass eder
    let style: React.CSSProperties = {};
    let cls = 'w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-base sm:text-lg select-none shrink-0 transition-all duration-150 font-bold';

    if (isStart) {
        cls += ' border-2 border-solid text-primary font-black bg-primary/10 border-primary/50';
    } else if (isTarget) {
        cls += ' border-2 border-solid text-primary font-black bg-primary/15 border-primary';
    } else if (isChanged) {
        cls += ' border-2 border-solid text-primary font-black bg-primary/20 border-primary';
    } else if (isInput && !isEmpty) {
        cls += ' border-2 border-solid text-text-main font-black bg-surface border-primary/70';
    } else if (isInput && isEmpty) {
        cls += ' text-transparent';
        style = { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(59,130,246,0.55)', background: 'rgba(59,130,246,0.04)' };
    } else {
        // confirmed, not changed
        cls += ' border-2 border-solid text-text-main font-bold bg-surface/60 border-surface-active/30';
    }

    return (
        <div className={cls} style={style}>
            {letter || '\u00a0'}
        </div>
    );
}

/* ── Kelime satırı ── */
interface WordRowProps {
    word: string;
    wordLength: number;
    type: 'start' | 'target' | 'confirmed' | 'input';
    changedIndex?: number;
    currentInput?: string;
    stepLabel?: string;
}

function WordRow({ word, wordLength, type, changedIndex, currentInput = '', stepLabel }: WordRowProps) {
    const letters = type === 'input'
        ? Array.from({ length: wordLength }, (_, i) => currentInput[i] ?? '')
        : Array.from({ length: wordLength }, (_, i) => word[i] ?? '');

    return (
        <div className="flex items-center gap-2">
            {/* Sol boşluk (adım sayacı için yer tutucu) */}
            <div className="w-9 shrink-0" />

            <div className="flex gap-1.5">
                {letters.map((ch, i) => (
                    <LetterBox
                        key={i}
                        letter={ch}
                        isStart={type === 'start'}
                        isTarget={type === 'target'}
                        isChanged={type === 'confirmed' && i === changedIndex}
                        isInput={type === 'input'}
                        isEmpty={type === 'input' && !ch}
                    />
                ))}
            </div>

            {/* Sağ: adım sayacı */}
            <div className="w-9 shrink-0 flex items-start justify-start pl-1">
                {stepLabel && (
                    <span className="text-[10px] font-black text-text-muted/50 tabular-nums">
                        {stepLabel}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ── Ana bileşen: sadece SCROLL EDİLEBİLİR orta alan ── */
interface WordLadderGuessAreaProps {
    steps: WordLadderStep[];
    currentInput: string;
    wordLength: number;
    maxSteps: number;
    status: 'idle' | 'loading' | 'playing' | 'won' | 'lost';
    errorMessage: string | null;   // inline toast için
}

export function WordLadderGuessArea({
    steps,
    currentInput,
    wordLength,
    maxSteps,
    status,
    errorMessage,
}: WordLadderGuessAreaProps) {
    const isPlaying = status === 'playing';
    const activeRowRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Yeni adım eklenince aktif satırı görünür yap
    useEffect(() => {
        if (activeRowRef.current) {
            activeRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [steps.length, isPlaying]);

    return (
        <div
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto w-full flex flex-col items-center gap-1.5 py-1"
        >
            {/* Onaylanmış adımlar */}
            {steps.map((step, idx) => (
                <WordRow
                    key={idx}
                    word={step.word}
                    wordLength={wordLength}
                    type="confirmed"
                    changedIndex={step.changedIndex}
                    stepLabel={`${idx + 1}/${maxSteps}`}
                />
            ))}

            {/* Aktif giriş: inline hata toast'ı + giriş satırı */}
            {isPlaying && (
                <div ref={activeRowRef} className="flex flex-col items-center gap-1 w-full">
                    {/* Inline error toast — aktif satırın hemen üstünde */}
                    {errorMessage && (
                        <div className="px-3 py-1 rounded-lg text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 max-w-[220px] text-center animate-fade-in">
                            {errorMessage}
                        </div>
                    )}
                    <WordRow
                        word=""
                        wordLength={wordLength}
                        type="input"
                        currentInput={currentInput}
                    />
                </div>
            )}
        </div>
    );
}

/* ── Sabit kelime satırı (başlangıç / hedef) — dışarıdan kullanmak için ── */
export function FixedWordRow(props: WordRowProps) {
    return <WordRow {...props} />;
}
