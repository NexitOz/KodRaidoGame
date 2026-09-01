# CURRENT TASK — Art Pack 03 Card 04: final repository integration PR

## Status

Card 04 `rune-of-curse-breaking` / «Руна Разрушения Проклятий» is **FINAL OWNER APPROVED AFTER EIGHT-SURFACE QA**.

Post-QA owner approval:

`docs/agent-reports/2026-09-01-art-pack-03-card-04-post-qa-owner-approval.md`

Candidate QA:

`docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md`

This task authorizes **repository integration PR preparation only**. It does not authorize production sync, production DB access or workflow dispatch.

## Exact approved source

Use only:

- candidate branch: `assets/rune-of-curse-breaking-candidate-v1`
- candidate HEAD: `185126c8b402dc4134245f984d9d0e7cddc6db8a`
- candidate asset: `art-source/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size / RIFF total: `438894`
- FourCC: plain `VP8 `
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS

The two QA caveats are explicitly accepted by the owner for these exact bytes: dark-rather-than-bright basin/water lip, and the soft upper-third architecture. Do not regenerate, alter or reopen those caveats unless the bytes/rendering change.

## Goal

Prepare a narrow, auditable PR that integrates the exact approved Card 04 artwork into repository production paths, but **does not perform production synchronization**.

## Required sequence

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, the post-QA owner approval and candidate QA report.
2. Sync fresh `main` and confirm the task source is current.
3. Fetch `assets/rune-of-curse-breaking-candidate-v1` and independently re-verify the exact candidate tuple above before copying anything.
4. Create a fresh integration branch from current `main`, preferably:
   `claude/integrate-rune-of-curse-breaking-art`
5. Do **not** merge/cherry-pick the candidate review branch wholesale. Bring only the approved binary and the deliberate integration changes listed below.
6. Copy the exact approved bytes to:
   `apps/web/public/art/cards/rune-of-curse-breaking.webp`
   Then prove the production-path file remains byte-identical to the candidate by size + SHA-256 + Git blob SHA + dimensions + full decode.
7. Update only the Card 04 seed artwork fields in `apps/game-server/prisma/seed.ts`:
   - `artworkUrl: '/art/cards/rune-of-curse-breaking.webp'`
   - `rightsStatus: 'owned'`
   Do not change gameplay, ability, cost, rarity, faction, tags or any other card field.
8. Add Card 04 to the canonical `/admin/art-review` approved targets, following Cards 01–03:
   - slug `rune-of-curse-breaking`
   - faction `PURIFICATION`
   - label `ART PACK 03 — APPROVED 04`
   - `reviewArtworkUrl: '/art/cards/rune-of-curse-breaking.webp'`
   Preserve the RUNE/no-`CreatureSlot` behavior.
9. Update `docs/art-pack-03.md` to record Card 04 as **FINAL OWNER APPROVED / REPOSITORY INTEGRATION** (not live in production yet). Keep production status truthful.
10. Update any minimal provenance/status documentation genuinely required to point at the immutable approved candidate and post-QA approval. Do not broaden scope.
11. Run scope diff checks, Prettier on changed text/code files, relevant lint/typecheck/tests, and production build if the normal art integration checklist requires it.
12. Verify exact changed-file list. Expected core scope is:
    - `apps/web/public/art/cards/rune-of-curse-breaking.webp`
    - `apps/game-server/prisma/seed.ts`
    - `apps/web/src/app/admin/art-review/page.tsx`
    - `docs/art-pack-03.md`
    - minimal integration handoff/provenance docs only
13. Create a PR to `main` with a clear Card 04 integration title/body.
14. Add the standard PR comment:
    `## AGENT HANDOFF — FINAL REPORT`
    including exact integrity tuple, changed files, validation results, and explicit statement that production sync was not run.
15. Update `docs/AGENT_STATE.md` last to point at the PR and status **READY FOR OWNER MERGE APPROVAL**, then fetch it back from GitHub and verify.
16. Stop. **Do not merge the PR.**

## Hard exclusions

Do NOT:

- regenerate/edit/re-encode/crop/resize the artwork;
- merge the candidate branch wholesale;
- change Card 04 gameplay or balance fields;
- change other cards' seed rows;
- extend or modify production sync logic 13 → 14 in this task;
- create or consume a production confirmation string;
- dispatch production workflows;
- access/mutate Railway, Vercel or production DB;
- reuse `SYNC-13-CARD-ART-PRODUCTION`;
- begin another card;
- merge the integration PR.

## Final status

End at exactly one of:

- **READY FOR OWNER MERGE APPROVAL**
- **REJECTED / BLOCKED**

No production action is authorized by this task.
