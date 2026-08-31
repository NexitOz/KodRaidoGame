# Art Pack 03 — PURIFICATION (Стражи Белой Руны)

Production artwork for the PURIFICATION faction's non-flagship cards. The faction's LEGENDARY
flagship, `high-warden-of-the-white-rune`, was approved earlier as part of Art Pack 01 and is not
part of this pack — see [`art-bible-01.md`](art-bible-01.md).

**Pack status:** IN PROGRESS — Cards 01 and 02 complete end to end and live in production; Card 03
FINAL OWNER APPROVED with repository integration in review, not yet synced to production.

| #   | Slug                        | Type / Rarity / Cost   | Status                                           |
| --- | --------------------------- | ---------------------- | ------------------------------------------------ |
| 01  | `acolyte-of-the-white-rune` | CHARACTER / COMMON / 1 | **LIVE IN PRODUCTION**                           |
| 02  | `seal-of-the-curse`         | EVENT / RARE / 2       | **LIVE IN PRODUCTION**                           |
| 03  | `warden-of-the-barrier`     | CHARACTER / RARE / 3   | **FINAL OWNER APPROVED — integration in review** |
| 04  | `rune-of-curse-breaking`    | RUNE / EPIC / 3        | not started                                      |

## Card 01 — `acolyte-of-the-white-rune` — FINAL APPROVED

Owner-approved 2026-08-27.

### Card facts

| Field                      | Value                                                             |
| -------------------------- | ----------------------------------------------------------------- |
| `slug`                     | `acolyte-of-the-white-rune`                                       |
| `name`                     | Послушник Белой Руны                                              |
| `type` / `rarity` / `cost` | CHARACTER / COMMON / 1                                            |
| `attack` / `health`        | 1 / 3                                                             |
| `tags`                     | `['Purification']`                                                |
| `abilityText`              | При выходе: снимите Проклятие и Заглушение с выбранного союзника. |
| `effectJson`               | `ON_PLAY` → `CLEANSE` / `FRIENDLY_CHOSEN`                         |

None of the above was changed by the art integration.

### Production artwork

| Property            | Value                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Path                | `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`                                            |
| Dimensions          | 1024 × 1536 (vertical 2:3)                                                                            |
| Byte size           | 214378                                                                                                |
| RIFF-declared total | 214378 (equals byte size)                                                                             |
| Container fourcc    | plain `VP8 ` (original export, not a `VP8X` transcode)                                                |
| SHA-256             | `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`                                    |
| Candidate source    | `assets/acolyte-of-the-white-rune-candidate` @ `69e176e`, `art-source/acolyte-of-the-white-rune.webp` |

The production copy was taken byte-for-byte from the candidate git object and re-verified at the
production path: identical SHA-256, identical byte size, declared size equal to actual, plain `VP8 `,
1024 × 1536, and a clean full decode. No re-encode, resize or sharpen was applied at any point.

`seed.ts` carries `artworkUrl: '/art/cards/acolyte-of-the-white-rune.webp'` and
`rightsStatus: 'owned'`.

### Visual direction

Approved brief:
[`art-review/acolyte-of-the-white-rune-master-art-brief.md`](art-review/acolyte-of-the-white-rune-master-art-brief.md)

The card holds PURIFICATION's material language — white/silver/ivory, pressed never-tattered edges,
bright near-shadowless light, cold frost motes, engraved material-bound rune magic, frontal
near-symmetrical posture — while inverting the flagship's structural devices to read as COMMON:
three-quarter framing, a narrow upright column rather than a wide pyramid, a bare head with no
crown, one small white-stone rune tablet instead of spear-plus-shield, light plain standard-issue
armor instead of a full ceremonial harness, gold limited to hairlines, a modest cloister arcade
instead of the cathedral facade, and no crowd.

The "light armor, not robes" decision was made explicitly by the owner: the art bible's
"armor, not robes" rule is held strictly, and the COMMON rank read comes from _how little armor
there is and how undecorated it is_, never from swapping armor for cloth.

### QA — PASS

Full evidence:
[`agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md`](agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md)

