# CURRENT TASK — Art Pack 03 Card 03: approved master v2 candidate intake + full visual QA

## Status

Card 02 `seal-of-the-curse` is COMPLETE END TO END and live in production.

Card 03 `warden-of-the-barrier` / «Хранительница Барьера» has a **NEW OWNER-APPROVED MASTER v2**, approved 2026-08-31. It supersedes every previous Card 03 candidate and every previous Card 03 integrity tuple.

The prior 284002-byte candidate / SHA-256 `1a175635...` is **REJECTED HISTORICAL INPUT** and must never be reused for v2.

No production operation is authorized.

## Canonical card facts

- slug: `warden-of-the-barrier`
- name: «Хранительница Барьера»
- faction: PURIFICATION
- type: CHARACTER
- rarity: RARE
- cost: 3
- attack / health: 2 / 5
- ability: `При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.`

## Owner-approved master v2 — exact intake contract

The approved source is the newest vertical master generated in ChatGPT and explicitly approved by the owner on 2026-08-31.

Transport WebP prepared from that exact approved visual source:

- expected repository filename: `warden-of-the-barrier.webp`
- dimensions: `1024 × 1536`
- format: WebP
- FourCC: plain `VP8 `
- actual byte size: `193038`
- RIFF declared total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- full decode: PASS

These are hard verification gates. Do not substitute, re-encode, crop, regenerate, resize, optimise, recompress or otherwise change the artwork.

A temporary owner transport copy exists at firestorage for manual transport only:

`https://firestorage.ai/ja/f/0Dy-NYu7pX8_`

Do **not** treat successful access to the HTML share page as proof of the file. Do not accept HTML, a screenshot, a thumbnail, a redirect page or any byte stream whose integrity does not match every gate above.

## Goal

Land the exact owner-approved v2 bytes on a fresh candidate branch, run the complete nine-surface QA against the approved Card 03 brief, and stop for owner visual approval.

Candidate branch:

`assets/warden-of-the-barrier-candidate-v2`

Candidate path:

`art-source/warden-of-the-barrier.webp`

Review staging path (gitignored):

`apps/web/public/art-review-candidates/warden-of-the-barrier.webp`

## Start condition

Before doing QA, inspect the candidate branch tree.

If `art-source/warden-of-the-barrier.webp` is not present, or if it fails even one exact integrity gate, STOP as `REJECTED / BLOCKED` and report only the missing/failed gate. Do not create a substitute image and do not fall back to the old rejected candidate.

If the exact file is already present, proceed without external download attempts.

If transport is needed and the current Claude Code environment can reach the supplied source, retrieve the actual file only. If the source responds with 403 or HTML, do not keep retrying variants and do not mutate repository state. The owner can upload the exact v2 WebP through the GitHub web UI.

## Required work after exact intake passes

1. Read `docs/AGENT_STATE.md`, this task, `docs/art-review/warden-of-the-barrier-master-art-brief.md`, and the Card 03 generation package.
2. Verify BEFORE git / QA:
   - `1024 × 1536`
   - size exactly `193038`
   - RIFF total exactly `193038`
   - plain `VP8 ` FourCC
   - SHA-256 exactly `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
   - full decode PASS
3. Ensure the real candidate branch is `assets/warden-of-the-barrier-candidate-v2`.
4. Commit only the exact approved binary plus candidate-specific review metadata/code strictly required by existing convention.
5. Re-verify the committed Git object and fetched remote branch:
   - `git cat-file -s`
   - Git blob SHA
   - SHA-256 from committed blob
   - exact byte size
6. Stage a byte-identical copy only at the gitignored review path.
7. Run all nine required review surfaces:
   - raw 2:3
   - CardView 3:4
   - CreatureSlot 3:4
   - CardDetailDrawer 4:5
   - HandCardPreview 7:9
   - `/admin/art-review` desktop
   - `/admin/art-review` at 390 px
   - 92 px thumbnail
   - 92 px grayscale
8. Walk every automatic reject and positive acceptance item in the approved brief against **v2**. Do not silently fix visual deviations.
9. Pay special attention to the reasons the old candidate was rejected. v2 is expected to remove them, but verify rather than assume:
   - no cathedral / spires / crowd / monumental background
   - no star / compass / heraldic boss
   - no broad gold ornamentation
   - barrier clearly reads as a planted manufactured ward-screen with ground anchor
   - background collapses at 92 px
   - no baked lettering / rune text / logo / UI
10. Confirm candidate isolation from production.
11. Run the normal repository validation relevant to changed files: diff check, targeted Prettier, lint, typecheck, tests, build. Run real-stack Playwright surfaces if the environment has the required browser/database; otherwise report those specific surfaces as not captured, without inventing a PASS.
12. Leave a durable report under `docs/agent-reports/`.
13. Update `docs/AGENT_STATE.md` LAST and fetch it back from GitHub to verify.

## Hard exclusions

Do NOT:

- regenerate, redraw, redesign, crop, extend, recompose, resize or recompress the approved v2 art
- reuse the old rejected `284002`-byte Card 03 candidate
- integrate/promote to `apps/web/public/art/cards/`
- change `seed.ts`, gameplay, balance, schema or migrations
- change production `artworkUrl` or `rightsStatus`
- extend production sync 12 → 13
- dispatch any production workflow
- access or mutate Railway/Vercel/production DB
- begin Card 04

## Final status

Exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**

If READY, return:

- candidate branch
- exact HEAD SHA
- asset path
- SHA-256
- Git blob SHA
- byte size
- QA report path
- notable QA caveats, if any
- final status
