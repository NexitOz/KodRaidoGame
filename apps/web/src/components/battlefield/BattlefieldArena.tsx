import clsx from 'clsx';

/**
 * Battlefield Visual Target 3.0: a layered ritual-arena backdrop built entirely from CSS
 * gradients/borders/an inline SVG rune ring - no raster mockup embedded, no baked card
 * positions, so it stays correct for any deck/cards. Purely decorative (`aria-hidden`,
 * `pointer-events-none`), painted behind the real interactive board content via `-z-10`, so it
 * never changes hit-testing, DOM structure, or any `data-tutorial-target`/aria-label the e2e
 * suite or tutorial spotlight depend on.
 *
 * Structure, outside in: dark stone/metal base -> soft center lighting -> three concentric
 * engraved rings (gold outer / crimson mid / faint inner) -> a ring of restrained Raido rune
 * glyphs -> radial engraved cuts (repeating-conic-gradient) -> the existing vignette token.
 */
export interface BattlefieldArenaProps {
  className?: string;
  /** Increment to replay a board-wide reaction ring (Resonance/Track activation, section 11/12). */
  pulseKey?: number;
}

export function BattlefieldArena({ className, pulseKey = 0 }: BattlefieldArenaProps) {
  const runeAngles = Array.from({ length: 10 }, (_, i) => (360 / 10) * i);

  return (
    <div
      aria-hidden
      className={clsx('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-raido-steel via-raido-graphite to-raido-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(227,18,62,0.10),transparent_55%)]" />

      <div className="absolute left-1/2 top-[42%] aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-raido-gold/[0.12]" />
      <div className="absolute left-1/2 top-[42%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-raido-red/[0.14]" />
      <div className="absolute left-1/2 top-[42%] aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />

      {/* Radial engraved cuts - a repeating conic gradient reads as fine machined lines at this
          opacity, not a visible pie-chart pattern. */}
      <div
        className="absolute left-1/2 top-[42%] aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-conic-gradient(from 0deg, rgba(217,180,106,0.9) 0deg 0.6deg, transparent 0.6deg 18deg)',
        }}
      />

      {/* Raido rune language - a sparse ring of the same glyph used across the rest of the UI
          (nav logo, empty creature slot), not a new symbol set. */}
      <div className="absolute left-1/2 top-[42%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2">
        {runeAngles.map((deg) => (
          <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
            <span
              className="absolute left-1/2 top-0 text-[11px] text-raido-gold/[0.18]"
              style={{ transform: `translate(-50%, -50%) rotate(${-deg}deg)` }}
            >
              ᚱ
            </span>
          </div>
        ))}
      </div>

      {/* Resonance/Track reaction: a single expanding ring travels from the arena's center lighting
          out toward its edge, reusing the same gold engraved language as the rings above instead
          of a new VFX system. Remounts (via the `key`) each time `pulseKey` changes so repeated
          activations keep replaying it. */}
      {pulseKey > 0 ? (
        <div
          key={pulseKey}
          className="absolute left-1/2 top-[42%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-raido-gold/50 animate-arena-pulse"
        />
      ) : null}

      <div className="bg-raido-vignette absolute inset-0" />
    </div>
  );
}
