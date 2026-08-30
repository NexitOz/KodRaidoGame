# Master-art brief — `warden-of-the-barrier` / «Хранительница Барьера»

Art Pack 03, Card 03 of 4. PURIFICATION / CHARACTER / RARE / cost 3.

**Status: APPROVED BY OWNER 2026-08-30. All four open decisions resolved (§14). Generation of a
master-art candidate is authorized against §13. Integration, promotion and production sync are NOT
authorized.**

---

## 1. Canonical card facts

Read directly from `apps/game-server/prisma/seed.ts`, not from memory.

| Field                      | Value                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `slug`                     | `warden-of-the-barrier`                                                                             |
| `name`                     | Хранительница Барьера                                                                               |
| `type` / `rarity` / `cost` | CHARACTER / RARE / 3                                                                                |
| `attack` / `health`        | **2 / 5**                                                                                           |
| `tags`                     | `['Purification']`                                                                                  |
| `abilityText`              | При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.       |
| `effectJson`               | `ON_PLAY` → `SHIELD` / `SELF`; `ON_PLAY` + `RESONANCE_TIER_AT_LEAST 5` → `CLEANSE` / `FRIENDLY_ALL` |

### What the mechanics actually do — verified in the engine

Two facts from `packages/game-engine` shape the whole image, and both correct the obvious guess:

1. **`SHIELD` is a one-shot absorb, not a persistent aura.** In `effects/primitives.ts`, a unit
   holding `SHIELD` has the status stripped and emits `SHIELD_CONSUMED`, negating the **entire** next
   damage instance regardless of its size — then it is gone. So the barrier is **a single ward,
   raised once and spent once.** It is not a forcefield she maintains, and it must not be drawn as
   an ongoing energy bubble.
2. **`CLEANSE` removes `CURSE` and `SILENCED`** (`NEGATIVE_STATUSES` in `effects/interpreter.ts`) —
   at Resonance 5+, from **every** friendly unit.

Her stat line reinforces it: **2 attack, 5 health.** She is a body that absorbs, not one that kills.

### Where she sits in the faction's own story

The three PURIFICATION cards in this pack form one continuous gesture, and Card 03 completes it:

- Card 01 Acolyte (COMMON) — cleanses **one** ally.
- Card 02 Seal (RARE EVENT) — **applies** Curse to one enemy.
- **Card 03 Warden (RARE CHARACTER) — cleanses the _entire_ allied line, and shields herself.**

She is the Acolyte's gesture scaled to the whole formation. The brief should let a player who owns
Card 01 recognise the same order, the same materials, and the same rune language — at greater scale
and with real armor.

---

## 2. The central design problem, and the decision that resolves it

**The obvious device is already taken by the LEGENDARY.**

`docs/art-bible-01.md` records the approved flagship `high-warden-of-the-white-rune`'s signature
object as **"a large rune-engraved round shield with a compass/star emblem,"** dual-wielded with a
ceremonial spear. The flagship is _also_ the faction's shield-bearer. Handing Card 03 a big round
rune shield would produce a cut-price High Warden — the single worst outcome available, because it
damages the Legendary as much as it damages this card.

This is the same class of problem Card 02 faced (PURIFICATION casting a "Curse" without the
forbidden crimson) and it is solved the same way: **by reading the mechanic more literally than the
genre does.**

### The locked reading: she does not _carry_ a shield. She _plants a barrier._

A shield is personal regalia held on the arm. A **barrier** is defensive infrastructure placed into
the ground. That distinction is the whole card:

> **She has just driven a segmented white-steel ward-screen into the ground and locked it upright.
> It is one section of a longer barrier line whose engraved channel runs off-frame to either side.**

This single object carries both halves of the ability without inventing anything:

- **`SHIELD` / self** — _her_ section is planted and braced in front of her body. Physical,
  singular, already raised. A thing that will take one blow and be spent, not a bubble that hums.
- **`CLEANSE` / `FRIENDLY_ALL` at Resonance 5+** — the lit rune channel **continues past both frame
  edges**, implying the same barrier standing in front of every ally. The whole line is covered by
  the object we can see one segment of.

