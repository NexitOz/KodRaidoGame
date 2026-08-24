# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

Any assistant or coding agent continuing this project should read this file first, then follow the referenced task/report/PR. GitHub is the source of truth; chat history is secondary.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent bootstrap rules:** `CLAUDE.md`
- **Bridge rules commit:** `2a08a984607f0e5a73ed023b10a804f150630abd`
- **Protocol:** every agent reads this file first; every completed task updates this file last and verifies it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 concept
- **Status:** BLOCKED — concept approved, but the master art cannot be generated inside the Claude Code session. Awaiting an owner-supplied master committed to a branch.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** `docs/agent-reports/2026-08-24-shadow-card-04-generation-blocked.md`
- **Approved concept + amended prompt core:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Latest task-result commit:** `39c07b5b297e0487796b78ca6660c4e6586f06de`
- **Branch:** `main`
- **PR:** none
- **Implementation changes in latest project task:** none
- **Repository write in latest project task:** handoff report + this state file only. No art, no branch, no PR.

## Latest result

The owner **approved** the SHADOW Card 04 visual concept on 2026-08-24, with one amendment: reintroduce a **minimal crimson accent**. Canonical card is `rune-of-the-echoing-dusk` / «Рунный Страж Эха» (`RUNE`, `EPIC`, cost 3, ally death -> summon `shadow-echo-token` 1/1).

Locked direction: a non-humanoid ancient obsidian ritual stele with a faceless guardian mask carved into the stone at ~40% frame height, cold violet-silver rim, dead-blue light inside the fractures holding trapped fallen-shadow silhouettes, and one small unlit grey Echo-Shadow rising from the lower seal. The composition is deliberately built to avoid silhouette collision with the three approved SHADOW cards, `whisper-of-the-forgotten` in particular.

Locked palette amendment: crimson (`raido.red`/`redGlow`) confined to the mask's carved glyph and eye-slits plus a thin bleed down the rune channel to the base seal. Nothing else warms — fractures stay dead-blue, ash grey, funerary flames pale and cold, Echo-Shadow unlit. This keeps the card inside `docs/art-bible-01.md`'s SHADOW spec, puts the family accent on the only element that survives the binding 92 px `CardView size="xs"` surface, and splits the palette along the mechanic (dead-blue = the held dead, crimson = the trigger firing).

The amended generation-prompt core is in the handoff report under "Owner decision".

## Open decisions / blockers

1. ~~Owner must approve or revise the Card 04 visual concept.~~ **RESOLVED** — approved 2026-08-24 with the minimal-crimson amendment.
2. ~~The concept drops crimson entirely; family-palette precedent needing an owner decision.~~ **RESOLVED** — crimson reinstated, minimally and confined to the mask glyph, eye-slits and connecting rune channel.
3. `/admin/art-review` still assumes CHARACTER targets for one review panel (`FlagshipRow` builds a `CreatureSlot` stubUnit) and needs a non-CHARACTER path before a RUNE can be reviewed cleanly. This is now a prerequisite for the review step of the next task, not a blocked item.
4. **BLOCKING NOW.** Image generation is not available in the Claude Code session — re-verified 2026-08-24 when the generation task was attempted, not merely carried forward. The master must be produced by the owner and transported **by committing it to a branch**; chat image attachments are re-encoded in transit and ZIP attachments never reach the container, both established during Card 03. Do not re-issue "generate the Card 04 art" to a Claude Code session: it will block again at the same point. If another agent in the bridge (ChatGPT, Codex, or a session with image tooling) can generate, that agent should produce the master and commit it to a branch, after which a Claude Code session can complete verification, review and promotion unaided.

## Recommended next action

Supply the Card 04 master. Generate it against the amended prompt core in `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md` § "Owner decision" — outside this session, since Claude Code cannot generate images — then:

1. Commit the `.webp` to a branch (not a chat attachment) and record its sha256, byte size and RIFF-declared length.
2. Verify integrity: sha256, byte size, RIFF total == file size, dimensions 1024×1536.
3. Add a non-CHARACTER path to `/admin/art-review` so a RUNE renders without the meaningless `CreatureSlot` panel.
4. Review the live surfaces: Collection/hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9. `CreatureSlot` is **not** a surface for a RUNE — `RuneZone` renders a 24 px glyph, never the artwork.
5. Only on PASS: promote `artworkUrl` / `rightsStatus: 'owned'` in `seed.ts` (Keeper-only-style, single card), update `docs/art-pack-02.md` to Card 04 FINAL APPROVED, and extend the production sync 9 -> 10.

Do not promote or sync Card 04 art before the surface review passes.

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
