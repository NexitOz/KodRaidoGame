# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **CANDIDATE INTAKE BLOCKED — APPROVED BYTES NEVER TRANSPORTED**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `1f90abbf08f3b014d67695aa85fd6c845926e1ad`
- **Latest report:** `docs/agent-reports/2026-08-30-art-pack-03-card-03-candidate-not-transported.md`
- **Latest task-result commit:** `564e8ea`
- **Open blocker:** **OWNER ACTION REQUIRED** — the owner-approved WebP has never reached any location this environment can read. It was not attached to the task, no transport URL exists in this file or in `docs/CLAUDE_CURRENT_TASK.md`, and the candidate branch carries only an intake marker. Intake cannot start until the bytes are on the branch.
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

The approved image exists **in the owner's possession**. It has never existed inside this repository.
Both statements are true at once and must not be collapsed into either "no image exists" or
"the image is available to the agent".

## Candidate contract — CURRENT REALITY

Expected real candidate branch:

`assets/warden-of-the-barrier-candidate`

Expected asset path:

`art-source/warden-of-the-barrier.webp`

Local review staging:

`apps/web/public/art-review-candidates/warden-of-the-barrier.webp`

**Warning — the candidate branch already exists and is a decoy.** It sits at
`f39b34d1f245e223c86a7d9f6b440eea1dbef90b` and its only difference from `main` is a single added
file, `art-source/warden-of-the-barrier.INTAKE_PENDING.md`. It contains **no artwork**.
`art-source/warden-of-the-barrier.webp` does not exist on it.

Do not treat the branch's existence as evidence that intake started. Inspect the tree, not the
branch name. The `INTAKE_PENDING` marker must survive until the real bytes land, and must be deleted
in the same commit that lands them.

## How the bytes can actually arrive

Egress from the agent container is a **GitHub-only allowlist** (re-measured 2026-08-30: `we.tl`,
`wetransfer.com`, `firestorage.ai` all denied; `api.github.com` reachable). Viable transports, best
first:

1. **GitHub web UI upload** — on the candidate branch, *Add file → Upload files*. Proven byte-exact
   for Card 01 (`69e176e`). Sends multipart binary.
2. **GitHub Release asset** — attach the WebP to a draft release; `objects.githubusercontent.com` is
   reachable from the container.
3. **Any public URL fetched by a GitHub Actions runner** — the runner has broader egress than the
   container. This is how Card 02's master arrived (run `33117588154`).

Never use the GitHub Contents API / base64-in-JSON path. It silently truncated three separate
Card 02 candidates (14,999 / 15,042 / 27 bytes).

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

Last dispatch stopped at **REJECTED / BLOCKED** (no source bytes). No QA was run and nothing was
fabricated, which is the correct outcome, not a failure to be retried differently.

## Recommended next action

Owner lands `art-source/warden-of-the-barrier.webp` on `assets/warden-of-the-barrier-candidate`
using one of the three transports above, then re-dispatches
`docs/CLAUDE_CURRENT_TASK.md` unchanged. Intake will verify the six gates, delete the
`INTAKE_PENDING` marker, stage to the gitignored review path, and run all nine surfaces.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — brief APPROVED, master APPROVED by owner, but **bytes never transported into the repository; candidate intake BLOCKED on owner upload**
- Card 04 `rune-of-curse-breaking` — not started
