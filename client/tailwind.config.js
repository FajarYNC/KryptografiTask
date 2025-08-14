/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#0f1115",
        accent: "#6366f1",
        "accent-soft": "#818cf8",
      },
    },
  },
  plugins: [],
};
