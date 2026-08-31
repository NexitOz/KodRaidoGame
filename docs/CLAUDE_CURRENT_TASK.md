# CURRENT TASK — Art Pack 03 Card 03: final repository integration

## Status

Card 02 `seal-of-the-curse` is **COMPLETE END TO END — LIVE IN PRODUCTION**.

Card 03 `warden-of-the-barrier` / «Хранительница Барьера» has completed exact binary intake and full nine-surface QA. The owner gave **FINAL VISUAL APPROVAL FOR INTEGRATION on 2026-08-31** and explicitly accepted all documented QA judgement items.

Owner approval record:

`docs/agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md`

QA report:

`docs/agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`

This task authorizes **repository integration only**. It does not authorize production workflow dispatch or production DB mutation.

## Canonical card facts

- slug: `warden-of-the-barrier`
- name: «Хранительница Барьера»
- faction: PURIFICATION
- type: CHARACTER
- rarity: RARE
- cost: 3
- attack / health: 2 / 5
- ability: `При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.`
- mechanics:
  - `ON_PLAY` → `SHIELD` / `SELF`
  - `ON_PLAY` + `RESONANCE_TIER_AT_LEAST 5` → `CLEANSE` / `FRIENDLY_ALL`

Do not change gameplay, cost, stats, ability text, mechanics, schema or migrations.

## Exact approved artwork source

Only the following Card 03 v2 binary is approved:

- candidate branch: `assets/warden-of-the-barrier-candidate-v2`
- candidate QA head: `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- exact binary source commit: `3dda92ef0d427b943c71212b8e24c95f659dbce5`
- source path: `art-source/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- byte size: `193038`
- RIFF total: `193038`
- FourCC: plain `VP8 `
- dimensions: `1024 × 1536`
- full decode: PASS

The rejected v1 tuple remains forbidden:

- `284002` bytes
- SHA-256 `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

Never regenerate, re-encode, crop, resize, optimise or otherwise alter the approved v2 bytes.

## Owner-accepted QA judgement items

These are **accepted and closed**, not blockers during integration unless the canonical production path introduces a new regression:

1. one pale classical column remains in the background;
2. the card has a high-key PURIFICATION value profile (`p5 = 109`);
3. the 4:5 crop cuts only the very bottom lip of the anchor base plate while preserving the planted spike and displaced rubble.

## Goal

Create a narrow Card 03 integration PR from fresh `main` that promotes the exact approved v2 artwork into the repository source of truth, updates only the required art metadata/review/docs/sync-definition surfaces, proves the canonical production artwork path on all relevant UI surfaces, and stops for independent repository review.

Suggested integration branch:

`claude/card-03-final-integration`

Do not work directly on `main` except for the permanent handoff/state documents required by protocol after the task is complete.

## Required work

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, the owner approval report, the candidate QA report, the master-art brief, and the existing Card 01/Card 02 integration pattern before editing.
2. Start from fresh current `main`. Record the base SHA in the handoff.
3. Fetch `assets/warden-of-the-barrier-candidate-v2` and verify the exact approved binary again from the committed Git object before promotion:
   - blob `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
   - size `193038`
   - SHA-256 `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
   - RIFF total `193038`
   - plain `VP8 `
   - `1024 × 1536`
   - full decode PASS
4. Promote those exact bytes, byte-for-byte, to:

   `apps/web/public/art/cards/warden-of-the-barrier.webp`

   Do not merge the candidate branch wholesale. Do not merge the temporary transport branch. Bring only the required reviewed code/art changes into the integration branch.
5. Re-verify the production-path file after the copy. Its SHA-256 and byte size must remain exact. Verify the committed Git object after commit as well.
6. Update only Card 03 art fields in `apps/game-server/prisma/seed.ts`:

   - `artworkUrl: '/art/cards/warden-of-the-barrier.webp'`
   - `rightsStatus: 'owned'`

   Preserve every non-art Card 03 field byte-for-byte where practical and report the exact seed diff.
7. Update `/admin/art-review` using the established pattern so Card 03 is labelled FINAL/APPROVED and reads the canonical production path through:

   `reviewArtworkUrl: '/art/cards/warden-of-the-barrier.webp'`

   Card 03 is a CHARACTER, so preserve the real `CreatureSlot` review surface. Do not leave it wired to `art-review-candidates`.
8. Update `docs/art-pack-03.md` and only other directly relevant Card 03 documentation required by the established project convention so Card 03 is recorded as **FINAL OWNER APPROVED / repository integration in review**. Do not mark it live in production yet.
9. Extend the controlled production card-art synchronization definition from 12 to 13 targets **in repository code only**:
   - add `warden-of-the-barrier` to the target list in `apps/game-server/scripts/sync-production-card-art.ts`;
   - update `.github/workflows/production-card-art-sync.yml` from twelve/12 to thirteen/13 everywhere that represents target count, file presence, labels or assertions;
   - change the future workflow confirmation text/check to the new reserved string `SYNC-13-CARD-ART-PRODUCTION`;
   - add `warden-of-the-barrier` to the committed-art existence check.
10. **Fail-closed immutable-source rule:** the exact merged integration commit does not exist until this PR is merged. Therefore do **not** repoint `REQUIRED_SOURCE_COMMIT` / `SOURCE_COMMIT` to an integration-branch commit and do not weaken/remove the immutable-source checks. Leave the existing 12-card source pin in place with an explicit comment that a post-merge repin is required. The resulting pre-merge workflow must remain non-dispatchable for Card 03 because the stale immutable pin cannot validate the new seed/art source. A separate post-merge task will repoint every source pin to the exact merge commit before any production authorization can be considered.
11. Run canonical production-path visual QA using `/art/cards/warden-of-the-barrier.webp`, not the candidate staging path. For Card 03 verify all nine surfaces again:
   - raw 2:3
   - CardView 3:4
   - CreatureSlot 3:4
   - CardDetailDrawer 4:5
   - HandCardPreview 7:9
   - `/admin/art-review` desktop
   - `/admin/art-review` 390 px
   - 92 px thumbnail
   - 92 px grayscale
12. Explicitly verify candidate isolation is gone from the integrated review path:
   - no request for `/art-review-candidates/warden-of-the-barrier.webp`
   - review row requests `/art/cards/warden-of-the-barrier.webp`
   - Card 03 displays `rightsStatus: owned` from the repository seed/source-of-truth setup used by the local stack
13. Run normal validation for every affected workspace/file:
   - `git diff --check`
   - targeted Prettier without reformatting unrelated pre-existing drift
   - lint
   - typecheck
   - relevant tests
   - production build
   - any sync-script tests/static checks that exist
14. Audit scope before committing and before PR creation. No unrelated files.
15. Open a narrow PR to `main`. Do **not** merge it.
16. Leave the permanent PR handoff comment headed exactly:

   `## AGENT HANDOFF — FINAL REPORT`

   The handoff must include: base SHA, branch/head SHA, PR number, exact changed files, asset SHA/blob/size, seed diff, all nine production-path QA results, validation results, sync 13-target preparation status, confirmation that immutable source pin is intentionally still the old 12-card pin pending merge, and all untouched production areas.
17. Update `docs/AGENT_STATE.md` **LAST** after the PR/handoff exists, then fetch it back from GitHub and verify it.

## Hard exclusions

Do NOT:

- alter the approved Card 03 pixels or bytes
- reuse the rejected v1 candidate
- merge `assets/warden-of-the-barrier-candidate-v2` wholesale
- merge `transport/card03-v2-github-actions`
- merge the integration PR
- repoint immutable source pins to a branch/head SHA
- dispatch `.github/workflows/production-card-art-sync.yml`
- use `SYNC-13-CARD-ART-PRODUCTION` as authorization; the string is reserved but **NOT owner-authorized yet**
- mutate production DB
- access/mutate Railway or Vercel production
- change any non-art gameplay/balance/schema/migration field
- begin Card 04

## Final status

End at exactly one of:

- **READY FOR INDEPENDENT PR REVIEW**
- **BLOCKED / REJECTED**

If READY, stop with the PR open and unmerged. Production synchronization remains unauthorized until after independent PR review, merge, exact post-merge immutable-source repinning, validation of the merged source, and a fresh explicit owner confirmation for `SYNC-13-CARD-ART-PRODUCTION`.
