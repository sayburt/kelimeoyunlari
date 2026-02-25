"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Başarılı, giriş sayfasına yönlendir
            router.push("/login?message=Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.");
        }
    };

    return (
        <AuthFormWrapper
            title="Yeni Şifre Belirle"
            subtitle="Hesabın için güvenli bir şifre seç."
            error={error}
            onSubmit={handleResetPassword}
            loading={loading}
            submitText="Şifreyi Güncelle"
            loadingText="Güncelleniyor..."
            bottomContent={null}
        >
            <AuthInput
                label="Yeni Şifre"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
            />
            <AuthInput
                label="Şifre Onay"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
            />
        </AuthFormWrapper>
    );
}
