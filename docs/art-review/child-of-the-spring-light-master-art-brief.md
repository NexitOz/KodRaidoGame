# Master-art brief — `child-of-the-spring-light` / «Дитя Весеннего Света»

Art Pack 04 — BOND / «Дом Весеннего Света», Card 01 of 4.

Status: **BRIEF READY FOR OWNER REVIEW / GENERATION**. No image exists yet. Nothing in this document
authorizes seed, gameplay, artwork or production changes.

Every card fact, surface rule, crop ratio and comparison number below was read out of the repository
or measured from the shipped production files during this task — not copied forward from an earlier
brief. Where a figure differs from one quoted in an older pack document, the difference is stated.

---

## 1. Canonical card facts — verified from `apps/game-server/prisma/seed.ts`

| Field                      | Value                                           |
| -------------------------- | ----------------------------------------------- |
| `slug`                     | `child-of-the-spring-light`                     |
| `name`                     | Дитя Весеннего Света                            |
| `type` / `rarity` / `cost` | CHARACTER / COMMON / 1                          |
| `attack` / `health`        | 1 / 3                                           |
| `tags`                     | `['Bond']`                                      |
| faction                    | BOND — «Дом Весеннего Света»                    |
| `abilityText`              | При выходе: восстановите 1 здоровье Проводнику. |
| `effectJson`               | `ON_PLAY` → `HEAL` / `FRIENDLY_CONDUCTOR`, `1`  |

These are gameplay facts. This task does not change any of them.

Deck presence, from `apps/game-server/src/content/starter-decks.ts`: **×2 in the BOND starter deck**
and **×2 as a splash in the COSMIC Ramp archetype**. It is one of the highest-frequency cards a new
player sees, and it is a one-drop, so it is very often the first BOND card ever played. The thumbnail
read matters more here than on a card seen twice a match.

### What the mechanic actually does — read from the engine, not from the card text

- `packages/game-engine/src/effects/targets.ts:85` — `FRIENDLY_CONDUCTOR` resolves to
  `{ kind: 'conductor', playerId: ownerId }`. There is **no target choice**, no enemy leg, and no
  creature involved.
- `packages/game-engine/src/effects/primitives.ts:49-52` — `healTarget` on a conductor does
  `Math.min(STARTING_CONDUCTOR_HP, conductorHp + amount)`, with `STARTING_CONDUCTOR_HP = 30`
  (`packages/shared/src/constants.ts:4`). One point of thirty. It fires once, at the instant the card
  arrives, and never again.

**What the art must communicate:**

1. A **small** restorative act. One point of healing on a thirty-point pool is the smallest positive
   number the set contains. Whatever glows must be physically small.
2. The act is directed **at the Conductor — at you, the player**. Not at an ally on the board, not at
   itself, not at an enemy. This is the single most useful and most under-used fact about the card,
   and section 4 builds the whole concept on it.
3. The moment is **arrival**. «При выходе» fires on play. The figure has just come in.

**What the art must NOT imply:**

- Not a mass heal or an aura reaching several beings — that is the Matriarch (`FRIENDLY_ALL`, 2) and
  `light-of-the-hearth` at Resonance 3+.
- Not a heal aimed at a chosen ally — that is `keeper-of-the-promise` (`FRIENDLY_CHOSEN`, 3).
- Not a Shield, ward, barrier or protective dome — no `SHIELD` action appears anywhere in this
  card's `effectJson`. Shield belongs to `rune-of-reflected-light` and to the Matriarch at
  Resonance 5+.
- Not cleansing, un-cursing or dispelling — that is PURIFICATION's entire identity and a different
  faction's art.
- Not a combat action. Attack 1 is the lowest in BOND; the figure must not read as a fighter.
- Not a Resonance payoff. The Resonance column for this card in `docs/content-pack-01.md` reads
  «визуальный только» — there is no tier condition to depict.

---

## 2. Where Card 01 sits in BOND, and the trap to avoid

BOND's four non-flagship cards plus the live flagship:

| Card                                                    | Type / Rarity         | Mechanic                                          |
| ------------------------------------------------------- | --------------------- | ------------------------------------------------- |
| **01 `child-of-the-spring-light`** ← this brief         | CHARACTER / COMMON    | ON_PLAY heal **1** to the **Conductor**           |
| 02 `keeper-of-the-promise`                              | CHARACTER / RARE      | ON_PLAY heal 3 to a **chosen ally**               |
| 03 `light-of-the-hearth`                                | **TRACK** / RARE      | heal 3 Conductor; T3+ heal 2 to **all** allies    |
| 04 `rune-of-reflected-light`                            | RUNE / EPIC           | first ally heal each match also grants **Shield** |
| `matriarch-of-the-spring-light` (Art Pack 01, **live**) | CHARACTER / LEGENDARY | ON_PLAY heal 2 to all; T5+ Shield all             |

