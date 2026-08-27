# Agent Handoff

Task: Art Pack 03 Card 01 — verify and visually review the candidate (`docs/CLAUDE_CURRENT_TASK.md`)
Date: 2026-08-27
Branch: `main`
Candidate branch: `assets/acolyte-of-the-white-rune-candidate` @ `69e176e` (re-transport, **unmerged**)
Base: `main` @ `ed6878899012fad2048735e2011f8d1e3ce68ac3`
Review-surface commit: `df0227a`
PR: none

## FINAL STATUS: READY FOR OWNER VISUAL APPROVAL — with two caveats

Byte verification passes completely. All required surfaces were reviewed live. The §15 checklist
passes on every item. Two caveats below are real and worth a decision, but neither is a §15 failure.

## 1. Integrity verification — ALL PASS

The re-transport landed on the **original** candidate branch as `69e176e` ("Add files via upload",
`Bin 15042 -> 214378 bytes`), not on a `-v2` branch. A `transport/acolyte-of-the-white-rune-v2`
branch also exists but is just a copy of `main` and carries no art file. The verified artefact is
`69e176e`.

| Check                                  | Expected                                                           | Actual                       | Result |
| -------------------------------------- | ------------------------------------------------------------------ | ---------------------------- | ------ |
| `git cat-file -s` (the pre-push check) | 214378                                                             | **214378**                   | PASS   |
| Byte size                              | 214,378                                                            | 214,378                      | PASS   |
| RIFF-declared total                    | 214,378                                                            | 214,378                      | PASS   |
| declared == actual                     | equal                                                              | equal                        | PASS   |
| SHA-256                                | `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe` | identical                    | PASS   |
| RIFF/WEBP magic                        | `RIFF` / `WEBP`                                                    | `RIFF` / `WEBP`              | PASS   |
| Container fourcc                       | `VP8 `                                                             | `VP8 `                       | PASS   |
| Decoded dimensions                     | 1024 × 1536                                                        | 1024 × 1536                  | PASS   |
| Full decode                            | succeeds                                                           | `DECODE OK (1024, 1536) RGB` | PASS   |

The file staged for review and the bytes served by the dev server were both re-hashed and match
`cb766584…` exactly, so what was reviewed is provably the committed master.

## 2. Crop-safety — PASS, but with almost no headroom

Master 1024 × 1536. All three shipped crops recomputed and rendered:

| Crop | Consumer                   | Visible height | Trim   | Top / bottom | Safe rows    |
| ---- | -------------------------- | -------------- | ------ | ------------ | ------------ |
| 3:4  | `CardView`, `CreatureSlot` | 1365 px        | 171 px | 85 / 86      | 85–1450      |
| 7:9  | `HandCardPreview`          | 1317 px        | 219 px | 109 / 110    | 109–1426     |
| 4:5  | `CardDetailDrawer`         | 1280 px        | 256 px | 128 / 128    | **128–1408** |

**Nothing essential is clipped in any of the three crops.** Face, both hands and the rune tablet are
comfortably inside every crop, and the tablet sits near the exact vertical centre — the safest
position on the canvas.

**Caveat 1 — head clearance is ~2–4 px, not the ~130 px the brief specified.** Measured by drawing
the three cut lines onto a magnified top strip: the hair crown sits at master row **~130**, and the
4:5 cut is at row **128**. The brief's §10 asked for the head top at row ~260. The candidate frames
the figure considerably tighter and higher than briefed.

Consequences, stated plainly:

- Today, in the three shipped crops, this **passes** — nothing is cut.
- The margin is ~0.2% of canvas height. Any future surface with a tighter ratio than 4:5, or any
  re-encode/rescale that rounds differently, clips the top of the head.
- The brief's claim that this card would ship with "zero accepted crop losses, designed out" is
  technically still true, but the safety margin that claim assumed is not there.

The bottom is a non-issue: the figure continues to the canvas bottom edge, so the bottom trim
removes only body/floor, never a read.

## 3. Live surface review — all five surfaces PASS

Full stack brought up locally (PostgreSQL 16 + Redis + Prisma migrate + seed of 64 cards +
game-server on :4000 + Next dev on :3000) so the review ran against **real card data and real
components**, not mocks. `/api/cards` returned 41 active slugs including
`acolyte-of-the-white-rune`.

