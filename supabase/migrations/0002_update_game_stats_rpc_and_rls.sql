-- anonymous_game_stats tablosuna SELECT RLS politikası ekle
CREATE POLICY "anonymous_game_stats_select"
ON public.anonymous_game_stats
FOR SELECT
TO public
USING (true);

-- get_public_game_stats RPC'yi güncelle: artık sadece anonymous_game_stats kullanılacak
CREATE OR REPLACE FUNCTION public.get_public_game_stats()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH play_counts AS (
    SELECT ags.game_id, COALESCE(ags.total_plays, 0)::bigint AS total_plays
    FROM public.anonymous_game_stats ags
),
like_counts AS (
  SELECT
    CASE
      WHEN gl.game_name = 'hangman' THEN 'adam-asmaca'
      ELSE gl.game_name
    END AS game_id,
    COUNT(*)::bigint AS total_likes
  FROM public.game_likes gl
  GROUP BY 1
)
SELECT jsonb_build_object(
  'playCounts',
  COALESCE((SELECT jsonb_object_agg(pc.game_id, pc.total_plays) FROM play_counts pc), '{}'::jsonb),
  'likeCounts',
  COALESCE((SELECT jsonb_object_agg(lc.game_id, lc.total_likes) FROM like_counts lc), '{}'::jsonb)
);
$$;
