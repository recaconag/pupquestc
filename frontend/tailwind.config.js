import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/dist/esm/**/*.mjs"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        red: {
          600: "#990000",
          700: "#800000", // Official PUP Maroon
          800: "#660000",
          900: "#4d0000",
        },
        // Ina-assign ang PUP Gold sa standard yellow scale
        yellow: {
          400: "#facc15",
          500: "#eab308", // Official PUP Gold
          600: "#ca8a04",
        },
        // Custom brand utility for specific semantic use
        brand: {
          maroon: "#800000",
          gold: "#eab308",
          dark: "#0a0a0a",
          surface: "#171717",
          border: "#262626",
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gold-pulse': 'goldPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 4px rgba(234,179,8,0.3), inset 3px 0 8px rgba(234,179,8,0.06)' },
          '50%':       { boxShadow: '0 0 12px rgba(234,179,8,0.5), inset 3px 0 16px rgba(234,179,8,0.12)' },
        },
      },
    },
  },
  plugins: [flowbiteReact],
}
