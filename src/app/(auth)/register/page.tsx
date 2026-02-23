"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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
            // Kayıt başarılı, onay bekleyebilir veya direk login'e yönlendirebilir
            // Varsayılan ayarlarda onay maili gerekebilir, burayı basit tutuyoruz.
            alert("Kayıt başarılı! Lütfen giriş yapın.");
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md bg-surface rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(34,211,238,0.15)] border border-primary/30 relative transition-all duration-500 hover:shadow-[0_0_60px_rgba(34,211,238,0.25)]">
                <div className="relative">

                    <h1 className="text-3xl font-black text-text-main mb-2 text-center">Kayıt Ol</h1>
                    <p className="text-text-secondary text-center mb-8">Yeni bir macera başlasın.</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-1">Kullanıcı Adı</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-surface/50 bg-bg/50 focus:border-primary focus:bg-bg outline-none transition-colors text-text-main"
                                placeholder="kelime_avcisi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-1">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-surface/50 bg-bg/50 focus:border-primary focus:bg-bg outline-none transition-colors text-text-main"
                                placeholder="ornek@mail.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-1">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-surface/50 bg-bg/50 focus:border-primary focus:bg-bg outline-none transition-colors text-text-main"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-bg font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
                        >
                            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-text-secondary">
                        <div>
                            Zaten hesabın var mı?{" "}
                            <Link href="/login" className="font-bold text-primary hover:text-white transition-colors">
                                Giriş Yap
                            </Link>
                        </div>
                        <Link href="/" className="flex items-center gap-1 font-bold text-text-secondary hover:text-text-main transition-colors mt-2">
                            <span>←</span> Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
