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
    getGuestStats: () => storage.get<GuestStat[]>(STORAGE_KEYS.GUEST_STATS, []),
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

    clearGuestData: () => {
        storage.remove(STORAGE_KEYS.GUEST_STATS);
        storage.remove(STORAGE_KEYS.SESSION_ID);
    }
};
