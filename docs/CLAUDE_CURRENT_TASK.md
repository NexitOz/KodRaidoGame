# CURRENT TASK — Art Pack 03 Card 02: owner-approved integration → repository review gate

## Status entering this task

Card 02 `seal-of-the-curse` / «Печать Проклятия» has completed independent byte verification and full real-stack visual QA across all required surfaces.

The owner has now given **FINAL VISUAL APPROVAL FOR INTEGRATION**. Durable approval record:

`docs/agent-reports/2026-08-30-art-pack-03-card-02-owner-approval.md`

Both recorded QA caveats are explicitly accepted and are not blockers unless a new regression appears on the production artwork path:

1. the pale blurred background describes an interior arcade more than the brief's near-abstract target;
2. the enemy weapon pommel carries a dark unlit star / compass-rose relief.

## Approved source — exact bytes only

Use only:

- branch: `assets/seal-of-the-curse-candidate-v2`
- commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- path: `art-source/seal-of-the-curse.webp`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- size: `326508` bytes
- dimensions: `1024x1536`
- RIFF total: `326508`
- FourCC: plain `VP8 `

Do not use, repair, or reference the rejected 27-byte candidate branch `assets/seal-of-the-curse-candidate` for integration.

## Goal

Integrate the exact owner-approved Card 02 master into the repository, validate the production artwork path with the real application, extend the controlled production artwork synchronization from **11 to 12 targets**, open a narrow integration PR, and stop for repository review.

No production sync is authorized in this task.

## Step 1 — fresh branch and integrity recheck

1. Start from fresh current `main` and resolve its exact HEAD from GitHub.
2. Create a narrow integration branch for Card 02.
3. Fetch `assets/seal-of-the-curse-candidate-v2` and independently recheck:
   - candidate commit
   - Git blob SHA
   - byte size
   - SHA-256
   - RIFF total
   - FourCC
   - dimensions
   - full decode
4. If any value differs, STOP — BLOCKED. Do not re-encode, regenerate, resize, substitute, or repair.

The prior review-only branch `claude/card-02-review-support` @ `45bdb37` contains only the `/admin/art-review` registration. Reuse/cherry-pick/reapply it only if it applies cleanly to fresh `main`; do not drag unrelated history into the integration branch.

## Step 2 — promote exact bytes to production artwork path

Copy the approved WebP byte-for-byte to:

`apps/web/public/art/cards/seal-of-the-curse.webp`

Then prove the production-path file remains identical to the approved source:

- SHA-256 exact
- Git blob SHA exact if applicable before/after commit
- size `326508`
- RIFF total `326508`
- `1024x1536`
- `VP8 `
- full decode PASS
- byte comparison / `cmp` PASS against the fetched approved candidate

Do not alter the artwork bytes.

## Step 3 — canonical Card 02 data only

Update only the canonical `seal-of-the-curse` entry in `apps/game-server/prisma/seed.ts`:

- `artworkUrl: '/art/cards/seal-of-the-curse.webp'`
- `rightsStatus: 'owned'`

Do not change:

- type / rarity / cost / faction
- card name or text
- Curse mechanics or effect data
- any other card
- Prisma schema or migrations

## Step 4 — `/admin/art-review` production-path behavior

Preserve the correct non-CHARACTER EVENT review path:

- EVENT must not render `CreatureSlot`
- Card 02 must be marked as approved/final rather than candidate
- review must resolve through `/art/cards/seal-of-the-curse.webp`, not the gitignored candidate slot
- CHARACTER behavior must remain unchanged

Delete/remove the staged gitignored review candidate before final production-path QA so a network trace can prove the candidate slot is not being used.

## Step 5 — production-path real visual QA

Run the actual local stack and repeat the relevant surfaces against the production path:

1. raw 2:3 / approved production asset
2. `CardView` 3:4
3. `CardDetailDrawer` 4:5
4. `HandCardPreview` 7:9
5. `/admin/art-review` desktop
6. `/admin/art-review` 390 px
7. 92 px thumbnail
8. 92 px grayscale/value-only
9. real Collection surface if available in the existing QA flow

Prove candidate isolation is gone and the only resolved Card 02 artwork request is the production path.

The two owner-accepted caveats may remain. Any **new** crop, readability, layout, overflow, colour-language, rarity-hierarchy, anatomy, or component regression is a blocker and must be reported.

## Step 6 — Art Pack 03 documentation

Update the canonical Art Pack 03 documentation for Card 02 to **FINAL APPROVED**, including:

- production artwork path
- final verified integrity values
- owner approval record
- two accepted caveats as non-blocking notes

Inspect the repository and use its existing Art Pack 03 documentation convention rather than inventing a parallel file structure.

## Step 7 — controlled production sync 11 → 12

Extend the existing controlled production card-art synchronization from **11 targets to 12** by adding only `seal-of-the-curse`, following the existing immutable-source / invariant pattern.

Requirements:

- script target list = 12 unique slugs
- workflow target list = 12 unique slugs
- lists identical
- artwork files present = 12/12
- seed source entries = 12/12 with `/art/cards/<slug>.webp` and `owned`
- PRE-WRITE / APPLY / POST-WRITE assertions updated from 11 to 12 where appropriate
- new exact confirmation string must be `SYNC-12-CARD-ART-PRODUCTION`

**Important immutable-source rule:** before merge, the correct 12-card immutable source commit does not yet exist. Keep the current source pin intentionally stale/safe or otherwise preserve the existing fail-closed pattern used for the previous card. Record clearly that after the integration PR merges, the workflow/script source pin must be repointed to that merge commit before any dispatch.

Do not dispatch any workflow in this task.

## Step 8 — validation

Run all relevant repository gates for the integration branch:

- `git diff --check`
- Prettier on changed text/code files
- lint
- typecheck
- tests
- production build
- non-mutating 12-card sync invariant/preflight checks
- production-path real visual QA after all integration changes

Do not access or mutate Railway/Vercel/production DB.

## Step 9 — PR and handoff

Open one narrow integration PR from the Card 02 integration branch into `main`.

PR/handoff must include:

- base SHA and head SHA
- exact changed files
- proof production artwork is byte-identical to the approved candidate
- exact seed diff for Card 02 only
- production-path visual QA results
- accepted caveats and confirmation that no new regression appeared
- validation results
- sync 11 → 12 invariant/preflight results
- explicit statement that immutable source pin is intentionally not final until merge
- explicit `Merged: NO`
- explicit `Production sync dispatched: NO`
- explicit `Production DB mutated: NO`

Use `## AGENT HANDOFF — FINAL REPORT` in the PR comment per `CLAUDE.md`.

Finally update `docs/AGENT_STATE.md` **last**, fetch it back from GitHub, and verify it before declaring completion.

## Hard stop

After the PR is ready and all gates are green, STOP for repository review.

Do not:

- merge the integration PR
- dispatch `SYNC-12-CARD-ART-PRODUCTION`
- mutate production DB
- repoint the final immutable source SHA before the integration merge commit exists
- begin Card 03
- alter any unrelated gameplay, card, Battlefield, Railway, Vercel, schema, or migration state
