# CURRENT TASK — Art Pack 03 Card 02: WeTransfer → candidate-v2 → visual QA

## Goal

Recover the already owner-accepted `seal-of-the-curse` master through the new WeTransfer relay, prove byte integrity, create a clean candidate-v2 with normal git, run real surface QA, then stop for owner approval. No promotion.

## Source transport

Use this WeTransfer link only:

`https://we.tl/t-vzhG3rXsXM3TQ7Jr`

Transfer expires: `2026-08-30T20:38:27Z`.

The old firestorage route is blocked in Claude Code and must not be retried. The old branch `assets/seal-of-the-curse-candidate` @ `6f0e00f...` is broken evidence only and MUST NOT be reused.

## Canonical integrity gate

Expected exact master:

- file: `seal-of-the-curse.webp`
- byte size: `326508`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- dimensions: `1024 × 1536`
- RIFF-declared total: `326508`
- FourCC: plain `VP8 `
- full decode: PASS

ChatGPT independently re-verified these values on the local master after successful raw upload to Google Drive; Drive metadata also reported exactly `326508` bytes.

Download the WeTransfer file locally and independently verify all values. If ANY value differs: **STOP — REJECTED / BLOCKED**. Do not repair, re-encode, resize, regenerate, or substitute.

## Candidate-v2

Only after integrity PASS:

1. Fresh `main`.
2. Create `assets/seal-of-the-curse-candidate-v2`.
3. Add exact bytes as `art-source/seal-of-the-curse.webp`.
4. Commit with normal git CLI.
5. Before push verify:
   - `git cat-file -s HEAD:art-source/seal-of-the-curse.webp` == `326508`
   - committed SHA-256 == canonical SHA above.
6. Push, fetch remote branch back, repeat exact size + SHA verification from fetched bytes.
7. If remote differs, STOP.

## Real visual QA

Stage the exact verified candidate only at the gitignored review-candidate path and run the existing Card 02 review task on:

- raw 2:3 master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `/admin/art-review` desktop
- `/admin/art-review` 390px
- 92px thumbnail
- 92px grayscale/value-only

This is an EVENT. `CreatureSlot` is NOT a review surface.

Walk every reject/acceptance item in `docs/art-review/seal-of-the-curse-master-art-brief.md`, including strict working safe zone y≈260–1280 and the Common < Rare < Legendary 92px comparison.

If `/admin/art-review` needs target registration, make only the smallest review-only change. Run the usual diff/prettier/lint/typecheck/tests/build checks for any code change.

## Hard exclusions

Do NOT change seed/Prisma/gameplay/card data, production art paths, `artworkUrl`, `rightsStatus`, Battlefield, sync workflows/scripts, Railway/Vercel/production DB, dispatch workflows, merge/promote the candidate, or begin Card 03.

## Delivery

Create a durable report under `docs/agent-reports/` with transport source, exact integrity results, candidate-v2 branch/commit, remote re-verification, and all visual QA findings.

Update `docs/AGENT_STATE.md` last and fetch it back from GitHub to verify.

Final status must be exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**

Stop there. No promotion or production work.