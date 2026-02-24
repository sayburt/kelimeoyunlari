/**
 * Milisaniye cinsinden süreyi MM:SS formatına çevirir.
 * @param ms Milisaniye cinsinden süre
 * @returns Formatlanmış süre (Örn: 02:14)
 */
export const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
