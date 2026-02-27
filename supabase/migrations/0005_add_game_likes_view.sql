-- Add DELETE policy to game_likes table
CREATE POLICY "Users can delete own likes"
ON public.game_likes
FOR DELETE
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Create a view to aggregate total likes per game
CREATE OR REPLACE VIEW public.global_game_likes AS
SELECT game_name, COUNT(*) as total_likes
FROM public.game_likes
GROUP BY game_name;

-- Grant access to the view
GRANT SELECT ON public.global_game_likes TO anon, authenticated;
