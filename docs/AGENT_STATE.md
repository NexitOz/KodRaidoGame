# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 04 — BOND / «Дом Весеннего Света»
- **Status:** **CARD 01 MASTER-ART BRIEF / GENERATION PACKAGE NEXT**
- **Current target:** `child-of-the-spring-light` / «Дитя Весеннего Света»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `ae56cb3a796e01f18d1ee6d36c41aeab9863efcf`
- **Current task type:** art-direction / repository documentation only; no image bytes, integration or production
- **Production operation authorized:** **NO**
- **Production workflow dispatch authorized:** **NO**
- **Railway / production DB authorized:** **NO**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **`SYNC-14-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**

## Closed milestone — Art Pack 03 / PURIFICATION

Art Pack 03 Cards 01–04 are **COMPLETE END TO END — LIVE IN PRODUCTION**.

- Card 01 `acolyte-of-the-white-rune` — LIVE
- Card 02 `seal-of-the-curse` — LIVE
- Card 03 `warden-of-the-barrier` — LIVE
- Card 04 `rune-of-curse-breaking` — LIVE

Card 04 production closeout:

- workflow run: `33560559977` (run 10, attempt 1) — success
- job: `100031744885`
- dispatched on: `main` @ `a81823443f8a824ecfbe03629c167a3f81b37d76`
- immutable artwork source: `b792be37b32f73906d104642689afaa88a47b1c2`
- rows changed: exactly 1, only `rune-of-curse-breaking`
- `NON_TARGET_FIELD_CHANGES=0`
- final source of truth: `14/14`
- durable report: `docs/agent-reports/2026-09-01-art-pack-03-card-04-production-sync.md`

Nothing in Art Pack 03 is outstanding.

## Art Pack 04 roster — BOND

The already-live flagship/faction anchor is:

- `matriarch-of-the-spring-light` / «Матриарх Дома Весеннего Света» — LEGENDARY — FINAL APPROVED, LIVE IN PRODUCTION

Non-flagship starter-roster order:

1. `child-of-the-spring-light` / «Дитя Весеннего Света» — **CURRENT TARGET**
2. `keeper-of-the-promise` / «Хранитель Обещания» — planned
3. `light-of-the-hearth` / «Свет Очага» — planned
4. `rune-of-reflected-light` / «Руна Отражённого Света» — planned

Canonical Card 01 facts to verify in the active task:

- BOND / CHARACTER / COMMON / cost 1
- stats 1/3
- ability: `При выходе: восстановите 1 здоровье Проводнику.`
- gameplay role: small early sustain / on-play heal

## BOND locked visual anchor

Use the BOND section of `docs/art-bible-01.md` and the approved Matriarch as the faction reference.

Standing known language, to be re-verified and sharpened in the active brief:

- warm ivory / pale sage-green;
- BOND amber around `#e0a458`;
- organic gold vine/branch filigree;
- living garden / natural canopy language;
- warm golden-hour diffuse light;
- soft sustaining atmosphere, not harsh combat lighting;
- flowing organic materials rather than PURIFICATION plate/geometry;
- healing, protection, ally synergy, sustain.

COMMON Card 01 must remain visibly far below the Legendary Matriarch in gold, ceremony, VFX, architecture and costume complexity.

## Active task boundary

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `ae56cb3a796e01f18d1ee6d36c41aeab9863efcf`.

Required result:

- verify gameplay/card facts from fresh repository state;
- research BOND visual identity and actual artwork surfaces/crops;
- reserve distinct visual concepts for Cards 02–04 to prevent motif collisions;
- write `docs/art-review/child-of-the-spring-light-master-art-brief.md`;
- include generation prompt + negative prompt + QA/reject criteria;
- create/initialize `docs/art-pack-04.md` roster/status tracker;
- write durable handoff report;
- update this state file last and fetch-verify it;
- stop at **READY FOR OWNER ART BRIEF REVIEW — ART PACK 04 CARD 01**.

Do NOT generate an image, move artwork bytes, edit seed/gameplay/schema, touch production sync, use production credentials or begin Card 02.

## Small technical follow-ups — not part of active art task

These are non-blocking and must not broaden Card 01 art-direction scope:

1. stale comments in `apps/game-server/scripts/sync-production-card-art.ts` and `.github/workflows/production-card-art-sync.yml` still describe `SYNC-14-CARD-ART-PRODUCTION` as reserved; authoritative state is **CONSUMED**;
2. optional deletion of `transport/card04-github-actions`, which carries a `contents: write` workflow and must never be merged;
3. GitHub Actions emitted a Node 20 deprecation warning; handle dependency/action maintenance separately.

## Art binary transport standing rule

The user is not a manual file courier.

For future generated masters, use the established machine-owned transport path with hard gates for byte size, SHA-256, Git blob SHA, RIFF/FourCC, dimensions and full decode. Never use GitHub Contents-API binary/base64 transport for generated masters.
