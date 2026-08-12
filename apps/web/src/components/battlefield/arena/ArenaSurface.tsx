import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface ArenaSurfaceProps {
  /** Whose half of the arena is currently "hot" - reuses the existing turn-state read, just moved
   * here from MatchBoard's own inline gradient layers so the whole arena shell lives in one place. */
  isMyTurn: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * The physical arena shell: blackened stone base, engraved metal frame, corner filigree, rune
 * channels, a central energy seam, and the existing turn-tint gradients - all purely decorative
 * layers behind `children`, which stays the real, interactive Battlefield content. Decorative
 * density increases toward the outer edges/corners; the center stays quiet so cards remain the
 * primary focus (Battlefield Visual Foundation, Phase A).
 */
export function ArenaSurface({ isMyTurn, children, className }: ArenaSurfaceProps) {
  return (
    <div className={clsx('relative isolate', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 rounded-3xl bg-gradient-to-b from-[#0c0c11] via-[#08080b] to-[#0b0b0f]"
      />
      <div className="bg-noise-layer pointer-events-none absolute inset-0 -z-20 rounded-3xl bg-raido-vignette" />

      {/* Engraved metal frame + inner shadow depth - the board reads as a carved artifact, not a
          flat rectangle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-raido-gold/15 [box-shadow:inset_0_0_0_1px_rgba(217,180,106,0.05),inset_0_2px_18px_rgba(0,0,0,0.65),inset_0_-2px_18px_rgba(0,0,0,0.5)]"
      />

      {/* Corner filigree - decorative density concentrates at the four corners, leaving the
          center of the board clear. */}
      {[0, 90, 180, 270].map((deg) => (
        <CornerFiligree key={deg} rotate={deg} />
      ))}

      {/* Rune channel edges - thin engraved lines tracing the left/right borders. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-6 left-0 -z-10 w-px bg-gradient-to-b from-transparent via-raido-gold/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-6 right-0 -z-10 w-px bg-gradient-to-b from-transparent via-raido-gold/25 to-transparent"
      />

      {/* Central dividing energy seam - marks the boundary between the two halves, where the Arena
          Core sits. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-px -translate-y-1/2 animate-arena-breathe bg-gradient-to-r from-transparent to-transparent',
          isMyTurn ? 'via-raido-red/35' : 'via-raido-mist/25',
        )}
      />

      {/* Subtle magical cracks along the outer edges, warm/cool tinted by whose turn it is. */}
      <ArenaCracks isMyTurn={isMyTurn} />

      {/* Existing turn-state half tint, moved here unchanged from MatchBoard. */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 rounded-t-3xl transition-opacity duration-700',
          isMyTurn ? 'opacity-0' : 'bg-gradient-to-b from-sky-500/[0.05] to-transparent opacity-100',
        )}
      />
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 rounded-b-3xl transition-opacity duration-700',
          isMyTurn ? 'bg-gradient-to-t from-raido-red/[0.07] to-transparent opacity-100' : 'opacity-0',
        )}
      />

      {children}
    </div>
  );
}

function CornerFiligree({ rotate }: { rotate: number }) {
  const corners: Record<number, string> = {
    0: 'left-1 top-1',
    90: 'right-1 top-1',
    180: 'right-1 bottom-1',
    270: 'left-1 bottom-1',
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={clsx('pointer-events-none absolute -z-10 h-9 w-9 text-raido-gold/25', corners[rotate])}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 2 H16 M2 2 V16" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="2" cy="2" r="2.2" fill="currentColor" opacity="0.6" />
      <path d="M8 2 Q2 2 2 8" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

function ArenaCracks({ isMyTurn }: { isMyTurn: boolean }) {
  const stroke = isMyTurn ? 'rgba(227,18,62,0.35)' : 'rgba(138,138,151,0.28)';
  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-10 w-10 overflow-visible animate-arena-breathe"
      >
        <path d="M0 12 L14 12 L18 22 L10 34" stroke={stroke} strokeWidth="1" fill="none" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-10 w-10 overflow-visible animate-arena-breathe"
      >
        <path d="M40 -8 L24 18 L40 30" stroke={stroke} strokeWidth="1" fill="none" />
      </svg>
    </>
  );
}
