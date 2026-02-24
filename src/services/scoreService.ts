import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

export const scoreService = {
    /**
     * Wordle için puan hesaplar.
     * Toplam Puan = ((Taban + Deneme + Zaman) x Zorluk Çarpanı) - (Joker x 200)
     */
    calculateWordleScore(attempts: number, seconds: number, difficulty: number, jokersUsed: number = 0): number {
        const basePoint = 1000;

        // Deneme Bonusu: 1: 1000, 2: 800, 3: 600, 4: 400, 5: 200, 6: 0
        const trialBonuses = [1000, 800, 600, 400, 200, 0];
        const trialBonus = trialBonuses[Math.min(attempts - 1, trialBonuses.length - 1)] || 0;

        // Zaman Bonusu: max(0, (300 - harcanan_saniye) x 2)
        const timeBonus = Math.max(0, (300 - seconds) * 2);

        // Zorluk Çarpanı: 1 (Kolay): 1.0, 2 (Orta): 1.5, 3 (Zor): 2.0
        let multiplier = 1.0;
        if (difficulty === 2) multiplier = 1.5;
        if (difficulty === 3) multiplier = 2.0;

        // Joker Cezası: Her joker için -200 puan
        const jokerPenalty = jokersUsed * 200;

        const totalScore = Math.max(0, Math.round((basePoint + trialBonus + timeBonus) * multiplier) - jokerPenalty);
        return totalScore;
    },

    /**
     * Oyun sonucunu (kazanma/kaybetme) kaydeder.
     * Kullanıcı giriş yapmışsa Supabase'e, misafirse LocalStorage'a kaydeder.
     */
    async saveGameResult(gameName: string, won: boolean, score: number, metadata?: Record<string, unknown>) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            // Wordle için 'score' parametresi deneme sayısı olarak geliyor.
            // Ama yeni sistemde 'calculatedScore' da gerekiyor.
            const calculatedScore = metadata?.calculatedScore as number || 0;

            if (user) {
                return await this.saveToSupabase(user.id, gameName, won, score, calculatedScore);
            } else {
                return this.saveToLocalStorage(gameName, won, score, calculatedScore);
            }
        } catch (error) {
            console.error("Skor kaydedilirken hata oluştu:", error);
            return this.saveToLocalStorage(gameName, won, 1, 0); // Hata durumunda güvenli fallback
        }
    },

    saveToLocalStorage(gameName: string, won: boolean, attempts: number, calculatedScore: number): boolean {
        const guestStats = storage.getGuestStats();
        const statIndex = guestStats.findIndex(s => s.game_name === gameName);

        if (statIndex === -1) {
            guestStats.push({
                game_name: gameName,
                played: 1,
                won: won ? 1 : 0,
                best_score: won ? attempts : 0,
                high_score: won ? calculatedScore : 0,
                current_streak: won ? 1 : 0,
                max_streak: won ? 1 : 0
            });
        } else {
            const stat = guestStats[statIndex];
            stat.played += 1;

            if (won) {
                stat.won += 1;
                stat.current_streak += 1;
                if (stat.current_streak > stat.max_streak) {
                    stat.max_streak = stat.current_streak;
                }

                // Wordle'da düşük deneme sayısı (attempts) daha iyidir
                if (stat.best_score === 0 || attempts < stat.best_score) {
                    stat.best_score = attempts;
                }

                // Yüksek puan takibi
                if (calculatedScore > (stat.high_score || 0)) {
                    stat.high_score = calculatedScore;
                }
            } else {
                stat.current_streak = 0;
            }
            guestStats[statIndex] = stat;
        }

        storage.setGuestStats(guestStats);
        return true;
    },

    async saveToSupabase(userId: string, gameName: string, won: boolean, attempts: number, calculatedScore: number): Promise<boolean> {
        try {
            // 1. Oyun istatistiğini güncelle/ekle
            const { data: currentStat, error: fetchError } = await supabase
                .from("game_stats")
                .select("*")
                .eq("user_id", userId)
                .eq("game_name", gameName)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error("İstatistik alınırken hata:", fetchError);
                return false;
            }

            const now = new Date().toISOString();

            if (!currentStat) {
                const { error: insertError } = await supabase
                    .from("game_stats")
                    .insert({
                        user_id: userId,
                        game_name: gameName,
                        played: 1,
                        won: won ? 1 : 0,
                        best_score: won ? attempts : 0,
                        high_score: won ? calculatedScore : 0,
                        current_streak: won ? 1 : 0,
                        max_streak: won ? 1 : 0,
                        updated_at: now
                    });
                if (insertError) throw insertError;
            } else {
                const currentStreak = won ? currentStat.current_streak + 1 : 0;
                const maxStreak = Math.max(currentStat.max_streak, currentStreak);

                let bestScore = currentStat.best_score;
                if (won && (bestScore === 0 || attempts < bestScore)) {
                    bestScore = attempts;
                }

                const highScore = won ? Math.max(currentStat.high_score || 0, calculatedScore) : (currentStat.high_score || 0);

                const { error: updateError } = await supabase
                    .from("game_stats")
                    .update({
                        played: currentStat.played + 1,
                        won: currentStat.won + (won ? 1 : 0),
                        best_score: bestScore,
                        high_score: highScore,
                        current_streak: currentStreak,
                        max_streak: maxStreak,
                        updated_at: now
                    })
                    .eq("user_id", userId)
                    .eq("game_name", gameName);

                if (updateError) throw updateError;
            }

            // 2. Profildeki toplam puanı güncelle
            if (won && calculatedScore > 0) {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("total_score")
                    .eq("id", userId)
                    .single();

                if (!profileError && profile) {
                    const newTotalScore = (profile.total_score || 0) + calculatedScore;

                    await supabase
                        .from("profiles")
                        .update({ total_score: newTotalScore })
                        .eq("id", userId);

                    // 3. Rozet kontrolü
                    await this.checkAndAwardBadges(userId, newTotalScore);
                }
            }

            return true;
        } catch (error) {
            console.error("Supabase'e skor kaydedilirken hata:", error);
            return false;
        }
    },

    async checkAndAwardBadges(userId: string, totalScore: number) {
        const badgeThresholds = [
            { name: "Binlik Kulübü", threshold: 5000, desc: "İlk adımı attınız, artık bir oyuncusunuz!" },
            { name: "Acemi Dilci", threshold: 25000, desc: "Kelimeler dünyasında kendinizi kanıtlamaya başladınız." },
            { name: "Kelime Avcısı", threshold: 100000, desc: "Keskin bir zeka ve hızın birleşimi." },
            { name: "Puan Ustası", threshold: 250000, desc: "Platformun elit oyuncuları arasına girdiniz." },
            { name: "Kelime Efsanesi", threshold: 1000000, desc: "İsminiz kelime oyunları tarihine yazılmaya aday." },
            { name: "Ölümsüz Dilbilimci", threshold: 2500000, desc: "Kelimelerin efendisi, aşılması güç bir rekor!" }
        ];

        for (const badge of badgeThresholds) {
            if (totalScore >= badge.threshold) {
                // Upsert kullanarak mükerrer kaydı önle (RLS ve Unique constraint sayesinde)
                await supabase
                    .from("badges")
                    .upsert({
                        user_id: userId,
                        name: badge.name,
                        description: badge.desc,
                        earned_at: new Date().toISOString()
                    }, { onConflict: 'user_id, name' });
            }
        }
    }
};