Note for later planning, verified from seed: Card 03 is a **TRACK**, not an EVENT. Like the RUNE it
has no Battlefield creature slot (§10), so it will be an eight-surface review, while Cards 01 and 02
are nine-surface CHARACTER reviews.

**The trap.** Every card in this faction heals. Five cards, one verb. If each brief reaches for "a
kind figure with glowing hands," BOND will ship five interchangeable images. The differentiator
cannot be _how much_ light there is — that only encodes rarity. It has to be **who the healing is
aimed at**, because the engine already gives each card a different answer:

- Card 01 → the Conductor, i.e. **the player, outside the frame**;
- Card 02 → one chosen ally, i.e. **someone else inside the frame**;
- Card 03 → the Conductor and then the whole board, i.e. **a shared source, no recipient shown**;
- Card 04 → a condition on someone else's healing, i.e. **no act at all, an object that reacts**.

That gives four structurally different pictures before a single stylistic choice is made. Card 01
takes the one nobody else can use: **the gesture that leaves the frame toward the viewer.**

---

## 3. Concept families evaluated

### ✅ RECOMMENDED — A. The offered sprig

A child stands at the low garden threshold, having just stepped through, holding both hands cupped
and extended forward **toward the viewer**. Resting in the cupped palms is one small budding spring
branch — three or four pale blossoms and a few new leaves — giving off a soft warm-gold light no
larger than the two hands that hold it. Nothing else in the frame glows.

Why this one:

- **It is the mechanic.** Hands extended out of frame is the only way to draw `FRIENDLY_CONDUCTOR`
  without inventing a Conductor character. The player is the recipient, and the composition puts them
  there. No other card in the set — any faction — addresses the viewer, so it is unrepeatable.
- **The scale is honest.** One point on thirty is a glow that fits inside two small hands. A brief
  that says "small" and then asks for a radiant aura will get an aura; a brief that puts a hard
  physical container around the light gets a small light.
- **It is COMMON without being poor.** A child, undyed linen, one plant, no metal, no ceremony. The
  rank read comes from how little there is, not from making the subject shabby or sad.
- **It avoids the healer-priest cliché** the task asks to avoid. There is no laying-on of hands, no
  robed cleric, no wounded body, no medical staging.
- **It is BOND, structurally.** A living growing plant is the faction's material; a child is its
  future; the warmth is golden-hour daylight, not a cast spell.
- **The 92 px silhouette is clean:** one small compact mass, low in frame, with a single bright warm
  point at chest height — see §12.

### ❌ REJECTED — B. Child watering a wilted seedling

Reads as growth and cultivation, i.e. a buff or a summon, not restoration of an existing pool. Also
the most literal possible "garden" image, and it aims the action downward at a plant rather than
outward at the Conductor. Rejected on mechanical accuracy first.

### ❌ REJECTED — C. Child laying hands on a wounded soldier

The exact healer-priest cliché the task warns against, it puts a second figure in frame, and — worse
— it visually _is_ `FRIENDLY_CHOSEN`, which is Card 02's mechanic. Rejected: it would make Cards 01
and 02 illustrate the same effect.

### ❌ REJECTED — D. Child cradling a floating orb of light

Direct collision with the flagship. `docs/art-bible-01.md:317-321` records the Matriarch's signature
as staff-plus-**orb cradled in the palm with light-strand tendrils**. Repeating the orb one rarity
band down would read as a knock-off of the faction's most valuable image.

### ❌ REJECTED — E. Child asleep beneath a blossoming canopy

Pretty, and wrong twice: nothing restorative is happening (the card is an action on play, not a
state), and the arching flowering canopy is called out in the art bible (`:309-313`) as a motif
**unique to BOND's flagship composition**. Spending it on a one-drop devalues the Legendary.

### ❌ REJECTED — F. Child lighting a small lamp or candle

A genuinely good BOND image — which is precisely why it is reserved. Fire, lamp and hearth belong to
Card 03 `light-of-the-hearth`, whose entire name is the motif. Rejected to protect that card.

---

## 4. Locked visual thesis

> **A child at the garden threshold holds out a single budding spring branch, cupped in both hands,
> toward you. The light is only as big as their hands.**

Every later section is downstream of that sentence. If a rendering contradicts it, the rendering is
wrong, not the sentence.

---

## 5. Focal hierarchy

