# CURRENT TASK — Art Pack 03 Card 02: verify and visually review accepted candidate

## Goal

Verify the owner-accepted PURIFICATION Card 02 candidate byte-for-byte, then run real surface QA. Stop for owner approval. No promotion.

Card:

- `seal-of-the-curse` / «Печать Проклятия»
- PURIFICATION / EVENT / RARE / cost 2
- candidate branch: `assets/seal-of-the-curse-candidate`
- candidate commit: `6f0e00fca98b7452c4c1f987165cf3157753dccb`
- candidate path: `art-source/seal-of-the-curse.webp`
- provenance: `docs/art-sources/2026-08-27-purification-card-02-master-candidate.md`

## Integrity gate — MUST PASS BEFORE QA

Read the committed bytes from the exact candidate commit and independently verify:

- byte size: `326508`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- dimensions: `1024 × 1536`
- RIFF-declared total: `326508`
- FourCC: plain `VP8 `
- full image decode: PASS

Also run:

`git cat-file -s 6f0e00fca98b7452c4c1f987165cf3157753dccb:art-source/seal-of-the-curse.webp`

It must print exactly `326508`.

If any value differs: **STOP — REJECTED / BLOCKED**. Do not repair, re-encode, resize, regenerate, or substitute another file.

## Candidate staging

Stage the exact verified candidate locally at the existing gitignored review path:

`apps/web/public/art-review-candidates/seal-of-the-curse.webp`

Do not change the production artwork path or card data.

## `/admin/art-review`

If `seal-of-the-curse` is not registered as a review target, add only the smallest target registration required for this card. Candidate loading must remain local/gitignored and must not alter production `artworkUrl` or `rightsStatus`.

No other review target or UI redesign is allowed.

## Required visual QA

This is an EVENT. `CreatureSlot` is **not** a relevant surface and must not be invented as one.

Review the exact candidate on:

1. raw 2:3 master;
2. `CardView` 3:4;
3. `CardDetailDrawer` 4:5;
4. `HandCardPreview` 7:9;
5. `/admin/art-review` desktop;
6. `/admin/art-review` at 390px mobile;
7. 92px thumbnail;
8. 92px grayscale / value-only readability check.

Use the real app/components, not mock screenshots.

## Visual questions

Explicitly answer:

- Does the event instantly read as **an attack physically sealed**, not damage/corruption/spellcasting?
- Is the white/silver rune clamp clearly the primary focal point and the dark weapon hand secondary?
- Does the dark enemy arm read as dark material rather than SHADOW-like dramatic lighting?
- Is the enemy visually faction-neutral?
- Is the weapon still readable enough that the blocked attack is obvious?
- Are hand/finger/weapon/guard geometries anatomically and mechanically coherent?
- Does the clamp look solid and physically locked around hand + guard/hilt rather than floating magic?
- Are rune lines engraved/material-bound, cold pale blue-white, controlled, and not brighter than necessary?
- Any forbidden corruption language: crimson/red/violet/magenta/orange, rot, veins, tendrils, void haze, embers, ash?
- Any open-hand caster, beam, projectile, explosion, generic magical shield, or SHADOW/VEIL drift?
- Does the RARE read sit clearly above Common `acolyte-of-the-white-rune` but below Legendary `high-warden-of-the-white-rune`?
- Does the 92px grayscale test preserve strong tonal separation between seal and dark hand?
- Does every essential story element remain safe in 3:4, 7:9, and especially 4:5?
- Enforce the brief's stricter working safe zone: nothing essential above y≈260 or below y≈1280.

Walk every automatic reject condition and final acceptance item in `docs/art-review/seal-of-the-curse-master-art-brief.md`.

## Comparison

At 92px, compare side-by-side with:

- Common PURIFICATION: `acolyte-of-the-white-rune`
- Legendary PURIFICATION: `high-warden-of-the-white-rune`

The hierarchy must read: Common < Rare Event < Legendary without relying only on the UI rarity frame.

## Validation if review code changes

If `/admin/art-review` changes, run:

- `git diff --check`
- Prettier on changed files
- lint
- typecheck
- existing test baseline
- production build
- real visual QA

## Hard exclusions

Do NOT:

- change `apps/game-server/prisma/seed.ts`;
- change Prisma schema/migrations;
- change gameplay, balance, card text, effects, cost, rarity, faction, stats;
- write to `apps/web/public/art/cards/`;
- change production `artworkUrl` or `rightsStatus`;
- merge the candidate branch;
- promote the asset;
- touch Battlefield gameplay/layout;
- touch production sync scripts/workflows;
- access Railway/Vercel/production DB;
- dispatch any workflow;
- begin Card 03.

## Delivery

1. Create a durable report under `docs/agent-reports/` with exact integrity results and all visual QA findings.
2. If review code changed, use a narrow branch/PR containing only the required review-target support plus documentation/state changes.
3. Update `docs/AGENT_STATE.md` last and fetch it back from GitHub to verify.
4. Final status must be exactly one of:
   - **READY FOR OWNER VISUAL APPROVAL**
   - **REJECTED / BLOCKED**
5. Stop. No promotion or production work.