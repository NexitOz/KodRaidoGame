# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **MASTER-ART BRIEF PLANNING ACTIVE**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `5a102f93b977542806304577d5c0548265b3ab72`
- **Current task type:** planning / docs only
- **Open blocker:** NONE
- **Production operation authorized:** NO

## Card 02 — COMPLETE END TO END

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED, repository-integrated and live in production.

Production sync evidence:

- workflow run: `33320281456` (run 8)
- job: `99280920592`
- conclusion: `success`
- executed: 2026-08-30 15:39:56 → 15:40:41 UTC
- dispatch ref: `main` @ `2cd0a64ab8ba746a766ecd26b2f92bcc99e6d29f`
- immutable source / PR #37 merge: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- target rows: 12
- rows changed: **1**, only `seal-of-the-curse`
- PRE-WRITE: `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=11/12`
- APPLY: `TRANSACTION_STARTED=YES`, `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=12`, `SOURCE_OF_TRUTH_MATCH=12/12`, `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE: `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=12/12`
- Railway production scope and read-only connectivity gates: PASS
- artwork files: `12/12`
- `SYNC-12-CARD-ART-PRODUCTION`: **CONSUMED**

Durable execution report:

`docs/agent-reports/2026-08-30-art-pack-03-card-02-production-sync-executed.md`

Approved Card 02 master integrity remains:

- candidate: `assets/seal-of-the-curse-candidate-v2` @ `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- size: `326508`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- 1024×1536, RIFF total 326508, FourCC plain `VP8 `, full decode PASS

The two owner-accepted Card 02 caveats remain historical/non-blocking: the blurred interior arcade is more descriptive than the near-abstract brief target, and the dark unlit pommel star relief remains visually neutral.

## Card 03 — canonical facts

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

## Card 03 — current planning objective

Create and review a master-art brief before any generation:

`docs/art-review/warden-of-the-barrier-master-art-brief.md`

Required design problem: communicate a defensive RARE CHARACTER whose immediate identity is self-barrier / Shield and whose high-Resonance authority expands into team-wide cleansing, while staying visually distinct from COMMON `acolyte-of-the-white-rune` and LEGENDARY `high-warden-of-the-white-rune`.

Carry forward these lessons:

1. Use the stricter working safe zone around y≈260–1280 so the binding 4:5 crop has real clearance.
2. State the environment information ceiling explicitly; do not repeat Card 02's brief ambiguity.
3. Because Card 03 is a CHARACTER, later QA includes `CreatureSlot` as well as CardView, CardDetailDrawer, HandCardPreview, admin review, mobile 390px, 92px and grayscale.
4. Preserve PURIFICATION's white/silver/ivory, clean intact armor, bright cold light and material-bound rune language without making Card 03 a second Legendary flagship.

## Current hard gate

This task is **planning only**.

Do not:

- generate Card 03 art
- create/transport candidate binary art
- change canonical card/gameplay data
- change production artwork fields
- modify or dispatch production sync
- access production infrastructure
- begin Card 04

Final task status must be either:

- **READY FOR OWNER CONCEPT / BRIEF APPROVAL**
- **BLOCKED — OWNER DECISION REQUIRED**

No Card 03 image generation until explicit owner approval of the brief/concept.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **CURRENT: master-art brief planning**
- Card 04 `rune-of-curse-breaking` — not started
