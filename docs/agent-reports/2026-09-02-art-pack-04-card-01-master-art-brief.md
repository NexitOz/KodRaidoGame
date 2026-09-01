# Agent Handoff — Art Pack 04 Card 01 master-art brief

Task: create the canonical master-art brief and generation package for Art Pack 04 / BOND Card 01,
`child-of-the-spring-light`
Date: 2026-09-01 (session ran 21:37–22:00 UTC; the report path uses the 2026-09-02 filename the task
specified)
Branch: `main`
PR: none — docs-only task, same pattern as previous brief/concept tasks
Base SHA: `241070f2c7f086f41934e56ac3c6aeb41006337e`
Head SHA: see the commit carrying this report
Status: **READY FOR OWNER ART BRIEF REVIEW — ART PACK 04 CARD 01**

## Scope

Concept and documentation only. No image was generated, no artwork bytes exist, no candidate branch
was touched, and no gameplay, seed, schema, workflow or production state was changed.

## Changed files

- `docs/art-review/child-of-the-spring-light-master-art-brief.md` — new, 20 sections, the canonical
  brief including the generation prompt, negative prompt and regeneration guidance
- `docs/art-pack-04.md` — new, BOND pack roster, status table, rarity ladder, reservations
- `docs/agent-reports/2026-09-02-art-pack-04-card-01-master-art-brief.md` — this report
- `docs/AGENT_STATE.md` — updated last

## What was verified, and from where

Everything below was read out of the repository or measured from the shipped production files during
this task. Nothing was carried forward from an earlier brief on trust.

**Card facts** — `apps/game-server/prisma/seed.ts`: `child-of-the-spring-light` / «Дитя Весеннего
Света», CHARACTER, COMMON, cost 1, 1/3, tags `['Bond']`, ability «При выходе: восстановите 1 здоровье
Проводнику.», `effectJson` `ON_PLAY` → `HEAL` / `FRIENDLY_CONDUCTOR` / amount 1. Matches the task
statement exactly. Cross-checked against the BOND table in `docs/content-pack-01.md:112`.

**Effect implementation** — `packages/game-engine/src/effects/targets.ts:85` resolves
`FRIENDLY_CONDUCTOR` to the owner's conductor with no target choice;
`packages/game-engine/src/effects/primitives.ts:49-52` caps the heal at `STARTING_CONDUCTOR_HP`,
which is `30` (`packages/shared/src/constants.ts:4`). So the card restores **1 of 30**, to the
player, once, on arrival. That is the single fact the whole concept is built on.

**Deck presence** — `apps/game-server/src/content/starter-decks.ts:59` (×2 in the BOND starter deck)
and `:121` (×2 as a COSMIC Ramp splash). High-visibility one-drop.

**Surfaces** — `apps/web/src/app/admin/art-review/page.tsx:162` sets
`hasBoardSlot = displayCard.type === 'CHARACTER'`, so Card 01 gets the **nine-surface** review
including `CreatureSlot`. Crop ratios re-read from source rather than assumed:
`CardView.tsx:71` `aspect-[3/4]` with `object-cover` at `:75`; `CardDetailDrawer.tsx:111`
`aspect-[4/5]`; `HandCardPreview.tsx:62` `h-36 w-28` = 144 × 112 = exactly 7:9;
`CreatureSlot.tsx:113` `aspect-[3/4]` with `object-cover` at `:141`. Crop maths on a 1024 × 1536
master: 3:4 → rows 85–1450, 7:9 → rows 110–1426, **4:5 → rows 128–1408 (binding)**.

**Rarity frames** — `packages/ui/src/rarity.ts`: `RARITY_FRAME_CLASS.COMMON` is
`border-raido-mist/35 bg-raido-graphite`, and the animated `RARITY_GLOW_CLASS` is deliberately null
for COMMON and RARE. A COMMON therefore gets no frame assistance at all, which is why the brief
insists the rank read live entirely inside the artwork.

**Faction accent** — `packages/ui/src/factions.ts:26`: BOND `#e0a458`.

**Flagship** — `docs/art-bible-01.md:272-351` plus a direct look at the shipped
`matriarch-of-the-spring-light.webp`. Confirmed the Legendary-only devices: staff with blossom
finial, cradled light-orb with tendrils, flower crown, attendant grouping, terraced garden with dome
and waterfalls, overhead flowering canopy, dense gold vine embroidery.

## Measurements taken this task

Method, stated in the brief §9 so it is reproducible: crop the master to the `CardView` 3:4 window
(width preserved, rows centre-cropped), resize to 92 × 123, then take the mean of Pillow's
`ImageFilter.FIND_EDGES` for edge density and the 5th/95th grayscale percentiles for spread; colour
means over the same crop.

| Card                            | Faction / rarity         | Edge  | Spread | Mean L | R−B   | Sat % |
| ------------------------------- | ------------------------ | ----- | ------ | ------ | ----- | ----- |
| `high-warden-of-the-white-rune` | PURIFICATION / LEGENDARY | 45.78 | 171    | 131.2  | +27.3 | 21.2  |
| `matriarch-of-the-spring-light` | BOND / LEGENDARY         | 43.46 | 152    | 131.4  | +62.0 | 42.1  |
| `seal-of-the-curse`             | PURIFICATION / RARE      | 36.42 | 167    | 147.4  | −3.2  | 7.0   |
| `warden-of-the-barrier`         | PURIFICATION / RARE      | 29.93 | 123    | 181.2  | +1.2  | 2.9   |
| `acolyte-of-the-white-rune`     | PURIFICATION / COMMON    | 27.04 | 134    | 174.3  | +11.8 | 8.1   |
| `rune-of-curse-breaking`        | PURIFICATION / EPIC      | 26.70 | 142    | 164.5  | +1.3  | 3.5   |
| `rune-of-the-echoing-dusk`      | SHADOW / EPIC            | 19.85 | 56     | 28.5   | −11.3 | 29.9  |

