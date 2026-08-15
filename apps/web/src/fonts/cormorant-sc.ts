import localFont from 'next/font/local';

/**
 * Self-hosted (no external runtime request) - files committed under this same directory.
 * Used only by EndTurnArtifact's desktop label, per the Battlefield Art Pass typography
 * requirement (artistic Cyrillic small-caps, not a plain bold sans-serif).
 */
export const cormorantSC = localFont({
  src: [
    { path: './CormorantSC-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './CormorantSC-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
});
