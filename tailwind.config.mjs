/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          // Logo navy — used for header/footer surfaces and dark CTAs.
          navy: {
            DEFAULT: "#0B1A2E",
            900: "#0B1A2E",
            950: "#06121F",
          },
          // Logo lime — primary accent. Always pair with `text-brand-navy`
          // for high-impact CTAs (lime is too luminous for white text).
          lime: {
            DEFAULT: "#9DEF3F",
            300: "#C4F578",
            400: "#9DEF3F",
            500: "#7BD11A",
            600: "#5FAB10",
            700: "#4A8410",
          },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.21, 0.61, 0.35, 1) both",
        "fade-in": "fadeIn 0.8s cubic-bezier(0.21, 0.61, 0.35, 1) both",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.21, 0.61, 0.35, 1) both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
