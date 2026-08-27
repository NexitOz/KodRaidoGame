# Acolyte of the White Rune — master-art brief (PURIFICATION, Art Pack 03 Card 01)

Status: **art direction only.** This document changes no `artworkUrl`, no `rightsStatus`, no seed
data, no schema, no gameplay/balance/rarity/cost/stat/faction value, no artwork file, no
`/admin/art-review` code, no Battlefield UI, no production sync script or workflow, and no
production database row. It exists so the first Art Pack 03 generation pass produces a candidate
that can be approved on its first or second attempt.

**No image has been generated for this card.** Everything below is derived from three sources that
are actually in the repository: the `acolyte-of-the-white-rune` seed entry, the PURIFICATION section
of [`../art-bible-01.md`](../art-bible-01.md), and a direct visual audit of the approved production
file `apps/web/public/art/cards/high-warden-of-the-white-rune.webp`.

## Card facts (read-only, from `apps/game-server/prisma/seed.ts`)

| Field                      | Value                                                             |
| -------------------------- | ----------------------------------------------------------------- |
| `slug`                     | `acolyte-of-the-white-rune`                                       |
| `name`                     | Послушник Белой Руны                                              |
| `type` / `rarity` / `cost` | CHARACTER / COMMON / 1                                            |
| `attack` / `health`        | 1 / 3                                                             |
| `tags`                     | `['Purification']`                                                |
| `abilityText`              | При выходе: снимите Проклятие и Заглушение с выбранного союзника. |
| `effectJson`               | `ON_PLAY` → `CLEANSE` / `FRIENDLY_CHOSEN`                         |

## 1. Card role and visual role

**Card role.** A one-cost COMMON body with 1 attack and 3 health: cheap, durable for its cost,
offensively negligible. Its whole reason to exist is the on-play cleanse — it walks in, lifts a
Curse and a Silence off an ally, and then stands there absorbing hits. It is the faction's _entry
card_: the first PURIFICATION thing most players will ever put on the board.

**Visual role.** A junior member of the Order performing a small, practical rite. Not a hero, not a
commander, not a saint — a novice doing routine consecration work. The art has three jobs, in
priority order:

1. **Faction legibility at thumbnail size.** A player must know this is PURIFICATION at 92px wide,
   before any text resolves. White/ivory/silver, bright, clean-edged, cold light.
2. **Rank legibility.** It must read _lower_ than `high-warden-of-the-white-rune` at a glance —
   junior, simpler, less armoured, less decorated, less monumental.
3. **Ability legibility.** The cleanse must be visible as a _material-bound_ rune act: an engraved
   white-rune object doing the work, not a cast spell.

The card is COMMON. It should look like there are a hundred of these acolytes and only one High
Warden.

## 2. Silhouette and pose

**Framing: three-quarter length, cut mid-thigh.** This is the single most important structural
decision in this brief. The High Warden is a full-body monument with an enormous cape and skirt
filling the lower half of the canvas. The Acolyte is framed closer, so the figure fills more of the
frame while carrying far less visual mass. This is what makes a COMMON card readable at 92px without
copying the flagship.

**Silhouette: a narrow, upright vertical column.** Frontal and near-symmetrical — PURIFICATION's
locked posture language — but _lean_, not the Warden's wide pyramid. Shoulders roughly one and a
half head-widths. No cape spread, no shield disc, no polearm shaft breaking the outline. The
outline reads as: plain head, narrow shoulders, two forearms converging to a small object at chest
height. That is a genuinely different silhouette from the flagship even in pure black.

**Head: bare, uncovered, no ornament.** Hood pushed back and resting flat on the shoulders, or no
hood at all. No crown, no tiara, no vertical head spike. This is the fastest rank read available and
it doubles as a crop-safety win (see §10).

**Pose.** Standing, weight even, both hands raised to hold a small engraved rune-plate at chest
height, forearms angled inward and slightly forward — presenting the plate toward the viewer/ally,
not clutching it. Head level or tipped _very slightly_ down toward the plate; eyes may look toward
the plate or level at the viewer. Calm, attentive, a little tentative. Young adult. No heroic chin
lift, no low heroic camera angle, no wind-blown hair.

**What the pose must not be.** Not an open-palm cast. Not arms spread. Not kneeling or praying.
Not a combat stance. The Acolyte is _performing a small rite_, not fighting and not worshipping.

