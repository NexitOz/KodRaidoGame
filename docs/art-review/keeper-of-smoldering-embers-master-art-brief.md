# Keeper of Smoldering Embers — master-art polish brief

Status: **art direction only.** No production `artworkUrl`, `rightsStatus`, seed data, database,
gameplay, rarity, stats, faction or balance value is touched by this document. It exists so the
next generation pass produces a candidate that can actually be approved, instead of a fourth
variation on the same SHADOW silhouette.

> The approved concept is now recorded in
> [`keeper-of-smoldering-embers-concept-lock.md`](./keeper-of-smoldering-embers-concept-lock.md),
> which is the canonical statement of what must be preserved. This brief remains the generation-side
> detail: prompt, negative prompt, and the crop maths behind those constraints.

## What this brief is based on

The owner has an approved-direction variant of the Keeper outside the repository: a heavy dark
guardian in massive armour with glowing cracks, a closed helm, a polearm/halberd, against gothic
cathedral ruins with ash and fire. That description is the master reference this brief polishes.

**The image itself is not in the repository.** The only committed candidate transport
(`assets/keeper-of-smoldering-embers-candidate-source`) is still truncated and still decodes to a
blank grey frame — see `keeper-of-smoldering-embers.md` in this directory. Nothing below was
derived from viewing a Keeper image; it is derived from the owner's written description plus a
direct audit of the three already-approved SHADOW illustrations in the repository.

## Why differentiation is the whole problem — SHADOW family audit

The three approved SHADOW cards were opened and compared. They converge hard:

| Card | Face | Build / pose | Weapon | Cloth | Emissive accent |
| --- | --- | --- | --- | --- | --- |
| `necromancer-of-the-twilight-order` | bare, visible, long loose hair | tall, slim, standing but gesturing | thin curved blade, low | many thin fluttering tatters | magenta / crimson |
| `ashen-blade` | bare, visible, wild hair | slim, dynamic lunging diagonal | curved sabre, glowing edge | many thin fluttering tatters | magenta / crimson |
| `whisper-of-the-forgotten` | pale mask with visible features | tall, narrow, drifting | none | many thin fluttering tatters | crimson / pink |

Every one of them is: **cool violet-magenta light, thin flowing silk-like rags, a readable face,
and a narrow vertical figure in gothic ruins.** `ashen-blade` in particular already owns the
agile-duelist role completely.

So "make the Keeper less like a Shadow" is not a mood note — it is a set of concrete inversions.
Four axes carry almost all of the differentiation:

1. **Light temperature.** Family = cool magenta/violet. Keeper = warm amber-orange ember, and
   nothing else emissive. This is the single strongest lever and it works even in a thumbnail.
2. **Mass.** Family = thin figure + many small fluttering shapes. Keeper = solid armoured volume +
   few large heavy shapes that do not move.
3. **Face.** Family = face or mask readable. Keeper = fully closed helm, no skin, no eyes.
4. **Motion.** Family = mid-action, diagonal, wind. Keeper = planted, static, vertical, weight-bearing.

**Calibration, deliberately:** keep the near-black/charcoal base and the gothic-ruin setting. Those
are what make the card read as SHADOW and as the same world. Shift only the *emissive accent* from
magenta-pink to ember amber. Changing base palette and setting as well would break faction
cohesion — the goal is a different character in the same world, not a different world.

## Locked — do not redesign

These come from the owner's approved direction and are invariants, not suggestions:

1. Heavy-guardian archetype, never a fast assassin.
2. Massive, monumental silhouette.
3. Closed helm, hidden face.
4. Heavy armour on a charred-metal theme.
5. Glowing cracks / embers / internal heat inside the armour.
6. Polearm / halberd as a key silhouette element.
7. Grim gothic background: ruins, cathedral, ash, cinders, smouldering glow.
8. Atmosphere: dark fantasy, cinematic, realistic, grim, infernal, ash-and-ember guardian.

## To strengthen — concrete translations

**Ancient.** Pitted, layered, repaired plate; ash packed into every seam and recess; a mantle that
hangs with real weight; the halberd butt worn where it has been planted in the same spot for a very
long time. Age is communicated by accumulation and wear, not by decoration.

