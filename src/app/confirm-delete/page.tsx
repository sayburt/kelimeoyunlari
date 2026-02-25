'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ConfirmDeleteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        async function confirm() {
            if (!token) {
                setStatus('error');
                setError('Geçersiz silme bağlantısı. Lütfen mailinizdeki linki kontrol edin.');
                return;
            }

            const result = await profileService.confirmAccountDeletion(token);
            if (result.success) {
                setStatus('success');
                // 3 saniye sonra ana sayfaya yönlendir
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setStatus('error');
                setError(result.error ?? 'Hesap silme işlemi sırasında bir hata oluştu.');
            }
        }

        confirm();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-bg hero-glow flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-surface border-2 border-surface-mid rounded-3xl p-8 shadow-2xl text-center space-y-6"
            >
                {status === 'loading' && (
                    <div className="py-8 space-y-4">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                        <h1 className="text-xl font-black text-text-main">Hesabınız Siliniyor...</h1>
                        <p className="text-text-secondary text-sm">Lütfen bekleyin, işleminiz tamamlanıyor.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-4 space-y-4">
                        <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-text-main">Elveda!</h1>
                        <p className="text-text-secondary">
                            Hesabınız ve tüm verileriniz kalıcı olarak silindi. Bizi tercih ettiğiniz için teşekkürler.
                        </p>
                        <p className="text-xs text-primary font-medium animate-pulse">
                            Ana sayfaya yönlendiriliyorsunuz...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4 space-y-4">
                        <div className="w-16 h-16 bg-danger/20 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-text-main">Hata Oluştu</h1>
                        <p className="text-text-secondary">
                            {error}
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-surface-mid text-text-main font-bold px-6 py-3 rounded-xl hover:bg-surface-mid2 transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Ana Sayfaya Dön
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function ConfirmDeletePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <ConfirmDeleteContent />
        </Suspense>
    );
}
