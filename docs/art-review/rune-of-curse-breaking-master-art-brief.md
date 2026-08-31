# Master-art brief — Art Pack 03 Card 04

# `rune-of-curse-breaking` / «Руна Разрушения Проклятий»

**Status:** DRAFT — awaiting owner concept approval.
**Claude does not generate this image.** See §14.

---

## 1. Canonical card facts

Read from `apps/game-server/prisma/seed.ts` on `main` and verified against
`docs/CLAUDE_CURRENT_TASK.md`:

| Field         | Value                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| `slug`        | `rune-of-curse-breaking`                                                       |
| `name`        | Руна Разрушения Проклятий                                                      |
| `type`        | `RUNE`                                                                         |
| `rarity`      | `EPIC`                                                                         |
| `cost`        | 3                                                                              |
| `tags`        | `['Purification']`                                                             |
| `abilityText` | В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников. |
| `effectJson`  | `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`                                      |

None of this is changed by art work.

### What the mechanic actually means, and what it forbids

Three properties drive every visual decision below.

1. **`TURN_START`, every turn — this is not an event.** The card is a permanent emplacement that
   keeps working. Cards 02 and 03 could be staged as a decisive moment; this one cannot. Anything
   that reads as a single instant — a snap, a burst, a shattering, a strike — is wrong, because next
   turn it has to happen again. The image must depict a **system in steady state**, something that
   has been running and will keep running.
2. **`CLEANSE` — removal, not damage.** It strips `CURSE` and `SILENCED` from allies. Nothing is
   destroyed, burned, or killed. The visual verb is _washing / lifting off / carrying away_, never
   _breaking_ in a violent sense — despite the card's Russian name, which reads "destruction of
   curses" idiomatically, not as literal shattering.
3. **`FRIENDLY_ALL` — reach, not a target.** The effect goes out to every ally. The image must
   imply distribution across a group without drawing that group. Drawing ranked allies is
   flagship-reserved language (see §5) and is forbidden.

Also decisive: **`RUNE` is a permanent object card, not a person.** Cards 01 and 03 carry figures;
Card 02 shows a partial enemy arm. Card 04 should carry **no figure at all** — see §4.

---

## 2. Where Card 04 sits, and the trap to avoid

The PURIFICATION set already owns four silhouettes:

| Card                                     | Device                                                         |
| ---------------------------------------- | -------------------------------------------------------------- |
| 01 `acolyte-of-the-white-rune` (COMMON)  | small white-stone rune tablet held in two hands, by a novice   |
| 02 `seal-of-the-curse` (RARE)            | engineered binding clamp locked onto an enemy weapon           |
| 03 `warden-of-the-barrier` (RARE)        | planted, hinged, segmented ward-screen with a ground anchor    |
| flagship `high-warden-of-the-white-rune` | large rune-engraved round shield + spear, facade, ranked crowd |

And one non-PURIFICATION card constrains us as well: `rune-of-the-echoing-dusk` (SHADOW / RUNE /
EPIC / 3) is a **tall dark monolith on a stepped plinth in a cavern, with a crimson sigil on the
floor**. That is the shipped visual definition of "a RUNE card" in this game, and Card 04 is the
same type, rarity and cost. It must not read as the white repaint of it.

**The trap:** the obvious move is to enlarge Card 01's incised rune tablet into a standing stone.
That fails twice — it duplicates Card 01's motif at a different scale, and it lands on the SHADOW
rune's monolith silhouette. Both are rejected in §11.

---

## 3. Concept families evaluated

Four families were assessed against mechanic fidelity, uniqueness, 92 px silhouette, crop safety,
faction fidelity, and EPIC read. One is recommended; the other three are rejected with cause.

### ✅ RECOMMENDED — **A. The cleansing font**

A low, wide basin of white stone on a short stepped plinth, its rim carved with a continuous band of
angular rune marks. It is brimming, and clear water slips over the rim in thin unbroken sheets on
every side, feeding shallow straight channels cut into the pale floor that run outward and leave the
frame.

