import React from "react";
import Link from "next/link";

interface AuthFormWrapperProps {
    title: string;
    subtitle: string;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    submitText: string;
    loadingText: string;
    children: React.ReactNode;
    bottomContent: React.ReactNode;
}

export function AuthFormWrapper({
    title,
    subtitle,
    error,
    onSubmit,
    loading,
    submitText,
    loadingText,
    children,
    bottomContent,
}: AuthFormWrapperProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md bg-surface rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(34,211,238,0.15)] border border-primary/30 relative transition-all duration-500 hover:shadow-[0_0_60px_rgba(34,211,238,0.25)]">
                <div className="relative">
                    <h1 className="text-3xl font-black text-text-main mb-2 text-center">{title}</h1>
                    <p className="text-text-secondary text-center mb-8">{subtitle}</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        {children}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-bg font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
                        >
                            {loading ? loadingText : submitText}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-text-secondary">
                        {bottomContent}
                        <Link href="/" className="flex items-center gap-1 font-bold text-text-secondary hover:text-text-main transition-colors mt-2">
                            <span>←</span> Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
