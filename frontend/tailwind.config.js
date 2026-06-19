/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          50: "#E8F3FF",
          100: "#D3E7FD",
          200: "#AED5F9",
          300: "#82BEF5",
          400: "#5AA9EF",
          500: "#2E8DE6",
          600: "#0A66C2",
          700: "#0B5A9E",
          800: "#004182",
          900: "#00264D",
        },
      },
    },
  },
  plugins: [],
};
