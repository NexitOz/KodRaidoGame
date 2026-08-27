# Seal of the Curse — master-art brief (PURIFICATION, Art Pack 03 Card 02)

Status: **art direction only.** No image has been generated. This document changes no `artworkUrl`,
no `rightsStatus`, no seed data, no schema, no gameplay value, no artwork file, no
`/admin/art-review` code, no Battlefield UI, and no sync script or workflow.

Derived from the repository, not from memory: the `seal-of-the-curse` seed entry, the CURSE
semantics in the engine, `docs/art-bible-01.md`, `docs/art-pack-03.md`, the approved Card 01 brief,
`docs/content-pack-01.md`, and the owner's Card 02 transition report.

## 1. Card and gameplay summary

| Field                      | Value                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `slug`                     | `seal-of-the-curse`                                                                                     |
| `name`                     | Печать Проклятия                                                                                        |
| `type` / `rarity` / `cost` | EVENT / RARE / 2                                                                                        |
| `tags`                     | `['Purification']`                                                                                      |
| `abilityText`              | Наложите Проклятие на выбранного вражеского персонажа — он не может атаковать, пока Проклятие не снято. |
| `effectJson`               | `ON_PLAY` → `ADD_STATUS` / `ENEMY_CHOSEN` / `CURSE`                                                     |
| Resonance                  | visual only                                                                                             |

**What CURSE actually does, verified in the engine:** `apply-action.ts` rejects an attack from a
cursed unit with _"This unit is cursed and cannot attack."_ CURSE is one of the two
`NEGATIVE_STATUSES` that a cleanse removes. So mechanically this card **does not damage, weaken or
corrupt** anything. It **stops an attack**. The art must say exactly that and nothing more.

### The interpretive decision this card turns on

PURIFICATION applying a "curse" looks, at first glance, like a contradiction — and the usual fantasy
coding for a curse is crimson or violet, which are precisely the two colors this faction forbids
because they read as SHADOW and VEIL.

**Resolve it by reading the Curse as a binding, not a taint.** This is a _seal_: the Order locks a
weapon so it cannot be raised. It is jailer's work, not sorcery. Nothing is corrupted, poisoned,
withered or blackened. That reading keeps the card inside PURIFICATION's locked language — white,
silver, rigid, engraved, material-bound — and it is the only reading that does.

Any candidate that renders the curse as corruption (dark tendrils, spreading rot, purple aura,
crimson veins) has failed the concept, not merely the palette.

## 2. Visual thesis

**A raised weapon stops dead because a white rune seal has clamped shut around the hand that holds
it.**

One sentence, one read. If a viewer cannot get that from the thumbnail, the image is wrong.

## 3. Focal hierarchy

This is an EVENT, not a portrait, so the hierarchy must be defined explicitly rather than inherited
from a face.

1. **Primary — the seal.** The white/silver restraint locked around the weapon hand and guard. It is
   the brightest object, holds the highest local contrast, sits closest to frame center, and carries
   the only emissive light in the image. At 92 px it must still be the first thing the eye lands on.
2. **Secondary — the halted weapon and forearm.** Dark charcoal steel, clearly mid-swing and clearly
   stopped. Reads as a shape and a direction, not as a character. Its job is to give the seal
   something to be locked _onto_ and to supply the arrested motion.
3. **Tertiary — the environment.** Pale, shallow, low-detail, deliberately uninformative. It exists
   to isolate the seal, and it is expected to dissolve entirely at thumbnail size.

**Contrast budget:** the seal-to-weapon boundary is the highest-contrast edge in the frame. Nothing
in the background may approach it.

## 4. Scene and action staging

- **Moment:** the instant _after_ the stop. Not the wind-up, not the strike — the frozen beat where
  the swing has been arrested and the weapon is going no further.
- **Camera:** close and iconic. A tight three-quarter view on the weapon hand, guard and the first
  third of the blade, with the forearm running out of frame. Roughly the framing of a hand-and-hilt
  study, not a figure.
- **Weapon angle:** the blade enters from the upper portion of the frame on a diagonal, arrested. A
  diagonal reads as interrupted motion; a vertical would read as a weapon at rest and kill the
  story.
- **Arrested-motion cues, in order of preference:** a faint directional blur on the outer blade tip
  only, while the seal and hand stay razor-sharp; a light scatter of frost motes still drifting
  along the swing's former path; the fingers visibly strained against the closed restraint. Use one
  or two of these, not all three.
