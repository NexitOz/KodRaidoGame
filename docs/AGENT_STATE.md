# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **INTEGRATION PR OPEN — READY FOR INDEPENDENT PR REVIEW, NOT MERGED**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `752cbd2113004b50a49a5bb8d7f94edbdf9c288c`
- **Current task type:** final repository integration + production-path QA + narrow PR; no production dispatch
- **Owner approval report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md`
- **Owner approval record commit:** `b42088164d49572f8157bb4c333b90339bdf3f23`
- **Latest QA report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`
- **Candidate branch:** `assets/warden-of-the-barrier-candidate-v2`
- **Candidate QA head:** `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- **Integration PR:** **#39** — OPEN / NOT MERGED — `https://github.com/NexitOz/KodRaidoGame/pull/39`
- **Integration branch:** `claude/card-03-final-integration`
- **Integration base SHA:** `6503a3023c16c7bd6eb9b9f8d42262a671a10965`
- **Integration head SHA:** `e0e7a472ed3f66133d5448600aab65e75f6a6a2d`
- **Latest task-result commit:** `e0e7a472ed3f66133d5448600aab65e75f6a6a2d`
- **PR handoff report:** PR #39 comment `## AGENT HANDOFF — FINAL REPORT` (`#issuecomment-5482812497`)
- **CI:** run `33425847506` — success
- **Open blocker:** **INDEPENDENT REVIEW OF PR #39.** After merge, the immutable-source repin task must run before any production authorization can be considered.
- **Integration / promotion authorized:** YES, repository only — **executed, PR #39 open and unmerged**
- **Production operation authorized:** NO
- **Card 04 work authorized:** NO

## Card 02 — COMPLETE END TO END

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED, repository-integrated and live in production.