Strict order. Anything that inverts it is a fail.

1. **The cupped hands and the glowing sprig** — brightest point, highest local contrast, at the
   optical centre of the frame.
2. **The child's face** — clearly readable, calm, lit by bounce from the sprig below.
3. **The plain tunic and the forward-leaning posture** — carries the offering gesture.
4. **The threshold** — a worn low step, a few flagstones, a vine-covered low wall no higher than the
   child's shoulder.
5. **The garden beyond** — soft, out of focus, golden. Information only, never detail.

The sprig must be the brightest thing in the picture by a clear margin. If the background sky is
brighter than the hands, the picture has failed §1's "small" requirement no matter how small the
sprig is drawn.

---

## 6. Subject, pose, expression

- One figure only. No second person anywhere in frame, foreground or background.
- A child of roughly eight to ten years, of indeterminate/neutral presentation, shown at
  three-quarter length from mid-thigh up, standing.
- Posture: a slight forward lean, weight settled, both arms extended forward and slightly up, elbows
  soft, hands cupped together at roughly chest height and angled toward the viewer so the contents
  are visible.
- Head tilted very slightly up toward the viewer; eyes open and looking out of frame at the viewer.
- Expression: quiet, steady, a little shy — offering something, not performing. **Not** beatific, not
  tearful, not triumphant, not pleading.
- Hair: loose, simple, shoulder-length or shorter, a little untidy. No crown, no circlet, no woven
  flowers in the hair — the flower crown is the Matriarch's (`art-bible-01.md:307`).

### Safeguarding — hard constraints, not stylistic preferences

The subject is a child. These are absolute and any violation is an automatic reject regardless of
how good the rest of the image is:

- fully clothed at all times, in loose opaque clothing that covers shoulders, torso and legs to below
  the knee;
- no bare midriff, no bare shoulders, no off-shoulder or sheer fabric of any kind (the Matriarch's
  sheer gauze cape is explicitly **not** inherited by this card);
- no clinging, wet, translucent or form-revealing fabric;
- no coy, flirtatious, provocative or adult-coded posing, framing or expression;
- no low-angle, upward or otherwise sexualizing camera;
- no cosmetics, jewellery beyond the single plain cord in §7, or adult styling;
- the child is never depicted injured, distressed, bleeding, restrained or in danger.

The intended read is a plainly dressed village child holding out a plant. Anything that reads
otherwise is rejected without discussion.

---

## 7. Costume and materials

BOND's material language is soft, organic and living (`art-bible-01.md:305-308`). Card 01 takes the
plainest possible version of it.

- A simple long-sleeved undyed linen tunic in warm ivory, falling to mid-calf, loosely belted with a
  plain woven cord. Soft, worn, slightly creased — a garment that is used.
- Exactly one decorative element: a single line of **green vine embroidery** at the hem or cuff,
  hand-stitched, a few centimetres of it. That is the whole costume budget.
- Bare feet or plain simple sandals; a little garden dust is welcome.
- **No metal at all.** No gold filigree, no clasps, no jewellery, no buckles. The Matriarch's dense
  gold vine embroidery is a Legendary signature; a COMMON gets thread, not metal.
- No armour, no plate, no pauldrons — BOND wears none anywhere (`art-bible-01.md:308`).
- No cloak, cape, gauze, veil or train.

The sprig itself: one slender woody branch about the length of a forearm, three or four pale
blossoms (white with a warm cream centre), a few small new leaves, one or two unopened buds. It is a
real cutting, not a magical artefact — no carved runes, no geometry, no metal mount.

---

## 8. Environment and background hierarchy

The environment exists to say "BOND garden, low and domestic" in one glance and then get out of the
way.

- **Foreground:** a single worn stone threshold step and a few overgrown flagstones with moss and
  small ground flowers in the joints.
- **Midground:** a low dry-stone or timber garden wall, waist-to-shoulder height on the child, with
  vines and small blossoms running over it. Optionally a simple open wooden gate, unlatched — it
  reinforces «при выходе», arrival.
- **Background:** soft-focus warm garden depth — indistinct greenery, a few blossom clusters, warm
  golden-hour haze. Rendered at low contrast and low detail.

### Environment information ceiling

Card 01 is the humblest card in the faction and must not tour the House's estate.

- **Nothing architectural rises above the child's shoulder line.** No columns, no balustrades, no
  domes, no arches, no terraces, no waterfalls. All of those appear in the Matriarch
  (`art-bible-01.md:309-313`) and are the flagship's staging.
