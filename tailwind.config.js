/** @type {import('tailwindcss').Config} */
export default {
  // This enables the manual dark mode switch we built in the Header
  darkMode: 'class', 
  
  // This tells Tailwind to scan all your React files and apply the colors/styles
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // We can add custom animations here to make the UI feel premium
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}