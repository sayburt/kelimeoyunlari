'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WordSearchGridProps {
    grid: string[];
    gridSize: number;
    selectedCells: number[];
    foundPaths: number[][];
    hintCells: number[];
    disabled?: boolean;
    onPreviewSelection: (startIndex: number, endIndex: number) => void;
    onHandleSelection: (startIndex: number, endIndex: number) => void;
    onClearPreview: () => void;
}

function includesCell(paths: number[][], index: number): boolean {
    return paths.some(path => path.includes(index));
}

export function WordSearchGrid({
    grid,
    gridSize,
    selectedCells,
    foundPaths,
    hintCells,
    disabled = false,
    onPreviewSelection,
    onHandleSelection,
    onClearPreview,
}: WordSearchGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragCurrent, setDragCurrent] = useState<number | null>(null);
    const [clickAnchor, setClickAnchor] = useState<number | null>(null);
    const didDragRef = useRef(false);

    const resetDrag = () => {
        setIsDragging(false);
        setDragStart(null);
        setDragCurrent(null);
        didDragRef.current = false;
    };

    useEffect(() => {
        const handleGlobalPointerUp = () => {
            if (!isDragging || dragStart === null || dragCurrent === null) {
                return;
            }

            onHandleSelection(dragStart, dragCurrent);
            resetDrag();
        };

        window.addEventListener('pointerup', handleGlobalPointerUp);
        return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
    }, [isDragging, dragStart, dragCurrent, onHandleSelection]);

    const handlePointerDown = (index: number) => {
        if (disabled) return;

        setClickAnchor(null);
        setIsDragging(true);
        setDragStart(index);
        setDragCurrent(index);
        didDragRef.current = false;
        onPreviewSelection(index, index);
    };

    const handlePointerEnter = (index: number) => {
        if (!isDragging || dragStart === null || disabled) return;

        if (index !== dragStart) {
            didDragRef.current = true;
        }

        setDragCurrent(index);
        onPreviewSelection(dragStart, index);
    };

    const handleCellClick = (index: number) => {
        if (disabled) return;

        // Sürükleme bittiğinde gelen click event'ini yoksay.
        if (didDragRef.current) {
            didDragRef.current = false;
            return;
        }

        if (clickAnchor === null) {
            setClickAnchor(index);
            onPreviewSelection(index, index);
            return;
        }

        if (clickAnchor === index) {
            setClickAnchor(null);
            onClearPreview();
            return;
        }

        onHandleSelection(clickAnchor, index);
        setClickAnchor(null);
    };

    const renderGrid = () => {
        return grid.map((letter, index) => {
            const isFound = includesCell(foundPaths, index);
            const isSelected = selectedCells.includes(index);
            const isHinted = hintCells.includes(index);
            const isAnchor = clickAnchor === index;

            let cellClass = 'bg-surface/90 border-surface-active/40 text-text-main';
            if (isFound) {
                cellClass = 'bg-correct/20 border-correct/60 text-text-main';
            }
            if (isHinted) {
                cellClass = 'bg-present/20 border-present text-text-main';
            }
            if (isSelected) {
                cellClass = 'bg-primary/25 border-primary text-text-main';
            }
            if (isAnchor) {
                cellClass = 'bg-primary/15 border-primary/70 text-text-main';
            }

            return (
                <button
                    key={index}
                    type="button"
                    disabled={disabled}
                    className={`
                        aspect-square rounded-lg sm:rounded-xl border-2
                        flex items-center justify-center
                        font-black text-sm sm:text-base md:text-lg
                        transition-all duration-150 select-none
                        ${cellClass}
                        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onPointerDown={(e) => {
                        e.preventDefault();
                        handlePointerDown(index);
                    }}
                    onPointerEnter={() => handlePointerEnter(index)}
                    onClick={() => handleCellClick(index)}
                >
                    {letter}
                </button>
            );
        });
    };

    return (
        <div className="w-full select-none touch-none">
            <div
                className="grid gap-1 sm:gap-1.5"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
                {renderGrid()}
            </div>
        </div>
    );
}