- production sync run: `33320281456`
- job: `99280920592`
- conclusion: success
- rows changed: exactly 1, only `seal-of-the-curse`
- final source of truth: `12/12`
- non-target field changes: `0`
- `SYNC-12-CARD-ART-PRODUCTION`: **CONSUMED**
- current 12-card immutable source commit before Card 03 integration: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`

## Card 03 canonical facts

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

Gameplay, balance, ability text, schema and migrations are outside the current task.

## Card 03 — FINAL OWNER APPROVED master v2

The owner gave final visual approval for integration on **2026-08-31** after full candidate QA.

Exact approved source:

- candidate branch: `assets/warden-of-the-barrier-candidate-v2`
- candidate QA head: `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- exact binary source commit: `3dda92ef0d427b943c71212b8e24c95f659dbce5`
- candidate path: `art-source/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size: `193038`
- RIFF total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- full decode: PASS

Canonical production path to create during integration:

`apps/web/public/art/cards/warden-of-the-barrier.webp`

The production-path copy must be byte-identical to the approved source.

### Rejected historical input

Never reuse or repair the old v1 candidate:

- old branch: `assets/warden-of-the-barrier-candidate`
- old size: `284002` bytes
- old SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

Temporary transport branch `transport/card03-v2-github-actions` is transport-only, carries a `contents: write` workflow and **must never be merged into `main`**.

## Card 03 QA — completed and accepted

All nine required candidate surfaces were captured against the real running stack and passed:

1. raw 2:3
2. CardView 3:4
3. CreatureSlot 3:4
4. CardDetailDrawer 4:5
5. HandCardPreview 7:9
6. `/admin/art-review` desktop
7. `/admin/art-review` 390 px
8. 92 px thumbnail
9. 92 px grayscale

Validation at candidate QA was green: Prettier, diff check, typecheck, lint, build and 32/32 web tests.

Every v1 automatic-reject reason was cleared on v2:

- no cathedral / spires / crowd / monumental architecture
- no star / compass / heraldic boss
- no broad gold ornamentation (`0.01%` measured)
- barrier clearly reads as a planted manufactured ward-screen with visible anchor
- restrained background collapses at 92 px
- no baked lettering / rune text / logo / UI

### Owner-accepted judgement items — CLOSED

The following are explicitly accepted as non-blocking and must not be reopened during integration unless a new production-path regression appears:

1. a single pale classical column remains in the background;
2. Card 03 has a high-key PURIFICATION value profile (`p5 = 109`);
3. the binding 4:5 crop trims only the very bottom lip of the anchor base plate while preserving the planted spike and displaced rubble.

Owner approval record:

`docs/agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md`

## Current integration authorization — EXECUTED

All of the following were completed on `claude/card-03-final-integration` and are captured in PR #39.
The exact approved bytes landed with the **identical Git blob SHA** `c4cb3f4e41f349e86b044712f267f9fdc678aa86`,
so byte-identity is proven, not merely hash-matched. All nine surfaces were re-run against the
canonical production path on the real stack, with **zero** requests to the candidate staging path
even though that gitignored file still exists and is servable. Validation green: Prettier, diff
check, typecheck, lint, 32/32 web tests, 156/156 game-server tests, both builds, CI run
`33425847506`.

Authorized and now done:

- create a fresh narrow integration branch from current `main`
- promote the exact approved v2 bytes to `apps/web/public/art/cards/warden-of-the-barrier.webp`
- change only Card 03 art-source fields in `apps/game-server/prisma/seed.ts` to the canonical WebP path and `rightsStatus: 'owned'`
- add/update Card 03 `/admin/art-review` entry to use the canonical production artwork path
- preserve CHARACTER / CreatureSlot review behavior
- update directly relevant Art Pack 03 documentation to FINAL OWNER APPROVED / integration in review
- extend the controlled production card-art synchronization definition from 12 to 13 targets in repository code
- reserve `SYNC-13-CARD-ART-PRODUCTION` as the future exact confirmation string
- run all nine review surfaces again against the canonical production path
- run normal repository validation
- open a narrow integration PR
- leave the permanent PR handoff
- stop for independent review

Still NOT authorized:

- merging the integration PR without independent review — **PR #39 is open and must stay unmerged until reviewed**
- production workflow dispatch
- use of `SYNC-13-CARD-ART-PRODUCTION` as authorization
- production DB mutation
- Railway/Vercel production access or mutation
- Card 04 work

## Production sync safety after integration

Current production synchronization is still the consumed 12-card state.

The 12 → 13 extension is **done in repository code** on PR #39, and the old 12-card pin was
deliberately kept. The resulting workflow is **non-dispatchable**, verified by running it rather
than assumed:

```
$ npx tsx scripts/sync-production-card-art.ts --check
Missing explicit production artwork fields in seed.ts for warden-of-the-barrier
exit: 1
```

It aborts inside `deriveDesiredValues` reading `seed.ts` at the stale pin, before any database
connection opens. The workflow's thirteen-file existence check fails the same way.

Hard rule:

- do **not** pin `REQUIRED_SOURCE_COMMIT` or workflow `SOURCE_COMMIT` to an integration branch/head SHA
- do **not** weaken immutable-source checks
- keep the old 12-card pin in the integration PR, explicitly marked as requiring a post-merge repin
- the pre-merge 13-card workflow must therefore remain fail-closed / non-dispatchable
- after the integration merge, a separate task must repoint every immutable-source pin to the exact merged integration commit and validate it
- only after that may the owner separately authorize `SYNC-13-CARD-ART-PRODUCTION`

`SYNC-13-CARD-ART-PRODUCTION` is **RESERVED, NOT AUTHORIZED, NOT CONSUMED**.

## Required integration QA

After promoting the approved bytes to the canonical path, re-run all nine surfaces using:

`/art/cards/warden-of-the-barrier.webp`

Required proof includes:

- no request to `/art-review-candidates/warden-of-the-barrier.webp`
- Card 03 review row requests the canonical `/art/cards/warden-of-the-barrier.webp`
- local source-of-truth setup reports `rightsStatus: owned`
- exact production-path SHA-256 remains `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- size remains `193038`
- all nine surfaces pass with the already accepted caveats unchanged

## Current task final gate

The current integration task must end at exactly one of:

- **READY FOR INDEPENDENT PR REVIEW**
- **BLOCKED / REJECTED**

It ended at **READY FOR INDEPENDENT PR REVIEW**. PR #39 is open and unmerged, and the handoff states
that production synchronization remains unauthorized.

## Next task after PR #39 merges

Repoint every immutable-source pin to the exact Card 03 merge commit and revalidate:

- `REQUIRED_SOURCE_COMMIT` in `apps/game-server/scripts/sync-production-card-art.ts`
- `REQUIRED_SOURCE_COMMIT` and `SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`

Only after that may the owner separately authorize `SYNC-13-CARD-ART-PRODUCTION`, which remains
**RESERVED, NOT AUTHORIZED, NOT CONSUMED**.

Also worth cleaning up once Card 03 is fully promoted: delete `transport/card03-v2-github-actions`
(carries a `contents: write` workflow, must never be merged) and the superseded
`assets/warden-of-the-barrier-candidate` branch (still holds the rejected v1 binary).

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **FINAL OWNER APPROVED; integration PR #39 OPEN, awaiting independent review; not merged, not synced**
- Card 04 `rune-of-curse-breaking` — not started