- **No arching flowering canopy over the top of the frame.** Flagship motif, reserved.
- **No interior.** No room, no hearth, no fire, no furniture — reserved for Card 03.
- **No crowd, no attendants, no figures of any kind in the background.** The Matriarch's
  solid-asymmetric domestic grouping (`art-bible-01.md:336-341`) is a Legendary device.
- No banners, heraldry, statuary, monuments or inscriptions.

If the upper third of the frame contains anything other than soft out-of-focus foliage and warm
light, it is too much.

---

## 9. Lighting, palette and value — with measured targets

Lighting is BOND's **warm golden-hour diffuse backlight** (`art-bible-01.md:314-316`): natural
late-afternoon sun through leaves, soft-edged, no harsh directional shadow, no chiaroscuro, no cold
fill.

Two light sources only:

1. **Ambient golden-hour daylight** from behind and slightly above, rimming the child's hair and
   shoulders warmly.
2. **The sprig**, a small warm-gold local source that under-lights the palms, the fingers, the
   underside of the chin and the front of the tunic — and nothing further away than the child's own
   chest. Its falloff must be visibly short.

Palette: warm ivory and pale sage-green base, warm amber light reading through as
`FACTION_ACCENT.BOND` `#e0a458` (`packages/ui/src/factions.ts:26`), living greens, warm neutral
stone. Per `art-bible-01.md:327-330`, the amber comes from _light and colour grade_, not from a
literal amber garment.

Forbidden: any cold blue or violet cast, cool white key light, grey overcast grading, harsh cast
shadow, rim-lit chiaroscuro, or a desaturated "sacred" wash.

### Measured targets, and how they were obtained

All figures below were measured during this task from the shipped `.webp` files, using the same
method the Art Pack 03 documents use: take the master, crop to the `CardView` 3:4 window
(width preserved, rows centre-cropped), resize to **92 × 123**, then take the mean of Pillow's
`ImageFilter.FIND_EDGES` for edge density and the 5th/95th grayscale percentiles for spread. Colour
figures are means over the same 92 × 123 crop.

Reproducing the Art Pack 03 numbers with this method lands within roughly ±2 of the published values
(`warden-of-the-barrier` reproduces as 29.93 against a published 29.82; `rune-of-the-echoing-dusk` as
19.85 against 21.80), the residual coming from resample-filter choice. **Targets below are therefore
bands, not exact numbers**, and a QA measurement within a band passes.

Relevant shipped comparisons:

| Card                            | Faction / rarity         | Edge  | Spread | Mean L | R−B       | Sat % |
| ------------------------------- | ------------------------ | ----- | ------ | ------ | --------- | ----- |
| `matriarch-of-the-spring-light` | BOND / LEGENDARY         | 43.46 | 152    | 131.4  | **+62.0** | 42.1  |
| `high-warden-of-the-white-rune` | PURIFICATION / LEGENDARY | 45.78 | 171    | 131.2  | +27.3     | 21.2  |
| `seal-of-the-curse`             | PURIFICATION / RARE      | 36.42 | 167    | 147.4  | −3.2      | 7.0   |
| `warden-of-the-barrier`         | PURIFICATION / RARE      | 29.93 | 123    | 181.2  | +1.2      | 2.9   |
| `acolyte-of-the-white-rune`     | PURIFICATION / COMMON    | 27.04 | 134    | 174.3  | +11.8     | 8.1   |
| `rune-of-curse-breaking`        | PURIFICATION / EPIC      | 26.70 | 142    | 164.5  | +1.3      | 3.5   |
| `rune-of-the-echoing-dusk`      | SHADOW / EPIC            | 19.85 | 56     | 28.5   | −11.3     | 29.9  |

Two things fall out of that table and both are useful:

- **The two flagships are the two busiest images in the entire set** (45.78 and 43.46). At 92 px,
  LEGENDARY is carried by density. A COMMON must be visibly quieter.
- **Warmth is a near-perfect faction discriminator.** BOND's flagship sits at R−B **+62.0** with 42%
  saturation. The entire shipped PURIFICATION set sits between **+1.2 and +11.8** with 2.9–8.1%
  saturation. Nothing else in the set separates the two "light-coloured, benevolent" factions so
  cleanly.

**Targets for Card 01:**

