import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores via variáveis CSS (permite trocar a paleta no painel).
        oceano: "rgb(var(--color-oceano) / <alpha-value>)",
        oceanoDark: "rgb(var(--color-oceanoDark) / <alpha-value>)",
        laranja: "rgb(var(--color-laranja) / <alpha-value>)",
        areia: "rgb(var(--color-areia) / <alpha-value>)",
        urbano: "rgb(var(--color-urbano) / <alpha-value>)",
        offwhite: "rgb(var(--color-offwhite) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "wave-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "flip-in": {
          "0%": { transform: "rotateX(90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "wave-slide": "wave-slide 18s linear infinite",
        "flip-in": "flip-in 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
