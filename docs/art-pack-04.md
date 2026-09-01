# Art Pack 04 — BOND (Дом Весеннего Света)

Production artwork for the BOND faction's non-flagship cards. The faction's LEGENDARY flagship,
`matriarch-of-the-spring-light`, was approved earlier as part of Art Pack 01 and is **not** part of
this pack — it is the faction anchor every card here is measured against. See
[`art-bible-01.md`](art-bible-01.md).

**Pack status:** IN PROGRESS — Card 01 brief and generated master are owner-approved. Exact candidate
transport and the full nine-surface QA are next. Nothing has been integrated or synced.

| #   | Slug                            | Type / Rarity / Cost      | Status                                                           |
| --- | ------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| 01  | `child-of-the-spring-light`     | CHARACTER / COMMON / 1    | **OWNER MASTER APPROVED — CANDIDATE TRANSPORT / QA NEXT**        |
| 02  | `keeper-of-the-promise`         | CHARACTER / RARE / 3      | Planned — not briefed                                            |
| 03  | `light-of-the-hearth`           | TRACK / RARE / 2          | Planned — not briefed                                            |
| 04  | `rune-of-reflected-light`       | RUNE / EPIC / 3           | Planned — not briefed                                            |
| —   | `matriarch-of-the-spring-light` | CHARACTER / LEGENDARY / 5 | **LIVE IN PRODUCTION** — Art Pack 01 flagship, faction reference |

## Faction anchor — `matriarch-of-the-spring-light`

Already live at `apps/web/public/art/cards/matriarch-of-the-spring-light.webp`, owner-approved
2026-08-12 as Art Pack 01 Production Candidate 03. Full record in
[`art-bible-01.md`](art-bible-01.md) §BOND.

Its locked language, which the whole pack inherits: warm ivory and pale sage-green base; warm amber
BOND accent `#e0a458` (`packages/ui/src/factions.ts:26`); **organic** gold vine/branch filigree
rather than PURIFICATION's straight geometric gold; living garden and natural canopy; warm
golden-hour diffuse backlight with no harsh shadow; flowing fabric rather than rigid plate; healing,
protection, ally synergy and sustain as the gameplay identity.

Its Legendary-only devices, reserved and not to be reused lower down the ladder: the staff with
blossom finial, the cradled light-orb with tendrils, the flower crown, the attendant grouping, the
terraced garden with dome, balustrades and waterfalls, the overhead flowering canopy, and the dense
gold vine embroidery.

Measured at 92 px (method in the Card 01 brief §9): edge density **43.46**, grayscale spread **152**,
mean luminance **131.4**, R−B **+62.0**, saturation **42.1 %** — the second-busiest and by far the
warmest image in the shipped set.

## Card 01 — `child-of-the-spring-light` — OWNER MASTER APPROVED

Canonical brief:
[`art-review/child-of-the-spring-light-master-art-brief.md`](art-review/child-of-the-spring-light-master-art-brief.md)

Owner master approval:
[`agent-reports/2026-09-02-art-pack-04-card-01-owner-master-approval.md`](agent-reports/2026-09-02-art-pack-04-card-01-owner-master-approval.md)

### Card facts

| Field                      | Value                                           |
| -------------------------- | ----------------------------------------------- |
| `slug`                     | `child-of-the-spring-light`                     |
| `name`                     | Дитя Весеннего Света                            |
| `type` / `rarity` / `cost` | CHARACTER / COMMON / 1                          |
| `attack` / `health`        | 1 / 3                                           |
| `tags`                     | `['Bond']`                                      |
| `abilityText`              | При выходе: восстановите 1 здоровье Проводнику. |
| `effectJson`               | `ON_PLAY` → `HEAL` / `FRIENDLY_CONDUCTOR`, `1`  |

Verified from `apps/game-server/prisma/seed.ts`; unchanged by the art tasks. Deck presence: ×2 in the
BOND starter deck and ×2 as a COSMIC Ramp splash, so it is one of the most-seen cards in the game.

### Locked concept

> **A child at the garden threshold holds out a single budding spring branch, cupped in both hands,
> toward you. The light is only as big as their hands.**

The gesture leaves the frame toward the viewer because the heal targets the **Conductor** — the
player — and not an ally on the board (`FRIENDLY_CONDUCTOR`, resolved at
`packages/game-engine/src/effects/targets.ts:85`). No other card in the set addresses the viewer, so
the device is unrepeatable, and it separates Card 01 from Card 02's chosen-ally heal by structure
rather than by styling.