## 3. Costume / materials

The faction language is "armor, not robes" and it is held **strictly** here. The Acolyte wears real
armor — just **light, plain, standard-issue** armor, where the Warden wears a **full ceremonial
harness**. The rank read comes from _how much armor and how decorated it is_, never from swapping
armor out for cloth. This card must never read as a robed cleric, monk, or acolyte-in-vestments.

- **Armor, the primary layer:** a **light white/silver cuirass** — a single smooth, simply-shaped
  breastplate with a matching back, worn close to the body. Undecorated: no embossing, no engraved
  panels, no filigree, no repoussé, no applied medallion. Plain silver gorget at the throat. Two
  small, plain, matching pauldrons — symmetrical, single-piece, not the Warden's layered stacks.
  Simple vambraces on both forearms.
- **Bare hands, deliberately.** No gauntlets. The hands on the rune tablet are the ability read and
  must stay legible as human hands at thumbnail size; bare hands also mark the wearer as a novice
  performing a rite rather than a commander in full harness.
- **Below the waist:** a short plain ivory tabard or armored skirt falling to mid-thigh, where the
  frame cuts. No faulds, no tassets, no layered plate stacks, no ceremonial skirt. Greaves are
  irrelevant — the crop never reaches them — so nothing below mid-thigh needs designing.
- **Under-layer:** a plain ivory high-collared under-tunic showing only at the collar and beneath
  the vambraces. It is _under_ the armor, not the main garment. Crisp pressed edges, straight hems,
  no fraying, no tatters, no ragged silhouette anywhere.
- **Metal finish:** brushed or satin white-steel — **matte, not mirror-polished.** Mirror polish and
  chrome sheen are ceremonial and belong to the flagship. A little honest wear is right: fine edge
  scuffs and faint use marks. No dents, no damage, no dirt, no grime, no blood.
- **Mantle:** a short shoulder-mantle or pushed-back hood in plain ivory cloth, falling no lower
  than mid-back. **No full cape.** The cape is the Warden's silhouette device.
- **Belt:** a plain leather-and-silver belt with one small pouch or a rolled cloth. Utility, not
  ceremony.
- **Signature object:** a **hand-sized rectangular white-stone rune tablet** — roughly the size of
  two spread hands, a pale marble or bone-white slab with a single engraved rune-line pattern
  running through it. Held in both hands at chest height. It is small, compact, and centered: it
  cannot be trimmed by any crop, and it cannot be confused with the Warden's huge round shield or
  ceremonial spear.
- **Ornament budget:** one thin gold hairline on the gorget edge, and one thin gold line following
  the tablet's rim. That is the entire gold allowance (see §6).
- **No weapon.** The Acolyte carries nothing that reads as a weapon. A 1-attack cleanser should not
  look armed.

## 4. Environment / architecture

The Warden owns the monumental cathedral facade. The Acolyte gets its **service spaces**.

- **Setting:** a modest side-chapel or cloister arcade — plain white/pale-grey stone piers, a short
  run of simple pointed arches receding behind the figure, a stone floor. Ordinary working
  architecture of the same order: same material, same geometry, a fraction of the grandeur.
- **Depth:** shallow. The arcade sits close behind the figure and falls off quickly into soft
  atmospheric haze. The Warden's background reads as endless; the Acolyte's reads as _a room_.
- **Explicitly absent:** no rose window, no glowing rune-circle halo behind the head, no twin
  spires, no order banners, no ceremonial staircase, no inscribed rune circle on the floor, no wet
  mirror-reflective floor. Every one of those is a flagship device and lifting any of them makes
  this card compete with a LEGENDARY.
- **Crowd device:** **none.** The Acolyte stands alone. PURIFICATION's ranked-congregation device
  signals hierarchy and command, and a junior novice does not command a formation. If additional
  bodies are unavoidable, at most one or two plain-robed figures, heavily blurred, far back in the
  arcade, cropped by the frame edge, opaque — never a symmetric honor guard, and never translucent.
- **Ornament on the architecture:** one small engraved rune motif on a pier or lintel, unlit or very
  faintly lit. Enough to place the order; not enough to be a second focal point.

## 5. Lighting

Locked faction lighting, unchanged in kind and softer in degree:

- **Bright, diffuse, near-shadowless ambient light** with a soft key from front-and-above. No deep
  cast shadows anywhere on the figure. This is the direct opposite of SHADOW's chiaroscuro and it is
  the fastest non-color faction cue there is.
- **Key source:** a plain high clerestory window out of frame, or simple daylight through the
  arcade. Not a glowing rune-window, not a divine shaft, not a backlit halo bloom behind the head.
- **Contrast:** low-to-medium. Values live in the upper half of the range. The darkest value in the
  image should still be a mid-grey, not black.
- **Rim light:** a gentle cool white-blue rim is acceptable on the shoulders and jaw for separation
  against the pale background. It must stay subtle — the flagship's strong backlight bloom is a
  flagship device.
- **Face:** fully and evenly lit. No shadow across the eyes. Face readability is a hard acceptance
  criterion (§15).

## 6. Faction palette

Base is the locked PURIFICATION palette: white / silver / ivory around
`FACTION_ACCENT.PURIFICATION` `#e7e2d3`.

| Band                           | Share of canvas           | Where                                        |
| ------------------------------ | ------------------------- | -------------------------------------------- |
| White / ivory / warm off-white | dominant, roughly 55–70%  | tabard, mantle, under-tunic, stone, haze     |
| Cool pale silver / grey        | secondary, roughly 20–30% | cuirass, gorget, pauldrons, vambraces, piers |
| Cold pale blue-white           | accent, small             | engraved rune glow, frost motes, rim light   |
| Gold                           | **≤ ~3%, hairlines only** | one gorget edge line, one tablet rim line    |
| Warm skin / hair               | small                     | face and hands, natural, unsaturated         |

**The gold rule is a hard constraint, and it is the one the art bible explicitly anticipated.** The
Warden's diegetic gold is harmless because that card is already LEGENDARY and the UI's `raido.gold`
rarity color reinforces it correctly. On a COMMON frame the same treatment fakes a rarity signal.
So: gold appears only as **hairlines**, never as filigree fields, never as a chest starburst, never
as skirt panels, never on the mantle, never on the architecture. If a candidate comes back with
broad gold filigree, that is an automatic reject regardless of how good the rest is.

Hair should be an ordinary natural tone — light brown, ash blond, or dark — deliberately not the
flagship's radiant gold-blond, which reads as chosen/anointed.

