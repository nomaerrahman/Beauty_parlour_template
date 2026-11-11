import type { Config } from "tailwindcss";

/**
 * Theme tokens are CSS variables defined in app/globals.css.
 * To rebrand for a client, change the variables there — every
 * component reads from these names.
 */
const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1320px" } },
    extend: {
      colors: {
        champagne: withAlpha("--champagne"), // page background
        porcelain: withAlpha("--porcelain"), // raised surfaces
        linen: withAlpha("--linen"), // subtle fills, borders
        bronze: withAlpha("--bronze"), // primary accent
        "bronze-deep": withAlpha("--bronze-deep"), // accent text on light bg (AA contrast)
        gold: withAlpha("--gold"), // highlights
        slate: withAlpha("--slate"), // text
        mist: withAlpha("--mist"), // secondary text
        rose: withAlpha("--rose"), // soft blush tint
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Modular scale (~1.25) for editorial rhythm
        "display-xl": ["clamp(3rem, 7.2vw, 6.75rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.4rem, 4.6vw, 4.25rem)", { lineHeight: "1.04", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 2.8vw, 2.6rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        arch: "999px 999px 1.5rem 1.5rem",
        "arch-sm": "999px 999px 1rem 1rem",
        petal: "2rem",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgb(var(--bronze) / 0.45)",
        soft: "0 24px 48px -28px rgb(var(--slate) / 0.35)",
        glass: "inset 0 1px 0 rgb(255 255 255 / 0.6), 0 10px 30px -18px rgb(var(--slate) / 0.4)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: { shimmer: "shimmer 2.4s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
