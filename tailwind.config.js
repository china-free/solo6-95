/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        matrix: {
          bg: "#000000",
          green: "#00ff41",
          "green-dark": "#003b00",
          "green-dim": "#008f11",
          amber: "#ffb000",
          red: "#ff4141",
          blue: "#00bfff",
        },
      },
      fontFamily: {
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "'Consolas'",
          "'Courier New'",
          "monospace",
        ],
      },
      animation: {
        "matrix-rain": "matrixRain linear infinite",
        flicker: "flicker 0.15s infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        scanline: "scanline 6s linear infinite",
        "pulse-glow": "pulseGlow 1.5s ease-in-out infinite",
      },
      keyframes: {
        matrixRain: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        glow: {
          "0%": { textShadow: "0 0 5px #00ff41, 0 0 10px #00ff41" },
          "100%": { textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px #00ff41" },
          "50%": { boxShadow: "0 0 15px #00ff41, 0 0 25px #00ff41" },
        },
      },
    },
  },
  plugins: [],
};