Reviewed against real card data and real components with the full local stack running, at desktop
1440×900 and mobile 390×844.

| Surface                                                | Result |
| ------------------------------------------------------ | ------ |
| Raw master art                                         | PASS   |
| `CardView` 3:4 (collection / hand / deck select)       | PASS   |
| `CardDetailDrawer` 4:5                                 | PASS   |
| `HandCardPreview` 7:9                                  | PASS   |
| `CreatureSlot` 3:4 (Battlefield board slot)            | PASS   |
| `/admin/art-review` desktop                            | PASS   |
| `/admin/art-review` 390 px mobile                      | PASS   |
| 92 px thumbnail legibility                             | PASS   |
| Hierarchy vs. `high-warden-of-the-white-rune` at 92 px | PASS   |

The §15 acceptance checklist in the brief passes on every item, including the decisive ones: armored
not robed; light plain armor with no full harness; matte non-mirrored metal; bare hands; gold only
as hairlines; no crimson/violet/ember, chiaroscuro, translucency or cast-from-palm drift; no
cathedral, banners, floor rune-circle or crowd; COMMON vs LEGENDARY obvious at thumbnail size.

Crop math (master 1024 × 1536, `object-cover` centre anchor, full width always preserved):

| Crop | Consumer                   | Visible height | Trim               | Safe rows    |
| ---- | -------------------------- | -------------- | ------------------ | ------------ |
| 3:4  | `CardView`, `CreatureSlot` | 1365 px        | 171 px (85 / 86)   | 85–1450      |
| 7:9  | `HandCardPreview`          | 1317 px        | 219 px (109 / 110) | 109–1426     |
| 4:5  | `CardDetailDrawer`         | 1280 px        | 256 px (128 / 128) | **128–1408** |

Nothing essential is clipped in any of the three shipped crops.

### Accepted caveats

Both were reviewed and **explicitly accepted by the owner** at approval. They are recorded here so
they are not rediscovered later as defects.

1. **Head clearance is ~2–4 px under the 4:5 crop.** The hair crown sits at master row ~130 against
   the 4:5 top cut at row 128. The brief's §10 asked for the head top at row ~260 with ~130 px of
   clearance. Nothing is clipped in any currently shipped crop, but there is effectively no margin:
   a future surface with a ratio tighter than 4:5, or a re-encode that rounds differently, would
   clip the top of the head. **Treat 4:5 as the hard floor for this asset** — if a tighter crop is
   ever introduced, this card must be re-checked first.
2. **Rendering is more photographic than the older painterly baseline.** Beside
   `high-warden-of-the-white-rune`, the Acolyte reads closer to a retouched photograph than to
   painted card illustration. §13 of the brief asked for painterly treatment and the generation
   refinement prompt tried to correct this without fully succeeding. Owner-accepted as-is. Worth
   revisiting as a house-style question when Art Pack 03 Cards 02–04 are briefed, so the pack stays
   internally consistent.

### Provenance

Generator: OpenAI ChatGPT image generation. Exact refinement prompt, generation id and technical
normalisation are recorded on the candidate branch at
`docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`.

The refinement prompt is recorded honestly as the prompt actually used and is **not** a byte-for-byte
copy of the brief's §13/§14 — which is why the §15 checklist was walked against the real file rather
than inferred from the prompt text.

### Transport note

The first transport attempt (`1652efaa`) committed a **truncated** 15,042-byte file whose own RIFF
header declared 214,378 bytes; it was rejected on byte verification and never used. The re-transport
(`69e176e`) landed the full 214,378 bytes on the same branch. A `transport/acolyte-of-the-white-rune-v2`
branch also exists but contains no art file and should be ignored.

This was the second ~15 KB truncation on this project (SHADOW Card 04 v1 was 14,999 bytes).
**The standing safeguard is `git cat-file -s HEAD:<path>` before pushing** — it reads the size back
out of the object git actually stored, and would have caught both.

## Card 02 — `seal-of-the-curse` — FINAL APPROVED

