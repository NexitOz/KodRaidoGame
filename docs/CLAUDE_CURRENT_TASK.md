# CURRENT TASK — Keeper production art sync 8 → 9

## Goal

Extend the existing controlled production card-art sync from 8 to 9 cards by adding `keeper-of-smoldering-embers`.

This task prepares code/workflow only. **Do not run production APPLY. Do not mutate production DB. Do not merge.**

## Canonical source

Merged source commit:

`d40e034eaacac6d86c8ccefa384322f432a98c5d`

Keeper production state at that commit:

- slug: `keeper-of-smoldering-embers`
- artwork: `apps/web/public/art/cards/keeper-of-smoldering-embers.webp`
- `artworkUrl: '/art/cards/keeper-of-smoldering-embers.webp'`
- `rightsStatus: 'owned'`
- SHA-256: `e8f46d8c98369529e94c8685abbd70ca27565df713636febd0ad125deb6842ce`
- size / RIFF total: `603054`
- dimensions: `1024x1536`

Before editing, verify these values directly from the merged source commit. Stop if any invariant differs.

## Required implementation

Start from latest clean `origin/main` and create a fresh feature branch.

Change only what is needed in:

1. `apps/game-server/scripts/sync-production-card-art.ts`
2. `.github/workflows/production-card-art-sync.yml`

### Script

- Set `REQUIRED_SOURCE_COMMIT` to `d40e034eaacac6d86c8ccefa384322f432a98c5d`.
- Keep all existing 8 targets unchanged.
- Add `keeper-of-smoldering-embers` exactly once, for 9 total targets.
- Preserve all existing safeguards: immutable source read, `--check`, snapshot-gated `--apply`, Serializable transaction, row invariants, non-target fingerprints, card-count invariant, post-write verification.
- Do not alter `seed.ts`, gameplay data, schema, migrations, artwork files, or any other card.

### Workflow

Convert the existing 8-card workflow to 9-card:

- confirmation: `SYNC-9-CARD-ART-PRODUCTION`
- update display text from eight to nine
- `REQUIRED_SOURCE_COMMIT` and `SOURCE_COMMIT` → `d40e034eaacac6d86c8ccefa384322f432a98c5d`
- add Keeper to the committed-artwork file check
- `ARTWORK_FILES_PRESENT=9/9`
- pre-write: `TARGET_ROWS=9`, `UNIQUE_SLUGS=9`, mutation count `0..9`
- apply: `TARGET_ROWS_FINAL=9`, `SOURCE_OF_TRUTH_MATCH=9/9`, `NON_TARGET_FIELD_CHANGES=0`
- post-write: `TARGET_ROWS=9`, `UNIQUE_SLUGS=9`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=9/9`

Keep manual confirmation, Railway scope verification, read-only preflight, concurrency protection, snapshot-gated APPLY, already-synchronized path, and independent post-write verification.

## Validation

Run:

- `git diff --check`
- lint
- typecheck
- tests, expected baseline `349/349`
- build

Also verify statically:

- both files use the same required source commit
- 9 unique target slugs
- Keeper appears exactly once
- all 9 artwork files exist at the required source commit
- all 9 seed entries at that commit resolve to `/art/cards/<slug>.webp` with `rightsStatus: owned`
- no stale `SYNC-8-CARD-ART-PRODUCTION`, `TARGET_ROWS=8`, `UNIQUE_SLUGS=8`, `8/8`, or equivalent eight-card assertions remain in the two scoped files

**Do not dispatch the production workflow in this task, even if credentials are available.**

## Delivery

Open a PR to `main`. Do not merge.

Use the repository handoff protocol from `CLAUDE.md`: publish `## AGENT HANDOFF — FINAL REPORT` as the PR comment with branch, base/head SHAs, exact changed files, validations, CI/workflow IDs, confirmation string, and explicit `production mutation = NO` / `Merged: NO`.

Chat reply should be only the short pointer summary required by `CLAUDE.md`.