- **Mechanic fidelity — strongest.** Overflow is inherently continuous: it was overflowing before
  this frame and will be next turn. That is `TURN_START` recurrence rendered as a physical state
  rather than an instant. Water is the least ambiguous cleansing verb available. The radiating
  channels carry `FRIENDLY_ALL` outward without drawing a single ally.
- **Uniqueness — strongest.** A vessel is a shape no other card in the set uses. Its silhouette is a
  wide, low, horizontal mass — the opposite of the tall vertical monolith, the standing figures, the
  round shield and the small handheld tablet.
- **92 px** — a bright horizontal bowl on a dark-ish floor with light lines radiating from it is a
  clean, instantly separable shape.
- **Crop safety** — a low, wide, centred object is the safest possible subject for a 4:5 top/bottom
  trim; there is no head or finial to lose.
- **EPIC** — a carved architectural fixture with a working water system reads as more authority and
  craft than Card 01's palm tablet or Card 03's field-deployed screen, without touching the
  flagship's ceremonial crowd language.

### ❌ REJECTED — B. Unbinding stele with severed chains

A white stele with broken chain links falling at its base.

Rejected on **mechanic fidelity**: a snapped chain is the single instant this card must not depict —
it is a completed one-shot, and it cannot logically re-break every turn. Chain and iron-collar
imagery also drifts toward bondage/gothic language that reads closer to SHADOW than to PURIFICATION,
and it renders `CLEANSE` as violence rather than removal.

### ❌ REJECTED — C. Engraved rune ring set into the floor

A large circular rune inscribed flush into pale stone, with allies standing inside it.

Rejected on **hard faction rules, not taste**: "floor rune-circle" is already an explicit automatic
reject in this faction's established language (Card 02 brief §16, reject #11), and the free-floating
rune-circle halo is reserved flagship/VEIL vocabulary per `art-bible-01.md`. This family is a
non-starter regardless of execution quality.

### ❌ REJECTED — D. Suspended rune-chime / bell

A hanging engraved plate or bell struck at each turn start.

Rejected on **two counts**. Its recurrence reads as sound, which is nearly invisible at 92 px and
must be faked with motion streaks that violate the "no cast VFX" rule. More seriously, the UI
already assigns waveform/resonance identity to the `TrackZone` component; borrowing that vocabulary
for a RUNE muddies a system the player has already learned.

### ❌ REJECTED — E. Freestanding keystone arch

A white arch whose keystone carries the rune, allies passing beneath.

Rejected on **faction-drift risk**: `art-bible-01.md` explicitly warns that two of six factions
already compose against monumental architecture and instructs future work to push away from a third
architectural setting; "cathedral facade" is a named Card 02 reject. An arch also reads as a
gate/threshold — a thing you pass through once — rather than a continuous cleansing.

---

## 4. Locked visual thesis

> A carved white-stone font stands alone in a pale, quiet hall. It is full past its brim, and clean
> water slides over the rim in continuous thin sheets, running away down straight cut channels in
> the floor and out of frame in several directions. Nothing is being cast. Nobody is present. The
> thing simply works, and has been working for a long time.

**No figure appears — not a face, not a hand, not a silhouette.** This is deliberate:

- it is the cleanest separation from Cards 01 and 03, which are both figure-led;
- `RUNE` is an emplaced permanent, and the engine keeps it on the board with no owner attached;
- the art bible's PURIFICATION rule is that magic is **built into the architecture, not conjured by
  a person** — a figureless emplacement is the purest expression of that rule in the set so far.

---

## 5. Focal hierarchy

1. **The water lip** — the brightest, highest-contrast edge in the frame: where the sheet leaves the
   rim and catches the light. This is the "it is working" signal and must survive to 92 px.
2. **The basin body and its engraved rim band** — the object identity.
3. **The radiating floor channels** — the `FRIENDLY_ALL` reach.
4. **The plinth steps** — mass and permanence.
5. **The hall** — barely present; a value field only (§8).

If the water were removed and the image still read as "a stone bowl", the card has failed: the
continuous flow is the mechanic.

---

## 6. Composition, camera, placement