| Metric                    | Target               | Rationale                                                              |
| ------------------------- | -------------------- | ---------------------------------------------------------------------- |
| Edge density              | **24.0 – 31.0**      | Below the Matriarch's 43.46 by a wide margin; near `acolyte` 27.04     |
| Hard edge ceiling         | **< 36.0**           | Must not reach `seal-of-the-curse` (RARE) territory                    |
| Warmth R−B                | **≥ +30**            | The binding "BOND not PURIFICATION" test; flagship is +62              |
| Saturation                | **≥ 22 %**           | PURIFICATION tops out at 8.1 %                                         |
| Mean luminance            | **110 – 160**        | Near the flagship's 131.4; must **not** land in PURIFICATION's 164–182 |
| Grayscale spread (p95−p5) | **≥ 110**            | Keeps the thumbnail from going flat; flagship 152                      |
| Metallic gold coverage    | **≤ 1 %**, ideally 0 | A COMMON's warmth comes from light, not from metal                     |

The warmth and luminance targets together are the strongest single instruction in this brief: a pale,
near-neutral, high-key image is a PURIFICATION image, and this card must not be one.

---

## 10. Surfaces and crop-safe geometry — verified from the implementation

`child-of-the-spring-light` is a **CHARACTER**, and `apps/web/src/app/admin/art-review/page.tsx:162`
sets `const hasBoardSlot = displayCard.type === 'CHARACTER'`. So this card **does** occupy a
Battlefield creature slot and gets the full **nine-surface** review — unlike Art Pack 03's Cards 02
and 04, which were EVENT and RUNE and reviewed on eight.

| #   | Surface                            | Source                                                         | Crop |
| --- | ---------------------------------- | -------------------------------------------------------------- | ---- |
| 1   | Raw master                         | —                                                              | —    |
| 2   | `CardView`                         | `packages/ui/src/components/CardView.tsx:71`                   | 3:4  |
| 3   | `CardDetailDrawer`                 | `apps/web/src/components/CardDetailDrawer.tsx:111`             | 4:5  |
| 4   | `HandCardPreview`                  | `apps/web/src/components/battlefield/HandCardPreview.tsx:62`   | 7:9  |
| 5   | `CreatureSlot` (Battlefield board) | `apps/web/src/components/battlefield/CreatureSlot.tsx:113,139` | 3:4  |
| 6   | `/admin/art-review` desktop        | `apps/web/src/app/admin/art-review/page.tsx`                   | —    |
| 7   | `/admin/art-review` at 390 px      | same                                                           | —    |
| 8   | 92 px thumbnail legibility         | `CardView` `size="xs"` → `max-w-[92px]`                        | 3:4  |
| 9   | Hierarchy beside the Matriarch     | side-by-side at 92 px                                          | 3:4  |

All artwork surfaces render `object-cover` (`CardView.tsx:75`, `CreatureSlot.tsx:141`,
`HandCardPreview.tsx:62`), and `HandCardPreview` is `h-36 w-28` = 144 × 112 px, i.e. exactly 7:9.

### Crop maths — width is never trimmed, only rows

On the standard 1024 × 1536 master, `object-cover` with a centre anchor preserves full width and
trims rows symmetrically:

| Crop    | Consumer                   | Visible rows | Trim                | Surviving rows |
| ------- | -------------------------- | ------------ | ------------------- | -------------- |
| 3:4     | `CardView`, `CreatureSlot` | 1365         | 171 (85 / 86)       | 85 – 1450      |
| 7:9     | `HandCardPreview`          | 1317         | 219 (109 / 110)     | 110 – 1426     |
| **4:5** | `CardDetailDrawer`         | **1280**     | **256 (128 / 128)** | **128 – 1408** |

**4:5 is binding.** Rows outside 128–1408 are visible only in the raw master.

Placement rules:

- **Strict safe zone: rows 260 – 1280.** Everything that carries meaning lives here.
- **The cupped hands and sprig — the focal point — must sit between rows 700 and 1000**, centred
  horizontally within columns 300–724. That keeps them near the optical centre of all three crops
  and untouched by any of them.
- **Top of the head at row ≥ 300.** Art Pack 03 Card 01 shipped with the hair crown at row ~130
  against the 4:5 cut at 128 — a two-pixel margin that was accepted but flagged. Do not repeat it.
  Row 300 gives ~170 px of real clearance.
- **Nothing essential below row 1280.** The bottom of the tunic and the threshold step may be
  trimmed; the hands must not be anywhere near the lower cut.
- Rows 0–260 and 1280–1536 are atmosphere only: soft foliage, warm haze, out-of-focus stone.

---

## 11. Rarity — how COMMON is actually carried

Verified from `packages/ui/src/rarity.ts`: `RARITY_FRAME_CLASS.COMMON` is
`'border-raido-mist/35 bg-raido-graphite'` — a plain grey border, no coloured glow, and
`RARITY_GLOW_CLASS` is deliberately null for COMMON and RARE. **The frame gives this card no help at
all.** Unlike EPIC's violet shadow or LEGENDARY's gold, a COMMON is a picture in a grey box. The rank
read must be entirely inside the artwork.

