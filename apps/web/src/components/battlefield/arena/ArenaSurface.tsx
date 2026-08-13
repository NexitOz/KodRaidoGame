import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface ArenaSurfaceProps {
  /** Whose half of the arena is currently "hot" - brightens the mobile-only crimson(top)/violet
   * (bottom) side identity further; it never swaps which half gets which hue. Unused on desktop,
   * where the illustrated asset's own lighting takes over (see `.stage` in MatchBoard.module.css). */
  isMyTurn: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * The arena shell. Battlefield Art Asset pass: on desktop the illustrated `kod-raido-arena-base.webp`
 * asset (rendered by `.stage`, a descendant of `children`) is now the real physical-arena surface,
 * so none of this component's decoration renders there (`lg:hidden` throughout) - it would only
 * compete with the real artwork. Mobile doesn't use the illustrated asset (per the owner's explicit
 * "do not squash the desktop artwork into 390px" instruction), so it keeps the full CSS material
 * language from the prior round: blackened stone base, engraved dark-metal + brass frame, corner
 * filigree, rune channels, and the permanent crimson-top / violet-bottom side identity.
 */
export function ArenaSurface({ isMyTurn, children, className }: ArenaSurfaceProps) {
  return (
    <div className={clsx('relative isolate rounded-3xl lg:bg-raido-black/60', className)}>
      {/* Mobile-only physical shell - desktop gets this from the illustrated asset instead. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-40 rounded-3xl bg-gradient-to-b from-[#150a0d] via-[#0a0a10] to-[#0a0e16] lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-35 rounded-3xl opacity-90 lg:hidden"
        style={{
          backgroundImage:
            'radial-gradient(120% 60% at 50% 0%, rgba(227,18,62,0.16), transparent 65%), radial-gradient(120% 60% at 50% 100%, rgba(90,61,190,0.16), transparent 65%)',
        }}
      />
      <div className="bg-noise-layer pointer-events-none absolute inset-0 -z-30 rounded-3xl bg-raido-vignette lg:hidden" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border-2 border-raido-gold/30 [box-shadow:0_0_0_1px_rgba(0,0,0,0.8),inset_0_0_0_5px_rgba(0,0,0,0.55),inset_0_0_0_6px_rgba(217,180,106,0.12),inset_0_3px_24px_rgba(0,0,0,0.75),inset_0_-3px_24px_rgba(0,0,0,0.6)] lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] -z-10 rounded-[1.35rem] border border-raido-gold/10 lg:hidden"
      />

      {[0, 90, 180, 270].map((deg) => (
        <CornerFiligree key={deg} rotate={deg} />
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-[3px] -z-10 h-px bg-gradient-to-r from-transparent via-raido-red/40 to-transparent lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 bottom-[3px] -z-10 h-px bg-gradient-to-r from-transparent via-[#8a6fe0]/40 to-transparent lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-10 left-[3px] -z-10 w-px bg-gradient-to-b from-raido-red/30 via-raido-gold/20 to-[#8a6fe0]/30 lg:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-10 right-[3px] -z-10 w-px bg-gradient-to-b from-raido-red/30 via-raido-gold/20 to-[#8a6fe0]/30 lg:hidden"
      />

      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-6 top-1/2 -z-10 h-[3px] -translate-y-1/2 animate-arena-breathe bg-gradient-to-r from-raido-red/0 via-raido-gold/70 to-[#8a6fe0]/0 blur-[0.5px] transition-opacity duration-700 lg:hidden',
          isMyTurn ? 'opacity-100' : 'opacity-70',
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-1/2 -z-10 h-10 -translate-y-1/2 bg-gradient-to-r from-raido-red/10 via-raido-gold/15 to-[#8a6fe0]/10 blur-xl lg:hidden"
      />

      <ArenaCracks />

      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 rounded-t-3xl bg-gradient-to-b from-raido-red/[0.1] to-transparent transition-opacity duration-700 lg:hidden',
          isMyTurn ? 'opacity-60' : 'opacity-100',
        )}
      />
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 rounded-b-3xl bg-gradient-to-t from-[#5a3dbe]/[0.14] to-transparent transition-opacity duration-700 lg:hidden',
          isMyTurn ? 'opacity-100' : 'opacity-60',
        )}
      />

      {children}
    </div>
  );
}

function CornerFiligree({ rotate }: { rotate: number }) {
  const corners: Record<number, string> = {
    0: 'left-1.5 top-1.5',
    90: 'right-1.5 top-1.5',
    180: 'right-1.5 bottom-1.5',
    270: 'left-1.5 bottom-1.5',
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 56 56"
      className={clsx('pointer-events-none absolute -z-10 h-12 w-12 text-raido-gold/40 lg:hidden', corners[rotate])}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 2 H24 M2 2 V24" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M2 2 H10 M2 10 V2" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="2" cy="2" r="3" fill="currentColor" opacity="0.7" />
      <path d="M12 2 Q2 2 2 12" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M20 2 Q2 2 2 20" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
      <text x="7" y="19" fontSize="9" fill="currentColor" opacity="0.55" fontFamily="serif">
        ᚱ
      </text>
    </svg>
  );
}

function ArenaCracks() {
  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-14 w-14 overflow-visible animate-arena-breathe lg:hidden"
      >
        <path d="M0 12 L14 12 L18 22 L10 34" stroke="rgba(227,18,62,0.4)" strokeWidth="1" fill="none" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-14 w-14 overflow-visible animate-arena-breathe lg:hidden"
      >
        <path d="M40 -8 L24 18 L40 30" stroke="rgba(227,18,62,0.4)" strokeWidth="1" fill="none" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-14 w-14 overflow-visible animate-arena-breathe lg:hidden"
      >
        <path d="M0 28 L14 28 L18 18 L10 6" stroke="rgba(138,111,224,0.4)" strokeWidth="1" fill="none" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-14 w-14 overflow-visible animate-arena-breathe lg:hidden"
      >
        <path d="M40 48 L24 22 L40 10" stroke="rgba(138,111,224,0.4)" strokeWidth="1" fill="none" />
      </svg>
    </>
  );
}
