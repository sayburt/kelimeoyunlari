import { useState, useEffect, useCallback } from 'react';

/**
 * Oyunlar için kullanılan genel zamanlayıcı hook'u.
 * @param isActive Zamanlayıcının çalışıp çalışmayacağını belirler (Örn: status === 'playing')
 * @param isPaused Zamanlayıcının dondurulup dondurulmayacağını belirler (Örn: modal açıkken)
 * @returns { elapsedTime, resetTimer } elapsedTime: Geçen süre (ms), resetTimer: Süreyi sıfırlar
 */
export function useTimer(isActive: boolean, isPaused: boolean = false) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isActive && !isPaused) {
            const startTime = Date.now() - elapsedTime;
            intervalId = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 10);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isActive, isPaused, elapsedTime]);

    const resetTimer = useCallback(() => setElapsedTime(0), []);

    return { elapsedTime, resetTimer, setElapsedTime };
}