Owner-approved 2026-08-30. Record:
[`agent-reports/2026-08-30-art-pack-03-card-02-owner-approval.md`](agent-reports/2026-08-30-art-pack-03-card-02-owner-approval.md)

### Card facts

| Field                      | Value                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `slug`                     | `seal-of-the-curse`                                                                                     |
| `name`                     | Печать Проклятия                                                                                        |
| `type` / `rarity` / `cost` | EVENT / RARE / 2                                                                                        |
| `tags`                     | `['Purification']`                                                                                      |
| `abilityText`              | Наложите Проклятие на выбранного вражеского персонажа - он не может атаковать, пока Проклятие не снято. |
| `effectJson`               | `ON_PLAY` → `ADD_STATUS` / `ENEMY_CHOSEN` / `CURSE`                                                     |

None of the above was changed by the art integration.

### Production artwork

| Property            | Value                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Path                | `apps/web/public/art/cards/seal-of-the-curse.webp`                                       |
| Dimensions          | 1024 × 1536 (vertical 2:3)                                                               |
| Byte size           | 326508                                                                                   |
| RIFF-declared total | 326508 (equals byte size)                                                                |
| Container fourcc    | plain `VP8 ` (original export, not a `VP8X` transcode)                                   |
| SHA-256             | `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`                       |
| Git blob SHA        | `95940017577f7152a28bf76122912c37e548c7e0`                                               |
| Candidate source    | `assets/seal-of-the-curse-candidate-v2` @ `6740569`, `art-source/seal-of-the-curse.webp` |

The production copy was taken byte-for-byte from the candidate git object and re-verified at the
production path: `cmp` identical, identical SHA-256 and byte size, declared size equal to actual,
plain `VP8 `, 1024 × 1536, and a clean full decode. `git hash-object` on the production file returns
the candidate's blob SHA unchanged. No re-encode, resize or sharpen was applied at any point.

`seed.ts` carries `artworkUrl: '/art/cards/seal-of-the-curse.webp'` and `rightsStatus: 'owned'`.

### Visual direction

Approved brief:
[`art-review/seal-of-the-curse-master-art-brief.md`](art-review/seal-of-the-curse-master-art-brief.md)

The card resolves PURIFICATION applying a "Curse" by reading it as **binding, not taint** — jailer's
work rather than sorcery. A rigid white/silver rune clamp locks a hostile gauntleted fist to its own
sword hilt and crossguard, so the weapon cannot be raised. That matches the mechanic exactly, since
CURSE prevents attacking rather than dealing harm, and it keeps the card inside the faction's locked
language without touching the crimson/violet that would read as SHADOW or VEIL.

RARE is signalled by engineered precision rather than ornament: hinges, banding, rivets and a lock
block, against Card 01's plain slab and the flagship's broad filigree.

### Verification at approval

Full QA record:
[`agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md`](agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md)

All eight required surfaces passed on the real application stack. `CreatureSlot` is correctly not a
surface for this card — an EVENT never occupies a Battlefield board slot. All twenty automatic-reject
conditions in the brief were checked and cleared, several by measurement: 0 violet/magenta and 3 red
pixels, gold at 0.01% against a ~5% ceiling, dark-arm median value 71/255 with one pixel below 12,
and specular centroid on the clamp face. The clamp's top edge sits at y≈262, giving ~134 px of
clearance against the binding 4:5 cut at row 128. At 92 px the rarity ladder reads
Common 20.95 < Rare 23.73 < Legendary 31.85 on edge density, independent of the rarity frame.

### Accepted caveats — non-blocking

The owner reviewed and explicitly accepted both. Neither is to be reopened unless a new regression
appears on the production artwork path.

1. **Background describes architecture.** §7 of the brief asked for a near-abstract space carrying
   "almost no information"; the artwork shows a pale, blurred interior arcade with columns and a
   receding tiled floor. It stays low-contrast and never competes with the seal, and none of reject
   #11's six named items (facade, rose window, halo, banners, floor rune-circle, crowd) is present.
2. **Star emblem on the enemy pommel.** Reject #13 covers insignia on enemy _armour_; this is on the
   weapon. It is unlit dark steel with no COSMIC colour, glow or iridescence, and it disappears at
   92 px.

