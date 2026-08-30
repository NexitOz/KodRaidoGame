# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **OWNER-APPROVED MASTER EXISTS — CANDIDATE INTAKE / QA NEXT**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `1f90abbf08f3b014d67695aa85fd6c845926e1ad`
- **Open blocker:** exact approved bytes must be landed on the real candidate branch; previous Claude/Codex attachment-access blocks are superseded by external byte transport
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

## Card 03 owner approval and master

The Card 03 brief is OWNER APPROVED. Locked decisions remain:

- planted white-steel ward-screen, not a carried shield
- restrained readable environment with a hard information ceiling
- bare head
- cinematic realistic premium CCG with subtle painterly finish

ChatGPT generated the corrected vertical master and the owner explicitly approved it on 2026-08-30.

The approved visual source has been converted only for repository transport to a WebP candidate with these exact intake gates:

- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size: `284002`
- RIFF total: `284002`
- SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`
- full decode: PASS

The previous statement "no image exists" is now historical and must not be acted on.

## Candidate contract

Expected real candidate branch:

`assets/warden-of-the-barrier-candidate`

Expected asset path:

`art-source/warden-of-the-barrier.webp`

Local review staging:

`apps/web/public/art-review-candidates/warden-of-the-barrier.webp`

Do not create an empty candidate branch. Create it only when the exact approved bytes have passed the intake gates.

## Required QA after intake

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

Walk the approved brief against the real candidate and report deviations. Never silently alter the owner-approved artwork.

## Hard gate

Authorized now:

- exact candidate intake
- candidate-only source/report metadata
- nine-surface QA

Still NOT authorized:

- integration/promotion to `apps/web/public/art/cards/`
- changes to `seed.ts`, gameplay, balance, schema or migrations
- production `artworkUrl` / `rightsStatus` changes
- extending sync 12 → 13
- any production workflow dispatch
- Railway/Vercel/production DB access or mutation
- Card 04 work

Candidate task must stop at exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **OWNER-APPROVED MASTER EXISTS; candidate intake / QA next**
- Card 04 `rune-of-curse-breaking` — not started
