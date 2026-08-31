# CURRENT TASK — Art Pack 03 Card 04: approved master candidate intake + eight-surface QA

## Status

Card 04 `rune-of-curse-breaking` / «Руна Разрушения Проклятий» has an **OWNER-APPROVED master art**.

Owner approval record:

`docs/agent-reports/2026-08-31-art-pack-03-card-04-owner-approval.md`

This task authorizes **candidate intake and review only**. It does not authorize production integration or production access.

## Canonical card facts

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

Gameplay facts are locked and out of scope.

## Approved visual source

Generation id:

`f2e3d336-6db5-4d45-9d64-6bfebd8e9196`

Approved concept: **The cleansing font**, with the owner-approved geometry refinement:

- low, wide, faceted purification basin / reservoir;
- integrated into a short stepped stone base;
- elongated / faceted / octagonal rather than circular;
- not a church font, decorative park fountain, tall pedestal basin, central-column fountain, upward jet, or circular symmetrical fountain;
- water is cold, clear and almost colourless; it is a physical `CLEANSE` carrier, not blue elemental magic;
- off-frame floor channels are the `FRIENDLY_ALL` reach device;
- no people or figures.

The master shown to and approved by the owner is the only approved visual source. Do not regenerate, redesign, crop, extend, recompose, repaint, sharpen or creatively alter it.

## Approved transport WebP integrity contract

A transport WebP was made from the approved 1024 × 1536 RGB PNG without crop, resize or recomposition.

Expected exact values:

- filename: `rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- actual byte size: `438894`
- RIFF declared total: `438894`
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS

Temporary byte-preserving source, valid until 2026-09-14:

`https://firestorage.ai/ja/f/8hmlyOzbah75`

Candidate branch already exists:

`assets/rune-of-curse-breaking-candidate-v1`

## Retrieval rule

Do not use an unrelated local image, placeholder, browser screenshot or reconstructed image.

Retrieve the exact approved WebP by an available byte-preserving route. If the Firestorage share cannot be fetched in this environment, do not fabricate or substitute anything. Stop at **BLOCKED — APPROVED BINARY TRANSPORT REQUIRED** and report the precise transport blocker.

A successful retrieval is valid only if all expected integrity values above match exactly.

## Required work

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, the approved brief, generation package and owner approval report before touching the candidate.
2. Work only on `assets/rune-of-curse-breaking-candidate-v1` for candidate intake. Refresh it from the intended base only if doing so does not discard the owner's reserved branch or approved object.
3. Land the exact approved file at:
   `art-source/rune-of-curse-breaking.webp`
4. Hard-verify and record:
   - dimensions;
   - actual byte size;
   - RIFF declared total = actual byte size;
   - plain `VP8 ` FourCC;
   - full decode PASS;
   - SHA-256;
   - Git blob SHA;
   - `git cat-file -s` matches actual size;
   - fetched remote branch re-verification matches the same values.
5. Stage only for review at the gitignored candidate path:
   `apps/web/public/art-review-candidates/rune-of-curse-breaking.webp`
6. Run the **eight** Card 04 RUNE review surfaces established by the brief:
   - raw 2:3;
   - CardView 3:4;
   - CardDetailDrawer 4:5;
   - HandCardPreview 7:9;
   - `/admin/art-review` desktop;
   - `/admin/art-review` 390 px;
   - 92 px thumbnail;
   - 92 px grayscale.
   `CreatureSlot` is N/A for RUNE and must not be invented as a ninth surface.
7. Compare the real candidate against every automatic reject and acceptance item in:
   `docs/art-review/rune-of-curse-breaking-master-art-brief.md`
8. Specifically measure/check the generated reality rather than assuming prompt compliance:
   - no figure;
   - continuous visible overflow;
   - straight/off-frame channels and no closed floor rune-circle;
   - ornamental rim marks do not read as text/script;
   - no watermark/UI/card frame;
   - gold ≤ 4%;
   - 92 px grayscale spread versus the brief target;
   - water lip / subject hierarchy;
   - uniqueness versus Cards 01–03, faction flagship and `rune-of-the-echoing-dusk`;
   - crop safety on the real 3:4, 7:9 and binding 4:5 surfaces;
   - no horizontal overflow at 390 px.
9. Do not silently alter the artwork to fix a QA issue. Report deviations as they exist.
10. Preserve complete production isolation.

## Hard exclusions

Do NOT:

- generate or edit Card 04 imagery;
- substitute another image if retrieval fails;
- integrate into `apps/web/public/art/cards/`;
- change `seed.ts`, `artworkUrl`, `rightsStatus`, gameplay, schema or migrations;
- extend production artwork sync 13 → 14;
- create or consume a production confirmation string;
- dispatch production workflows;
- access or mutate Railway, Vercel or production DB;
- begin another card;
- reuse `SYNC-13-CARD-ART-PRODUCTION`.

## Durable handoff

Leave the standard durable candidate QA report. Update `docs/AGENT_STATE.md` **LAST**, fetch it back from GitHub and verify it.

## Final status

End at exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**
- **BLOCKED — APPROVED BINARY TRANSPORT REQUIRED**

If READY, return branch, exact HEAD SHA, asset path, dimensions, byte size, SHA-256, Git blob SHA, QA report path and final status.
