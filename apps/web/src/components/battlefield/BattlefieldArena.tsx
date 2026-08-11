import clsx from 'clsx';

/**
 * Battlefield Visual Target 3.0 (structure) + 3.2 (atmosphere pass): a layered ritual-arena
 * backdrop built entirely from CSS gradients/borders/an inline rune ring - no raster mockup
 * embedded, no baked card positions, so it stays correct for any deck/cards. Purely decorative
 * (`aria-hidden`, `pointer-events-none`), painted behind the real interactive board content via
 * `-z-10`, so it never changes hit-testing, DOM structure, or any `data-tutorial-target`/
 * aria-label the e2e suite or tutorial spotlight depend on.
 *
 * Structure, back to front: dark stone/metal base -> faint environmental pillar silhouettes ->
 * a top-down key light that slowly breathes -> center resonance-red glow -> stone-floor grain ->
 * three rim-lit concentric engraved rings (gold outer / crimson mid / faint inner) -> radial
 * engraved cuts -> a ring of restrained Raido rune glyphs -> drifting ember motes -> the
 * Resonance/Track reaction ring -> the existing vignette token.
 */
export interface BattlefieldArenaProps {
  className?: string;
  /** Increment to replay a board-wide reaction ring (Resonance/Track activation, section 11/12). */
  pulseKey?: number;
}

const EMBER_MOTES = [
  { left: '18%', delay: '0s', size: 3 },
  { left: '32%', delay: '2.1s', size: 2 },
  { left: '52%', delay: '4.4s', size: 3 },
  { left: '68%', delay: '1.2s', size: 2 },
  { left: '81%', delay: '3.3s', size: 3 },
];

export function BattlefieldArena({ className, pulseKey = 0 }: BattlefieldArenaProps) {
  const runeAngles = Array.from({ length: 10 }, (_, i) => (360 / 10) * i);

  return (
    <div
      aria-hidden
      className={clsx('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-raido-steel via-raido-graphite to-raido-black" />

      {/* Environmental storytelling: two faint dark pillar silhouettes beyond the ring's edge -
          just enough to suggest the arena sits inside a real structure, not floating in a void.
          No literal architecture (no art assets to draw it with), pure soft gradient shapes. */}
      <div
        className="absolute inset-y-0 left-0 w-[14%] opacity-60"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.55), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[14%] opacity-60"
        style={{ backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.55), transparent)' }}
      />

      {/* Key light - a soft top-down source the whole arena reads as lit by, breathing slowly
          like a distant torch/enchantment rather than a flat, shadowless render. */}
      <div
        className="animate-arena-breathe absolute inset-x-0 top-0 h-2/3"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% -10%, rgba(245,245,247,0.09), transparent 60%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(227,18,62,0.10),transparent_55%)]" />

      {/* Stone-floor material grain - the shared rune-noise texture already used elsewhere in the
          app, here reading as worn engraved stone rather than a flat color fill. */}
      <div className="bg-rune-noise absolute inset-0 opacity-[0.15]" />

      {/* Concentric rings, each with a faint top highlight / bottom shadow inset so they read as
          carved/embossed metal catching the key light above instead of flat outlines. */}
      <div
        className="absolute left-1/2 top-[42%] aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-raido-gold/[0.12]"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
      />
      <div
        className="absolute left-1/2 top-[42%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-raido-red/[0.14]"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute left-1/2 top-[42%] aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
      />

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

      {/* Mystical resonance atmosphere: a handful of ember/magic motes drifting up from the arena
          floor and fading - the "living enchantment" cue at rest, independent of any actual
          Resonance trigger (which still gets its own explicit reaction ring below). */}
      {EMBER_MOTES.map((ember, i) => (
        <span
          key={i}
          className="animate-ember-drift absolute bottom-[8%] rounded-full bg-raido-red/70"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            animationDelay: ember.delay,
            boxShadow: '0 0 6px 1px rgba(227,18,62,0.5)',
          }}
        />
      ))}

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
      {/* Deeper cinematic corner falloff on top of the shared vignette token, for more contrast
          at the arena's far edges without darkening the readable center where cards live. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