**Forbidden colors:** no crimson or red (SHADOW), no violet or magenta (SHADOW/VEIL), no warm orange
or ember tones (SHADOW's Keeper family), no deep saturated green or blue.

## 7. VFX / rune language

PURIFICATION magic is **engraved, architectural, or material-bound — never conjured in an open
palm.** For this card the ability itself makes that easy: the cleanse is the tablet's doing.

- **Primary effect:** the engraved rune-lines on the white stone tablet glow with a soft cold
  pale-blue-white light, as if lit from inside the stone. Even, steady, low intensity — like heated
  metal cooling, not like a spell discharging.
- **Secondary effect:** a light scatter of cold frost motes and fine light particles drifting
  _upward_ near the tablet and around the shoulders. Sparse. A dozen or so reads, not a blizzard.
- **Optional tertiary:** a very faint pale glow spilling onto the underside of the chin and the
  insides of the forearms from the tablet, reinforcing that the object is the source.
- **Explicitly forbidden VFX:** no beam, no bolt, no projectile, no burst, no shockwave, no
  open-palm sigil, no floating cast circle in front of the hands, no floor rune-circle, no halo
  ring behind the head, no lens flare, no god rays. No warm embers or ash under any circumstances.
- **Intensity ceiling:** the VFX must never become the brightest or highest-contrast element of the
  frame. The face wins. If the tablet glow out-reads the face at thumbnail size, dial it down.

## 8. Hierarchy differences vs. `high-warden-of-the-white-rune`

Audited directly against the approved production file. Every row is a deliberate step down, and the
first five are the ones that survive to thumbnail size.

| Axis            | High Warden (LEGENDARY, approved)                                                            | Acolyte (COMMON, this brief)                                            |
| --------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framing         | Full body, head to boots                                                                     | Three-quarter, cut mid-thigh                                            |
| Silhouette mass | Wide pyramid — cape, skirt, shield disc                                                      | Narrow vertical column                                                  |
| Head            | Tall crown/tiara, vertical spike, radiant gold hair                                          | Bare head, no ornament, ordinary hair                                   |
| Carried object  | Dual-wield: tall ornate spear + huge round rune-shield                                       | One small hand-held rune tablet, no weapon                              |
| Armour          | Full ceremonial harness: breastplate, layered pauldrons, gauntlets, greaves, heavy gold trim | Light plain cuirass, gorget, two small pauldrons, vambraces; bare hands |
| Outer layer     | Enormous flowing cape and layered ceremonial skirt                                           | Short shoulder-mantle, no cape                                          |
| Gold            | Heavy filigree fields — chest starburst, skirt panels, shield rim, spear head                | Two hairlines, ≤ ~3% of canvas                                          |
| Architecture    | Monumental cathedral facade, spires, rose-window halo, banners, grand stair                  | Modest side-chapel arcade, shallow, plain                               |
| Floor           | Wet mirror floor with inscribed rune circle                                                  | Plain dry stone                                                         |
| Crowd           | Ranked helmeted honor guard flanking both sides                                              | Alone                                                                   |
| Lighting drama  | Strong backlight bloom through the rose window                                               | Plain even daylight, gentle rim                                         |
| Bearing         | Chin lifted, commanding, heroic low camera                                                   | Level eyeline, attentive, unassuming                                    |
| Age read        | Mature, authoritative                                                                        | Young adult, novice                                                     |

**The one-sentence test:** if you can look at the two thumbnails side by side and not instantly say
which one costs 6, the candidate has failed.

**What must stay identical**, or the faction read breaks: white/silver/ivory base, clean pressed
edges, bright near-shadowless light, cold light and frost motes, engraved rune magic, the same
stone/metal material vocabulary, frontal near-symmetrical posture.

## 9. Differentiation vs. SHADOW

The art bible flags PURIFICATION and SHADOW as the closest structural pair in the set, and Candidate
02 for the flagship was rejected specifically for SHADOW drift. This card avoids the trap
structurally — it has no cathedral facade, no crowd, and no cast effect — but the checks still apply:

| Axis           | SHADOW                                      | Acolyte                                    |
| -------------- | ------------------------------------------- | ------------------------------------------ |
| Value key      | Near-black, deep chiaroscuro                | High key, near-shadowless                  |
| Accent         | Crimson / magenta / violet, or ember-orange | Cold pale blue-white only                  |
| Cloth          | Thin fluttering tatters, ragged edges       | Pressed, tailored, clean hems              |
| Form solidity  | Translucent, dissolving, spectral echoes    | Fully opaque, crisp edges throughout       |
| Crowd device   | Loose asymmetric translucent echo-figures   | None (and never translucent if any appear) |
| Magic delivery | Actively cast from an open hand             | Bound in an engraved object                |
| Particles      | Ash and warm embers                         | Frost motes and cold light                 |
| Silhouette     | Lean off-center diagonal                    | Upright frontal column                     |

Two SHADOW motifs are absolutely reserved and must not appear here in any form: the **translucent
echo-crowd** and the **actively-cast open-palm rune**. Those are the exact two that sank flagship
Candidate 02.

## 10. Crop-safe composition (1024×1536 master → 3:4, 7:9, 4:5)

Master canvas: **1024 × 1536** (vertical 2:3). All three shipped crops use `object-cover` at the
default center anchor. The master is narrower per unit height than every target ratio, so
`object-cover` scales to match **width** first: **the left and right edges are never trimmed.** All
loss is vertical, split evenly top and bottom.

| Crop | Consumer                                                       | Visible height | Total trim      | Top / bottom | Safe rows      |
| ---- | -------------------------------------------------------------- | -------------- | --------------- | ------------ | -------------- |
| 3:4  | `CardView` (collection, deck select, hand fan), `CreatureSlot` | 1365 px        | 171 px (~11.1%) | 85 / 86      | 86 – 1450      |
| 7:9  | `HandCardPreview`                                              | 1317 px        | 219 px (~14.3%) | 109 / 110    | 110 – 1426     |
| 4:5  | `CardDetailDrawer`                                             | 1280 px        | 256 px (~16.7%) | 128 / 128    | **128 – 1408** |

**4:5 is the binding constraint.** Everything essential must sit inside rows **128–1408** — the
middle ~83.3% of the canvas height.

Target layout on the 1024×1536 master:

- **Top of head:** row ~260 (≈17% down). Gives ~130 px of clearance below the 4:5 top cut.
- **Eyeline:** rows ~330–380. Comfortably central-upper, safe in all three crops.
- **Shoulders / gorget:** rows ~540–620.
- **Rune tablet, the ability read:** centered horizontally, tablet center at row ~790 — within
  ~20 px of the exact 4:5 crop center (row 768). This is the safest position on the canvas and the
  tablet cannot be clipped in any crop.
- **Lower body cut (mid-thigh):** row ~1380, so the figure's termination falls inside the 4:5 band
  and the crops eat only floor and haze.
- **Bottom 128 px and top 128 px:** background only — soft haze, plain stone, nothing the card
  needs.
- **Horizontal:** the figure occupies roughly the central 55% of the width. Arcade piers may sit
  near the left/right edges; side content is always safe.

**Known losses eliminated by design.** The flagship ships with an accepted loss — the spearhead's
decorative apex is trimmed ~5.5–8.3% in all three crops. This brief removes that class of risk
entirely: there is **no crown, no head ornament, and no raised weapon** to clip. A candidate that
comes back with a headpiece or a raised staff has reintroduced a solved problem and should be
rejected on that ground alone.

## 11. Mobile / thumbnail readability

The card is rendered at these real sizes in the shipped codebase:

| Surface                      | Width cap |
| ---------------------------- | --------- |
| `CardView` `xs`              | 92 px     |
| `CardView` `sm`              | 140 px    |
| `CreatureSlot` (battlefield) | ~160 px   |
| `CardView` `md`              | 200 px    |
| `CardView` `lg`              | 280 px    |

**92 px at 3:4 is 92 × 123 px.** That is the acceptance bar. At that size:

- The **silhouette** must still read as a narrow upright figure holding something at chest height.
- The **face** must remain a clean, evenly lit, unobstructed shape — roughly 12–16 px tall at
  92 px wide, which is why it must be well up in the frame, frontal, and shadow-free.
- The **white/silver faction color** must dominate the thumbnail.
- The **tablet** must survive as a distinct light-toned rectangle with a faint cold glow, separated
  in value from both the hands and the cuirass behind it. If the tablet, the hands and the armor are
  all the same ivory-white, the ability read dissolves at thumbnail size — give the tablet a
  slightly cooler, slightly darker stone value than the metal so its edges hold.
- Background detail (arch profiles, the pier rune motif, individual frost motes) is expected to be
  lost and that is acceptable.

**Required check before approval:** view the candidate at 92 px and squint. If you cannot tell it is
PURIFICATION, or you cannot find the object in the hands, it fails regardless of how it looks at
full size.

## 12. Forbidden drift list

Automatic-reject items. Any one of these means the candidate does not go to approval.

**Rarity drift (the primary risk on this card)**

1. Broad gold filigree fields anywhere — chest starburst, skirt panels, ornate trim runs.
2. A crown, tiara, circlet, halo, or any head ornament.
3. A full cape, a ceremonial trailing skirt, or a wide-spread outer layer.
4. A **full ceremonial harness** — layered pauldron stacks, faulds, tassets, gauntlets, greaves, or
   embossed/engraved plate. Note the distinction: the light plain cuirass, gorget, two small
   pauldrons and vambraces specified in §3 are **required**, not forbidden. What is forbidden is
   _full and decorated_ armour, and equally its opposite — a robed, unarmoured cleric.
5. Any weapon: spear, polearm, staff, sword, or a large shield.
6. A rose window, glowing rune-circle halo, cathedral facade, spires, banners, grand staircase, or
   an inscribed floor rune-circle.
7. A ranked honor-guard formation, or any symmetric crowd.
8. Radiant gold-blond flagship hair, heroic chin-lift, or a low heroic camera angle.

**Faction drift**

9. Crimson, red, violet, magenta, or ember-orange accents.
10. Deep chiaroscuro, black backgrounds, or shadow across the face.
11. Ash or warm ember particles (cold frost/light motes only).
12. Tattered, ragged, frayed, or shredded cloth.
13. An actively-cast open-palm spell effect, beam, burst, or projectile.
14. Translucent, ghostly, or dissolving figures or edges.

**Structural drift**

15. Full-body monumental framing (breaks the rank read and the crop plan).
16. Wide pyramid silhouette.
17. Content essential to the read placed outside master rows 128–1408.
18. VFX brighter or higher-contrast than the face.
19. Extra hands, extra fingers, or a malformed tablet — standard anatomy/prop failures.
20. Text, lettering, watermarks, signatures, or logos anywhere in the frame.

## 13. Generation prompt (ready to use)

Target: **1024 × 1536**, vertical 2:3.

```
A young novice of a holy white-rune order, three-quarter length portrait cut at mid-thigh,
standing frontally and symmetrically, calm and attentive, holding a small hand-sized white stone
rune tablet in both hands at chest height and presenting it slightly forward. Bare uncovered head,
no crown and no headwear, short simple hair in an ordinary natural tone, hood pushed back flat on
the shoulders. Wearing light plain standard-issue armor: a smooth undecorated white and silver
cuirass worn close to the body, a plain silver gorget at the throat, two small simple matching
pauldrons, simple vambraces on both forearms, a short plain ivory tabard to mid-thigh, a plain
ivory high-collared under-tunic showing at the collar, a plain leather-and-silver belt with one
small pouch. The metal is brushed satin white steel, matte and not mirror-polished, with faint
honest edge wear and no damage. Bare hands, no gauntlets. Only two thin gold hairlines in the whole
image: one along the gorget edge and one along the rim of the stone tablet. No weapon, no shield,
no staff, no cape.

The engraved rune lines in the pale white stone tablet glow softly from within with cold pale
blue-white light, steady and low intensity, casting a faint cool light onto the underside of the
chin and the inner forearms. A sparse scatter of cold frost motes and fine light particles drifts
upward around the tablet and shoulders.

Background: a modest side chapel cloister arcade of plain white and pale grey stone, a short run of
simple pointed arches receding shallowly behind the figure and falling off into soft pale
atmospheric haze, a plain dry stone floor, one small faintly engraved rune motif on a stone pier.
The figure stands alone.

Lighting: bright, diffuse, near shadowless ambient daylight with a soft key from front and above,
low to medium contrast, values held in the upper range, no deep cast shadows, the face fully and
evenly lit, a gentle cool white-blue rim on the shoulders and jaw for separation.

Palette: dominant white, ivory and warm off-white; secondary cool pale silver and grey; small cold
pale blue-white accents in the rune glow and motes; gold present only as two thin hairlines.

Composition: narrow upright vertical column silhouette, shoulders roughly one and a half head
widths, the figure occupying the central 55 percent of the frame width. Top of the head at about 17
percent from the top of the canvas, eyeline in the upper third, the rune tablet centered
horizontally at the vertical midpoint of the canvas, the figure cut at mid-thigh near the lower
edge of the central band. Empty soft background haze in the top eighth and bottom eighth of the
canvas.

Style: painterly high-detail fantasy card illustration, clean crisp opaque edges, solid physical
materials, realistic proportions, character sharply in focus against a softly blurred background.
```

## 14. Negative prompt

```
crown, tiara, circlet, halo, headdress, helmet, headwear, head ornament, ornate headpiece,
full cape, long flowing cape, trailing ceremonial skirt, layered gown, wide spread robes,
robe, cassock, habit, monk robe, priest vestment, cleric robes, unarmored, cloth only outfit,
full plate harness, heavy armor, layered pauldrons, faulds, tassets, gauntlets, armored gloves,
ornate embossed armor, engraved breastplate, mirror polished chrome armor, battle damaged armor,
dented armor, rusted armor,
gold filigree, ornate gold trim, gold brocade, gold starburst, jeweled ornament, gemstones,
heavily decorated, opulent, regal, royal, queen, saint, angel, wings,
spear, polearm, staff, sword, weapon, large round shield, banner, flag, standard,
cathedral facade, gothic spires, rose window, stained glass, glowing rune circle behind head,
grand staircase, throne room, inscribed rune circle on floor, wet reflective mirror floor,
crowd, ranked soldiers, honor guard, congregation, knights in formation, background figures,
ghost, spectral, translucent, transparent, ethereal, dissolving edges, echo figures, double
exposure,
crimson, red, blood red, violet, purple, magenta, pink, orange, amber, ember, fire, flame, sparks,
ash, smoke, soot, warm glow, warm rim light,
dark, black background, deep shadow, chiaroscuro, dramatic shadow, high contrast, moody, gloomy,
shadow across the face, backlit silhouette, lens flare, god rays, volumetric shafts,
casting spell, open palm, magic burst, energy beam, projectile, shockwave, floating sigil in hand,
aura, glowing eyes,
tattered, ragged, frayed, torn cloth, shredded fabric, worn, dirty, grimy, bloodstained,
full body, full length, wide shot, tiny figure, distant figure, low heroic camera angle,
kneeling, praying hands, arms spread, combat stance, action pose, dynamic diagonal pose,
extra fingers, extra hands, missing fingers, malformed hands, deformed anatomy, blurry face,
text, letters, words, watermark, signature, logo, frame, border, ui elements
```

## 15. Production acceptance checklist

A candidate is approvable only when every box below is verifiable against the actual file.

**File integrity**

- [ ] Format WebP, container fourcc at bytes 12–16 is plain `VP8 ` (an original export), not `VP8X`
      (a platform transcode).
- [ ] Decoded dimensions are exactly **1024 × 1536**.
- [ ] RIFF-declared total (`uint32 LE` at bytes 4–8, plus 8) equals the actual byte size on disk.
- [ ] SHA-256 recorded, and the file transported into the repository **by commit on a branch** —
      not by chat attachment, ZIP, or base64 chunking, all of which have failed on this project.

**Rank and rarity read**

- [ ] Side by side with `high-warden-of-the-white-rune` at thumbnail size, it is immediately obvious
      which card is COMMON.
- [ ] No crown or head ornament of any kind.
- [ ] No cape; no weapon; no shield.
- [ ] **The figure is armored, not robed.** A light cuirass, gorget, two small pauldrons and
      vambraces are present and readable. If it reads as a robed cleric, monk, or acolyte in
      vestments, it fails.
- [ ] The armor is **light and plain**: no full harness, no layered pauldron stacks, no faulds or
      tassets, no embossing, no engraved panels, no applied medallion.
- [ ] Metal is brushed/satin matte, not mirror-polished or chromed; wear is limited to faint edge
      scuffs — no dents, damage, rust, dirt or grime.
- [ ] Hands are bare — no gauntlets — and read as human hands on the tablet at thumbnail size.
- [ ] Gold appears only as hairlines and covers no more than roughly 3% of the canvas.
- [ ] No rose window, cathedral facade, banners, floor rune-circle, or ranked crowd.

**Faction read**

- [ ] White / silver / ivory dominate the frame.
- [ ] Lighting is bright and near-shadowless; the darkest value is a mid-grey, not black.
- [ ] All edges are crisp and opaque; nothing is translucent or dissolving.
- [ ] Cloth edges are pressed and clean; nothing is tattered.
- [ ] Particles are cold frost/light motes; no ash, no embers.
- [ ] No crimson, red, violet, magenta, or orange anywhere.
- [ ] The rune magic is bound in the tablet; nothing is cast from an open hand.

**Composition and crops**

- [ ] Head, face, hands, and the rune tablet all sit inside master rows **128–1408**.
- [ ] Verified visually in **3:4** (`CardView` / `CreatureSlot`), **7:9** (`HandCardPreview`), and
      **4:5** (`CardDetailDrawer`) — 4:5 is the pass/fail call, but all three should be eyeballed
      since they are different absolute pixel sizes.
- [ ] Nothing essential is lost at any crop. Unlike the flagship, this card should ship with **zero**
      accepted crop losses.

**Legibility**

- [ ] At 92 px wide the faction reads instantly.
- [ ] At 92 px wide the face is a clean, evenly lit, unobstructed shape.
- [ ] At 92 px wide the tablet is still findable as a distinct light rectangle in the hands.
- [ ] Checked at 390 px mobile width in `/admin/art-review` alongside the desktop pass.

**Anatomy and cleanliness**

- [ ] Hands and fingers are correct; the tablet is a coherent solid object.
- [ ] No text, lettering, watermark, signature, or logo anywhere in the frame.

## Out of scope for this brief

Generation, integration, promotion, and production sync are **not** part of this task. Nothing here
authorizes a write to `apps/game-server/prisma/seed.ts`, `TARGET_SLUGS` in
`apps/game-server/scripts/sync-production-card-art.ts`, the
`.github/workflows/production-card-art-sync.yml` confirmation string or its count assertions, or the
production database. Art Pack 03 Card 01 stops here, at owner review of this brief.
