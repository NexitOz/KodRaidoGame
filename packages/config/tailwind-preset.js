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
          panel: '#15151d',
          mist: '#8a8a97',
          white: '#f5f5f7',
          red: '#e3123e',
          redGlow: '#ff2d55',
          gold: '#d9b46a',
          violet: '#a978f0',
          cyan: '#5ad4e6',
        },
        /* Faction accent colors - used sparingly (card frame accent, faction badge, deck
         * emblem), never as a full-UI recolor. See docs/visual-polish-01.md. */
        faction: {
          neutral: '#8a8a97',
          shadow: '#8f1f2b',
          purification: '#e7e2d3',
          bond: '#e0a458',
          veil: '#5a3d7a',
          mystery: '#7c93a8',
          cosmic: '#4fd6e0',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '1.1rem',
        panel: '0.85rem',
      },
      boxShadow: {
        rune: '0 0 24px rgba(227, 18, 62, 0.35)',
        glow: '0 0 18px rgba(255, 45, 85, 0.45)',
        raido: '0 0 0 1px rgba(227,18,62,0.55), 0 0 30px rgba(227,18,62,0.3), inset 0 0 20px rgba(227,18,62,0.12)',
        epic: '0 0 16px rgba(169,120,240,0.35)',
        legendary: '0 0 20px rgba(217,180,106,0.4)',
        panel: '0 8px 30px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'raido-radial': 'radial-gradient(circle at top, rgba(227,18,62,0.15), transparent 60%)',
        'raido-vignette':
          'radial-gradient(circle at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        'rune-noise':
          'repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)',
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
        'rune-idle': 'rune-idle 3.4s ease-in-out infinite',
        'ring-expand': 'ring-expand 1.6s ease-out infinite',
        'dying-collapse': 'dying-collapse 0.55s ease-in forwards',
        'raido-sweep': 'raido-sweep 5s linear infinite',
        'panel-in': 'panel-in 0.3s ease-out',
        'rise-select': 'rise-select 0.18s ease-out forwards',
        'rune-reveal': 'rune-reveal 0.4s ease-out',
        'event-flash': 'event-flash 0.38s ease-out forwards',
        'level-up-ring': 'level-up-ring 0.8s ease-out forwards',
        'rune-rotate': 'rune-rotate 18s linear infinite',
        'arena-pulse': 'arena-pulse 1.1s ease-out',
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
        /* RAIDO rarity's slow etched-line pulse - deliberately quieter than pulse-rune so the
         * signature rarity reads as "always alive" rather than "always flashing". */
        'rune-idle': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.75' },
        },
        /* Legal-target / trigger ring - expands once and fades, reused for Resonance triggers,
         * targetable slots and Rune activation so the whole game shares one "this matters" motif. */
        'ring-expand': {
          '0%': { transform: 'scale(0.85)', opacity: '0.9' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'dying-collapse': {
          '0%': { transform: 'scale(1)', opacity: '1', filter: 'brightness(1)' },
          '60%': { transform: 'scale(0.92)', opacity: '0.6', filter: 'brightness(1.4) saturate(0)' },
          '100%': { transform: 'scale(0.7)', opacity: '0', filter: 'brightness(0.6) saturate(0)' },
        },
        'raido-sweep': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'panel-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'rise-select': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-6px) scale(1.03)' },
        },
        /* RUNE play reveal: hand -> short center glyph pulse -> settle. Quieter/quicker than the
         * Track waveform reveal so it reads as "placed", not "performed". */
        'rune-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '55%': { opacity: '1', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        /* EVENT play reveal: hand -> brief center reveal -> impact flash -> dissolve. Ends at
         * opacity 0 (forwards) so the element visibly dissolves rather than popping away. */
        'event-flash': {
          '0%': { opacity: '0', transform: 'scale(0.92)', filter: 'brightness(1)' },
          '30%': { opacity: '1', transform: 'scale(1.03)', filter: 'brightness(1.6)' },
          '70%': { opacity: '1', transform: 'scale(1)', filter: 'brightness(1)' },
          '100%': { opacity: '0', transform: 'scale(0.96)', filter: 'brightness(1)' },
        },
        /* Player Progression & Economy 1.0 level-up: concentric ring + red-white pulse + one
         * light sweep, single-shot and short (<=1s per spec) - a celebratory flourish, not
         * critical game info (the "УРОВЕНЬ N" text says that on its own), so it's disabled in
         * both Low Data Mode and prefers-reduced-motion like rune-reveal/event-flash below. */
        'level-up-ring': {
          '0%': { transform: 'scale(0.55)', opacity: '0', boxShadow: '0 0 0 0 rgba(227,18,62,0.65)' },
          '35%': { opacity: '1' },
          '100%': { transform: 'scale(1.7)', opacity: '0', boxShadow: '0 0 45px 14px rgba(227,18,62,0)' },
        },
        /* Battlefield Visual Target 3.0: slow continuous rotation for an active Rune socket's
         * engraved ring - a "living ritual mechanism", not a spinner (18s/rotation is far below
         * any perceptible-spin threshold). */
        'rune-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        /* Battlefield Visual Target 3.0: one-shot ring expanding from the arena center outward,
         * used by Resonance/Track activation so the whole arena feels like it reacts, not just a
         * badge in one corner. */
        'arena-pulse': {
          '0%': { transform: 'scale(0.3)', opacity: '0.65', borderWidth: '2px' },
          '100%': { transform: 'scale(1)', opacity: '0', borderWidth: '1px' },
        },
      },
    },
  },
};
