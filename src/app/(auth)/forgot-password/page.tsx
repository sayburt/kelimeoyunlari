"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Şifre sıfırlama bağlantısı e-posta adresine gönderildi. Lütfen gelen kutunu kontrol et.");
        }
        setLoading(false);
    };

    return (
        <AuthFormWrapper
            title="Şifremi Unuttum"
            subtitle="E-posta adresini gir, sana bir sıfırlama bağlantısı gönderelim."
            error={error}
            onSubmit={handleResetRequest}
            loading={loading}
            submitText="Bağlantı Gönder"
            loadingText="Gönderiliyor..."
            bottomContent={
                <div className="flex flex-col gap-2">
                    {message && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center mb-2">
                            {message}
                        </div>
                    )}
                    <div>
                        Hatırladın mı?{" "}
                        <Link href="/login" className="font-bold text-primary hover:text-white transition-colors">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            }
        >
            <AuthInput
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@mail.com"
            />
        </AuthFormWrapper>
    );
}
