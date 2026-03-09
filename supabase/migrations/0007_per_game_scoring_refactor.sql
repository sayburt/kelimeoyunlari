-- Per-game scoring refactor
-- - Adds immutable score event table for weekly leaderboards
-- - Resets legacy score data (history is intentionally not preserved)

CREATE TABLE IF NOT EXISTS public.game_score_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  won BOOLEAN NOT NULL DEFAULT false,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_game_score_events_game_played_at
  ON public.game_score_events (game_name, played_at DESC);

CREATE INDEX IF NOT EXISTS idx_game_score_events_game_score
  ON public.game_score_events (game_name, score DESC);

CREATE INDEX IF NOT EXISTS idx_game_score_events_user_game_played_at
  ON public.game_score_events (user_id, game_name, played_at DESC);

ALTER TABLE public.game_score_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_score_events_select" ON public.game_score_events;
CREATE POLICY "game_score_events_select"
  ON public.game_score_events
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "game_score_events_insert" ON public.game_score_events;
CREATE POLICY "game_score_events_insert"
  ON public.game_score_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.game_score_events TO anon, authenticated;
GRANT INSERT ON public.game_score_events TO authenticated;

-- Legacy reset: global score flow is removed, historical points are dropped.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'game_score_events') THEN
    TRUNCATE TABLE public.game_score_events;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'game_stats') THEN
    TRUNCATE TABLE public.game_stats;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'badges') THEN
    TRUNCATE TABLE public.badges;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'total_score'
  ) THEN
    EXECUTE 'UPDATE public.profiles SET total_score = 0';
  END IF;
END
$$;
