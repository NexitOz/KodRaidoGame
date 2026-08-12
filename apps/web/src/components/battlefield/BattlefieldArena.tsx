import clsx from 'clsx';

/**
 * Battlefield Visual Target 3.0 (structure) + 3.2 (atmosphere) + 3.3 (final art-direction
 * richness pass): a layered ritual-arena backdrop built entirely from CSS gradients/borders - no
 * raster mockup embedded, no baked card positions, so it stays correct for any deck/cards. Purely
 * decorative (`aria-hidden`, `pointer-events-none`), painted behind the real interactive board
 * content via `-z-10`, so it never changes hit-testing, DOM structure, or any
 * `data-tutorial-target`/aria-label the e2e suite or tutorial spotlight depend on.
 *
 * Structure, back to front: dark stone/metal base -> environmental pillar silhouettes -> volumetric
 * fog blobs -> a top-down key light that slowly breathes -> a strengthened center "heart" glow (the
 * Resonance zone sits at this same 42%-top point in MatchBoard) -> stone-floor grain -> three
 * rim-lit concentric engraved rings -> radial engraved cuts -> a ring of Raido rune glyphs ->
 * desktop-only runic energy paths radiating from the center -> drifting ember motes -> the
 * Resonance/Track reaction ring -> the existing vignette token -> a desktop-only outer chamber
 * frame with corner brackets, so the rectangle around the circular arena reads as a designed
 * chamber rather than empty margin.
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

/** Five asymmetric spokes (not evenly spaced with the rune ring) reading as energy conduits
 * connecting the center to the rest of the board - a desktop-only enrichment (section: "reduce
 * the feeling of empty black space on desktop") kept off mobile to stay compact/readable. */
const ENERGY_PATH_ANGLES = [24, 82, 158, 214, 296];

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

      {/* Volumetric fog - two large soft, static color blobs (dark violet/crimson) for a dark-
          fantasy atmosphere, deliberately unanimated to stay cheap on every device. */}
      <div
        className="absolute -left-[10%] top-[8%] aspect-square w-[55%] rounded-full opacity-[0.10] blur-3xl"
        style={{ backgroundColor: '#5a3d7a' }}
      />
      <div
        className="absolute -right-[12%] bottom-[4%] aspect-square w-[60%] rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: '#8f1f2b' }}
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

      {/* The arena's "heart" - a stronger, warmer glow anchored at the same point the Resonance
          centerpiece sits at in MatchBoard, so that zone reads as the visual/energetic center of
          the whole board rather than one badge among several. */}
      <div
        className="animate-arena-breathe absolute left-1/2 top-[42%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(227,18,62,0.16), transparent 70%)',
        }}
      />

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

      {/* Runic energy paths - thin conduits radiating from the center "heart" outward, reading as
          the arena's own circuitry connecting Resonance to the rest of the board. Desktop-only:
          on mobile they'd add visual noise to an already-compact layout for little payoff. */}
      <div className="hidden lg:block">
        {ENERGY_PATH_ANGLES.map((deg) => (
          <div
            key={deg}
            className="animate-pulse-rune absolute left-1/2 top-[42%] h-[2px] w-[46%] origin-left opacity-[0.4]"
            style={{
              transform: `rotate(${deg}deg)`,
              backgroundImage:
                'linear-gradient(to right, rgba(217,180,106,0.95), rgba(217,180,106,0.35) 40%, transparent 82%)',
              boxShadow: '0 0 4px 0.5px rgba(217,180,106,0.35)',
            }}
          />
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

      {/* Outer chamber frame - a hairline border plus corner brackets around the whole board
          rectangle (not just the circular arena), desktop-only, so the rectangle itself reads as
          a designed chamber edge instead of leftover empty margin around a circle. */}
      <div className="hidden lg:block">
        <div className="absolute inset-2 rounded-[inherit] border border-raido-gold/[0.07]" />
        <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-raido-gold/20" />
        <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-raido-gold/20" />
        <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-raido-gold/20" />
        <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-raido-gold/20" />
      </div>
    </div>
  );
}
