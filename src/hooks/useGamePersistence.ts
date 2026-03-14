'use client';

import { useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { savedGameService } from '@/services/savedGameService';

export function useGamePersistence<T>(
    gameName: string,
    status: string,
    state: T,
    onRestore: (savedState: T) => void
) {
    /** LocalStorage'dan senkron olarak yükler */
    const getLocalState = useCallback((): T | null => {
        return storage.getGameState<T>(gameName);
    }, [gameName]);

    // LocalStorage'dan yükle (misafir + üye)
    useEffect(() => {
        const savedState = storage.getGameState<T>(gameName);
        if (savedState) {
            onRestore(savedState);
        }
    }, [gameName, onRestore]);

    // LocalStorage'a kaydet (playing durumunda)
    useEffect(() => {
        if (status === 'playing') {
            storage.setGameState(gameName, {
                ...state,
                lastUpdated: Date.now()
            });
        }
    }, [gameName, status, state]);

    /** LocalStorage'dan siler (oyun bitti / yeni oyun) */
    const clearLocal = useCallback(() => {
        storage.clearGameState(gameName);
    }, [gameName]);

    /** Supabase'e kaydeder (yalnızca giriş yapmış üyeler için, misafirde sessizce başarısız olur) */
    const saveToCloud = useCallback(async (data: T, elapsedTime: number): Promise<boolean> => {
        return await savedGameService.saveGame<T>(gameName, data, elapsedTime);
    }, [gameName]);

    /** Supabase'den yükler (yalnızca giriş yapmış üyeler için) */
    const loadFromCloud = useCallback(async (): Promise<{ state: T; elapsedTime: number } | null> => {
        const saved = await savedGameService.getSavedGame<T>(gameName);
        if (!saved) return null;
        return { state: saved.state, elapsedTime: saved.elapsed_time };
    }, [gameName]);

    /** Supabase'den siler */
    const deleteFromCloud = useCallback(async () => {
        await savedGameService.deleteSavedGame(gameName);
    }, [gameName]);

    return { saveToCloud, loadFromCloud, deleteFromCloud, clearLocal, getLocalState };
}