- **What is absent:** no caster, no second figure, no open palm, no summoning gesture. The seal is
  already closed when we arrive. PURIFICATION's magic is material-bound, so the object does the
  work and nobody needs to be shown performing it.
- **The weapon must be visibly unable to continue.** If the composition would still read as "a
  warrior holding a sword" once the glow is removed, the staging has failed.

## 5. Seal object and material design

The hero object. It must read as **manufactured and rigid** — engineered restraint hardware, not
conjured energy.

- **Form:** a hinged, close-fitting white-stone-and-silver clamp that has closed around the weapon
  hand and cross-guard together, binding hand to hilt so neither can release. A visible hinge on one
  side and a solid locking block on the other sell it as a mechanism.
- **Silhouette:** a compact, chunky, roughly rectangular mass, deliberately heavier and blockier than
  anything the hand could wear as armour. It must not be mistakable for a gauntlet, a bracer or a
  vambrace — this is a thing that has been _applied_ to the wearer.
- **Material:** pale marble or bone-white stone with polished silver banding at the edges and the
  hinge. Matte-to-satin finish, never mirror-polished — mirror polish is the Legendary flagship's
  register.
- **Engraving:** geometric rune lines cut _into_ the stone, following the clamp's own geometry
  rather than floating over it. Angular, ordered, closed forms — the visual language of a lock. No
  organic or calligraphic script.
- **Fit:** tight and unforgiving, with the stone visibly compressing the glove leather at its edges.
  Small deformations like that are what make a restraint read as real rather than symbolic.
- **Condition:** pristine and newly closed. No wear, no chips, no cracks, no rust.
- **Scale:** large enough that at 92 px it survives as a distinct pale block against the dark arm.
  Roughly the size of the hand it encloses, plus a third.

## 6. Enemy arm and weapon — keeping it faction-neutral

The victim must belong to no faction, so the card never looks like it is about a specific enemy.

- **Armour:** plain dark charcoal steel, unadorned. No insignia, no crest, no heraldry, no etched
  pattern, no coloured accent, no cloth.
- **Weapon:** a generic straight cruciform blade or a plain arming sword. No distinguishing
  silhouette, no exotic geometry, no rune of its own.
- **Hand:** an armoured glove of the same charcoal steel over dark leather. Fingers may be strained
  or partly clenched. Anatomy must be correct — this is the one place in the image where anatomy can
  fail visibly.
- **Forbidden identity cues:** no crimson or ember (SHADOW), no violet or magenta (VEIL), no
  translucency or spectral edge (SHADOW's echo device), no gold (PURIFICATION's own), no organic or
  floral motif (BOND), no starfield or cosmic sheen (COSMIC), no mist or grey drift (MYSTERY).

**The crucial lighting caveat.** The arm is dark by _material_, never by _lighting_. It sits in the
same bright diffuse light as everything else, so it renders as a clearly-lit dark grey object with
visible form and highlights. It must never become a black silhouette or sink into shadow — that
would import SHADOW's chiaroscuro through the back door and break the faction read. Keep the
darkest value on the arm at a solid mid-dark grey, not black.

## 7. Environment

- **Setting:** a shallow, pale, near-abstract space. A plain white-stone surface or wall a short
  distance behind the action, falling off immediately into soft pale haze.
- **Depth:** very shallow. The background is out of focus and carries almost no information.
- **Optional single cue:** one faint straight engraved line or a suggestion of a stone edge, unlit,
  to place the scene inside the Order's architecture without describing it.
- **Explicitly absent:** no cathedral facade, no rose window, no halo, no spires, no banners, no
  staircase, no floor rune-circle, no crowd, no ranked figures, no landscape, no sky. Every one of
  those belongs to the Legendary flagship or to a character card.

The background's only job is to make the seal unmissable.

## 8. Lighting and value structure

- **Key:** bright, diffuse, near-shadowless ambient light from front-and-above — the locked faction
  lighting, unchanged.
- **Overall key:** high. Most of the frame lives in the upper value range; the dark arm is the
  deliberate exception and occupies a minority of the canvas.
- **Darkest value:** a solid mid-dark grey on the arm. **Not black.** No deep cast shadows anywhere.
- **Emissive:** the engraved rune lines inside the seal are the _only_ light-emitting element. They
  spill a faint cold blue-white onto the immediately surrounding stone and the nearest steel, and
  nowhere else.
- **Rim light:** a gentle cool rim along the top of the seal and blade is acceptable for separation.
  Keep it subtle; strong backlight bloom is the flagship's device.
