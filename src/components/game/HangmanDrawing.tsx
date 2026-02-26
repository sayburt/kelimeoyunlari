import React from 'react';
import { motion } from 'framer-motion';

interface HangmanDrawingProps {
    wrongGuesses: number;
}

const DRAWING_PARTS = [
    // 1. Kafa
    <motion.circle
        key="head"
        cx="150"
        cy="90"
        r="20"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
    // 2. Gövde
    <motion.line
        key="body"
        x1="150"
        y1="110"
        x2="150"
        y2="170"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
    // 3. Sol Kol
    <motion.line
        key="left-arm"
        x1="150"
        y1="130"
        x2="120"
        y2="160"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
    // 4. Sağ Kol
    <motion.line
        key="right-arm"
        x1="150"
        y1="130"
        x2="180"
        y2="160"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
    // 5. Sol Bacak
    <motion.line
        key="left-leg"
        x1="150"
        y1="170"
        x2="120"
        y2="220"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
    // 6. Sağ Bacak
    <motion.line
        key="right-leg"
        x1="150"
        y1="170"
        x2="180"
        y2="220"
        stroke="currentColor"
        strokeWidth="4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.5 }}
    />,
];

export function HangmanDrawing({ wrongGuesses }: HangmanDrawingProps) {
    return (
        <div className="relative w-full h-full mx-auto text-foreground flex items-end">
            <svg
                viewBox="0 0 250 300"
                className="w-full h-full stroke-current fill-transparent"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            >
                {/* Taban / Sehpa Çizimi (Burası Hep Görünür) */}
                <g strokeWidth="6" className="text-foreground">
                    {/* Alt Taban */}
                    <line x1="10" y1="290" x2="110" y2="290" />
                    {/* Direk */}
                    <line x1="60" y1="290" x2="60" y2="20" />
                    {/* Üst Direk */}
                    <line x1="57" y1="20" x2="150" y2="20" />
                    {/* İp */}
                    <line x1="150" y1="20" x2="150" y2="70" strokeWidth="4" />
                    {/* Çapraz Destek */}
                    <line x1="60" y1="70" x2="110" y2="20" strokeWidth="4" />
                </g>

                {/* Adam Parçaları - Hata sayısına göre çizilir */}
                {DRAWING_PARTS.slice(0, wrongGuesses)}
            </svg>
        </div>
    );
}
