# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **NEW OWNER-APPROVED MASTER v2 — CANDIDATE INTAKE / QA NEXT**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `ad138e4fcadbd30e86d30881a1aa4c9f59b00ca8`
- **Current task type:** exact binary intake + candidate QA only
- **Integration / promotion authorized:** NO
- **Production operation authorized:** NO

## Card 02 — COMPLETE END TO END

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED, repository-integrated and live in production.

- production sync run: `33320281456`
- job: `99280920592`
- conclusion: success
- rows changed: exactly 1, only `seal-of-the-curse`
- final source of truth: `12/12`
- non-target field changes: `0`
- `SYNC-12-CARD-ART-PRODUCTION`: **CONSUMED**

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

## Card 03 — owner-approved master v2

The earlier Card 03 candidate is rejected historical input and is superseded.

The owner explicitly approved a **new master v2 on 2026-08-31**. It is the only Card 03 visual source authorized for the next candidate pass.

Exact transport WebP gates:

- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size: `193038`
- RIFF total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- full decode: PASS

**Do not reuse the old rejected tuple:** `284002` bytes / SHA-256 `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`.

Temporary manual transport copy of v2:

`https://firestorage.ai/ja/f/0Dy-NYu7pX8_`

This share URL is transport convenience only. A 403, HTML page, screenshot or thumbnail is not the approved binary. Intake is valid only if every exact gate above passes.

## Candidate v2 contract

Fresh candidate branch:

`assets/warden-of-the-barrier-candidate-v2`

Candidate path:

`art-source/warden-of-the-barrier.webp`

Local review staging:

`apps/web/public/art-review-candidates/warden-of-the-barrier.webp`

Claude Code must inspect the branch tree first. If the exact file has already been landed, do not attempt external transport. If the file is absent and external retrieval cannot return the exact matching bytes, stop cleanly rather than using the old candidate or fabricating a substitute.

## Why v2 exists

The previous candidate was rejected because it violated approved-brief automatic rejects. v2 was generated specifically to remove those failures. QA must verify rather than assume:

- no cathedral / spires / crowd / monumental architecture
- no star / compass / heraldic boss
- no broad gold ornamentation
- manufactured planted ward-screen with visible ground anchor
- restrained background that collapses at thumbnail size
- no baked lettering / rune text / logo / UI

The approved brief remains:

`docs/art-review/warden-of-the-barrier-master-art-brief.md`

## Required QA after exact intake

Card 03 is a CHARACTER, so all nine surfaces are required:

1. raw 2:3
2. CardView 3:4
3. CreatureSlot 3:4
4. CardDetailDrawer 4:5
5. HandCardPreview 7:9
6. `/admin/art-review` desktop
7. `/admin/art-review` 390 px
8. 92 px thumbnail
9. 92 px grayscale

Report real deviations. Never silently alter the owner-approved v2 artwork.

## Hard gate

Authorized now:

- exact v2 candidate intake
- candidate-only review metadata/code required by existing convention
- nine-surface QA
- normal local repository validation relevant to changed files

Still NOT authorized:

- integrating/promoting to `apps/web/public/art/cards/`
- changing `seed.ts`, gameplay, balance, schema or migrations
- changing production `artworkUrl` / `rightsStatus`
- extending controlled sync 12 → 13
- dispatching any production workflow
- Railway/Vercel/production DB access or mutation
- Card 04 work

Candidate v2 task must end at exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **new master v2 OWNER APPROVED; fresh candidate intake / QA next**
- Card 04 `rune-of-curse-breaking` — not started
