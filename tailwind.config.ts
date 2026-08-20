import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B6E4F",
        "primary-dark": "#074D37",
        "primary-light": "#10B981",
        secondary: "#10B981",
        accent: "#E11D48",
        surface: "#FFFFFF",
        background: "#F7F5F0",
        "text-main": "#1A2820",
        "text-muted": "#5C6F64",
      },
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        foodly: ["'Indie Flower'", "cursive", "sans-serif"],
        handwriting: ["'Indie Flower'", "cursive", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
