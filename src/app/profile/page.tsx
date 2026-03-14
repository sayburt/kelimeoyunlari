'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/profile/stats');
    }, [router]);

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );
}
