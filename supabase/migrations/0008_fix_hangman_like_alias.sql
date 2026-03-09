-- Normalize legacy hangman like ids to adam-asmaca
UPDATE public.game_likes
SET game_name = 'adam-asmaca'
WHERE game_name = 'hangman';

-- Remove duplicated likes after normalization
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY COALESCE(user_id::text, CONCAT('guest:', COALESCE(session_id, ''))), game_name
      ORDER BY id
    ) AS rn
  FROM public.game_likes
)
DELETE FROM public.game_likes gl
USING ranked r
WHERE gl.id = r.id
  AND r.rn > 1;
