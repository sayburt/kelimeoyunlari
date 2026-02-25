"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            setLoading(false);
            return;
        }

        // Not: Username profiles tablosuna handle_new_user trigger'ı ile otomatik yazılacak
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            alert("Kayıt başarılı! Lütfen giriş yapın.");
            router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
        }
    };

    return (
        <AuthFormWrapper
            title="Kayıt Ol"
            subtitle="Yeni bir macera başlasın."
            error={error}
            onSubmit={handleRegister}
            loading={loading}
            submitText="Kayıt Ol"
            loadingText="Kaydediliyor..."
            bottomContent={
                <div>
                    Zaten hesabın var mı?{" "}
                    <Link href="/login" className="font-bold text-primary hover:text-white transition-colors">
                        Giriş Yap
                    </Link>
                </div>
            }
        >
            <AuthInput
                label="Kullanıcı Adı"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="kelime_avcisi"
            />
            <AuthInput
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@mail.com"
            />
            <AuthInput
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
            />
            <AuthInput
                label="Şifre Tekrarı"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
            />
        </AuthFormWrapper>
    );
}

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterForm />
        </Suspense>
    );
}
