export type GameStatus = 'idle' | 'loading' | 'playing' | 'won' | 'lost';

export interface JokerState {
    used: boolean;
    count: number;
    max: number;
}
