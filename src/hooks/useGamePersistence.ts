'use client';

import { useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { savedGameService, SavedGameState } from '@/services/savedGameService';

export function useGamePersistence<T>(
    gameName: string,
    status: string,
    state: T,
    onRestore: (savedState: T) => void
) {
    // LocalStorage'dan yükle
    useEffect(() => {
        const savedState = storage.getGameState<T>(gameName);
        if (savedState) {
            onRestore(savedState);
        }
    }, [gameName, onRestore]);

    // LocalStorage'a kaydet
    useEffect(() => {
        if (status === 'playing') {
            storage.setGameState(gameName, {
                ...state,
                lastUpdated: Date.now()
            });
        }
    }, [gameName, status, state]);

    const saveToCloud = useCallback(async (data: SavedGameState, elapsedTime: number) => {
        return await savedGameService.saveGame(gameName, data, elapsedTime);
    }, [gameName]);

    const deleteFromCloud = useCallback(async () => {
        await savedGameService.deleteSavedGame(gameName);
    }, [gameName]);

    const clearLocal = useCallback(() => {
        storage.clearGameState(gameName);
    }, [gameName]);

    return { saveToCloud, deleteFromCloud, clearLocal };
}