The off-frame continuation is the key device. It states "all allies" **without drawing allies** —
which matters, because the ranked congregation is the flagship's reserved crowd device and is
forbidden here (§8, §11).

It also honours the faction's hardest rule: PURIFICATION's magic is **engraved and material-bound**,
never conjured. The barrier is a manufactured object with cut rune channels. Nothing is being cast.

---

## 3. Focal hierarchy

Strict, and enforced in this order:

1. **Primary — her face and the brace of her stance.** She is a CHARACTER; the face must survive
   92 px. This is the one place Card 03 outranks Card 02, which had no face at all.
2. **Secondary — the ward-screen and its lit rune channel.** Largest shape, brightest value, but it
   supports the figure rather than replacing her.
3. **Tertiary — armor detail on torso and gauntlets.** Reads at `CardView` size, dissolves by 92 px.
4. **Quaternary — the environment.** Must collapse to a flat pale field at 92 px (§8).

If a viewer at thumbnail size reads "a barrier" before "a warden," the hierarchy has failed and the
candidate is rejected (§11).

---

## 4. Silhouette — the thing that must differ from every neighbour

| Card                           | Silhouette                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| COMMON Acolyte                 | narrow upright column, three-quarter, bare head, small tablet                         |
| RARE EVENT Seal                | no figure at all — a diagonal arm and a clamped fist                                  |
| **LEGENDARY High Warden**      | **frontal, symmetric, statuesque, wide** — cape, round shield, crowned vertical spike |
| **RARE Warden of the Barrier** | **asymmetric braced L** — vertical slab at one side, figure angled behind it          |

**Specification.** Three-quarter view, weight dropped onto the forward leg, torso angled ~20–30°
into the barrier, one gauntleted hand still flat on the screen's top rail having just locked it
down. The other arm hangs free and ready — **empty.** She carries no second weapon.

That produces a strong asymmetric L / triangle: a hard vertical on one side, a diagonal human brace
against it. It cannot be confused with the flagship's symmetric pyramid, and it reads as _effort_ —
someone who has just physically set something heavy — rather than ceremony.

**No cape. No mantle.** Both are flagship devices and both widen a silhouette toward monumentality.

---

## 5. The ward-screen — material design

- **Form:** a segmented upright panel, roughly waist-to-shoulder height, noticeably **rectangular
  with a flattened top** — never a disc, never a round boss. Two or three vertical segments joined
  by visible hinges, so it reads as something that folded for carrying and has been opened out.
- **Anchoring:** the bottom edge bites into the ground — a spike or foot-plate driven in, with a
  small amount of displaced dust or grit at the contact point. This is the detail that says
  _planted_, not _held_. It must be legible.
- **Material:** the same brushed / satin white-steel established by Cards 01 and 02 — **matte, not
  mirror-polished.** Plate seams, rivets, hinge pins, a visible locking latch on the top rail.
- **Rune channel:** a single engraved channel running horizontally across the panel at roughly
  two-thirds height, filled with cool blue-white light — the same inlaid-light treatment approved on
  Card 02's clamp. It exits **both** side edges of the panel and continues, dimmer and defocused,
  past both frame edges.
- **RARE, not LEGENDARY:** engineered precision, not decoration. Hinges, banding, a latch, cut
  channels. **No compass/star emblem, no heraldic boss, no filigree fields** — those are the
  flagship's.

**The channel light is the only emissive element in the frame.** Nothing else glows.

---

## 6. The figure — armor, hands, head

**Armor — materially richer than Card 01, well short of the flagship.**

Card 01 shipped, by explicit owner decision, "light plain standard-issue armor": a single smooth
cuirass, plain gorget, two small pauldrons, simple vambraces, **bare hands**. Card 03 must read as a
career soldier of the same order:

- structured white-steel cuirass with a defined **placard and articulated fauld/tassets** over the
  hips
- proper **gorget** and a short mail collar at the throat
- **articulated pauldrons** with a visible lame or two — larger and jointed, where Card 01's are
  small and plain
