import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keep rage as legacy for backwards compatibility
        rage: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51d1d',
          700: '#c11414',
          800: '#a01414',
          900: '#841818',
          950: '#480707',
        },
        // Theme-aware colors via CSS variables
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
          DEFAULT: 'var(--primary-500)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        muted: {
          DEFAULT: 'var(--text-muted)',
          foreground: 'var(--text-secondary)',
        },
        glow: 'var(--glow)',
      },
      textColor: {
        theme: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
      backgroundColor: {
        theme: {
          surface: 'var(--surface)',
          'surface-hover': 'var(--surface-hover)',
        },
      },
      borderColor: {
        theme: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      boxShadow: {
        glow: '0 0 var(--glow-intensity) var(--glow)',
        'glow-lg':
          '0 0 calc(var(--glow-intensity) * 2) var(--glow), 0 0 calc(var(--glow-intensity) * 3) var(--glow)',
        'glow-xl':
          '0 0 calc(var(--glow-intensity) * 2) var(--glow), 0 0 calc(var(--glow-intensity) * 4) var(--glow), 0 0 calc(var(--glow-intensity) * 6) var(--glow)',
        neon: '0 0 5px var(--glow), 0 0 10px var(--glow), 0 0 20px var(--glow), 0 0 40px var(--glow)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'shake-infinite': 'shake 0.5s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        wobble: 'wobble 1s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        flicker: 'flicker 0.15s infinite alternate',
        'hue-rotate': 'hue-rotate 3s linear infinite',
        glitch: 'glitch 0.3s infinite',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px var(--glow), 0 0 10px var(--glow)',
          },
          '50%': {
            boxShadow:
              '0 0 20px var(--glow), 0 0 40px var(--glow), 0 0 60px var(--glow)',
          },
        },
        flicker: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.8' },
        },
        'hue-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        comic: ['Comic Sans MS', 'cursive'],
        impact: ['Impact', 'Haettenschweiler', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