Two findings drove the QA targets:

1. **The two flagships are the two busiest images in the whole shipped set** (45.78 and 43.46). At
   92 px, LEGENDARY is carried by density, so a COMMON has to be visibly quieter — target 24–31.
2. **Warmth separates BOND from PURIFICATION almost perfectly.** BOND's flagship is R−B **+62.0** at
   42 % saturation; the entire shipped PURIFICATION set is **+1.2 to +11.8** at 2.9–8.1 %. This is
   the strongest measurable "BOND not PURIFICATION" test available, and the brief makes it binding
   (R−B ≥ +30, saturation ≥ 22 %, mean luminance 110–160 and outside PURIFICATION's 164–182 band).

**Honest note on metric reconciliation.** The edge-density scale here reproduces the Art Pack 03
figures to within about ±2 (`warden-of-the-barrier` 29.93 here against 29.82 published;
`rune-of-the-echoing-dusk` 19.85 against 21.80), the residual coming from resample-filter choice. The
grayscale-spread figures match the published ones exactly. Because of that residual, the brief states
targets as **bands, not exact numbers**, and says so.

## The concept, and why

Locked thesis: _a child at the garden threshold holds out a single budding spring branch, cupped in
both hands, toward you; the light is only as big as their hands._

The reasoning worth recording is the structural one. All five BOND cards heal, so "a kind figure with
glowing hands" would produce five interchangeable images. The engine already differentiates them by
**recipient**: Card 01 heals the Conductor (the player, outside the frame), Card 02 a chosen ally
(someone inside the frame), Card 03 the Conductor then everyone (a shared source, no recipient
shown), Card 04 nothing directly (an object that reacts to someone else's healing). Card 01 takes the
one composition no other card can use — the gesture that leaves the frame toward the viewer. No card
in any faction currently addresses the viewer, so the device is unrepeatable.

Five alternatives were evaluated and rejected on the record: the watering can (reads as growth, not
restoration), the laying-on of hands (the healer-priest cliché the task asked to avoid, and it
depicts Card 02's mechanic), the cradled orb (direct collision with the flagship), the sleeping child
under a canopy (no restorative act; canopy is a flagship motif), and the lit lamp (a good BOND image,
reserved for Card 03).

A visual-reservation table for all four non-flagship cards plus the flagship is recorded in both the
brief §14 and `docs/art-pack-04.md`, so Cards 02–04 do not have to renegotiate their motifs later.

## Safeguarding

The subject is a child, so the brief carries absolute constraints rather than stylistic preferences:
fully clothed in loose opaque clothing covering shoulders, torso and legs below the knee; no sheer,
wet, clinging or form-revealing fabric (the Matriarch's sheer gauze cape is explicitly not
inherited); no suggestive pose, framing, expression, camera angle or styling; no cosmetics or adult
styling; never depicted injured, distressed or in danger. These appear twice — in §6 and again in the
automatic-reject list — and the regeneration guidance says any safeguarding issue is regenerated from
scratch, never patched or cropped.

## Validation

- `npx prettier --check` on all four changed/added docs — **PASS**.
- `git diff --check` — clean.
- Changed-file scope confirmed: three new docs plus `docs/AGENT_STATE.md`. No code, seed, schema,
  migration, artwork, workflow or production file was touched.
- No production credential was used; no workflow was dispatched; Railway, the production database and
  Vercel were not accessed.

## Visual QA / artifacts

None, and none possible — no image exists. The nine-surface QA happens after generation, in a
separate task.

## Known issues

1. **Deliverable shape differs from Art Pack 03.** Cards 03 and 04 of the previous pack used two
   files — a brief and a separate generation package. This task's step 7 lists the generation prompt
   and negative prompt as contents of the brief, so everything is in one file. If a separate
   generation package is wanted for consistency, it is a copy-out, not new work.
2. **Report filename date.** The task specified
   `docs/agent-reports/2026-09-02-art-pack-04-card-01-master-art-brief.md`; the session actually ran
   on 2026-09-01 UTC. The specified path was used as given and the real timestamp recorded here.
3. **Pre-existing technical debt, deliberately untouched.** The authorization-state comments in
   `apps/game-server/scripts/sync-production-card-art.ts` and
   `.github/workflows/production-card-art-sync.yml` still describe `SYNC-14-CARD-ART-PRODUCTION` as
   "RESERVED, NOT AUTHORIZED, NOT CONSUMED", which is stale — it is CONSUMED. The task explicitly
   forbids folding that fix into this art-direction work, so it remains recorded as a follow-up in
   `docs/AGENT_STATE.md`.
4. The brief is a specification, not a guarantee. Whether the measured targets in §9 are achievable
   in one render is unknown until an image exists; §18 gives per-axis regeneration guidance for the
   likely drifts.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`; schema and migrations; every file under
`apps/web/public/art/cards`; all gameplay, balance and UI code; the production sync script and
workflow; every candidate and transport branch; Art Pack 03, which stays closed. No new production
confirmation phrase was created.

## Recommended next action

1. Owner reviews the brief — in particular the locked thesis in §4, the safeguarding constraints in
   §6, and the measured targets in §9.
2. On approval, generate the master to the §19 output contract (exactly 1024 × 1536, original export,
   no text or watermark) and bring the exact bytes in over the established Actions-runner transport
   with the full integrity gate set.
3. Then run the nine-surface candidate QA against the §16 checklist. Card 02 stays unbriefed until
   Card 01 is approved.
