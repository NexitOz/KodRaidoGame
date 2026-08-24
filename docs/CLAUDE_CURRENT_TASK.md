# CURRENT TASK — SHADOW Card 04 approved integration

## Goal

Integrate the owner-approved Card 04 master for **Рунный Страж Эха** — `rune-of-the-echoing-dusk`, `RUNE`, `EPIC`, cost `3`, ally death -> summon `shadow-echo-token` 1/1.

The artwork has already passed owner visual approval and independent integrity / surface QA. This task is mechanical repository integration and final validation.

## Approved source

Use **only** the verified replacement candidate:

- branch: `assets/rune-of-the-echoing-dusk-candidate-v2`
- candidate HEAD: `941fe2381a97e72406f6ba4809c455088c231cf0`
- master: `art-source/rune-of-the-echoing-dusk.webp`
- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`
- size: `351690` bytes
- dimensions: `1024x1536`
- WebP container: `RIFF` / `WEBP` / `VP8 `

Do **not** use the superseded branch `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2`; it is known-invalid non-image data.

Owner approval is recorded on PR #34 in comment `5401140209`. The two known caveats are accepted and are not blockers.

## Integration branch / PR

Continue from the existing review-support PR:

- PR #34
- branch: `claude/card-04-rune-review-support`
- current reviewed head before integration: `b4ecdc259febb747fe7f17a8fdd932a070d94a61`

Do not open a duplicate PR unless there is a concrete repository reason that makes continuing PR #34 unsafe.

## Required work

1. Copy the verified v2 master byte-for-byte to:
   `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
   Then independently verify the production-path file still matches the approved SHA-256, size, RIFF total and dimensions.

2. Update only the canonical `rune-of-the-echoing-dusk` entry in `apps/game-server/prisma/seed.ts`:
   - set its `artworkUrl` to `/art/cards/rune-of-the-echoing-dusk.webp`
   - set `rightsStatus` to `owned`
   Do not change gameplay, cost, rarity, type, faction, text or effect data.

3. Keep the non-CHARACTER `/admin/art-review` support already delivered in PR #34. Preserve CHARACTER behavior unchanged.

4. Reseed the local/dev database as required and re-capture / re-check the four live RUNE surfaces against the **production artwork path**, not the gitignored candidate slot:
   - Collection / hand `CardView` 3:4
   - `CardDetailDrawer` 4:5
   - `HandCardPreview` 7:9
   - `CardView size="xs"` / 92 px
   Confirm the same two accepted caveats only; flag any new regression.

5. Update `docs/art-pack-02.md` so Card 04 is recorded as **FINAL APPROVED**, with the final production artwork path and the verified integrity values.

6. Extend the controlled production card-art synchronization from **9 -> 10** targets for this card, following the existing immutable/invariant pattern in the repository. Update only the required sync script/workflow/test expectations. Do **not** dispatch or mutate production yet.

7. Run the full relevant validation gates: lint, typecheck, tests, build, `git diff --check`, and any production-sync dry/preflight validation that does not mutate production.

## Scope / stop point

- Do not dispatch the production card-art sync.
- Do not mutate the production database.
- Do not merge PR #34.
- Do not touch unrelated cards, gameplay, balance, Battlefield layout, Railway or Vercel configuration.

After the integration diff, production-path visual QA and all gates are green, STOP and report the PR for final repository review before merge / production synchronization.

## Delivery

Use the permanent handoff protocol in `CLAUDE.md`.

Update PR #34 with a new `## AGENT HANDOFF — FINAL REPORT` that supersedes prior reports and includes:

- exact changed files
- base/head SHAs
- proof the production-path master is byte-identical to the approved v2 candidate
- seed change for this card only
- production-path visual QA results
- lint/typecheck/tests/build results
- sync 9 -> 10 invariant/preflight results
- CI/workflow IDs if any
- confirmed untouched areas
- explicit `Merged: NO`
- explicit `Production sync dispatched: NO`

Finally update `docs/AGENT_STATE.md`, fetch it back from GitHub and verify it before declaring completion.