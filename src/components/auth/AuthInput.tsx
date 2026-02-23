import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function AuthInput({ label, ...props }: AuthInputProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-text-main mb-1">
                {label}
            </label>
            <input
                {...props}
                className={`w-full h-12 px-4 rounded-xl border border-surface/50 bg-bg/50 focus:border-primary focus:bg-bg outline-none transition-colors text-text-main ${props.className || ""}`}
            />
        </div>
    );
}
