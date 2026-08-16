import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6A38C2",
        "primary-dark": "#4B2494",
        secondary: "#42D2B8",
        accent: "#FF5E7E",
        surface: "#FFFFFF",
        background: "#F8F9FB",
        "text-main": "#2D3748",
        "text-muted": "#718096",
      },
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