- **Master format:** 1024 × 1536 vertical (2:3), matching Cards 01–03.
- **Camera:** slightly above eye level, looking gently down — roughly 15–20° — so the water surface
  inside the basin and the radiating floor channels are both legible. A pure eye-level view hides
  the channels; a steep top-down view destroys the silhouette and the crop safety.
- **Placement:** the basin is centred horizontally and sits **low-centre**. Rim line at approximately
  y ≈ 760–900. Plinth base by y ≈ 1240. The floor channels read outward from the plinth and must be
  unmistakably established **above y = 1280**, so nothing essential depends on the trimmed band.
- **Headroom:** the upper third is quiet hall. There is intentionally no finial, no hanging object,
  and no architectural detail in the top 200 rows — this is what makes the card crop-proof.
- **Depth:** three planes only — basin (sharp), floor with channels (soft), hall (very soft). No
  midground clutter.

---

## 7. Material language

- **Basin and plinth:** dense white-to-ivory stone, matte, finely dressed, with visible tool-worked
  chamfers. Slight age: softened edges, faint mineral staining below the overflow points where water
  has run for years. That patina is what makes it read as permanent rather than newly placed.
- **Rim band:** a **continuous repeating band of angular incised marks** running unbroken around the
  rim. It must read as ornament and rhythm, **not as a legible glyph or script** — Card 01 already
  owns the single readable incised glyph, and readable characters are a hard reject (§11).
- **Inlay:** the incised lines may hold a thin pale silver-white inlay that catches light. This is
  the card's one permitted "precious" material and is how EPIC is signalled — not by gold.
- **Water:** clear, cold, still inside the basin; thin, laminar, glass-like sheets at the overflow.
  Not foaming, not splashing, not spraying. Turbulence would read as an event.
- **Floor:** pale flagstones, straight cut channels with clean square edges, shallow, holding a thin
  film of moving water.

---

## 8. Lighting, palette, value

- **Light:** soft, high, diffuse and ambient — daylight from an unseen source above. **No god rays,
  no lens flare, no bloom, no visible beam.** The light is already in the room; it is not being
  emitted by the rune.
- **Glow discipline:** the incised inlay and the water lip may be _luminous by reflection_. Nothing
  may emit a coloured aura. PURIFICATION's magic is ambient and architectural, never cast.
- **Palette:** white / silver / ivory base around `#e7e2d3`, with cool grey-blue in the water and
  the shadow side of the stone.
- **Gold budget:** **≤ 4 % of canvas.** The art bible instructs that non-Legendary PURIFICATION
  cards dial gold back so it does not read as a false rarity signal. Measured references:
  `acolyte-of-the-white-rune` 0.96 %, `warden-of-the-barrier` 0.01 %, versus LEGENDARY
  `high-warden-of-the-white-rune` 10.05 % and `matriarch-of-the-spring-light` 71.44 %. Card 04 may
  sit slightly above the two RARE/COMMON cards to carry EPIC, and must stay far below the
  Legendaries.
- **Value structure:** high-key overall, but it must **not** be uniformly pale. Card 03 is already
  the palest card in the shipped set (p5 = 109) and a second flat white card would be hard to tell
  apart in the collection grid. Card 04 needs a genuine dark anchor: the shadowed underside of the
  rim, the recessed channels, and the plinth's shaded face. Target a 92 px grayscale spread that is
  clearly wider than Card 03's 122.

---

## 9. Rarity — how EPIC is actually carried

**A measured warning first, because the obvious assumption is false.** Edge density at 92 px does
**not** track rarity in this game's shipped art:

| Rarity    | Card                                | 92 px edge density                 |
| --------- | ----------------------------------- | ---------------------------------- |
| COMMON    | `ashen-blade`                       | 23.67                              |
| COMMON    | `acolyte-of-the-white-rune`         | 27.85                              |
| RARE      | `warden-of-the-barrier`             | 29.82                              |
| RARE      | `seal-of-the-curse`                 | 36.99                              |
| **EPIC**  | **`rune-of-the-echoing-dusk`**      | **21.80** — lowest of all thirteen |
| LEGENDARY | `necromancer-of-the-twilight-order` | 22.95                              |
| LEGENDARY | `high-warden-of-the-white-rune`     | 48.89                              |

