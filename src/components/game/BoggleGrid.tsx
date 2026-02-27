'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BoggleGridProps {
    grid: string[];
    gridSize: number;
    selectedPath: number[];
    lastWordResult: 'valid' | 'invalid' | null;
    onSelectCell: (index: number) => void;
    onSubmitWord: () => void;
    onClearSelection: () => void;
    disabled?: boolean;
}

export function BoggleGrid({
    grid,
    gridSize,
    selectedPath,
    lastWordResult,
    onSelectCell,
    onSubmitWord,
    onClearSelection,
    disabled = false,
}: BoggleGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [trailPath, setTrailPath] = useState<string>('');
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Hücre merkezine olan mesafeyi hesapla
    const getDistanceToCenter = useCallback((cellIndex: number, clientX: number, clientY: number): number => {
        const cell = cellRefs.current[cellIndex];
        if (!cell) return Infinity;
        const rect = cell.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.sqrt((clientX - centerX) ** 2 + (clientY - centerY) ** 2);
    }, []);

    // Bitişik hücreleri hesapla (8 yön)
    const getNeighborIndices = useCallback((index: number): number[] => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const neighbors: number[] = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
                    neighbors.push(nr * gridSize + nc);
                }
            }
        }
        return neighbors;
    }, [gridSize]);

    // Pointer aşağı (sürükleme başlat)
    const handlePointerDown = useCallback((index: number) => {
        if (disabled) return;
        setIsDragging(true);
        onClearSelection();
        onSelectCell(index);
    }, [disabled, onSelectCell, onClearSelection]);

    // Pointer hareket — komşu hücreler arasından en yakın merkeze sahip olanı seç
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || disabled) return;

        const lastIndex = selectedPath[selectedPath.length - 1];
        if (lastIndex === undefined) return;

        // Son seçili hücrenin komşuları (henüz path'te olmayanlar)
        const neighbors = getNeighborIndices(lastIndex)
            .filter(n => !selectedPath.includes(n));

        // Geri alma desteği: bir önceki hücreyi de aday olarak ekle
        const prevIndex = selectedPath.length >= 2 ? selectedPath[selectedPath.length - 2] : null;

        // En yakın komşu hücreyi bul
        let bestIndex: number | null = null;
        let bestDist = Infinity;

        // Önce komşulara bak
        for (const n of neighbors) {
            const dist = getDistanceToCenter(n, e.clientX, e.clientY);
            const cell = cellRefs.current[n];
            if (!cell) continue;
            const rect = cell.getBoundingClientRect();
            // Hücre boyutunun %70'i kadar yarıçap — merkeze yakın olmalı
            const threshold = Math.max(rect.width, rect.height) * 0.7;
            if (dist < threshold && dist < bestDist) {
                bestDist = dist;
                bestIndex = n;
            }
        }

        // Geri alma kontrolü (bir önceki hücreye döndüyse)
        if (prevIndex !== null) {
            const prevDist = getDistanceToCenter(prevIndex, e.clientX, e.clientY);
            const prevCell = cellRefs.current[prevIndex];
            if (prevCell) {
                const prevRect = prevCell.getBoundingClientRect();
                const prevThreshold = Math.max(prevRect.width, prevRect.height) * 0.5;
                if (prevDist < prevThreshold && prevDist < bestDist) {
                    // Bir önceki hücreye geri dön
                    onSelectCell(prevIndex);
                    return;
                }
            }
        }

        if (bestIndex !== null) {
            onSelectCell(bestIndex);
        }
    }, [isDragging, disabled, selectedPath, getNeighborIndices, getDistanceToCenter, onSelectCell]);

    // Pointer yukarı (kelime gönder)
    const handlePointerUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        if (selectedPath.length >= 3) {
            onSubmitWord();
        } else {
            onClearSelection();
        }
    }, [isDragging, selectedPath.length, onSubmitWord, onClearSelection]);

    // Global pointer up yakala
    useEffect(() => {
        const handleGlobalPointerUp = () => {
            if (isDragging) {
                setIsDragging(false);
                if (selectedPath.length >= 3) {
                    onSubmitWord();
                } else {
                    onClearSelection();
                }
            }
        };

        window.addEventListener('pointerup', handleGlobalPointerUp);
        return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
    }, [isDragging, selectedPath.length, onSubmitWord, onClearSelection]);

    // Seçili hücreler arası çizgi — useEffect ile hesapla (render sırasında ref erişimini önler)
    useEffect(() => {
        if (selectedPath.length < 2) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTrailPath('');
            return;
        }

        const gridEl = gridRef.current;
        if (!gridEl) return;

        const gridRect = gridEl.getBoundingClientRect();
        const points: { x: number; y: number }[] = [];

        for (const idx of selectedPath) {
            const cell = cellRefs.current[idx];
            if (!cell) { setTrailPath(''); return; }
            const cellRect = cell.getBoundingClientRect();
            points.push({
                x: cellRect.left + cellRect.width / 2 - gridRect.left,
                y: cellRect.top + cellRect.height / 2 - gridRect.top,
            });
        }

        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        setTrailPath(d);
    }, [selectedPath]);

    // Hücre flash rengi
    const getCellBg = (index: number) => {
        if (lastWordResult === 'valid' && selectedPath.length === 0) {
            return 'bg-correct/20 border-correct';
        }
        if (lastWordResult === 'invalid' && selectedPath.length === 0) {
            return 'bg-error/20 border-error';
        }
        if (selectedPath.includes(index)) {
            const order = selectedPath.indexOf(index);
            if (order === 0) return 'bg-primary/30 border-primary scale-105';
            return 'bg-primary/20 border-primary/60';
        }
        return 'bg-surface border-surface-active hover:border-primary/40';
    };

    return (
        <div className="relative select-none touch-none" ref={gridRef}>
            {trailPath && (
                <svg
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ width: '100%', height: '100%' }}
                >
                    <path
                        d={trailPath}
                        stroke="var(--color-primary)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={0.6}
                    />
                </svg>
            )}
            <div
                className="grid gap-1.5 sm:gap-2"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {grid.map((letter, index) => (
                    <motion.div
                        key={index}
                        ref={el => { cellRefs.current[index] = el; }}
                        className={`
                            aspect-square flex items-center justify-center
                            rounded-xl sm:rounded-2xl border-2 cursor-pointer
                            font-black text-xl sm:text-2xl md:text-3xl
                            text-text-main transition-all duration-150
                            ${getCellBg(index)}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            handlePointerDown(index);
                        }}
                        whileTap={disabled ? {} : { scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                    >
                        {letter}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