- **full articulated gauntlets.** This is a deliberate, checkable inversion of Card 01's bare hands:
  she handles a heavy object, so she is gloved. It is one of the fastest rank reads in the pack.
- **greaves** on the forward leg, visible because of the braced stance
- Finish: brushed/satin white-steel, matte. Clean pressed edges, intact material — **no tattering,
  ever.**

**Head — bare, uncovered, uncrowned.**

Bare-headed, hair bound tightly back for work. Rationale:

- the face must survive 92 px, and a visor destroys that;
- a crown or tiara is the flagship's exclusive vertical spike (§2, §11);
- a full helm collapses her into a generic paladin, the primary failure mode named in the task.

A plain browband or a simple circlet-free securing strap is acceptable. Anything that reads as a
crown, halo, or ceremonial headdress is an automatic reject.

**Expression:** composed, focused, braced. Not serene, not triumphant, not devotional. She is doing a
job that takes effort.

---

## 7. Lighting and value structure

Faction rule, non-negotiable: **bright, diffuse, near-shadowless.** No deep chiaroscuro, no dramatic
key from below, no cast shadow crossing the face.

But value separation still has to survive desaturation at 92 px (§9). The way to get both is a
disciplined four-band structure with **no crushed blacks**:

| Band                                                     | Target luminance              |
| -------------------------------------------------------- | ----------------------------- |
| Rune channel and the panel's lit edge                    | 90–100%                       |
| Ward-screen face (white steel)                           | 72–88%                        |
| Armor and skin                                           | 55–75%                        |
| Background                                               | 45–62%                        |
| Deepest accents — armor undersides, ground contact, hair | **25–35% — never below ~10%** |

Card 02 measured a 92 px grayscale spread of 155 (p5 30 → p95 185) and passed comfortably. **Card 03
should target p5–p95 ≥ 140 with p5 no lower than ~25.** That is a real, measurable acceptance
threshold rather than an adjective.

**VFX:** cold light motes only, sparse. **No warm embers, no ash, no smoke** — those read SHADOW and
are forbidden faction-wide.

---

## 8. Environment — the explicit policy Card 02 left ambiguous

Card 02's single genuine divergence from its brief was an environment that described an interior
arcade where §7 had asked for "near-abstract… almost no information." The owner accepted it, but it
should not have been discovered at QA. So Card 03 fixes the class of error, not just the instance.

**Decision: RESTRAINED READABLE ENVIRONMENT, with a hard information ceiling.**

**Why this and not near-abstract.** Card 01 shipped with "a modest cloister arcade" and Card 02's
approved image carries a pale interior arcade. Two of the three cards in this pack already sit
inside soft Order architecture. Mandating near-abstract for Card 03 would make it the visual odd one
out of its own pack, and would fight a precedent the owner has now approved twice. Consistency wins.

**The ceiling — every item is checkable, not interpretive:**

1. **At most two** distinguishable architectural forms (e.g. one wall plane plus one pier). Not
   three.
2. Everything beyond roughly two metres is **defocused**; no background edge is sharp.
3. **No background element carries a specular highlight** or any hard bright accent.
4. Background luminance stays inside 45–62% (§7) and never exceeds the ward-screen's face value.
5. **At 92 px the background must collapse to a flat pale field** with no readable form. This is the
   binding test — if an architectural shape is still identifiable in the 92 px thumbnail, the
   ceiling has been breached.
6. Ground plane: plain pale stone, minimal joint lines, enough to receive the barrier's anchor point.

**Still categorically forbidden** — all flagship-reserved: cathedral facade, rose window, halo,
spires, banners, ceremonial staircase, floor rune-circle, crowd, ranked figures, landscape, sky.

---

## 9. Rarity ladder — measurable, not asserted

Real measurements from the Card 02 QA pass, taken on the artwork region of each 92 px `CardView`:

| Card                                      | 92 px edge density (detail) |
| ----------------------------------------- | --------------------------- |
| COMMON `acolyte-of-the-white-rune`        | 20.95                       |
| RARE `seal-of-the-curse`                  | 23.73                       |
| LEGENDARY `high-warden-of-the-white-rune` | 31.85                       |

