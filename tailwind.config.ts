import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fffBEB",   // Very light yellow
          100: "#FEF3C7",  // Light yellow
          200: "#FDE68A",  // Soft yellow
          300: "#FCD34D",  // Bright yellow
          400: "#FBBF24",  // Deep yellow
          500: "#f1c652",  // [USER COLOR] Base Gold
          600: "#D97706",  // Darker gold/orange
          700: "#B45309",  // Brownish gold
          800: "#92400E",  // Dark brown
          900: "#78350F",  // Very dark brown
        },
        ink: {
          50: "#F9FAFB",   // White-ish
          100: "#e4e6e5",  // [USER COLOR] Light Gray / Off-white (Background?)
          200: "#D1D5DB",  // Neutral gray
          300: "#9CA3AF",  // Medium gray
          400: "#6B7280",  // Darker gray
          500: "#4B5563",  // Dark gray
          600: "#374151",  // Darker
          700: "#1F2937",  // Very dark
          800: "#231d21",  // [USER COLOR] Almost Black (Text?)
          900: "#111827",  // Black
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -40px rgba(35, 29, 33, 0.25)",
        glow: "0 0 0 1px rgba(241, 198, 82, 0.18), 0 20px 50px -30px rgba(241, 198, 82, 0.6)",
        "glow-sm": "0 0 20px -5px rgba(241, 198, 82, 0.4)",
        crisp: "0 1px 0 rgba(35, 29, 33,0.08), 0 24px 48px -32px rgba(35, 29, 33,0.4)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
