import { Logo } from "@/components/Logo";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-2xl animate-fade-in">
            <div className="flex flex-col items-center gap-8 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl animate-pulse-slow"></div>

                {/* Spinner Container */}
                <div className="relative w-16 h-16">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-ink-100 opacity-30"></div>
                    {/* Detailed Spinner */}
                    <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
                </div>

                {/* Animated Logo */}
                <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <Logo size="md" />
                </div>

                <p className="text-sm font-semibold text-ink-400 mt-2 animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
