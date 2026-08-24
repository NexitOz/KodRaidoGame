# CURRENT TASK — SHADOW Card 04 candidate verification

## Goal

Continue Card 04 from the generated master candidate already committed by the cross-agent bridge.

Canonical card: **Рунный Страж Эха** — `rune-of-the-echoing-dusk`, `RUNE`, `EPIC`, cost `3`, ally death -> summon `shadow-echo-token` 1/1.

## Candidate source

Review branch:
`assets/rune-of-the-echoing-dusk-candidate`

Candidate HEAD:
`f702bd2ab60eae32d0fdbd2bf91504995f75c48f`

Master:
`art-source/rune-of-the-echoing-dusk.webp`

Source note:
`docs/art-sources/2026-08-24-shadow-card-04-master-prompt.md`

Recorded integrity:

- dimensions: `1024x1536`
- format: WebP (`VP8 `)
- file size: `351690` bytes
- RIFF-declared total: `351690` bytes
- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`

The approved concept and owner palette decision remain canonical in:
`docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md` § `Owner decision`.

## Required work

Start from the candidate branch and verify the master independently.

Then prepare the minimum code/support needed to review a `RUNE` correctly in `/admin/art-review`: the current CHARACTER-only `CreatureSlot` panel must not render a meaningless 0/0 slot for this card. Preserve CHARACTER behavior unchanged.

Review the actual live artwork surfaces for a RUNE:

- Collection / hand `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- smallest binding legibility at `CardView size="xs"` / 92 px

`CreatureSlot` is not a live artwork surface for this card; `RuneZone` renders a glyph, not the illustration.

## Scope and stop point

Do **not** promote `artworkUrl` or `rightsStatus` yet.
Do **not** update production DB or run production sync.
Do **not** extend sync 9 -> 10 yet.
Do **not** merge.

The goal of this task is to make the RUNE review path valid, verify the candidate and present it for owner visual approval.

After visual QA is ready, STOP and wait for owner approval before any promotion.

## Delivery

Open a PR to `main` containing only the minimal review-support change plus any review metadata needed for Card 04. Do not merge.

Use the permanent handoff protocol in `CLAUDE.md`:

- full `## AGENT HANDOFF — FINAL REPORT` as a PR comment
- exact changed files
- branch/base/head SHAs
- integrity verification results
- visual QA surfaces/results
- CI/workflow IDs
- confirmed untouched areas
- explicit `Merged: NO`

Update `docs/AGENT_STATE.md` as the final handoff pointer and verify it back from GitHub before declaring completion.