BOND's rarity ladder, established here so Cards 02–04 inherit it:

| Rarity          | Figure                              | Light                                      | Setting                                              | Ornament                                    |
| --------------- | ----------------------------------- | ------------------------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| **COMMON** (01) | one child, three-quarter length     | contained inside two hands                 | a low threshold, nothing above the shoulder          | one line of green thread                    |
| RARE (02, 03)   | one adult, or an interior           | larger than a hand, smaller than the frame | a room or an enclosed garden corner                  | limited gold, still no plate                |
| EPIC (04)       | **no figure**                       | emitted by an object                       | a formal setting for that object                     | a deliberate rune device                    |
| LEGENDARY       | full ceremonial figure + attendants | radiating from the person outward          | monumental terraced garden, dome, waterfalls, canopy | dense gold vine filigree, staff, orb, crown |

Against the Matriarch specifically, Card 01 gives up, deliberately and completely: the staff, the
blossom finial, the cradled orb with light tendrils, the flower crown, the gown, the sheer cape, the
gold embroidery, the attendants, the architecture, the waterfalls, the overhead canopy, and most of
the sparkle. What it keeps is the faction's warmth, its plant life and its softness.

---

## 12. The 92 px thumbnail

At `size="xs"` the card renders inside `max-w-[92px]` at 3:4 — about 92 × 123 px. This is the read
that decides whether the card works.

Required at 92 px:

- one small compact figure mass, low-centre in the frame;
- **a single bright warm point at chest height**, clearly the brightest thing present;
- an unmistakably warm overall cast — the card should look warm before any shape is identified;
- a silhouette distinguishable at a glance from the Matriarch's tall bell-gown-plus-vertical-staff:
  Card 01 is short, rounded and armed-forward, with no vertical line.

Failure conditions at 92 px:

- the sprig-glow merges into the background light and the card becomes an undifferentiated warm smear;
- the child reads as an adult;
- the image reads cool, pale or neutral (see the R−B target in §9);
- background foliage detail competes with the figure and the whole thing turns to noise.

---

## 13. Differentiation checks

**vs. the Matriarch (BOND LEGENDARY, live):** child not matriarch; three-quarter length not full
ceremonial; hands-forward-to-viewer not staff-and-orb; one sprig not a radiating orb; threshold not
terraced estate; solitary not attended; linen not embroidered gown; edge density target 24–31 against
her 43.46.

**vs. PURIFICATION (`acolyte-of-the-white-rune`, `warden-of-the-barrier`, `seal-of-the-curse`,
`rune-of-curse-breaking`):** warm-gold and saturated against their near-neutral high-key white
(R−B ≥ +30 vs. their +1.2…+11.8; saturation ≥ 22 % vs. their ≤ 8.1 %); living plant against engraved
stone and metal; organic curved forms against straight geometric filigree; a low domestic garden
against vertical monumental architecture; restoring against cleansing.

**vs. SHADOW / VEIL / MYSTERY / COSMIC:** those sit at mean luminance 27–47 and R−B ≤ −4.5 (except
`keeper-of-smoldering-embers`, which is warm but very dark at mean 28.8). Card 01's 110–160 mid-key
warmth cannot be confused with any of them.

**vs. the three future BOND cards** — see the reservation table in §14.

---

## 14. Visual reservations for Cards 02–04

Card 01 spends only what is listed in its own row. Everything in the other rows is off-limits to this
card. These are reservations, not briefs; Cards 02–04 will be briefed separately.

| Card                                            | Reserved to it — do not use on Card 01                                                                                                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01 `child-of-the-spring-light`** (this card)  | the child subject; cupped hands; the budding sprig; the offer directed at the viewer; the garden threshold and gate                                                                               |
| 02 `keeper-of-the-promise`                      | an adult guardian; a promise token — knotted cord, ring, keepsake; a protective stance over another figure; a second figure in frame; a gesture directed inward at an ally                        |
| 03 `light-of-the-hearth`                        | **all fire, flame, lamp, lantern, candle and hearth**; any interior room; furniture; the shared-warmth gathering staging; the only fire source in BOND                                            |
| 04 `rune-of-reflected-light`                    | mirrors, reflective surfaces, reflected or split light; shield and ward geometry; a formal rune device; a figureless composition                                                                  |
| `matriarch-of-the-spring-light` (live flagship) | staff with blossom finial; cradled light-orb with tendrils; flower crown; attendant grouping; terraced garden, dome, balustrades, waterfalls; overhead flowering canopy; dense gold vine filigree |

