'use client';

import { useEffect, useRef, useState } from 'react';

export function useSyncedElementHeight<T extends HTMLElement>() {
    const elementRef = useRef<T | null>(null);
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) {
            return;
        }

        const updateHeight = () => {
            setHeight(element.offsetHeight);
        };

        updateHeight();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(updateHeight);
            observer.observe(element);

            window.addEventListener('resize', updateHeight);
            return () => {
                observer.disconnect();
                window.removeEventListener('resize', updateHeight);
            };
        }

        window.addEventListener('resize', updateHeight);
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return { elementRef, height };
}