**Ashen / smouldering.** Cracks should read as cooling lava through slag: wide, deep, dimmed
amber-orange, brightest inside the torso and shoulder recesses where the heat is trapped, faintest
at the extremities. Slow upward sparks, falling ash, a low smoke pool around the greaves. The read
is *a fire that is nearly out but has not gone out* — not a burning knight. Keep the glow area
small in total coverage and high in local contrast; a large area of bright orange destroys both the
dying-ember idea and the SHADOW mood.

**Silhouette uniqueness.** The figure must be identifiable filled solid black. Four shapes carry it:
the helm profile (give it one distinctive asymmetry — a crest, a broken horn-line, a heavy brow
ridge), the pauldron mass (wide, squared, clearly wider than the hips), the mantle (few large
weighty folds, tattered hem, no fluttering streamers), and the halberd head (a distinct, blocky,
readable shape — not a generic axe blade).

**Order identity.** A branded sigil of an ashen order on the breastplate and repeated faintly in the
stone at his feet; chain, seal, or oath-band motifs on the haft. Keep it as branding and wear, never
as heraldic clutter.

## Pose

Planted sentinel: standing still, weight down, halberd held vertically and grounded butt-first into
broken flagstones, both gauntlets on the haft. This one choice does most of the work of separating
him from `ashen-blade`'s lunge.

## Composition must survive the real crops

The master is 2:3 (1024×1536). Every review surface crops it narrower with a centred `object-cover`,
so vertical area is lost. Measured against `apps/web/src/app/admin/art-review/page.tsx`:

| Surface | Ratio | Visible height at 1024 px | Trim |
| --- | --- | ---: | ---: |
| CardView / CreatureSlot | 3:4 | 1365 px | ~85 top + ~86 bottom |
| Hand preview | 7:9 | 1317 px | ~109 top + ~110 bottom |
| Card detail | 4:5 | 1280 px | ~128 top + ~128 bottom |

Practical constraints that follow:

- **Safe band is rows 128–1408.** Helm, pauldrons, sigil and halberd head must all sit inside it.
- **Do not put the halberd head in the top 128 px.** A vertically held polearm reaching the top edge
  loses its tip in the detail crop. Bring the head down so it overlaps the helm/shoulder zone —
  which also strengthens the silhouette by clustering the identifying shapes.
- **Do not rely on the bottom 128 px.** Boots and the smoke pool get cut; keep the base of the figure
  above it.
- **Scale the cracks for the smallest surface.** `CreatureSlot` renders about 160 px wide, roughly
  0.16× the master. A crack under ~25 px wide in the master collapses to a sub-pixel smudge there.
  Fewer, wider, higher-contrast cracks beat fine filigree.

## Echo-Shadow

The card summons Эхо-Тень 1/1, and the acceptance criteria require that echo to be present but
clearly secondary. Place it small, low, behind or beside the Keeper, in cool desaturated grey with
no ember glow of its own — the warm/cool split keeps the hierarchy unambiguous even at thumbnail
size. It must never break the Keeper's outer silhouette.

## Prohibited

- Any read as another Shadow variant: slim, agile, elegant, assassin-like, mid-lunge.
- Bare face, visible eyes, loose flowing hair.
- Magenta, pink, violet or neon light anywhere.
- Generic demon, devil, horns, skull-face, wings.
- Bright open flame, bonfire, fire elemental, "flaming knight". Embers and heat only.
- Generic dark knight with no ashen-order identity.
- Radical redesign of the approved base concept.
- Baked-in card frame, text, logo, stats, borders or UI of any kind.

## Generation prompt

Positive:

