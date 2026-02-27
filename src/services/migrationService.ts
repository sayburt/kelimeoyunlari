import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

export const migrationService = {
    /**
     * Misafir verilerini Supabase'e aktarır.
     * Genellikle kullanıcı giriş yaptığında veya kayıt olduğunda çağrılır.
     */
    async migrateGuestData(userId: string) {
        const guestStats = storage.getGuestStats();
        const guestLikes = storage.getGuestLikes();

        if ((!guestStats || guestStats.length === 0) && (!guestLikes || guestLikes.length === 0)) {
            return { success: true, message: "Aktarılacak veri yok" };
        }

        try {
            console.log(`${guestStats.length} adet istatistik, ${guestLikes.length} adet beğeni aktarılıyor...`);

            // Gerçek uygulamada burada guestStats içindeki her bir oyun için 
            // upsert işlemi yapılmalı.
            for (const stat of guestStats) {
                const { error } = await supabase
                    .from("game_stats")
                    .upsert({
                        user_id: userId,
                        game_name: stat.game_name,
                        played: stat.played,
                        won: stat.won,
                        best_score: stat.best_score,
                        high_score: stat.high_score,
                        current_streak: stat.current_streak,
                        max_streak: stat.max_streak,
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: "user_id, game_name"
                    });

                if (error) {
                    console.error(`Migration error for ${stat.game_name}:`, error);
                }
            }

            // Beğenileri aktar (Misafir beğenisini update ederek kullanıcı ID'ye ata, unique limitlerini atla)
            const sessionId = storage.getSessionId();
            if (sessionId) {
                // Session ID ile daha önce açılmış olan likeları bu kullanıcıya update edelim
                // conflictleri önlemek için bu session_id olanlar user_id'si null ise yapıyoruz.
                try {
                    await supabase
                        .from('game_likes')
                        .update({ user_id: userId })
                        .eq('session_id', sessionId)
                        .is('user_id', null);
                } catch (error) {
                    console.error("Beğeni aktarım hatası", error);
                }
            }

            // Aktarım başarılıysa local veriyi temizle
            storage.clearGuestData();

            return { success: true };
        } catch (error) {
            console.error("Migration fatal error:", error);
            return { success: false, error };
        }
    }
};
