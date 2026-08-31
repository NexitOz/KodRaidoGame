# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **v2 CANDIDATE LANDED + FULL QA DONE — READY FOR OWNER VISUAL APPROVAL**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `ad138e4fcadbd30e86d30881a1aa4c9f59b00ca8`
- **Current task type:** exact binary intake + candidate QA only
- **Latest report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`
- **Latest task-result commit:** `b4f35bb379d82584f0e0f28c92f3776d332752a8` (candidate branch head)
- **Candidate branch:** `assets/warden-of-the-barrier-candidate-v2`
- **Open blocker:** **OWNER VISUAL APPROVAL** — two judgement items are named in the report: a single background column, and the overall high-key value
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

**The exact v2 bytes are now landed and verified. Do not re-transport.**

- candidate branch head: `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- `art-source/warden-of-the-barrier.webp` — size `193038`, SHA-256 `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`, blob `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- all six intake gates and full decode: PASS, re-verified independently of the transport job

Transport route used: a GitHub Actions runner, which is not behind the agent session's GitHub-only
egress allowlist (the share URL fails from the session with proxy `CONNECT 403`, zero bytes). Runs:
`33421598434` failed on a wrong filename gate, `33421738162` succeeded.

Temporary transport branch `transport/card03-v2-github-actions` carries a `contents: write` workflow.
It **must not be merged into `main`** and can be deleted once Card 03 is promoted.

The old `assets/warden-of-the-barrier-candidate` branch still holds the **rejected v1** binary
(`284002` bytes) plus its `INTAKE_PENDING` marker. Superseded — delete it so no later agent picks up
the wrong file.

## Why v2 exists — all automatic rejects re-verified as CLEARED

The previous candidate was rejected because it violated approved-brief automatic rejects. v2 was
generated specifically to remove those failures. Each was measured against v2 rather than assumed:

- no cathedral / spires / crowd / monumental architecture — CLEARED (a single classical column remains; see owner judgement item below)
- no star / compass / heraldic boss — CLEARED
- no broad gold ornamentation — CLEARED, measured `0.01%` against a 3% limit
- manufactured planted ward-screen with visible ground anchor — CLEARED, strongly: bolted spike into stone, base plate, displaced rubble, hinges and latch
- restrained background that collapses at thumbnail size — CLEARED
- no baked lettering / rune text / logo / UI — CLEARED, inspected at full resolution

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

**All nine surfaces were captured** against the real running stack (local Postgres + Redis + API +
Next.js, real 41-card roster). No horizontal overflow at 1440 or 390 px. Head safe at every crop
including the binding 4:5; the ground anchor survives it.

Validation green: prettier, typecheck, lint, build, 32/32 web tests.

Thumbnail numbers, measured against the whole shipped set: edge density `29.82` is mid-pack (9th of
13) and the high-key profile (spread `122`, p5 `109`) is the closest match in the set to
`acolyte-of-the-white-rune` (`129` / `101`), the other PURIFICATION character already live. Neither
is a deviation — an earlier reading that called them one was measured against too small a reference
set and is corrected in the report.

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

It ended at **READY FOR OWNER VISUAL APPROVAL**. Nothing was promoted.

## Owner decision required

Two judgement items, both documented with evidence in the report:

1. a single classical column remains in the background — no cathedral/spires/crowd, but the scene is
   not empty; does this sit inside the brief's "hard information ceiling"?
2. this is the palest card in the set (p5 `109`, highest of thirteen) — consistent with Card 01, but
   worth a deliberate look beside the shipped PURIFICATION art

On approval, promotion is a separate authorized task: copy to `apps/web/public/art/cards/`, add
`reviewArtworkUrl` to the review row, add the Card 03 seed entry with `rightsStatus: 'owned'`, extend
the controlled sync 12 → 13, and dispatch it.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **v2 candidate landed + full nine-surface QA done; READY FOR OWNER VISUAL APPROVAL**, not promoted
- Card 04 `rune-of-curse-breaking` — not started
