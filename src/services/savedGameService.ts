"use client";

import { supabase } from "@/lib/supabase";

/**
 * Wordle'a özgü kayıt tipi (geriye dönük uyumluluk için saklandı)
 */
export interface WordleSavedGameState {
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

/**
 * @deprecated Yeni kod `WordleSavedGameState` kullanmalı.
 * Bu alias geriye dönük uyumluluk için bırakılmıştır.
 */
export type SavedGameState = WordleSavedGameState;

export interface SavedGame<T = Record<string, unknown>> {
    id: string;
    user_id: string;
    game_name: string;
    state: T;
    elapsed_time: number;
    created_at: string;
    updated_at: string;
}

class SavedGameService {
    /**
     * Oyun durumunu kaydeder.
     * Üye kullanıcılar için Supabase'e UPSERT yapar (her kullanıcı + oyun türü için tek kayıt).
     * Misafir kullanıcılar için localStorage'a otomatik kayıt zaten yapılmaktadır;
     * bu metot yalnızca true döndürerek onay modalının gösterilmesini sağlar.
     */
    async saveGame<T>(gameName: string, state: T, elapsedTime: number): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            // Misafir kullanıcılar için localStorage'a zaten otomatik kayıt yapılıyor
            // (useGamePersistence tarafından). Başarılı sayarak onay modalını göster.
            return typeof window !== 'undefined';
        }

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
     * Misafir ise null döner (localStorage'dan yüklenecek).
     */
    async getSavedGame<T = Record<string, unknown>>(gameName: string): Promise<SavedGame<T> | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from("saved_games")
            .select("*")
            .eq("user_id", user.id)
            .eq("game_name", gameName)
            .single();

        if (error || !data) return null;

        return data as SavedGame<T>;
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
