-- Create a table specifically for tracking anonymous plays (avoids locking main users table)
CREATE TABLE IF NOT EXISTS public.anonymous_game_stats (
    game_id text PRIMARY KEY,
    total_plays bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (though service_role bypasses it)
ALTER TABLE public.anonymous_game_stats ENABLE ROW LEVEL SECURITY;

-- Secure increment RPC for anonymous plays (to be called by backend API)
CREATE OR REPLACE FUNCTION public.increment_anonymous_play(req_game_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.anonymous_game_stats (game_id, total_plays)
    VALUES (req_game_id, 1)
    ON CONFLICT (game_id)
    DO UPDATE SET 
        total_plays = public.anonymous_game_stats.total_plays + 1,
        updated_at = now();
END;
$$;

-- Function to get merged public statistics
CREATE OR REPLACE FUNCTION public.get_public_game_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
WITH registered_plays AS (
    SELECT gs.game_name AS game_id, COALESCE(SUM(gs.played), 0)::bigint AS plays
    FROM public.game_stats gs
    GROUP BY gs.game_name
),
anonymous_plays AS (
    SELECT ags.game_id, COALESCE(SUM(ags.total_plays), 0)::bigint AS plays
    FROM public.anonymous_game_stats ags
    GROUP BY ags.game_id
),
combined_plays AS (
    SELECT 
        COALESCE(r.game_id, a.game_id) AS game_id,
        COALESCE(r.plays, 0) + COALESCE(a.plays, 0) AS total_plays
    FROM registered_plays r
    FULL OUTER JOIN anonymous_plays a ON r.game_id = a.game_id
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
  COALESCE((SELECT jsonb_object_agg(pc.game_id, pc.total_plays) FROM combined_plays pc), '{}'::jsonb),
  'likeCounts',
  COALESCE((SELECT jsonb_object_agg(lc.game_id, lc.total_likes) FROM like_counts lc), '{}'::jsonb)
);
$$;

-- Apply grants
GRANT EXECUTE ON FUNCTION public.increment_anonymous_play(text) TO service_role;
REVOKE ALL ON FUNCTION public.increment_anonymous_play(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_anonymous_play(text) FROM anon;
REVOKE ALL ON FUNCTION public.increment_anonymous_play(text) FROM authenticated;

REVOKE ALL ON FUNCTION public.get_public_game_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_game_stats() TO service_role;
