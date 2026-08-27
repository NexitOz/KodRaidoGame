# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 candidate **VERIFIED + REVIEWED — READY FOR OWNER VISUAL APPROVAL**
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md`
- **Prior handoff (v1 rejection):** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-rejected.md`
- **Superseded generation handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-generated.md` — its
  reported integrity values describe the generator's **local** file, not the blob that reached git
- **Branch:** `main`
- **PR:** none

## Candidate source — VERIFIED

- branch: `assets/acolyte-of-the-white-rune-candidate` (**unmerged**)
- verified candidate commit: `69e176e` — the re-transport, `Bin 15042 -> 214378 bytes`
- candidate path: `art-source/acolyte-of-the-white-rune.webp`
- source note: `docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`

The re-transport landed on the **original** branch, not a `-v2` branch. A
`transport/acolyte-of-the-white-rune-v2` branch exists but is only a copy of `main` and carries no
art file — ignore it. The superseded truncated commit is `1652efaa` (15,042 bytes); it remains in
history as evidence and must never be used.

All integrity checks PASS on `69e176e`:

| Check                      | Expected    | Actual                       | Result |
| -------------------------- | ----------- | ---------------------------- | ------ |
| `git cat-file -s`          | 214378      | 214378                       | PASS   |
| Byte size                  | 214,378     | 214,378                      | PASS   |
| RIFF-declared == byte size | equal       | equal                        | PASS   |
| SHA-256                    | `cb766584…` | `cb766584…`                  | PASS   |
| Container fourcc           | `VP8 `      | `VP8 `                       | PASS   |
| Dimensions                 | 1024 × 1536 | 1024 × 1536                  | PASS   |
| Full decode                | succeeds    | `DECODE OK (1024, 1536) RGB` | PASS   |

## Review result — READY FOR OWNER VISUAL APPROVAL

Full local stack (PostgreSQL + Redis + seeded game-server + Next dev) was brought up so the review
ran against real card data and real components. All required surfaces PASS: raw master, `CardView`
3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `CreatureSlot` 3:4, `/admin/art-review` at
desktop and 390 px, 92 px thumbnail, and the side-by-side hierarchy check against
`high-warden-of-the-white-rune`.

The §15 acceptance checklist passes on every item — including the decisive ones: armored not robed,
light plain armor with no full harness, matte non-mirrored metal, bare hands, gold only as hairlines,
no forbidden SHADOW/cathedral/crowd drift, and COMMON-vs-LEGENDARY hierarchy obvious at 92 px.

Candidate isolation was proven by network trace: the page requested the gitignored
`/art-review-candidates/` path and **never** `/art/cards/acolyte-of-the-white-rune.webp`.

### Two caveats for the owner's decision

1. **Head clearance is ~2–4 px under the 4:5 cut**, not the ~130 px §10 of the brief specified. The
   hair crown sits at master row ~130 against a cut at row 128. Nothing is clipped in any of the
   three shipped crops today, but there is effectively no margin for a future tighter surface or a
   re-encode that rounds differently.
2. **Rendering reads photographic rather than painterly**, diverging from the Art Pack 01/02 house
   style — most visible beside the High Warden. §13 asked for painterly card illustration and the
   generator's own refinement prompt tried to correct this without fully succeeding.

Neither is a §15 failure. Both are owner calls: accept as-is, or send back for a re-render with the
head lowered toward row ~260 and a more painterly treatment.

### Review-surface change

`apps/web/src/app/admin/art-review/page.tsx` @ `df0227a` — registers `acolyte-of-the-white-rune` in
`REVIEW_TARGETS` as `ART PACK 03 — CANDIDATE 01`, deliberately **without** `reviewArtworkUrl` so it
can only resolve through the gitignored candidate path. The candidate `.webp` itself is gitignored
and not committed. Validation: `git diff --check`, Prettier, ESLint, typecheck (0 errors) and the
production build all PASS — after building `packages/shared` and `packages/ui` first, without which
4 pre-existing errors in untouched files appear as a build-order artifact.

## Owner-approved visual direction

The final brief is:

`docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`

Locked owner decisions:

- light plain standard-issue armor, not robes
- three-quarter framing cut at mid-thigh
- bare head, no crown/head ornament
- no weapon / shield / cape
- small white-stone rune tablet in both bare hands
- white / silver / ivory PURIFICATION palette
- cold pale-blue-white material-bound rune glow
- restrained gold, two hairlines / ~3% maximum
- modest cloister architecture, no flagship cathedral/crowd devices

The candidate direction was selected by the owner for continuation. Exact generation/refinement provenance is recorded honestly in the candidate source note.

## Review task — COMPLETE

Verification and real-surface visual QA are done; see the review handoff. Recorded below for
reference.

Required review surfaces:

- raw master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `CreatureSlot` 3:4
- `/admin/art-review` desktop
- `/admin/art-review` 390px mobile
- 92px thumbnail
- side-by-side hierarchy check vs `high-warden-of-the-white-rune`

`acolyte-of-the-white-rune` is now registered in `/admin/art-review` as a candidate-path target (commit `df0227a`), not a production `reviewArtworkUrl`.

The review must walk §15 of the approved brief and finish with one status:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**

## Hard stop

No promotion is authorised.

Do not:

- merge `assets/acolyte-of-the-white-rune-candidate`
- copy the candidate into `apps/web/public/art/cards/`
- change `seed.ts`
- change any `artworkUrl` / `rightsStatus`
- change Prisma schema/migrations
- change gameplay, balance, card data, stats, rarity, faction or effects
- change Battlefield gameplay/layout
- change production sync script/workflow
- change Railway/Vercel configuration
- touch the production DB
- run production sync

## Previous milestone

SHADOW Art Pack 02 remains complete end to end. Its ten-card production sync was already executed successfully. The old confirmation `SYNC-10-CARD-ART-PRODUCTION` is consumed and is not standing authorization for any future sync.

## Recommended next action

**Owner visual approval decision on the two caveats above.**

If accepted, a separate and explicitly authorised integration task promotes the artwork: copy to
`apps/web/public/art/cards/acolyte-of-the-white-rune.webp`, set `artworkUrl` and
`rightsStatus: 'owned'` in `seed.ts`, mark Art Pack 03 Card 01 approved, and extend the production
sync 10 → 11 with the pin, `TARGET_SLUGS`, confirmation string and **every** count assertion moving
together in one change.

If sent back, the fix is a re-render with the head lowered toward master row ~260 and a more
painterly treatment; §13/§14 need no change beyond re-emphasising those two points.

Promotion, seed changes and production sync remain **unauthorised**.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md` — its verify-and-review task is complete as of `df0227a`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md` for the verification
   values, surface results, §15 walk and the two caveats. The `…-candidate-rejected.md` report
   covers the superseded truncated v1; `…-candidate-generated.md` holds generation provenance but
   its integrity values describe the generator's local file.
4. Resolve fresh `main` and candidate branch refs from GitHub before acting.
5. Repository state is authoritative over stale chat summaries.
