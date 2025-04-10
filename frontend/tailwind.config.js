/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a202c',
        'bg-secondary': '#2d3748',
        'bg-tertiary': '#4a5568',
        'text-primary': '#e2e8f0',
        'text-secondary': '#a0aec0',
        'accent-primary': '#4fd1c5',
        'accent-secondary': '#63b3ed',
        'border-color': '#4a5568',
      },
    },
  },
  plugins: [],
}