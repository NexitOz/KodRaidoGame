# CURRENT TASK — Art Pack 03 Card 02: firestorage re-transport → candidate-v2 → visual QA

## Goal

Recover the owner-accepted `seal-of-the-curse` master from the new machine-to-machine transport, prove byte integrity, create a clean candidate-v2 with normal git, then run the existing real surface QA. Stop for owner approval. No promotion.

Card:

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- PURIFICATION / EVENT / RARE / cost 2

## Source transport — use this, not the broken candidate branch

firestorage share:

`https://firestorage.ai/ja/f/UbtC6RJp2_Ok`

Uploaded object metadata already reported by firestorage:

- file: `seal-of-the-curse.webp`
- size: `326508` bytes
- mime: `image/webp`
- retention: through 2026-09-10

Canonical expected integrity:

- byte size: `326508`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- dimensions: `1024 × 1536`
- RIFF-declared total: `326508`
- FourCC: plain `VP8 `
- full image decode: PASS

The old branch `assets/seal-of-the-curse-candidate` @ `6f0e00f...` is broken evidence only and MUST NOT be reused.

## Step 1 — download and integrity gate

Download the exact WebP from the firestorage share to local disk.

Independently verify all canonical values above with local tools (`wc -c`, `sha256sum`, RIFF/FourCC inspection, dimensions, full decode).

If ANY value differs: **STOP — REJECTED / BLOCKED**. Do not repair, re-encode, resize, regenerate, or substitute.

## Step 2 — create clean candidate-v2 with normal git

From fresh `main`, create:

`assets/seal-of-the-curse-candidate-v2`

Add only:

`art-source/seal-of-the-curse.webp`

plus the existing provenance note if it must be amended only to record the successful firestorage transport. Do not alter the accepted artwork bytes.

Commit with normal git CLI from local disk. BEFORE PUSHING verify:

- `git cat-file -s HEAD:art-source/seal-of-the-curse.webp` == `326508`
- SHA-256 of the committed blob materialized from HEAD == canonical SHA above

Push the branch, fetch it back from GitHub, and independently repeat size + SHA verification from the fetched branch. If remote differs: STOP.

## Step 3 — local review staging only

Stage the exact verified candidate at the existing gitignored review path:

`apps/web/public/art-review-candidates/seal-of-the-curse.webp`

Do not change production artwork path or card data.

If `seal-of-the-curse` is not already registered in `/admin/art-review`, add only the smallest review-target registration required. Candidate loading must remain local/gitignored and must not alter production `artworkUrl` or `rightsStatus`.

## Step 4 — required real visual QA

This is an EVENT. `CreatureSlot` is NOT a review surface.

Review the exact candidate on:

1. raw 2:3 master;
2. `CardView` 3:4;
3. `CardDetailDrawer` 4:5;
4. `HandCardPreview` 7:9;
5. `/admin/art-review` desktop;
6. `/admin/art-review` at 390px;
7. 92px thumbnail;
8. 92px grayscale/value-only.

Use the real app/components, not mock screenshots.

Explicitly verify every reject/acceptance item in:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Key visual gates:

- reads instantly as an attack physically sealed, not damage/corruption/spellcasting;
- white/silver rune clamp is primary focal point; dark weapon hand secondary;
- enemy arm is dark by material, not SHADOW-style lighting;
- enemy remains faction-neutral;
- weapon/hand/guard geometry is coherent;
- clamp reads solid and physically locked around hand + guard/hilt, not floating magic;
- no crimson/red/violet/magenta/orange, rot, veins, tendrils, void haze, embers, ash;
- no caster, beam, projectile, explosion, generic shield, SHADOW/VEIL drift;
- essential story survives 3:4, 7:9 and especially 4:5;
- nothing essential above y≈260 or below y≈1280;
- 92px grayscale preserves strong tonal separation.

At 92px compare side-by-side:

- Common `acolyte-of-the-white-rune`
- Rare Event `seal-of-the-curse`
- Legendary `high-warden-of-the-white-rune`

Hierarchy must read Common < Rare < Legendary without relying only on frame rarity.

## Validation if review code changes

Run:

- `git diff --check`
- Prettier on changed files
- lint
- typecheck
- existing tests
- production build
- real visual QA

## Hard exclusions

Do NOT:

- change `apps/game-server/prisma/seed.ts`;
- change Prisma schema/migrations;
- change gameplay/balance/card data;
- write to `apps/web/public/art/cards/`;
- change production `artworkUrl` or `rightsStatus`;
- merge/promote the candidate;
- touch Battlefield gameplay/layout;
- touch production sync workflows/scripts;
- access Railway/Vercel/production DB;
- dispatch workflows;
- begin Card 03.

## Delivery

1. Create a durable report under `docs/agent-reports/` containing transport source, exact integrity results, candidate-v2 branch/commit, remote re-verification, and all visual QA findings.
2. If review code changed, use a narrow branch/PR containing only review-target support + docs/state.
3. Update `docs/AGENT_STATE.md` last and fetch it back from GitHub to verify.
4. Final status must be exactly one of:
   - **READY FOR OWNER VISUAL APPROVAL**
   - **REJECTED / BLOCKED**
5. Stop. No promotion or production work.