**Card 03 should land in the 24–28 band** — clearly above the Common, comfortably below the
Legendary. That keeps the ladder Common < Rare < Legendary on _detail density alone_, independent of
the rarity frame, which is the standing requirement.

Practical levers to stay in band: articulated armor and hinge/latch hardware push density up; the
flat panel face, the bare head, the empty second hand and the defocused background pull it back
down.

**Gold budget: ≤ 3% of canvas, hairlines only.** The art bible explicitly warns that the flagship's
diegetic gold filigree must be dialled back on non-Legendary PURIFICATION cards so it does not
misread as a false rarity signal. Card 02 measured 0.01%. Card 03 may carry slightly more than Card
01 as a rank cue, but broad filigree fields are an automatic reject.

---

## 10. Composition and crop-safe geometry

Master format: **1024 × 1536, vertical 2:3, no text, no frame, no UI** — the app composites its own
frame at display time.

Real shipped crop math, centred `object-cover`, full width always preserved:

| Crop | Consumer                       | Visible height | Safe rows    |
| ---- | ------------------------------ | -------------- | ------------ |
| 3:4  | `CardView`, **`CreatureSlot`** | 1365 px        | 85–1450      |
| 7:9  | `HandCardPreview`              | 1317 px        | 109–1426     |
| 4:5  | `CardDetailDrawer`             | 1280 px        | **128–1408** |

**Working safe zone: keep all essential content between y ≈ 260 and y ≈ 1280.** Card 01's ~2–4 px
head clearance is explicitly **not** the target; Card 02's stricter rule produced ~134 px of real
clearance and is the standard now.

**Placement targets:**

- **Head top: y ≈ 300–340.** Against the binding 4:5 cut at row 128 that is **~170–210 px of
  clearance.**
- **Face centre: y ≈ 400–470** — high enough to survive every crop, low enough not to crowd the top.
- **Ward-screen top rail: y ≈ 430–520**, so the hand-on-rail gesture sits beside the face.
- **Rune channel: y ≈ 760–900** — within a few percent of the exact centre of all three crops, so
  the cleanse read never crops out.
- **Barrier anchor / ground contact: y ≈ 1150–1270** — inside the working zone, so the "planted"
  detail survives 4:5.
- The panel's lower body and the figure's lower legs may extend past 1280 and be cropped. That is
  acceptable and even useful — a barrier running out of frame reinforces §2.

Because this is a CHARACTER, later QA adds **`CreatureSlot`** to the surface list alongside
`CardView`, `CardDetailDrawer`, `HandCardPreview`, `/admin/art-review` desktop and 390 px, 92 px, and
92 px grayscale.

---

## 11. Automatic-reject conditions

Any one of these means the candidate does not go to approval.

**Identity failures**

1. Reads as a generic holy mage or paladin rather than this specific braced, planting warden.
2. Reads as LEGENDARY or as a faction leader — crown, tiara, halo, cape, mantle, throne, monumental
   framing, or a second `high-warden-of-the-white-rune`.
3. **Carries a large round shield**, a compass/star emblem boss, or a spear/polearm — all
   flagship-reserved regalia.
4. Reads as COMMON — a plain single-plate cuirass, bare hands, or no barrier object.
5. The barrier is **held on the arm** rather than planted in the ground.
6. The barrier reads as a conjured energy bubble, dome, or forcefield rather than a manufactured
   object.
7. The rune channel does **not** continue past the frame edges, losing the "all allies" read.
8. Robes, vestments, or cloth in place of armor.

**Faction failures**

9. Any crimson, red, violet, magenta, or ember-orange.
10. Deep chiaroscuro, a black silhouette, or a hard cast shadow across the face.
11. Warm embers, ash, or smoke anywhere.
12. Spectral, translucent, or dissolving forms.
13. Tattered, ragged, or frayed material of any kind.
14. Actively-cast open-hand spell effect, beam, projectile, or explosion.
15. Cathedral facade, rose window, halo, spires, banners, staircase, floor rune-circle, or crowd.

