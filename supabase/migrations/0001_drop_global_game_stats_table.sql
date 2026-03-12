-- global_game_stats tablosu hiçbir yerde kullanılmıyor, temizleniyor.
DROP POLICY IF EXISTS "global_game_stats_select" ON public.global_game_stats;
DROP TABLE IF EXISTS public.global_game_stats;
