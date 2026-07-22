import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080A",
        surface: "#121318",
        glass: "rgba(18, 19, 24, 0.7)",
        gold: {
          400: "#FFD700",
          500: "#E5B800",
          600: "#B38F00",
        },
        orange: {
          500: "#FF5500",
          600: "#E04A00",
        }
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FF8800 100%)",
        "glass-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.0) 100%)",
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.25)',
        'orange-glow': '0 0 20px rgba(255, 85, 0, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;