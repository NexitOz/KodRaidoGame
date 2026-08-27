# Art Pack 03 — PURIFICATION (Стражи Белой Руны)

Production artwork for the PURIFICATION faction's non-flagship cards. The faction's LEGENDARY
flagship, `high-warden-of-the-white-rune`, was approved earlier as part of Art Pack 01 and is not
part of this pack — see [`art-bible-01.md`](art-bible-01.md).

**Pack status:** IN PROGRESS — Card 01 of 4 complete and live in production.

| #   | Slug                        | Type / Rarity / Cost   | Status                 |
| --- | --------------------------- | ---------------------- | ---------------------- |
| 01  | `acolyte-of-the-white-rune` | CHARACTER / COMMON / 1 | **LIVE IN PRODUCTION** |
| 02  | `seal-of-the-curse`         | EVENT / RARE / 2       | not started            |
| 03  | `warden-of-the-barrier`     | CHARACTER / RARE / 3   | not started            |
| 04  | `rune-of-curse-breaking`    | RUNE / EPIC / 3        | not started            |

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

## Production sync — COMPLETED

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