- **Value separation test:** the seal must remain readable against the arm on value alone, with all
  colour removed. Squint or desaturate — if the seal and the steel merge, the lighting has failed.

## 9. Palette and gold budget

Base is the locked PURIFICATION palette around `FACTION_ACCENT.PURIFICATION` `#e7e2d3`.

| Band                           | Share of canvas                                 | Where                                 |
| ------------------------------ | ----------------------------------------------- | ------------------------------------- |
| White / ivory / warm off-white | dominant, ~45–60%                               | seal stone, background, haze          |
| Cool pale silver / grey        | secondary, ~20–25%                              | seal banding, hinge, blade highlights |
| Dark charcoal / gunmetal       | ~15–25%                                         | armoured arm, glove, blade body       |
| Cold pale blue-white           | accent, small                                   | engraved rune glow, frost motes, rim  |
| Gold                           | **≤ ~5%, hairlines and one small fitting only** | seal hinge pin, one edge line         |

**Gold budget, and why it differs from Card 01.** This card is RARE, one tier above the COMMON
Acolyte and well below the LEGENDARY High Warden. The Acolyte was held to two hairlines at ≤ ~3%.
Card 02 may go slightly further — a hinge pin or a small locking fitting rendered in gold, plus one
hairline — to a ceiling of ~5%. It must still be nowhere near the flagship's broad filigree fields.
The art bible's warning stands: diegetic gold competes with the UI's `raido.gold` rarity colour, and
too much of it fakes a Legendary read on a RARE frame.

**Forbidden colours:** no crimson or red, no violet or magenta or purple, no ember-orange or amber,
no warm glow of any kind, no saturated green or blue.

## 10. Rune and VFX language

PURIFICATION magic is **engraved, material-bound and static** — never conjured in an open palm.
This card is the cleanest possible expression of that rule, because the magic _is_ an object.

- **Primary effect:** the geometric rune lines cut into the seal glow with a soft, steady, cold
  pale-blue-white light, as if lit from within the stone. Even and low-intensity — a lock's
  indicator light, not a discharge.
- **Secondary effect:** a sparse scatter of cold frost motes, concentrated along the arrested swing
  path so they double as a motion cue. A dozen or so reads, not a blizzard.
- **Tertiary, optional:** the faintest cold spill onto the charcoal steel immediately adjacent to the
  seal, confirming the seal is the light source.
- **Explicitly forbidden VFX:** no beam, bolt, projectile, burst, shockwave or explosion; no
  open-palm sigil; no floating cast circle in front of anything; no floor rune-circle; no halo ring;
  no lens flare; no god rays; no energy chains or tendrils; no cracking or shattering effects. And
  under no circumstances warm embers, ash or smoke.
- **Intensity ceiling:** the glow must never blow out into white or become the brightest thing by a
  wide margin. It marks the seal; it does not replace it. If the glow reads before the seal's
  physical form does, dial it down.

## 11. Rarity hierarchy

| Axis        | Acolyte (COMMON)             | **Seal of the Curse (RARE)**                              | High Warden (LEGENDARY)                |
| ----------- | ---------------------------- | --------------------------------------------------------- | -------------------------------------- |
| Subject     | Single figure, three-quarter | **Object close-up, no figure**                            | Full-body monument                     |
| Complexity  | Plain, minimal               | **One crafted mechanism, deliberate engineering**         | Monumental, layered, ornate            |
| Gold        | 2 hairlines, ≤ ~3%           | **hairline + one small fitting, ≤ ~5%**                   | Broad filigree fields                  |
| Ornament    | None                         | **Functional geometry only — hinge, banding, lock block** | Decorative filigree, crest, emblem     |
| Environment | Modest cloister arcade       | **Near-abstract pale space**                              | Cathedral facade, rose window, banners |
| Emissive    | Small tablet glow            | **Seal rune glow, single source**                         | Architectural halo, backlight bloom    |

**The RARE read comes from craftsmanship, not from decoration.** The Acolyte's tablet is a plain
slab; this seal is an engineered mechanism with a hinge, banding and a lock. That step up in
_implied precision_ is what should signal the higher tier — not more gold, not more ornament, and
never monumentality.

**Side-by-side test:** placed between the two at thumbnail size, this card must read as clearly
richer than the Acolyte and clearly humbler than the High Warden.

## 12. Composition and crop-safe geometry

Master canvas **1024 × 1536** (vertical 2:3). All shipped crops use `object-cover` at the default
centre anchor. The master is narrower per unit height than every target ratio, so width is never
trimmed — **all loss is vertical, split evenly top and bottom.**

