# Agent Handoff

Task: Art Pack 03 Card 02 — verified candidate-v2 → real visual QA → owner gate
(`docs/CLAUDE_CURRENT_TASK.md` @ `568b4a9`)
Date: 2026-08-30
Branch: `main` (report/state) + `claude/card-02-review-support` (review-only code)
Base SHA: `e1dde8c`
PR: none opened — the review-only change is pushed as a branch; say the word and it becomes a PR

## FINAL STATUS: READY FOR OWNER VISUAL APPROVAL

Every integrity value matched exactly, all eight required surfaces were reviewed in the real
running application, and every automatic-reject condition in the brief was checked and cleared.

Two caveats are recorded below. Neither trips an automatic reject as written, but both are
deliberate judgement calls the owner should see before approving — the first is a genuine deviation
from the brief's environment spec.

## Step 1 — independent integrity gate: FULL PASS

Fetched `assets/seal-of-the-curse-candidate-v2` fresh from GitHub and verified from the fetched Git
objects, not from anything handed to me.

| Check                | Expected                                                           | Observed                              | Result |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------- | ------ |
| remote branch head   | `6740569…`                                                         | `6740569…`                            | PASS   |
| parent commit        | `d6428d2…`                                                         | `d6428d2…`                            | PASS   |
| commits above parent | 1                                                                  | 1                                     | PASS   |
| commit delta         | only the one WebP                                                  | `A art-source/seal-of-the-curse.webp` | PASS   |
| `git cat-file -s`    | `326508`                                                           | `326508`                              | PASS   |
| Git blob SHA         | `95940017577f7152a28bf76122912c37e548c7e0`                         | identical                             | PASS   |
| SHA-256              | `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261` | identical                             | PASS   |
| RIFF-declared total  | `326508`                                                           | `326508`                              | PASS   |
| FourCC               | plain `VP8 `                                                       | plain `VP8 `                          | PASS   |
| dimensions           | `1024 × 1536`                                                      | `1024 × 1536`                         | PASS   |
| full decode          | PASS                                                               | 4,718,592 px bytes (= 1024×1536×3)    | PASS   |

**The long-running 313,964 discrepancy is now settled.** The real master's own RIFF header declares
`326508`. The `313964` figure came from the 27-byte fragment and described something else; the
canonical values as written are correct, and no expected value needed changing.

## Step 2 — local staging: PASS

Materialized the verified blob to `apps/web/public/art-review-candidates/seal-of-the-curse.webp`.

- post-staging size: `326508`
- post-staging SHA-256: `699db6b7…` — unchanged
- `git check-ignore` confirms `.gitignore:23` covers it; `git status` shows nothing

Production artwork paths, `artworkUrl` and `rightsStatus` were not touched.

## Candidate isolation — proven twice, independently

1. **Live API** still reports `seal-of-the-curse` with `rightsStatus: placeholder` and its original
   SVG-data-URI `artworkUrl`. Production card data is untouched.
2. **Network trace** during the review: the only `seal-of-the-curse` request that resolves is
   `/art-review-candidates/seal-of-the-curse.webp`. No `/art/cards/seal-of-the-curse.*` request
   exists.
3. **On-page badges** read `rightsStatus: placeholder` and
   `showing CANDIDATE (not wired to artworkUrl)`.

## How the QA was run — the real application, not mocks

Brought up the actual stack locally: PostgreSQL 16 → `prisma migrate deploy` → real seed (64 cards,
41 active) → NestJS game-server on `:4000` → Next.js dev server on `:3000`, driven with Playwright
(Chromium). Every surface below is the real component rendering the real card record from
`GET /api/cards`.

## Step 3 — the eight required surfaces

`CreatureSlot` was correctly **not** reviewed: `seal-of-the-curse` is an EVENT, so the page takes the
`hasBoardSlot === false` path and renders four panels, not five. Verified in the live DOM.

| #   | Surface                     | How captured                                    | Result |
| --- | --------------------------- | ----------------------------------------------- | ------ |
| 1   | raw 2:3 master              | direct file + admin "Raw master art" panel      | PASS   |
| 2   | `CardView` 3:4              | real `CardView` component, admin row            | PASS   |
| 3   | `CardDetailDrawer` 4:5      | 4:5 panel **and** the real modal, opened        | PASS   |
| 4   | `HandCardPreview` 7:9       | 7:9 panel **and** the real modal, opened        | PASS   |
| 5   | `/admin/art-review` desktop | 1440×1100 @2x                                   | PASS   |
| 6   | `/admin/art-review` 390px   | 390×844 @3x, mobile emulation                   | PASS   |
| 7   | 92 px thumbnail             | real `CardView` constrained to 92 px in-browser | PASS   |
| 8   | 92 px grayscale             | desaturation of (7)                             | PASS   |