```
Vertical 2:3 dark fantasy key art, cinematic realistic painted illustration, premium collectible
card game quality.

An ancient towering guardian in massive blackened plate armour stands motionless and planted,
filling the frame with a broad monumental silhouette: heavy squared pauldrons far wider than the
hips, thick gorget, deep layered plates pitted with age and packed with grey ash. His face is
completely hidden behind a closed featureless helm with a heavy brow ridge and one broken crest
line: no skin, no eyes, only a narrow slit leaking dull amber heat.

Wide molten cracks run through the charred metal like cooling lava through slag, deep amber-orange
embers glowing from inside the armour, brightest in the torso and shoulder recesses and faintest at
the hands and feet, smouldering rather than burning. Falling ash, slow orange sparks drifting
upward, a low pool of smoke around the greaves.

He holds a long two-handed ember-forged halberd vertically, planted butt-first into broken
flagstones, both gauntlets resting on the haft, the pose of a sentinel keeping an ancient vow, not
a fighter mid-strike. The halberd head is blocky and distinctive and sits low, level with his helm
and shoulders. A heavy ash-caked mantle hangs straight down in a few large weighty folds, tattered
at the hem, not fluttering. An ember-orange branded sigil of an old ashen order marks his
breastplate and is repeated faintly in the stone at his feet.

Behind him a ruined gothic cathedral: shattered arches, collapsed vaulting, a burnt rose window,
drifting ash. Far behind and to one side, small and low, a faint cool grey shadow-echo figure,
clearly secondary, with no glow of its own.

Palette: near-black, charcoal and cold stone grey, with deep ember amber-orange as the only
emissive accent. Grim, solemn, infernal, monumental. Volumetric light, cinematic contrast, fine
material detail on scorched metal. No text, no logo, no UI, no card frame.
```

Negative:

```
agile assassin, rogue, duelist, lunging pose, crouching, running, dynamic action, slim athletic
build, narrow shoulders, exposed face, visible eyes, flowing hair, thin wispy fluttering rags, silk
streamers, curved sword, sabre, katana, dual wielding, magenta glow, pink glow, violet lighting,
purple lighting, neon, bright open flame, bonfire, fire elemental, flaming knight, generic dark
knight, demon, devil, horns, skull face, wings, chibi, cel shading, flat plastic skin, text,
watermark, signature, logo, card frame, UI, stats, border
```

## Russian creative description (owner's wording, kept verbatim)

> Хранитель Тлеющих Углей — древний мрачный страж в массивной обугленной броне с раскалёнными
> трещинами, скрытым шлемом и тяжёлой алебардой. Он выглядит как безмолвный хранитель руин и клятвы,
> внутри которого всё ещё тлеет древний огонь. Его образ должен быть монументальным, тяжёлым,
> зловещим и кинематографичным, с пеплом, искрами, готическими руинами и атмосферой угасающего, но
> не умершего пламени.

## Acceptance checklist for the next candidate

Three theses must read at a glance: **he is ancient**, **he is ashen/smouldering**, **he is a
guardian/punisher**. Then:

- [ ] Fill the figure solid black — still identifiable, and not confusable with `ashen-blade`.
- [ ] Reads as a heavy elite ember guardian, not a fast SHADOW assassin.
- [ ] Ceremonial and planted rather than nimble.
- [ ] Helm fully closed; no face, no eyes, no loose hair.
- [ ] Ember cracks still readable in `CreatureSlot` at ~160 px.
- [ ] Halberd still readable, and its head survives the 4:5 crop.
- [ ] No magenta/violet anywhere; amber is the only emissive accent.
- [ ] Echo-Shadow present, small, cool, secondary, outside the main silhouette.
- [ ] Raw 2:3 / CardView 3:4 / Card detail 4:5 / Hand preview 7:9 / CreatureSlot 3:4 all PASS.

## Delivery format and transport

- Vertical 2:3, 1024×1536, `.webp`, clean illustration — no frame, text, logo, stats or UI baked in
  (`docs/art-bible-01.md`, "Reference vs. production-format note").
- Review locally by dropping the file at
  `apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp` (gitignored) and opening
  `/admin/art-review`. The Keeper row is already registered — no code change is needed.
- **If the file is transported as chunked base64 again, verify before opening a review:** the
  reassembled byte count must equal the WebP RIFF-declared length, and `sha256sum` must match the
  recorded hash. Skipping that check is exactly how the previous candidate shipped 1,324 bytes short
  and decoded to a blank grey frame.
- Promotion to production (`artworkUrl`, `rightsStatus: 'owned'`) remains a separate, explicit step
  that happens only after owner approval.
