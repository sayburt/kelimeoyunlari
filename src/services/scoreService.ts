import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

export const scoreService = {
    /**
     * Oyun sonucunu (kazanma/kaybetme) kaydeder.
     * Kullanıcı giriş yapmışsa Supabase'e, misafirse LocalStorage'a kaydeder.
     */
    async saveGameResult(gameName: string, won: boolean, score: number) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (user) {
                return await this.saveToSupabase(user.id, gameName, won, score);
            } else {
                return this.saveToLocalStorage(gameName, won, score);
            }
        } catch (error) {
            console.error("Skor kaydedilirken hata oluştu:", error);
            // Hata durumunda (örneğin offline) misafir olarak kaydet
            return this.saveToLocalStorage(gameName, won, score);
        }
    },

    saveToLocalStorage(gameName: string, won: boolean, score: number): boolean {
        const guestStats = storage.getGuestStats();
        const statIndex = guestStats.findIndex(s => s.game_name === gameName);

        if (statIndex === -1) {
            // Yeni oyun kaydı
            guestStats.push({
                game_name: gameName,
                played: 1,
                won: won ? 1 : 0,
                best_score: won ? score : 0,
                current_streak: won ? 1 : 0,
                max_streak: won ? 1 : 0
            });
        } else {
            // Mevcut kaydı güncelle
            const stat = guestStats[statIndex];
            stat.played += 1;

            if (won) {
                stat.won += 1;
                stat.current_streak += 1;
                if (stat.current_streak > stat.max_streak) {
                    stat.max_streak = stat.current_streak;
                }

                // Puan mantığı: Wordle'da düşük deneme sayısı (score) daha iyidir
                // Best score kaydı sadece kazanıldığında güncellenir ve 
                // ya ilk kez kazanılıyorsa ya da mevcut rekorundan iyiyse
                if (stat.best_score === 0 || score < stat.best_score) {
                    stat.best_score = score;
                }
            } else {
                stat.current_streak = 0;
            }
            guestStats[statIndex] = stat;
        }

        storage.setGuestStats(guestStats);
        return true;
    },

    async saveToSupabase(userId: string, gameName: string, won: boolean, score: number): Promise<boolean> {
        try {
            // Önce mevcut istatistiği al
            const { data: currentStat, error: fetchError } = await supabase
                .from("game_stats")
                .select("*")
                .eq("user_id", userId)
                .eq("game_name", gameName)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = Kayıt bulunamadı (normal)
                console.error("İstatistik alınırken hata:", fetchError);
                return false;
            }

            const now = new Date().toISOString();

            if (!currentStat) {
                // Yeni kayıt
                const { error: insertError } = await supabase
                    .from("game_stats")
                    .insert({
                        user_id: userId,
                        game_name: gameName,
                        played: 1,
                        won: won ? 1 : 0,
                        best_score: won ? score : 0,
                        current_streak: won ? 1 : 0,
                        max_streak: won ? 1 : 0,
                        updated_at: now
                    });

                if (insertError) throw insertError;
            } else {
                // Kaydı güncelle
                const currentStreak = won ? currentStat.current_streak + 1 : 0;
                const maxStreak = Math.max(currentStat.max_streak, currentStreak);

                let bestScore = currentStat.best_score;
                if (won) {
                    if (bestScore === 0 || score < bestScore) {
                        bestScore = score;
                    }
                }

                const { error: updateError } = await supabase
                    .from("game_stats")
                    .update({
                        played: currentStat.played + 1,
                        won: currentStat.won + (won ? 1 : 0),
                        best_score: bestScore,
                        current_streak: currentStreak,
                        max_streak: maxStreak,
                        updated_at: now
                    })
                    .eq("user_id", userId)
                    .eq("game_name", gameName);

                if (updateError) throw updateError;
            }
            return true;
        } catch (error) {
            console.error("Supabase'e skor kaydedilirken hata:", error);
            return false;
        }
    }
};
