/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          50: "#EEEDFE",
          100: "#CECBF6",
          500: "#7F77DD",
          600: "#534AB7",
          800: "#3C3489",
          900: "#26215C",
        },
      },
    },
  },
  plugins: [],
};
