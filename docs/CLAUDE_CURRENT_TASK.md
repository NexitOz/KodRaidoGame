# CURRENT TASK — SHADOW Card 04 concept review

## Goal

Prepare the next SHADOW Card 04 visual concept for owner review only.

Canonical card: **Рунный Страж Эха** — `Rune`, `Epic`, cost `3`. Its reactive gameplay identity is: when any ally dies, summon an **Эхо-Тень 1/1**. Use the repository card definitions, Art Pack 02, art bible, and already approved SHADOW cards as the source of truth.

## Art direction

Create a strong silhouette break from the existing humanoid SHADOW cards.

Core concept:

- ancient obsidian rune / ritual stone seal / vertical idol-artifact
- faceless guardian mask carved into the stone; it is part of the artifact, not a living character
- cold violet-silver, ash and dead-blue light inside the fractures
- faint silhouettes of fallen shadows within the cracks
- a small Echo-Shadow visibly being summoned from the lower seal
- underground gothic temple atmosphere with stairs, chains, dust and dim funerary lights

The image should visually communicate:

`ally dies -> seal activates -> Echo-Shadow is summoned`

Keep the established cinematic, realistic production direction. Avoid bright orange, dominant red, fire-heavy treatment, another warrior silhouette, anime/cartoon styling, or generic MMO dark fantasy.

## Scope

**CONCEPT REVIEW ONLY.**

Do not modify code, gameplay data, seed data, assets, database, workflows, or card files.
Do not create a branch or PR.
Do not generate or commit an image yet.

The required GitHub handoff report is the **only permitted repository write** for this task.

## Delivery

Return only a concise proposed visual concept for owner review, covering:

- composition / silhouette
- palette / lighting
- mechanic readability
- one short generation-prompt core

Then create and push the repository handoff report at:

`docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`

Use the repository handoff protocol in `CLAUDE.md`. The report must include:

- task and final status
- branch and exact final HEAD SHA
- exact changed files (`handoff report only`; no implementation files)
- repository sources reviewed
- the proposed Card 04 visual concept
- verification that no code, gameplay data, assets, database or workflows were changed
- recommended next action: wait for owner concept approval before generating or implementing art

After pushing the report, fetch it back from GitHub and verify that it exists. The task is not complete until this verification passes.

In chat, keep the reply short: give the concept, then the report path and final HEAD SHA. Stop and wait for owner approval before any implementation or asset work.
