import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff9e6",
          100: "#fff0c2",
          200: "#ffe58c",
          300: "#f7d75b",
          400: "#f1ca3c",
          500: "#e6bb1f",
          600: "#c99c12",
          700: "#a17c0b",
          800: "#7a5d07",
          900: "#533f05"
        },
        ink: {
          50: "#faf6f0",
          100: "#f1ebe6",
          200: "#e2d9d0",
          300: "#b6aca3",
          400: "#7d736c",
          500: "#514842",
          600: "#3b3430",
          700: "#2c2825",
          800: "#1c1a18",
          900: "#12100f"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -40px rgba(18, 16, 15, 0.25)",
        glow: "0 0 0 1px rgba(230, 187, 31, 0.18), 0 20px 50px -30px rgba(230, 187, 31, 0.6)",
        "glow-sm": "0 0 20px -5px rgba(230, 187, 31, 0.4)",
        crisp: "0 1px 0 rgba(18,16,15,0.08), 0 24px 48px -32px rgba(18,16,15,0.4)"
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