LEGENDARY spans 22.95–48.89 and the only shipped EPIC is the _quietest_ image in the set. **Do not
add clutter to signal EPIC.** Rarity is carried by the card frame (`RARITY_FRAME_CLASS`) and by the
depicted object's authority, not by busyness.

For Card 04, EPIC means:

- a **fixed architectural installation** rather than a portable or field-deployed object — more
  permanent than Card 03's planted screen, more consequential than Card 01's handheld tablet;
- **craft concentration in the mid-frame**: the rim band, the chamfers, the channel cuts are where
  detail lives;
- **restraint everywhere else** — the hall stays empty, the palette stays disciplined;
- **no ceremonial escalation**: no crowd, no banners, no facade, no processional staging. Those are
  the flagship's, and using them would misread as LEGENDARY.

---

## 10. Surfaces and crop-safe geometry — verified from the implementation

Card 04 is a `RUNE`. Its surfaces were **read from the code, not inferred from Cards 01–03**:

- `apps/web/src/app/admin/art-review/page.tsx:154` — `const hasBoardSlot = displayCard.type === 'CHARACTER'`.
  A RUNE takes the false branch, so **`CreatureSlot` does not apply**.
- `apps/web/src/components/battlefield/RuneZone.tsx` — an in-play rune renders a 24 × 24 px circle
  containing a `⬡` glyph, with the card _name_ as the title/aria-label. It never reads `artworkUrl`.
  **A RUNE's artwork never appears on the battlefield.**
- `apps/web/src/components/battlefield/CardPlayReveal.tsx:71` — the play reveal draws
  `<Icon name="rune" />`, not the artwork.

So the artwork appears only where cards are browsed or previewed. **Eight review surfaces apply — the
same set as Card 02 (EVENT), not Card 03's nine:**

| #   | Surface                     | Source of truth                                                    |
| --- | --------------------------- | ------------------------------------------------------------------ |
| 1   | raw master 2:3              | 1024 × 1536                                                        |
| 2   | CardView 3:4                | `packages/ui/src/components/CardView.tsx:71`, `object-cover`       |
| 3   | CardDetailDrawer 4:5        | `apps/web/src/components/CardDetailDrawer.tsx:111`, `object-cover` |
| 4   | HandCardPreview 7:9         | `HandCardPreview.tsx:62` — `h-36 w-28` = 144 × 112                 |
| 5   | `/admin/art-review` desktop | live stack                                                         |
| 6   | `/admin/art-review` 390 px  | live stack                                                         |
| 7   | 92 px thumbnail             | derived                                                            |
| 8   | 92 px grayscale             | derived                                                            |

### Crop maths — width is never trimmed, only rows

| Aspect          | Rows kept on a 1024 × 1536 master |
| --------------- | --------------------------------- |
| 3:4             | 85 – 1450                         |
| 7:9             | 110 – 1426                        |
| **4:5 BINDING** | **128 – 1408**                    |

**Strict working safe zone: rows 260 – 1280.** Every element the card depends on — rim, water lip,
rune band, the legible start of the channels — must live inside that band. This matches the standard
applied to Cards 02 and 03.

---

## 11. Automatic-reject conditions

Any single one of these means the candidate does not go to owner approval.

**Concept failures**

1. The image reads as a single instant — a shatter, snap, burst, blast, explosion or strike.
2. Any figure, face, hand, or human silhouette appears.
3. Magic is being actively cast, or emanates from an open hand.
4. The water is absent, still at the rim, or not visibly running — the mechanic is not depicted.
5. Water is foaming, splashing, spraying or turbulent (reads as an event, not a steady state).
6. The object reads as a portable or handheld item rather than a fixed installation.

**Uniqueness failures**

