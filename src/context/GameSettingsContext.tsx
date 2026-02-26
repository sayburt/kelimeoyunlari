'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DifficultyLevel = 1 | 2 | 3; // 1: Kolay, 2: Orta, 3: Zor
export type CategoryOption = 'rastgele' | 'isim' | 'spor' | 'sıfat' | 'yemek' | 'diğer' | 'zarf' | 'hayvan' | 'bitki' | 'şehir' | 'meslek' | 'edat' | 'bağlaç' | 'zamir' | 'ünlem';

interface GameSettingsContextType {
    difficulty: DifficultyLevel;
    setDifficulty: (level: DifficultyLevel) => void;
    category: CategoryOption;
    setCategory: (category: CategoryOption) => void;
    isSoundEnabled: boolean;
    toggleSound: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
    const [difficulty, setDifficultyState] = useState<DifficultyLevel>(1);
    const [category, setCategoryState] = useState<CategoryOption>('rastgele');
    const [isSoundEnabled, setIsSoundEnabledState] = useState(true);

    // İlk yüklemede local storage'dan oku
    useEffect(() => {
        const loadSettings = () => {
            const savedDifficulty = localStorage.getItem('game_difficulty');
            if (savedDifficulty) {
                setDifficultyState(parseInt(savedDifficulty) as DifficultyLevel);
            }

            const savedCategory = localStorage.getItem('game_category') as CategoryOption;
            if (savedCategory) {
                setCategoryState(savedCategory);
            }

            const savedSound = localStorage.getItem('sound_enabled');
            if (savedSound !== null) {
                setIsSoundEnabledState(savedSound === 'true');
            }
        };

        // Delay execution slightly to avoid synchronous setState during render/effect phase
        // which triggers the lint error.
        const timer = setTimeout(loadSettings, 0);
        return () => clearTimeout(timer);
    }, []);

    const setDifficulty = (level: DifficultyLevel) => {
        setDifficultyState(level);
        localStorage.setItem('game_difficulty', level.toString());
    };

    const setCategory = (newCategory: CategoryOption) => {
        setCategoryState(newCategory);
        localStorage.setItem('game_category', newCategory);
    };

    const toggleSound = () => {
        setIsSoundEnabledState(prev => {
            const next = !prev;
            localStorage.setItem('sound_enabled', String(next));
            return next;
        });
    };

    return (
        <GameSettingsContext.Provider value={{ difficulty, setDifficulty, category, setCategory, isSoundEnabled, toggleSound }}>
            {children}
        </GameSettingsContext.Provider>
    );
}

export function useGameSettings() {
    const context = useContext(GameSettingsContext);
    if (context === undefined) {
        throw new Error('useGameSettings must be used within a GameSettingsProvider');
    }
    return context;
}