| Crop | Consumer                                       | Visible height | Trim   | Top / bottom | Safe rows      |
| ---- | ---------------------------------------------- | -------------- | ------ | ------------ | -------------- |
| 3:4  | `CardView` — collection, deck select, hand fan | 1365 px        | 171 px | 85 / 86      | 85 – 1450      |
| 7:9  | `HandCardPreview` — in-match hand tap          | 1317 px        | 219 px | 109 / 110    | 109 – 1426     |
| 4:5  | `CardDetailDrawer` — collection tap detail     | 1280 px        | 256 px | 128 / 128    | **128 – 1408** |

**4:5 is binding.**

### Surface note — `CreatureSlot` does not apply to this card

An EVENT never occupies a Battlefield board slot, so `CreatureSlot` is **not** a review surface here.
Verified in the code: `CardPlayReveal` handles EVENT plays with a 380 ms centre-of-board flash that
renders `Icon name="sword"` plus the card name — **no artwork at all**. The artwork therefore appears
on exactly three surfaces: `CardView` 3:4, `CardDetailDrawer` 4:5 and `HandCardPreview` 7:9. The 3:4
ratio still matters, it is simply reached through `CardView` rather than through a board slot.

This mirrors Art Pack 02 Card 04, the RUNE, which had the same four-surface-not-five situation.

### Target layout on the 1024 × 1536 master

- **Seal centroid:** row **~770**, horizontally centred. That is within a few pixels of the exact 4:5
  crop centre (row 768) — the single safest position on the canvas. The hero object must sit there.
- **Seal vertical extent:** roughly rows 620–930. Comfortably inside every crop with large margin.
- **Weapon hand and guard:** rows ~600–950, overlapping the seal.
- **Blade:** enters on a diagonal from the upper frame; the visible blade body occupies roughly rows
  300–620. The blade _tip_ may run out of the top of the frame — that is fine and even desirable,
  since a tip leaving frame reads as a longer weapon.
- **Forearm:** runs out of the lower or side frame edge around rows 950–1300.
- **Reserved empty margin:** **nothing essential above row 260 or below row 1280.**

**On that margin rule — this is a deliberate correction.** Card 01's brief asked for ~130 px of
clearance and the approved candidate delivered only ~2–4 px under the 4:5 cut; it passed, but with no
margin left, and that is now a recorded caveat in `docs/art-pack-03.md`. Card 02 must not repeat it.
Rows 260 and 1280 give roughly 130 px of real clearance under the binding crop. **A candidate whose
essential content sits outside rows 260–1280 should be sent back even though the 128–1408 band would
technically pass.**

- **Horizontal:** the seal and hand occupy roughly the central 60% of the width. Side content is
  always safe, since width is never trimmed.

## 13. Mobile and 92 px readability

Real rendered sizes in the shipped codebase: `CardView` `xs` 92 px, `sm` 140 px, `md` 200 px,
`lg` 280 px.

**92 px at 3:4 is 92 × 123 px.** That is the acceptance bar. At that size:

- The **seal** must survive as a distinct pale block, clearly separate from the dark arm. This is the
  single most important thumbnail requirement.
- The **weapon** must read as a weapon — a straight bright diagonal — even when the blade is only a
  few pixels wide.
- The **stop** should still read: a pale mass sitting across a dark diagonal, interrupting it.
- The **faction** must read instantly as PURIFICATION from the white/silver dominance.
- The engraved rune detail, the hinge, the frost motes and the entire background are all expected to
  be lost, and that is acceptable.

**Required check:** view at 92 px and desaturate. If the seal and the arm merge into one grey mass,
the value separation in §8 has not been achieved and the candidate fails regardless of how it looks
at full size.

**Deliberate simplicity.** Because this is an object close-up with no face to anchor it, it has fewer
recognition cues than a character card. Compensate by keeping the seal's silhouette blocky and
simple. Fussy, filigreed or delicately-shaped seal geometry will disintegrate at thumbnail size.

## 14. Generation prompt

Target **1024 × 1536**, vertical 2:3.

