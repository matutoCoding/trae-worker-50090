/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#b9d2ff',
          300: '#8cb3ff',
          400: '#5a8eff',
          500: '#3366ff',
          600: '#1a47e6',
          700: '#0f2c59',
          800: '#0a1f40',
          900: '#061428',
          950: '#030a14',
        },
        'tech': {
          blue: '#0EA5E9',
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        }
      }
    },
  },
  plugins: [],
}
