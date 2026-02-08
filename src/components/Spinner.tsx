
export const Spinner = ({ className = "", size = "md", color = "current" }: { className?: string, size?: "sm" | "md" | "lg" | "xl", color?: "current" | "brand" | "white" }) => {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    const colorClasses = {
        current: "text-current",
        brand: "text-brand-500",
        white: "text-white"
    };

    return (
        <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
            <svg className={`animate-spin ${colorClasses[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
};

export const ModernSpinner = () => (
    <div className="flex items-center justify-center space-x-1.5 p-2">
        <div className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm"></div>
        <div className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm"></div>
        <div className="w-2.5 h-2.5 bg-brand-300 rounded-full animate-bounce shadow-sm"></div>
    </div>
);
