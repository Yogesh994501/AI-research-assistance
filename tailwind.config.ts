import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#071014",
          secondary: "#0B151A",
        },
        glass: {
          surface: "rgba(255, 255, 255, 0.07)",
          strong: "rgba(255, 255, 255, 0.11)",
          card: "rgba(255, 255, 255, 0.055)",
          cardHover: "rgba(255, 255, 255, 0.09)",
          slide: "rgba(255, 255, 255, 0.095)",
          border: "rgba(255, 255, 255, 0.14)",
          borderStrong: "rgba(255, 255, 255, 0.20)",
        },
        accent: {
          DEFAULT: "#22D3EE", // Arctic Cyan (Theme A)
          secondary: "#06B6D4",
          dim: "rgba(34, 211, 238, 0.12)",
          glow: "rgba(34, 211, 238, 0.35)",
          light: "#67E8F9",
        },
        txt: {
          primary: "#F8FAFC",
          secondary: "#E2E8F0",
          muted: "#94A3B8",
          dim: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backdropBlur: {
        glass: "20px",
        heavy: "24px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "slide-down": "slideDown 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.99)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