At 390 px: `scrollWidth === clientWidth === 390` — **no horizontal overflow**. The row reflows to two
columns and all four surfaces stay legible.

## Crop-safe geometry — measured, not eyeballed

A brightness heuristic failed here exactly as it did on Card 01 (it locks onto the pale stone
background), so the boundaries were measured visually, by rendering the top and bottom strips
magnified with the crop cut lines drawn on them.

Bands for a 1024×1536 master under `object-cover` (width never trimmed): 3:4 → rows 85–1450;
7:9 → 109–1426; **4:5 → 128–1408 (binding)**.

- **Top:** above row 128 there is only dark gauntlet forearm and pale background. The clamp's
  uppermost plate corner begins at **y ≈ 262**.
- **Clearance against the binding cut: ~134 px.** That is precisely the ~130 px the brief asked for,
  and it is the deliberate correction of Card 01, which cleared by only 2–4 px.
- Against the brief's stricter _working_ line of y≈260 the clamp sits 2 px inside. Worth stating
  plainly so the number is not misread: the 2 px is against a self-imposed conservative rule, not
  against any real crop.
- **Bottom:** the pommel disc spans roughly y≈1185–1470, so the 4:5 cut at 1408 clips its lower
  portion. The clamp, fist and guard — the entire essential story — sit well above it. Confirmed on
  the real 4:5 surfaces: nothing essential is lost.

## The brief's automatic-reject conditions — all twenty checked

**Concept**

1. Corruption rather than binding — **CLEAR.** No rot, blight, tendrils or spreading darkness.
2. Caster, face or full figure — **CLEAR.** Only a forearm and hand.
3. Magic being actively cast — **CLEAR.** The seal is already closed and locked.
4. Would still read as "a warrior holding a sword" with the glow removed — **CLEAR, decisively.**
   Tested directly: with all emissive light stripped and the image desaturated, it still reads
   unmistakably as a heavy metal clamp bolted around a fist and the crossguard. The stop survives on
   geometry and material alone.
5. Seal reads as the wearer's own armour — **CLEAR.** The clamp is bright white-silver against the
   arm's blackened steel, and it bridges from the fist across to the guard. No gauntlet does that;
   it reads as applied restraint.

**Faction**

6. Crimson, red, violet, magenta, ember-orange — **CLEAR, measured.** Zero violet/magenta pixels; 3
   red pixels in the whole image (0.00%). The 0.72% reading as "orange" is dark leather at mean
   value 0.26 and mean saturation 0.20 — not embers. Saturated content is overwhelmingly hue
   195–210° (pale steel-blue).
7. Dark arm becomes a black silhouette / deep chiaroscuro — **CLEAR, measured.** Median dark-pixel
   value 71/255, 1st percentile 28, and exactly **one** pixel below 12. The arm holds form and
   highlights in mid-dark grey, which is what the brief demanded.
8. Warm embers, ash, smoke — **CLEAR.**
9. Spectral, translucent, dissolving forms — **CLEAR.**
10. Tattered or ragged cloth — **CLEAR.** No cloth.
11. Cathedral facade, rose window, halo, banners, floor rune-circle, crowd — **not triggered as
    written** (none of those six is present), but see Caveat 1.

**Rarity**

12. Gold above ~5% — **CLEAR, measured at 0.01%.**
13. Heraldry/crest/insignia on the enemy **armour** — **not triggered as written**; see Caveat 2.
14. Monumental/ornate treatment reading LEGENDARY — **CLEAR.** Single object, tight crop.

**Structural**

15. Essential content outside rows 260–1280 — **CLEAR** for the clamp (starts 262). The pommel
    extends below 1280 but is not essential; see the crop section.
16. Seal not the brightest/highest-contrast/most central — **CLEAR, measured.** Specular pixels
    (luma ≥245) have their centroid at (494, 563) — on the clamp's rune face. The centre cell owns
    the highest contrast (σ 61.2) and detail (edge 29.6). The pale background has higher _mean_
    luminance but carries no contrast and almost no detail, so it never competes.
17. Seal and arm merge when desaturated at 92 px — **CLEAR.** Grayscale range at 92 px is 155
    (p5 30 → p95 185). The silver band stays clearly separated from the dark hand.
18. Fussy geometry disintegrating at thumbnail size — **CLEAR.** The clamp is built from large
    blocky plates; it survives 92 px as a single readable silver mass.
19. Malformed hand anatomy, extra or missing fingers — **CLEAR, with a note.** The desaturated test
    render reads the hand far better than the colour version: knuckles and finger backs to the right
    of the clamp, finger segments on the grip below-left, a curled form under the lower plate.
    Nothing is fused, broken, extra or missing. The clamp does occlude the middle of the hand, so an
    exact finger count is not possible — the occlusion is doing real work here, and it is doing it
    successfully.
20. Text, lettering, watermark, signature, logo — **CLEAR.** All four corners inspected at
    magnification; nothing.