The one deliberate overlap: **all five cards share warm golden-hour light and living plant matter.**
That is the faction, and it should repeat.

---

## 15. Automatic rejects

Any one of these fails the candidate outright.

**Mechanical**

1. More than one recipient implied, or any aura reaching beyond the child's own body.
2. A shield, ward, dome, barrier or protective geometry anywhere.
3. Healing directed at a second character in frame.
4. Any cleansing, un-cursing or dispelling read (chains breaking, dark matter lifting, a curse mark).
5. Any combat read: a weapon, a fighting stance, an enemy, aggression.
6. Any injured or bleeding body, including the child's.

**Safeguarding** — see §6; restated because it is absolute

7. Any nudity, partial undress, bare midriff or bare shoulders.
8. Sheer, wet, clinging or form-revealing fabric.
9. Any suggestive pose, framing, expression, camera angle or styling.

**Faction**

10. Cool white, blue, violet or grey-overcast light.
11. Straight geometric gold filigree (that is PURIFICATION).
12. Engraved stone runes, tablets or inscriptions.
13. Metal armour, plate, mail or pauldrons.
14. Vertical monumental architecture — cathedral, spire, column, dome, arch, balustrade.
15. A closed rune-circle on the ground.

**Rarity**

16. Staff, sceptre, wand or rod of any kind.
17. A cradled or floating orb of light.
18. A flower, vine or metal crown, circlet or tiara.
19. Any second figure, attendant, crowd or silhouetted onlooker.
20. Gold metal above ~1 % coverage; any jewellery beyond the plain belt cord.
21. Dense sparkle-mote fields (a very few motes near the sprig are acceptable).
22. Waterfalls, terraces, or an arching flowering canopy across the top of the frame.

**Reserved motifs**

23. Fire, flame, candle, lamp, lantern or hearth (Card 03).
24. Any interior room (Card 03).
25. Mirrors, reflections or split light (Card 04).
26. A knotted cord, ring or keepsake token presented as the subject (Card 02).

**Craft**

27. Text, lettering, signature, watermark, logo or UI element anywhere in the image.
28. The sprig-glow not being the brightest element in the frame.
29. The head above row 300 or the hands outside rows 700–1000.
30. Photographic realism at odds with the set's painted-illustration finish, or a rendering so soft
    the child's face is not readable at 92 px.

---

## 16. Acceptance checklist — walk this mechanically at QA

Gameplay truth

- [ ] Exactly one figure; no second person anywhere.
- [ ] The gesture is directed out of frame at the viewer.
- [ ] The only glow is inside the cupped hands, and its falloff dies within the child's own chest.
- [ ] No shield, no cleanse, no combat, no mass effect.

Safeguarding

- [ ] Child fully clothed, loose opaque garment, shoulders and legs covered to below the knee.
- [ ] No suggestive pose, framing, expression, camera angle or styling.
- [ ] Child undamaged, calm, not distressed.

Faction and rarity

- [ ] Warm golden-hour light, no cool cast, no harsh shadow.
- [ ] Living plant matter present; no engraved stone, no straight geometric filigree.
- [ ] No staff, no orb, no crown, no attendants, no monumental architecture, no canopy.
- [ ] Metallic gold ≤ 1 %; no jewellery beyond the belt cord.
- [ ] Nothing architectural above the child's shoulder line.

Measured (method in §9)

- [ ] Edge density 24.0 – 31.0, hard ceiling 36.0.
- [ ] R−B ≥ +30.
- [ ] Saturation ≥ 22 %.
- [ ] Mean luminance 110 – 160, and outside 164 – 182.
- [ ] Grayscale spread ≥ 110.

Geometry

- [ ] Master is exactly 1024 × 1536.
- [ ] Top of head at row ≥ 300.
- [ ] Cupped hands within rows 700 – 1000 and columns 300 – 724.
- [ ] Nothing essential outside rows 128 – 1408; ideally nothing outside 260 – 1280.

Thumbnail

- [ ] At 92 px: compact low-centre figure, one bright warm point at chest height, unmistakably warm.
- [ ] At 92 px beside the Matriarch: obviously the lesser card, and obviously the same faction.

---

## 17. Generation prompt

Positive:

> Painted fantasy card illustration, vertical 2:3, 1024×1536. A single young child, about eight to
> ten years old, standing at three-quarter length in a small overgrown garden at golden hour. The
> child wears a simple loose undyed ivory linen tunic with long sleeves, falling below the knee,
> belted with a plain woven cord, with one small line of green vine embroidery at the cuff; bare feet
> on worn mossy flagstones. The child leans very slightly forward and holds both hands cupped
> together at chest height, extended toward the viewer, offering a single small budding spring branch
> with three or four pale cream blossoms and a few new leaves. The branch gives off a soft warm
> golden glow contained entirely within the cupped hands, under-lighting the palms, fingers and the
> child's chin; nothing further away is lit by it. The child's face is calm, quiet and slightly shy,
> looking out at the viewer; loose shoulder-length untidy hair, no crown and no ornament. Behind:
> a worn low stone threshold step, a low vine-covered garden wall no higher than the child's
> shoulder, and soft out-of-focus warm greenery. Warm golden-hour sunlight from behind and above rims
> the hair and shoulders; light is soft and diffuse with no harsh shadow. Palette of warm ivory, pale
> sage green, living greens, warm amber light and warm neutral stone; saturated warm colour grade.
> Soft painterly illustration finish consistent with a fantasy trading-card set. Humble, modest,
> everyday — a village child offering a plant.

Negative:

> second person, adult, crowd, attendants, background figures, silhouetted onlookers, staff, sceptre,
> rod, wand, floating orb, glowing sphere in palm, crown, circlet, tiara, flower crown, jewellery,
> gold armour, metal armour, plate, mail, pauldrons, sword, weapon, shield, ward, barrier, magic
> circle, rune circle on the ground, engraved stone runes, tablet, inscription, straight geometric
> gold filigree, cathedral, spire, column, dome, arch, balustrade, terrace, waterfall, monumental
> architecture, arching flowering canopy across the top, interior room, furniture, hearth, fireplace,
> fire, flame, candle, lamp, lantern, mirror, reflection, cool white light, blue light, violet light,
> grey overcast, harsh shadow, chiaroscuro, dramatic rim light, desaturated, washed out, pale
> high-key white, heavy sparkle particles, dense light motes, radiant aura, large glow, beams of
> light, wings, halo, wounded person, blood, injury, bandage, distress, tears, text, letters,
> signature, watermark, logo, UI, frame, border, photographic realism, 3D render, bare shoulders,
> off-shoulder, sheer fabric, translucent clothing, wet clothing, midriff, short skirt, suggestive
> pose, adult styling, makeup

---

## 18. If the first render drifts — regeneration guidance

Address one axis at a time; do not restack every note into one prompt.

- **Glow too large / aura formed** → shorten falloff explicitly: "the glow does not reach past the
  child's own chest; the background is lit only by sunlight." Add `radiant aura, large glow, glowing
body` to the negative.
- **Reads cool or pale (R−B below +30)** → strengthen the grade: "strong warm amber golden-hour
  colour grade throughout, warm shadows." Add `pale, high-key white, neutral grey, cool light`.
- **Too busy (edge density above 31)** → simplify the background: "background is soft out-of-focus
  greenery only, minimal detail, no architecture."
- **Child reads as adult** → "small child, eight to ten years old, child proportions, large head
  relative to body, short stature." Add `teenager, young woman, adult` to the negative.
- **Architecture crept in** → name the offenders individually in the negative; they are stubborn.
- **Head sits too high in frame** → "full head clearance above; leave generous empty space above the
  hair."
- **Any safeguarding issue at all** → regenerate from scratch. Do not attempt to patch, crop or
  retouch it.

---

## 19. Generation ownership — Claude does not generate this image

Claude Code cannot produce the master. The image is generated by the owner or a designated image
model, then transported into the repository over the established Actions-runner path with binary
integrity gates (size, SHA-256, git blob SHA, RIFF/FourCC, dimensions, full decode) before any commit
— see the transport rule in `docs/AGENT_STATE.md`.

Output contract for whoever generates it:

| Property   | Required value                                                             |
| ---------- | -------------------------------------------------------------------------- |
| Dimensions | exactly **1024 × 1536** (vertical 2:3)                                     |
| Format     | original export, **not** a transcode — plain `VP8 ` for WebP, or a PNG     |
| Content    | no text, watermark, signature, logo, frame, border or UI anywhere          |
| Delivery   | exact original bytes; no re-encode, resize, crop or sharpen after approval |

---

## 20. Explicitly out of scope for this brief

Image generation; candidate transport; any repository artwork file; `seed.ts`; schema or migrations;
gameplay, cost, stats, rarity, tags, ability or effects; the production sync script or workflow; any
Railway, production-database or Vercel state; and Cards 02, 03 and 04, which are reserved in §14 but
not briefed.

The two consumed production confirmations, `SYNC-13-CARD-ART-PRODUCTION` and
`SYNC-14-CARD-ART-PRODUCTION`, remain consumed. Nothing here authorizes a production operation.