## Card 03 — `warden-of-the-barrier` — FINAL OWNER APPROVED, INTEGRATION IN REVIEW

Owner-approved 2026-08-31. Record:
[`agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md`](agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md)

Candidate QA:
[`agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`](agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md)

**Not live in production.** The repository integration is open for review; the controlled sync has
not been extended past its consumed 12-card state at runtime — see the 12 → 13 section below.

### Card facts

| Field                      | Value                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `slug`                     | `warden-of-the-barrier`                                                                             |
| `name`                     | Хранительница Барьера                                                                               |
| `type` / `rarity` / `cost` | CHARACTER / RARE / 3                                                                                |
| `attack` / `health`        | 2 / 5                                                                                               |
| `tags`                     | `['Purification']`                                                                                  |
| `abilityText`              | При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.       |
| `effectJson`               | `ON_PLAY` → `SHIELD` / `SELF`; `ON_PLAY` + `RESONANCE_TIER_AT_LEAST 5` → `CLEANSE` / `FRIENDLY_ALL` |

None of the above was changed by the art integration.

### Production artwork

| Property            | Value                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Path                | `apps/web/public/art/cards/warden-of-the-barrier.webp`                                           |
| Dimensions          | 1024 × 1536 (vertical 2:3)                                                                       |
| Byte size           | 193038                                                                                           |
| RIFF-declared total | 193038 (equals byte size)                                                                        |
| Container fourcc    | plain `VP8 ` (original export, not a `VP8X` transcode)                                           |
| SHA-256             | `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`                               |
| Git blob SHA        | `c4cb3f4e41f349e86b044712f267f9fdc678aa86`                                                       |
| Candidate source    | `assets/warden-of-the-barrier-candidate-v2` @ `3dda92e`, `art-source/warden-of-the-barrier.webp` |

The production copy was taken byte-for-byte from the candidate git object via `git show` and
re-verified at the production path: identical SHA-256 and byte size, declared size equal to actual,
plain `VP8 `, 1024 × 1536, and a clean full decode of 4,718,592 RGB bytes. The production file's
blob SHA equals the candidate's unchanged. No re-encode, resize or sharpen was applied.

`seed.ts` carries `artworkUrl: '/art/cards/warden-of-the-barrier.webp'` and `rightsStatus: 'owned'`.

### Rejected historical input

A v1 candidate (`284002` bytes, SHA-256
`1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`) was rejected for violating the
brief's automatic rejects and must never be substituted. It still sits on the superseded
`assets/warden-of-the-barrier-candidate` branch.

### Visual direction

Approved brief:
[`art-review/warden-of-the-barrier-master-art-brief.md`](art-review/warden-of-the-barrier-master-art-brief.md)

The Warden **plants a barrier** rather than carrying a shield: a hinged, segmented white-steel
ward-screen spiked into the ground, with a lit rune channel running off both frame edges. The
flagship `high-warden-of-the-white-rune` already owns the large rune-engraved round shield with a
compass/star emblem, so the device had to differ. The off-frame channel carries the `FRIENDLY_ALL`
cleanse read without drawing a crowd of allies, which is flagship-reserved language.

### Verification at approval

All nine surfaces were captured against the real running stack — local Postgres + Redis + the API +
Next.js on the real 41-card roster. Card 03 is a CHARACTER, so `hasBoardSlot` is true and the
CreatureSlot board slot is a real surface, unlike Cards 02/04.

Every v1 automatic-reject reason was re-measured on v2 rather than assumed, and all cleared: no
cathedral / spires / crowd / monumental architecture; no star / compass / heraldic boss; gold
coverage `0.01%` against a 3% limit; the barrier reads as a planted manufactured ward-screen with a
bolted spike, base plate and displaced rubble; the background collapses at 92 px; no baked lettering,
rune text, logo or UI.

At 92 px the card measures edge density `29.82` and grayscale spread `122` (p5 `109`) — mid-pack
across the shipped set, and closest of all thirteen to `acolyte-of-the-white-rune` (`27.85` / `129` /
`101`), the other PURIFICATION character. The high-key profile is the established PURIFICATION
treatment, not an outlier.

