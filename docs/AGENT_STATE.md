# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 04, BOND / «Дом Весеннего Света»
- **Status:** **TRANSPORT RETRY READY — FRESH ACTIVE SHARE + CORRECTED BYTE TUPLE**
- **Current target:** `child-of-the-spring-light` / «Дитя Весеннего Света»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `8c3a3a2d04666cc5f6f6f5104d5eddf6c093a3d1`
- **Canonical correction report:** `docs/agent-reports/2026-09-02-art-pack-04-card-01-transport-correction.md`
- **First blocked attempt report:** `docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md`
- **Canonical brief:** `docs/art-review/child-of-the-spring-light-master-art-brief.md`
- **Owner visual approval:** remains valid; the digest/share corrections are transport bookkeeping, not a new visual
- **Artwork bytes in repository:** NONE at the time of this state update
- **Nine-surface QA:** NOT RUN yet
- **Production operation authorized:** NO
- **Production workflow dispatch authorized:** NO
- **Railway / production DB / Vercel authorized:** NO

## What happened

The first GitHub Actions transport run correctly stopped because the Firestorage share written in the task returned 404. No artwork was committed and no QA result exists from that attempt.

ChatGPT then re-read the exact approved runtime files and found that the previously documented SHA-256 values and expected Git blob SHA were transcription errors. The exact approved visual is unchanged. The old tuple and old share are superseded by the canonical correction report.

## Canonical approved source

Generation ID: `615e529f-173b-4c42-826b-814da3de8b96`.

Approved PNG:

- `1024 × 1536`, RGB
- `2902102` bytes
- SHA-256 `b67e65b3d6cfc944002a863ded275ca8d5cb6cee2b8f4de3be30338c8de7b3c9`
- full decode PASS

Exact candidate WebP:

- `1024 × 1536`
- `596976` bytes
- SHA-256 `bc2de762075121604d24756478e1d89a9d4e176207a3d8e45a8622b90893eca3`
- expected Git blob `a52de8f99b5d775e6c85c9db7e139a09196bdd7c`
- RIFF total `596976`
- FourCC `VP8 `
- full decode PASS

Fresh Firestorage source:

- share `https://firestorage.ai/ja/f/1CULOcsXBz8s`
- share ID `1CULOcsXBz8s`
- file id `01a05f186bd77166bf4f998d657b94c2`
- public id `A9mj0NshF09Yuhiv`
- provider status `active`
- expires `2026-09-15T22:30:31.126992Z`

Do not use the superseded share `aZIlHM-TkPI7`, WebP digest beginning `bc2e5abc`, Git blob beginning `a52fb443`, or PNG digest beginning `b67d2e52`.

## Existing branches

- candidate `assets/child-of-the-spring-light-candidate-v1` @ `730efda9b615d2f9a22079dfb09df3131a413ea1`, no artwork yet
- transport `transport/art-pack-04-card01-github-actions` @ `73c6b96ea457c94db863cf8628b2591e3bbc87c2`, temporary `contents: write` workflow, MUST NEVER MERGE INTO `main`

## Required next action

Execute `docs/CLAUDE_CURRENT_TASK.md`: update only the temporary transport workflow constants to the fresh share and corrected tuple, run the existing hard integrity gates, push the exact binary to the existing candidate branch, fetch it back and verify, then run the full nine-surface CHARACTER QA.

Decision after QA:

- all gates pass: **READY FOR POST-QA OWNER APPROVAL — ART PACK 04 CARD 01**
- intact candidate with brief deviations: **CANDIDATE QA COMPLETE — OWNER CAVEAT DECISION REQUIRED**
- binary integrity/transport or hard safety failure: **REJECTED / BLOCKED — NO INTEGRATION**

No automatic regeneration or repair after a QA miss.

## Art Pack 04 roster

- Card 01 `child-of-the-spring-light`: **OWNER VISUAL APPROVED, TRANSPORT RETRY READY**
- Card 02 `keeper-of-the-promise`: planned, not briefed
- Card 03 `light-of-the-hearth`: planned, not briefed
- Card 04 `rune-of-reflected-light`: planned, not briefed
- flagship `matriarch-of-the-spring-light`: **LIVE IN PRODUCTION**, Art Pack 01 faction anchor

Do not start Card 02 before Card 01's post-QA owner gate is resolved.

## Closed milestone: Art Pack 03 / PURIFICATION

Cards 01–04 are **COMPLETE END TO END — LIVE IN PRODUCTION**.

Card 04 closeout:

- run `33560559977`, job `100031744885`, success
- immutable source `b792be37b32f73906d104642689afaa88a47b1c2`
- rows changed exactly 1, only `rune-of-curse-breaking`
- `NON_TARGET_FIELD_CHANGES=0`
- final source of truth `14/14`

Consumed production confirmations, invalid forever:

- `SYNC-13-CARD-ART-PRODUCTION` — CONSUMED
- `SYNC-14-CARD-ART-PRODUCTION` — CONSUMED

## Standing transport rule

The owner is not a manual file courier. For generated masters use machine-owned transport with hard gates for byte size, SHA-256, Git blob SHA, RIFF/FourCC, dimensions and full decode. Never use GitHub Contents-API binary/base64 transport for generated masters.