7. A tall vertical monolith or standing stone on a stepped plinth — that is the SHADOW EPIC rune.
8. An enlarged version of Card 01's handheld rune tablet.
9. A hinged, segmented or folding panel (Card 03's ward-screen).
10. A round shield, spear, compass or star emblem (flagship-reserved).

**Faction failures**

11. Any crimson, red, violet, magenta or ember-orange.
12. Deep chiaroscuro, or a dark cavernous setting.
13. Warm embers, ash, smoke or fire.
14. Spectral, translucent or dissolving forms.
15. **Floor rune-circle**, rune-circle halo, or any closed inscribed ring on the ground — an
    established automatic reject in this faction's language. The floor channels must read as
    **straight radiating cuts**, never as a circle.
16. Cathedral facade, rose window, banners, ranked crowd, or monumental architecture.
17. God rays, lens flare, bloom, or a visible emitted beam.

**Rarity failures**

18. Gold exceeding roughly 4 % of the canvas, or broad gold filigree.
19. Ceremonial or processional staging that reads as LEGENDARY.
20. Clutter added in order to "look EPIC" (see §9).

**Structural failures**

21. Essential content outside master rows **260 – 1280**.
22. The water lip is not the brightest, highest-contrast element.
23. The basin and floor merge in value when desaturated at 92 px.
24. The image is uniformly pale with no dark anchor (a second flat-white PURIFICATION card).
25. Rim ornament that reads as legible script, characters, letters or numerals.
26. Any text, lettering, watermark, signature, logo, UI element, stat box or baked card frame.
27. Fussy micro-detail in the rune band that disintegrates at thumbnail size.

---

## 12. Acceptance checklist — walk this mechanically at QA

| #   | Check                                                                  | Method                       |
| --- | ---------------------------------------------------------------------- | ---------------------------- |
| 1   | Master is exactly 1024 × 1536, WebP, plain `VP8 `, full decode PASS    | byte + decode gate           |
| 2   | No figure anywhere                                                     | visual, full resolution      |
| 3   | Water is visibly running over the rim in continuous sheets             | visual, full resolution      |
| 4   | Floor channels are straight and radiating — **no closed circle**       | visual, full resolution      |
| 5   | Rim band is ornamental, not legible script                             | zoom to full resolution      |
| 6   | No text, watermark, signature, logo or UI                              | zoom, all four quadrants     |
| 7   | Gold coverage ≤ 4 %                                                    | measured, HSV mask           |
| 8   | Grayscale spread at 92 px clearly exceeds 122 (Card 03)                | measured                     |
| 9   | Water lip remains the brightest element at 92 px grayscale             | measured + visual            |
| 10  | Silhouette at 92 px is not confusable with Cards 01–03 or the flagship | side-by-side at 92 px        |
| 11  | Not confusable with `rune-of-the-echoing-dusk` at 92 px                | side-by-side at 92 px        |
| 12  | All essential content inside rows 260 – 1280                           | crop overlay                 |
| 13  | All eight surfaces reviewed (§10) — `CreatureSlot` correctly N/A       | live stack                   |
| 14  | No horizontal overflow at 390 px                                       | `scrollWidth == clientWidth` |
| 15  | Every §11 reject checked explicitly and recorded, not assumed          | written QA record            |

---

## 13. Environment information ceiling

The hall exists only to give the basin somewhere to stand. Permitted: a pale floor, a suggestion of
a far wall, soft ambient falloff. **Not permitted:** identifiable architecture, columns rendered in
detail, windows, doorways, furniture, banners, statues, or any second object competing for
attention. At 92 px the background must collapse to a flat pale field with no readable structure.

Card 03's accepted caveat — a single soft background column — is the **maximum** environmental
information this card may carry, and less is better here, because Card 04 has no figure to hold
attention against a busy field.

---

## 14. Generation ownership — Claude does not generate this image

Claude Code does not produce Card 04 imagery and has no image-generation capability in this
environment. On owner approval of this brief, image generation is handed to ChatGPT (or the owner's
chosen generator) using `rune-of-curse-breaking-generation-package.md`. Claude's role resumes at
byte-exact candidate intake and the eight-surface QA in §10 and §12.

---

## 15. Explicitly out of scope

Gameplay, cost, rarity, ability text, mechanics, schema, seed data, `artworkUrl`, `rightsStatus`,
production-path integration, sync extension 13 → 14, workflow dispatch, and any production
operation. This document is art direction only.