### Accepted caveats — non-blocking

The owner reviewed and explicitly accepted all three. None is to be reopened unless a new regression
appears on the production artwork path.

1. **A single pale classical column remains** in the background. The scene is not fully empty, but
   the column stays pale, soft and subordinate, collapses to a background band at thumbnail size,
   and does not recreate the rejected v1 cathedral / spires / crowd language.
2. **High-key value profile.** Card 03 is the palest card measured in the shipped set (`p5 = 109`),
   consistent with the already approved `acolyte-of-the-white-rune`.
3. **Minor 4:5 anchor-base crop.** The binding crop trims only the very bottom lip of the base
   plate; the planted spike and displaced rubble that carry the read remain visible.

## Production sync 12 → 13 — PREPARED, DELIBERATELY NOT RUNNABLE

Card 03's repository integration extends the controlled sync definition from 12 targets to 13 by
adding only `warden-of-the-barrier`, in repository code only. `SYNC-13-CARD-ART-PRODUCTION` is
**RESERVED, NOT AUTHORIZED, NOT CONSUMED**.

**The pin is intentionally not final.** `REQUIRED_SOURCE_COMMIT` and the workflow `SOURCE_COMMIT`
still point at the twelve-card commit `8d41b657`, whose `seed.ts` has no explicit artwork fields for
`warden-of-the-barrier`. The Card 03 integration commit does not exist until this PR merges, and
pinning an immutable source to an unmerged branch SHA would defeat the check.

The mismatch is deliberate and fails closed, verified by running it rather than assumed:

```
$ npx tsx scripts/sync-production-card-art.ts --check
Missing explicit production artwork fields in seed.ts for warden-of-the-barrier
exit: 1
```

It aborts inside `deriveDesiredValues` while reading `seed.ts` at the stale pin — before any database
connection is opened. The workflow's thirteen-file existence check fails the same way, since
`warden-of-the-barrier.webp` does not exist at that commit.

After the Card 03 integration PR merges, a separate task must repoint `REQUIRED_SOURCE_COMMIT` in
`apps/game-server/scripts/sync-production-card-art.ts` and both pins in
`.github/workflows/production-card-art-sync.yml` to the exact merge commit and revalidate. Only then
may the owner separately authorize the 13-card sync.

## Production sync 11 → 12 — COMPLETED

Card 02 is live in production. The controlled sync was extended 11 → 12 and executed successfully.

