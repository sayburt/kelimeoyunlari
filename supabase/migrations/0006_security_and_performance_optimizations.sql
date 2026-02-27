-- 1. SECURITY FIXES

-- 1.a Security Definer in Views
ALTER VIEW public.global_game_likes SET (security_invoker = true);

-- 1.b Open RLS Policy (challenges_update)
DROP POLICY IF EXISTS "challenges_update" ON public.challenges;
CREATE POLICY "challenges_update" ON public.challenges
FOR UPDATE TO public
USING ( (SELECT auth.uid()) IN (created_by, played_by) );

-- 1.c Mutable Search Paths (Adding SET search_path = '')
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.increment_challenge_sent(uuid, text) SET search_path = '';
ALTER FUNCTION public.handle_updated_at() SET search_path = '';
ALTER FUNCTION public.update_challenge_stat(uuid, text, boolean, integer) SET search_path = '';
ALTER FUNCTION public.update_global_play_count() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';


-- 2. PERFORMANCE FIXES

-- 2.a Missing Indexes
CREATE INDEX IF NOT EXISTS idx_account_deletion_requests_user_id ON public.account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON public.badges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON public.challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_played_by ON public.challenges(played_by);
CREATE INDEX IF NOT EXISTS idx_game_likes_user_id ON public.game_likes(user_id);

-- 2.b Redundant Policies
DROP POLICY IF EXISTS "Users can view their own badges" ON public.badges;
-- "Badges are viewable by everyone" (SELECT) policy remains and is sufficient.

-- 2.c RLS Initialization Plan (Optimize auth.uid() and auth.role() calls)

-- account_deletion_requests
DROP POLICY IF EXISTS "Service role can do everything" ON public.account_deletion_requests;
CREATE POLICY "Service role can do everything" ON public.account_deletion_requests
FOR ALL TO public
USING ( (SELECT auth.role()) = 'service_role'::text );

-- badges
DROP POLICY IF EXISTS "System can insert badges" ON public.badges;
CREATE POLICY "System can insert badges" ON public.badges
FOR INSERT TO public
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- challenge_stats
DROP POLICY IF EXISTS "challenge_stats_insert" ON public.challenge_stats;
CREATE POLICY "challenge_stats_insert" ON public.challenge_stats
FOR INSERT TO public
WITH CHECK ( (SELECT auth.uid()) = user_id );

DROP POLICY IF EXISTS "challenge_stats_update" ON public.challenge_stats;
CREATE POLICY "challenge_stats_update" ON public.challenge_stats
FOR UPDATE TO public
USING ( (SELECT auth.uid()) = user_id );

-- challenges
DROP POLICY IF EXISTS "challenges_insert" ON public.challenges;
CREATE POLICY "challenges_insert" ON public.challenges
FOR INSERT TO public
WITH CHECK ( (SELECT auth.uid()) = created_by );

-- game_likes
DROP POLICY IF EXISTS "Users can delete own likes" ON public.game_likes;
CREATE POLICY "Users can delete own likes" ON public.game_likes
FOR DELETE TO public
USING ( (((SELECT auth.uid()) IS NOT NULL) AND ((SELECT auth.uid()) = user_id)) OR (((SELECT auth.uid()) IS NULL) AND (user_id IS NULL)) );

DROP POLICY IF EXISTS "Users can insert own likes" ON public.game_likes;
CREATE POLICY "Users can insert own likes" ON public.game_likes
FOR INSERT TO public
WITH CHECK ( (((SELECT auth.uid()) IS NOT NULL) AND ((SELECT auth.uid()) = user_id)) OR (((SELECT auth.uid()) IS NULL) AND (user_id IS NULL)) );

-- game_stats
DROP POLICY IF EXISTS "Users can insert own game stats" ON public.game_stats;
CREATE POLICY "Users can insert own game stats" ON public.game_stats
FOR INSERT TO public
WITH CHECK ( (SELECT auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can update own game stats" ON public.game_stats;
CREATE POLICY "Users can update own game stats" ON public.game_stats
FOR UPDATE TO public
USING ( (SELECT auth.uid()) = user_id );

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO public
USING ( (SELECT auth.uid()) = id );

-- saved_games
DROP POLICY IF EXISTS "Users can delete their own saved games" ON public.saved_games;
CREATE POLICY "Users can delete their own saved games" ON public.saved_games
FOR DELETE TO public
USING ( (SELECT auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can insert their own saved games" ON public.saved_games;
CREATE POLICY "Users can insert their own saved games" ON public.saved_games
FOR INSERT TO public
WITH CHECK ( (SELECT auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can update their own saved games" ON public.saved_games;
CREATE POLICY "Users can update their own saved games" ON public.saved_games
FOR UPDATE TO public
USING ( (SELECT auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can view their own saved games" ON public.saved_games;
CREATE POLICY "Users can view their own saved games" ON public.saved_games
FOR SELECT TO public
USING ( (SELECT auth.uid()) = user_id );
