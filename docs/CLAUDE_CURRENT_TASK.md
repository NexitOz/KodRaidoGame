# CURRENT TASK — Art Pack 03 Card 02: WeTransfer → candidate-v2 → visual QA

## BLOCKED 2026-08-27 — WeTransfer denied; and no relay can ever work here

Step 1 could not run. Both `we.tl:443` and `wetransfer.com:443` were rejected at CONNECT by this
session's egress policy.

**Root cause, measured rather than guessed:** the policy is a GitHub-only allowlist. Denied —
`we.tl`, `wetransfer.com`, `firestorage.ai`, `dropbox.com`, `drive.google.com`, `transfer.sh`,
`file.io`, `0x0.st`, `gist.githubusercontent.com`. Reachable — `github.com`, `api.github.com`,
`raw.githubusercontent.com`, `objects.githubusercontent.com`, `codeload.github.com`,
`uploads.github.com`.

So the four relay attempts did not fail for four reasons; they failed for one. **A fifth relay will
fail too.** The file must arrive inside the GitHub repository.

### The fix — the route that already worked for Card 01

Card 01's master landed intact at commit `69e176e`, committer `GitHub <noreply@github.com>`, message
`Add files via upload` — the **GitHub web UI drag-and-drop**. Multipart binary, never base64-in-JSON,
so it sidesteps the mechanism that truncated earlier attempts. `git cat-file -s` on it returns
exactly `214378`.

Owner action, about thirty seconds:

1. Open `https://github.com/NexitOz/KodRaidoGame` signed in.
2. **Add file → Upload files**, choosing "Create a new branch for this commit" named
   `assets/seal-of-the-curse-candidate-v2`.
3. Drop in `seal-of-the-curse.webp` at path `art-source/seal-of-the-curse.webp`.
4. Commit, then tell Claude Code the branch is up.

Equally good: commit and push it with a git CLI from any machine holding the master, checking
`git cat-file -s HEAD:art-source/seal-of-the-curse.webp` == `326508` before pushing.

Nothing was downloaded, nothing was committed, and **no visual judgement of the artwork has been
made.** firestorage was not retried and the broken 27-byte candidate branch was not reused.

Full analysis:
`docs/agent-reports/2026-08-27-art-pack-03-card-02-wetransfer-transport-blocked.md`.

Everything below runs unchanged from the integrity gate once the branch exists.

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
