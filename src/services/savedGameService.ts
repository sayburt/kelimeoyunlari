"use client";

import { supabase } from "@/lib/supabase";

export interface SavedGameState {
    guesses: { guess: string; states: string[] }[];
    keyboardState: Record<string, string>;
    joker: { used: boolean; count: number; max: number };
    targetWord: {
        kelime: string;
        kategoriler: string[];
        zorluk_seviyesi: number;
        harf_sayisi: number;
        anlam: string;
    };
    difficulty: number;
    wordLength: number;
    maxGuesses: number;
}

export interface SavedGame {
    id: string;
    user_id: string;
    game_name: string;
    state: SavedGameState;
    elapsed_time: number;
    created_at: string;
    updated_at: string;
}

class SavedGameService {
    /**
     * Oyun durumunu Supabase'e kaydeder veya günceller.
     * Her kullanıcı + oyun türü için sadece bir kayıt tutulur (UPSERT).
     */
    async saveGame(gameName: string, state: SavedGameState, elapsedTime: number): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from("saved_games")
            .upsert(
                {
                    user_id: user.id,
                    game_name: gameName,
                    state: state as unknown as Record<string, unknown>,
                    elapsed_time: elapsedTime,
                },
                { onConflict: "user_id,game_name" }
            );

        if (error) {
            console.error("Oyun kaydedilirken hata:", error);
            return false;
        }

        return true;
    }

    /**
     * Kullanıcının belirli bir oyun türündeki kayıtlı oyununu getirir.
     */
    async getSavedGame(gameName: string): Promise<SavedGame | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from("saved_games")
            .select("*")
            .eq("user_id", user.id)
            .eq("game_name", gameName)
            .single();

        if (error || !data) return null;

        return data as SavedGame;
    }

    /**
     * Kullanıcının belirli bir oyun türündeki kayıtlı oyununu siler.
     */
    async deleteSavedGame(gameName: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from("saved_games")
            .delete()
            .eq("user_id", user.id)
            .eq("game_name", gameName);

        if (error) {
            console.error("Kayıtlı oyun silinirken hata:", error);
            return false;
        }

        return true;
    }
}

export const savedGameService = new SavedGameService();
