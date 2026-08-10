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
        'pulse-legendary': 'pulse-legendary 3s ease-in-out infinite',
        'shimmer-epic': 'shimmer-epic 1.8s ease-in-out infinite',
        'ready-glow': 'ready-glow 2.6s ease-in-out infinite',
        'resonance-pulse': 'resonance-pulse 0.6s ease-out',
        'float-up': 'float-up 0.7s ease-out forwards',
        'flash-hit': 'flash-hit 0.35s ease-out',
        'shake-hit': 'shake-hit 0.3s ease-in-out',
        'turn-banner': 'turn-banner 0.8s ease-in-out forwards',
        'card-in': 'card-in 0.4s ease-out',
        'waveform-bar': 'waveform-bar 0.5s ease-in-out infinite',
        'spotlight-ring': 'spotlight-ring 1.8s ease-in-out infinite',
        'spotlight-ring-strong': 'spotlight-ring-strong 0.9s ease-in-out infinite',
      },
      keyframes: {
        'pulse-rune': {
          '0%, 100%': { opacity: '0.55', filter: 'drop-shadow(0 0 2px rgba(227,18,62,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(227,18,62,0.85))' },
        },
        'pulse-legendary': {
          '0%, 100%': { opacity: '0.65', filter: 'drop-shadow(0 0 2px rgba(217,180,106,0.35))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(217,180,106,0.8))' },
        },
        'shimmer-epic': {
          '0%, 100%': { opacity: '0.7', filter: 'drop-shadow(0 0 2px rgba(232,121,249,0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(232,121,249,0.7))' },
        },
        /* Deliberately low-amplitude/slow (2.6s, opacity 0.8→1) — spec explicitly warns
         * against an "irritating infinite flash" for ready-to-attack units. */
        'ready-glow': {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(52,211,153,0.5)', opacity: '0.85' },
          '50%': { boxShadow: '0 0 10px 1px rgba(52,211,153,0.8)', opacity: '1' },
        },
        'resonance-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.5' },
          '55%': { transform: 'scale(1.18)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.9' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-30px)', opacity: '0' },
        },
        'flash-hit': {
          '0%, 100%': { filter: 'brightness(1)' },
          '40%': { filter: 'brightness(1.9) saturate(1.3)' },
        },
        'shake-hit': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'turn-banner': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '15%': { opacity: '1', transform: 'scale(1)' },
          '80%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.02)' },
        },
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'waveform-bar': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        /* Tutorial overlay spotlight ring - a pulsing border, not the darkening itself (that's a
         * static inline box-shadow so it never fights this animation's timing). */
        'spotlight-ring': {
          '0%, 100%': { borderColor: 'rgba(217,180,106,0.55)' },
          '50%': { borderColor: 'rgba(217,180,106,0.95)' },
        },
        'spotlight-ring-strong': {
          '0%, 100%': { borderColor: 'rgba(227,18,62,0.65)', transform: 'scale(1)' },
          '50%': { borderColor: 'rgba(227,18,62,1)', transform: 'scale(1.035)' },
        },
      },
    },
  },
};
