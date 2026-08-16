import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mango: "#E86A2E",   // single saturated accent — sambar-orange
        maroon: "#C24A1D",  // pressed/hover state of the same accent, not a second brand color
        leaf: "#4C7A5A",    // muted veg indicator
        cream: "#FFFFFF",   // pure white canvas
        charcoal: "#1E1B18",
        chip: "#F7F3EC",
        line: "#E8E2D8",
        ring: "#F0DCC8",    // the tiffin-stack ring motif color
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
