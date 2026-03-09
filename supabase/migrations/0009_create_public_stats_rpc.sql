-- Public aggregate stats RPC for homepage cards.
-- SECURITY DEFINER is intentionally used so anon callers can read aggregates
-- without direct access to underlying RLS-protected tables.
CREATE OR REPLACE FUNCTION public.get_public_game_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
WITH play_counts AS (
  SELECT
    gs.game_name AS game_id,
    COALESCE(SUM(gs.played), 0)::bigint AS total_plays
  FROM public.game_stats gs
  GROUP BY gs.game_name
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

REVOKE ALL ON FUNCTION public.get_public_game_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO service_role;
