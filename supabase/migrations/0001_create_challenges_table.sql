-- Challenges tablosu: Meydan Okuma özelliği için
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL DEFAULT 'wordle',
  target_word TEXT NOT NULL,
  target_word_type TEXT NOT NULL DEFAULT 'dictionary' CHECK (target_word_type IN ('dictionary', 'custom')),
  word_length INTEGER NOT NULL DEFAULT 5,
  result_score INTEGER,
  result_attempts INTEGER,
  played_by UUID REFERENCES public.profiles(id),
  played_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS aktif et
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public linkler)
CREATE POLICY "challenges_select" ON public.challenges FOR SELECT USING (true);

-- Sadece sahibi oluşturabilir
CREATE POLICY "challenges_insert" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Herkes sonucu güncelleyebilir (oynayan kişi)
CREATE POLICY "challenges_update" ON public.challenges FOR UPDATE USING (true);