Reviewed at desktop 1440×900 and mobile 390×844, deviceScaleFactor 2:

| Surface                                          | Result                                          |
| ------------------------------------------------ | ----------------------------------------------- |
| Raw master art                                   | PASS                                            |
| `CardView` 3:4 (collection / hand / deck select) | PASS — name, ПЕРСОНАЖ · COMMON, 1/3 all legible |
| `CardDetailDrawer` 4:5                           | PASS                                            |
| `HandCardPreview` 7:9                            | PASS                                            |
| `CreatureSlot` 3:4 (Battlefield board slot)      | PASS — 1/3 stat block clear over the art        |
| `/admin/art-review` desktop                      | PASS                                            |
| `/admin/art-review` 390 px mobile                | PASS                                            |

Card 01 is a CHARACTER, so `CreatureSlot` **is** a real surface here — five panels render, unlike
Card 04's four.

**Candidate isolation proven by network trace.** The page requested
`/art-review-candidates/acolyte-of-the-white-rune.{png,jpg,webp}` (the extension fallback walking to
webp) and **never** `/art/cards/acolyte-of-the-white-rune.webp`. The row's badges read
`rightsStatus: placeholder` and `showing CANDIDATE (not wired to artworkUrl)` — the candidate stayed
a candidate throughout.

## 4. Thumbnail legibility at 92 px — PASS

Rendered at the real `CardView size="xs"` cap (92 × 123 px at 3:4; 92 × 115 at 4:5):

- Faction reads instantly as PURIFICATION — white/silver/ivory dominates.
- Face is a clean, evenly lit, unobstructed shape and remains the primary focal point.
- The rune tablet survives as a distinct light rectangle with a visible cold glow, separated in
  value from both the bare hands and the cuirass. The brief's specific worry — tablet, hands and
  garment collapsing into one ivory mass — did not materialise.

## 5. Hierarchy vs. the LEGENDARY flagship — PASS, unambiguously

Both rendered at real 92 px and compared side by side. The read is immediate: the High Warden is a
wide gold-filigreed pyramid with crown, spear and shield; the Acolyte is a narrow plain-silver
column with a small tablet and no ornament. The brief's one-sentence test — "if you cannot instantly
say which one costs 6, it has failed" — passes comfortably.

**Caveat 2 — rendering style diverges from the house style.** Side by side, the Warden reads as
painterly card illustration; the Acolyte reads noticeably **photographic** — skin, hair and facial
rendering look closer to a retouched photo than to painted art. §13 asked for "painterly high-detail
fantasy card illustration", and the generator's own refinement prompt explicitly asked to make it
"more painterly... rather than a photographic portrait" — so the generator was already trying to
correct this and did not fully succeed. This is not a §15 checklist item; it is an art-direction
consistency call that belongs to the owner.

## 6. §15 production acceptance checklist — walked against the real file

**File integrity** — all PASS: plain `VP8 ` container (not `VP8X`); dimensions exactly 1024 × 1536;
RIFF-declared total equals byte size; SHA-256 recorded and matching; transported by commit on a
branch.

**Rank and rarity read** — all PASS: COMMON vs LEGENDARY obvious at thumbnail size; no crown or head
ornament; no cape, weapon or shield; **armored not robed** — smooth undecorated cuirass, gorget, two
small matching pauldrons and vambraces all clearly readable; armor is light and plain with no full
harness, no layered pauldron stacks, no faulds or tassets, no embossing; metal is brushed satin
matte, not mirror-polished, with no dents, rust, dirt or damage; hands bare, no gauntlets, reading as
human hands on the tablet at thumbnail size; gold present only as thin hairlines on the collar edge,
pauldron rims and tablet rim, well under ~3% of canvas; no rose window, cathedral facade, banners,
floor rune-circle or ranked crowd.

**Faction read** — all PASS: white/silver/ivory dominate; bright near-shadowless lighting with the
darkest value a mid-grey, not black; all edges crisp and opaque, nothing translucent; cloth pressed
and clean, nothing tattered; cold frost/light motes only, no ash or embers; no crimson, red, violet,
magenta or orange anywhere; rune magic bound in the tablet, nothing cast from an open hand.