| Item                 | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| Workflow run         | **33320281456** (run 8), job `99280920592` — conclusion **success**  |
| Executed             | 2026-08-30, ~45 s                                                    |
| Immutable source pin | `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757` (PR #37 merge)            |
| Target slugs         | 12                                                                   |
| Confirmation used    | `SYNC-12-CARD-ART-PRODUCTION` — now **CONSUMED**                     |
| Rows changed         | **1** — `seal-of-the-curse` (`84dd1893-4cf1-45d4-8d36-bbff3abb5781`) |

The single changed row moved from an inline SVG placeholder with `rightsStatus: placeholder` to
`/art/cards/seal-of-the-curse.webp` with `rightsStatus: owned`. The other eleven targets reported
`needsChange=NO` in both the PRE-WRITE and POST-WRITE passes and were not modified.

Verified gates, read from the actual job logs:

- **PRE-WRITE** — `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, `ROWS_REQUIRING_MUTATION=1`,
  `SOURCE_OF_TRUTH_MATCH=11/12`, 64-char snapshot `9304451d…`
- **APPLY** — `TRANSACTION_STARTED=YES`, `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`,
  `TARGET_ROWS_FINAL=12`, `SOURCE_OF_TRUTH_MATCH=12/12`, **`NON_TARGET_FIELD_CHANGES=0`**
- **Independent POST-WRITE re-read** — `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`,
  `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=12/12`

Full evidence:
[`agent-reports/2026-08-30-art-pack-03-card-02-production-sync-executed.md`](agent-reports/2026-08-30-art-pack-03-card-02-production-sync-executed.md)

`SYNC-12-CARD-ART-PRODUCTION` authorized exactly that one run and is **consumed**. A thirteenth card
needs a fresh owner confirmation and a pin repointed at a new already-merged integration commit.

**Card 02 is complete end to end:** briefed → generated → byte-verified → surface-reviewed →
owner-approved → integrated → merged → synced to production.

## Superseded — sync preparation notes (pre-dispatch)

Card 02's repository integration extends the controlled sync from 11 targets to 12 by adding only
`seal-of-the-curse`. **No sync has been dispatched and no production database has been touched.**

| Item                    | Value                                             |
| ----------------------- | ------------------------------------------------- |
| Script target slugs     | 12 (unique)                                       |
| Workflow target slugs   | 12 (unique) — lists identical                     |
| Artwork files present   | 12/12                                             |
| Seed source entries     | 12/12 with `/art/cards/<slug>.webp` and `owned`   |
| New confirmation string | `SYNC-12-CARD-ART-PRODUCTION` (not yet usable)    |
| Immutable source pin    | **deliberately stale** at `92cc662f…` — see below |

**The pin is intentionally not final.** It still points at the eleven-card commit, whose `seed.ts`
has no production artwork fields for `seal-of-the-curse`. A twelve-card run therefore fails closed
inside `deriveDesiredValues` with
`Missing explicit production artwork fields in seed.ts for seal-of-the-curse`, before any database
connection is attempted. This was verified by running the script's non-mutating `--check` mode.

After the Card 02 integration PR merges, repoint `REQUIRED_SOURCE_COMMIT` in
`apps/game-server/scripts/sync-production-card-art.ts` and both pins in
`.github/workflows/production-card-art-sync.yml` to that merge commit. Only then can a sync run, and
only with a fresh owner confirmation of `SYNC-12-CARD-ART-PRODUCTION`.

## Card 01 production sync — COMPLETED

Card 01 is live in production. The controlled sync was extended 10 → 11 and executed successfully.

| Item                 | Value                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| Workflow run         | **33091769787** (run 7), job `98586183358` — conclusion **success**          |
| Executed             | 2026-08-27, ~41 s                                                            |
| Immutable source pin | `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`                                   |
| Target slugs         | 11                                                                           |
| Confirmation used    | `SYNC-11-CARD-ART-PRODUCTION` — now **CONSUMED**                             |
| Rows changed         | **1** — `acolyte-of-the-white-rune` (`08b4f9d4-7928-4d7c-9794-bc6b8cb46d65`) |

The single changed row moved from an inline SVG placeholder with `rightsStatus: placeholder` to
`/art/cards/acolyte-of-the-white-rune.webp` with `rightsStatus: owned`. The other ten targets
reported `needsChange=NO` throughout and were not modified.

Verified gates, read from the actual job logs:

- **PRE-WRITE** — `TARGET_ROWS=11`, `UNIQUE_SLUGS=11`, `ROWS_REQUIRING_MUTATION=1`,
  `SOURCE_OF_TRUTH_MATCH=10/11`
- **APPLY** — `TRANSACTION_STARTED=YES`, `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`,
  `TARGET_ROWS_FINAL=11`, `SOURCE_OF_TRUTH_MATCH=11/11`, **`NON_TARGET_FIELD_CHANGES=0`**
- **Independent POST-WRITE re-read** — `TARGET_ROWS=11`, `UNIQUE_SLUGS=11`,
  `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=11/11`

Full evidence:
[`agent-reports/2026-08-27-art-pack-03-card-01-production-sync-executed.md`](agent-reports/2026-08-27-art-pack-03-card-01-production-sync-executed.md)

`SYNC-11-CARD-ART-PRODUCTION` authorized exactly that one run and is **consumed**. It is not
standing authorization. Any future sync needs a fresh owner confirmation and a repointed
immutable-source pin — and, per the established pattern, the pin must reference an
already-merged integration commit.

**Card 01 is complete end to end:** briefed → generated → byte-verified → surface-reviewed →
owner-approved → integrated → merged → synced to production.