**Rarity failures**

16. Broad gold filigree, or gold above ~3% of canvas.
17. Ceremonial or ornate treatment that outranks its RARE slot.
18. 92 px edge density outside roughly 24–28, breaking the measured ladder.

**Structural failures**

19. Essential content outside master rows **260–1280**; head top above ~260.
20. Malformed anatomy — hands, fingers, or the gauntlet-on-rail contact incoherent; the barrier's
    hinges, latch or ground anchor not physically resolvable.
21. Barrier or warden read lost at 92 px grayscale; p5–p95 spread below ~140.
22. A background architectural form still identifiable at 92 px (breaches §8's ceiling).
23. Text, lettering, watermark, signature, logo, UI, stats, or a baked-in card frame anywhere in the
    frame.

---

## 12. Acceptance checklist — walk this mechanically at QA

**Concept**

- [ ] Reads instantly as a warden who has **planted a barrier**, not one holding a shield
- [ ] The ward-screen is a manufactured, hinged, ground-anchored object with visible latch and anchor
- [ ] The rune channel exits **both** frame edges
- [ ] Only the rune channel is emissive; nothing else glows
- [ ] Nothing is being cast from a hand

**Figure**

- [ ] Face clearly readable, bare-headed, uncrowned
- [ ] Armored, not robed; cuirass + gorget + fauld/tassets + articulated pauldrons + **gauntlets** + greaves
- [ ] Materially richer than Card 01, plainly below the flagship
- [ ] Second hand empty; no spear, no second weapon
- [ ] Asymmetric braced L silhouette, not a frontal symmetric pyramid

**Faction**

- [ ] Zero crimson / red / violet / magenta / orange pixels above incidental noise
- [ ] Bright diffuse light; darkest values 25–35%, **nothing below ~10%**
- [ ] Clean pressed edges everywhere; no tattering
- [ ] Cold motes only — no embers, ash or smoke
- [ ] Gold ≤ 3%, hairlines only

**Environment**

- [ ] At most two architectural forms, all defocused
- [ ] No background specular highlight
- [ ] Background luminance 45–62%, never above the panel face
- [ ] **At 92 px the background is a flat pale field with no readable form**

**Structure and surfaces**

- [ ] Head top y ≈ 300–340; ≥ ~170 px clearance above the 4:5 cut at 128
- [ ] Rune channel y ≈ 760–900
- [ ] Barrier anchor visible inside y ≤ 1280
- [ ] Essential story survives 3:4, 7:9 and especially **4:5**
- [ ] 92 px grayscale p5–p95 ≥ 140, p5 ≥ ~25
- [ ] 92 px edge density in the 24–28 band
- [ ] Passes on raw 2:3, `CardView`, **`CreatureSlot`**, `CardDetailDrawer`, `HandCardPreview`,
      `/admin/art-review` desktop + 390 px, 92 px, 92 px grayscale
- [ ] No text, watermark, logo, UI or frame

---

## 13. Generation prompt — **APPROVED AND AUTHORIZED**

Owner-approved 2026-08-30 with the four §14 defaults accepted, including an explicit style decision:
**cinematic realistic premium CCG with a subtle painterly finish.** That is a deliberate correction
away from the more photographic result Cards 01 and 02 shipped with, and the style clause below is
written to enforce it.

The full operational package — parameters, output spec, transport and verification — is
`docs/art-review/warden-of-the-barrier-generation-package.md`.

**Prompt (locked)**

> Cinematic realistic premium collectible-card illustration with a **subtle painterly finish** —
> visible brushwork in the soft passages, painted edges rather than photographic micro-detail, hand-
> rendered rather than photobashed or 3D. Vertical 2:3, 1024×1536.
>
> A woman warden of a white-rune order, seen three-quarters, braced behind a segmented white-steel
> ward-screen she has just driven into the ground and locked upright. Her gauntleted left hand rests
> flat on the screen's top rail; her right arm hangs free and empty. Weight dropped onto her forward
> leg, torso angled into the barrier, composed and focused expression, effort in the stance.
>
> She wears fitted brushed white-steel plate armor: structured cuirass with placard and articulated
> fauld, plain gorget with a short mail collar, articulated pauldrons, full articulated gauntlets,
> greaves on the forward leg. Matte satin metal, never mirror-polished. Clean pressed edges, intact
> material. Bare-headed, hair bound tightly back, no crown, no helm, no halo.
>
> The ward-screen is rectangular with a flattened top, two or three vertical segments joined by
> visible hinges, a locking latch on the top rail, a foot-plate spiked into pale stone with a little
> displaced grit at the contact. A single engraved horizontal channel crosses the panel at
> two-thirds height, inlaid with cool blue-white light; the channel exits both side edges of the
> panel and continues, dimmer and defocused, beyond both edges of the frame.
>
> Bright, diffuse, near-shadowless cold light. No deep shadows, no dramatic key. Sparse cold light
> motes. Pale white-stone interior behind her, strongly defocused, at most a wall plane and one
> pier, no sharp edges and no bright highlights. White, silver and ivory palette with the faintest
> gold hairlines.
>
> Composition: head near the upper third, face clearly readable, the lit channel near the vertical
> centre of the frame, the barrier's ground anchor low but fully visible.

**Negative prompt (locked)**

> photograph, photorealistic, photoreal skin pores, photobash, 3D render, CGI, octane render,
> airbrushed plastic skin,
> round shield, buckler, shield boss, compass emblem, star emblem, heraldry, crest, spear, polearm,
> sword, second weapon, crown, tiara, halo, circlet, helmet, visor, cape, mantle, cloak, robes,
> vestments, tattered cloth, ragged edges, frayed fabric, cathedral, rose window, stained glass,
> spires, banners, staircase, rune circle on the floor, crowd, ranked figures, congregation,
> kneeling followers, energy bubble, force field, dome shield, glowing sphere, spell blast, beam,
> projectile, explosion, casting from open palm, magic swirl, crimson, red, violet, purple, magenta,
> orange, ember, fire, sparks, ash, smoke, rot, veins, tendrils, corruption, deep shadow,
> chiaroscuro, black background, silhouette, translucent, ghostly, spectral, gold filigree fields,
> ornate baroque decoration, text, letters, watermark, signature, logo, UI, card frame, stats,
> border.

---

## 14. Owner decisions — ALL RESOLVED 2026-08-30

All four were approved as the brief's committed defaults, except the style clause, which the owner
sharpened. Nothing here is open.

| #   | Decision           | Resolution                                                                    |
| --- | ------------------ | ----------------------------------------------------------------------------- |
| 1   | Barrier device     | **APPROVED — planted ward-screen.** She plants, she does not carry.           |
| 2   | Environment policy | **APPROVED — restrained readable with the hard ceiling in §8.**               |
| 3   | Head               | **APPROVED — bare head**, uncrowned, unhelmed.                                |
| 4   | House style        | **CHANGED — cinematic realistic premium CCG with a subtle painterly finish.** |

**On #4, the one that moved.** The brief's default was to follow Cards 01 and 02, which both shipped
noticeably more photographic than the older painterly baseline. The owner has instead pulled Art
Pack 03 back toward painterly. §13's style clause and negative prompt are rewritten accordingly —
`photograph`, `photorealistic`, `photobash`, `3D render` and `CGI` are now explicit negatives.

**Expect this card to look different from its two shipped pack-mates.** That divergence is intended
and must not be raised as a QA defect. What it does _not_ license is any drift in the faction's
locked material language: white/silver/ivory, clean pressed intact armor, bright near-shadowless
cold light, and engraved material-bound rune magic all hold exactly as written in §5–§8. The change
is one of _rendering_, not of _content_.

## 15. Explicitly out of scope

No image has been generated, transported, staged, integrated or synced. `seed.ts`, gameplay,
balance, mechanics, schema and migrations are untouched, as are `artworkUrl`, `rightsStatus`, the
production sync script and workflow, and Cards 01 and 02. Card 04 `rune-of-curse-breaking` has not
been started.
