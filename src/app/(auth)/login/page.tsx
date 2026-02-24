"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { migrationService } from "@/services/migrationService";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
            setLoading(false);
        } else if (data.user) {
            // Giriş başarılı, misafir verilerini aktar
            await migrationService.migrateGuestData(data.user.id);
            router.push(redirect || "/");
            router.refresh();
        }
    };

    return (
        <AuthFormWrapper
            title="Giriş Yap"
            subtitle="Kelime dünyasına geri dön."
            error={error}
            onSubmit={handleLogin}
            loading={loading}
            submitText="Giriş Yap"
            loadingText="Giriş yapılıyor..."
            bottomContent={
                <div>
                    Hesabın yok mu?{" "}
                    <Link href="/register" className="font-bold text-primary hover:text-white transition-colors">
                        Kayıt Ol
                    </Link>
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
            <AuthInput
                label="Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
            />
        </AuthFormWrapper>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