## 92 px rarity hierarchy — Common < Rare < Legendary

Measured on the artwork region of each real 92 px `CardView`:

| Card                                      | mean L | tonal range (p5→p95) | edge density |
| ----------------------------------------- | ------ | -------------------- | ------------ |
| COMMON `acolyte-of-the-white-rune`        | 117.9  | 164                  | **20.95**    |
| RARE `seal-of-the-curse`                  | 111.3  | 155                  | **23.73**    |
| LEGENDARY `high-warden-of-the-white-rune` | 87.7   | 176                  | **31.85**    |

**Edge density runs 20.95 < 23.73 < 31.85 — a clean monotonic Common < Rare < Legendary on detail
density, independent of the rarity frame.** That is exactly the brief's requirement that hierarchy
not rest on frame treatment alone.

Worth recording honestly: my first visual impression was that the Seal read as the _darkest_ of the
three. Measuring disproved it — the Legendary is darkest at 87.7, and the Warden's bright gold frame
had misled the eye. The Seal sits between the two on luminance, as a RARE should.

## Caveats for the owner

### Caveat 1 — the background describes architecture; the brief asked for near-abstract

This is the one real deviation from the brief and the reason it is flagged rather than buried.

§7 specifies "a shallow, pale, near-abstract space… out of focus and carries almost no information",
with at most "a suggestion of a stone edge… without describing it."

The candidate's background is a pale, blurred **interior**: an arcade of columns and arches with a
receding tiled floor. It is genuinely soft, low-contrast, desaturated and never competes with the
seal (confirmed by the focal measurements in #16). But it _describes_ architecture rather than being
near-abstract — more information than §7 asked for.

Reject condition #11 lists "cathedral **facade**, rose window, halo, banners, floor rune-circle,
crowd." None of those six is present — this is an interior, not a facade, with no window, halo,
banner, circle or crowd. So the automatic reject does not fire on its wording, and I have not
treated it as one. But the owner should decide whether the environment is close enough to the locked
spec, because it is the one place where the image and the brief genuinely diverge.

### Caveat 2 — the star emblem on the enemy pommel

The pommel carries a multi-pointed star / compass-rose relief. Reject #13 forbids heraldry or
insignia "on the enemy **armour**" — this is on the weapon, so #13 does not fire.

Still worth a look: an emblem gives the enemy a shred of identity, and a star motif is the one shape
that could be read toward COSMIC. Arguments it is safe: it is unlit dark steel with no colour, glow,
iridescence or starfield, where COSMIC's language is exactly that sheen; it is generic knightly
heraldry; and it shrinks to nothing at 92 px and is partly cropped at 4:5. My assessment is that it
is neutral, but it is the owner's call.

## Validation of the review-only code change

One file changed: `apps/web/src/app/admin/art-review/page.tsx` — a single `REVIEW_TARGETS` entry
registering `seal-of-the-curse` with **no** `reviewArtworkUrl`, so the page reads the gitignored
candidate drop and can never touch production `artworkUrl` or `rightsStatus`.

| Check                   | Result                                                                  |
| ----------------------- | ----------------------------------------------------------------------- |
| `git diff --check`      | clean                                                                   |
| Prettier                | PASS                                                                    |
| lint (`@kod-raido/web`) | PASS                                                                    |
| typecheck               | PASS (after building `shared` + `ui`, the known build-order dependency) |
| tests                   | PASS — 6 files, 32 tests                                                |
| production build        | PASS                                                                    |

Branch: `claude/card-02-review-support` @ `45bdb37`. No PR opened.

## Artifacts

QA captures were written to the session scratchpad and deliberately **not committed** (protocol
rule F — no large QA binaries in git): the four admin panels, both real modals, desktop and 390 px
rows, the three 92 px cards, the colour and grayscale comparison sheets, the glow-removed test, the
top/bottom crop-line strips, and the corner scans.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`, Prisma schema and migrations, gameplay / balance / card data,
`apps/web/public/art/cards/`, every card's production `artworkUrl` and `rightsStatus`, Battlefield
gameplay and layout, production sync scripts and workflows, Railway / Vercel / production DB. No
workflow was dispatched. The candidate was not merged or promoted. Card 03 was not started. The
accepted WebP bytes were never altered — the staged copy is byte-identical to the committed blob.

## Recommended next action

Owner visual approval of the candidate, with an explicit decision on the two caveats — Caveat 1 in
particular, since the environment is the one place the image diverges from the locked brief.

If approved, integration is the separate authorized step: wire `artworkUrl` to
`/art/cards/seal-of-the-curse.webp` with `rightsStatus: 'owned'`. Note that
`SYNC-11-CARD-ART-PRODUCTION` is **consumed** — a twelfth card needs fresh owner confirmation and a
sync pin repointed at a new already-merged integration commit.