```
Extreme close-up fantasy trading card illustration of an armoured hand gripping a sword hilt,
stopped mid-swing, with a heavy white stone and silver restraint clamped shut around the hand and
cross-guard together, binding the hand to the hilt so it cannot let go or swing.

The restraint is the hero object and the brightest thing in the image: a compact, chunky, hinged
clamp of pale marble-white stone with polished silver banding along its edges, a visible metal hinge
on one side and a solid locking block on the other, fitted tightly enough to compress the dark
leather of the glove at its edges. Angular geometric rune lines are cut deep into the stone,
following the clamp's own shape, and glow softly and steadily from within with cold pale blue-white
light. Matte satin finish, not mirror polished. Pristine and newly closed, no wear or damage. A
single small gold hinge pin and one thin gold edge line are the only gold in the picture.

The arm is generic and unadorned: plain dark charcoal steel plate over a dark leather glove, no
insignia, no crest, no heraldry, no coloured accent. A plain straight cruciform sword blade enters
the frame from the upper area on an arrested diagonal, its outer tip very slightly motion-blurred
while the hand and the restraint stay perfectly sharp. The fingers are strained against the closed
clamp. The dark steel is clearly lit and shows form and highlights - it is dark in material, not in
shadow.

A sparse scatter of cold frost motes drifts along the path the swing was travelling.

Background: a shallow, pale, near-abstract space - plain white stone falling off immediately into
soft pale haze, heavily out of focus, almost no detail.

Lighting: bright, diffuse, near shadowless ambient light from front and above. High key overall,
low contrast, no deep cast shadows anywhere, darkest value a mid-dark grey rather than black. The
glowing rune lines are the only light-emitting element and spill a faint cold blue-white onto the
stone and the nearest steel.

Palette: dominant white, ivory and pale silver; secondary dark charcoal gunmetal on the arm; small
cold pale blue-white accents in the rune glow and the motes; almost no gold.

Composition: vertical 2:3. The restraint sits centred horizontally at the exact vertical midpoint of
the canvas and is the clear focal point. The hand and guard surround it. The blade runs up and out
of the top of the frame; the forearm runs out of the lower edge. Generous empty pale background in
the top sixth and bottom sixth of the canvas. The restraint and hand occupy roughly the central 60
percent of the frame width.

Style: cinematic semi-realistic premium collectible card illustration, realistic metal and stone
materials, realistic hand anatomy, crisp readable forms, controlled illustrative finish, sharply
focused subject against a softly blurred background.
```

## 15. Negative prompt

```
person, face, portrait, full figure, character, warrior standing, two figures, caster, wizard, mage,
open palm, casting spell, spellcasting gesture, summoning,
magic burst, energy beam, bolt, projectile, shockwave, explosion, magic circle floating in air,
rune circle on the ground, halo ring, glowing aura, energy chains, tendrils, lens flare, god rays,
crimson, red, blood, violet, purple, magenta, pink, orange, amber, ember, fire, flame, sparks,
warm glow, warm light, ash, smoke, soot,
corruption, rot, decay, withering, blight, poison, dark mist, curse tendrils, black smoke,
skull, bone, demonic, sinister,
dark background, black background, deep shadow, chiaroscuro, dramatic shadow, high contrast, moody,
gloomy, silhouette, backlit,
ghost, spectral, translucent, transparent, ethereal, dissolving,
gold filigree, ornate gold trim, jewels, gemstones, heavily decorated, opulent, regal, ornate
engraving on the armour, heraldry, crest, insignia, emblem, banner, flag,
cathedral, gothic architecture, rose window, stained glass, spires, staircase, throne room, crowd,
landscape, sky, clouds,
broken chains, shattering, cracks, damaged armor, rust, dirt, grime, blood on blade, tattered cloth,
mirror polished chrome, plastic, glossy plastic render, photobash, sterile studio photo,
wide shot, distant subject, tiny subject, cluttered composition, busy background,
extra fingers, extra hands, missing fingers, malformed hand, deformed anatomy, floating hand,
text, letters, words, watermark, signature, logo, frame, border, ui elements
```

## 16. Automatic reject conditions

Any one of these means the candidate does not go to approval.

**Concept failures**

1. The curse reads as corruption — rot, blight, tendrils, spreading darkness — rather than as a
   binding.
2. A caster, a face or any full figure appears.
3. The magic is being actively cast rather than already bound in the object.
4. The image would still read as "a warrior holding a sword" with the glow removed; the stop is not
   legible.
5. The seal reads as armour the wearer owns (a gauntlet or bracer) rather than a restraint applied
   to them.

**Faction failures**

6. Any crimson, red, violet, magenta, or ember-orange.
7. The dark arm becomes a black silhouette or the image acquires deep chiaroscuro.
8. Warm embers, ash or smoke anywhere.
9. Spectral, translucent or dissolving forms.
10. Tattered or ragged cloth.
11. Cathedral facade, rose window, halo, banners, floor rune-circle or crowd.

