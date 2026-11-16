/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        nbr: {
          blue: '#0052CC',
          dark: '#003D99',
          yellow: '#F5B700',
          asphalt: '#111315',
          stone: '#F4F4F0',
        },
      },
    },
  },
  plugins: [],
};
