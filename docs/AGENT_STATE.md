# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **INTEGRATED — PR #37 OPEN, AWAITING REPOSITORY REVIEW. NOT MERGED. PRODUCTION SYNC NOT AUTHORIZED.**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `1f428c16ee5ac41d7683786f2983d9b6017d26b7`
- **Integration PR:** **#37** — `claude/integrate-seal-of-the-curse-art`
- **Latest task-result commit:** `6b668d8ba73ede0899f4cba3e5362fd74f10f2b1` (integration head)
- **Integration base SHA:** `2e1884f27c47da933d27d139814b3ad5ff495c51`
- **Final report:** `## AGENT HANDOFF — FINAL REPORT` comment on PR #37
- **Owner approval record:** `docs/agent-reports/2026-08-30-art-pack-03-card-02-owner-approval.md` @ `81f59ae65d266e07546306af938c1e835b1e884e`
- **Visual-QA handoff:** `docs/agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md`
- **Superseded review-only branch:** `claude/card-02-review-support` @ `45bdb37` — its candidate registration is superseded by the production-path entry in PR #37; do not merge it
- **Branch for current coordination:** `main`
- **Open blocker:** PR #37 needs repository review and merge. **After merge the sync source pin MUST be repointed** — see below.

## Card 02 — INTEGRATION COMPLETE, PR #37 OPEN

Merged: **NO** · Production sync dispatched: **NO** · Production DB mutated: **NO**

Changed files (6): the new `apps/web/public/art/cards/seal-of-the-curse.webp`; `seed.ts` (+3, Card 02
only); `apps/web/src/app/admin/art-review/page.tsx` (+8); `sync-production-card-art.ts` (+1 slug and
pin comment); `.github/workflows/production-card-art-sync.yml` (11 → 12); `docs/art-pack-03.md`.

**Production artwork is byte-identical to the approved candidate.** `cmp` clean against
`assets/seal-of-the-curse-candidate-v2` @ `6740569`; 326508 bytes; SHA-256 `699db6b7…`; Git blob SHA
`95940017577f7152a28bf76122912c37e548c7e0` unchanged through hash-object, commit, push and re-fetch;
RIFF total 326508; plain `VP8 `; 1024×1536; full decode PASS.

**Production-path QA passed on the real stack** across all nine surfaces including the logged-in
Collection. Candidate isolation is gone and proven: the staged gitignored file was deleted, the only
Card 02 request is `/art/cards/seal-of-the-curse.webp` → 200, zero requests to
`/art-review-candidates/`, and the badges read `rightsStatus: owned` / `PRODUCTION ASSET — REVIEW`.
`CreatureSlot` correctly absent (EVENT keeps the four-panel path). No 390 px overflow. **No new
regression.** Both accepted caveats persist unchanged and remain non-blocking.

**Validation:** `git diff --check` clean; lint, typecheck, tests and production build PASS for web
and game-server (32 + 156 tests). Prettier reformatted `docs/art-pack-03.md`; `seed.ts` and
`sync-production-card-art.ts` remain flagged as **pre-existing drift on `main`** — verified at `HEAD`,
and Prettier would not touch any line the PR adds, so they were left rather than reformatting
unrelated code.

### Sync 11 → 12 — prepared, fail-closed, NOT dispatched

Script and workflow both carry 12 unique slugs and the lists are identical;
`ARTWORK_FILES_PRESENT=12/12`; seed source entries 12/12 with `/art/cards/<slug>.webp` + `owned`;
PRE-WRITE / APPLY / POST-WRITE assertions updated; new confirmation string
`SYNC-12-CARD-ART-PRODUCTION`.

**The immutable source pin is deliberately stale** at `92cc662f…` in both the workflow and
`REQUIRED_SOURCE_COMMIT`. A twelve-card run therefore aborts in `deriveDesiredValues` with
`Missing explicit production artwork fields in seed.ts for seal-of-the-curse` — verified by running
the script's non-mutating `--check`, which failed **before any database connection was attempted**.

**AFTER PR #37 MERGES:** repoint `REQUIRED_SOURCE_COMMIT` in
`apps/game-server/scripts/sync-production-card-art.ts` and both pins in
`.github/workflows/production-card-art-sync.yml` to the merge commit. Only then can a sync run, and
only with a fresh owner confirmation of `SYNC-12-CARD-ART-PRODUCTION`.

## Card 01 — COMPLETE END TO END

`acolyte-of-the-white-rune` / «Послушник Белой Руны» is FINAL APPROVED and live in production.

- integration source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- production sync run: `33091769787`
- final source of truth: `11/11`
- `SYNC-11-CARD-ART-PRODUCTION`: **CONSUMED**