**Rarity failures**

12. Broad gold filigree, or gold exceeding roughly 5% of the canvas.
13. Heraldry, crest or insignia on the enemy armour.
14. Monumental or ornate treatment that reads as LEGENDARY.

**Structural failures**

15. Essential content outside master rows **260–1280**.
16. The seal is not the brightest, highest-contrast, most central element.
17. The seal and arm merge in value when desaturated at 92 px.
18. Fussy or delicate seal geometry that disintegrates at thumbnail size.
19. Malformed hand anatomy, extra or missing fingers.
20. Text, lettering, watermark, signature or logo anywhere in the frame.

## 17. Final acceptance checklist

**File integrity**

- [ ] WebP, container fourcc at bytes 12–16 is plain `VP8 ` — an original export, not a `VP8X`
      transcode.
- [ ] Decoded dimensions exactly **1024 × 1536**.
- [ ] RIFF-declared total (`uint32` LE at bytes 4–8, plus 8) equals the actual byte size on disk.
- [ ] SHA-256 recorded, and `git cat-file -s HEAD:<path>` confirms the committed blob size **before**
      pushing. This check has caught two ~15 KB truncations on this project; run it every time.
- [ ] Transported into the repository **by commit on a branch** — never chat attachment, ZIP, or
      base64 chunking.

**Concept**

- [ ] The seal is unmistakably a restraint that has locked a weapon, and the weapon clearly cannot
      complete its attack.
- [ ] The curse reads as a binding, not as corruption.
- [ ] No caster, no face, no full figure.
- [ ] The magic is bound in the object; nothing is cast from a hand.

**Faction**

- [ ] White / silver / ivory dominate.
- [ ] Bright, near-shadowless lighting; darkest value is a mid-dark grey, not black.
- [ ] The dark arm is dark by material and clearly lit, with visible form and highlights.
- [ ] Engraved, static, material-bound rune magic only.
- [ ] Cold frost / light motes only; no ash, no embers.
- [ ] No crimson, red, violet, magenta or orange anywhere.
- [ ] All edges crisp and opaque; nothing translucent or dissolving.

**Rarity**

- [ ] Reads clearly richer than the COMMON Acolyte and clearly humbler than the LEGENDARY High
      Warden at thumbnail size.
- [ ] Gold limited to a hinge pin plus one hairline, ≤ ~5% of canvas.
- [ ] The enemy armour carries no insignia, crest or heraldry.
- [ ] RARE tier is signalled by engineered precision, not by added decoration.

**Composition and crops**

- [ ] Seal centroid within a few pixels of row 770, horizontally centred.
- [ ] **All essential content inside master rows 260–1280** — the ~130 px margin rule, not merely the
      128–1408 band.
- [ ] Verified in **3:4** (`CardView`), **7:9** (`HandCardPreview`) and **4:5**
      (`CardDetailDrawer`). 4:5 is the pass/fail call.
- [ ] `CreatureSlot` correctly **not** reviewed — an EVENT never occupies a board slot.
- [ ] Zero accepted crop losses.

**Legibility**

- [ ] At 92 px the seal reads as a distinct pale block against the dark arm.
- [ ] At 92 px, **desaturated**, the seal and arm remain separable on value alone.
- [ ] At 92 px the weapon still reads as a weapon.
- [ ] At 92 px the faction reads instantly as PURIFICATION.
- [ ] Checked at 390 px mobile width in `/admin/art-review` alongside the desktop pass.

**Craft**

- [ ] Hand anatomy correct; correct finger count; convincing grip.
- [ ] The seal is a coherent solid mechanism with believable hinge and closure.
- [ ] Cinematic semi-realistic finish — neither generic painterly fantasy nor sterile plastic
      photobash.
- [ ] No text, lettering, watermark, signature or logo anywhere.

## Out of scope

Generation, integration, promotion and production sync are **not** part of this task. Nothing here
authorises a write to `apps/game-server/prisma/seed.ts`, to `TARGET_SLUGS` or
`REQUIRED_SOURCE_COMMIT` in the sync script, to the sync workflow, or to the production database.

Note for whenever Card 02 does eventually reach production: the current sync configuration is pinned
at eleven cards with `REQUIRED_SOURCE_COMMIT = 92cc662f…`, and `SYNC-11-CARD-ART-PRODUCTION` is
**consumed**. A twelfth card needs a fresh owner confirmation and a pin repointed at a new
already-merged integration commit.

Art Pack 03 Card 02 stops here, at owner review of this brief.
