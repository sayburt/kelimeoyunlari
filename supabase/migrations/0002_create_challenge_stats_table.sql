-- challenge_stats tablosu: Kullanıcı bazlı meydan okuma istatistikleri
-- Hangi oyun için kaç meydan okuma gönderildi, katılındı, kazanıldı takip edilir.
CREATE TABLE public.challenge_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL DEFAULT 'wordle',
  sent_count INTEGER NOT NULL DEFAULT 0,       -- Kullanıcının gönderdiği meydan okuma sayısı
  received_count INTEGER NOT NULL DEFAULT 0,   -- Kullanıcının katıldığı meydan okuma sayısı
  won_count INTEGER NOT NULL DEFAULT 0,        -- Kazanılan meydan okuma sayısı
  best_score INTEGER NOT NULL DEFAULT 0,       -- Meydan okumalarda elde edilen en yüksek puan
  total_score BIGINT NOT NULL DEFAULT 0,       -- avg hesabı için toplam puan
  last_played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_name)
);

-- RLS aktif et
ALTER TABLE public.challenge_stats ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (liderlik tablosu desteği)
CREATE POLICY "challenge_stats_select" ON public.challenge_stats
  FOR SELECT USING (true);

-- Kullanıcı sadece kendi kaydını ekleyebilir
CREATE POLICY "challenge_stats_insert" ON public.challenge_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcı sadece kendi kaydını güncelleyebilir
CREATE POLICY "challenge_stats_update" ON public.challenge_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- sent_count artırma helper fonksiyonu
-- challengeService.createChallenge() çağrıldığında kullanılır
CREATE OR REPLACE FUNCTION increment_challenge_sent(p_user_id UUID, p_game_name TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.challenge_stats (user_id, game_name, sent_count)
  VALUES (p_user_id, p_game_name, 1)
  ON CONFLICT (user_id, game_name)
  DO UPDATE SET
    sent_count = challenge_stats.sent_count + 1,
    updated_at = NOW();
END;
$$;

-- received/won/score güncelleme helper fonksiyonu
-- challengeService.updateChallengeResult() çağrıldığında kullanılır
CREATE OR REPLACE FUNCTION update_challenge_stat(
  p_user_id UUID,
  p_game_name TEXT,
  p_won BOOLEAN,
  p_score INTEGER
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.challenge_stats (user_id, game_name, received_count, won_count, best_score, total_score, last_played_at)
  VALUES (
    p_user_id,
    p_game_name,
    1,
    CASE WHEN p_won THEN 1 ELSE 0 END,
    p_score,
    p_score,
    NOW()
  )
  ON CONFLICT (user_id, game_name)
  DO UPDATE SET
    received_count = challenge_stats.received_count + 1,
    won_count = challenge_stats.won_count + CASE WHEN p_won THEN 1 ELSE 0 END,
    best_score = GREATEST(challenge_stats.best_score, p_score),
    total_score = challenge_stats.total_score + p_score,
    last_played_at = NOW(),
    updated_at = NOW();
END;
$$;
