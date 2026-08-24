# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

Any assistant or coding agent continuing this project should read this file first, then follow the referenced task/report/PR. GitHub is the source of truth; chat history is secondary.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent bootstrap rules:** `CLAUDE.md`
- **Bridge rules commit:** `2a08a984607f0e5a73ed023b10a804f150630abd`
- **Protocol:** every agent reads this file first; every completed task updates this file last and verifies it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 concept review
- **Status:** COMPLETE — awaiting owner approval
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Latest task-result commit:** `f0abac90fe6db16824e92daab928295c0c7cd45a`
- **Branch:** `main`
- **PR:** none
- **Implementation changes in latest project task:** none
- **Repository write in latest project task:** handoff report only

## Latest result

Claude completed the visual concept review for SHADOW Card 04, canonical card `rune-of-the-echoing-dusk` / «Рунный Страж Эха» (`RUNE`, `EPIC`, cost 3, ally death -> summon `shadow-echo-token` 1/1).

The proposed direction is a non-humanoid ancient obsidian ritual stele / seal with a faceless guardian mask carved into the stone, cold violet-silver and dead-blue fracture light, trapped fallen-shadow silhouettes, and one small Echo-Shadow being summoned from the lower seal. The composition is intentionally designed to avoid silhouette collision with the three already approved SHADOW cards.

## Open decisions / blockers

1. Owner must approve or revise the Card 04 visual concept before any image generation or implementation.
2. The concept intentionally drops crimson from the illustration itself; this is a SHADOW family-palette precedent that should be an explicit owner decision.
3. `/admin/art-review` currently assumes CHARACTER targets for one review panel and needs a non-CHARACTER path before a RUNE can be reviewed cleanly. Do not change it until the owner approves moving from concept to implementation.

## Recommended next action

Owner reviews the latest handoff report and either:

- approves the concept, then art generation becomes the next task; or
- requests a focused revision, which becomes the next concept-review task.

Do not generate, integrate, sync, or promote Card 04 art before owner approval.

## Reader protocol

When continuing work:

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read the latest handoff report or PR referenced above.
4. Resolve current `main` HEAD directly from GitHub rather than trusting a stale chat message.
5. Only then decide the next action.

## Writer protocol

After every completed task, the acting agent must update this file as the final handoff pointer with:

- phase / task
- status
- current task path
- latest report path or PR number
- latest task-result commit SHA
- branch / PR
- exact scope of changes
- open blockers / decisions
- recommended next action

Then fetch this file back from GitHub and verify the update exists before declaring the task complete.