**Composition and crops** — PASS with Caveat 1: head, face, hands and tablet all inside rows
128–1408; verified in all three crops; no essential content lost at any crop.

**Legibility** — all PASS, including the 390 px mobile pass in `/admin/art-review`.

**Anatomy and cleanliness** — PASS: hands and fingers correct, ten fingers, natural grip; the tablet
is a coherent solid object with consistent rim and perspective; no text, lettering, watermark,
signature or logo anywhere.

## 7. Repository change

One file, one commit (`df0227a`): `apps/web/src/app/admin/art-review/page.tsx` — adds
`acolyte-of-the-white-rune` to `REVIEW_TARGETS` as `ART PACK 03 — CANDIDATE 01`, deliberately
**without** `reviewArtworkUrl` so it can only ever resolve through the gitignored candidate path.

The candidate file itself was staged at
`apps/web/public/art-review-candidates/acolyte-of-the-white-rune.webp` and is gitignored
(`.gitignore:23`) — confirmed via `git check-ignore`; it is not committed.

Note on diff size: Prettier also normalised pre-existing formatting violations elsewhere in this
file. Verified that `prettier --check` **already failed on this file on clean `main`**, so those are
whitespace-only fixes to lines that were non-conformant before, not collateral from this change.

## 8. Validation

| Check                         | Result                                           |
| ----------------------------- | ------------------------------------------------ |
| `git diff --check`            | PASS (clean)                                     |
| Prettier on the changed file  | PASS                                             |
| ESLint (`apps/web`)           | PASS (no output)                                 |
| Typecheck (`apps/web`)        | PASS — 0 errors                                  |
| Production build (`apps/web`) | PASS — compiled successfully, all routes emitted |

Honest note on typecheck/build: the first run reported 4 errors and the build failed, all in
`CardDetailDrawer.tsx` and `HandFan.tsx` — files this change does not touch. Two checks confirmed
they were not mine: stashing the change reproduced **the identical 4 errors on clean `main`**, and
none were in the edited file. They were a **build-order artifact** — `packages/shared` and
`packages/ui` had not been built, so the app was typechecking against stale package types. After
building those two workspaces, typecheck reports **0 errors** and the production build succeeds.

## 9. Known caveats, restated for the decision

1. **Head clearance ~2–4 px under the 4:5 cut** instead of the briefed ~130 px. Passes today in all
   three shipped crops; leaves effectively no margin for a future tighter surface or a re-encode.
2. **Photographic rather than painterly rendering**, diverging from the Art Pack 01/02 house style
   most visible next to the High Warden.

Neither is a §15 failure. Both are owner calls: accept as-is, or send back for a re-render with more
headroom and a more painterly treatment.

## 10. Confirmed untouched

`apps/game-server/prisma/seed.ts`, Prisma schema and migrations, gameplay/balance/card
text/effects/rarity/cost/stats/faction, every card's `artworkUrl` and `rightsStatus`, all files under
`apps/web/public/art/cards/`, Battlefield gameplay and layout,
`apps/game-server/scripts/sync-production-card-art.ts`,
`.github/workflows/production-card-art-sync.yml`, Railway/Vercel configuration, the production
database, and all Art Pack 01 / Art Pack 02 approved assets.

The candidate branch was **not merged**. No promotion, no seed change, no production sync. The local
PostgreSQL/Redis instances used for QA are throwaway session state and touch nothing remote.

## 11. Recommended next action

**Owner visual approval decision on the two caveats.**

- If accepted: a separate, explicitly authorised integration task promotes the artwork — copy to
  `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`, set `artworkUrl` and
  `rightsStatus: 'owned'` in `seed.ts`, mark Art Pack 03 Card 01 approved, and extend the production
  sync 10 → 11 (pin, `TARGET_SLUGS`, confirmation string and **every** count assertion moving
  together in one change).
- If sent back: the fix is a re-render with the head lowered toward master row ~260 and a more
  painterly treatment; §13/§14 need no change beyond re-emphasising those two points.

Promotion remains **unauthorised** until the owner approves.
