"use client";

export interface GuestStat {
    game_name: string;
    played: number;
    won: number;
    best_score: number; // Wordle için: en az deneme sayısı
    high_score: number; // Hesaplanan en yüksek puan
    current_streak: number;
    max_streak: number;
}

const STORAGE_KEYS = {
    GUEST_STATS: "kelime_guest_stats",
    SESSION_ID: "kelime_session_id",
    SETTINGS: "kelime_settings",
    GAME_STATE: "kelime_game_state",
    GUEST_LIKES: "kelime_guest_likes",
};

export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === "undefined") return defaultValue;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove: (key: string): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },

    // Yardımcı metodlar
    getGuestStats: () => {
        const stats = storage.get<GuestStat[]>(STORAGE_KEYS.GUEST_STATS, []);
        let migrated = false;

        const updatedStats = stats.map(stat => {
            if (stat.game_name === 'hangman') {
                migrated = true;
                return { ...stat, game_name: 'adam-asmaca' };
            }
            return stat;
        });

        if (migrated) {
            const gamesMap = new Map<string, GuestStat>();
            for (const stat of updatedStats) {
                if (gamesMap.has(stat.game_name)) {
                    const existing = gamesMap.get(stat.game_name)!;
                    existing.played += stat.played;
                    existing.won += stat.won;
                    existing.best_score = existing.best_score === 0 ? stat.best_score : (stat.best_score === 0 ? existing.best_score : Math.min(existing.best_score, stat.best_score));
                    existing.high_score = Math.max(existing.high_score, stat.high_score);
                    existing.current_streak = Math.max(existing.current_streak, stat.current_streak);
                    existing.max_streak = Math.max(existing.max_streak, stat.max_streak);
                } else {
                    gamesMap.set(stat.game_name, { ...stat });
                }
            }

            const finalStats = Array.from(gamesMap.values());
            storage.set(STORAGE_KEYS.GUEST_STATS, finalStats);
            return finalStats;
        }

        return stats;
    },
    setGuestStats: (stats: GuestStat[]) => storage.set(STORAGE_KEYS.GUEST_STATS, stats),

    getSessionId: () => {
        let id = storage.get<string | null>(STORAGE_KEYS.SESSION_ID, null);
        if (!id && typeof window !== "undefined") {
            id = crypto.randomUUID();
            storage.set(STORAGE_KEYS.SESSION_ID, id);
        }
        return id;
    },

    getSettings: () => storage.get<Record<string, unknown>>(STORAGE_KEYS.SETTINGS, { sound: true }),
    setSettings: (settings: Record<string, unknown>) => storage.set(STORAGE_KEYS.SETTINGS, settings),

    getGuestLikes: (): string[] => {
        const likes = storage.get<string[]>(STORAGE_KEYS.GUEST_LIKES, []);
        if (!Array.isArray(likes) || likes.length === 0) {
            return [];
        }

        let migrated = false;
        const normalized = likes.map((id) => {
            if (id === 'hangman') {
                migrated = true;
                return 'adam-asmaca';
            }
            return id;
        });

        const deduped = Array.from(new Set(normalized));
        if (migrated || deduped.length !== likes.length) {
            storage.set(STORAGE_KEYS.GUEST_LIKES, deduped);
        }

        return deduped;
    },

    toggleGuestLike: (gameId: string): boolean => {
        const likes = storage.getGuestLikes();
        const index = likes.indexOf(gameId);
        let isLiked = false;

        if (index > -1) {
            likes.splice(index, 1);
        } else {
            likes.push(gameId);
            isLiked = true;
        }

        storage.set(STORAGE_KEYS.GUEST_LIKES, likes);
        return isLiked;
    },

    clearGuestData: () => {
        storage.remove(STORAGE_KEYS.GUEST_STATS);
        storage.remove(STORAGE_KEYS.SESSION_ID);
        storage.remove(STORAGE_KEYS.GUEST_LIKES);
    },

    getGameState: <T>(gameName: string): T | null => {
        const states = storage.get<Record<string, unknown>>(STORAGE_KEYS.GAME_STATE, {});
        return (states[gameName] as T) || null;
    },

    setGameState: <T>(gameName: string, state: T): void => {
        const states = storage.get<Record<string, unknown>>(STORAGE_KEYS.GAME_STATE, {});
        states[gameName] = state;
        storage.set(STORAGE_KEYS.GAME_STATE, states);
    },

    clearGameState: (gameName: string): void => {
        const states = storage.get<Record<string, unknown>>(STORAGE_KEYS.GAME_STATE, {});
        delete states[gameName];
        storage.set(STORAGE_KEYS.GAME_STATE, states);
    }
};