Five concept alternatives were evaluated and rejected: the watering can (reads as growth, not
restoration), the laying-on of hands (healer-priest cliché, and it illustrates Card 02's mechanic),
the cradled orb (collides with the flagship), the sleeping child under a canopy (no restorative act;
canopy is a flagship motif), and the lit lamp (reserved for Card 03).

### Approved generated master and transport tuple

The owner explicitly approved the generated image on 2026-09-02. This is **visual master approval
before candidate QA**, not repository integration approval.

Generation ID: `615e529f-173b-4c42-826b-814da3de8b96`.

Approved PNG:

- `1024 × 1536`, RGB PNG
- size `2902102`
- SHA-256 `b67d2e520ed7b967e724e47f6de52809ea44da9efaca3d48a33a3265da759635`
- full decode PASS

Exact candidate transport WebP, derived without crop/resize/recomposition:

- `1024 × 1536`
- size `596976`
- SHA-256 `bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`
- expected Git blob `a52fb443ff296c4411c7dc0e640be98befbc12bc`
- RIFF total `596976`
- FourCC `VP8 `
- full decode PASS

Machine-owned temporary source: `https://firestorage.ai/ja/f/aZIlHM-TkPI7`, expires
`2026-09-16T21:44:37.912662Z`. The owner must not be used as a manual file courier.

The WebP still requires objective candidate QA against the canonical brief. Owner approval does not
silently waive crop or metric criteria.

### Rarity ladder for BOND

| Rarity        | Figure                              | Light                                      | Setting                                              | Ornament                               |
| ------------- | ----------------------------------- | ------------------------------------------ | ---------------------------------------------------- | -------------------------------------- |
| COMMON (01)   | one child, three-quarter length     | contained inside two hands                 | a low threshold, nothing above the shoulder          | one line of green thread               |
| RARE (02, 03) | one adult, or an interior           | larger than a hand, smaller than the frame | a room or an enclosed garden corner                  | limited gold, no plate                 |
| EPIC (04)     | no figure                           | emitted by an object                       | a formal setting for that object                     | a deliberate rune device               |
| LEGENDARY     | full ceremonial figure + attendants | radiating outward from the person          | monumental terraced garden, dome, waterfalls, canopy | dense gold filigree, staff, orb, crown |

`RARITY_FRAME_CLASS.COMMON` is a plain grey border with no glow layer
(`packages/ui/src/rarity.ts`), so a COMMON gets no help from the frame — the rank read has to be
entirely inside the artwork.

### Surfaces

Card 01 is a CHARACTER, and `apps/web/src/app/admin/art-review/page.tsx:162` sets
`hasBoardSlot = displayCard.type === 'CHARACTER'`, so it occupies a Battlefield creature slot and
takes the full **nine-surface** review. Card 02 will also be nine surfaces; Cards 03 (TRACK) and 04
(RUNE) will be eight, with no creature slot.

Crop geometry on a 1024 × 1536 master, `object-cover`, width never trimmed: 3:4 → rows 85–1450;
7:9 → rows 110–1426; **4:5 → rows 128–1408, binding**. Strict safe zone rows 260–1280.

### Measured QA targets

| Metric                    | Target                           |
| ------------------------- | -------------------------------- |
| Edge density (92 px, 3:4) | 24.0 – 31.0, ceiling 36.0        |
| Warmth R−B                | ≥ +30                            |
| Saturation                | ≥ 22 %                           |
| Mean luminance            | 110 – 160, and outside 164 – 182 |
| Grayscale spread          | ≥ 110                            |
| Metallic gold coverage    | ≤ 1 %                            |

Warmth is the binding faction test: BOND's flagship measures R−B **+62.0** at 42 % saturation, while
the entire shipped PURIFICATION set sits between **+1.2 and +11.8** at 2.9–8.1 %. A pale, neutral,
high-key image is a PURIFICATION image and fails this card.

### Safeguarding

The subject is a child, so the brief carries absolute constraints: fully clothed in loose opaque
clothing covering shoulders, torso and legs below the knee; no sheer, wet, clinging or
form-revealing fabric; no suggestive pose, framing, expression, camera angle or styling; no injury or
distress. Any violation is an automatic reject and is regenerated from scratch rather than patched.

## Visual reservations across the pack

Each card spends only its own row. Set here so Cards 02–04 do not have to renegotiate it later.

| Card                                   | Reserved to it                                                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 `child-of-the-spring-light`         | the child subject; cupped hands; the budding sprig; the offer directed at the viewer; the garden threshold and gate                                                                               |
| 02 `keeper-of-the-promise`             | an adult guardian; a promise token (knotted cord, ring, keepsake); a protective stance over another figure; a second figure in frame                                                              |
| 03 `light-of-the-hearth`               | all fire, flame, lamp, lantern, candle and hearth; any interior room; furniture; the shared-warmth gathering staging                                                                              |
| 04 `rune-of-reflected-light`           | mirrors, reflective surfaces, reflected or split light; shield and ward geometry; a formal rune device; a figureless composition                                                                  |
| `matriarch-of-the-spring-light` (live) | staff with blossom finial; cradled light-orb with tendrils; flower crown; attendant grouping; terraced garden, dome, balustrades, waterfalls; overhead flowering canopy; dense gold vine filigree |

The one deliberate overlap is warm golden-hour light and living plant matter, which is the faction
itself and should repeat on every card.

## Pack boundary

Card 01 has reached owner-approved master generation only. It is **not** integrated and is **not**
live. Candidate transport and nine-surface QA are the active next step.

No `seed.ts` entry has been touched and no production operation is authorized. Both previous
production confirmations — `SYNC-13-CARD-ART-PRODUCTION` and `SYNC-14-CARD-ART-PRODUCTION` — are
**CONSUMED** and invalid forever. A future BOND sync will need a new phrase, a pin repointed at a new
already-merged integration commit, and a fresh explicit owner decision.