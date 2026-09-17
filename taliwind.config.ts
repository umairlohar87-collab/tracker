import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      colors: {
        bg: {
          DEFAULT: "#06080f",
          soft: "#0a0e1a",
          card: "#0e1424",
          border: "#1a2137",
          hover: "#131a30",
        },
        brand: {
          DEFAULT: "#5b7cff",
          soft: "#3d5ee0",
          glow: "#7c9aff",
        },
        accent: {
          cyan: "#22d3ee",
          violet: "#a855f7",
          amber: "#f59e0b",
          rose: "#f43f5e",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5b7cff 0%, #a855f7 100%)",
        "glass":
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "radial-brand":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(91,124,255,0.15), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 32px rgba(91,124,255,0.35)",
        "glow-sm": "0 0 16px rgba(91,124,255,0.25)",
        soft: "0 12px 40px rgba(0,0,0,0.4)",
        "inner-line": "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "80%": { transform: "scale(2.2)", opacity: "0" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ping2: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite",
        fadeIn: "fadeIn 0.4s ease-out both",
        slideUp: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s linear infinite",
        ping2: "ping2 1.8s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;