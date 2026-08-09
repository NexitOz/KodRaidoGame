/** Shared Tailwind design tokens for the Kod Raido brand. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        raido: {
          black: '#07070a',
          graphite: '#121218',
          steel: '#1c1c24',
          mist: '#8a8a97',
          white: '#f5f5f7',
          red: '#e3123e',
          redGlow: '#ff2d55',
          gold: '#d9b46a',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        rune: '0 0 24px rgba(227, 18, 62, 0.35)',
        glow: '0 0 18px rgba(255, 45, 85, 0.45)',
      },
      backgroundImage: {
        'raido-radial': 'radial-gradient(circle at top, rgba(227,18,62,0.15), transparent 60%)',
      },
      animation: {
        'pulse-rune': 'pulse-rune 2.4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-rune': {
          '0%, 100%': { opacity: '0.55', filter: 'drop-shadow(0 0 2px rgba(227,18,62,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(227,18,62,0.85))' },
        },
      },
    },
  },
};