No production operation is currently authorized.

## Card 02 — canonical facts

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- faction: PURIFICATION
- type: EVENT
- rarity: RARE
- cost: 2
- effect: apply Curse to a chosen enemy; a cursed enemy cannot attack

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse = binding/restraint, not corruption
- rigid white/silver rune clamp locks hostile weapon hand to guard/hilt
- no visible caster
- cinematic realistic / semi-realistic premium CCG
- no SHADOW/VEIL corruption palette or spell-blast language

## Card 02 — approved master integrity

Use only the exact candidate-v2:

- branch: `assets/seal-of-the-curse-candidate-v2`
- commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- path: `art-source/seal-of-the-curse.webp`
- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- full decode: PASS

The old branch `assets/seal-of-the-curse-candidate` is rejected 27-byte evidence and must never be reused or repaired.

## Card 02 — full real visual QA PASS

Completed 2026-08-30 on the real application stack.

All required surfaces PASS:

- raw 2:3
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `/admin/art-review` desktop
- `/admin/art-review` at 390 px
- 92 px thumbnail
- 92 px grayscale/value-only

EVENT correctly excludes `CreatureSlot`. No 390 px horizontal overflow. Candidate isolation was proven via live API, network trace, and page badges. All twenty automatic-reject conditions in the locked brief were checked and cleared.

92 px hierarchy passes independently of the rarity frame:

`COMMON acolyte 20.95 < RARE seal 23.73 < LEGENDARY high warden 31.85`

## Card 02 — FINAL OWNER VISUAL APPROVAL

The owner approved Card 02 for integration on 2026-08-30.

Durable record:

`docs/agent-reports/2026-08-30-art-pack-03-card-02-owner-approval.md`

Two QA caveats are explicitly accepted as non-blocking:

1. The pale blurred background describes an interior arcade more than the brief's near-abstract environment target. It remains low-contrast and does not compete with the seal.
2. The enemy weapon pommel carries a dark unlit star / compass-rose relief. It has no COSMIC colour/glow/iridescence language and disappears at 92 px.

Do not regenerate or alter the accepted artwork. Do not reopen these caveats as blockers unless a new regression appears after production-path integration.

## Superseded — the integration task, now complete

Executed `docs/CLAUDE_CURRENT_TASK.md`; result is PR #37 above.

Required outcome:

1. integrate the exact approved bytes to `apps/web/public/art/cards/seal-of-the-curse.webp`
2. update only Card 02 `artworkUrl` + `rightsStatus: owned`
3. preserve correct EVENT `/admin/art-review` behavior
4. repeat real visual QA against the production path with the candidate slot removed
5. mark Card 02 FINAL APPROVED in Art Pack 03 docs
6. extend controlled production card-art sync **11 → 12** using the existing fail-closed immutable-source pattern
7. use new future confirmation string `SYNC-12-CARD-ART-PRODUCTION`
8. run full repository gates and non-mutating 12-card preflight
9. open a narrow integration PR
10. leave `## AGENT HANDOFF — FINAL REPORT`
11. update this file last and verify it back from GitHub
12. stop for repository review

## Production hard gate

**No production operation is authorized.**

Do not:

- merge the Card 02 integration PR without repository review
- dispatch any production workflow
- mutate production DB
- use the consumed `SYNC-11-CARD-ART-PRODUCTION`
- repoint the final 12-card immutable source before the new integration merge commit exists
- begin Card 03

After the integration PR is merged, the 12-card workflow/script immutable source must be repointed to that merge commit. A production sync can run only after a new explicit owner confirmation using the then-current exact confirmation string `SYNC-12-CARD-ART-PRODUCTION`.

## Art binary transport policy — proven agent-owned pipeline

The user must not be used as the standard manual file courier.

For future generated art when Claude Code has GitHub-only egress:

1. ChatGPT keeps or uploads the exact master through a provider with a machine-readable file API.
2. A temporary GitHub Actions transport branch fetches the raw provider object using a GitHub-hosted runner.
3. The runner hard-gates byte size + SHA-256 + Git blob SHA + format + dimensions + full decode before git.
4. From fresh `main`, the runner creates the candidate branch, commits exact bytes through normal git, pushes, fetches the remote branch back, and re-verifies remote bytes.
5. Transport/probe workflows remain isolated on the temporary transport branch and are never merged into `main`.
6. Claude Code performs QA only after the candidate is already inside GitHub and independently re-verifies it.
7. Manual owner upload is fallback-only.

Never use GitHub Contents-API binary upload/base64-in-JSON for generated masters; this project has already observed binary truncation through that route.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — **INTEGRATED in PR #37, awaiting repository review**; not merged, not synced
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
