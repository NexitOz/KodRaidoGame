# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 04 — BOND / «Дом Весеннего Света»
- **Status:** **REJECTED / BLOCKED — NO INTEGRATION.** Candidate transport failed: the provider reports the supplied Firestorage share does not exist. No candidate bytes exist, so the nine-surface QA could not run.
- **Current target:** `child-of-the-spring-light` / «Дитя Весеннего Света»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md` — executed, ended BLOCKED at the transport step
- **Current task commit:** `da7bac4f43c1c57749421539ea659e3142694c7e`
- **Latest task-result commit:** `5a49aad7befd6610a2d6887b7538c00e2c267dab`
- **Latest report:** `docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md`
- **Canonical brief:** `docs/art-review/child-of-the-spring-light-master-art-brief.md`
- **Owner master approval:** `docs/agent-reports/2026-09-02-art-pack-04-card-01-owner-master-approval.md`
- **Pack document:** `docs/art-pack-04.md`
- **Artwork bytes in the repository:** **NONE** — nothing was committed on any branch
- **Nine-surface QA:** **NOT RUN** — no QA result exists and none may be inferred
- **Production operation authorized:** **NO**
- **Production workflow dispatch authorized:** **NO**
- **Railway / production DB / Vercel authorized:** **NO**
- **Open blocker — owner action required:** the approved master is not reachable. Re-upload the exact WebP (`596976` bytes, SHA-256 `bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`) and supply a fresh share link; then re-run the transport by pushing to `transport/art-pack-04-card01-github-actions`, which already carries the correct expected tuple.

## Card 01 candidate transport — BLOCKED, source not found

The runner-owned transport failed at the first provider call. Evidence in
`docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md`.

| Item                             | Value                                                                    |
| -------------------------------- | ------------------------------------------------------------------------ |
| Transport run                    | `33565829125`, job `100048651134` — **failure** at the provider lookup   |
| Read-only probes                 | `33565969881`, `33566091089` — both success, both confirming the 404     |
| Supplied share                   | `aZIlHM-TkPI7` → **404 `{"detail":"Share link not found"}`**             |
| Positive control (Card 04 share) | `8hmlyOzbah75` → **HTTP 200** — endpoint and method are healthy          |
| Candidate branch                 | `assets/child-of-the-spring-light-candidate-v1` @ `730efda` — no artwork |
| Transport branch                 | `transport/art-pack-04-card01-github-actions` @ `73c6b96` — never merge  |
| Production path for this card    | does not exist                                                           |

Three further findings, so nobody re-litigates them:

1. The share **page** returns HTTP 200 but proves nothing — it is a client-rendered shell that renders
   for any id and carries no share id, file id, filename or size. Only the API is authoritative.
   A share is live when `https://api.firestorage.ai/prod/file/shares/<SHARE_ID>/files?maxResults=1000`
   returns 200.
2. The supplied file id `fl_f0555165aaff4598bed07f2e0f44c487` is 35 characters; the API rejects it as
   too long (max 32), so it was never an API file id. The transport does not need it anyway — the
   file is selected from the listing by **size + MIME**, never by filename.
3. Expiry is not the cause: the record claims `2026-09-16` and the probes ran on 2026-09-01. A bounded
   check of the ambiguous capital-`I` / lowercase-`l` positions in the id returned 404 on all seven
   alternatives.

Nothing was substituted, re-rendered, re-encoded or reconstructed, and no alternative transport route
was improvised after the provider route failed.

## Card 01 canonical facts

`child-of-the-spring-light` / «Дитя Весеннего Света»:

- BOND / CHARACTER / COMMON / cost 1
- 1/3
- `При выходе: восстановите 1 здоровье Проводнику.`
- `ON_PLAY` → `HEAL` / `FRIENDLY_CONDUCTOR` / 1

Locked concept from the approved brief: a child at a humble garden threshold offers a single budding spring branch toward the viewer in cupped hands; the contained warm light is only as large as the hands. The out-of-frame offering encodes healing the Conductor/player rather than a board ally.

## Owner-approved generated master

The owner approved the generated image on 2026-09-02 after approving the brief.

Generation ID:

`615e529f-173b-4c42-826b-814da3de8b96`

Approved original PNG:

- `1024 × 1536`, RGB
- `2902102` bytes
- SHA-256 `b67d2e520ed7b967e724e47f6de52809ea44da9efaca3d48a33a3265da759635`
- full decode PASS

Exact candidate transport WebP, made without crop/resize/recomposition:

- `1024 × 1536`
- `596976` bytes
- SHA-256 `bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`
- expected Git blob `a52fb443ff296c4411c7dc0e640be98befbc12bc`
- RIFF total `596976`
- FourCC `VP8 `
- full decode PASS

Machine source:

- `https://firestorage.ai/ja/f/aZIlHM-TkPI7`
- share UUID `aZIlHM-TkPI7`
- file id `fl_f0555165aaff4598bed07f2e0f44c487`
- expires `2026-09-16T21:44:37.912662Z`

The owner is not a manual file courier. Use the established GitHub-hosted runner transport with hard binary gates.

## Approval scope

The current owner approval is **master visual approval before QA**. It authorizes candidate intake and review only.

It does not waive the objective brief gates and does not authorize:

- production-path artwork;
- `seed.ts` / `rightsStatus` changes;
- integration PR or merge;
- production-sync preparation or dispatch;
- Railway / production DB access.

After candidate QA:

- if every gate passes, stop at **READY FOR POST-QA OWNER APPROVAL — ART PACK 04 CARD 01**;
- if the candidate is intact but one or more brief gates miss, stop at **CANDIDATE QA COMPLETE — OWNER CAVEAT DECISION REQUIRED** and report every deviation;
- if binary integrity/transport or a hard safety gate fails, stop at **REJECTED / BLOCKED — NO INTEGRATION**.

Do not regenerate or repair automatically after a QA miss.

## Required candidate QA

Card 01 is a CHARACTER and therefore requires nine surfaces:

1. raw 2:3 master
2. CardView 3:4
3. CardDetailDrawer 4:5
4. HandCardPreview 7:9
5. CreatureSlot 3:4
6. admin desktop
7. admin 390 px
8. 92 px thumbnail
9. 92 px hierarchy beside `matriarch-of-the-spring-light`

Measure every gate from brief §16, including actual crop geometry, edge density, warmth, saturation, luminance, grayscale spread, metallic-gold coverage, thumbnail read, rarity hierarchy, faction differentiation and reserved-motif/safety checks.

## Art Pack 04 roster

- Card 01 `child-of-the-spring-light` — **OWNER MASTER APPROVED, TRANSPORT BLOCKED — needs a fresh share link before QA can run**
- Card 02 `keeper-of-the-promise` — planned, not briefed
- Card 03 `light-of-the-hearth` — planned, not briefed
- Card 04 `rune-of-reflected-light` — planned, not briefed
- flagship `matriarch-of-the-spring-light` — **LIVE IN PRODUCTION**, Art Pack 01 faction anchor

Do not start Card 02 before Card 01's post-QA owner gate is resolved.

## Closed milestone — Art Pack 03 / PURIFICATION

Cards 01–04 are **COMPLETE END TO END — LIVE IN PRODUCTION**.

Card 04 closeout:

- run `33560559977` (run 10), job `100031744885`, success
- immutable source `b792be37b32f73906d104642689afaa88a47b1c2`
- rows changed exactly 1, only `rune-of-curse-breaking`
- `NON_TARGET_FIELD_CHANGES=0`
- final source of truth `14/14`

Consumed production confirmations, invalid forever:

- `SYNC-13-CARD-ART-PRODUCTION` — CONSUMED
- `SYNC-14-CARD-ART-PRODUCTION` — CONSUMED

## Small technical follow-ups — not part of active art task

1. stale comments in `apps/game-server/scripts/sync-production-card-art.ts` and `.github/workflows/production-card-art-sync.yml` still describe `SYNC-14-CARD-ART-PRODUCTION` as reserved; authoritative state is CONSUMED;
2. optional deletion of `transport/card04-github-actions`, which carries a `contents: write` workflow and must never merge;
3. GitHub Actions emitted a Node 20 deprecation warning; handle action/dependency maintenance separately.

## Art binary transport standing rule

For generated masters use machine-owned transport with hard gates for byte size, SHA-256, Git blob SHA, RIFF/FourCC, dimensions and full decode. Never use GitHub Contents-API binary/base64 transport for generated masters; this project has observed truncation through that route.
