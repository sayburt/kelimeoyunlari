/**
 * Shares the game or results using the Web Share API if available, 
 * otherwise falls back to copying to clipboard.
 */
export async function shareContent({
    title,
    text,
    url,
}: {
    title: string;
    text: string;
    url: string;
}): Promise<{ type: 'share' | 'copy'; success: boolean }> {
    const shareData = {
        title,
        text,
        url: url || window.location.href,
    };

    try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return { type: 'share', success: true };
        } else {
            // Fallback: Copy to clipboard
            const shareText = `${text}\n\n${shareData.url}`;
            await navigator.clipboard.writeText(shareText);
            return { type: 'copy', success: true };
        }
    } catch (error) {
        // User cancelled or other error
        if (error instanceof Error && error.name === 'AbortError') {
            return { type: 'share', success: false };
        }

        // Fallback for any other error
        try {
            const shareText = `${text}\n\n${shareData.url}`;
            await navigator.clipboard.writeText(shareText);
            return { type: 'copy', success: true };
        } catch (copyError) {
            console.error('Sharing failed:', error, copyError);
            return { type: 'share', success: false };
        }
    }
}
