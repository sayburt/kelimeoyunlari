import { supabase } from "@/lib/supabase";

export interface Challenge {
    id: string;
    created_by: string;
    game_name: string;
    target_word: string;
    target_word_type: 'dictionary' | 'custom';
    word_length: number;
    result_score: number | null;
    result_attempts: number | null;
    played_by: string | null;
    played_at: string | null;
    expires_at: string;
    created_at: string;
}

// Base64 encode/decode — basit obfuscation
function encodeWord(word: string): string {
    return btoa(unescape(encodeURIComponent(word)));
}

function decodeWord(encoded: string): string {
    return decodeURIComponent(escape(atob(encoded)));
}

export const challengeService = {
    /**
     * Yeni bir meydan okuma oluşturur.
     * @returns Oluşturulan challenge'ın ID'si
     */
    async createChallenge(
        gameName: string,
        word: string,
        wordType: 'dictionary' | 'custom',
        wordLength: number
    ): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const encoded = encodeWord(word.toLocaleUpperCase('tr-TR'));

        const { data, error } = await supabase
            .from('challenges')
            .insert({
                created_by: user.id,
                game_name: gameName,
                target_word: encoded,
                target_word_type: wordType,
                word_length: wordLength,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Challenge oluşturma hatası:', error);
            return null;
        }

        return data.id;
    },

    /**
     * Challenge verisini ID'ye göre getirir.
     * Kelimeyi decode eder. Süresi dolmuş challenge'ları reddeder.
     */
    async getChallenge(challengeId: string): Promise<{
        challenge: Challenge;
        decodedWord: string;
    } | null> {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .single();

        if (error || !data) {
            console.error('Challenge bulunamadı:', error);
            return null;
        }

        // Süre kontrolü
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            console.warn('Challenge süresi dolmuş');
            return null;
        }

        const decodedWord = decodeWord(data.target_word);

        return {
            challenge: data as Challenge,
            decodedWord,
        };
    },

    /**
     * Oyun sonucunu challenge kaydına işler.
     */
    async updateChallengeResult(
        challengeId: string,
        score: number,
        attempts: number,
        playedBy?: string
    ): Promise<boolean> {
        const updateData: Record<string, unknown> = {
            result_score: score,
            result_attempts: attempts,
            played_at: new Date().toISOString(),
        };

        if (playedBy) {
            updateData.played_by = playedBy;
        }

        const { error } = await supabase
            .from('challenges')
            .update(updateData)
            .eq('id', challengeId);

        if (error) {
            console.error('Challenge sonuç güncelleme hatası:', error);
            return false;
        }

        return true;
    },
};
