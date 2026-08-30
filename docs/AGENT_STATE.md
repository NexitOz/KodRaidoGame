# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **BRIEF APPROVED, GENERATION PACKAGE READY — AWAITING EXTERNAL GENERATION**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `5a102f93b977542806304577d5c0548265b3ab72`
- **Current task type:** planning / docs only
- **Card 03 brief:** `docs/art-review/warden-of-the-barrier-master-art-brief.md` — **APPROVED 2026-08-30**
- **Card 03 generation package:** `docs/art-review/warden-of-the-barrier-generation-package.md`
- **Latest handoff:** `docs/agent-reports/2026-08-30-art-pack-03-card-03-generation-package.md`
- **Prior handoff:** `docs/agent-reports/2026-08-30-art-pack-03-card-03-master-art-brief.md`
- **Latest task-result commit:** `675f3b9`
- **Open blocker:** **external image generation** — Claude Code cannot generate images in this session
- **Master-art candidate generation authorized:** **YES**, against brief §13
- **Integration / promotion authorized:** NO
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

## Card 03 — BRIEF APPROVED, GENERATION PACKAGE READY

Brief: `docs/art-review/warden-of-the-barrier-master-art-brief.md` — **APPROVED by owner 2026-08-30**
Package: `docs/art-review/warden-of-the-barrier-generation-package.md`
Report: `docs/agent-reports/2026-08-30-art-pack-03-card-03-generation-package.md`

**No image exists yet.** Claude Code has no image-generation tool in this session and the
environment's egress is GitHub-only, so — exactly as for Cards 01 and 02 — the master must be
produced externally and landed by transport.

### Owner decisions — all four resolved

| #   | Decision       | Resolution                                                                   |
| --- | -------------- | ---------------------------------------------------------------------------- |
| 1   | Barrier device | **planted ward-screen** — she plants, she does not carry                     |
| 2   | Environment    | **restrained readable, hard ceiling** (brief §8)                             |
| 3   | Head           | **bare**, uncrowned, unhelmed                                                |
| 4   | House style    | **CHANGED — cinematic realistic premium CCG with a subtle painterly finish** |

**#4 moved and matters.** Cards 01 and 02 both shipped noticeably more photographic; the owner has
pulled Art Pack 03 back toward painterly. Brief §13's style clause now demands visible brushwork and
painted edges, and the negative prompt leads with `photograph`, `photorealistic`, `photobash`,
`3D render`, `CGI`.

**Card 03 will therefore not match its two pack-mates in rendering. That is intended and must not be
logged as a QA defect.** The faction's material language is unchanged — white/silver/ivory, clean
pressed intact armor, bright near-shadowless cold light, engraved material-bound rune magic — and
brief §11's twenty-three reject conditions stand untouched.

### The locked concept, unchanged

`docs/art-bible-01.md` records the LEGENDARY flagship as dual-wielding **a large rune-engraved round
shield with a compass/star emblem**, so the faction's shield-bearer is the Legendary. Card 03
therefore **plants a barrier rather than carrying a shield**: a hinged, segmented white-steel
ward-screen spiked into the ground, one gauntleted hand still on its top rail, its lit rune channel
**running off both frame edges** to imply the same barrier in front of every ally without drawing a
flagship-reserved crowd.

Engine facts behind it: `SHIELD` is a **one-shot absorb** (`effects/primitives.ts` strips the status
and emits `SHIELD_CONSUMED`, negating the entire next damage instance, then it is gone), so the ward
is raised once and spent once, never a maintained forcefield. `CLEANSE` strips `CURSE` + `SILENCED`.

### Canonical names for the coming candidate

| Thing                             | Path / name                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| Candidate branch                  | `assets/warden-of-the-barrier-candidate` — **not yet created**     |
| Path inside candidate branch      | `art-source/warden-of-the-barrier.webp`                            |
| Temporary transport branch        | `transport/card03-github-actions` — never merged into `main`       |
| Local review staging (gitignored) | `apps/web/public/art-review-candidates/warden-of-the-barrier.webp` |
| Production path — later, not now  | `apps/web/public/art/cards/warden-of-the-barrier.webp`             |

The candidate branch is **deliberately not pre-created**: an empty branch would be
indistinguishable from a real candidate to a later agent, and this project has already lost cycles
to branches that looked real and were not. The transport run creates it.

### Integrity gate — values that cannot be pre-stated

Card 03's byte size, SHA-256 and Git blob SHA **do not exist yet** and must not be invented. Writing
placeholders would risk gating a good file against fictional numbers — the failure mode that nearly
rejected a correct Card 02 file against a stale `313964`.

Knowable a priori: **1024 × 1536**, plain **`VP8 `** fourcc, RIFF total equals actual size, full
decode PASS, no text/watermark/frame.

Recorded at generation on the producing machine, then enforced at three checkpoints — on the runner
before git, from the committed object before push (`git cat-file -s`), and from the **fetched remote
branch** after push.

### QA plan — nine surfaces, not eight

Card 03 is a **CHARACTER**, so unlike Card 02 it occupies a Battlefield board slot and
**`CreatureSlot` is a real review surface.** Full list: raw 2:3, `CardView` 3:4, **`CreatureSlot`
3:4**, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `/admin/art-review` desktop, `/admin/art-review`
390 px, 92 px thumbnail, 92 px grayscale.

Measured thresholds carried from the Card 02 pass: 92 px edge density **24–28** (between measured
Common 20.95 and Legendary 31.85), grayscale spread p5–p95 **≥ 140** with p5 **≥ ~25**, gold **≤ 3%**,
crimson/violet/magenta effectively zero, background collapsing to a flat pale field at 92 px, and no
horizontal overflow at 390 px.

### Next action

Generate externally against package §1, export to §2's contract, land via §3's transport, and
publish the size and SHA-256 measured on the producing machine. Then hand back for the §5 QA pass,
ending at **READY FOR OWNER VISUAL APPROVAL** or **REJECTED / BLOCKED**.

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
- Card 03 `warden-of-the-barrier` — **brief APPROVED; generation package ready; awaiting external generation**; no art exists yet
- Card 04 `rune-of-curse-breaking` — not started
