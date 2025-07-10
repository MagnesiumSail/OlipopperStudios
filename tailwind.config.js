// === FILE: tailwind.config.js ===
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // include all your src files for JIT mode
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add your custom variable font
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
